<template>
  <canvas ref="canvas" width="512" height="512"></canvas>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, Ref } from 'vue'
import vertex from './vertex.glsl'
import fragment from './fragment.glsl'
function randomColor() {
  return [Math.random() * 255, Math.random() * 255, Math.random() * 255, 1]
}
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
function useGL(canvas: Ref<HTMLCanvasElement | undefined>) {
  const gl = ref<WebGLRenderingContext>()
  onMounted(() => (gl.value = canvas.value!.getContext('webgl')!))
  return gl
}

function getGL(canvas: HTMLCanvasElement) {
  return canvas.getContext('webgl')!
}
export default defineComponent({
  name: 'lines',
  setup() {
    const canvas = ref<HTMLCanvasElement>()

    onMounted(() => {
      const gl = getGL(canvas.value!)
      const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertex)
      const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragment)
      const program = createProgram(gl, vertexShader, fragmentShader)
      gl.useProgram(program)

      gl.clearColor(0.0, 0.0, 0.0, 1.0)
      //用上一步设置的清空画布颜色清空画布。
      gl.clear(gl.COLOR_BUFFER_BIT)

      const color = randomColor()
      const u_Color = gl.getUniformLocation(program, 'u_Color')
      gl.uniform4f(u_Color, color[0], color[1], color[2], color[3])
      const a_Screen_Size = gl.getAttribLocation(program, 'a_Screen_Size')
      gl.vertexAttrib2f(a_Screen_Size, canvas.value!.width, canvas.value!.height)

      const a_Position = gl.getAttribLocation(program, 'a_Position')

      const buffer = gl.createBuffer()
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([0, 0, 400, 400]), gl.STATIC_DRAW)

      gl.enableVertexAttribArray(a_Position)
      gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0)
      gl.drawArrays(gl.LINES, 0, 2)
    })
    return {
      canvas
    }
  }
})
</script>
