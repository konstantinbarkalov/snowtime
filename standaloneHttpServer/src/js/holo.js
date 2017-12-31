'use strict';
const webglUtils = require('./webglUtils.js');
const HoloScaper = require('./holoScaper.js');
const HoloSnower = require('./holoSnower.js');
//// bluredCityTry
let bluredCityTryImg = new Image();
bluredCityTryImg.src = "/img/blured-city-try.jpg";
//// /bluredCityTry
function Holo($container) {
  let that = this;
  let $holoCanvasWrapper = $container.find('.holo__canvas-wrapper');
  let $holoCanvas = $container.find('.holo__canvas');
  let holoCanvas = $holoCanvas[0];
  let holoCanvasCtx = holoCanvas.getContext('webgl');
  let holoCanvasWidth = null;
  let holoCanvasHeight = null;

  let holoScaper = new HoloScaper(holoCanvasCtx, holoCanvasWidth, holoCanvasHeight, holoCanvas);
  let holoSnower = new HoloSnower(holoCanvasCtx, holoCanvasWidth, holoCanvasHeight, holoCanvas);
  // passing null as dirty defaults (will be emmidiatly setted in resize (via oninit))
  const degradeFactor = 1;
  function init() {
    $(window).on('resize', resize);
    resize();
    frameIteration(); // reloop via requestAnimationFrame inside, no need to setInterval
    let phisicIntervalId = setInterval(phisicIteration, 1000 / 60);
    teplite.on('halt', (halt)=>{
      if (halt) { clearInterval(phisicIntervalId); }
    });
    that.readyPromise = Promise.all([holoScaper.readyPromise, holoSnower.readyPromise]);
  }
  function resize() {
    holoCanvasWidth = $(window).width();
    holoCanvasHeight = $(window).height();
    holoCanvas.width  = holoCanvasWidth / degradeFactor;
    holoCanvas.height = holoCanvasHeight / degradeFactor;
    teplite.aspectRatio = holoCanvas.width / holoCanvas.height;
    holoScaper.holoCanvasResize(holoCanvasWidth / degradeFactor, holoCanvasHeight / degradeFactor);
    holoSnower.holoCanvasResize(holoCanvasWidth / degradeFactor, holoCanvasHeight / degradeFactor);
  }
  function hsv2rgb(hsv) { // TODO: move to utils
    let rgb;
    if (hsv.s === 0) {
      rgb = {
        r: hsv.v,
        g: hsv.v,
        b: hsv.v,
      }
    } else {
      let jj = hsv.h / 60;
      let ii = Math.floor(jj);
      let data = [hsv.v*(1-hsv.s), hsv.v*(1-hsv.s*(jj-ii)), hsv.v*(1-hsv.s*(1-(jj-ii)))];
      switch(ii) {
        case 0:
          rgb = {
            r: hsv.v,
            g: data[2],
            b: data[0],
          }
          break;
        case 1:
          rgb = {
            r: data[1],
            g: hsv.v,
            b: data[0],
          }
          break;
        case 2:
          rgb = {
            r: data[0],
            g: hsv.v,
            b: data[2],
          }
          break;
        case 3:
          rgb = {
            r: data[0],
            g: data[1],
            b: hsv.v,
          }
          break;
        case 4:
          rgb = {
            r: data[2],
            g: data[0],
            b: hsv.v,
          }
          break;
        default:
          rgb = {
            r: hsv.v,
            g: data[0],
            b: data[1],
          }
          break;
      }
    }
    return rgb;
  };

  function hashRgbWithBeatNum(rgbSeeds, beatNum) {
    let squareNumFloor = Math.floor(beatNum / 16);
    let squareNumMod = (beatNum / 16) % 1;

    let halfNumFloor = Math.floor(beatNum / 2);
    let halfNumMod = (beatNum / 2) % 1;

    let beatNumFloor = Math.floor(beatNum);
    let beatNumMod = (beatNum) % 1;

    let eighthNumFloor = Math.floor(beatNum * 2);
    let eighthNumMod = (beatNum * 2) % 1;

    let rgbBase = rgbSeeds[0];
    let rgbShift = rgbSeeds[1];
    let beatHashedRgbs = [
      {
        r: rgbBase.r + rgbShift.r * eighthNumMod * 0.1 + rgbShift.r * halfNumFloor * 5 + rgbShift.r * squareNumFloor * 10,
        g: rgbBase.g + rgbShift.g * eighthNumMod * 0.1 + rgbShift.g * halfNumFloor * 5 + rgbShift.g * squareNumFloor * 10,
        b: rgbBase.b + rgbShift.b * eighthNumMod * 0.1 + rgbShift.b * halfNumFloor * 5 + rgbShift.b * squareNumFloor * 10,
      },
      {
        r: rgbBase.r + rgbShift.r * halfNumMod * 0.1 + rgbShift.r * beatNumFloor * 2 + rgbShift.r * squareNumFloor * 3,
        g: rgbBase.g + rgbShift.g * halfNumMod * 0.1 + rgbShift.g * beatNumFloor * 2 + rgbShift.g * squareNumFloor * 3,
        b: rgbBase.b + rgbShift.b * halfNumMod * 0.1 + rgbShift.b * beatNumFloor * 2 + rgbShift.b * squareNumFloor * 3,
      },
      {
        r: rgbBase.r + rgbShift.r * squareNumMod * 1 + rgbShift.r * beatNumMod * 0.25 + rgbShift.r * squareNumFloor * 10,
        g: rgbBase.g + rgbShift.g * squareNumMod * 1 + rgbShift.g * beatNumMod * 0.25 + rgbShift.g * squareNumFloor * 10,
        b: rgbBase.b + rgbShift.b * squareNumMod * 1 + rgbShift.b * beatNumMod * 0.25 + rgbShift.b * squareNumFloor * 10,
      },
    ]
    for (let i = 0; i < 3; i++) {
      beatHashedRgbs[i].r = ((beatHashedRgbs[i].r % 1) + 1) % 1;
      beatHashedRgbs[i].g = ((beatHashedRgbs[i].g % 1) + 1) % 1;
      beatHashedRgbs[i].b = ((beatHashedRgbs[i].b % 1) + 1) % 1;
    }
    // geting devtre devqua hsv
    let trequaHsv = {
      h: ((Math.atan2(teplite.devtreBratios[0], teplite.devtreBratios[1]) / Math.PI * 180) % 360 + 360) % 360,
      s: 1,
      v: 1,
    }
    let trequaRadialRatio = Math.sqrt(teplite.devtreBratios[0]*teplite.devtreBratios[0] + teplite.devtreBratios[1]*teplite.devtreBratios[1]);
    let trequaRgb = hsv2rgb(trequaHsv);

    let mixRatio = 0.95 * trequaRadialRatio;
    for (let i = 0; i < 3; i++) {
      beatHashedRgbs[i].r = beatHashedRgbs[i].r - (beatHashedRgbs[i].r - trequaRgb.r) * Math.pow(mixRatio, 0.5);
      beatHashedRgbs[i].g = beatHashedRgbs[i].g - (beatHashedRgbs[i].g - trequaRgb.g) * Math.pow(mixRatio, 2);
      beatHashedRgbs[i].b = beatHashedRgbs[i].b - (beatHashedRgbs[i].b - trequaRgb.b) * Math.pow(mixRatio, 1);
    }
    return beatHashedRgbs;
  }
  function frameIteration() {
    teplite.framePsMeter.dutyIterationStart();
    let ptime = performance.now();
    let partyPtime = ptime - teplite.timeSyncer.lagsStat.csPtimeLagMean - teplite.squareTimer.partyStartedServerPtime + teplite.systemLag.holoPtime;
    let beatNum = partyPtime / 1000 / 60 * teplite.optionset.bpm;
    let beatHashedRgbs = hashRgbWithBeatNum(teplite.rgbSeeds, beatNum);

    ////  gl part
    let gl = holoCanvasCtx; // just a shorten alias
    // Tell WebGL how to convert from clip space to pixels
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.clear(gl.COLOR_BUFFER_BIT);
    ////  additive
    // No culling of back faces
    gl.disable(gl.CULL_FACE);
    // No depth testing
    gl.disable(gl.DEPTH_TEST);
    // Enable blending
    gl.enable(gl.BLEND);
    //// /additive

    let devquaRatio = (teplite.devquaBratios[0] + 1 ) / 2;
    let strobeLinearPowerRatio = Math.max(0, devquaRatio - 0.5) * 2;
    let strobePowerRatio = Math.pow(strobeLinearPowerRatio, 10);
    let strobeSine = Math.sin(beatNum * 64);
    let strobeRatio = strobePowerRatio * strobeSine + (1 - strobePowerRatio);
    let hazeLumaDiff = Math.abs(teplite.hazeBratios[0]) - Math.abs(teplite.hazeBratios[1]);
    let masterLumaFactor = Math.max(0, devquaRatio * strobeRatio + hazeLumaDiff / 10);


    holoScaper.frameIteration(beatNum, beatHashedRgbs, masterLumaFactor);
    holoSnower.frameIteration(beatNum, beatHashedRgbs, masterLumaFactor);
    //// /gl part
    if (!teplite.halt) { requestAnimationFrame(frameIteration); }
    teplite.framePsMeter.dutyIterationFinish();
  }

  function phisicIteration() {
    if (teplite.stat.frame.ps_smooth < 10) {
      return;
    }
    teplite.phisicPsMeter.dutyIterationStart();
    let ptime = performance.now();
    let partyPtime = ptime - teplite.timeSyncer.lagsStat.csPtimeLagMean - teplite.squareTimer.partyStartedServerPtime + teplite.systemLag.holoPtime;
    let beatNum = partyPtime / 1000 / 60 * teplite.optionset.bpm;
    let beatHashedRgbs = hashRgbWithBeatNum(teplite.rgbSeeds, beatNum);
    holoScaper.phisicIteration(beatNum, beatHashedRgbs, teplite.hazeBratios);
    holoSnower.phisicIteration(beatNum, beatHashedRgbs, teplite.hazeBratios);
    teplite.phisicPsMeter.dutyIterationFinish();
  }

  that.readyPromise = null;
  init();
}
module.exports = Holo;