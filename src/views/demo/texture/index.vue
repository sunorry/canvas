<template>
  <canvas ref="canvas" width="512" height="512"></canvas>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue'
import vertex from './vertex.glsl'
import fragment from './fragment.glsl'
import imgLink from './wave.jpg'

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

// function randomColor() {
//   return [Math.random() * 255, Math.random() * 255, Math.random() * 255, 1]
// }

function getGL(canvas: HTMLCanvasElement) {
  return canvas.getContext('webgl')!
}
export default defineComponent({
  name: 'texture',
  setup() {
    const canvas = ref<HTMLCanvasElement>()

    onMounted(() => {
      const gl = getGL(canvas.value!)
      const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertex)
      const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragment)
      const program = createProgram(gl, vertexShader, fragmentShader)

      const a_Position = gl.getAttribLocation(program, 'a_Position')
      const a_Uv = gl.getAttribLocation(program, 'a_Uv')
      const u_Texture = gl.getUniformLocation(program, 'u_Texture')
      const u_Screen_Size = gl.getUniformLocation(program, 'u_Screen_Size')

      // prettier-ignore
      const positions = [
        30, 30, 0, 0,    //V0
        30, 300, 0, 1,   //V1
        300, 300, 1, 1,  //V2
        30, 30, 0, 0,    //V0
        300, 300, 1, 1,  //V2
        300, 30, 1, 0    //V3
      ]

      const buffer = gl.createBuffer()
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer)

      gl.clearColor(0.0, 0.0, 0.0, 1.0)
      gl.clear(gl.COLOR_BUFFER_BIT)
      gl.useProgram(program)

      gl.enableVertexAttribArray(a_Position)
      gl.enableVertexAttribArray(a_Uv)

      gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW)
      gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 16, 0)
      gl.vertexAttribPointer(a_Uv, 2, gl.FLOAT, false, 16, 8)

      gl.uniform2f(u_Screen_Size, canvas.value!.width, canvas.value!.height)

      const img = new Image()
      img.src = imgLink
      img.onload = function() {
        gl.activeTexture(gl.TEXTURE0)
        const texture = gl.createTexture()
        gl.bindTexture(gl.TEXTURE_2D, texture)
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img)
        gl.texParameterf(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
        gl.texParameterf(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
        gl.uniform1i(u_Texture, 0)
        gl.drawArrays(gl.TRIANGLES, 0, positions.length / 4)
      }
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
