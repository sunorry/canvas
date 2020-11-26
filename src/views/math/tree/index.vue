<template>
  <canvas width="512" height="512" ref="canvas"></canvas>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue'
import Vector2D from '@/utils/Vector2D'

export default defineComponent({
  name: 'Tree',
  setup() {
    const canvas = ref<HTMLCanvasElement>()

    function useCtx(canvas: HTMLCanvasElement) {
      const ctx = ref<CanvasRenderingContext2D | null>()
      ctx.value = canvas.getContext('2d')
      return ctx
    }

    function drawBranch(
      ctx: CanvasRenderingContext2D,
      v0: Vector2D, // 起始向量
      length: number, // 长度
      thinkness: number,
      dir: number,
      bias: number
    ) {
      const v = new Vector2D(1, 0).rotate(dir).scale(length)
      const v1 = v0.copy().add(v)

      ctx.lineWidth = thinkness
      ctx.beginPath()
      ctx.moveTo(v0.x, v0.y)
      ctx.lineTo(v1.x, v1.y)
      ctx.stroke()

      if (thinkness > 2) {
        const left = Math.PI / 4 + 0.5 * (dir + 0.2) + bias * (Math.random() - 0.5)
        drawBranch(ctx, v1, length, thinkness * 0.8, left, bias * 0.9)
        const right = Math.PI / 4 + 0.5 * (dir + 0.2) + bias * (Math.random() - 0.5)
        drawBranch(ctx, v1, length, thinkness * 0.8, right, bias * 0.9)
      }

      if (thinkness < 5 && Math.random() < 0.3) {
        ctx.save()
        ctx.strokeStyle = '#c72c35'
        const th = Math.random() * 6 + 3
        ctx.lineWidth = th
        ctx.beginPath()
        ctx.moveTo(v1.x, v1.y)
        ctx.lineTo(v1.x, v1.y - 2)
        ctx.stroke()
        ctx.restore()
      }
    }

    onMounted(() => {
      const canvasInstance = canvas.value!
      const ctx = useCtx(canvasInstance).value!
      const ratio = window.devicePixelRatio
      canvasInstance.width = ratio * canvasInstance.clientWidth
      canvasInstance.height = ratio * canvasInstance.clientHeight
      ctx.translate(canvasInstance.width / 2, canvasInstance.height)
      ctx.scale(1, -1)
      ctx.lineCap = 'round'

      drawBranch(ctx, new Vector2D(0, 0), 80, 10, 1, 3)
    })

    return {
      canvas
    }
  }
})
</script>

<style lang="scss" scoped>
canvas {
  border: 1px solid #ccc;
  margin-top: 50px;
  width: 512px;
  height: 512px;
}
</style>
