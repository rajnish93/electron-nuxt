import { app, autoUpdater, BrowserWindow, dialog, Menu } from 'electron';
import path from 'node:path';
import started from 'electron-squirrel-startup';
// import { updateElectronApp, UpdateSourceType } from 'update-electron-app';

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (started) {
  app.quit();
}

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  // and load the index.html of the app.
  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(
      path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`)
    );
  }

  // Open the DevTools.
  mainWindow.webContents.openDevTools();

  // Initialize autoUpdater for automatic updates
  // autoUpdater.checkForUpdatesAndNotify();

  // Handle autoUpdater events
  autoUpdater.on('update-available', () => {
    dialog.showMessageBox(mainWindow, {
      type: 'info',
      title: 'Update Available',
      message: 'A new version is available. Downloading now...',
    });
  });

  autoUpdater.on('update-downloaded', (info) => {
    dialog
      .showMessageBox(mainWindow, {
        type: 'info',
        title: 'Update Ready',
        message:
          'Update downloaded. Restarting the app now to apply the update.',
      })
      .then(() => {
        autoUpdater.quitAndInstall();
      });
  });

  autoUpdater.on('error', (err) => {
    console.error('Error checking for updates:', err);
  });
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// updateElectronApp();
// updateElectronApp({
//   updateSource: {
//     type: UpdateSourceType.ElectronPublicUpdateService,
//     repo: 'rajnish93/electron-nuxt',
//   },
//   updateInterval: '5 minutes',
// });

const isMac = process.platform === 'darwin';

const template: Array<Electron.MenuItemConstructorOptions> = [
  {
    label: 'File',
    submenu: [isMac ? { role: 'close' } : { role: 'quit' }],
  },
  {
    label: 'View',
    submenu: [
      { role: 'reload' },
      { role: 'forceReload' },
      // { role: 'toggleDevTools' },
      // { type: 'separator' },
      // { role: 'resetZoom' },
      // { role: 'zoomIn' },
      // { role: 'zoomOut' },
      // { type: 'separator' },
      { role: 'togglefullscreen' },
    ],
  },
  {
    label: 'Help',
    submenu: [
      {
        label: 'Check for Updates',
        click() {
          checkForUpdates();
        },
      },
      {
        label: 'About',
        click() {
          const aboutMessage = `
    App Name: ${app.getName()}
    Version: ${app.getVersion()}
    Electron: ${process.versions.electron}
    Chromium: ${process.versions.chrome}
    Node.js: ${process.versions.node}
    V8: ${process.versions.v8}
    OS: ${process.platform} ${process.arch}
  `;
          dialog.showMessageBox({
            type: 'info',
            title: 'About',
            message: aboutMessage,
            buttons: ['OK'],
          });
        },
      },
    ],
  },
];

const menu = Menu.buildFromTemplate(template);
Menu.setApplicationMenu(menu);

// Function to manually check for updates
function checkForUpdates() {
  autoUpdater.checkForUpdates();
}

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
