<template>
  <canvas width="512" height="512" ref="canvasGL"></canvas>
  <!-- <div class="block">css 动画实验</div> -->
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, Ref } from 'vue'
import CanvasGL from './lib/CanvasGL'

function useDrawGLInstance(canvas: Ref<HTMLCanvasElement | undefined>) {
  const instance = ref()
  onMounted(() => {
    const gl = canvas.value!.getContext('webgl')!
    instance.value = new CanvasGL(gl)
  })
  return instance
}

export default defineComponent({
  name: 'IonAnimation',

  setup() {
    const canvasGL = ref<HTMLCanvasElement>()
    const drawInstance = useDrawGLInstance(canvasGL)
    onMounted(() => {
      const glInstance = drawInstance.value! as CanvasGL
      glInstance.draw([-1, -1, 0, 1, 1, -1])
      glInstance.animate()
    })
    return {
      canvasGL
    }
  }
})
</script>

<style lang="scss" scoped>
canvas {
  margin-right: 4px;
  border: 1px solid #ccc;
}
// .block {
//   display: block;
//   width: 100px;
//   height: 100px;
//   background: blue;
//   // transform: rotate(30deg) translate(100px, 50px) scale(1.5);
//   transform: matrix(1.3, -0.75, 61, 0.75, 1.3, 93);
// }
</style>
