// precision mediump float;
// varying vec2 v_Uv;
// // 接收 JavaScript 传递过来的纹理-图片
// uniform sampler2D texture;

// void main(){
//   //将普通的颜色表示转化为 WebGL 需要的表示方式，即将【0-255】转化到【0,1】之间。
//   // gl_FragColor = u_Color / vec4(255, 255, 255, 1); 
//   gl_FragColor = textrue2D(texture, vec2(v_Uv.x, v_Uv.y));
// }

precision mediump float;
varying vec2 v_Uv;
uniform sampler2D u_Texture;
void main(){
    // 点的最终颜色。
    gl_FragColor = texture2D(u_Texture, vec2(v_Uv.x, v_Uv.y));
}