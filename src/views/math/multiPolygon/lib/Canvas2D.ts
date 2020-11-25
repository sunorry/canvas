import Vertor2D from '@/utils/Vector2D'

export default class Canvas2d {
  canvas: HTMLCanvasElement
  ctx: CanvasRenderingContext2D
  height: number
  width: number
  isDrawCross: boolean
  strokeStyle: string
  fillStyle: string
  constructor(canvas: HTMLCanvasElement, { drawCross = true, strokeStyle = 'black', fillStyle = 'black' } = {}) {
    this.canvas = canvas
    const ctx = (this.ctx = canvas.getContext('2d')!)
    this.height = canvas.height
    this.width = canvas.width
    this.isDrawCross = drawCross
    this.strokeStyle = strokeStyle
    this.fillStyle = fillStyle
    ctx.fillStyle = fillStyle
    ctx.strokeStyle = strokeStyle
    // drawCross && this.drawCross()
    this.translate2center()
    this.clear()
  }
  // 'nonzero' | 'evenodd'
  drawPolygon(points: Vertor2D[], { close = true, filled = true, rule = 'nonzero' } = {}) {
    const { ctx } = this
    this.clear()
    const start = points[0]
    ctx.beginPath()
    ctx.moveTo(start.x, start.y)
    for (let index = 1; index < points.length; index++) {
      const point = points[index]
      ctx.lineTo(point.x, point.y)
    }
    close && ctx.closePath()
    filled && ctx.fill(rule as 'nonzero' | 'evenodd')
    ctx.stroke()
  }

  // TODO: 高清屏下清除 样式宽高试试
  clear() {
    const { ctx, width, height } = this
    ctx.clearRect(-width / 2, -height / 2, width, height)
    this.isDrawCross && this.drawCross()
  }

  private translate2center() {
    const { ctx, width, height } = this
    ctx.translate(width / 2, height / 2)
    ctx.scale(1, -1)
  }

  private drawCross() {
    const { ctx, height, width } = this
    ctx.beginPath()
    ctx.setLineDash([5, 3])
    ctx.strokeStyle = '#999'
    ctx.moveTo(-width / 2, 0)
    ctx.lineTo(width / 2, 0)
    ctx.stroke()
    ctx.closePath()

    ctx.beginPath()
    ctx.moveTo(0, height / 2)
    ctx.lineTo(0, -height / 2)
    ctx.stroke()
    ctx.closePath()
    this.back2InitStyle()
  }
  private back2InitStyle() {
    const { ctx } = this
    ctx.fillStyle = this.fillStyle
    ctx.strokeStyle = this.strokeStyle
    ctx.setLineDash([1, 0])
  }
}
