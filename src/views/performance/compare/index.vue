<template>
  <div style="display: block">
    改变个数和大小都会让 fps 骤降
    <button style="display: block" @click="interverDrawCircle(useCtx(canvas2d))">
      点击渲染（不断清除） 500 个半径为 10 的 ctx2d 圆
    </button>
    <canvas ref="canvas2d" width="512" height="512" style="display: block; border: 1px dashed #ccc"></canvas>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
function useCtx(canvas: HTMLCanvasElement) {
  return canvas.getContext('2d')!
}

function randomColor() {
  return `hsl(${Math.random() * 360}, 100%, 50%)`
}
const WIDTH = 512
const HEIGHT = 512
function drawCircle(ctx: CanvasRenderingContext2D, radius = 10) {
  const x = Math.random() * WIDTH
  const y = Math.random() * HEIGHT
  const fillColor = randomColor()
  ctx.fillStyle = fillColor
  ctx.beginPath()
  ctx.arc(x, y, radius, 0, Math.PI * 2)
  ctx.fill()
}

function draw(ctx: CanvasRenderingContext2D, count = 500, radius = 10) {
  for (let i = 0; i < count; i++) {
    drawCircle(ctx, radius)
  }
}

function interverDrawCircle(ctx: CanvasRenderingContext2D) {
  requestAnimationFrame(function update() {
    ctx.clearRect(0, 0, 512, 512)
    draw(ctx)
    requestAnimationFrame(update)
  })
}

export default defineComponent({
  name: 'compare',
  setup() {
    const canvas2d = ref<HTMLCanvasElement>()
    // onMounted(() => {
    //   const ctx = useCtx(canvas2d.value!)
    // })
    return {
      canvas2d,
      useCtx,
      interverDrawCircle
    }
  }
})
</script>
