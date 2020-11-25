import Vec3 from '@/utils/math/Vec3.js'

export function randomRGB() {
  return new Vec3(0.5 * Math.random(), 0.5 * Math.random(), 0.5 * Math.random())
}

export function randomHSL() {
  return new Vec3(
    0.5 * Math.random(), // 初始色相随机取0~0.5之间的值
    0.7, // 初始饱和度0.7
    0.45 // 初始亮度0.45
  )
}
