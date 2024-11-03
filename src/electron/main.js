const { app, BrowserWindow, ipcMain } = require('electron');
const { createMainWindow } = require('./windows/window-main');
const { 执行安装主进程通信 } = require('./ipc');
const { 注册全局快捷键 } = require('./app/global-shortcut');

app.whenReady().then(() => {
  app.setAppUserModelId('com.electron');

  执行安装主进程通信();

  createMainWindow();

  app.on('activate', () => {
    // MacOS
    if (BrowserWindow.getAllWindows().length === 0) createMainWindow();
  });

  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
  });

  注册全局快捷键();
});
