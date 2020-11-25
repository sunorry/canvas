// 属性值，将会从缓冲中获取数据
attribute vec2 a_position;
uniform vec2 u_resolution;

void main() {
  // gl_Position = a_position;
  // 从像素坐标转换到 0.0 到 1.0

  // 将位置信息转换为像素坐标
  // u_resolution 画布的分辨率
  vec2 zeroToOne = a_position / u_resolution;
  // 再把 0->1 转换 0->2
  vec2 zeroToTwo = zeroToOne * 2.0;
  // 把 0->2 转换到 -1->+1 (裁剪空间)
  vec2 clipSpace = zeroToTwo - 1.0;
  // gl_Position 是一个顶点着色器主要设置的变量
  // gl_Position = vec4(clipSpace, 0, 1);
  // 转换为普通左上角坐标
   gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);
}