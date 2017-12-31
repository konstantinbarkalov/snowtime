'use strict';
let shaderSourceset = {
  vertex: {

  },
  fragment: {

  }
};
shaderSourceset.vertex.snow = `
precision highp float;



uniform float u_beatNum;
uniform float u_hatonomFreq;
uniform mat4 u_matrix;
uniform vec4 u_color0;
uniform vec4 u_color1;
uniform vec4 u_color2;
uniform float u_glPhisicBeatNumDiff;
attribute vec3 a_position;
attribute vec3 a_seed;
attribute float a_beatHashedRgbsIndex;
attribute vec3 a_glVelocity;
uniform sampler2D u_textureTst;
uniform float u_masterLumaFactor;
varying float v_distance;
varying float v_unfocusFactor;
varying float v_unfocusBfactor;
varying vec4 v_beatHashedRgb;
varying float v_streakRatio;
varying float v_radialRatio;
varying float v_horisontalRatio;
varying vec3 v_seed;
void main() {
  vec4 glPhisicPosition = vec4(a_position + a_glVelocity * u_glPhisicBeatNumDiff, 1);
  gl_Position = u_matrix * glPhisicPosition;
  v_distance = gl_Position.w / 5.0;
  float distanceLog = log(v_distance);
  v_unfocusFactor = max(0.1, abs(distanceLog));
  v_unfocusBfactor = v_unfocusFactor * sign(distanceLog);


  if (v_distance > 0.0) {
    float distanceFactor = (1.0 / v_distance);
    gl_PointSize = 12.0 * distanceFactor * v_unfocusFactor;
  } else {
    gl_PointSize = 0.0;
  }
  if (a_beatHashedRgbsIndex >= 2.0) {
    v_beatHashedRgb = u_color0;
  } else if (a_beatHashedRgbsIndex >= 1.0) {
    v_beatHashedRgb = u_color1;
  } else {
    v_beatHashedRgb = u_color2;
  }

  vec2 texcoord = vec2(0.5 + gl_Position.x / gl_Position.w / 2.0, 0.5 + gl_Position.y / gl_Position.w / -2.0); // get a value from the middle of the texture
  v_beatHashedRgb =  v_beatHashedRgb + texture2D(u_textureTst, texcoord) * u_color0;

  v_beatHashedRgb = v_beatHashedRgb * (1.0 + pow(a_seed[1], 1.0 / u_masterLumaFactor) * 10.0);

  float outerNum = u_beatNum * u_hatonomFreq;
  float inerPerOuter = u_hatonomFreq;
  float interNum = outerNum / inerPerOuter;
  float interNumMod = mod(interNum, 1.0);
  bool isStreaking = (floor(a_seed[0] * inerPerOuter) == floor(interNumMod * inerPerOuter) );
  if (isStreaking) {
    float streakSineRatio;
    if (mod(outerNum, 1.0) < 0.5) {
      streakSineRatio = (1.0 + cos(outerNum * 3.14159 * 2.0)) / 2.0;
    } else {
      streakSineRatio = 0.0;
    }
    v_streakRatio = pow(streakSineRatio, 1.0 / u_hatonomFreq);
  } else {
    v_streakRatio = 0.0 * a_glVelocity[0] * u_glPhisicBeatNumDiff;
  }
  v_radialRatio = pow(distance(vec2(0.0, 0.0), gl_Position.xy / gl_Position.ww), 3.0);
  v_horisontalRatio = cos(gl_Position.x * 2.0 / 0.75 + 2.0  / 0.75 * u_beatNum * 3.14159) / 5.0 + 0.5;

  v_seed = a_seed;
}
`;
shaderSourceset.fragment.snow = `
precision highp float;

uniform float u_beatNum;
uniform float u_masterLumaFactor;
uniform sampler2D u_textureSnowflake;
uniform sampler2D u_textureTst;
varying vec3 v_seed;
varying float v_distance;
varying float v_unfocusFactor;
varying vec4 v_beatHashedRgb;
varying float v_streakRatio;
varying float v_radialRatio;
varying float v_horisontalRatio;


void main(void) {
  float distanceFactor = (1.0 / v_distance);

  float overbrightFactor = 1.0 + v_streakRatio / v_unfocusFactor * 10.0;

  float masterLumaFactor = pow(u_masterLumaFactor, 6.0);
  //float masterLumaFactor = v_horisontalRatio;
  vec4 textureColor = texture2D(u_textureSnowflake, gl_PointCoord);

  vec4 pointColor = textureColor * v_beatHashedRgb;
  pointColor = pointColor / v_unfocusFactor / v_unfocusFactor / v_unfocusFactor / v_unfocusFactor;
  pointColor = pointColor * (0.01 + masterLumaFactor);
  pointColor = pointColor * overbrightFactor;
  float gammaFactor = 0.67 - masterLumaFactor * 0.16;
  pointColor = pow(pointColor, vec4(gammaFactor, gammaFactor, gammaFactor, 1.0));
  pointColor = pointColor * gammaFactor;
  gl_FragColor = pointColor;


  //gl_FragColor = pow(gl_FragColor, vec4(0.5, 0.5, 0.5, 1.0));
  //gl_FragColor = gl_FragColor * 0.5;

}
`;

shaderSourceset.vertex.scaper = `
precision highp float;
attribute vec4 a_position;
attribute vec2 a_texcoord;

uniform mat4 u_matrix;

varying vec2 v_texcoord;

void main() {
  gl_Position = u_matrix * a_position;
  v_texcoord = a_texcoord;
}
`;
shaderSourceset.fragment.scaper = `
precision highp float;


uniform float u_masterLumaFactor;
uniform sampler2D u_texture_city;
uniform sampler2D u_textureHardLight;
uniform sampler2D u_textureSoftLight;
uniform sampler2D u_texture0;
uniform sampler2D u_texture1;
uniform sampler2D u_texture2;
uniform sampler2D u_texture3;
uniform sampler2D u_texture4;
uniform vec4 u_color0;
uniform vec4 u_color1;
uniform vec4 u_color2;
uniform float u_beatNum;
varying vec2 v_texcoord;



void main() {
  //  city
  float timesin = sin(u_beatNum / 16.0 * 3.14);
  //float timesin = u_color0[0];
  float ratio0 = timesin / 100.0;
  vec2 modified_texcoord0 = vec2(v_texcoord[0] + cos(v_texcoord[0] * 3.14) * ratio0,
                               v_texcoord[1]);
  float ratio1 = timesin / 5.0;
  vec2 modified_texcoord1 = vec2(v_texcoord[0] + sin(v_texcoord[0] * 3.14) * ratio1,
                                v_texcoord[1]);


  gl_FragColor = texture2D(u_texture_city, v_texcoord) +
                 texture2D(u_textureHardLight, modified_texcoord0) * u_color0 +
                 texture2D(u_textureSoftLight, modified_texcoord1) * u_color1;

  // /city
  //  flare
  float timesin0 = sin(u_beatNum / 2.0 * 3.14);
  float timesin1 = sin(u_beatNum / 3.0 * 3.14);
  float timesin2 = sin(u_beatNum / 4.0 * 3.14);
  float timesin3 = sin(u_beatNum / 6.0 * 3.14);
  float timesin4 = sin(u_beatNum / 8.0 * 3.14);
  vec2 texcoord0 = vec2(1.0 - v_texcoord[0], v_texcoord[1] * 2.0 + 1.0 - u_beatNum / 16.0);
  vec2 texcoord1 = vec2(v_texcoord[0], v_texcoord[1] * 4.0 - u_beatNum / 16.0);
  vec2 texcoord2 = vec2(v_texcoord[0], mod((v_texcoord[1] - 0.4) * 4.0 + timesin2 * 0.25 - u_beatNum / 8.0, 4.0));
  vec2 texcoord3 = vec2(v_texcoord[0] - 0.5, mod((v_texcoord[1] - 0.4) * 4.0 + timesin3 * 0.25 - u_beatNum / 8.0, 4.0));
  vec2 texcoord4 = vec2(v_texcoord[0] - 0.5, mod((v_texcoord[1] - 0.4) * 4.0 + timesin4 * 0.25 - u_beatNum / 8.0, 4.0));

  vec4 flarePointColor = texture2D(u_texture0, texcoord0) * u_color0 * 1.0 +
                    texture2D(u_texture1, texcoord1) * u_color1 * 1.0 +
                    texture2D(u_texture2, texcoord2) * u_color2 * 1.25 +
                    texture2D(u_texture3, texcoord3) * u_color0 * 1.25 +
                    texture2D(u_texture4, texcoord4) * u_color1 * 1.25;

  //flarePointColor = flarePointColor * 100.0;
  flarePointColor = flarePointColor * (0.1 + 1.0 * pow(u_masterLumaFactor, 2.0));

  float gammaFactor = 0.67 / u_masterLumaFactor;
  flarePointColor = pow(flarePointColor, vec4(gammaFactor, gammaFactor, gammaFactor, 1.0));
  //flarePointColor = flarePointColor * gammaFactor;
  gl_FragColor += flarePointColor;
  // /flare

}
`;

module.exports = shaderSourceset;




