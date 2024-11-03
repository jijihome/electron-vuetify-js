const { BrowserWindow } = require('electron');
const path = require('path');
const url = require('url');
const { isDev } = require('../utils/utils');

const windowOptions = {
  width: 800,
  height: 600,
  show: false,
  autoHideMenuBar: true,
  webPreferences: {
    preload: path.join(__dirname, '../preload.js'),
    nodeIntegration: false,
    contextIsolation: true,
  },
};

const makeUrl = () => {
  if (isDev() && process.env.VITE_DEV_SERVER_URL) {
    return process.env.VITE_DEV_SERVER_URL;
  } else {
    return url.format({
      pathname: path.join(__dirname, '../../../dist/index.html'),
      protocol: 'file:',
      slashes: true,
    });
  }
};

const createMainWindow = () => {
  const mainWindow = new BrowserWindow(windowOptions);

  try {
    // 禁用缓存，防止缓存导致页面不刷新导致载入部分资源失败
    mainWindow.webContents.session.clearCache();

    // 确定窗口启动时加载的URL
    const startUrl = makeUrl();
    console.log('Loading URL:', startUrl);
    // 加载URL到主窗口
    mainWindow.loadURL(startUrl);

    // if (isDev())
    mainWindow.webContents.openDevTools();
  } catch (error) {
    console.error('load url error:', error);
  }

  mainWindow.on('ready-to-show', () => {
    mainWindow.show();
  });
};

module.exports = { createMainWindow };
