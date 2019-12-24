'use strict';
const ee = require('event-emitter');
//const audioCtx = require('./audioCtx.js');
// audioCtx will be loaded after audioAwaiter will be clicked
const Gritter = require('./gritter.js');
const Statusbar = require('./statusbar.js');
const SmootherGod = require('./smootherGod.js');
const SampleHouse = require('./sampleHouse.js');
const TimeSyncer = require('./timeSyncer.js');
const SquareTimer = require('./squareTimer.js');
const PsMeter = require('./psMeter.js');
const SquareLooper = require('./squareLooper.js');
const Holo = require('./holo.js');
const SioClient = require('./sioClient.js');
const Informer = require('./informer.js');
const AudioAwaiter = require('./audioAwaiter.js');
const PreloadAwaiter = require('./preloadAwaiter.js');
function Teplite() {
  let that = this;
  function preinit() {
    window.teplite = that;
    ee(that);
    that.preloadAwaiter = new PreloadAwaiter($('.preload-awaiter'), $('.app__layer'));
    that.audioAwaiter = new AudioAwaiter($('.audio-awaiter'));
    that.initPromise = that.audioAwaiter.readyPromise.then(()=>{
      that.preloadAwaiter.becomeReady(); // show app-layer here
      init();
    });
  }
  function init() {
    that.halt = false; // big red stop button (use teplite.setEmit('halt', true);)
    //that.audioCtx = audioCtx;
    // audioCtx will be loaded after audioAwaiter will be clicked
    that.hazeBratios = [0,0,0];
    that.remoteHazeBratios = [0,0,0];
    that.hazeIsAutopilot = false;
    that.remoteHazeIsAutopilot = false;
    that.powerBratios = [0,0,0];
    that.remotePowerBratios = [0,0,0];
    that.powerIsAutopilot = false;
    that.remotePowerIsAutopilot = false;
    that.devunoBratios = [0,0,0];
    that.remoteDevunoBratios = [0,0,0];
    that.devunoIsAutopilot = false;
    that.remoteDevunoIsAutopilot = false;
    that.devdosBratios = [0,0,0];
    that.remoteDevdosBratios = [0,0,0];
    that.devdosIsAutopilot = false;
    that.remoteDevdosIsAutopilot = false;
    that.devtreBratios = [0,0,0];
    that.remoteDevtreBratios = [0,0,0];
    that.devtreIsAutopilot = false;
    that.remoteDevtreIsAutopilot = false;
    that.devquaBratios = [0,0,0];
    that.remoteDevquaBratios = [0,0,0];
    that.devquaIsAutopilot = false;
    that.remoteDevquaIsAutopilot = false;
    that.devquiBratios = [0,0,0];
    that.remoteDevquiBratios = [0,0,0];
    that.devquiIsAutopilot = false;
    that.remoteDevquiIsAutopilot = false;
    that.aspectRatio = 1;
    that.rgbSeeds = [
      { r: 234 / 256, g: 12 / 256, b: 44 / 256},
      { r: 34 / 256, g: 212 / 256, b: 104 / 256},
    ];
    that.autopilotSeed = Math.random();
    that.systemLag = {
      audioPtime: 10,
      holoPtime: 0,
    }
    that.isSyncingMetro = false;
    that.volumeThemeRatio = 0.25;
    that.volumeMetroRatio = 0.0;
    that.videoQualityRatio = 0.25;
    that.pointSizeFactor = 1;
    that.stat = {
      frame: {
        ps: 30,
        dutyRatio: 0,
      },
      phisic: {
        ps: 30,
        dutyRatio: 0,
      },
      net: {
        lastSignalPtime: null,
        isConnected: false,
      }
    },
    that.optionset = {
      bpm: 60,
    }
    that.websiteStartedPtime = performance.now(); //used to wait for a prewarmMsec before panic about bad fps, e.g.
    that.prewarmMsec = 10000; // const time to wait before statusinfo's errorLevel may raise
    that.gritter = new Gritter($('.gritter'));
    that.statusbar = new Statusbar($('.statusbar'));
    that.smootherGod = new SmootherGod();
    that.sampleHouse = new SampleHouse();
    that.timeSyncer = new TimeSyncer();
    that.squareTimer = new SquareTimer();
    that.framePsMeter = new PsMeter(teplite.stat.frame);
    that.phisicPsMeter = new PsMeter(teplite.stat.phisic);
    that.squareLooper = new SquareLooper();
    that.holo = new Holo($('.holo'));
    that.sioClient = new SioClient();
    that.informer = new Informer($('.informer'));


    that.readyPromise = Promise.all([
      that.smootherGod.readyPromise || true,
      that.sampleHouse.readyPromise || true,
      that.timeSyncer.readyPromise || true,
      that.squareTimer.readyPromise || true,
      that.framePsMeter.readyPromise || true,
      that.phisicPsMeter.readyPromise || true,
      that.squareLooper.readyPromise || true,
      that.holo.readyPromise || true,
      that.audioAwaiter.readyPromise || true,
    ]).then(()=>{
      smootherGodInit();
    });
  }
  function smootherGodInit() {
    that.smootherGod.add(that.stat.frame, 'ps', 0.9);
    that.smootherGod.add(that.stat.frame, 'dutyRatio', 0.9);
    that.smootherGod.add(that.stat.phisic, 'ps', 0.9);
    that.smootherGod.add(that.stat.phisic, 'dutyRatio', 0.9);
  }
  function set(pathNodeStrings, value) {
    // be careful, it modifies (splice) original pathNodeStrings!
    if (Array.isArray(value)) {
      value = value.slice();
      // to setEmit logic (oldValue/newValue) works fine need not-a-same-reference value if array
    } else if (!!value && value.hasOwnProperty()) {
      value = Object.assign({}, value);
    }
    let oldValueKeyInParent = pathNodeStrings.splice(pathNodeStrings.length-1, 1)[0];
    let oldValueParent = pathNodeStrings.reduce((a, b) => {
      return a[b];
    }, that);
    oldValueParent[oldValueKeyInParent] = value;
    return value;
    //returns a clone of value in array or hasOwnProperty cases;
  }

  that.setEmit = function(pathString, value, setter) {
    // setter is used to to bypass self-fired events
    let pathNodeStrings = pathString.split('.');
    let oldValue = pathNodeStrings.reduce((a, b) => {
      return a[b];
    }, that);

    if (Array.isArray(oldValue) && Array.isArray(value)) {
      if (oldValue.length !== value.length) {
        set(pathNodeStrings, value);
        that.emit(pathString, value, setter);
      } else {
        for (var index = 0; index < value.length; index++) {
          if (oldValue[index] !== value[index]) {
            set(pathNodeStrings, value);
            that.emit(pathString, value, setter);
            break;
          }
        }
      }
    } else if (!!oldValue && !!value && oldValue.hasOwnProperty() && value.hasOwnProperty()) {
      let oldValueKeys = Object.keys(oldValue);
      let valueKeys = Object.keys(value);
      if (oldValueKeys.length !== valueKeys.length) {
        set(pathNodeStrings, value);
        that.emit(pathString, value, setter);
      } else {
        for (var keyIndex = 0; keyIndex < valueKeys.length; keyIndex++) {
          if (oldValueKey[keyIndex] !== valueKey[keyIndex] ||
              oldValue[oldValueKeys[keyIndex]] !== value[valueKeys[keyIndex]]) {
              // yeah, it may fire as false positive on 'same' objects with different order of keys
              // (wierd serialisation cases maybe) but fuck you.
            set(pathNodeStrings, value);
            that.emit(pathString, value, setter);
            break;
          }
        }
      }
    } else {
      if (oldValue !== value) {
        set(pathNodeStrings, value);
        that.emit(pathString, value, setter);
      }
    }
  }
  that.onSet = function(pathString, listener, setter) {
    let callback = listener;
    if (setter) {
      callback = function(value, callbackSetter) {
        if (setter !== callbackSetter) {
          listener(value, callbackSetter);
        }
      }
    }
    return that.on(pathString, callback);
  }
  preinit();
}
//ee(Teplite.prototype);
new Teplite();
// singleton instance putted to global window.teplite at begining of init (to be accessible from inner constructor)
// no module.export need