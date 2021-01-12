attribute vec4 a_Position;

attribute vec4 a_Color;
varying vec4 v_Color;

// 顶点法向量
attribute vec3 a_Normal;
varying vec3 v_Normal;

// 模型视图投影变换矩阵
uniform mat4 u_Matrix;

void main() {
  // 将顶点坐标转换成裁剪坐标下的坐标
  gl_Position = u_Matrix * vec4(a_Position, 1);
  v_Color = a_Color;
  v_Normal = a_Normal;
}