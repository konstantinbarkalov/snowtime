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
  let $app = $('.app');

  // TODO: goto teplite, same as gritter
  const Connector = require('./connector.js');
  let connector = new Connector($('.connector'));

  const Faq = require('./faq.js');
  let faq = new Faq($('.faq'));

  const Options = require('./options.js');
  let options = new Options($('.options'));

  const HazeAutopilot = require('./hazeAutopilot.js');
  const DevdosAutopilot = require('./devdosAutopilot.js');


  const RemotedCirpad = require('./remotedCirpad.js');



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
    // TODO
    //$powerMeterScale.style = {
    //  width: remotedCirpadPower.bratios
    //}
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




  let $beatTimeDisplay = $('.beat-time-display');
  let $powerMeterScale = $('.power-meter-scale'); // TODO
  let $lagDisplay = $('.debug-display--lag-display');
  let $diffDisplay = $('.debug-display--diff-display');


  //// simplex-switch
  let $simplexSwitchButtonSimple = $('.simplex-switch--simple');
  let $simplexSwitchButtonConplex = $('.simplex-switch--complex');
  let isComplex = false;
  updateSimplexClasses(); // init with class modificator depending isComplex
  $simplexSwitchButtonSimple.on('click', () => {
    onSimplexSwitchToggle();
  });
  $simplexSwitchButtonConplex.on('click', () => {
    onSimplexSwitchToggle();
  });
  function onSimplexSwitchToggle() {
    isComplex = !isComplex;
    updateSimplexClasses();
    remotedCirpadHaze.updateSize();
    remotedCirpadPower.updateSize();
    remotedCirpadDevuno.updateSize();
    remotedCirpadDevdos.updateSize();
    remotedCirpadDevtre.updateSize();
    remotedCirpadDevqua.updateSize();
    remotedCirpadDevqui.updateSize();
    //TODO put in array and iterate it (and refactor all other stuff to use that array instead hardcode);
  }
  function updateSimplexClasses() {
    $app.toggleClass('app--complex', isComplex);
    $app.toggleClass('app--simple', !isComplex);
  }

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
  let $body = $('body');
  function toggleFullScreen() {
    let documentFullscreenElement =
      document.webkitFullscreenElement ||
      document.mozFullscreenElement ||
      document.msFullscreenElement ||
      document.oFullscreenElement ||
      document.fullscreenElement;
    if (!documentFullscreenElement) {
      teplite.gritter.addGrit('Включаем полноэкранный режим');
      let documentElementRequestFullscreen =
        document.documentElement.webkitRequestFullscreen ||
        document.documentElement.mozRequestFullscreen ||
        document.documentElement.msRequestFullscreen ||
        document.documentElement.oRequestFullscreen ||
        document.documentElement.requestFullscreen;
      documentElementRequestFullscreen.call(document.documentElement);
      $body.addClass('body--full-screen');
    } else {
      teplite.gritter.addGrit('Выключаем полноэкранный режим');
      let documentExitFullscreen =
        document.webkitExitFullscreen ||
        document.mozExitFullscreen ||
        document.msExitFullscreen ||
        document.oExitFullscreen ||
        document.exitFullscreen;
      documentExitFullscreen.call(document);
      $body.removeClass('body--full-screen');
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
      // reset polyforte to default, because first-time user may accidentally fade it down, while no audio is played (during download)
      remotedCirpadPower.setRemoteBratios([0, 0, 0]);

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