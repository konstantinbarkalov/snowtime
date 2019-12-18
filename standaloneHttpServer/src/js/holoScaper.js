'use strict';
const webglUtils = require('./webglUtils.js');
const shaderSourceset = require('./shaderSourceset.js');
const Videotexture = require('./videotexture.js');
function holoScaper(holoCanvasCtx, holoCanvasWidth, holoCanvasHeight, holoCanvas) {
  let that = this;
  let lastPhisicBeatNum = null;
  let vertexShader = null;
  let fragmentShader = null;

  // setup GLSL program
  let program = null;

  // look up where the vertex data needs to go.
  let positionLocation = null;
  let texcoordLocation = null;

  // lookup uniforms
  let matrixLocation = null;
  let textureCityLocation = null;
  let textureHardLightLocation = null;
  let textureSoftLightLocation = null;
  let texture0Location = null;
  let texture1Location = null;
  let texture2Location = null;
  let texture3Location = null;
  let texture4Location = null;
  let color0Location = null;
  let color1Location = null;
  let color2Location = null;
  let beatNumLocation = null;
  let masterLumaFactorLocation = null;
  let hatonomFreqLocation = null;

  // Create a buffer.
  let positionBuffer = null;
  let texcoordBuffer = null;
  let videotextures = [];

  let gl = holoCanvasCtx; // just a shorten alias
  function init() {
    that.readyPromise = rebuildData();
    teplite.onSet('videoQualityRatio', () => {
      rebuildData();
    })
  }
  function rebuildData() {
    vertexShader = webglUtils.compileShader(gl, shaderSourceset.vertex.scaper, gl.VERTEX_SHADER);
    fragmentShader = webglUtils.compileShader(gl, shaderSourceset.fragment.scaper, gl.FRAGMENT_SHADER);

    // setup GLSL program
    program = webglUtils.createProgram(gl, vertexShader, fragmentShader);

    // look up where the vertex data needs to go.
    positionLocation = gl.getAttribLocation(program, "a_position");
    texcoordLocation = gl.getAttribLocation(program, "a_texcoord");

    // lookup uniforms
    matrixLocation = gl.getUniformLocation(program, "u_matrix");
    textureCityLocation = gl.getUniformLocation(program, "u_texture_city");
    textureHardLightLocation = gl.getUniformLocation(program, "u_textureHardLight");
    textureSoftLightLocation = gl.getUniformLocation(program, "u_textureSoftLight");
    texture0Location = gl.getUniformLocation(program, "u_texture0");
    texture1Location = gl.getUniformLocation(program, "u_texture1");
    texture2Location = gl.getUniformLocation(program, "u_texture2");
    texture3Location = gl.getUniformLocation(program, "u_texture3");
    texture4Location = gl.getUniformLocation(program, "u_texture4");
    color0Location = gl.getUniformLocation(program, "u_color0");
    color1Location = gl.getUniformLocation(program, "u_color1");
    color2Location = gl.getUniformLocation(program, "u_color2");
    beatNumLocation = gl.getUniformLocation(program, "u_beatNum");
    masterLumaFactorLocation = gl.getUniformLocation(program, "u_masterLumaFactor");
    hatonomFreqLocation = gl.getUniformLocation(program, "u_hatonomFreq");

    // Create a buffer.
    positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    // Put a unit quad in the buffer
    let positions = [
      0, 0,
      0, 1,
      1, 0,
      1, 0,
      0, 1,
      1, 1,
    ]
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

    // Create a buffer for texture coords
    texcoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, texcoordBuffer);

    // Put texcoords in the buffer
    let texcoords = [
      0, 0,
      0, 1,
      1, 0,
      1, 0,
      0, 1,
      1, 1,
    ]
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(texcoords), gl.STATIC_DRAW);

    // TODO: move somewhere
    let metaPack= {
      name: 'default videotextures pack',
      metas: [
        { url: '/img/blurscapeCity.jpg'},
        { url: '/img/blurscapeHardLight.jpg'},
        { url: '/img/blurscapeSoftLight.jpg'},
        { url: '/img/flareRevcir.jpg',
          gl: {
            textureWrapS: gl.MIRRORED_REPEAT,
            textureWrapT: gl.MIRRORED_REPEAT,
          },
        },
        { url: '/img/flareAnother.jpg',
          gl: {
            textureWrapS: gl.MIRRORED_REPEAT,
            textureWrapT: gl.MIRRORED_REPEAT,
          },
        },
        { url: '/img/flareLine.jpg',
          gl: {
            textureWrapS: gl.MIRRORED_REPEAT,
            textureWrapT: gl.CLAMP_TO_EDGE,
          },
        },
        { url: '/img/flareShift1.jpg',
          gl: {
            textureWrapS: gl.REPEAT,
            textureWrapT: gl.CLAMP_TO_EDGE,
          },
        },
        { url: '/img/flareShift2.jpg',
          gl: {
            textureWrapS: gl.REPEAT,
            textureWrapT: gl.CLAMP_TO_EDGE,
          },
        },
      ],
    }
    videotextures=[];
    return useMetaPack(metaPack, videotextures);
  }

  function useMetaPack(metaPack, videotextures) {
    //videotextures=[];
    let loadedCount = 0; // used just in progressbar (in statusbar)
    let promises = metaPack.metas.map((meta, metasId)=>{
      let videotexture = new Videotexture(meta, gl);
      videotextures[metasId] = videotexture;
      return videotexture.readyPromise.then(()=>{
        loadedCount++;
        teplite.statusbar.setVideotexturesDownloadReadyRatio(loadedCount / metaPack.metas.length);
      });
    });
    return Promise.all(promises).then(()=>{
    });
  }



  // Unlike images, textures do not have a width and height associated
  // with them so we'll pass in the width and height of the texture
  function drawImage(texWidth, texHeight, dstX, dstY, beatNum, beatHashedRgbs, masterLumaFactor) {
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, videotextures[0].texture);

    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, videotextures[1].texture);

    gl.activeTexture(gl.TEXTURE2);
    gl.bindTexture(gl.TEXTURE_2D, videotextures[2].texture);

    gl.activeTexture(gl.TEXTURE3);
    gl.bindTexture(gl.TEXTURE_2D, videotextures[3].texture);

    gl.activeTexture(gl.TEXTURE4);
    gl.bindTexture(gl.TEXTURE_2D, videotextures[4].texture);

    gl.activeTexture(gl.TEXTURE5);
    gl.bindTexture(gl.TEXTURE_2D, videotextures[5].texture);

    gl.activeTexture(gl.TEXTURE6);
    gl.bindTexture(gl.TEXTURE_2D, videotextures[6].texture);

    gl.activeTexture(gl.TEXTURE7);
    gl.bindTexture(gl.TEXTURE_2D, videotextures[7].texture);

    // Tell WebGL to use our shader program pair
    gl.useProgram(program);

    // Setup the attributes to pull data from our buffers
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
    gl.bindBuffer(gl.ARRAY_BUFFER, texcoordBuffer);
    gl.enableVertexAttribArray(texcoordLocation);
    gl.vertexAttribPointer(texcoordLocation, 2, gl.FLOAT, false, 0, 0);

    // this matirx will convert from pixels to clip space
    let matrix = mat4.create();
    mat4.ortho(matrix, 0, gl.canvas.width, gl.canvas.height, 0, -1, 1);

    // this matrix will translate our quad to dstX, dstY
    mat4.translate(matrix, matrix, vec3.fromValues(dstX, dstY, 0));

    // this matrix will scale our 1 unit quad
    // from 1 unit to texWidth, texHeight units
    mat4.scale(matrix, matrix, vec3.fromValues(texWidth, texHeight, 1));

    // Set the matrix.
    gl.uniformMatrix4fv(matrixLocation, false, matrix);

    // Tell the shader to get the texture from texture unit 0
    gl.uniform1i(textureCityLocation, 0);
    gl.uniform1i(textureHardLightLocation, 1);
    gl.uniform1i(textureSoftLightLocation, 2);
    gl.uniform1i(texture0Location, 3);
    gl.uniform1i(texture1Location, 4);
    gl.uniform1i(texture2Location, 5);
    gl.uniform1i(texture3Location, 6);
    gl.uniform1i(texture4Location, 7);
    gl.uniform4f(color0Location, beatHashedRgbs[0].r, beatHashedRgbs[0].g, beatHashedRgbs[0].b, 1);
    gl.uniform4f(color1Location, beatHashedRgbs[1].r, beatHashedRgbs[1].g, beatHashedRgbs[1].b, 1);
    gl.uniform4f(color2Location, beatHashedRgbs[2].r, beatHashedRgbs[2].g, beatHashedRgbs[2].b, 1);
    gl.uniform1f(beatNumLocation, beatNum%256);
    gl.uniform1f(masterLumaFactorLocation, masterLumaFactor);
    const hatonomFreqs = [
      1,
      2,
      4,
      6,
      8,
      12
    ]
    let hatonomFreq;
    let hatonomFreqsId = teplite.squareLooper.playingMetroAudiosamplesId;
    if (hatonomFreqsId !== null) {
      hatonomFreq = hatonomFreqs[hatonomFreqsId];
    } else {
      hatonomFreq = 0;
    }
    gl.uniform1f(hatonomFreqLocation, hatonomFreq);

    // draw the quad (2 triangles, 6 vertices)
    gl.drawArrays(gl.TRIANGLES, 0, 6);
  }

  that.readyPromise = null;
  that.phisicIteration = function(beatNum, beatHashedRgbs, hazeBratios) {
    let beatNumDiff = 0;
    if (lastPhisicBeatNum) {
      beatNumDiff = beatNum - lastPhisicBeatNum;
    }
    lastPhisicBeatNum = beatNum;
  }
  that.frameIteration = function(beatNum, beatHashedRgbs, masterLumaFactor) {
    ////  additive
    gl.blendFunc(gl.ONE, gl.ONE);
    //// /additive
    drawImage(gl.canvas.width, gl.canvas.height, 0, 0, beatNum, beatHashedRgbs, masterLumaFactor);
  }


  that.holoCanvasResize = function(newHoloCanvasWidth, newHoloCanvasHeight) {
    holoCanvasWidth = newHoloCanvasWidth;
    holoCanvasHeight = newHoloCanvasHeight;
  }
  init();
}
module.exports = holoScaper;
