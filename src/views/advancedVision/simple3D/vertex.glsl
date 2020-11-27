attribute vec2 a_vertexPosition;
attribute vec4 color;

varying vec4 vColor;

void main() {
  gl_PointSize = 1.0;
  vColor = color;
  gl_Position = vec4(a_vertexPosition, 0, 1)
}