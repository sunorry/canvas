<template>
  <canvas ref="trangle_canvas" width="512" height="256"></canvas>
  <canvas ref="repeate_canvas" width="512" height="256"></canvas>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
// 1. 顶点和片元着色器
import trangle_vertex from './trangle_vertex.glsl'
import trangle_fragment from './trangle_fragment.glsl'
import repeat_vertex from './repeat_vertex.glsl'
// import repeat_fragment from './repeat_fragment.glsl'

export default defineComponent({
  name: 'Triangle',

  methods: {
    drawRepeat() {
      const canvas = this.$refs.repeate_canvas as HTMLCanvasElement
      const gl = canvas.getContext('webgl') as WebGLRenderingContext

      const vertexShader = gl.createShader(gl.VERTEX_SHADER)
      gl.shaderSource(vertexShader as WebGLShader, repeat_vertex)
      gl.compileShader(vertexShader as WebGLShader)
      const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER)
      gl.shaderSource(fragmentShader as WebGLShader, trangle_fragment)
      gl.compileShader(fragmentShader as WebGLShader)

      const program = gl.createProgram()
      gl.attachShader(program as WebGLProgram, vertexShader as WebGLShader)
      gl.attachShader(program as WebGLProgram, fragmentShader as WebGLShader)
      gl.linkProgram(program as WebGLProgram)
      gl.useProgram(program)
    },

    drawTrangle() {
      const canvas = this.$refs.trangle_canvas as HTMLCanvasElement
      const gl = canvas.getContext('webgl') as WebGLRenderingContext

      // 2. 在 js 中创建 shader 对象
      const vertexShader = gl.createShader(gl.VERTEX_SHADER)
      gl.shaderSource(vertexShader as WebGLShader, trangle_vertex)
      gl.compileShader(vertexShader as WebGLShader)

      const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER)
      gl.shaderSource(fragmentShader as WebGLShader, trangle_fragment)
      gl.compileShader(fragmentShader as WebGLShader)

      // 3. 创建 WebGLProgram 对象，并将这两个 shader 关联上
      const program = gl.createProgram()
      gl.attachShader(program as WebGLProgram, vertexShader as WebGLShader)
      gl.attachShader(program as WebGLProgram, fragmentShader as WebGLShader)
      gl.linkProgram(program as WebGLProgram) // 将 WebGLProgram 对象链接到 WebGL 上下文对象上
      gl.useProgram(program) // 启动 WebGLProgram 对象

      // 4. 将三角形的数据存入缓冲区，也就能将这些数据送入 GPU 了
      // 定义三角形的三个顶点
      const points = new Float32Array([-1, -1, 0, 2, 1, -1])
      // const points = new Float32Array([-1, 1, 1, 1, 1, -1, -1, -1]);
      // 把 points 写入缓冲区
      const bufferId = gl.createBuffer()
      gl.bindBuffer(gl.ARRAY_BUFFER, bufferId)
      gl.bufferData(gl.ARRAY_BUFFER, points, gl.STATIC_DRAW)

      // 5. 将数据绑定给顶点着色器的 position 变量

      // 获取顶点着色器的 position 变量的地址
      const vPosition = gl.getAttribLocation(program as WebGLProgram, 'position')
      // 给变量设置长度和类型
      gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0)
      // 激活变量
      gl.enableVertexAttribArray(vPosition)

      // 6. 绘制
      gl.clear(gl.COLOR_BUFFER_BIT)
      gl.drawArrays(gl.TRIANGLE_FAN, 0, points.length / 2)
      // gl.drawArrays(gl.LINE_LOOP, 0, points.length / 2)
    }
  },

  mounted() {
    this.drawTrangle()
  }
})
</script>

<style lang="scss" scoped></style>
