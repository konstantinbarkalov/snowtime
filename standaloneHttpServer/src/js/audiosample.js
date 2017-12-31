'use strict';
function Audiosample(meta, destination) {
  let that = this;
  let sourceNode;
  let gainNode;
  let gain = 1;
  let rate = 1;
  let isStarted = false;
  let buffer = teplite.audioCtx.createBuffer(1, 1, 22050);
;
  function init() {
    gainNode = teplite.audioCtx.createGain();
    gainNode.connect(destination);
    that.readyPromise = preload();
    // reinitSourceNode(); //lazy now
  }
  function preload() {
    return getBufferFromHttp(meta.url);
  }
  function getBufferFromHttp(url) {
    return new Promise((resolve, reject) =>{
      let request = new XMLHttpRequest();
      request.open('GET', url, true);
      request.responseType = 'arraybuffer';
      request.onload = function() {
        var audioData = request.response;
        teplite.audioCtx.decodeAudioData(audioData, (decodedBuffer) => {
          buffer = decodedBuffer;
          resolve();
        }, (e)=> {
          reject(e);
        });
      }
      request.send();
    });
  }

  function reinitSourceNode() {
    uninitSourceNode();
    initSourceNode();
  }

  function initSourceNode() {
    sourceNode = teplite.audioCtx.createBufferSource();
    sourceNode.loopStart =  meta.startAtime;
    sourceNode.loopEnd = meta.endAtime;
    sourceNode.buffer = buffer;
    sourceNode.connect(gainNode);
    sourceNode.loop = meta.isLoop;
    updateRate();
    updateGain();
  }
  function uninitSourceNode() {
    if (sourceNode) {
      sourceNode.disconnect(gainNode);
    }
  }
  function updateRate() {
    if (sourceNode) {
    sourceNode.playbackRate.value = rate;
    }
  }
  function updateGain() {
    if (gainNode) {
      gainNode.gain.value = gain;
    }
  }

  //public
  that.readyPromise = null;
  that.start = function(beatNum, beatNumOffset) {
    if (!isStarted) {
      beatNumOffset = beatNumOffset || 0;
      let partyPtime = beatNum / teplite.optionset.bpm * 60 * 1000;
      let ptime = partyPtime + teplite.squareTimer.partyStartedServerPtime + teplite.timeSyncer.lagsStat.csPtimeLagMean;
      let atime = (ptime - teplite.timeSyncer.diffsStat.paDiffMean) / 1000;
      let laglessAtime = atime - teplite.systemLag.audioPtime / 1000;
      let startAtime = laglessAtime;
      let offset = meta.startAtime + beatNumOffset / teplite.optionset.bpm * 60;
      //let currentATime = (performance.now() - teplite.timeSyncer.diffsStat.paDiffMean) / 1000;
      let currentATime = teplite.audioCtx.currentTime; // let's try tu use pure audioCtx.currentTime instead synthetic one
      if (startAtime < currentATime) {
        //teplite.gritter.addGrit(`Сэмпл опаздал на: ${(currentATime - startAtime) * 1000} мсек.`, 'warn');
        offset += currentATime - startAtime;
        startAtime = currentATime;
      } else {
      }

      isStarted = true;
      reinitSourceNode();
      sourceNode.start(startAtime, offset);
    }
  }
  that.stop = function(beatNum) {
    if (isStarted) {
      let partyPtime = beatNum / teplite.optionset.bpm * 60 * 1000;
      let ptime = partyPtime + teplite.squareTimer.partyStartedServerPtime + teplite.timeSyncer.lagsStat.csPtimeLagMean;
      let atime = (partyPtime - teplite.timeSyncer.diffsStat.paDiffMean) / 1000;
      let laglessAtime = atime - teplite.systemLag.audioPtime / 1000;
      let stopAtime = laglessAtime;
      //let currentATime = (performance.now() - teplite.timeSyncer.diffsStat.paDiffMean) / 1000;
      let currentATime = teplite.audioCtx.currentTime; // let's try tu use pure audioCtx.currentTime instead synthetic one
      if (stopAtime < currentATime) {
        //teplite.gritter.addGrit(`Сэмпл опаздал остановиться на: ${(currentATime - stopAtime) * 1000} мсек.`, 'warn');
        stopAtime = currentATime;
      } else {
      }
      isStarted = false;
      sourceNode.stop(stopAtime);
    }
  }
  that.setGain = function(newGain) {
    gain = newGain;
    updateGain();
  }
  that.setRate = function(newRate) {
    rate = newRate;
    updateRate();
  }
  init();
}
module.exports = Audiosample;