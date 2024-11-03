const {
  MessageBox,
  GetForegroundWindow,
  GetWindowThreadProcessId,
  GetWindowProcessId,
  GetWindowRect,
  OpenProcess,
  CloseHandle,
  GetModuleFileNameEx,
  GetWindowText,
  GetClassName,
  GetCurrentThreadId,
  AttachThreadInput,
  SetForegroundWindow,
  ShowWindow,
  BringWindowToTop,
  BlockInput,
  SystemParametersInfo,
  IsWindowVisible,
  SetWindowPos,
  IsIconic,

  PROCESS_QUERY_INFORMATION,
  PROCESS_VM_READ,
  SW_RESTORE,
  SW_SHOW,
  SPI_GETFOREGROUNDLOCKTIMEOUT,
  SPI_SETFOREGROUNDLOCKTIMEOUT,
  SPIF_SENDCHANGE,
  HWND_TOPMOST,
  HWND_NOTOPMOST,
  SWP_NOMOVE,
  SWP_NOSIZE,
  SWP_SHOWWINDOW,
  MB_ICONERROR,
} = require('./win32-api');

const { 延时 } = require('../utils/utils');
const { el_取当前窗口句柄 } = require('../windows/window-utils');
const 配置 = require('../config');

const 消息框 = (title, content, type, parentHandle = null) => {
  try {
    title = title || 配置.应用.名称;
    parentHandle = parentHandle || el_取当前窗口句柄();

    console.log('消息框', title, content, type, parentHandle);
    MessageBox(parentHandle === null ? 0 : parentHandle, content, title, type);
  } catch (error) {
    console.error(error);
  }
};

const 错误消息框 = (content, parentHandle = null) => {
  // console.log('错误消息框', content, parentHandle);
  消息框(null, content, MB_ICONERROR, parentHandle);
};

const 取当前活动窗口信息 = () => {
  const 句柄 = GetForegroundWindow();
  if (!句柄) return null;

  const 标题 = GetWindowText(句柄);
  const 类名 = GetClassName(句柄);

  let 进程名称 = '';
  const 进程ID = GetWindowThreadProcessId(句柄);
  if (进程ID) {
    const 进程句柄 = OpenProcess(进程ID, PROCESS_QUERY_INFORMATION | PROCESS_VM_READ);
    进程名称 = GetModuleFileNameEx(进程句柄);
    CloseHandle(进程句柄);
  }
  return { 句柄, 标题, 类名, 进程名称 };
};

/**
 * 检查并恢复最小化窗口
 * @param {number} 句柄 窗口句柄
 * @returns {Promise<boolean>} 是否成功恢复
 */
const 恢复最小化窗口 = async (句柄) => {
  if (IsIconic(句柄)) {
    ShowWindow(句柄, SW_RESTORE);
    // await 延时(100);
    return true;
  }
  return false;
};

/**
 * 附加线程输入
 * @param {number} currentThreadId 当前线程ID
 * @param {number} targetThreadId 目标线程ID
 * @returns {boolean} 是否成功附加
 */
const 附加线程 = (currentThreadId, targetThreadId) => {
  if (targetThreadId === currentThreadId) return false;
  return AttachThreadInput(currentThreadId, targetThreadId, true);
};

/**
 * 设置窗口层级和显示状态
 * @param {number} hwnd 窗口句柄
 */
const 设置窗口层级 = async (hwnd) => {
  // 先设置为顶层窗口
  SetWindowPos(hwnd, HWND_TOPMOST, 0, 0, 0, 0, SWP_NOMOVE | SWP_NOSIZE | SWP_SHOWWINDOW);
  await 延时(50);

  // 然后取消顶层状态，但保持在最前
  SetWindowPos(hwnd, HWND_NOTOPMOST, 0, 0, 0, 0, SWP_NOMOVE | SWP_NOSIZE | SWP_SHOWWINDOW);
};

/**
 * 尝试激活窗口
 * @param {number} hwnd 窗口句柄
 * @returns {Promise<boolean>} 是否成功激活
 */
const 尝试激活窗口 = async (hwnd) => {
  BringWindowToTop(hwnd);
  const result = SetForegroundWindow(hwnd);

  // await 延时(50);

  const currentForeground = GetForegroundWindow();

  return currentForeground === hwnd;
};

/**
 * 恢复窗口可见性
 * @param {number} hwnd 窗口句柄
 * @returns {Promise<boolean>} 是否成功恢复可见性
 */
const 恢复窗口可见性 = async (hwnd) => {
  if (!IsWindowVisible(hwnd)) {
    ShowWindow(hwnd, SW_SHOW);
    // await 延时(100);
    return IsWindowVisible(hwnd);
  }
  return true;
};

/**
 * 设置窗口前台显示
 * @param {number} hwnd 窗口句柄
 * @returns {Promise<boolean>} 是否成功显示
 */
const 设置窗口前台显示 = async (hwnd) => {
  hwnd = hwnd || el_取当前窗口句柄();

  const attachedThreads = [];
  let timeoutPtr = null;

  try {
    // 先恢复窗口可见性
    const visibilityRestored = await 恢复窗口可见性(hwnd);
    if (!visibilityRestored) {
      console.log('无法恢复窗口可见性');
      return false;
    }

    // 恢复最小化窗口
    await 恢复最小化窗口(hwnd);

    const foregroundWindow = GetForegroundWindow();
    if (!foregroundWindow) {
      console.log('无法获取当前前台窗口');
      return false;
    }

    const foregroundThreadId = GetWindowThreadProcessId(foregroundWindow);
    const targetThreadId = GetWindowThreadProcessId(hwnd);
    const currentThreadId = GetCurrentThreadId();

    // 临时禁用前台锁定
    timeoutPtr = Buffer.alloc(4);
    SystemParametersInfo(SPI_GETFOREGROUNDLOCKTIMEOUT, 0, timeoutPtr, 0);
    SystemParametersInfo(SPI_SETFOREGROUNDLOCKTIMEOUT, 0, Buffer.from([0, 0, 0, 0]), SPIF_SENDCHANGE);

    // 附加相关线程
    if (附加线程(currentThreadId, foregroundThreadId)) {
      attachedThreads.push(foregroundThreadId);
    }
    if (附加线程(currentThreadId, targetThreadId)) {
      attachedThreads.push(targetThreadId);
    }

    // 最多尝试3次激活窗口
    for (let i = 0; i < 3; i++) {
      await 设置窗口层级(hwnd);
      const success = await 尝试激活窗口(hwnd);

      if (success) {
        console.log(`窗口激活成功(第${i + 1}次尝试)`);
        return true;
      }

      if (i < 2) await 延时(100);
    }

    console.log('窗口激活失败');
    return false;
  } catch (error) {
    console.error('设置窗口前台显示出错:', error);
    return false;
  } finally {
    // 清理工作
    if (timeoutPtr) {
      SystemParametersInfo(SPI_SETFOREGROUNDLOCKTIMEOUT, 0, timeoutPtr, SPIF_SENDCHANGE);
    }

    // 解除线程附加
    const currentThreadId = GetCurrentThreadId();
    for (const threadId of attachedThreads) {
      AttachThreadInput(currentThreadId, threadId, false);
    }
  }
};

module.exports = {
  取当前活动窗口信息,
  设置窗口前台显示,
  消息框,
  错误消息框,
};
