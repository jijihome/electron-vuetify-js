const { app, BrowserWindow, ipcMain } = require('electron');
const { createMainWindow } = require('./windows/window-main');

app.whenReady().then(() => {
  app.setAppUserModelId('com.electron');

  // IPC test
  ipcMain.on('ping', () => console.log('pong'));

  createMainWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createMainWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
