export type PointType = [number, number]

export function draw(
  ctx: CanvasRenderingContext2D,
  points: PointType[],
  {
    strokeStyle = 'black',
    fillStyle = '',
    closePath = false,
    rule = 'nonzero'
  }: {
    strokeStyle?: string
    closePath?: boolean
    fillStyle?: string
    rule?: 'nonzero' | 'evenodd'
  } = {}
): void {
  ctx.strokeStyle = strokeStyle
  ctx.setLineDash([])
  ctx.beginPath()
  ctx.moveTo(...points[0])
  for (let i = 1; i < points.length; i++) {
    ctx.lineTo(...points[i])
  }
  closePath && ctx.closePath()
  if (fillStyle) {
    ctx.fillStyle = fillStyle
    ctx.fill(rule)
  }
  ctx.stroke()
}

type pointFunc = (t: number, ...args: any[]) => number
// 1. 高阶函数，它的参数分别是 x、y 坐标和参数方程。
// 2. 返回一个函数，这个函数会接受几个参数，比如，start、end 这样表示参数方程中关键参数范围的参数，以及 seg 这样表示采样点个数的参数等等。在下面的代码中，当 seg 默认 100 时，就表示在 start、end 范围内采样 101（seg+1）个点，后续其他参数是作为常数传给参数方程的数据。
// 3. 我们调用 parametric 返回的函数之后，它会返回一个对象。这个对象有两个属性：一个是 points，也就是它生成的顶点数据；另一个是 draw 方法，我们可以利用这个 draw 方法完成绘图
export function parametric(
  ctx: CanvasRenderingContext2D,
  xFunc: pointFunc,
  yFunc: pointFunc
): (
  start: number,
  end: number,
  seg?: number,
  ...args: any[]
) => {
  draw: () => void
  points: PointType[]
} {
  return function(
    start,
    end,
    seg = 100,
    ...args: any[]
  ): {
    draw: () => void
    points: PointType[]
  } {
    const points: PointType[] = []
    for (let i = 0; i <= seg; i++) {
      const p = i / seg
      const t = start * (1 - p) + end * p
      const x = xFunc(t, ...args)
      const y = yFunc(t, ...args)
      points.push([x, y])
    }
    return {
      draw: draw.bind(null, ctx, points, args[1]),
      points
    }
  }
}
