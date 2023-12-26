'use strict';
const webglUtils = require('./webglUtils.js');
const shaderSourceset = require('./shaderSourceset.js');
const Snowflake = require('./snowflake.js');
const Videotexture = require('./videotexture.js');
function holoSnower(holoCanvasCtx, holoCanvasWidth, holoCanvasHeight, holoCanvas, mode) {
  let that = this;
  let snowflakes = [];
  let snowflakesCount = 0;
  let lastPhisicBeatNum = null;
  let vertexShader = null;
  let fragmentShader = null;

  // setup GLSL program
  let program = null;

  // look up where the vertex data needs to go.
  let positionLocation = null;
  let glVelocityLocation = null;
  let seedLocation = null;
  let beatHashedRgbsIndexLocation = null;
  // lookup uniforms
  let matrixLocation = null;
  let textureSnowflakeLocation = null;
  let textureTstLocation = null;
  let textureHardLightLocation = null;
  let textureSoftLightLocation = null;
  let pointSizeFactorLocation = null;
  let color0Location = null;
  let color1Location = null;
  let color2Location = null;
  let beatNumLocation = null;
  let masterLumaFactorLocation = null;
  let glPhisicBeatNumDiffLocation = null;
  let hatonomFreqLocation = null;

  let positions = null;
  let seeds = null;
  let velocities = null;
  let ttlRatios = null;
  let beatHashedRgbsIndexes = null;
  let glVelocities = null;
  let streakPowerRatios = null;
  // Create a buffer.
  let positionBuffer = null;
  let glVelocityBuffer = null;
  let seedBuffer = null;

  let beatHashedRgbsIndexBuffer = null;
  let videotextures = [];

  let gl = holoCanvasCtx; // just a shorten alias

  // TODO: move somewhere
  let defaultMetaPack = {
    name: 'default videotextures pack',
    metas: [
      {
        url: '/img/boketicle.jpg',
        isMipmap: true,
      },
      { url: '/img/tst.jpg'},
    ],
  }

  function init() {
    that.readyPromise = rebuildData();
    teplite.onSet('videoQualityRatio', () => {
      rebuildData();
    })
  }
  function rebuildData() {


    vertexShader = webglUtils.compileShader(gl, shaderSourceset.vertex.snow, gl.VERTEX_SHADER);
    fragmentShader = webglUtils.compileShader(gl, shaderSourceset.fragment.snow, gl.FRAGMENT_SHADER);
    snowflakesCount = Math.pow(teplite.videoQualityRatio, 2) * 13000;


    // setup GLSL program
    program = webglUtils.createProgram(gl, vertexShader, fragmentShader);

    // look up where the vertex data needs to go.
    positionLocation = gl.getAttribLocation(program, "a_position");
    glVelocityLocation = gl.getAttribLocation(program, "a_glVelocity");
    beatHashedRgbsIndexLocation = gl.getAttribLocation(program, "a_beatHashedRgbsIndex");
    seedLocation = gl.getAttribLocation(program, "a_seed");
    // lookup uniforms
    matrixLocation = gl.getUniformLocation(program, "u_matrix");
    textureSnowflakeLocation = gl.getUniformLocation(program, "u_textureSnowflake");
    textureTstLocation = gl.getUniformLocation(program, "u_textureTst");
    textureHardLightLocation = gl.getUniformLocation(program, "u_textureHardLight");
    textureSoftLightLocation = gl.getUniformLocation(program, "u_textureSoftLight");
    pointSizeFactorLocation = gl.getUniformLocation(program, "u_pointSizeFactor");
    color0Location = gl.getUniformLocation(program, "u_color0");
    color1Location = gl.getUniformLocation(program, "u_color1");
    color2Location = gl.getUniformLocation(program, "u_color2");
    beatNumLocation = gl.getUniformLocation(program, "u_beatNum");
    masterLumaFactorLocation = gl.getUniformLocation(program, "u_masterLumaFactor");
    glPhisicBeatNumDiffLocation = gl.getUniformLocation(program, "u_glPhisicBeatNumDiff");
    hatonomFreqLocation = gl.getUniformLocation(program, "u_hatonomFreq");

    positions = new Float32Array(snowflakesCount * 3);
    seeds = new Float32Array(snowflakesCount * 3);
    velocities = new Float32Array(snowflakesCount * 3);
    ttlRatios = new Float32Array(snowflakesCount);
    beatHashedRgbsIndexes = new Float32Array(snowflakesCount);
    glVelocities = new Float32Array(snowflakesCount * 3);
    streakPowerRatios = new Float32Array(snowflakesCount);

    snowflakes = [];
    for (var snowflakesIndex = 0; snowflakesIndex < snowflakesCount; snowflakesIndex++) {
      snowflakes[snowflakesIndex] = new Snowflake(snowflakesIndex, positions, seeds, velocities, ttlRatios, beatHashedRgbsIndexes, glVelocities, streakPowerRatios);
    }

    // Create a buffer.
    positionBuffer = gl.createBuffer();
    glVelocityBuffer = gl.createBuffer();
    seedBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, seedBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, seeds, gl.STATIC_DRAW);

    beatHashedRgbsIndexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, beatHashedRgbsIndexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, beatHashedRgbsIndexes, gl.STATIC_DRAW);



    videotextures=[];
    return useMetaPack(defaultMetaPack, videotextures);
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
    return Promise.all(promises);
  }



  // Unlike images, textures do not have a width and height associated
  // with them so we'll pass in the width and height of the texture
  function drawImage(beatNum, beatHashedRgbs, masterLumaFactor) {
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, videotextures[0].texture);
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, videotextures[1].texture);
    //gl.activeTexture(gl.TEXTURE2);
    //gl.bindTexture(gl.TEXTURE_2D, videotextures[2].texture);

    // Tell WebGL to use our shader program pair
    gl.useProgram(program);

    // Setup the attributes to pull data from our buffers
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STREAM_DRAW);
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, glVelocityBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, glVelocities, gl.STREAM_DRAW);
    gl.enableVertexAttribArray(glVelocityLocation);
    gl.vertexAttribPointer(glVelocityLocation, 3, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, seedBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, seeds, gl.STATIC_DRAW);
    gl.enableVertexAttribArray(seedLocation);
    gl.vertexAttribPointer(seedLocation, 3, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, beatHashedRgbsIndexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, beatHashedRgbsIndexes, gl.STATIC_DRAW);
    gl.enableVertexAttribArray(beatHashedRgbsIndexLocation);
    gl.vertexAttribPointer(beatHashedRgbsIndexLocation, 1, gl.FLOAT, false, 0, 0);

    // this matirx will convert from pixels to clip space
    let matrix = mat4.create();
    //mat4.ortho(matrix, 0, gl.canvas.width, gl.canvas.height, 0, -1, 1);
    mat4.perspective(matrix, Math.PI * 0.05, gl.canvas.width / gl.canvas.height, 0.01, 100); // fovy ~9deg ~ 150mm @ 35mm
    mat4.translate(matrix, matrix, vec3.fromValues(0, 0, -5));

    // this matrix will translate our quad to dstX, dstY
    //mat4.translate(matrix, matrix, vec3.fromValues(dstX, dstY, 0));

    // this matrix will scale our 1 unit quad
    // from 1 unit to texWidth, texHeight units
    //mat4.scale(matrix, matrix, vec3.fromValues(texWidth, texHeight, 1));

    // Set the matrix.
    gl.uniformMatrix4fv(matrixLocation, false, matrix);

    // Tell the shader to get the texture from texture unit 0
    gl.uniform1i(textureSnowflakeLocation, 0);
    gl.uniform1i(textureTstLocation, 1);
    //gl.uniform1i(textureHardLightLocation, 1);
    //gl.uniform1i(textureSoftLightLocation, 2);

    // TODO: redo it in more intelligent way
    let limitedSnowflakesCount = Math.min(snowflakesCount, 7500); // to not to dim in HQ mode too much
    let pointSizeFactor = teplite.pointSizeFactor * 900 / Math.sqrt(limitedSnowflakesCount);
    gl.uniform1f(pointSizeFactorLocation, pointSizeFactor);
    gl.uniform4f(color0Location, beatHashedRgbs[0].r, beatHashedRgbs[0].g, beatHashedRgbs[0].b, 1);
    gl.uniform4f(color1Location, beatHashedRgbs[1].r, beatHashedRgbs[1].g, beatHashedRgbs[1].b, 1);
    gl.uniform4f(color2Location, beatHashedRgbs[2].r, beatHashedRgbs[2].g, beatHashedRgbs[2].b, 1);
    gl.uniform1f(beatNumLocation, beatNum);
    gl.uniform1f(masterLumaFactorLocation, masterLumaFactor);
    gl.uniform1f(glPhisicBeatNumDiffLocation, beatNum - lastPhisicBeatNum);

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


    //gl.drawArrays(gl.TRIANGLES, 0, 6);
    // draw the points
    gl.drawArrays(gl.POINTS, 0, snowflakesCount);
  }
  that.readyPromise = null;

  that.phisicIteration = function(beatNum, beatHashedRgbs, hazeBratios) {
    let beatNumDiff = 0;
    if (lastPhisicBeatNum) {
      beatNumDiff = Math.max(0, Math.min(1, beatNum - lastPhisicBeatNum));
    }
    snowflakes.forEach((snowflake) => {
      snowflake.live(beatNum, beatNumDiff, beatHashedRgbs, hazeBratios);
    })
    lastPhisicBeatNum = beatNum;
  }

  that.frameIteration = function(beatNum, beatHashedRgbs, masterLumaFactor) {
    ////  additive
    gl.blendFunc(gl.ONE, gl.ONE);
    //// /additive

    drawImage(beatNum, beatHashedRgbs, masterLumaFactor);
  }

  that.holoCanvasResize = function(newHoloCanvasWidth, newHoloCanvasHeight) {
    holoCanvasWidth = newHoloCanvasWidth;
    holoCanvasHeight = newHoloCanvasHeight;
  }
  init();

  window.tweakSnowflakeImageUrl = function(url) {
    defaultMetaPack.metas[0].url = url;
    return rebuildData();
  }
}
module.exports = holoSnower;




