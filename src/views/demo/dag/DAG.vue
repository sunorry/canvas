<template>
  <canvas ref="canvas" width="1024" height="512"></canvas>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue'

function setCanvasRatio(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
  const offsetWidth = canvas.offsetWidth
  const offsetHeight = canvas.offsetHeight
  const dpr = window.devicePixelRatio || 1
  const bsr = 1
  const ratio = dpr / bsr
  canvas.width = offsetWidth * ratio
  canvas.height = offsetHeight * ratio
  ctx.scale(ratio, ratio)
}

export default defineComponent({
  name: 'dag',
  setup() {
    const canvas = ref<HTMLCanvasElement>()

    onMounted(() => {
      const safeCanvas = canvas.value!
      const ctx = canvas.value!.getContext('2d')!
      setCanvasRatio(safeCanvas, ctx)
      const data = {
        nodeName: '工具栏悬浮有说明',
        x: 161,
        y: 49,
        width: 200,
        height: 50
      }
      // FIXME: 有点模糊，可能是 0.5 原因
      // TODO: 圆角
      ctx.strokeStyle = 'rgb(222, 223, 236)'
      ctx.fillStyle = 'rgba(252, 252, 251, 0.9)'
      ctx.beginPath()
      ctx.rect(data.x, data.y, data.width, data.height)
      ctx.stroke
      ctx.fill()
      ctx.stroke()
      ctx.fillStyle = 'red'
      ctx.font = '16px Arial'
      ctx.fillText(data.nodeName, data.x + 25, data.y + 25)
    })
    return {
      canvas
    }
  }
})
</script>

<style lang="scss" scoped>
canvas {
  width: 1024px;
  height: 512px;
  background: #242424;
}
</style>
