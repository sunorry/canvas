<template>
  <canvas width="512" height="512" ref="canvas" class="canvas"></canvas>
  使用叉积和三角剖分判断
  <canvas width="512" height="512" ref="webgl" class="webgl"></canvas>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, computed } from 'vue'
import {
  getPoints,
  renderRegular5Polygon,
  renderStar,
  render2dPolygon,
  renderCrossLine,
  isPointInPath,
  getCanvasRenderWH
} from './polygon'
import { renderWebGLPolygon } from './webgl/'
import Vector2D from '@/utils/Vector2D'
import setCanvasDpr from '@/utils/setCanvasDpr'

export default defineComponent({
  name: 'Polygon',

  setup() {
    const canvas = ref<HTMLCanvasElement>()
    const ctx = computed(() => {
      return canvas.value?.getContext('2d')!
    })
    const webgl = ref<HTMLCanvasElement>()
    const gl = computed(() => {
      return webgl.value?.getContext('webgl')!
    })
    onMounted(() => {
      const safeCanvas = canvas.value!
      const safeCtx = ctx.value
      const ratio = setCanvasDpr(safeCanvas, safeCtx)
      renderCrossLine(safeCanvas, safeCtx, ratio)
      renderRegular5Polygon(safeCanvas, safeCtx, getPoints(0, 80), ratio)
      renderStar(safeCanvas, safeCtx, getPoints(0, 80), ratio)
      render2dPolygon(safeCanvas, safeCtx, ratio)
      const { program, vertices, cells } = renderWebGLPolygon(gl.value)

      const { width, height } = getCanvasRenderWH(safeCanvas, ratio)
      const { left, top } = safeCanvas.getBoundingClientRect()
      safeCanvas.addEventListener('mousemove', e => {
        const { x, y } = e
        const offsetX = x - left
        const offsetY = y - top
        safeCtx.clearRect(0, 0.5 * height, 0.5 * width, 0.5 * height)
        // 问题：isPointInPath 只能最当前绘制的图形生效（最后一个）
        if (safeCtx.isPointInPath(offsetX, offsetY)) {
          render2dPolygon(safeCanvas, safeCtx, ratio, 'yellow')
        } else {
          render2dPolygon(safeCanvas, safeCtx, ratio)
        }
      })

      const safeGLCanvas = webgl.value!
      const safeGLCtx = gl.value!
      const { left: glLeft, top: glTop } = safeGLCanvas.getBoundingClientRect()
      safeGLCanvas.addEventListener('mousemove', e => {
        const { x, y } = e
        // TODO: 坐标转换
        const offsetX = (2 * (x - glLeft)) / safeGLCanvas.width - 1.0
        const offsetY = 1.0 - (2 * (y - glTop)) / safeGLCanvas.height

        safeGLCtx.clear(safeGLCtx.COLOR_BUFFER_BIT)
        const colorLoc = safeGLCtx.getUniformLocation(program, 'u_color')
        if (isPointInPath({ vertices, cells }, new Vector2D(offsetX, offsetY))) {
          safeGLCtx.uniform4fv(colorLoc, [0, 0.5, 1, 1])
        } else {
          safeGLCtx.uniform4fv(colorLoc, [1, 0, 0, 1])
        }
        safeGLCtx.drawElements(safeGLCtx.TRIANGLES, cells.length, safeGLCtx.UNSIGNED_SHORT, 0)
      })
    })
    return {
      canvas,
      ctx,
      webgl,
      gl
    }
  }
})
</script>

<style lang="scss" scoped>
canvas {
  border: 1px solid #ccc;
}
.canvas,
.webgl {
  width: 512px;
  height: 512px;
}
</style>
