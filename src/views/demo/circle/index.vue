<template>
  <canvas ref="canvas" width="512" height="512"></canvas>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, Ref } from 'vue'
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

// function createBuffer(gl: WebGLRenderingContext, attribute: number, size: number) {
//   gl.enableVertexAttribArray(attribute)
//   const buffer = gl.createBuffer()
//   gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
//   gl.vertexAttribPointer(attribute, size, gl.FLOAT, false, 0, 0)
//   return buffer
// }

function randomColor() {
  return [Math.random() * 255, Math.random() * 255, Math.random() * 255, 1]
}
// function useGL(canvas: Ref<HTMLCanvasElement | undefined>) {
//   const gl = ref<WebGLRenderingContext>()
//   onMounted(() => (gl.value = canvas.value!.getContext('webgl')!))
//   return gl
// }

function getGL(canvas: HTMLCanvasElement) {
  return canvas.getContext('webgl')!
}
function createCircleVertex(x: number, y: number, radius: number, n: number) {
  const positions = [x, y]
  for (let i = 0; i <= n; i++) {
    const angle = (Math.PI * 2 * i) / n
    // prettier-ignore
    positions.push(
      x + radius * Math.cos(angle),
      y + radius * Math.sin(angle),
      // 255,
      // 0,
      // 0,
      // 1
    )
  }
  return positions
}
export default defineComponent({
  name: 'circles',
  setup() {
    const canvas = ref<HTMLCanvasElement>()

    onMounted(() => {
      const gl = getGL(canvas.value!)
      const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertex)
      const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragment)
      const program = createProgram(gl, vertexShader, fragmentShader)

      const a_Screen_Size = gl.getAttribLocation(program, 'a_Screen_Size')
      // const u_color = gl.getUniformLocation(program, 'u_Color')
      const a_Position = gl.getAttribLocation(program, 'a_Position')
      // const color = randomColor()
      const positions = createCircleVertex(100, 100, 50, 50)
      const positionBuffer = gl.createBuffer()
      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)

      gl.clearColor(0.0, 0.0, 0.0, 1.0)
      gl.clear(gl.COLOR_BUFFER_BIT)
      gl.useProgram(program)

      gl.enableVertexAttribArray(a_Position)
      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
      gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0)
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW)

      gl.vertexAttrib2f(a_Screen_Size, canvas.value!.width, canvas.value!.height)
      // gl.uniform4f(u_color, color[0], color[1], color[2], color[3])
      gl.drawArrays(gl.TRIANGLE_FAN, 0, positions.length / 2)
    })
    return {
      canvas
    }
  }
})
</script>

<style lang="scss" scoped>
canvas {
  width: 512px;
  height: 512px;
}
</style>
