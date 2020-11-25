<template>
  <canvas width="512" height="521" ref="canvas"></canvas>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, Ref } from 'vue'
import { randomHSL } from './randomRGB'

function useCtx(canvas: Ref<HTMLCanvasElement | undefined>) {
  const ctx = ref<CanvasRenderingContext2D | null>()
  onMounted(() => {
    ctx.value = canvas.value!.getContext('2d')
  })
  return ctx
}

export default defineComponent({
  name: 'color',

  setup() {
    const canvas = ref<HTMLCanvasElement>()
    const wrapCtx = useCtx(canvas)
    onMounted(() => {
      const ctx = wrapCtx.value!
      const safeCanvas = canvas.value!
      ctx.translate(safeCanvas.width / 2, safeCanvas.height / 2)
      ctx.scale(1, -1)
      // for (let i = 0; i < 3; i++) {
      //   const colorVector = randomRGB()
      //   for (let j = 0; j < 5; j++) {
      //     const c = colorVector.clone().scale(0.5 + 0.25 * j)
      //     ctx.fillStyle = `rgb(${Math.floor(c[0] * 256)}, ${Math.floor(c[1] * 256)}, ${Math.floor(c[2] * 256)})`
      //     ctx.beginPath()
      //     ctx.arc((j - 2) * 60, (i - 1) * 60, 20, 0, Math.PI * 2)
      //     ctx.fill()
      //   }
      // }

      const [h, s, l] = randomHSL()
      for (let i = 0; i < 3; i++) {
        const p = (i * 0.25 + h) % 1
        for (let j = 0; j < 5; j++) {
          const d = j - 2
          ctx.fillStyle = `hsl(${Math.floor(p * 360)}, ${Math.floor((0.15 * d + s) * 100)}%, ${Math.floor(
            (0.12 * d + l) * 100
          )}%)`
          ctx.beginPath()
          ctx.arc((j - 2) * 60, (i - 1) * 60, 20, 0, Math.PI * 2)
          ctx.fill()
        }
      }
    })

    return {
      canvas
    }
  }
})
</script>
