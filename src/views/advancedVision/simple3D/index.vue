<template>
  <canvas width="512" height="512" ref="canvas"></canvas>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue'
import vertex from './vertex.glsl'
import fragment from './fragment.glsl'
import { cube as get3DPoints, fromRotation } from './utils'

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
      const colorAttributeLocation = gl.getUniformLocation(program, 'u_color')
      const projectionAttributeLocation = gl.getUniformLocation(program, 'projectionMatrix')
      const modelMatrixAttributeLocation = gl.getUniformLocation(program, 'modelMatrix')

      const ration = window.devicePixelRatio
      canvasInstance.height = canvasInstance.clientHeight * ration
      canvasInstance.width = canvasInstance.clientWidth * ration

      gl.enable(gl.DEPTH_TEST)
      gl.useProgram(program)

      const { positions, color } = get3DPoints(1.0, [
        [1, 0, 0, 1],
        [0, 0.5, 0, 1],
        [1, 0, 1, 1],
        [1, 0.5, 1, 1],
        [0.5, 1, 1, 1],
        [1, 1, 0.5, 1]
      ])
      const projectionMatrix = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, -1, 0, 0, 0, 0, 1]
      gl.uniformMatrix4fv(projectionAttributeLocation, false, new Float32Array(projectionMatrix))

      let a = 0
      let b = 0
      let c = 0
      function render() {
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height)
        gl.clearColor(0, 0, 0, 0)
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
        for (let i = 0; i < positions.length / 3 / 4; i++) {
          const positionBuffer = gl.createBuffer()
          gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
          const pos = positions.slice(i * 12, (i + 1) * 12)
          const vertexPos = [
            pos[0],
            pos[1],
            pos[2],

            pos[3],
            pos[4],
            pos[5],

            pos[6],
            pos[7],
            pos[8],

            pos[0],
            pos[1],
            pos[2],

            pos[6],
            pos[7],
            pos[8],

            pos[9],
            pos[10],
            pos[11]
          ]
          gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexPos), gl.STATIC_DRAW)
          gl.enableVertexAttribArray(positionAttributeLocation)
          gl.vertexAttribPointer(positionAttributeLocation, 3, gl.FLOAT, false, 0, 0)
          gl.uniform4fv(colorAttributeLocation, new Float32Array(color[i]))
          gl.uniformMatrix4fv(modelMatrixAttributeLocation, false, new Float32Array(fromRotation(a, b, c)))
          gl.drawArrays(gl.TRIANGLES, 0, vertexPos.length / 3)
        }
        a += 0.01
        b += 0.01
        c += 0.01
        requestAnimationFrame(render)
      }
      render()
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
