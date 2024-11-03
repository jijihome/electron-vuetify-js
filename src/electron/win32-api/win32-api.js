// ES6 syntax: import koffi from 'koffi';
const koffi = require('koffi');
const electron = require('electron');

// Load the shared libraries
const user32 = koffi.load('user32.dll');
const kernel32 = koffi.load('kernel32.dll');
const psapi = koffi.load('psapi.dll'); // 添加 psapi.dll

// Declare constants
const MB_OK = 0x0;
const MB_YESNO = 0x4;
const MB_ICONQUESTION = 0x20;
const MB_ICONINFORMATION = 0x40;
const MB_OKCANCEL = 0x1;
const MB_ABORTRETRYIGNORE = 0x2;
const MB_YESNOCANCEL = 0x3;
const MB_RETRYCANCEL = 0x5;
const MB_CANCELTRYCONTINUE = 0x6;
const MB_ICONERROR = 0x10;
const MB_ICONWARNING = 0x30;
const MB_ICONEXCLAMATION = 0x30; // 与 MB_ICONWARNING 相同
const MB_ICONASTERISK = 0x40; // 与 MB_ICONINFORMATION 相同
const MB_DEFBUTTON1 = 0x0;
const MB_DEFBUTTON2 = 0x100;
const MB_DEFBUTTON3 = 0x200;
const MB_DEFBUTTON4 = 0x300;
const MB_SYSTEMMODAL = 0x1000;
const MB_TASKMODAL = 0x2000;
const MB_TOPMOST = 0x40000;
const IDOK = 1;
const IDYES = 6;
const IDNO = 7;

// 添加常量
const HWND_TOP = 0;
const HWND_NOTOPMOST = -2;
const HWND_TOPMOST = -1;
const SWP_NOMOVE = 0x0002;
const SWP_NOSIZE = 0x0001;
const SWP_NOACTIVATE = 0x0010;
const GW_OWNER = 4;

// 添加进程访问权限常量
const PROCESS_QUERY_INFORMATION = 0x0400;
const PROCESS_VM_READ = 0x0010;

// 添加新的常量
const SW_RESTORE = 9;
const SW_SHOW = 5;
const SPI_GETFOREGROUNDLOCKTIMEOUT = 0x2000;
const SPI_SETFOREGROUNDLOCKTIMEOUT = 0x2001;
const SPIF_SENDCHANGE = 0x2;

// 添加新的窗口位置标志
const SWP_NOOWNERZORDER = 0x0200;
const SWP_SHOWWINDOW = 0x0040;

// 定义重绘相关的常量
const RDW_INVALIDATE = 0x0001;
const RDW_ERASE = 0x0004;
const RDW_FRAME = 0x0400;
const RDW_INTERNALPAINT = 0x0002;
const RDW_ALLCHILDREN = 0x0080;
const RDW_UPDATENOW = 0x0100;
const RDW_ERASENOW = 0x0200;

// 定义窗口消息常量
const WM_PAINT = 0x000f;
const WM_NCPAINT = 0x0085;
const WM_ERASEBKGND = 0x0014;

// user32.dll functions
const _MessageBoxA = user32.func('__stdcall', 'MessageBoxA', 'int', ['void *', 'str', 'str', 'uint']);
const _MessageBoxW = user32.func('__stdcall', 'MessageBoxW', 'int', ['void *', 'str16', 'str16', 'uint']);
const _GetWindowThreadProcessId = user32.func('__stdcall', 'GetWindowThreadProcessId', 'uint', ['void *', 'void *']);
const _GetForegroundWindow = user32.func('__stdcall', 'GetForegroundWindow', 'int', []);
const _GetWindowTextW = user32.func('__stdcall', 'GetWindowTextW', 'int', ['void *', 'str16', 'int', 'uint']);
const _GetClassNameW = user32.func('__stdcall', 'GetClassNameW', 'int', ['void *', 'str16', 'int', 'uint']);
const _GetWindowRect = user32.func('__stdcall', 'GetWindowRect', 'int', ['void *', 'void *', 'uint', 'uint']);
const _SetForegroundWindow = user32.func('__stdcall', 'SetForegroundWindow', 'bool', ['void *']);
const _AttachThreadInput = user32.func('__stdcall', 'AttachThreadInput', 'bool', ['uint', 'uint', 'bool']);
const _ShowWindow = user32.func('__stdcall', 'ShowWindow', 'bool', ['void *', 'int']);
const _BringWindowToTop = user32.func('__stdcall', 'BringWindowToTop', 'bool', ['void *']);
const _BlockInput = user32.func('__stdcall', 'BlockInput', 'bool', ['bool']);
const _SystemParametersInfoA = user32.func('__stdcall', 'SystemParametersInfoA', 'bool', ['uint', 'uint', 'void *', 'uint']);
const _IsWindowVisible = user32.func('__stdcall', 'IsWindowVisible', 'bool', ['void *']);
const _SetWindowPos = user32.func('__stdcall', 'SetWindowPos', 'bool', ['void *', 'void *', 'int', 'int', 'int', 'int', 'uint']);
const _GetWindow = user32.func('__stdcall', 'GetWindow', 'void *', ['void *', 'uint']);
const _IsIconic = user32.func('__stdcall', 'IsIconic', 'bool', ['void *']);
// 声明重绘相关的函数
const _InvalidateRect = user32.func('__stdcall', 'InvalidateRect', 'bool', ['void *', 'void *', 'bool']);
const _UpdateWindow = user32.func('__stdcall', 'UpdateWindow', 'bool', ['void *']);
const _RedrawWindow = user32.func('__stdcall', 'RedrawWindow', 'bool', ['void *', 'void *', 'void *', 'uint']);
const _SendMessageW = user32.func('__stdcall', 'SendMessageW', 'int', ['void *', 'uint', 'int', 'int']);
const _PostMessageW = user32.func('__stdcall', 'PostMessageW', 'bool', ['void *', 'uint', 'int', 'int']);

// kernel32.dll functions
const _OpenProcess = kernel32.func('__stdcall', 'OpenProcess', 'int', ['uint', 'bool', 'uint', 'uint']);
const _CloseHandle = kernel32.func('__stdcall', 'CloseHandle', 'int', ['int', 'void *', 'uint', 'uint']);
const _GetCurrentThreadId = kernel32.func('__stdcall', 'GetCurrentThreadId', 'uint', []);

// psapi.dll functions
const _GetModuleFileNameExW = psapi.func('__stdcall', 'GetModuleFileNameExW', 'int', ['int', 'int', 'str16', 'int']);

function MessageBox(parentHandle, content, title, type = null) {
  _MessageBoxW(parentHandle, content, title, type);
}

function GetForegroundWindow() {
  return _GetForegroundWindow();
}

function GetWindowThreadProcessId(hwnd) {
  const processIdPtr = Buffer.alloc(4);
  const threadId = _GetWindowThreadProcessId(hwnd, processIdPtr);
  return threadId;
}

function GetWindowProcessId(hwnd) {
  const processIdPtr = Buffer.alloc(4);
  _GetWindowThreadProcessId(hwnd, processIdPtr);
  return processIdPtr.readUInt32LE(0);
}

function GetWindowRect(hwnd) {
  const rectPtr = Buffer.alloc(16); // RECT 结构体需要 16 字节
  _GetWindowRect(hwnd, rectPtr, 0, 0);
  return {
    left: rectPtr.readInt32LE(0),
    top: rectPtr.readInt32LE(4),
    right: rectPtr.readInt32LE(8),
    bottom: rectPtr.readInt32LE(12),
  };
}

function OpenProcess(processId) {
  return _OpenProcess(PROCESS_QUERY_INFORMATION | PROCESS_VM_READ, false, processId, 0);
}

function CloseHandle(handle) {
  return _CloseHandle(handle, null, 0, 0);
}

function GetModuleFileNameEx(processHandle) {
  const bufferSize = 1024; // 足够大的缓冲区来存储路径
  const buffer = Buffer.alloc(bufferSize * 2); // str16 需要两倍的空间
  const length = _GetModuleFileNameExW(processHandle, 0, buffer, bufferSize);

  if (length === 0) {
    return null;
  }

  // 将 buffer 转换为字符串，去掉末尾的 null 字符
  return buffer.toString('utf16le').slice(0, length);
}

function GetWindowText(hwnd) {
  const bufferSize = 512; // 足够大的缓冲区来存储窗口标题
  const buffer = Buffer.alloc(bufferSize * 2); // str16 需要两倍的空间
  const length = _GetWindowTextW(hwnd, buffer, bufferSize, 0);

  if (length === 0) {
    return '';
  }

  // 将 buffer 转换为字符串，去掉末尾的 null 字符
  return buffer.toString('utf16le').slice(0, length);
}

function GetClassName(hwnd) {
  const bufferSize = 256; // 通常类名不会太长
  const buffer = Buffer.alloc(bufferSize * 2); // str16 需要两倍的空间
  const length = _GetClassNameW(hwnd, buffer, bufferSize, 0);

  if (length === 0) {
    return '';
  }

  // 将 buffer 转换为字符串，去掉末尾的 null 字符
  return buffer.toString('utf16le').slice(0, length);
}

function GetCurrentThreadId() {
  return _GetCurrentThreadId();
}

function AttachThreadInput(idAttach, idAttachTo, fAttach) {
  return _AttachThreadInput(idAttach, idAttachTo, fAttach);
}

function SetForegroundWindow(hwnd) {
  return _SetForegroundWindow(hwnd);
}

// 添加新的API函数实现
function ShowWindow(hwnd, nCmdShow) {
  return _ShowWindow(hwnd, nCmdShow);
}

function BringWindowToTop(hwnd) {
  return _BringWindowToTop(hwnd);
}

function BlockInput(fBlockIt) {
  return _BlockInput(fBlockIt);
}

function SystemParametersInfo(uiAction, uiParam, pvParam, fWinIni) {
  return _SystemParametersInfoA(uiAction, uiParam, pvParam, fWinIni);
}

function IsWindowVisible(hwnd) {
  return _IsWindowVisible(hwnd);
}

function SetWindowPos(hwnd, hwndInsertAfter, x, y, cx, cy, uFlags) {
  return _SetWindowPos(hwnd, hwndInsertAfter, x, y, cx, cy, uFlags);
}

function GetWindow(hwnd, uCmd) {
  return _GetWindow(hwnd, uCmd);
}

function IsIconic(hwnd) {
  return _IsIconic(hwnd);
}

// 包装函数
function InvalidateRect(hwnd, rect, bErase) {
  return _InvalidateRect(hwnd, rect, bErase);
}

function UpdateWindow(hwnd) {
  return _UpdateWindow(hwnd);
}

function RedrawWindow(hwnd, rcUpdate, hrgnUpdate, flags) {
  return _RedrawWindow(hwnd, rcUpdate, hrgnUpdate, flags);
}

function SendMessage(hwnd, msg, wParam, lParam) {
  return _SendMessageW(hwnd, msg, wParam, lParam);
}

function PostMessage(hwnd, msg, wParam, lParam) {
  return _PostMessageW(hwnd, msg, wParam, lParam);
}

// 修改 module.exports，确保包含所有需要的导出
module.exports = {
  MB_OK,
  MB_YESNO,
  MB_ICONQUESTION,
  MB_ICONINFORMATION,
  MB_OKCANCEL,
  MB_ABORTRETRYIGNORE,
  MB_YESNOCANCEL,
  MB_RETRYCANCEL,
  MB_CANCELTRYCONTINUE,
  MB_ICONERROR,
  MB_ICONWARNING,
  MB_ICONEXCLAMATION,
  MB_ICONASTERISK,
  PROCESS_QUERY_INFORMATION,
  PROCESS_VM_READ,
  SW_RESTORE,
  SW_SHOW,
  SPI_GETFOREGROUNDLOCKTIMEOUT,
  SPI_SETFOREGROUNDLOCKTIMEOUT,
  SPIF_SENDCHANGE,
  HWND_TOP,
  HWND_NOTOPMOST,
  HWND_TOPMOST,
  SWP_NOMOVE,
  SWP_NOSIZE,
  SWP_NOACTIVATE,
  SWP_NOOWNERZORDER,
  SWP_SHOWWINDOW,
  GW_OWNER,

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
  GetWindow,
  IsIconic,

  InvalidateRect,
  UpdateWindow,
  RedrawWindow,
  SendMessage,
  PostMessage,

  RDW_INVALIDATE,
  RDW_ERASE,
  RDW_FRAME,
  RDW_INTERNALPAINT,
  RDW_ALLCHILDREN,
  RDW_UPDATENOW,
  RDW_ERASENOW,
  WM_PAINT,
  WM_NCPAINT,
  WM_ERASEBKGND,

  MB_OK,
  MB_OKCANCEL,
  MB_ABORTRETRYIGNORE,
  MB_YESNO,
  MB_YESNOCANCEL,
  MB_RETRYCANCEL,
  MB_CANCELTRYCONTINUE,
  MB_ICONERROR,
  MB_ICONQUESTION,
  MB_ICONWARNING,
  MB_ICONEXCLAMATION,
  MB_ICONINFORMATION,
  MB_ICONASTERISK,
  MB_DEFBUTTON1,
  MB_DEFBUTTON2,
  MB_DEFBUTTON3,
  MB_DEFBUTTON4,
  MB_SYSTEMMODAL,
  MB_TASKMODAL,
  MB_TOPMOST,
};
