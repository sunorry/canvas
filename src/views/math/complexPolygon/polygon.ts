import Vector2D from '@/utils/Vector2D'
import { draw } from '@/utils/curve'
import { vertices } from './cfg'

export function getPoints(startX: number, startY: number, edges = 5): Vector2D[] {
  // 旋转角度为外角
  const points = [new Vector2D(startX, startY)]
  const angle = (2 * Math.PI) / edges
  for (let i = 1; i <= edges - 1; i++) {
    const p = points[0].copy().rotate(i * angle)
    points.push(p)
  }
  return points
}

export function getCanvasRenderWH(canvas: HTMLCanvasElement, ratio: number) {
  return {
    width: canvas.width / ratio,
    height: canvas.height / ratio
  }
}

export function renderCrossLine(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, ratio: number) {
  const { width, height } = getCanvasRenderWH(canvas, ratio)
  ctx.strokeStyle = '#ccc'
  ctx.beginPath()
  ctx.setLineDash([5, 5])
  ctx.moveTo(0.5 * width, 0)
  ctx.lineTo(0.5 * width, height)
  ctx.stroke()
  ctx.beginPath()
  ctx.setLineDash([5, 5])
  ctx.moveTo(0, 0.5 * height)
  ctx.lineTo(width, 0.5 * height)
  ctx.stroke()
}

export function renderRegular5Polygon(
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
  points: Vector2D[],
  ratio: number
) {
  const { width, height } = getCanvasRenderWH(canvas, ratio)
  ctx.save()
  ctx.translate(0.25 * width, 0.25 * height)
  ctx.scale(1, -1)
  draw(
    ctx,
    points.map(el => [el.x, el.y]),
    {
      closePath: true,
      fillStyle: 'red'
    }
  )
  ctx.restore()
}

export function renderStar(
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
  points: Vector2D[],
  ratio: number
) {
  const { width, height } = getCanvasRenderWH(canvas, ratio)
  ctx.save()
  ctx.translate(0.75 * width, 0.25 * height)
  ctx.scale(1, -1)
  const starts = [points[0], points[2], points[4], points[1], points[3]]
  draw(
    ctx,
    starts.map(el => [el.x, el.y]),
    {
      closePath: true,
      strokeStyle: '',
      fillStyle: '#000',
      rule: 'evenodd'
    }
  )
  ctx.restore()
}

export function render2dPolygon(
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
  ratio: number,
  fillStyle = 'blue'
) {
  const { width, height } = getCanvasRenderWH(canvas, ratio)
  ctx.save()
  ctx.translate(0.25 * width, 0.75 * height)
  ctx.fillText('canvas 2d, bug：1. 只能判断点是否在当前元素中;', -0.25 * width + 20, -0.2 * height)
  ctx.fillText('2. 高清屏缩放后识别坐标错乱，导致显示不出', -0.25 * width + 20, -0.18 * height)
  ctx.scale(1, -1)
  const poitions = vertices.map(([x, y]) => [x * width * 0.25, y * height * 0.25] as [number, number])
  draw(ctx, poitions, {
    closePath: true,
    fillStyle
  })
  ctx.restore()
}

// https://blog.csdn.net/codeswarrior/article/details/79834257
export function inTriangle(p1: Vector2D, p2: Vector2D, p3: Vector2D, point: Vector2D) {
  // 一通操作的异议让 a&u1 b&u2 c&u3 有相同的起点
  const a = p2.copy().sub(p1)
  const b = p3.copy().sub(p2)
  const c = p1.copy().sub(p3)

  const u1 = point.copy().sub(p1)
  const u2 = point.copy().sub(p2)
  const u3 = point.copy().sub(p3)

  const s1 = Math.sign(a.cross(u1))

  let p = a.dot(u1) / a.length ** 2
  if (s1 === 0 && p >= 0 && p <= 1) return true
  const s2 = Math.sign(b.cross(u2))
  p = b.dot(u1) / b.length ** 2
  if (s2 === 0 && p >= 0 && p <= 1) return true
  const s3 = Math.sign(c.cross(u3))
  p = c.dot(u1) / c.length ** 2
  if (s3 === 0 && p >= 0 && p <= 1) return true
  return s1 === s2 && s2 === s3
}

export function isPointInPath(
  {
    vertices,
    cells
  }: {
    vertices: number[][]
    cells: Uint16Array
  },
  point: Vector2D
) {
  let ret = false
  for (let i = 0; i < cells.length; i += 3) {
    const p1 = new Vector2D(...vertices[cells[i]])
    const p2 = new Vector2D(...vertices[cells[i + 1]])
    const p3 = new Vector2D(...vertices[cells[i + 2]])
    if (inTriangle(p1, p2, p3, point)) {
      ret = true
      break
    }
  }
  return ret
}
