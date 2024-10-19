const { dialog } = require('electron');

const showMessageBox = (
  window,
  type = 'info',
  title,
  message,
  buttons = ['确定'],
) => {
  dialog.showMessageBox(window, {
    type: type,
    title: title,
    message: message,
    buttons: buttons,
  });
};

module.exports = { showMessageBox };
