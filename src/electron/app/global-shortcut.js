const { globalShortcut } = require('electron');

const 注册全局快捷键 = () => {
  // 注册 F12 打开开发者工具
  // globalShortcut.register('CommandOrControl+F12', () => {
  //   const win = require('electron').BrowserWindow.getFocusedWindow();
  //   if (win) {
  //     win.webContents.toggleDevTools();
  //   }
  // });
};

module.exports = { 注册全局快捷键 };
