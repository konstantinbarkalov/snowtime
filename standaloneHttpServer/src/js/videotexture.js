'use strict';
function Videotexture(meta, gl) {
  let that = this;
  let img = null
  function init() {
    createTexture();
    configureProxyTexture();
    that.readyPromise = preload();
  }
  function preload() {
    return getImageFromHttp(meta.url).then(configureTexture);
  }


  that.readyPromise = null;
  that.texture = null;
  function getImageFromHttp(url) {
    return new Promise((resolve, reject) =>{
      img = new Image();
      img.addEventListener('load', () => {
        resolve();
      });
      setTimeout(()=>{
        reject('timeout');
      }, 100 * 1000);
      img.src = url;
    });
  }
  function createTexture() {
    that.texture = gl.createTexture();
  }
  function configureProxyTexture() {
    gl.bindTexture(gl.TEXTURE_2D, that.texture);
    // Fill the that.texture with a 1x1 blue pixel.
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE,
                  new Uint8Array([0, 0, 255, 255]));
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  }

  function configureTexture() {
    let metaGl = meta.gl || {};
    gl.bindTexture(gl.TEXTURE_2D, that.texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, metaGl.textureWrapS || gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, metaGl.textureWrapT || gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, metaGl.textureMinFilter || meta.isMipmap?gl.LINEAR_MIPMAP_LINEAR:gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, metaGl.textureMagFilter || gl.LINEAR);
    if (meta.isMipmap) {
      gl.generateMipmap(gl.TEXTURE_2D);
    }
  }
  init();
}
module.exports = Videotexture;