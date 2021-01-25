<template>
  <canvas width="1024" height="512" ref="canvas"></canvas>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Vector2D from '@/utils/Vector2D'

export default defineComponent({
  name: 'Line',
  components: {},

  methods: {
    drawBase(ctx: CanvasRenderingContext2D, v0: Vector2D, q: Vector2D, r: Vector2D) {
      this.line(ctx, new Vector2D(0, 0), v0)
      this.line(ctx, q, r, { strokeStyle: '#000' })

      this.text(ctx, q, 'Q')
      this.text(ctx, r, 'R')
    },

    line(
      ctx: CanvasRenderingContext2D,
      start: Vector2D,
      end: Vector2D,
      cfg: {
        strokeStyle?: string
        lineWidth?: number
        isDash?: boolean
      } = {
        strokeStyle: '#999',
        lineWidth: 2,
        isDash: false
      }
    ) {
      ctx.save()
      ctx.strokeStyle = cfg.strokeStyle!
      if (cfg.isDash) {
        ctx.setLineDash([2, 5])
      }
      ctx.beginPath()
      ctx.moveTo(start.x, start.y)
      ctx.lineTo(end.x, end.y)
      ctx.lineWidth = cfg.lineWidth!
      ctx.stroke()
      ctx.restore()
    },

    text(
      ctx: CanvasRenderingContext2D,
      v: Vector2D,
      text: string,
      cfg = {
        font: '20px serif'
      }
    ) {
      ctx.save()
      ctx.scale(1, -1)
      ctx.font = cfg.font
      ctx.fillText(text, v.x - 10, -(v.y + 10))
      this.drawPoint(ctx, v)
      ctx.restore()
    },

    // 1. 运用叉乘计算平行四边形面积，从而算出点到向量的直线距离
    calculateH(v1: Vector2D, v2: Vector2D) {
      const s = v1.x * v2.y - v1.y * v2.x
      return s / v1.len
    },

    drawPoint(
      ctx: CanvasRenderingContext2D,
      v: Vector2D,
      cfg: {
        r?: number
        fillStyle?: string
      } = {
        r: 5,
        fillStyle: '#000'
      }
    ) {
      ctx.beginPath()
      ctx.fillStyle = cfg.fillStyle as string
      ctx.arc(v.x, -v.y, cfg.r as number, 0, 2 * Math.PI)
      ctx.fill()
    }
    // 点乘特殊情况，垂直时，夹角 90°
    // OQ * PA = 0
    // a.x * b.x + a.y * b.y === 0
    //1. q.x * (x1 - r.x) + q.y * (y1 - r.y) ===  0
    // 2. OQ 和 OA 斜率相同 q.x / q.y = x1 / x2
  },

  mounted() {
    const canvas = this.$refs.canvas as HTMLCanvasElement
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const ctx = canvas.getContext('2d')!
    ctx.translate(0, canvas.height)
    ctx.scale(1, -1)

    const offsetLeft = canvas.offsetLeft
    const offsetTop = canvas.offsetTop
    const canvasHeight = canvas.height
    const canvasWidth = canvas.width

    const v0 = new Vector2D(1000, 400)
    const q = v0.copy()
    q.scale(0.3)
    const r = v0.copy()
    r.scale(0.7)
    this.drawBase(ctx, v0, q, r)

    canvas.addEventListener('mousemove', e => {
      ctx.clearRect(0, 0, canvasWidth, canvasHeight)

      this.drawBase(ctx, v0, q, r)

      const vx = e.pageX - offsetLeft
      const vy = canvasHeight - (e.pageY - offsetTop)
      const p = new Vector2D(vx, vy)
      this.text(ctx, p, 'P')
      const h = this.calculateH(q, p)
      const qpDir = Math.asin(h / p.len)
      const rLen = h / Math.tan(qpDir)
      const x = rLen * Math.cos(q.dir)
      const y = rLen * Math.sin(q.dir)

      let isInQR = false

      if (x >= q.x && y >= q.y && x <= r.x && y <= r.y) {
        isInQR = true
      }

      if (!isInQR) {
        this.line(ctx, p, x < q.x ? q : r, {
          strokeStyle: '#32CD32',
          lineWidth: 3
        })
      }

      this.line(ctx, p, { x, y } as Vector2D, {
        strokeStyle: 'red',
        isDash: true,
        lineWidth: 3
      })
      this.text(ctx, { x, y } as Vector2D, 'A')
    })
  }
})
</script>

<style lang="scss" scoped>
canvas {
  width: 1024px;
  height: 512px;
  border: 1px solid #ccc;
  margin-top: 50px;
}
</style>
