import { electronApp, is, optimizer } from '@electron-toolkit/utils';
import packageJson from '@pkg';
import icon from '@resources/icon.png?asset';
import { app, BrowserWindow, protocol, shell } from 'electron';
import { join } from 'path';
import { localFileResponse } from './helpers';
import { registerHandlers } from './ipc/handlers';

protocol.registerSchemesAsPrivileged([
  {
    scheme: 'localfile',
    privileges: {
      secure: true,
      standard: true,
      supportFetchAPI: true,
      bypassCSP: true,
      stream: true
    }
  }
]);

function createWindow(): void {
  const appTitle = app.getName();

  // Create the browser window.
  const mainWindow = new BrowserWindow({
    title: appTitle,
    width: 1000,
    height: 720,
    minWidth: 1000,
    minHeight: 720,
    useContentSize: true,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' || process.platform === 'win32' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  });

  mainWindow.on('ready-to-show', () => {
    mainWindow.show();
  });

  // Keep a stable native title bar title (don't let the renderer override it).
  mainWindow.on('page-title-updated', (e) => {
    e.preventDefault();
    mainWindow.setTitle(appTitle);
  });

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url);
    return { action: 'deny' };
  });

  // Register all the IPC handlers
  registerHandlers(mainWindow);

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL']);
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'));
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId(packageJson.build.appId);

  // Path in `?p=` — see loadFileUrl. Serve from disk (net.fetch(file://) is unreliable on Windows).
  protocol.handle('localfile', async (req) => {
    let url: URL;
    try {
      url = new URL(req.url);
    } catch {
      return new Response(null, { status: 400 });
    }
    let filePath = url.searchParams.get('p');
    if (filePath === null) {
      const pathname = url.pathname.startsWith('/') ? url.pathname.slice(1) : url.pathname;
      filePath = pathname ? decodeURIComponent(pathname) : null;
    }
    if (filePath === null || !filePath.trim()) {
      return new Response(null, { status: 400 });
    }
    return localFileResponse(req, filePath);
  });

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window);
  });

  createWindow();

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
