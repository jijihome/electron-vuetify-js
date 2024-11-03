const { ipcMain } = require('electron');
const { 错误消息框 } = require('../win32-api/win32-api-utils');

/**
 * 为指定模块安装IPC通信功能
 *
 * @description
 * 递归遍历模块中的所有函数和对象，将函数注册为IPC事件处理程序。
 * 支持多层级的对象结构，生成带层级的IPC事件名称。
 *
 * @param {Object} 模块 - 要安装IPC通信的模块对象
 * @param {string} [前缀=''] - IPC事件名称的前缀
 *
 * @example
 * // 单层模块示例
 * const 模块 = {
 *   获取数据: async () => {...}
 * };
 * 安装模块进程通信(模块, '数据库:');
 * // 注册为: 数据库:获取数据
 *
 * // 多层模块示例
 * const 模块 = {
 *   用户: {
 *     获取信息: async () => {...}
 *   }
 * };
 * 安装模块进程通信(模块, '用户:');
 * // 注册为: 用户:用户.获取信息
 */
const 安装模块进程通信 = (模块, 前缀 = '') => {
  // 获取模块中每个导出的键值对
  Object.entries(模块).forEach(([key, value]) => {
    if (typeof value === 'function') {
      // 如果是函数，直接注册IPC事件
      console.log(`注册 IPC 事件 → ${前缀}${key}`);
      ipcMain.handle(`${前缀}${key}`, async (event, ...args) => {
        try {
          const result = await value(...args);
          return { success: true, data: result };
        } catch (error) {
          console.error(`执行 ${key} 失败:`, error);
          错误消息框(`执行「${key}」失败！\n\n${error.message}`);
          return { success: false, error: error.message };
        }
      });
    } else if (typeof value === 'object' && value !== null) {
      // 如果是对象，递归处理其中的方法
      安装模块进程通信(value, `${前缀}${key}.`);
    }
  });
};

/**
 * 执行主进程所有模块的IPC通信安装
 *
 * @description
 * 安装UI和数据库相关的IPC通信模块
 */
const 执行安装主进程通信 = () => {
  安装模块进程通信(require('./ipc-ui'), 'ui:');
};

module.exports = { 执行安装主进程通信 };
