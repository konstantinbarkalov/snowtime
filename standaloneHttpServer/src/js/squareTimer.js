'use strict';
function SquareTimer() {
  let that = this;
  let isRunning = false;
  let intervalId = null;
  let lastFastTimerPartyPtime = null;
  let lastFastTimerHoloLaglessFloorHexthNum = -Infinity;
  let lastFastTimerAudioLaglessFloorHexthNum = -Infinity;
  let lastFastTimerAudioSafeFloorHexthNum = -Infinity;
  teplite.on('halt', (halt)=>{
    if (halt) { clearInterval(intervalId); }
  });
  // for inner use (must be fast as possible, like interruption code)
  function onFastTimer() {
    let partyPtime = performance.now() - teplite.squareTimer.partyStartedServerPtime - teplite.timeSyncer.lagsStat.csPtimeLagMean;


    let fastTimerTickDuration = Math.max(0, Math.min(200, partyPtime - lastFastTimerPartyPtime));
    // min in case of first run when lastFastTimerPartyPtime = 0;

    let holoLaglessNettoPtime = partyPtime + teplite.systemLag.holoPtime;
    let holoLaglessPtime = holoLaglessNettoPtime + fastTimerTickDuration;
    // fastTimerTickDuration will be nevilated via setTimeout
    let holoLaglessHexthNum = teplite.optionset.bpm * holoLaglessPtime / 1000 / 60 * 4;
    let holoLaglessFloorHexthNum = Math.floor(holoLaglessHexthNum);
    let isHoloLaglessHexthFires = (holoLaglessFloorHexthNum !== lastFastTimerHoloLaglessFloorHexthNum);
    if (isHoloLaglessHexthFires) {
      let holoLaglessFloorHexthPtime = holoLaglessFloorHexthNum  * 60 / teplite.optionset.bpm * 1000 / 4;
      let holoLaglessTimeRemains = Math.max(0, holoLaglessFloorHexthPtime - holoLaglessNettoPtime - 2); // TODO optionize -2
      // 2 = 4msec standard distcrete value (and it is always early, newer late in not intensive cases), so half of them nivelates it
      //onHoloLaglessHexth(holoLaglessFloorHexthNum);
      setTimeout(()=>{onHoloLaglessHexth(holoLaglessFloorHexthNum)}, holoLaglessTimeRemains);
    }

    let audioLaglessNettoPtime = partyPtime + teplite.systemLag.audioPtime;
    let audioLaglessPtime = audioLaglessNettoPtime + fastTimerTickDuration;
    // fastTimerTickDuration will be nevilated via setTimeout
    let audioLaglessHexthNum = teplite.optionset.bpm * audioLaglessPtime / 1000 / 60 * 4;
    let audioLaglessFloorHexthNum = Math.floor(audioLaglessHexthNum);
    let isAudioLaglessHexthFires = (audioLaglessFloorHexthNum !== lastFastTimerAudioLaglessFloorHexthNum);
    if (isAudioLaglessHexthFires) {
      let audioLaglessFloorHexthPtime = audioLaglessFloorHexthNum * 60 / teplite.optionset.bpm * 1000 / 4;
      let audioLaglessTimeRemains = Math.max(0, audioLaglessFloorHexthPtime - audioLaglessNettoPtime - 2); // TODO optionize -2
      // 2 = 4msec standard distcrete value (and it is always early, newer late in not intensive cases), so half of them nivelates it
      //onAudioLaglessHexth(audioLaglessFloorHexthNum);
      setTimeout(()=>{onAudioLaglessHexth(audioLaglessFloorHexthNum)}, audioLaglessTimeRemains);
    }

    let audioSafePtime = partyPtime + teplite.systemLag.audioPtime + fastTimerTickDuration + 10; // TODO 10
    let audioSafeHexthNum = teplite.optionset.bpm * audioSafePtime / 1000 / 60 * 4;
    let audioSafeFloorHexthNum = Math.floor(audioSafeHexthNum);
    let isAudioSafeHexthFires = (audioSafeFloorHexthNum !== lastFastTimerAudioSafeFloorHexthNum);
    if (isAudioSafeHexthFires) {
      { //  debug
        let partyPrettyNowPtime = performance.now() - teplite.squareTimer.partyStartedServerPtime - teplite.timeSyncer.lagsStat.csPtimeLagMean;
      } // /debug

      onAudioSafeHexth(audioSafeFloorHexthNum);
    }

    lastFastTimerPartyPtime = partyPtime;
    lastFastTimerHoloLaglessFloorHexthNum = holoLaglessFloorHexthNum;
    lastFastTimerAudioLaglessFloorHexthNum = audioLaglessFloorHexthNum;
    lastFastTimerAudioSafeFloorHexthNum = audioSafeFloorHexthNum;
  };

  let lastHoloLaglessFloorHexthNum = -Infinity;
  let lastHoloLaglessFloorBeatNum = -Infinity;
  let lastHoloLaglessFloorSquareNum = -Infinity;
  function onHoloLaglessHexth(hexthNum) {

    let hexthNumFloor = Math.floor(hexthNum / 1);
    let beatNumFloor = Math.floor(hexthNum / 4);
    let squareNumFloor = Math.floor(hexthNum / 64);

    if (hexthNumFloor != lastHoloLaglessFloorHexthNum) {
      if (that.holoLaglessHexthCallback) {
        that.holoLaglessHexthCallback(hexthNumFloor / 4);
      }
      lastHoloLaglessFloorHexthNum = hexthNumFloor;
    }

    if (beatNumFloor != lastHoloLaglessFloorBeatNum) {
      if (that.holoLaglessBeatCallback) {
        that.holoLaglessBeatCallback(beatNumFloor);
      }
      lastHoloLaglessFloorBeatNum = beatNumFloor;
    }

    if (squareNumFloor != lastHoloLaglessFloorSquareNum) {
      if (that.holoLaglessSquareCallback) {
        that.holoLaglessSquareCallback(squareNumFloor * 16);
      }
      lastHoloLaglessFloorSquareNum = squareNumFloor;
    }
  }

  let lastAudioLaglessFloorHexthNum = -Infinity;
  let lastAudioLaglessFloorBeatNum = -Infinity;
  let lastAudioLaglessFloorSquareNum = -Infinity;
  function onAudioLaglessHexth(hexthNum) {

    let hexthNumFloor = Math.floor(hexthNum / 1);
    let beatNumFloor = Math.floor(hexthNum / 4);
    let squareNumFloor = Math.floor(hexthNum / 64);

    if (hexthNumFloor != lastAudioLaglessFloorHexthNum) {
      if (that.audioLaglessHexthCallback) {
        that.audioLaglessHexthCallback(hexthNumFloor / 4);
      }
      lastAudioLaglessFloorHexthNum = hexthNumFloor;
    }

    if (beatNumFloor != lastAudioLaglessFloorBeatNum) {
      if (that.audioLaglessBeatCallback) {
        that.audioLaglessBeatCallback(beatNumFloor);
      }
      lastAudioLaglessFloorBeatNum = beatNumFloor;
    }

    if (squareNumFloor != lastAudioLaglessFloorSquareNum) {
      if (that.audioLaglessSquareCallback) {
        that.audioLaglessSquareCallback(squareNumFloor * 16);
      }
      lastAudioLaglessFloorSquareNum = squareNumFloor;
    }
  }

  let lastAudioSafeFloorHexthNum = -Infinity;
  let lastAudioSafeFloorBeatNum = -Infinity;
  let lastAudioSafeFloorSquareNum = -Infinity;
  function onAudioSafeHexth(hexthNum) {

    let hexthNumFloor = Math.floor(hexthNum / 1);
    let beatNumFloor = Math.floor(hexthNum / 4);
    let squareNumFloor = Math.floor(hexthNum / 64);
    if (hexthNumFloor != lastAudioSafeFloorHexthNum) {
      if (that.audioSafeHexthCallback) {
        that.audioSafeHexthCallback(hexthNumFloor / 4);
      }
      lastAudioSafeFloorHexthNum = hexthNumFloor;
    }

    if (beatNumFloor != lastAudioSafeFloorBeatNum) {
      if (that.audioSafeBeatCallback) {
        that.audioSafeBeatCallback(beatNumFloor);
      }
      lastAudioSafeFloorBeatNum = beatNumFloor;
    }

    if (squareNumFloor != lastAudioSafeFloorSquareNum) {
      if (that.audioSafeSquareCallback) {
        that.audioSafeSquareCallback(squareNumFloor * 16);
      }
      lastAudioSafeFloorSquareNum = squareNumFloor;
    }
  }
  teplite.on('squareTimer.partyStartedServerPtime', ()=>{
    teplite.gritter.addGrit('Сброс таймера (получено новое время от сервера)');
    teplite.squareTimer.reset();
  })
  // callback parameter is always beatNum (not hexth or square)
  that.holoLaglessHexthCallback = null;
  that.holoLaglessBeatCallback = null;
  that.holoLaglessSquareCallback = null;
  that.audioLaglessHexthCallback = null;
  that.audioLaglessBeatCallback = null;
  that.audioLaglessSquareCallback = null;
  that.audioSafeHexthCallback = null;
  that.audioSafeBeatCallback = null;
  that.audioSafeSquareCallback = null;
  that.partyStartedServerPtime = 0; // initially it is synced with itself - client loopback single mode


  that.start = function() {
    isRunning = true;
    that.reset();
    intervalId = setInterval(onFastTimer, 50);
  }
  that.reset = function() {
    lastFastTimerPartyPtime = 0;

    // for inner fastTimer
    lastFastTimerHoloLaglessFloorHexthNum = -Infinity;
    lastFastTimerAudioLaglessFloorHexthNum = -Infinity;
    lastFastTimerAudioSafeFloorHexthNum = -Infinity;

    // for outer sparced hexth-beat-square callback runner
    lastHoloLaglessFloorHexthNum = -Infinity;
    lastHoloLaglessFloorBeatNum = -Infinity;
    lastHoloLaglessFloorSquareNum = -Infinity;
    lastAudioLaglessFloorHexthNum = -Infinity;
    lastAudioLaglessFloorBeatNum = -Infinity;
    lastAudioLaglessFloorSquareNum = -Infinity;
    lastAudioSafeFloorHexthNum = -Infinity;
    lastAudioSafeFloorBeatNum = -Infinity;
    lastAudioSafeFloorSquareNum = -Infinity;
  }
  that.stop = function() {
    clearInterval(intervalId);
    isRunning = false;
  }
}
module.exports = SquareTimer;