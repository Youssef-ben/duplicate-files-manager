import { spawn, ChildProcess } from 'child_process'
import { getCliPath } from './path'
import type { CliRunArgs, CliEvent } from './types'

const procs = new Map<string, ChildProcess>()

export function runCli(args: CliRunArgs, onEvent: (e: CliEvent) => void): void {
  const flags: string[] = [
    args.sourceRoot,
    '--mode', args.mode,
    '--progress-format', 'json',
  ]
  if (args.dryRun)    flags.push('--dry-run')
  if (args.target)    flags.push('--target', args.target)
  if (args.direction) flags.push('--direction', args.direction)
  if (args.output)    flags.push('--output', args.output)
  if (args.input)     flags.push('--input', args.input)
  if (args.confirm)   flags.push('--confirm')

  const proc = spawn(getCliPath(), flags)
  procs.set(args.runId, proc)

  let buf = ''
  proc.stdout.on('data', chunk => {
    buf += chunk.toString()
    const lines = buf.split('\n')
    buf = lines.pop() ?? ''
    for (const line of lines) {
      if (!line.trim()) continue
      try { onEvent(JSON.parse(line)) } catch { /* ignore non-JSON lines */ }
    }
  })

  proc.on('close', () => procs.delete(args.runId))
}

export function cancelCli(runId: string): void {
  procs.get(runId)?.kill()
  procs.delete(runId)
}
