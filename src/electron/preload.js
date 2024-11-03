const { contextBridge, ipcRenderer } = require('electron');

const 调用错误框 = (error) => {
  ipcRenderer.invoke('ui:错误消息框', error.message);
};

// 暴露给渲染进程的 API
contextBridge.exposeInMainWorld('进程通信', {
  // 从渲染器进程到主进程的异步通信

  /**************************************************
   * 通用方法
   ***************************************************/
  监听: (channel, func) => {
    try {
      ipcRenderer.on(channel, (event, ...args) => func(...args));
    } catch (error) {
      调用错误框(error.message);
      throw error;
    }
  },
  移除监听: (channel, ...args) => {
    try {
      ipcRenderer.removeListener(channel, ...args);
    } catch (error) {
      调用错误框(error.message);
      throw error;
    }
  },
  发送: (channel, ...args) => {
    try {
      ipcRenderer.send(channel, ...args);
    } catch (error) {
      调用错误框(error.message);
      throw error;
    }
  },
  调用: (channel, ...args) => {
    try {
      return ipcRenderer.invoke(channel, ...args);
    } catch (error) {
      调用错误框(error.message);
      throw error;
    }
  },
  发送同步: (channel, ...args) => {
    try {
      return ipcRenderer.sendSync(channel, ...args);
    } catch (error) {
      调用错误框(error.message);
      throw error;
    }
  },
});
