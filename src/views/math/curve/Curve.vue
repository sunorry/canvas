<template>
  <div>
    <p class="ml10">
      这个圆使用多边形模拟的，不是所有的图形系统都提供了画圆的 API，比如 WebGL 中就没有默认的画圆 API。
    </p>
    <p class="ml10">圆是椭圆的特殊情况，也就是 radiusX === radiusY</p>
    <p class="ml10">
      抛物线（圆锥曲线之一）方程 x = x0 + 2pt*t; y = y0 + 2pt; p 是常数。 1.
      <a href="https://baike.baidu.com/item/%E6%8A%9B%E7%89%A9%E7%BA%BF%E6%96%B9%E7%A8%8B/2021428" _taget="black">
        抛物线方程
      </a>
      2.
      <a href="https://baike.baidu.com/item/%E6%8A%9B%E7%89%A9%E7%BA%BF/3555564">抛物线 （圆锥曲线之一）</a>
    </p>
    <p>
      贝塞尔曲线也可以用 canvas bezierCurveTo() 原生方法来实现。
    </p>
    <canvas width="512" height="512" ref="canvas"></canvas>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { PointType, parametric } from '@/utils/curve'
import Vector2D from '@/utils/Vector2D'
const TAU_SEGMENTS = 60
const TAU = Math.PI * 2
export default defineComponent({
  name: 'Curve',
  data() {
    return {
      canvas: null,
      ctx: null
    } as {
      canvas: HTMLCanvasElement | null
      ctx: CanvasRenderingContext2D | null
    }
  },
  methods: {
    arc(x0: number, y0: number, radius: number, startAng = 0, endAng = TAU): PointType[] {
      const ang = Math.min(TAU, endAng - startAng)
      const ret: PointType[] = ang === TAU ? [] : [[x0, y0]]
      const segments = Math.round((TAU_SEGMENTS * ang) / TAU)
      for (let i = 0; i < segments; i++) {
        const x = x0 + radius * Math.cos(startAng + (ang * i) / segments)
        const y = y0 + radius * Math.sin(startAng + (ang * i) / segments)
        ret.push([x, y])
      }
      return ret
    },
    ellipse(x0: number, y0: number, radiusX: number, radiusY: number, startAng = 0, endAng = TAU): PointType[] {
      const ang = Math.min(TAU, endAng - startAng)
      const ret: PointType[] = ang === TAU ? [] : [[x0, y0]]
      const segments = Math.round((TAU_SEGMENTS * ang) / TAU)
      for (let i = 0; i <= segments; i++) {
        const x = x0 + radiusX * Math.cos(startAng + (ang * i) / segments)
        const y = y0 + radiusY * Math.sin(startAng + (ang * i) / segments)
        ret.push([x, y])
      }
      return ret
    },
    // @see: 抛物线方程式：https://zhidao.baidu.com/question/1609575897966604667.html
    parabola(x0: number, y0: number, p: number, min: number, max: number): PointType[] {
      const LINE_SEGMENTS = 60
      const ret: PointType[] = []
      for (let i = 0; i <= LINE_SEGMENTS; i++) {
        const s = i / 60
        const t = min * (1 - s) + max * s
        const x = x0 + 2 * p * t ** 2
        const y = y0 + 2 * p * t
        ret.push([x, y])
      }
      return ret
    },
    draw(points: PointType[], strokeStyle = 'black', fillStyle = '') {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const ctx = this.ctx!
      ctx.strokeStyle = strokeStyle
      ctx.beginPath()
      ctx.moveTo(...points[0])
      for (let i = 1; i < points.length; i++) {
        ctx.lineTo(...points[i])
      }
      ctx.closePath()
      if (fillStyle) {
        ctx.fillStyle = fillStyle
        ctx.fill()
      }
      ctx.stroke()
    },
    parametric() {
      const ctx = this.ctx!
      const para = parametric(
        ctx,
        t => 25 * t,
        t => 25 * t ** 2
      )
      para(-5.5, 5.5).draw()

      const star = parametric(
        ctx,
        (t, l) => l * Math.cos(t) ** 3,
        (t, l) => l * Math.sin(t) ** 3
      )

      star(0, Math.PI * 2, 50, 150, {
        strokeStyle: 'red'
      }).draw()
    },
    quadraticBezier() {
      const ctx = this.ctx!
      const quadraticBezier = parametric(
        ctx,
        (t, [{ x: x0 }, { x: x1 }, { x: x2 }]) => (1 - t) ** 2 * x0 + 2 * t * (1 - t) * x1 + t ** 2 * x2,
        (t, [{ y: y0 }, { y: y1 }, { y: y2 }]) => (1 - t) ** 2 * y0 + 2 * t * (1 - t) * y1 + t ** 2 * y2
      )
      const p0 = new Vector2D(0, 0)
      const p1 = new Vector2D(100, 0)
      p1.rotate(0.75)
      const p2 = new Vector2D(200, 0)
      const count = 30
      for (let i = 0; i < count; i++) {
        // 绘制30条从圆心出发，旋转不同角度的二阶贝塞尔曲线
        p1.rotate((2 / count) * Math.PI)
        p2.rotate((2 / count) * Math.PI)
        quadraticBezier(0, 1, 100, [p0, p1, p2]).draw()
      }
    },
    qubicBezier() {
      const ctx = this.ctx!
      const cubicBezier = parametric(
        ctx,
        (t, [{ x: x0 }, { x: x1 }, { x: x2 }, { x: x3 }]) =>
          (1 - t) ** 3 * x0 + 3 * t * (1 - t) ** 2 * x1 + 3 * (1 - t) * t ** 2 * x2 + t ** 3 * x3,
        (t, [{ y: y0 }, { y: y1 }, { y: y2 }, { y: y3 }]) =>
          (1 - t) ** 3 * y0 + 3 * t * (1 - t) ** 2 * y1 + 3 * (1 - t) * t ** 2 * y2 + t ** 3 * y3
      )
      const p0 = new Vector2D(0, 0)
      const p1 = new Vector2D(100, 0)
      p1.rotate(0.75)
      const p2 = new Vector2D(150, 0)
      p2.rotate(-0.75)
      const p3 = new Vector2D(200, 0)
      const count = 30
      for (let i = 0; i < count; i++) {
        p1.rotate((2 / count) * Math.PI)
        p2.rotate((2 / count) * Math.PI)
        p3.rotate((2 / count) * Math.PI)
        cubicBezier(0, 1, 100, [p0, p1, p2, p3], {
          strokeStyle: '#00AAAA'
        }).draw()
      }
    }
  },

  mounted() {
    const canvas = this.$refs.canvas as HTMLCanvasElement
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D
    ctx.translate(0.5 * canvas.width, 0.5 * canvas.height)
    ctx.scale(1, -1)
    this.canvas = canvas
    this.ctx = ctx
    this.draw(this.arc(0, 0, 100))
    this.draw(this.ellipse(0, 0, 100, 50), 'blue')
    this.draw(this.parabola(0, 0, 5.5, -10, 10), '#BBBB00')
    this.parametric()
    this.quadraticBezier()
    this.qubicBezier()
  }
})
</script>

<style lang="scss" scoped>
.ml10 {
  margin-left: 10px;
}
</style>
