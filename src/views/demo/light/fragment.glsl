 precision mediump float;
varying vec4 v_Color;
//环境光分量
uniform float u_AmbientFactor;
// 光线颜色
uniform vec3 u_LightColor;
// 光源位置|入射光方向
uniform vec3 u_LightPosition;

varying vec3 v_Normal;

void main() {
  vec3 ambient = u_AmbientFactor * u_LightColor;
  vec3 lightDirection = u_LightPosition - vec3(0, 0, 0);
  // 漫反射因子
  float diffuseFactor = dot(normalize(lightDirection), normalize(v_Normal));
  // 如果是负数，说明光线与法向量夹角大于 90 度，此时照不到平面上，所以没有光照，即黑色。
  diffuseFactor = max(diffuseFactor, 0.0);
  // 漫反射光照 = 光源颜色 * 漫反射因子。
  vec3 diffuseLightColor = u_LightColor * diffuseFactor;
  // 物体在光照下的颜色 = （环境光照 + 漫反射光照） * 物体颜色。
  gl_FragColor = v_Color * vec4((ambient + diffuseLightColor),1);
}