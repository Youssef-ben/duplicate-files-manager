import { app, dialog } from 'electron';
import { autoUpdater } from 'electron-updater';

/**
 * Check GitHub Releases for a newer version (packaged builds only).
 * Downloads in the background, then prompts to restart and install.
 */
export function setupAutoUpdater(): void {
  if (!app.isPackaged) {
    return;
  }

  autoUpdater.autoDownload = true;
  autoUpdater.autoInstallOnAppQuit = true;

  autoUpdater.on('error', (error) => {
    console.error('[auto-updater]', error);
  });

  autoUpdater.on('update-downloaded', async (info) => {
    const { response } = await dialog.showMessageBox({
      type: 'info',
      title: 'Update available',
      message: `Version ${info.version} is ready to install.`,
      detail: 'Restart the app to apply the update.',
      buttons: ['Restart', 'Later'],
      defaultId: 0,
      cancelId: 1
    });

    if (response === 0) {
      autoUpdater.quitAndInstall();
    }
  });

  void autoUpdater.checkForUpdatesAndNotify().catch((error) => {
    console.error('[auto-updater] check failed', error);
  });
}
