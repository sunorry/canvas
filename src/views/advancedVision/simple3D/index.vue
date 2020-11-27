<template>
  <canvas width="512" height="512" ref="canvas"></canvas>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue'
import vertex from './vertex.glsl'
import fragment from './fragment.glsl'

function createShader(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type)!
  gl.shaderSource(shader, source)
  gl.compileShader(shader)
  return shader
}

function createProgram(gl: WebGLRenderingContext, vertexShader: WebGLShader, fragmentShader: WebGLShader) {
  const program = gl.createProgram()!
  gl.attachShader(program, vertexShader)
  gl.attachShader(program, fragmentShader)
  gl.linkProgram(program)
  return program
}

export default defineComponent({
  name: 'simple3D',
  setup() {
    const canvas = ref<HTMLCanvasElement>()
    function useGL(canvas: HTMLCanvasElement) {
      return canvas.getContext('webgl')!
    }
    onMounted(() => {
      const canvasInstance = canvas.value!
      const gl = useGL(canvasInstance)
      const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertex)
      const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragment)
      const program = createProgram(gl, vertexShader, fragmentShader)

      const positionAttributeLocation = gl.getAttribLocation(program, 'a_vertexPosition')

      const positionBuffer = gl.createBuffer()
      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
      const positions = [1.0, 0, 0, 1.0, -1.0, 0]
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW)

      const ration = window.devicePixelRatio
      canvasInstance.height = canvasInstance.clientHeight * ration
      canvasInstance.width = canvasInstance.clientWidth * ration
      gl.viewport(0, 0, gl.canvas.width, gl.canvas.height)
      gl.clearColor(0, 0, 0, 0)
      gl.clear(gl.COLOR_BUFFER_BIT)
      gl.useProgram(program)

      gl.enableVertexAttribArray(positionAttributeLocation)

      gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0)
      gl.drawArrays(gl.TRIANGLES, 0, 3)
    })
    return {
      canvas
    }
  }
})
</script>

<style lang="scss" scoped>
canvas {
  height: 512px;
  width: 512px;
}
</style>
