const { BrowserWindow, dialog, screen } = require('electron');
const 配置 = require('../config');

const el_取主窗口 = () => {
  return BrowserWindow.getAllWindows().find(
    (window) => !window.isDestroyed() && window.isMain,
  );
};

const el_取当前窗口 = () => {
  return BrowserWindow.getFocusedWindow();
};

/**
 * 获取窗口句柄
 * @param {BrowserWindow} window
 * @returns {number}
 */
const el_取窗口句柄 = (window) => {
  return window.getNativeWindowHandle().readInt32LE(0);
};

const el_取主窗口句柄 = () => {
  const mainWindow = el_取主窗口();
  if (!mainWindow) return null;
  return mainWindow.getNativeWindowHandle().readInt32LE(0);
};

const el_取当前窗口句柄 = () => {
  const currentWindow = BrowserWindow.getFocusedWindow();
  if (!currentWindow) return null;
  return el_取窗口句柄(currentWindow);
};

/**
 * 显示 electron 消息框
 * @param {BrowserWindow} [可选] window
 * @param {string} [可选] type: 'info' | 'error' | 'warning' | 'question'
 * @param {string} [可选] title
 * @param {string} message
 * @param {string[]} [可选] buttons
 * @returns {Promise<number>}
 */
const el_消息框 = (
  window = null,
  type = 'info',
  title = null,
  message,
  buttons = ['确定'],
) => {
  console.log('showMessageBox', window, type, title, message, buttons);
  // 直接使用 window 参数或获取当前焦点窗口
  const parent = window ? window : BrowserWindow.getFocusedWindow();
  return dialog.showMessageBox(parent, {
    type: type,
    title: title || 配置.应用.名称,
    message: message,
    buttons: buttons,
  });
};

// 跳转路由
const el_窗口路由跳转 = (window, route) => {
  window.webContents.send('router:navigate', route);
};

/**
 * 获取主显示器的尺寸
 * @returns { width: number, height: number }
 */
const el_取主显示器尺寸 = () => {
  const primaryDisplay = screen.getPrimaryDisplay();
  const { width, height } = primaryDisplay.workAreaSize;
  return {
    width,
    height,
  };
};

// 清除缓存
const el_清除缓存 = (window) => {
  window.webContents.session.clearCache();
};

const el_窗口_发送消息 = (window, channel, ...args) => {
  window.webContents.send(channel, ...args);
};

const el_主窗口_发送消息 = (channel, ...args) => {
  const mainWindow = el_取主窗口();
  if (!mainWindow) return;
  el_窗口_发送消息(mainWindow, channel, ...args);
};

/**
 * 最小化主窗口
 */
const el_主窗口_最小化 = () => {
  try {
    const mainWindow = el_取主窗口();
    mainWindow.minimize();
  } catch (error) {
    const errMsg = '最小化主窗口失败: ' + error.message;
    console.error(errMsg);
    throw error;
  }
};

module.exports = {
  el_取主窗口,
  el_取当前窗口,
  el_取窗口句柄,
  el_取主窗口句柄,
  el_取当前窗口句柄,
  el_消息框,
  el_窗口路由跳转,
  el_取主显示器尺寸,
  el_清除缓存,
  el_窗口_发送消息,
  el_主窗口_发送消息,
  el_主窗口_最小化,
};
