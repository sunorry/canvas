<template>
  <canvas width="256" height="256" ref="canvas"></canvas>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, Ref } from 'vue'
import vertex from './vertex.glsl'
import fragment from './fragment.glsl'

function useGL(canvas: Ref<HTMLCanvasElement | undefined>) {
  const gl = ref<WebGLRenderingContext | null>()
  onMounted(() => {
    gl.value = canvas.value!.getContext('webgl')
  })
  return gl
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

// function setRectangle(gl: WebGLRenderingContext, x: number, y: number, width: number, height: number) {
//   const x1 = x
//   const x2 = x + width
//   const y1 = y
//   const y2 = y + height
//   gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([x1, y1, x2, y1, x1, y2, x1, y2, x2, y1, x2, y2]), gl.STATIC_DRAW)
// }

function setGeometry(gl: WebGLRenderingContext, x: number, y: number) {
  const width = 100
  const height = 150
  const thickness = 30
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([
      // 左竖
      x,
      y,
      x + thickness,
      y,
      x,
      y + height,
      x,
      y + height,
      x + thickness,
      y,
      x + thickness,
      y + height,

      // 上横
      x + thickness,
      y,
      x + width,
      y,
      x + thickness,
      y + thickness,
      x + thickness,
      y + thickness,
      x + width,
      y,
      x + width,
      y + thickness,

      // 中横
      x + thickness,
      y + thickness * 2,
      x + (width * 2) / 3,
      y + thickness * 2,
      x + thickness,
      y + thickness * 3,
      x + thickness,
      y + thickness * 3,
      x + (width * 2) / 3,
      y + thickness * 2,
      x + (width * 2) / 3,
      y + thickness * 3
    ]),
    gl.STATIC_DRAW
  )
}

export default defineComponent({
  name: 'ComplexTranslate',
  setup() {
    const canvas = ref<HTMLCanvasElement>()
    const u_gl = useGL(canvas)
    onMounted(() => {
      const gl = u_gl.value!
      const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertex)
      const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragment)
      const program = createProgram(gl, vertexShader, fragmentShader)

      // 寻找属性值位置
      const positionAttributeLocation = gl.getAttribLocation(program, 'a_position')

      const resolutionUniformLocation = gl.getUniformLocation(program, 'u_resolution')
      const colorLocation = gl.getUniformLocation(program, 'u_color')

      const translationLocation = gl.getUniformLocation(program, 'u_translation')
      // 属性值从缓冲中获取数据
      const positionBuffer = gl.createBuffer()
      // 首先绑定一个数据源到绑定点（gl.ARRAY_BUFFER），然后绑定点指向该数据源
      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
      const ratio = window.devicePixelRatio
      const displayWidth = Math.floor(gl.canvas.width * ratio)
      const displayHeight = Math.floor(gl.canvas.height * ratio)

      // 检查画布尺寸是否相同
      if (gl.canvas.width !== displayWidth || gl.canvas.height !== displayHeight) {
        // 设置为相同的尺寸
        gl.canvas.width = displayWidth
        gl.canvas.height = displayHeight
      }

      let x = 0
      let y = 0
      // drawScene([x, y])

      setInterval(() => {
        if (x < 512 && y < 512) {
          x++
          y++
        } else {
          x = 0
          y = 0
        }
        drawScene([x, y])
      }, 100)
      function drawScene(translation: number[]) {
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height)
        gl.clear(gl.COLOR_BUFFER_BIT)
        gl.useProgram(program)
        gl.enableVertexAttribArray(positionAttributeLocation)
        // setRectangle(gl, translation[0], translation[1], 100, 30)
        setGeometry(gl, 0, 0)
        const size = 2 // 每次迭代运行提取两个单位数据
        const type = gl.FLOAT // 每个单位的数据类型是32位浮点型
        const normalize = false // 不需要归一化数据
        const stride = 0 // 0 = 移动单位数量 * 每个单位占用内存（sizeof(type)）
        // 每次迭代运行运动多少内存到下一个数据开始点
        const offset = 0 // 从缓冲起始位置开始读取
        gl.vertexAttribPointer(positionAttributeLocation, size, type, normalize, stride, offset)
        gl.uniform2f(resolutionUniformLocation, gl.canvas.width, gl.canvas.height)
        gl.uniform4fv(colorLocation, [Math.random(), Math.random(), Math.random(), 1])
        gl.uniform2fv(translationLocation, translation)
        const primitiveType = gl.TRIANGLES
        gl.drawArrays(primitiveType, 0, 18)
      }
    })

    return { canvas }
  }
})
</script>

<style lang="scss" scoped>
canvas {
  width: 256px;
  height: 256px;
}
</style>
