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

const CUBE_FACE_INDICES = [
  [0, 1, 2, 3], //前面
  [4, 5, 6, 7], //后面
  [0, 3, 5, 4], //左面
  [1, 7, 6, 2], //右面
  [3, 2, 6, 5], //上面
  [0, 4, 7, 1] // 下面
]

// const FACE_COLORS = [
//   [1, 0, 0, 1], // 前面，红色
//   [0, 1, 0, 1], // 后面，绿色
//   [0, 0, 1, 1], // 左面，蓝色
//   [1, 1, 0, 1], // 右面，黄色
//   [1, 0, 1, 1], // 上面，品色
//   [0, 1, 1, 1] // 下面，青色
// ]

function createCube(width: number, height: number, depth: number) {
  const zeroX = width / 2
  const zeroY = height / 2
  const zeroZ = depth / 2
  const cornerPositions = [
    [-zeroX, -zeroY, -zeroZ],
    [zeroX, -zeroY, -zeroZ],
    [zeroX, zeroY, -zeroZ],
    [-zeroX, zeroY, -zeroZ],
    [-zeroX, -zeroY, zeroZ],
    [-zeroX, zeroY, zeroZ],
    [zeroX, zeroY, zeroZ],
    [zeroX, -zeroY, zeroZ]
  ]

  const colorInput = [
    [255, 0, 0, 1],
    [0, 255, 0, 1],
    [0, 0, 255, 1],
    [255, 255, 0, 1],
    [0, 255, 255, 1],
    [255, 0, 255, 1]
  ]

  const colors = []
  const positions = []
  const indices = []

  for (let f = 0; f < 6; f++) {
    const faceIndices = CUBE_FACE_INDICES[f]
    for (let v = 0; v < 4; v++) {
      const position = cornerPositions[faceIndices[v]]
      positions.push(...position)
      colors.push(...colorInput[f])
    }
    const offset = 4 * f
    indices.push(offset + 0, offset + 1, offset + 2)
    indices.push(offset + 0, offset + 2, offset + 3)
  }
  return {
    positions: new Float32Array(positions),
    indices: new Uint16Array(indices),
    colors: new Float32Array(colors)
  }
}

export default defineComponent({
  name: 'cube',
  setup() {
    const canvas = ref<HTMLCanvasElement>()

    onMounted(() => {
      const gl = getGL(canvas.value!)
      const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertex)
      const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragment)
      const program = createProgram(gl, vertexShader, fragmentShader)
      console.log(program)
      const a_Position = gl.getAttribLocation(program, 'a_Position')
      const a_Uv = gl.getAttribLocation(program, 'a_Uv')

      const positionBuffer = gl.createBuffer()
      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
      const colorBuffer = gl.createBuffer()
      gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer)
      const indicesBuffer = gl.createBuffer()
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indicesBuffer)

      // prettier-ignore
      //正方体 8 个顶点的坐标信息
      const {
        positions, // 4(*3) * 6
        colors, // 4(*4) * 6
        indices // 6 * 6
      } = createCube(1,1,1)

      gl.clearColor(0.0, 0.0, 0.0, 1.0)
      gl.clear(gl.COLOR_BUFFER_BIT)
      gl.useProgram(program)

      gl.enableVertexAttribArray(a_Position)
      gl.enableVertexAttribArray(a_Uv)

      gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer)
      gl.bufferData(gl.ARRAY_BUFFER, colors, gl.STATIC_DRAW)

      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
      gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW)

      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indicesBuffer)
      gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW)

      gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0)
      gl.vertexAttribPointer(a_Uv, 4, gl.FLOAT, false, 0, 0)

      gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0)
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
