'use strict';
function Errorer($errorer) {
  let that = this;
  const maxErrorsCount = 10;
  // must be required after onDomReady state, but to be sure (it's errorer!)
  // and to track before-onDomReady errors we do this rock:
  let domReadyPromise = new Promise((resolve)=>{
    $(()=>{
      resolve();
    });
  });
  let errorsCount = 0;
  let $restartButton = null;
  let $errorsList = null;

  function init() {
    domReadyPromise.then(()=>{
      $restartButton = $errorer.find('.errorer__restart-button');
      $errorsList = $errorer.find('.errorer__errors-list');
    });
  }

  window.onerror = function (message, file, line, col, err) {
    err = err || new Error('reportError without err object');
    processError(message, file, line, col, err);
  };

  function postReportError(message, file, line, col, err, errorsCount) {
    let report = {
      message: message,
      file: file,
      line: line,
      col: col,
      err: err.toString(),
      stack: err.stack.toString(),
      errorsCount: errorsCount,
      userAgent: navigator.userAgent,
    };
    $.post('/reportError', report);
  }
  function showErrorer() {
    domReadyPromise.then(()=>{
      let documentExitFullscreen =
        document.webkitExitFullscreen ||
        document.mozExitFullscreen ||
        document.msExitFullscreen ||
        document.oExitFullscreen ||
        document.exitFullscreen;
      documentExitFullscreen.call(document);
      $errorer.addClass('errorer--active');
    });
  }
  document.showErrorer = showErrorer;
  function addError(message, file, line, col, err, errorsCount) {
    domReadyPromise.then(()=>{
      let $error = $('<div></div>').addClass('errorer__error');
      let errorText = '';
      errorText += 'Ошибка №' + (errorsCount + 1) + ': ';
      errorText += message;
      $error.text(errorText);
      $errorsList.append($error);
    });
  }
  function processError(message, file, line, col, err) {
    if (errorsCount < maxErrorsCount) {
      //window.stop();
      postReportError(message, file, line, col, err, errorsCount);
      showErrorer();
      addError(message, file, line, col, err, errorsCount);
      errorsCount++;
    } else {
      window.stop();
      teplite.setEmit('halt', true, that);
    }
  }
  init();
}

new Errorer($('.errorer'));
// singleton, no need to be exported