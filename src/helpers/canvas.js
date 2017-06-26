import { CANVAS_WIDTH, CANVAS_HEIGHT } from '../constants/canvas';

export function initWebGL(selector) {
  const canvasDom = document.querySelector(selector);
  const gl = canvasDom.getContext('webgl');
  gl.clearColor(0, 0, 0, 1);
  canvasDom.width = CANVAS_WIDTH;
  canvasDom.height = CANVAS_HEIGHT;
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.enable(gl.DEPTH_TEST);
  gl.viewport(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  return gl;
}
