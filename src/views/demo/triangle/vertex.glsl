//设置浮点数精度为中等精度
precision mediump float;
attribute vec2 a_Position;

void main(){
    gl_Position = vec4(a_Position, 0, 1)
}