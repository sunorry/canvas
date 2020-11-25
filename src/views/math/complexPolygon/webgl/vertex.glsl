attribute vec2 position;
uniform vec4 u_color;
varying vec4 vColor;

void main() {
  gl_PointSize = 1.0;
  gl_Position = vec4(position, 1.0, 1.0);
  vColor = u_color;
}