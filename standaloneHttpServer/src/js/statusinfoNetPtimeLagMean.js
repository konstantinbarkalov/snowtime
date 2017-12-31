'use strict';
function Statusinfo($statusinfo) {
  let that = this;
  let mean = null;
  let updateIntervalId = null;
  let $mean = null;
  let $close = null;
  let $humanized = null;
  let $resync = null;
  let humanizedString = null;
  let isAutoOpenOnError = true;
  function init() {
    isAutoOpenOnError = true;
    that.isOpened = false;
    $mean = $statusinfo.find('.statusinfo__mean');
    $close = $statusinfo.find('.statusinfo__close');
    $humanized = $statusinfo.find('.statusinfo__humanized');
    $resync = $statusinfo.find('.statusinfo__resync');
    $close.on('click', that.close);
    $resync.on('click', resync);
  }

  function updateAll() {
    $mean.text(prettyFloat(mean));
    $humanized.toggleClass('statusinfo__humanized--ok', !that.errorLevel);
    $humanized.toggleClass('statusinfo__humanized--red', that.errorLevel === 'red');
    $humanized.toggleClass('statusinfo__humanized--yellow', that.errorLevel === 'yellow');
    $humanized.text(humanizedString);
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
  function prettyPs(mean){
    if (!!mean || mean === 0) {
      return mean.toFixed(0);
    } else {
      return '?';
    }
  }
  function resync() {
    teplite.gritter.addGrit('Ресинхронизация времени с сервером...');
    return teplite.sioClient.timePingStartRoutine().then(()=>{
      teplite.gritter.addGrit('Ресинхронизация времени с сервером завершена');
    }).catch((err)=>{
      teplite.gritter.addGrit('Ресинхронизация времени с сервером не удалась, причина: ' + err.message , 'red');
    });
    if (that.onResync) {
      that.onResync();
    }
  }
  that.errorLevel = null;
  that.isOpened = false;
  that.onClose = null;
  that.onResync = null;
  that.setMean = function(newMean) {
    //if (mean !== newMean) {
      mean = newMean;

      that.errorLevel = null;
      humanizedString = '';
      if (!teplite.stat.net.isConnected) {
        humanizedString = 'Оффлайн режим'
      } else if (!mean) {
        humanizedString = 'Нет данных'
        that.errorLevel = 'red';
      } else if (mean < 10) {
        humanizedString = 'Да ладно!'
      } else if (mean < 50) {
        humanizedString = 'Божественно'
      } else if (mean < 100) {
        humanizedString = 'Ок, но задержка уже будет чувствоваться.'
      } else if (mean < 200) {
        humanizedString = 'Будет ощущаться задержка. Возможно, стоит сменить подключение (без wifi — тяжело) или выбрать другой сервер поближе географически.'
      } else if (mean < 350) {
        humanizedString = 'Это уже довольно большое значение — будет ощущаться большая задержка. Стоит сменить подключение (без wifi — тяжело) или выбрать другой сервер поближе географически.'
        that.errorLevel = 'yellow';
      } else {
        humanizedString = 'Слишкком болшая задержка! Стоит сменить подключение (без wifi — тяжело) или выбрать другой сервер поближе географически. Иначе, с этим соединением каши не сваришь.'
        that.errorLevel = 'red';
      }
      if (isAutoOpenOnError && that.errorLevel && !that.isOpened) {
        that.open();
      };
      if (that.isOpened) {
        updateAll();
      }
    //}
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