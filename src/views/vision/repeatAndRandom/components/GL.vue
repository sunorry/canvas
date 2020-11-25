<template>
  <canvas width="512" height="512" ref="canvas"></canvas>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, Ref } from 'vue'
import GlRenderer from 'gl-renderer'
import vertex from './cfg/vertex.glsl'
import fragment from './cfg/fragment.glsl'

function useGLRender(canvas: Ref<HTMLCanvasElement | undefined>) {
  const glRender = ref()
  onMounted(() => {
    glRender.value = new GlRenderer(canvas.value!)
  })
  return glRender
}

export default defineComponent({
  name: 'GL',
  setup() {
    const canvas = ref<HTMLCanvasElement>()
    const glRender = useGLRender(canvas)
    onMounted(() => {
      const renderer = glRender.value! as any
      //第二步:
      const program = renderer.compileSync(fragment, vertex)
      renderer.useProgram(program)
      // 步骤三是设置 uniform 变量
      renderer.uniforms.rows = 64
      // 步骤四是将顶点数据送入缓冲区
      renderer.setMeshData([
        {
          // 顶点数据，正好覆盖整个 canvas 画布
          positions: [
            [-1, -1],
            [-1, 1],
            [1, 1],
            [1, -1]
          ],
          attributes: {
            // 纹理坐标，这个坐标系的左下角为 0,0，右上角为 1,1
            uv: [
              [0, 0],
              [0, 1],
              [1, 1],
              [1, 0]
            ]
          },
          // 顶点索引，WebGL 只能渲染经过三角剖分之后的多边形
          // 利用 cells: [(0, 1, 2), (2, 0, 3)]，我们就能将这个矩形画布剖分成两个三角形，这两个三角形的顶点下标分别是 (0, 1, 2) 和 (2, 0, 3)。
          cells: [
            [0, 1, 2],
            [2, 0, 3]
          ]
        }
      ])

      renderer.render()
    })
    return {
      canvas
    }
  }
})
</script>
