import { Initialize, Render, Input } from './Render.js'
import { delta } from './Time.js';

const canvas = document.getElementById("gl");
const gl = canvas.getContext('webgl2');
if (!gl) {
  console.error("WebGL2 not supported by your navigator.");
  alert("WebGL2 not supported by your navigator.");
} else {
  // Settings
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.enable(gl.DEPTH_TEST);

  Initialize(gl);

  let DELTA;
  let TIME = new Date();

  // entrada do tecladovsky
  const keys = {};
  window.addEventListener('keydown', (e) => {
    keys[e.key.toLowerCase()] = true;
  });

  window.addEventListener('keyup', (e) => {
    keys[e.key.toLowerCase()] = false;
  });

  function renderLoop(timestamp) {
    DELTA = delta(timestamp);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    TIME = new Date();

    Input(keys, DELTA);
    Render(gl, DELTA);

    requestAnimationFrame(renderLoop);
  }

  requestAnimationFrame(renderLoop);
}
