'use strict';
const canvasWidth = 256;
const canvasHeight = 256;
function DebugBratioFnRenderer($container) {
  let that = this;
  function rgb2hsv (rgb) {
    let hsv = {
      h: 0,
      s: 0,
      v: 0,
    }
    let minRgb = Math.min(rgb.r,Math.min(rgb.g,rgb.b));
    let maxRgb = Math.max(rgb.r,Math.max(rgb.g,rgb.b));
    // Black-gray-white
    if (minRgb==maxRgb) {
     hsv.v = minRgb;
     return [0, 0, hsv.v];
    }
    // Colors other than black-gray-white:
    let dd = (rgb.r==minRgb) ? rgb.g-rgb.b : ((rgb.b==minRgb) ? rgb.r-rgb.g : rgb.b-rgb.r);
    let hh = (rgb.r==minRgb) ? 3 : ((rgb.b==minRgb) ? 1 : 5);
    hsv.h = 60*(hh - dd/(maxRgb - minRgb));
    hsv.s = (maxRgb - minRgb)/maxRgb;
    hsv.v = maxRgb;
    return [hsv.h, hsv.s, hsv.v];
  }

  function hsv2rgb(hsv) {
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


  function createCanvas() {
    let $canvas = $('<canvas></canvas>');
    let canvas = $canvas[0];
    let canvasCtx = canvas.getContext('2d');
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    $container.append($canvas);
    return canvasCtx;
  }
  function clearContainer() {
    $container.empty()
  }
  function render(canvasCtx, bratioFn, rgbFn, bratiosIndex) {
    {
      canvasCtx.save();
      canvasCtx.transform(canvasWidth, 0, 0, canvasHeight, 0, 0);
      let fillAlpha = 1;
      canvasCtx.globalAlpha = fillAlpha;
      canvasCtx.fillStyle = "#000";
      canvasCtx.fillRect(0, 0, 1, 1);
      canvasCtx.restore();
    }
    let imageData = canvasCtx.getImageData(0, 0, canvasWidth, canvasHeight);
    for (let x = 0; x < canvasWidth; x++) {
      for (let y = 0; y < canvasHeight; y++) {
        let pixelId = canvasWidth * y + x;
        let dataId = pixelId * 4;
        let xBratio = (x / canvasWidth) * 2 - 1;
        let yBratio = (y / canvasHeight) * 2 - 1;
        let xyBratios = [xBratio, yBratio];
        let outputBratio = bratioFn(xyBratios)[bratiosIndex];
        if (Math.abs(outputBratio) <= 1) {
          let rgb = rgbFn(outputBratio);
          imageData.data[dataId + 0] = rgb.r;
          imageData.data[dataId + 1] = rgb.g;
          imageData.data[dataId + 2] = rgb.b;
        } else {
          // out of bratio range erroring with color checker pattern
          let bigX = Math.floor(x / 16);
          let bigY = Math.floor(y / 16);
          let bigMod = ((bigX + bigY) % 4) / 4;
          let bigModR = (bigMod + 0) % 1;
          let bigModG = (bigMod + 0.5) % 1;
          let bigModB = (bigMod + 3.33) % 1;
          imageData.data[dataId + 0] = bigModR * 255;
          imageData.data[dataId + 1] = bigModG * 255;
          imageData.data[dataId + 2] = bigModB * 255;
        }
      }
    }
    imageData.data[0] = 244;
    canvasCtx.putImageData(imageData, 0, 0);
  }

  that.process = function (bratioFn) {
    clearContainer();
    let outputBratios = bratioFn([0,0]);
    let rgbFnGray = function(bratio) {
      let grayRatio = bratio / 2 + 0.5;
      let grayByte = grayRatio * 255;
      return {
        r: grayByte,
        g: grayByte,
        b: grayByte,
      }
    }
    let rgbFnHeat = function(bratio) {
      let grayRatio = bratio / 2 + 0.5;
      let hsv = {
        h: (1 - grayRatio)*300,
        s: 1,
        v: 0.5
      }
      let rgb = hsv2rgb(hsv);
      return {
        r: rgb.r * 255,
        g: rgb.g * 255,
        b: rgb.b * 255,
      }
    }
    outputBratios.forEach((bratio, bratiosIndex)=>{
      let canvasCtxGray = createCanvas();
      let canvasCtxHeat = createCanvas();
      render(canvasCtxGray, bratioFn, rgbFnGray, bratiosIndex);
      render(canvasCtxHeat, bratioFn, rgbFnHeat, bratiosIndex);
    });
  }
}
module.exports = DebugBratioFnRenderer;