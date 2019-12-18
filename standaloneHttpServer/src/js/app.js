'use strict';

require('./errorer.js'); // global errorer singleton imported

////  debugBratioFnRenderer part, may be moved
{
  const DebugBratioFnRenderer = require('./debugBratioFnRenderer.js');
  let $debugBratioFnRenderer = $('.debug-bratio-fn-renderer');
  let debugBratioFnRenderer = new DebugBratioFnRenderer($debugBratioFnRenderer);
  function tstBratioFn(inputBratios) {
    return [inputBratios[0] + inputBratios[1], inputBratios[0] - inputBratios[1],
            inputBratios[0] * inputBratios[1] ];
  }

  function delayFeedbackBaseBratioFn(hazeBratios) {
    const low = 0.3;
    const midside = 0.8;
    const high = 1;
    let delayFeedbackBaseXRatio = Math.abs(hazeBratios[0]);
    let delayFeedbackBaseYRatio = Math.abs(hazeBratios[1]);
    let delayFeedbackBaseRatioLow = low - (low - high) * delayFeedbackBaseYRatio;
    let delayFeedbackBaseRatioHigh = midside - (midside - high) * delayFeedbackBaseYRatio;
    let delayFeedbackBaseRatio = delayFeedbackBaseRatioLow - (delayFeedbackBaseRatioLow - delayFeedbackBaseRatioHigh) * delayFeedbackBaseXRatio;
    return [
      delayFeedbackBaseRatio * 2 - 1,
    ];
  }

  function delayLevelBratioFn(hazeBratios) {
    const low = 0.3;
    const midside = 0.7;
    const high = 1;
    let delayLevelXRatio = Math.abs(hazeBratios[0]);
    let delayLevelYRatio = Math.abs(hazeBratios[1]);
    let delayLevelRatioLow = low - (low - high) * delayLevelYRatio;
    let delayLevelRatioHigh = midside - (midside - high) * delayLevelYRatio;
    let delayLevelRatio = delayLevelRatioLow - (delayLevelRatioLow - delayLevelRatioHigh) * delayLevelXRatio;
    return [
      delayLevelRatio * 2 - 1,
    ];
  }

  debugBratioFnRenderer.process(delayLevelBratioFn);
  //debugBratioFnRenderer.process(tstBratioFn);
}
//// /debugBratioFnRenderer part, may be moved

require('./teplite.js'); // global teplite singleton imported
teplite.initPromise.then(()=>{
  teplite.gritter.addGrit('Начинаем');
  // TODO: goto teplite, same as gritter
  const Connector = require('./connector.js');
  let connector = new Connector($('.connector'));

  const Faq = require('./faq.js');
  let faq = new Faq($('.faq'));

  const HazeAutopilot = require('./hazeAutopilot.js');
  const DevdosAutopilot = require('./devdosAutopilot.js');

  const Cirpad = require('./cirpad.js');
  const RemotedCirpad = require('./remotedCirpad.js');

  let cirpadSystemAudioLag = new Cirpad($('#cirpad--system-audio-lag'), 'hor');
  let cirpadVideoQuality = new Cirpad($('#cirpad--video-quality'), 'hor');

  let cirpadVolumeTheme = new Cirpad($('#cirpad--volume-theme'), 'hor');
  let cirpadVolumeMetro = new Cirpad($('#cirpad--volume-metro'), 'hor');

  const cirpadInfos = require('./text/cirpadInfos.js');

  let hazeAutopilot = new HazeAutopilot();
  let remotedCirpadHaze = new RemotedCirpad($('#remoted-cirpad--haze'), 'rect', null, hazeAutopilot);
  remotedCirpadHaze.onInfo = function(){
    teplite.informer.showInformer(cirpadInfos.haze);
  };
  let powerAutopilot = new HazeAutopilot();
  let remotedCirpadPower = new RemotedCirpad($('#remoted-cirpad--power'), 'hor', null, powerAutopilot);
  remotedCirpadPower.onInfo = function(){
    teplite.informer.showInformer(cirpadInfos.power);
  };
  let devunoAutopilot = new DevdosAutopilot();
  let remotedCirpadDevuno = new RemotedCirpad($('#remoted-cirpad--devuno'), 'hor', 7, devunoAutopilot);
  remotedCirpadDevuno.onInfo = function(){
    teplite.informer.showInformer(cirpadInfos.devuno);
  };
  let devdosAutopilot = new DevdosAutopilot();
  let remotedCirpadDevdos = new RemotedCirpad($('#remoted-cirpad--devdos'), 'hor', 6, devdosAutopilot);
  remotedCirpadDevdos.onInfo = function(){
    teplite.informer.showInformer(cirpadInfos.devdos);
  };
  let devtreAutopilot = new DevdosAutopilot();
  let remotedCirpadDevtre = new RemotedCirpad($('#remoted-cirpad--devtre'), 'circle', null, devtreAutopilot);
  remotedCirpadDevtre.onInfo = function(){
    teplite.informer.showInformer(cirpadInfos.devtre);
  };
  let devquaAutopilot = new DevdosAutopilot();
  let remotedCirpadDevqua = new RemotedCirpad($('#remoted-cirpad--devqua'), 'hor', null, devquaAutopilot);
  remotedCirpadDevqua.onInfo = function(){
    teplite.informer.showInformer(cirpadInfos.devqua);
  };
  let devquiAutopilot = new DevdosAutopilot();
  let remotedCirpadDevqui = new RemotedCirpad($('#remoted-cirpad--devqui'), 'circle', null, devquiAutopilot);
  remotedCirpadDevqui.onInfo = function(){
    teplite.informer.showInformer(cirpadInfos.devqui);
  };

  teplite.on('remoteHazeBratios', (remoteHazeBratios)=>{
    remotedCirpadHaze.setRemoteBratios(remoteHazeBratios);
  });
  teplite.on('remotePowerBratios', (remotePowerBratios)=>{
    remotedCirpadPower.setRemoteBratios(remotePowerBratios);
  });
  teplite.on('remoteDevunoBratios', (remoteDevunoBratios)=>{
    remotedCirpadDevuno.setRemoteBratios(remoteDevunoBratios);
  });
  teplite.on('remoteDevdosBratios', (remoteDevdosBratios)=>{
    remotedCirpadDevdos.setRemoteBratios(remoteDevdosBratios);
  });
  teplite.on('remoteDevtreBratios', (remoteDevtreBratios)=>{
    remotedCirpadDevtre.setRemoteBratios(remoteDevtreBratios);
  });
  teplite.on('remoteDevquaBratios', (remoteDevquaBratios)=>{
    remotedCirpadDevqua.setRemoteBratios(remoteDevquaBratios);
  });
  teplite.on('remoteDevquiBratios', (remoteDevquiBratios)=>{
    remotedCirpadDevqui.setRemoteBratios(remoteDevquiBratios);
  });

  teplite.on('remoteHazeIsAutopilot', (remoteHazeIsAutopilot)=>{
    remotedCirpadHaze.setRemoteIsAutopilot(remoteHazeIsAutopilot);
  });
  teplite.on('remotePowerIsAutopilot', (remotePowerIsAutopilot)=>{
    remotedCirpadPower.setRemoteIsAutopilot(remotePowerIsAutopilot);
  });
  teplite.on('remoteDevunoIsAutopilot', (remoteDevunoIsAutopilot)=>{
    remotedCirpadDevuno.setRemoteIsAutopilot(remoteDevunoIsAutopilot);
  });
  teplite.on('remoteDevdosIsAutopilot', (remoteDevdosIsAutopilot)=>{
    remotedCirpadDevdos.setRemoteIsAutopilot(remoteDevdosIsAutopilot);
  });
  teplite.on('remoteDevtreIsAutopilot', (remoteDevtreIsAutopilot)=>{
    remotedCirpadDevtre.setRemoteIsAutopilot(remoteDevtreIsAutopilot);
  });
  teplite.on('remoteDevquaIsAutopilot', (remoteDevquaIsAutopilot)=>{
    remotedCirpadDevqua.setRemoteIsAutopilot(remoteDevquaIsAutopilot);
  });
  teplite.on('remoteDevquiIsAutopilot', (remoteDevquiIsAutopilot)=>{
    remotedCirpadDevqui.setRemoteIsAutopilot(remoteDevquiIsAutopilot);
  });


  let autopilotTickIntervalId = setInterval(()=>{ //
    remotedCirpadHaze.tick();
    remotedCirpadPower.tick();
    remotedCirpadDevuno.tick();
    remotedCirpadDevdos.tick();
    remotedCirpadDevtre.tick();
    remotedCirpadDevqua.tick();
    remotedCirpadDevqui.tick();
  }, 50); // TODO rework
  teplite.on('halt', (halt) => {
    if (halt) { clearInterval(autopilotTickIntervalId); }
  });


  teplite.squareTimer.holoLaglessHexthCallback = function(beatNum) {
    //let atime = teplite.audioCtx.currentTime - teplite.squareTimer.partyStartedAtime;
    //let holoLaglessNettoAtime = atime + teplite.systemLag.holoPtime;
    //let timeError = holoLaglessNettoAtime - beatNum / teplite.optionset.bpm * 60;
    let totalFloorSquareNum = Math.floor(beatNum / 16);
    let modWholeNumMod = Math.floor((beatNum / 4) % 4);
    let modBeatNumMod = Math.floor(beatNum % 4);
    let modHexthNumMod = Math.floor((beatNum * 4) % 4);
    $beatTimeDisplay.text((modWholeNumMod + 1) + ' : ' + (modBeatNumMod + 1) + ' : ' + (modHexthNumMod + 1));
    // +1 because of one-based holo
  }
  teplite.squareTimer.holoLaglessSquareCallback = function(beatNum) {
    $powerMeterScale.style = {
      width: remotedCirpadPower.bratios
    }
  }
  teplite.squareTimer.audioLaglessBeatCallback = function(beatNum) {
    //let atime = teplite.audioCtx.currentTime - teplite.squareTimer.partyStartedAtime;
    //let audioLaglessNettoAtime = atime + teplite.systemLag.audioPtime;
    //let timeError = audioLaglessNettoAtime - beatNum / teplite.optionset.bpm * 60;
    remotedCirpadHaze.stepAudioLaglessBeat(beatNum);
    remotedCirpadPower.stepAudioLaglessBeat(beatNum);
    remotedCirpadDevuno.stepAudioLaglessBeat(beatNum);
    remotedCirpadDevdos.stepAudioLaglessBeat(beatNum);
    remotedCirpadDevtre.stepAudioLaglessBeat(beatNum);
    remotedCirpadDevqua.stepAudioLaglessBeat(beatNum);
    remotedCirpadDevqui.stepAudioLaglessBeat(beatNum);
  }
  teplite.squareTimer.audioLaglessSquareCallback = function(beatNum) {
  }

  teplite.squareTimer.audioSafeHexthCallback = function(beatNum) {
    remotedCirpadHaze.stepAudioSafeHexth(beatNum);
    remotedCirpadPower.stepAudioSafeHexth(beatNum);
    remotedCirpadDevuno.stepAudioSafeHexth(beatNum);
    remotedCirpadDevdos.stepAudioSafeHexth(beatNum);
    remotedCirpadDevtre.stepAudioSafeHexth(beatNum);
    remotedCirpadDevqua.stepAudioSafeHexth(beatNum);
    remotedCirpadDevqui.stepAudioSafeHexth(beatNum);
    teplite.squareLooper.stepAudioSafeHexth(beatNum);
  }
  teplite.squareTimer.audioSafeBeatCallback = function(beatNum) {
    teplite.squareLooper.stepAudioSafeBeat(beatNum);
  }
  teplite.squareTimer.audioSafeSquareCallback = function(beatNum) {
    // TODO: subscribe on safeSquareCallback in squareLooper (or even is audiosample), since teplite.squareTimer is already there
    // or even make patryStartedAtime and stuff global, to avoid dependency injection
    teplite.squareLooper.stepAudioSafeSquare(beatNum);
  }

  teplite.timeSyncer.onTimePingUpdate = function(progressRatio) {
    $lagDisplay.text('progressRatio: '+ JSON.stringify(progressRatio));
    teplite.statusbar.setNetPtimeLagMeanReadyRatio(progressRatio);
    teplite.statusbar.setCsPtimeLagDeviationReadyRatio(progressRatio);
  }
  teplite.timeSyncer.onPadSyncUpdate = function(progressRatio) {
    $diffDisplay.text('progressRatio: '+ JSON.stringify(progressRatio));
    teplite.statusbar.setPaDiffDeviationReadyRatio(progressRatio);
  }
  teplite.timeSyncer.onTimePingEnd = function() {
    reportLagsStat();
  }
  teplite.timeSyncer.onPadSyncEnd = function() {
    reportDiffsStat();
  }



  remotedCirpadHaze.onUpdateBratios = function(hazeBratios){
    teplite.setEmit('hazeBratios', hazeBratios, remotedCirpadHaze);
  }
  remotedCirpadHaze.onUpdateRemoteBratios = function(remoteHazeBratios){
    teplite.setEmit('remoteHazeBratios', remoteHazeBratios, remotedCirpadHaze);
  }

  remotedCirpadPower.onUpdateBratios = function(powerBratios){
    teplite.setEmit('powerBratios', powerBratios, remotedCirpadPower);

  }
  remotedCirpadPower.onUpdateRemoteBratios = function(remotePowerBratios){
    teplite.setEmit('remotePowerBratios', remotePowerBratios, remotedCirpadPower);
  }

  remotedCirpadDevuno.onUpdateBratios = function(devunoBratios){
    teplite.setEmit('devunoBratios', devunoBratios, remotedCirpadDevuno);
  }
  remotedCirpadDevuno.onUpdateRemoteBratios = function(remoteDevunoBratios){
    teplite.setEmit('remoteDevunoBratios', remoteDevunoBratios, remotedCirpadDevuno);
  }

  remotedCirpadDevdos.onUpdateBratios = function(devdosBratios){
    teplite.setEmit('devdosBratios', devdosBratios, remotedCirpadDevdos);
  }
  remotedCirpadDevdos.onUpdateRemoteBratios = function(remoteDevdosBratios){
    teplite.setEmit('remoteDevdosBratios', remoteDevdosBratios, remotedCirpadDevdos);
  }

  remotedCirpadDevtre.onUpdateBratios = function(devtreBratios){
    teplite.setEmit('devtreBratios', devtreBratios, remotedCirpadDevtre);
  }
  remotedCirpadDevtre.onUpdateRemoteBratios = function(remoteDevtreBratios){
    teplite.setEmit('remoteDevtreBratios', remoteDevtreBratios, remotedCirpadDevtre);
  }

  remotedCirpadDevqua.onUpdateBratios = function(devquaBratios){
    teplite.setEmit('devquaBratios', devquaBratios, remotedCirpadDevqua);
  }
  remotedCirpadDevqua.onUpdateRemoteBratios = function(remoteDevquaBratios){
    teplite.setEmit('remoteDevquaBratios', remoteDevquaBratios, remotedCirpadDevqua);
  }

  remotedCirpadDevqui.onUpdateBratios = function(devquiBratios){
    teplite.setEmit('devquiBratios', devquiBratios, remotedCirpadDevqui);
  }
  remotedCirpadDevqui.onUpdateRemoteBratios = function(remoteDevquiBratios){
    teplite.setEmit('remoteDevquiBratios', remoteDevquiBratios, remotedCirpadDevqui);
  }




  remotedCirpadHaze.onUpdateIsAutopilot = function(hazeIsAutopilot){
    teplite.setEmit('hazeIsAutopilot', hazeIsAutopilot, remotedCirpadHaze);
  }
  remotedCirpadHaze.onUpdateRemoteIsAutopilot = function(remoteHazeIsAutopilot){
    teplite.setEmit('remoteHazeIsAutopilot', remoteHazeIsAutopilot, remotedCirpadHaze);
  }

  remotedCirpadPower.onUpdateIsAutopilot = function(powerIsAutopilot){
    teplite.setEmit('powerIsAutopilot', powerIsAutopilot, remotedCirpadPower);
  }
  remotedCirpadPower.onUpdateRemoteIsAutopilot = function(remotePowerIsAutopilot){
    teplite.setEmit('remotePowerIsAutopilot', remotePowerIsAutopilot, remotedCirpadPower);
  }

  remotedCirpadDevuno.onUpdateIsAutopilot = function(devunoIsAutopilot){
    teplite.setEmit('devunoIsAutopilot', devunoIsAutopilot, remotedCirpadDevuno);
  }
  remotedCirpadDevuno.onUpdateRemoteIsAutopilot = function(remoteDevunoIsAutopilot){
    teplite.setEmit('remoteDevunoIsAutopilot', remoteDevunoIsAutopilot, remotedCirpadDevuno);
  }

  remotedCirpadDevdos.onUpdateIsAutopilot = function(devdosIsAutopilot){
    teplite.setEmit('devdosIsAutopilot', devdosIsAutopilot, remotedCirpadDevdos);
  }
  remotedCirpadDevdos.onUpdateRemoteIsAutopilot = function(remoteDevdosIsAutopilot){
    teplite.setEmit('remoteDevdosIsAutopilot', remoteDevdosIsAutopilot, remotedCirpadDevdos);
  }

  remotedCirpadDevtre.onUpdateIsAutopilot = function(devtreIsAutopilot){
    teplite.setEmit('devtreIsAutopilot', devtreIsAutopilot, remotedCirpadDevtre);
  }
  remotedCirpadDevtre.onUpdateRemoteIsAutopilot = function(remoteDevtreIsAutopilot){
    teplite.setEmit('remoteDevtreIsAutopilot', remoteDevtreIsAutopilot, remotedCirpadDevtre);
  }

  remotedCirpadDevqua.onUpdateIsAutopilot = function(devquaIsAutopilot){
    teplite.setEmit('devquaIsAutopilot', devquaIsAutopilot, remotedCirpadDevqua);
  }
  remotedCirpadDevqua.onUpdateRemoteIsAutopilot = function(remoteDevquaIsAutopilot){
    teplite.setEmit('remoteDevquaIsAutopilot', remoteDevquaIsAutopilot, remotedCirpadDevqua);
  }

  remotedCirpadDevqui.onUpdateIsAutopilot = function(devquiIsAutopilot){
    teplite.setEmit('devquiIsAutopilot', devquiIsAutopilot, remotedCirpadDevqui);
  }
  remotedCirpadDevqui.onUpdateRemoteIsAutopilot = function(remoteDevquiIsAutopilot){
    teplite.setEmit('remoteDevquiIsAutopilot', remoteDevquiIsAutopilot, remotedCirpadDevqui);
  }



  ////  cirpadSystemAudioLag
  let $cirpadValueSystemAudioLag = $('#cirpad-value--system-audio-lag .cirpad-value__value');
  let $cirpadSubvalueSystemAudioLag = $('#cirpad-value--system-audio-lag .cirpad-value__subvalue');
  let $contentTop = $('.content.content--top'); // to see canvas when tweaking audio delay
  let isSyncingMetro = false;
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
    let ptime = (audioLagBratios[0] + 1) * 250; // 0 to 500
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
    localStorage.setItem('cirpadSystemAudioLagBratio', audioLagBratios[0]);
  }
  let cirpadSystemAudioLagBratios = [-0.9,0];
  let loadeCirpadSystemAudioLagBratioJson = localStorage.getItem('cirpadSystemAudioLagBratio');
  if (loadeCirpadSystemAudioLagBratioJson) {
    cirpadSystemAudioLagBratios = [parseFloat(loadeCirpadSystemAudioLagBratioJson), 0];
  }
  cirpadSystemAudioLag.setBratios(cirpadSystemAudioLagBratios);
  cirpadSystemAudioLag.onInput(cirpadSystemAudioLagBratios);
  //// cirpadSystemAudioLag



  ////  cirpadVideoQuality
  let $cirpadValueVideoQuality = $('#cirpad-value--video-quality .cirpad-value__value');
  let $cirpadSubvalueVideoQuality = $('#cirpad-value--video-quality .cirpad-value__subvalue');
  cirpadVideoQuality.onInput = function(videoQualityBratios){
    let videoQualityRatio = (videoQualityBratios[0] + 1 ) / 2;
    let isPressed = videoQualityBratios[2];
    if (!isPressed) { // only after user end interracts with ui, to not to spam video system reinitialisation
      teplite.setEmit('videoQualityRatio', videoQualityRatio, cirpadVideoQuality);
    }
    let textSubvalue;
    if (videoQualityRatio < 0.2) {
      textSubvalue = 'графика на уровне слабого смартфона'
    } else if (videoQualityRatio < 0.4) {
      textSubvalue = 'графика на уровне сильного смартфона'
    } else if (videoQualityRatio < 0.6) {
      textSubvalue = 'графика на уровне среднего ПК'
    } else if (videoQualityRatio < 0.8) {
      textSubvalue = 'графика на уровне мощного ПК с дискретной видеокартой'
    } else {
      textSubvalue = 'а твоя видеокарта хороша! :)'
    }
    let textValue = Math.round(videoQualityRatio * 100) + '%';
    $cirpadValueVideoQuality.text(textValue);
    $cirpadSubvalueVideoQuality.text(textSubvalue);
    localStorage.setItem('videoQualityRatio', videoQualityRatio);
  }
  let cirpadVideoQualityBratios = [teplite.videoQualityRatio * 2 - 1, 0, 0];
  let loadeCirpadVideoQualityRatioJson = localStorage.getItem('videoQualityRatio');
  if (loadeCirpadVideoQualityRatioJson) {
    cirpadVideoQualityBratios = [parseFloat(loadeCirpadVideoQualityRatioJson) * 2 - 1, 0];
  }
  cirpadVideoQuality.setBratios(cirpadVideoQualityBratios);
  cirpadVideoQuality.onInput(cirpadVideoQualityBratios);
  //// cirpadVideoQuality



  ////  cirpadVolumeTheme
  cirpadVolumeTheme.onInput = function(volumeThemeBratios){
    let volumeThemeRatio = (volumeThemeBratios[0] + 1 ) / 2;
    teplite.setEmit('volumeThemeRatio', volumeThemeRatio, cirpadVolumeTheme);
    localStorage.setItem('volumeThemeRatio', volumeThemeRatio);
  }
  let cirpadVolumeThemeBratios = [teplite.volumeThemeRatio * 2 - 1, 0, 0];
  let loadeCirpadVolumeThemeRatioJson = localStorage.getItem('volumeThemeRatio');
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
    localStorage.setItem('volumeMetroRatio', volumeMetroRatio);
  }
  let cirpadVolumeMetroBratios = [teplite.volumeMetroRatio * 2 - 1, 0, 0];
  let loadeCirpadVolumeMetroRatioJson = localStorage.getItem('volumeMetroRatio');
  if (loadeCirpadVolumeMetroRatioJson) {
    cirpadVolumeMetroBratios = [parseFloat(loadeCirpadVolumeMetroRatioJson) * 2 - 1, 0, 0];
  }
  cirpadVolumeMetro.setBratios(cirpadVolumeMetroBratios);
  cirpadVolumeMetro.onInput(cirpadVolumeMetroBratios);
  //// cirpadVolumeMetro

  let $beatTimeDisplay = $('.beat-time-display');
  let $powerMeterScale = $('.power-meter-scale');
  let $lagDisplay = $('.debug-display--lag-display');
  let $diffDisplay = $('.debug-display--diff-display');



  function generateLagsHtml(lags) {
    let html = '';
    html = '== LAGS == </br>';
    lags.forEach((lag) => {
      Object.keys(lag).forEach((lagKey) => {
        html += lagKey;
        html += ': ';
        html += lag[lagKey];
        html += '</br>';
      });
      html += '------------</br>';
    });
    return html;
  }
  function generateDiffsHtml(diffs) {
    let html = '';
    html = '== DIFFS == </br>';
    diffs.forEach((diff) => {
      Object.keys(diff).forEach((diffKey) => {
        html += diffKey;
        html += ': ';
        html += diff[diffKey];
        html += '</br>';
      });
      html += '------------</br>';
    });
    return html;
  }

  function reportLagsStat() {

    let html = '';
    Object.keys(teplite.timeSyncer.lagsStat).forEach((lagsStatKey) => {
      if (lagsStatKey==='lags') {
        let lags = teplite.timeSyncer.lagsStat[lagsStatKey];
        //html += generateLagsHtml(lags);
      } else {
        html += lagsStatKey;
        html += ': <b>';
        html += JSON.stringify(teplite.timeSyncer.lagsStat[lagsStatKey]);
        html += '</b></br>';
      }
    });
    $lagDisplay.html(html);
    teplite.statusbar.setNetPtimeLagMean(teplite.timeSyncer.lagsStat.netPtimeLagMean);
    teplite.statusbar.setCsPtimeLagDeviation(teplite.timeSyncer.lagsStat.csPtimeLagDeviation);
  }
  function reportDiffsStat() {

    let html = '';
    Object.keys(teplite.timeSyncer.diffsStat).forEach((diffsStatKey) => {
      if (diffsStatKey==='diffs') {
        let diffs = teplite.timeSyncer.diffsStat[diffsStatKey];
        //html += generateDiffsHtml(diffs);
      } else {
        html += diffsStatKey;
        html += ': <b>';
        html += JSON.stringify(teplite.timeSyncer.diffsStat[diffsStatKey]);
        html += '</b></br>';
      }
    });
    $diffDisplay.html(html);
    teplite.statusbar.setPaDiffDeviation(teplite.timeSyncer.diffsStat.paDiffDeviation);

  }

  function toggleFullScreen() {

    if (!document.webkitFullscreenElement) {
      teplite.gritter.addGrit('Включаем полноэкранный режим');
      document.documentElement.webkitRequestFullscreen();
    } else {
      teplite.gritter.addGrit('Выключаем полноэкранный режим');
      document.webkitExitFullscreen();
    }
  }
  $('#button-fullscreen').on('click', toggleFullScreen);
  let isIos = !!navigator.platform && /iPad|iPhone|iPod/.test(navigator.platform);
  if (isIos) {
    $('#button-fullscreen').hide();
  }
  function startApp() {
    // do not forget redo same in squareLooper


    return teplite.readyPromise.then(teplite.timeSyncer.padSyncStartRoutine).then(()=>{
      teplite.squareTimer.start();
      let resyncIntervalId = setInterval(()=>{ // TODO: rework as always runned, with result smoothing
        teplite.gritter.addGrit('Ресинхронизация аудиотаймера...');
        return teplite.timeSyncer.padSyncStartRoutine().then(()=>{
          teplite.gritter.addGrit('Ресинхронизация аудиотаймера завершена');
        });
      }, 1000 * 30);
      teplite.on('halt', (halt)=>{
        if (halt) { clearInterval(resyncIntervalId); }
      });
    });


  }
  startApp();

});