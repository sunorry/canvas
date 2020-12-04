//设置浮点数精度为中等精度
precision mediump float;
attribute vec2 a_Position;
attribute vec2 a_Screen_Size;

void main(){
    //start 将屏幕坐标系转化为裁剪坐标（裁剪坐标系）
    vec2 position = (a_Position / a_Screen_Size) * 2.0 - 1.0;
    position = position * vec2(1.0, -1.0);
    gl_Position = vec4(position, 0.0, 1.0);
    //end 将屏幕坐标系转化为裁剪坐标（裁剪坐标系）
    //声明待绘制的点的大小。
    gl_PointSize = 5.0;
}
