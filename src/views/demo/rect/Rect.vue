<template>
  <canvas ref="canvas" width="512" height="512"></canvas>
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

// function createBuffer(gl: WebGLRenderingContext, attribute: number, size: number) {
//   gl.enableVertexAttribArray(attribute)
//   const buffer = gl.createBuffer()
//   gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
//   gl.vertexAttribPointer(attribute, size, gl.FLOAT, false, 0, 0)
//   return buffer
// }

// function randomColor() {
//   return [Math.random() * 255, Math.random() * 255, Math.random() * 255, 1]
// }
// function useGL(canvas: Ref<HTMLCanvasElement | undefined>) {
//   const gl = ref<WebGLRenderingContext>()
//   onMounted(() => (gl.value = canvas.value!.getContext('webgl')!))
//   return gl
// }

function getGL(canvas: HTMLCanvasElement) {
  return canvas.getContext('webgl')!
}
export default defineComponent({
  name: 'rect',
  setup() {
    const canvas = ref<HTMLCanvasElement>()

    onMounted(() => {
      const gl = getGL(canvas.value!)
      const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertex)
      const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragment)
      const program = createProgram(gl, vertexShader, fragmentShader)

      const a_Screen_Size = gl.getAttribLocation(program, 'a_Screen_Size')
      const a_Position = gl.getAttribLocation(program, 'a_Position')
      const a_Color = gl.getAttribLocation(program, 'a_Color')

      gl.clearColor(0.0, 0.0, 0.0, 1.0)
      gl.clear(gl.COLOR_BUFFER_BIT)
      gl.useProgram(program)

      gl.enableVertexAttribArray(a_Position)
      gl.enableVertexAttribArray(a_Color)

      const buffer = gl.createBuffer()
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer)

      // prettier-ignore
      const positions = [
        30, 30, 255, 0, 0, 1,    //V0
        30, 300, 255, 0, 0, 1,   //V1
        300, 300, 255, 0, 0, 1,  //V2
        30, 30, 0, 255, 0, 1,    //V0
        300, 300, 0, 255, 0, 1,  //V2
        300, 30, 0, 255, 0, 1    //V3
      ]

      gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW)

      gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 24, 0)
      gl.vertexAttribPointer(a_Color, 4, gl.FLOAT, false, 24, 8)
      gl.vertexAttrib2f(a_Screen_Size, canvas.value!.width, canvas.value!.height)
      gl.drawArrays(gl.TRIANGLES, 0, positions.length / 6)
    })
    return {
      canvas
    }
  }
})
</script>
