'use strict';
const Cirpad = require('./cirpad.js');
function Options($container) {
  let that = this;
  let $expander = null;
  let $toggle = null;
  let isExpanded = null;
  let $toggleShow = null;
  let $toggleHide = null;
  let cirpadSystemAudioLag = null;
  let cirpadVideoQuality = null;
  let cirpadVolumeTheme = null;
  let cirpadVolumeMetro = null;
  function init() {
    isExpanded = false;
    $expander = $container.find('.options__expander');
    $toggle = $container.find('.options__expander-toggle');
    $toggleShow = $container.find('.options__expander-toggle-text.options__expander-toggle-text--show');
    $toggleHide = $container.find('.options__expander-toggle-text.options__expander-toggle-text--hide');
    cirpadSystemAudioLag = new Cirpad($container.find('#cirpad--system-audio-lag'), 'hor');
    cirpadVideoQuality = new Cirpad($container.find('#cirpad--video-quality'), 'hor');
    cirpadVolumeTheme = new Cirpad($container.find('#cirpad--volume-theme'), 'hor');
    cirpadVolumeMetro = new Cirpad($container.find('#cirpad--volume-metro'), 'hor');


    ////  cirpadSystemAudioLag
    let $cirpadValueSystemAudioLag = $container.find('#cirpad-value--system-audio-lag .cirpad-value__value');
    let $cirpadSubvalueSystemAudioLag = $container.find('#cirpad-value--system-audio-lag .cirpad-value__subvalue');
    let $contentTop = $('.content.content--top'); // to see canvas when tweaking audio delay
    let isSyncingMetro = false;
    let maxAudioLagPtime = 300;
    cirpadSystemAudioLag.onInput = function(audioLagBratios){
      if (audioLagBratios[2]) {
        //enable metronome on all devices during SystemAudioLag tuning
        teplite.setEmit('isSyncingMetro', true, cirpadSystemAudioLag);
        if (!isSyncingMetro) {
          isSyncingMetro = true;
          $contentTop.addClass('content--see-through');
        }
      } else {
        teplite.setEmit('isSyncingMetro', false, cirpadSystemAudioLag);
        if (isSyncingMetro) {
          isSyncingMetro = false;
          $contentTop.removeClass('content--see-through');
        }
      }
      let ptime = (audioLagBratios[0] + 1) / 2 * maxAudioLagPtime; // 0 to 300 msec;
      teplite.squareLooper.setAudioLag(ptime);
      let textSubvalue;
      if (ptime < 5) {
        textSubvalue = 'студийная аппаратура или гаджет от Apple (у них всё классно с задержкой)'
      } else if (ptime < 15) {
        textSubvalue = 'правильная звуковая карта на ПК'
      } else if (ptime < 80) {
        textSubvalue = 'звуковая карта на ПК'
      } else if (ptime < 120) {
        textSubvalue = 'правильное мобильное устройство'
      } else if (ptime < 400) {
        textSubvalue = 'мобильное устройство'
      } else {
        textSubvalue = 'скорее всего это слишком большая задержка (если используется сетевой режим, возможно, стоит попробовать уменьшить задержку на других клиентах)'
      }
      let textValue = Math.round(ptime) + ' мсек';
      $cirpadValueSystemAudioLag.text(textValue);
      $cirpadSubvalueSystemAudioLag.text(textSubvalue);
      localStorage.setItem('cirpadSystemAudioLagBratio_v2', audioLagBratios[0]);
    }
    let baseLatencyPtime = teplite.audioCtx.baseLatency * 1000; //default value from audiodriver to start with, mostly it will fit just fine
    let baseLatencyBratio = baseLatencyPtime / maxAudioLagPtime * 2 - 1; // 0 to 300 msec => -1 to 1; TODO: sync this coefs with code that parses bratio back to msec value
    let cirpadSystemAudioLagBratios = [baseLatencyBratio, 0, 0];
    let loadeCirpadSystemAudioLagBratioJson = localStorage.getItem('cirpadSystemAudioLagBratio_v2');
    if (loadeCirpadSystemAudioLagBratioJson) {
      cirpadSystemAudioLagBratios = [parseFloat(loadeCirpadSystemAudioLagBratioJson), 0, 0];
    }
    cirpadSystemAudioLag.setBratios(cirpadSystemAudioLagBratios);
    cirpadSystemAudioLag.onInput(cirpadSystemAudioLagBratios);
    //// cirpadSystemAudioLag



    ////  cirpadVideoQuality
    let $cirpadValueVideoQuality = $container.find('#cirpad-value--video-quality .cirpad-value__value');
    let $cirpadSubvalueVideoQuality = $container.find('#cirpad-value--video-quality .cirpad-value__subvalue');
    let isLudicrousMode = window.location.search === '?ludicrous-mode';
    let maxVideoQualityMultiplier = isLudicrousMode ? 4 : 1; // allow more then 100% in ludicrous mode
    cirpadVideoQuality.onInput = function(videoQualityBratios){
      let videoQualityRatio = (videoQualityBratios[0] + 1 ) / 2 * maxVideoQualityMultiplier;
      let isPressed = videoQualityBratios[2];
      if (!isPressed) { // only after user end interracts with ui, to not to spam video system reinitialisation
        teplite.setEmit('videoQualityRatio', videoQualityRatio, cirpadVideoQuality);
      }
      let textSubvalue;
      if (videoQualityRatio < 0.2) {
        textSubvalue = 'графика на уровне слабого смартфона';
      } else if (videoQualityRatio < 0.4) {
        textSubvalue = 'графика на уровне сильного смартфона';
      } else if (videoQualityRatio < 0.6) {
        textSubvalue = 'графика на уровне среднего ПК';
      } else if (videoQualityRatio < 0.8) {
        textSubvalue = 'графика на уровне мощного ПК с дискретной видеокартой';
      } else if (videoQualityRatio <= 1) {
        textSubvalue = 'а твоя видеокарта хороша! :)';
      } else {
        textSubvalue = 'вызывайте полицию!!';
      }
      let textValue = Math.round(videoQualityRatio * 100) + '%';
      $cirpadValueVideoQuality.text(textValue);
      $cirpadSubvalueVideoQuality.text(textSubvalue);
      localStorage.setItem('videoQualityRatio_v2', videoQualityRatio);
    }
    let videoQualityRatio = teplite.videoQualityRatio;
    let loadeCirpadVideoQualityRatioJson = localStorage.getItem('videoQualityRatio_v2');
    if (loadeCirpadVideoQualityRatioJson) {
      videoQualityRatio = parseFloat(loadeCirpadVideoQualityRatioJson);
    }
    let cirpadVideoQualityBratios = [videoQualityRatio / maxVideoQualityMultiplier * 2 - 1, 0, 0];

    cirpadVideoQuality.setBratios(cirpadVideoQualityBratios);
    cirpadVideoQuality.onInput(cirpadVideoQualityBratios);
    //// cirpadVideoQuality



    ////  cirpadVolumeTheme
    cirpadVolumeTheme.onInput = function(volumeThemeBratios){
      let volumeThemeRatio = (volumeThemeBratios[0] + 1 ) / 2;
      teplite.setEmit('volumeThemeRatio', volumeThemeRatio, cirpadVolumeTheme);
      localStorage.setItem('volumeThemeRatio_v2', volumeThemeRatio);
    }
    let cirpadVolumeThemeBratios = [teplite.volumeThemeRatio * 2 - 1, 0, 0];
    let loadeCirpadVolumeThemeRatioJson = localStorage.getItem('volumeThemeRatio_v2');
    if (loadeCirpadVolumeThemeRatioJson) {
      cirpadVolumeThemeBratios = [parseFloat(loadeCirpadVolumeThemeRatioJson) * 2 - 1, 0, 0];
    }
    cirpadVolumeTheme.setBratios(cirpadVolumeThemeBratios);
    cirpadVolumeTheme.onInput(cirpadVolumeThemeBratios);
    //// cirpadVolumeTheme

    ////  cirpadVolumeMetro
    cirpadVolumeMetro.onInput = function(volumeMetroBratios){
      let volumeMetroRatio = (volumeMetroBratios[0] + 1 ) / 2;
      teplite.setEmit('volumeMetroRatio', volumeMetroRatio, cirpadVolumeMetro);
      localStorage.setItem('volumeMetroRatio_v2', volumeMetroRatio);
    }
    let cirpadVolumeMetroBratios = [teplite.volumeMetroRatio * 2 - 1, 0, 0];
    let loadeCirpadVolumeMetroRatioJson = localStorage.getItem('volumeMetroRatio_v2');
    if (loadeCirpadVolumeMetroRatioJson) {
      cirpadVolumeMetroBratios = [parseFloat(loadeCirpadVolumeMetroRatioJson) * 2 - 1, 0, 0];
    }
    cirpadVolumeMetro.setBratios(cirpadVolumeMetroBratios);
    cirpadVolumeMetro.onInput(cirpadVolumeMetroBratios);
    //// cirpadVolumeMetro

    $toggle.on('click', toggle);
  }
  function toggle() {
    isExpanded = !isExpanded;
    $expander.toggleClass('options__expander--expanded', isExpanded);
    $toggleShow.toggleClass('options__expander-toggle-text--expanded', isExpanded);
    $toggleHide.toggleClass('options__expander-toggle-text--expanded', isExpanded);
    cirpadSystemAudioLag.updateSize();
    cirpadVideoQuality.updateSize();
    cirpadVolumeTheme.updateSize();
    cirpadVolumeMetro.updateSize();
  }
  init();
}
module.exports = Options;
