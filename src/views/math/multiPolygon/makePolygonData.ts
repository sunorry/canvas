import Vertor2D from '@/utils/Vector2D'

export function makePolygonData([x, y]: [number, number], edges = 5) {
  const start = new Vertor2D(x, y)
  const points = [start]
  // 每次旋转外角，即 2π/n
  const degree = (2 * Math.PI) / edges
  for (let i = 1; i <= edges - 1; i++) {
    points.push(start.copy().rotate(i * degree))
  }

  return points
}
const TAU_SEGMENTS = 60
const TAU = Math.PI * 2
// 圆是椭圆的特殊情况，也就是 radiusX === radiusY
export function makeEllipseData(
  x0: number,
  y0: number,
  radiusX: number,
  radiusY: number,
  startAng = 0,
  endAng = TAU
): Vertor2D[] {
  const ang = Math.min(TAU, endAng - startAng)
  const ret: Vertor2D[] = ang === TAU ? [] : [new Vertor2D(x0, y0)]
  const segments = Math.round((TAU_SEGMENTS * ang) / TAU)
  for (let i = 0; i <= segments; i++) {
    const x = x0 + radiusX * Math.cos(startAng + (ang * i) / segments)
    const y = y0 + radiusY * Math.sin(startAng + (ang * i) / segments)
    ret.push(new Vertor2D(x, y))
  }
  return ret
}
