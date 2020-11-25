// 一个属性值，将会从缓冲中获取数据
attribute vec2 a_position;
uniform vec2 u_resolution;
uniform vec2 u_translation;

void main() {
  vec2 position = a_position + u_translation;
  vec2 zero2one = position / u_resolution;
  vec2 zero2two = zero2one * 2.0;
  // 0->2 转换成 -1->+1（裁剪空间）
  vec2 clipSpace = zero2two - 1.0;
  // gl_Position 是一个顶点着色器主要设置的变量
  gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);
}