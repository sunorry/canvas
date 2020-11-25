<template>
  <div>
    <div style="margin: 20px;">
      请输入多边形边数
      <input v-model="value" @blur="rerender" @keyup.enter="rerender" type="number" placeholder="多边形边数" />
    </div>
    <canvas width="512" height="512" ref="canvas"></canvas>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Vector2D from '@/utils/Vector2D'

export default defineComponent({
  name: 'Polygon',
  data() {
    return {
      value: 0,
      canvas: null,
      ctx: null
    } as {
      value: number
      canvas: HTMLCanvasElement | null
      ctx: CanvasRenderingContext2D | null
    }
  },
  methods: {
    rerender(edges: number) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const ctx = this.ctx!
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const canvas = this.canvas!
      this.value && ctx.clearRect(-0.5 * canvas.width, -0.5 * canvas.height, canvas.width, canvas.height)
      const pList = this.regularShape(this.value || edges, 40, -180, 80)
      ctx.beginPath()
      ctx.strokeStyle = 'red'
      pList.forEach((v, index) => {
        if (index === 0) {
          ctx.moveTo(v.x, v.y)
        } else {
          ctx.lineTo(v.x, v.y)
        }
      })
      ctx.closePath()
      ctx.stroke()
    },
    // 我们在 regularShape 函数中，给定边数 edges、起点 x, y、一条边的长度 step，就可以绘制一个正多边形了。
    // 绘制的思路和我们上一节课的思路类似，也就是通过 rotate 旋转向量，然后通过向量加法来计算顶点位置。
    // 具体来说就是，我们定义初始点为 new Vector2D(x, y)，初始方向为 x 轴方向 new Vector2D(step, 0)。
    // 然后循环计算正多边形的顶点位置，也就是从初始点开始，每次将方向向量旋转 delta 角度，delta 角度是根据正多边形内角公式计算出来的。
    // 最后，我们将当前点和方向向量相加，就得到下一个顶点坐标了。
    regularShape(edges = 3, x: number, y: number, step: number): Vector2D[] {
      const ret: Vector2D[] = []
      // delta:外角，其实就是 2π/n
      const delta = Math.PI * (1 - (edges - 2) / edges)
      let p = new Vector2D(x, y)
      const dir = new Vector2D(step, 0)
      ret.push(p)
      for (let i = 0; i < edges; i++) {
        // 根据向量加法
        p = p.copy().add(dir.rotate(delta))
        ret.push(p)
      }
      return ret
    }
  },

  mounted() {
    const canvas = this.$refs.canvas as HTMLCanvasElement
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D
    ctx.translate(0.5 * canvas.width, 0.5 * canvas.height)
    ctx.scale(1, -1)
    this.canvas = canvas
    this.ctx = ctx
    this.rerender(3)
    this.rerender(4)
    this.rerender(5)
  }
})
</script>

<style lang="scss" scoped>
canvas {
  border: 1px solid #ccc;
}
</style>
