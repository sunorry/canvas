precision mediump float;
varying vec4 v_Uv;

void main() {
	gl_FragColor = v_Uv / vec4(255, 255, 255, 1);
}