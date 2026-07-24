/**
 * Downloads the library-organizer CLI from GitHub Releases into resources/.
 *
 * Expected release asset names (publish these on each release):
 * - Windows x64: library-organizer-cli-win32-x64.exe
 * - Windows ia32: library-organizer-cli-win32-ia32.exe
 * - macOS x64: library-organizer-cli-darwin-x64
 * - macOS arm64: library-organizer-cli-darwin-arm64
 * - Linux x64: library-organizer-cli-linux-x64
 * - Linux arm64: library-organizer-cli-linux-arm64
 *
 * Fallback: if only library-organizer-cli.exe exists (legacy), it is used on win32.
 *
 * Run from repository root (yarn postinstall).
 */
import { downloadArtifact } from '@electron/get';
import { chmod, copyFile, mkdir } from 'node:fs/promises';
import path from 'node:path';

const OWNER_REPO = 'Youssef-ben/library-organizer-cli';
const RELEASE_MIRROR = `https://github.com/${OWNER_REPO}/releases/download/`;

type GitHubAsset = { name: string };
type GitHubRelease = {
  tag_name: string;
  assets: GitHubAsset[];
};

function log(msg: string): void {
  console.log(`[download-cli] ${msg}`);
}

function err(msg: string): void {
  console.error(`[download-cli] ${msg}`);
}

function normalizeTag(version: string): string {
  const v = version.trim();
  return v.startsWith('v') ? v : `v${v}`;
}

function semverFromTag(tag: string): string {
  return tag.replace(/^v/i, '');
}

function candidateRemoteNames(platform: NodeJS.Platform, arch: string): string[] {
  const a = arch === 'x32' ? 'ia32' : arch;
  if (platform === 'win32') {
    return [`library-organizer-cli-win32-${a}.exe`, 'library-organizer-cli.exe'];
  }
  if (platform === 'darwin') {
    return [`library-organizer-cli-darwin-${a}`];
  }
  if (platform === 'linux') {
    return [`library-organizer-cli-linux-${a}`];
  }
  return [];
}

function pickAsset(
  assets: GitHubAsset[],
  candidates: string[],
  explicit?: string
): string | undefined {
  const names = new Set(assets.map((x) => x.name));
  if (explicit) {
    return names.has(explicit) ? explicit : undefined;
  }
  for (const c of candidates) {
    if (names.has(c)) return c;
  }
  return undefined;
}

async function fetchJson(url: string): Promise<GitHubRelease> {
  const res = await fetch(url, {
    headers: {
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28'
    }
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`GitHub API ${res.status} ${res.statusText} for ${url}\n${body.slice(0, 500)}`);
  }
  return (await res.json()) as GitHubRelease;
}

async function resolveRelease(): Promise<GitHubRelease> {
  const pinned = process.env.LIBRARY_ORGANIZER_CLI_VERSION?.trim();
  if (pinned) {
    const tag = normalizeTag(pinned);
    const url = `https://api.github.com/repos/${OWNER_REPO}/releases/tags/${encodeURIComponent(tag)}`;
    log(`Using pinned version: ${tag}`);
    return fetchJson(url);
  }
  const url = `https://api.github.com/repos/${OWNER_REPO}/releases/latest`;
  log('Fetching latest release from GitHub…');
  return fetchJson(url);
}

async function main(): Promise<void> {
  const repoRoot = process.cwd();
  const outDir =
    process.env.LIBRARY_ORGANIZER_CLI_RESOURCES_DIR?.trim() || path.join(repoRoot, 'resources');
  await mkdir(outDir, { recursive: true });

  const release = await resolveRelease();
  const tag = release.tag_name;
  const semver = semverFromTag(tag);
  const assets = release.assets;

  const explicitAsset = process.env.LIBRARY_ORGANIZER_CLI_ASSET_NAME?.trim();
  const candidates = candidateRemoteNames(process.platform, process.arch);
  const remoteName = pickAsset(assets, candidates, explicitAsset || undefined);

  if (!remoteName) {
    err(`No matching asset for ${process.platform}-${process.arch}.`);
    if (explicitAsset) {
      err(`LIBRARY_ORGANIZER_CLI_ASSET_NAME=${explicitAsset} not found on ${tag}.`);
    }
    err(`Tried: ${candidates.join(', ')}`);
    err(`Available on ${tag}: ${assets.map((a) => a.name).join(', ') || '(none)'}`);
    process.exit(1);
  }

  const localName =
    process.platform === 'win32' ? 'library-organizer-cli.exe' : 'library-organizer-cli';
  const dest = path.join(outDir, localName);

  log(`Release ${tag}: downloading "${remoteName}" → ${path.relative(repoRoot, dest)}`);

  const cachedPath = await downloadArtifact({
    isGeneric: true,
    version: semver,
    artifactName: remoteName,
    unsafelyDisableChecksums: true,
    mirrorOptions: {
      mirror: RELEASE_MIRROR,
      customDir: tag,
      customFilename: remoteName
    },
    downloadOptions: { quiet: true }
  });

  await copyFile(cachedPath, dest);

  if (process.platform !== 'win32') {
    await chmod(dest, 0o755);
  }

  log('Done.');
}

main().catch((e: unknown) => {
  err(e instanceof Error ? e.message : String(e));
  process.exit(1);
});
