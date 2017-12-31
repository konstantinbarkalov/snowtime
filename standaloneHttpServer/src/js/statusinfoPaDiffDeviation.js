'use strict';
function Statusinfo($statusinfo) {
  let that = this;
  let deviation = null;
  let updateIntervalId = null;
  let $deviation = null;
  let $close = null;
  let $humanized = null;
  let $resync = null;
  let humanizedString = null;
  let isAutoOpenOnError = true;
  function init() {
    isAutoOpenOnError = true;
    that.isOpened = false;
    $deviation = $statusinfo.find('.statusinfo__deviation');
    $close = $statusinfo.find('.statusinfo__close');
    $humanized = $statusinfo.find('.statusinfo__humanized');
    $resync = $statusinfo.find('.statusinfo__resync');
    $close.on('click', that.close);
    $resync.on('click', resync);
  }

  function updateAll() {
    $deviation.text(prettyFloat(deviation));
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
  function prettyPs(deviation){
    if (!!deviation || deviation === 0) {
      return deviation.toFixed(0);
    } else {
      return '?';
    }
  }
  function resync() {
    teplite.gritter.addGrit('Ресинхронизация аудиотаймера...');
    return teplite.timeSyncer.padSyncStartRoutine().then(()=>{
      teplite.gritter.addGrit('Ресинхронизация аудиотаймера завершена');
    }).catch((err)=>{
      teplite.gritter.addGrit('Ресинхронизация аудиотаймера не удалась, причина: ' + err.message , 'red');
    });
    if (that.onResync) {
      that.onResync();
    }
  }
  that.errorLevel = null;
  that.isOpened = false;
  that.onClose = null;
  that.onResync = null;
  that.setDeviation = function(newDeviation) {
    if (deviation !== newDeviation) {
      deviation = newDeviation;

      that.errorLevel = null;
      humanizedString = '';
      if (!deviation) {
        humanizedString = 'Нет данных';
        that.errorLevel = 'red';
      } else if (deviation < 1) {
        humanizedString = 'Да ладно!';
      } else if (deviation < 5) {
        humanizedString = 'Божественно';
      } else if (deviation < 25) {
        humanizedString = 'Ок';
      } else if (deviation < 35) {
        humanizedString = 'Терпимо, но, вообще-то, это уже многовато. Изредка возможны опаздания сэмплов. Со смартфонами такое бывает, к сожалению.';
      } else if (deviation < 45) {
        humanizedString = 'Это уже довольно большое значение — возможны рассинхронизации. Скорее всего будет работать плохо.';
        that.errorLevel = 'yellow';
      } else {
        humanizedString = 'Слишком большой разброс в значениях таймеров. К сожалению, работать нормально не будет. Возможно что-то не так с железом. Либо аудиосистеме не хватает ресурсов.';
        that.errorLevel = 'red';
      }
      if (isAutoOpenOnError && that.errorLevel && !that.isOpened) {
        that.open();
      };
      if (that.isOpened) {
        updateAll();
      }
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