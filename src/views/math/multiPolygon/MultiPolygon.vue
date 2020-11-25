<template>
  <div>
    <div>
      <button class="btn" @click="drawPentagon">五边形</button>
      <button class="btn" @click="drawStar">五角星</button>
      <button class="btn" @click="drawEvenoddStar">evenodd五角星</button>
      <button class="btn" @click="drawCircle">圆</button>
      <button class="btn" @click="draw8Polygon">菱形</button>
      <button class="btn" @click="drawEllipse">椭圆</button>
    </div>
    <div>
      <canvas width="512" height="512" ref="canvas2D"></canvas>
      <canvas width="512" height="512" ref="canvasGL"></canvas>
    </div>
  </div>
</template>

<script lang="ts">
// https://g.gltjk.com/learn-visualization/canvas-webgl-polygon/
import { defineComponent, onMounted, ref, Ref } from 'vue'
import Canvas2D from './lib/Canvas2D'
import CanvasGL from './lib/CanvasGL'
import { makePolygonData, makeEllipseData } from './makePolygonData'
type Instance = {
  canvas2DTools?: Canvas2D
  canvasGLTools?: CanvasGL
}
function useDraw2DGLInstance(
  canvas2D: Ref<HTMLCanvasElement | undefined>,
  canvasGL: Ref<HTMLCanvasElement | undefined>
) {
  const instance: Instance = {}
  onMounted(() => {
    instance.canvas2DTools = new Canvas2D(canvas2D.value!, {
      drawCross: true
    })
    instance.canvasGLTools = new CanvasGL(canvasGL.value!)
  })

  return instance
}

export default defineComponent({
  name: 'multiPolygon',

  setup() {
    const canvas2D = ref<HTMLCanvasElement>()
    const canvasGL = ref<HTMLCanvasElement>()
    const drawInstance = useDraw2DGLInstance(canvas2D, canvasGL)

    function drawPentagon() {
      const polygonData = makePolygonData([0, 100])
      drawInstance.canvas2DTools!.drawPolygon(polygonData)
      drawInstance.canvasGLTools!.polygon(polygonData.map(el => [el.x, el.y]))
    }

    function drawStar() {
      const polygonData = makePolygonData([0, 100])
      drawInstance.canvas2DTools!.drawPolygon([0, 2, 4, 1, 3].map(i => polygonData[i]))
      drawInstance.canvasGLTools!.polygon([0, 2, 4, 1, 3].map(i => polygonData[i]).map(el => [el.x, el.y]))
    }
    function drawEvenoddStar() {
      const polygonData = makePolygonData([0, 100])
      drawInstance.canvas2DTools!.drawPolygon(
        [0, 2, 4, 1, 3].map(i => polygonData[i]),
        {
          rule: 'evenodd'
        }
      )
      drawInstance.canvasGLTools!.polygon(
        [0, 2, 4, 1, 3].map(i => polygonData[i]).map(el => [el.x, el.y]),
        {
          rule: 'evenodd'
        }
      )
    }

    function drawCircle() {
      const polygonData = makePolygonData([0, 100], 40)
      drawInstance.canvas2DTools!.drawPolygon(polygonData)
      drawInstance.canvasGLTools!.polygon(polygonData.map(el => [el.x, el.y]))
    }

    function draw8Polygon() {
      const polygonData = makePolygonData([0, 100], 8).map((item, index) => {
        if (index % 2 !== 0) {
          item = item.scale(0.5)
        }
        return item
      })
      drawInstance.canvas2DTools!.drawPolygon(polygonData)
      drawInstance.canvasGLTools!.polygon(polygonData.map(el => [el.x, el.y]))
    }

    function drawEllipse() {
      const data = makeEllipseData(0, 0, 100, 50)
      drawInstance.canvas2DTools!.drawPolygon(data)
      drawInstance.canvasGLTools!.polygon(data.map(el => [el.x, el.y]))
    }

    return {
      canvas2D,
      canvasGL,
      drawPentagon,
      drawStar,
      drawEvenoddStar,
      drawCircle,
      draw8Polygon,
      drawEllipse
    }
  }
})
</script>

<style lang="scss" scoped>
canvas {
  margin-right: 4px;
  border: 1px solid #ccc;
}
.btn {
  margin: 10px;
}
</style>
