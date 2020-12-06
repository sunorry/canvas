precision mediump float;
//接收 JavaScript 传过来的颜色值（RGBA）。
varying vec4 v_Color;

void main(){
  //将普通的颜色表示转化为 WebGL 需要的表示方式，即将【0-255】转化到【0,1】之间。
  gl_FragColor = v_Color / vec4(255, 255, 255, 1);
}