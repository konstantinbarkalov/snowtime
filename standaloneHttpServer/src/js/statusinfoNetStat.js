'use strict';
function Statusinfo($statusinfo) {
  let that = this;
  let isConnected = null;
  let lastSignalPtime = null;
  let $isConnected = null;
  let $lastSignalPtime = null;
  let $close = null;
  let $humanizedIsConnected = null;
  let $humanizedLastSignalPtime = null;

  let errorLevelIsConnected = null;
  let humanizedStringIsConnected = null;

  let errorLevelLastSignalPtime = null;
  let humanizedStringLastSignalPtime = null;
  let isAutoOpenOnError = false;
  function init() {
    isAutoOpenOnError = false;
    that.isOpened = false;
    $isConnected = $statusinfo.find('.statusinfo__is-connected');
    $lastSignalPtime = $statusinfo.find('.statusinfo__last-signal-ptime');
    $close = $statusinfo.find('.statusinfo__close');
    $humanizedIsConnected = $statusinfo.find('.statusinfo__humanized--is-connected');
    $humanizedLastSignalPtime = $statusinfo.find('.statusinfo__humanized--last-signal-ptime');
    $close.on('click', that.close);
    updateAll();
  }
  function updateAll() {
    $isConnected.text(prettyIsConnected(isConnected));
    $humanizedIsConnected.toggleClass('statusinfo__humanized--ok', !errorLevelIsConnected);
    $humanizedIsConnected.toggleClass('statusinfo__humanized--red', errorLevelIsConnected === 'red');
    $humanizedIsConnected.toggleClass('statusinfo__humanized--yellow', errorLevelIsConnected === 'yellow');
    $humanizedIsConnected.text(humanizedStringIsConnected);
    $lastSignalPtime.text(prettyLastSignalPtime(lastSignalPtime));
    $humanizedLastSignalPtime.toggleClass('statusinfo__humanized--ok', !errorLevelLastSignalPtime);
    $humanizedLastSignalPtime.toggleClass('statusinfo__humanized--red', errorLevelLastSignalPtime === 'red');
    $humanizedLastSignalPtime.toggleClass('statusinfo__humanized--yellow', errorLevelLastSignalPtime === 'yellow');
    $humanizedLastSignalPtime.text(humanizedStringLastSignalPtime);
  };

  function prettyFloat(float){
    if (!!float || float === 0) {
      return float.toPrecision(3);
    } else {
      return '?';
    }
  }
  function prettyPercent(percent){
    if (!!percent || percent === 0) {
      return percent.toFixed(0) + '%';
    } else {
      return '?';
    }
  }
  function prettyLastSignalPtime(ptime){
    if (!!ptime || ptime === 0) {
      let diff = performance.now() - ptime;
      return (diff / 1000).toFixed(0);
    } else {
      return '?';
    }
  }
  function prettyIsConnected(isConnected){
    if (isConnected) {
      return 'онлайн';
    } else {
      return 'оффлайн';
    }
  }
  that.errorLevel = null;
  that.onClose = null;
  that.isOpened = false;
  that.setNetStat = function(newNetStat) {
    // there is no dirty check here, because diff with performance.now() is used to form a string
    // and output string may changen even with same lastSignalPtime
    isConnected = newNetStat.isConnected;
    lastSignalPtime = newNetStat.lastSignalPtime;
    {
      errorLevelIsConnected = null;
      humanizedStringIsConnected = '';
      let humanizedStringIsConnected = '';
      if (!isConnected) {
        humanizedStringLastSignalPtime = 'Оффлайн режим'
      } else {
        humanizedStringLastSignalPtime = 'Онлайн режим'
      }
    }
    {
      errorLevelLastSignalPtime = null;
      humanizedStringLastSignalPtime = '';
      let diff = performance.now() - lastSignalPtime;
      if (!isConnected) {
        humanizedStringLastSignalPtime = 'Оффлайн режим'
      } else if (!diff) {
        humanizedStringLastSignalPtime = 'Нет данных'
        errorLevelLastSignalPtime = 'red';
      } else if (diff < 15000) {
        humanizedStringLastSignalPtime = 'Ок'
      } else if (diff < 25000) {
        humanizedStringLastSignalPtime = 'Вообще, новый сигнал уже точно должен быть, но пока не слышно.'
      } else if (diff < 35000) {
        humanizedStringLastSignalPtime = 'Со связью что-то не так - новый сигнал уже точно должен быть, но в эфире тишина.'
        errorLevelLastSignalPtime = 'yellow';
      } else {
        humanizedStringLastSignalPtime = 'Что-то явно идет не так. Сигнала нет так долго, что должно уже было сработать автоотключение, однако этого не произошло. :-\\';
        errorLevelLastSignalPtime = 'red';
      }
    }
    if (errorLevelLastSignalPtime === 'red' || errorLevelIsConnected === 'red') {
      that.errorLevel = 'red';
    } else if (errorLevelLastSignalPtime === 'yellow' || errorLevelIsConnected === 'yellow') {
      that.errorLevel = 'yellow';
    } else {
      that.errorLevel = null;
    }
    if (isAutoOpenOnError && that.errorLevel && !that.isOpened) {
      that.open();
    };
    if (that.isOpened) {
      updateAll();
    }

  }
  that.open = function() {
    that.isOpened = true;
    updateAll();
    $statusinfo.css({display: 'flex'}); // lack of jQuery.show for flex :(
  }
  that.close = function() {
    that.isOpened = false;
    isAutoOpenOnError = false;
    $statusinfo.css({display: 'none'}); // lack of jQuery.hide for flex :(
    if (that.onClose) {
      that.onClose();
    }
  }

  init();
}
module.exports = Statusinfo;