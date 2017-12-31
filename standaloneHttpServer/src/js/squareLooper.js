'use strict';
const Audiosample = require('./audiosample.js');
const Delayer = require('./delayer.js');
const PassFilter = require('./passFilter.js');
function SquareLooper() {

  let that=this;
  let themeAudiosamples=[];
  let metroAudiosamples=[];
  let themeInput = null;
  let output = null;
  let themeMaster = null;
  let metroMaster = null;
  let delayer = null;
  let passFilter = null;
  function init() {
    themeInput = teplite.audioCtx.createGain();

    output = teplite.audioCtx.createGain();
    output.connect(teplite.audioCtx.destination);

    themeMaster = teplite.audioCtx.createGain();
    themeMaster.connect(output);

    teplite.onSet('volumeThemeRatio', ()=>{
      themeMaster.gain.value = teplite.volumeThemeRatio;
    })
    themeMaster.gain.value = teplite.volumeThemeRatio;

    metroMaster = teplite.audioCtx.createGain();
    metroMaster.connect(output);

    teplite.onSet('volumeMetroRatio', ()=>{
      metroMaster.gain.value = teplite.volumeMetroRatio;
    })
    metroMaster.gain.value = teplite.volumeMetroRatio;

    teplite.onSet('isSyncingMetro', ()=>{
      if (teplite.isSyncingMetro) {
        themeMaster.gain.value = 0;
        metroMaster.gain.value = 0.75;
      } else {
        themeMaster.gain.value = teplite.volumeThemeRatio;
        metroMaster.gain.value = teplite.volumeMetroRatio;
      }
    })


    delayer = new Delayer();
    delayer.output.connect(themeMaster);



    passFilter = new PassFilter();
    themeInput.connect(passFilter.input);
    passFilter.output.connect(themeMaster);
    passFilter.output.connect(delayer.input);

    themeAudiosamples=[];
    that.readyPromise = useMetaPackSerial(teplite.sampleHouse.metaPacks[0], themeAudiosamples, themeInput, 0.24).then(()=>{
      metroAudiosamples=[];
      return useMetaPackSerial(teplite.sampleHouse.metaPacks[1], metroAudiosamples, metroMaster, 0.24);
    });
    tick(); // to set biquad*Filter.frequency.value
    let tickIntervalId = setInterval(tick, 50); // TODO remove, wrap or refactor to audio events
    teplite.on('halt', (halt) => {
      if (halt) { clearInterval(tickIntervalId); }
    });
  }
  function useMetaPackSerial(metaPack, audiosamples, destination, initialGain) {
    //audiosamples=[];
    return useMetaPackSerialIteration(metaPack, 0, audiosamples, destination, initialGain).then(()=>{
    });
  }
  function useMetaPackSerialIteration(metaPack, metasId, audiosamples, destination, initialGain) {
    initialGain = initialGain || 0.4; // TODO: refactor it
    let meta = metaPack.metas[metasId];
    let audiosample = new Audiosample(meta, destination);
    audiosample.setGain(initialGain); // TODO: refactor it
    audiosamples[metasId] = audiosample;
    return audiosample.readyPromise.then(()=>{
      let maxMetasId = metaPack.metas.length;
      teplite.statusbar.setAudiosamplesDownloadReadyRatio((metasId + 1) / maxMetasId);
      if ((metasId + 1) < maxMetasId) {
        return useMetaPackSerialIteration(metaPack, metasId + 1, audiosamples, destination, initialGain);
      } else {
        return true;
      }
    });
  }

  function tick() { // TODO: rework tick complelely
    let ptime = performance.now();
    let partyPtime = ptime - teplite.timeSyncer.lagsStat.csPtimeLagMean - teplite.squareTimer.partyStartedServerPtime + teplite.systemLag.audioPtime;
    let beatNum = partyPtime / 1000 / 60 * teplite.optionset.bpm;
    delayer.stepTick(beatNum); // TODO: rework tick complelely
    passFilter.tick(beatNum, teplite.hazeBratios);
  }

  // wire up buttons to stop and play audio, and range slider control

  //public
  that.readyPromise = null; // will set on init

  that.playingThemeAudiosamples = [];
  // used to keep for isSyncingMetro situation, when audiosamples need to replay with some shift
  that.stepAudioSafeSquare = function(beatNum) {
    themeAudiosamples.forEach((themeAudiosample)=>{ themeAudiosample.stop(beatNum) });
    let powerBaseRatio = (teplite.powerBratios[0] + 1) / 2;
    let powerRatio = Math.pow(powerBaseRatio, 2);
    let targetStartingLoopsCount = (0.75 + Math.random()) * 10 * powerRatio;
    let startingLoopsCount = Math.round(targetStartingLoopsCount);
    that.playingThemeAudiosamples = [];
    for (var themeAudiosampleStartIter = 0; themeAudiosampleStartIter < startingLoopsCount; themeAudiosampleStartIter++) {
      let themeAudiosamplesId = Math.floor(Math.random()*themeAudiosamples.length);
      let themeAudiosample = themeAudiosamples[themeAudiosamplesId];
      if (!themeAudiosample) {
        throw new Error('no themeAudiosample!!');
      }
      themeAudiosamples[themeAudiosamplesId].start(beatNum);
      that.playingThemeAudiosamples[themeAudiosampleStartIter] = themeAudiosample;
    }
  }
  that.stepAudioSafeBeat = function(beatNum) {
  }
  that.playingMetroAudiosamplesId = null;
  that.stepAudioSafeHexth = function(beatNum) {
    if (teplite.isSyncingMetro) {
      let floorBeatNum = Math.floor(beatNum / 16) * 16;
      let beatNumOffset = beatNum - floorBeatNum;
      for (let playingThemeAudiosamplesId = 0; playingThemeAudiosamplesId < that.playingThemeAudiosamples.length; playingThemeAudiosamplesId++) {
        let playingThemeAudiosample = that.playingThemeAudiosamples[playingThemeAudiosamplesId];
        playingThemeAudiosample.stop(beatNum);
        playingThemeAudiosample.start(beatNum, beatNumOffset);
      }
    }
    //  hats
    if (metroAudiosamples.length) { // may be not loaded (be empty []) at very begining
      if (Math.floor(beatNum * 4) % 2 === 0) {
        if (teplite.devdosBratios[2] || teplite.isSyncingMetro) { // if pressed - it sounds
          let floorBeatNum = Math.floor(beatNum / 2) * 2;
          let beatNumOffset = beatNum - floorBeatNum;
          //metroAudiosamples.forEach((metroAudiosample)=>{ metroAudiosample.stop(0) });
          let metroAudiosampleRatio = teplite.devdosBratios[0] / 2 + 0.5;
          let metroAudiosamplesId = Math.round(metroAudiosampleRatio * (metroAudiosamples.length - 1));
          if (teplite.isSyncingMetro) {
            metroAudiosamplesId = 0;
          }
          if (metroAudiosamplesId !== that.playingMetroAudiosamplesId || teplite.isSyncingMetro) {
            if (that.playingMetroAudiosamplesId !== null) {
              metroAudiosamples[that.playingMetroAudiosamplesId].stop(beatNum);
              //metroAudiosamples[that.playingMetroAudiosamplesId].stop(0);
            }
            metroAudiosamples[metroAudiosamplesId].start(beatNum, beatNumOffset);
            //metroAudiosamples[metroAudiosamplesId].start(floorBeatNum);
            that.playingMetroAudiosamplesId = metroAudiosamplesId;
          }
        } else {  // if not pressed - silence
          if (that.playingMetroAudiosamplesId !== null) {
            metroAudiosamples[that.playingMetroAudiosamplesId].stop(beatNum);
          }
          //  TODO: FIX THIS!!
          metroAudiosamples.forEach((metroAudiosample) => {
            metroAudiosample.stop(beatNum);
          });
          // /TODO: FIX THIS!!
          that.playingMetroAudiosamplesId = null;
        }
      }
    }
    //
    // /hats
    delayer.stepAudioSafeHexth(beatNum);
  }
  that.setAudioLag = function(audioPtime) {
    teplite.systemLag.audioPtime = audioPtime; // dirty :(
  }
  init();
}

module.exports = SquareLooper;