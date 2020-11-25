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

// 定义一个三角形填充到缓冲里

export default defineComponent({
  name: 'hello world2',
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
      // 属性值从缓冲中获取数据
      const positionBuffer = gl.createBuffer()
      // 首先绑定一个数据源到绑定点（gl.ARRAY_BUFFER），然后绑定点指向该数据源
      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
      // 三个二维点坐标
      const positions = [10, 20, 80, 20, 10, 30, 10, 30, 80, 20, 80, 30]
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW)

      const ratio = window.devicePixelRatio
      const displayWidth = Math.floor(gl.canvas.width * ratio)
      const displayHeight = Math.floor(gl.canvas.height * ratio)

      // 检查画布尺寸是否相同
      if (gl.canvas.width !== displayWidth || gl.canvas.height !== displayHeight) {
        // 设置为相同的尺寸
        gl.canvas.width = displayWidth
        gl.canvas.height = displayHeight
      }
      gl.viewport(0, 0, gl.canvas.width, gl.canvas.height)
      gl.clearColor(0, 0, 0, 0)
      gl.useProgram(program)

      gl.enableVertexAttribArray(positionAttributeLocation)
      // 告诉属性怎么从positionBuffer中读取数据 (ARRAY_BUFFER)
      const size = 2 // 每次迭代运行提取两个单位数据
      const type = gl.FLOAT // 每个单位的数据类型是32位浮点型
      const normalize = false // 不需要归一化数据
      const stride = 0 // 0 = 移动单位数量 * 每个单位占用内存（sizeof(type)）
      // 每次迭代运行运动多少内存到下一个数据开始点
      const offset = 0 // 从缓冲起始位置开始读取
      gl.vertexAttribPointer(positionAttributeLocation, size, type, normalize, stride, offset)
      gl.uniform2f(resolutionUniformLocation, gl.canvas.width, gl.canvas.height)
      const primitiveType = gl.TRIANGLES
      gl.drawArrays(primitiveType, 0, 6)
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
