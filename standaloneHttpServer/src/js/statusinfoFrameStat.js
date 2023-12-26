'use strict';
function Statusinfo($statusinfo) {
  let that = this;
  let ps = null;
  let dutyRatio = null;
  let $ps = null;
  let $dutyPercent = null;
  let $close = null;
  let $humanizedPs = null;
  let $humanizedDuty = null;

  let errorLevelPs = null;
  let humanizedStringPs = null;

  let errorLevelDuty = null;
  let humanizedStringDuty = null;
  let isAutoOpenOnError = false;
  function init() {
    isAutoOpenOnError = false;
    that.isOpened = false;
    $ps = $statusinfo.find('.statusinfo__ps');
    $dutyPercent = $statusinfo.find('.statusinfo__duty');
    $close = $statusinfo.find('.statusinfo__close');
    $humanizedPs = $statusinfo.find('.statusinfo__humanized--ps');
    $humanizedDuty = $statusinfo.find('.statusinfo__humanized--duty');
    $close.on('click', that.close);
    updateAll();
  }
  function updateAll() {
    $ps.text(prettyPs(ps));
    $humanizedPs.toggleClass('statusinfo__humanized--ok', !errorLevelPs);
    $humanizedPs.toggleClass('statusinfo__humanized--red', errorLevelPs === 'red');
    $humanizedPs.toggleClass('statusinfo__humanized--yellow', errorLevelPs === 'yellow');
    $humanizedPs.text(humanizedStringPs);
    $dutyPercent.text(prettyPercent(dutyRatio * 100));
    $humanizedDuty.toggleClass('statusinfo__humanized--ok', !errorLevelDuty);
    $humanizedDuty.toggleClass('statusinfo__humanized--red', errorLevelDuty === 'red');
    $humanizedDuty.toggleClass('statusinfo__humanized--yellow', errorLevelDuty === 'yellow');
    $humanizedDuty.text(humanizedStringDuty);
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
  function prettyPs(ps){
    if (!!ps || ps === 0) {
      return ps.toFixed(0);
    } else {
      return '?';
    }
  }
  that.errorLevel = null;
  that.onClose = null;
  that.isOpened = false;
  that.setFrameStat = function(newFrameStat) {
    if (ps !== newFrameStat.ps_smooth ||
        dutyRatio !== newFrameStat.dutyRatio_smooth) {
      ps = newFrameStat.ps_smooth;
      dutyRatio = newFrameStat.dutyRatio_smooth;
      let isPrewarmed = teplite.websiteStartedPtime + teplite.prewarmMsec < performance.now();
      {
        errorLevelPs = null;
        humanizedStringPs = '';
        if (!isPrewarmed) {
          humanizedStringPs = 'Необходимо чуть больше времени, чтобы собрать статистику';
        } else if (!ps) {
          humanizedStringPs = 'Нет данных';
          errorLevelPs = 'red';
        } else if (ps < 15) {
          humanizedStringPs = 'Никуда не годится, попробуйте убавить настроийки графики в минимум';
          errorLevelPs = 'red';
        } else if (ps < 25) {
          humanizedStringPs = 'Это явно мало. Попробуйте убавить настройки графики';
          errorLevelPs = 'yellow';
        } else if (ps < 35) {
          humanizedStringPs = 'Жить можно, но лучше попробовать убавить настройки графики — должно стать плавнее';
        } else if (ps < 45) {
          humanizedStringPs = 'Довольно неплохо, но не идально';
        } else if (ps < 50) {
          humanizedStringPs = 'Почти идеально. Для android зачастую это - предел';
        } else if (ps < 140) {
          humanizedStringPs = 'Божественно';
        } else {
          humanizedStringPs = 'Поздравляю и жму руку владельцу 140+Hz монитора';
        }
      }
      {
        errorLevelDuty = null;
        humanizedStringDuty = '';
        if (!isPrewarmed) {
          humanizedStringDuty = 'Необходимо чуть больше времени, чтобы собрать статистику'
        } else if (!dutyRatio) {
          humanizedStringDuty = 'Нет данных'
          errorLevelDuty = 'red';
        } else if (dutyRatio < 0.05) {
          humanizedStringDuty = 'Божественно'
        } else if (dutyRatio < 0.2) {
          humanizedStringDuty = 'Ок'
        } else if (dutyRatio < 0.4) {
          humanizedStringDuty = 'Видео-цикл потребляет слишком много ресурсов. Хотя не должнен. Судя по всему, кто-то уже "съел" все ресурсы до него. Попробуйте уменьшить настройки графики.'
          errorLevelDuty = 'yellow';
        } else {
          humanizedStringDuty = 'Что-то явно идет не так'
          errorLevelDuty = 'red';
        }
      }
      if (errorLevelDuty === 'red' || errorLevelPs === 'red') {
        that.errorLevel = 'red';
      } else if (errorLevelDuty === 'yellow' || errorLevelPs === 'yellow') {
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