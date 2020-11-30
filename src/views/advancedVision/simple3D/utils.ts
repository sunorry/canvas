import { multiply } from '@/utils/math/functions/Vec4Func'

export function cube(size = 1.0, colors = [[1, 0, 0, 1]]) {
  const h = 0.5 * size
  const vertices = [
    [-h, -h, -h],
    [-h, h, -h],
    [h, h, -h],
    [h, -h, -h],
    [-h, -h, h],
    [-h, h, h],
    [h, h, h],
    [h, -h, h]
  ]

  const positions: number[] = []
  const color: number[][] = []

  // const colorLen = colors.length
  // let colorIdx = 0

  function quad(a: number, b: number, c: number, d: number) {
    ;[a, b, c, d].forEach(i => {
      positions.push(...vertices[i])
      color.push(colors[i])
    })
    // colorIdx++
  }

  quad(1, 0, 3, 2)
  quad(4, 5, 6, 7)
  quad(2, 3, 7, 6)
  quad(5, 4, 0, 1)
  quad(3, 0, 4, 7)
  quad(6, 5, 1, 2)

  return { positions, color }
}

export function fromRotation(rotationX: number, rotationY: number, rotationZ: number) {
  let c = Math.cos(rotationX)
  let s = Math.sin(rotationX)
  const rx = [1, 0, 0, 0, 0, c, s, 0, 0, -s, c, 0, 0, 0, 0, 1]

  c = Math.cos(rotationY)
  s = Math.sin(rotationY)
  const ry = [c, 0, s, 0, 0, 1, 0, 0, -s, 0, c, 0, 0, 0, 0, 1]

  c = Math.cos(rotationZ)
  s = Math.sin(rotationZ)
  const rz = [c, s, 0, 0, -s, c, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]

  const ret: never[] = []
  multiply(ret, rx, ry)
  multiply(ret, ret, rz)

  return ret
}
