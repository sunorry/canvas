attribute vec3 a_vertexPosition;

uniform vec4 u_color;
varying vec4 vColor;
uniform mat4 projectionMatrix;
uniform mat4 modelMatrix;
void main() {
  gl_PointSize = 1.0;
  vColor = u_color;
  // gl_Position = vec4(a_vertexPosition, 1)
  gl_Position = projectionMatrix * modelMatrix * vec4(a_vertexPosition, 1.0);
}