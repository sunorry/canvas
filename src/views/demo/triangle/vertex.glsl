//设置浮点数精度为中等精度
precision mediump float;
attribute vec2 a_Position;
attribute vec2 a_Screen_Size;

void main(){
    vec2 p = (a_Position / a_Screen_Size) * 2.0 -1.0;
    gl_Position = vec4(p * vec2(1.0, -1.0), 0, 1)
}
