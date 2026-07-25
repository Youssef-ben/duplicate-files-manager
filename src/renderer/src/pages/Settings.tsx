import { ThemeSwitcher } from '@components/themeSwitcher';
import { FolderIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useOpenFolderDialog } from '@hooks/useOpenFolderDialog';
import { IGNORED_FOLDERS_FILE } from '@shared/constants';
import { mergeCls } from '@utils/ClassNameMerger';
import { getFolderName } from '@utils/strings';
import { JSX, useCallback, useEffect, useState } from 'react';

interface SettingSectionProps {
  title: string;
  children: React.ReactNode;
}
export const SettingSection = ({ title, children }: SettingSectionProps): JSX.Element => {
  return (
    <div className="flex flex-row items-center gap-2 w-full border-t border-b border-outline-variant py-4">
      <div className="flex flex-col h-full items-start gap-2 w-1/4 justify-start">
        <span className="text-md font-semibold">{title}</span>
      </div>

      <div className="flex flex-col items-start gap-2 py-1 w-full">{children}</div>
    </div>
  );
};

export default function Settings(): JSX.Element {
  return (
    <div className="flex flex-col items-center gap-6 text-center w-full p-4">
      {/* Settings Title */}
      <div className="flex text-center flex-col items-start w-full">
        <span className="text-lg font-semibold">Application preferences</span>
        <span className="text-sm text-muted">
          Personalize your experience and make the app truly yours!
        </span>
      </div>

      <div className="flex flex-col items-left gap-0 w-full px-0">
        {/* Theme */}
        <SettingSection title="Theme">
          <ThemeSwitcher />
        </SettingSection>

        {/* Ignore Config */}
        <SettingSection title="Ignored Folders">
          <IgnoredFolderSection />
        </SettingSection>
      </div>
    </div>
  );
}

interface IgnoredFoldersConfig {
  folders: string[];
}

export const IgnoredFolderSection = (): JSX.Element => {
  const { openFolder } = useOpenFolderDialog();

  const [folders, setFolders] = useState<string[]>([]);

  useEffect(() => {
    const readConfig = async (): Promise<void> => {
      const data = await window.appApi.global.readJsonFile<IgnoredFoldersConfig>(
        IGNORED_FOLDERS_FILE,
        'settings'
      );
      setFolders(data.folders);
    };

    readConfig();
  }, []);

  const writeConfig = useCallback(
    async (folders: string[]): Promise<void> => {
      setFolders(folders);
      await window.appApi.global.writeJsonFile<IgnoredFoldersConfig>(
        IGNORED_FOLDERS_FILE,
        'settings',
        {
          folders
        }
      );
    },
    [setFolders]
  );

  const addFolder = useCallback(
    (folder: string): void => {
      folder = folder.trim().toLowerCase();

      if (!folder || folder.length === 0 || folders.includes(folder)) return;

      const newFolders = [...folders, folder];
      writeConfig(newFolders);
    },
    [folders, writeConfig]
  );

  const removeFolder = useCallback(
    (folder: string): void => {
      folder = folder.trim().toLowerCase();
      if (!folder || folder.length === 0 || !folders.includes(folder)) return;

      const newFolders = folders.filter((f) => f !== folder);
      writeConfig(newFolders);
    },
    [folders, writeConfig]
  );

  const handleOnFolderSelected = useCallback(async (): Promise<void> => {
    const path = await openFolder();
    if (!path) return;

    addFolder(getFolderName(path));
  }, [openFolder, addFolder]);

  return (
    <div className="flex flex-col items-start gap-3 w-full max-w-xl text-left">
      <p id="ignored-folders-hint" className="text-sm font-normal text-outline-dim leading-relaxed">
        Write down the name or browse to select the folder that you want to ignore .
      </p>
      <div className="relative w-full group text-outline-dim transition-colors focus-within:text-primary">
        <div
          onClick={handleOnFolderSelected}
          className="cursor-pointer absolute inset-y-0 left-0 flex items-center pl-2"
          aria-hidden
        >
          <FolderIcon className="size-5 shrink-0 " />
        </div>
        <input
          id="ignored-folder-name"
          type="text"
          placeholder="Enter the name or click the folder icon to browse to select the folder."
          aria-describedby="ignored-folders-hint"
          className={mergeCls(
            'w-full rounded-md border py-2 pl-10 pr-4 text-xs shadow-sm transition-[color,box-shadow,border-color] duration-200',
            'border-outline-variant bg-surface placeholder:text-outline-dim text-on-surface ',
            'focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 hover:border-outline'
          )}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              addFolder((e.target as HTMLInputElement).value);
              (e.target as HTMLInputElement).value = '';
            }
          }}
        />
      </div>
      <div className="flex flex-row items-start gap-2 w-full">
        {folders.map((folder, index) => (
          <span
            key={`${folder}-${index}`}
            className={mergeCls(
              'flex flex-row items-center justify-center gap-2 pl-2 py-1 pr-1 rounded-md text-xs',
              'border border-outline bg-primary-dim/30 hover:bg-primary-dim/10 text-on-primary-container'
            )}
          >
            {folder}
            <XMarkIcon
              onClick={() => removeFolder(folder)}
              className="size-3.5 stroke-2 shrink-0 cursor-pointer"
            />
          </span>
        ))}
      </div>
    </div>
  );
};
