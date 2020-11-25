<template>
  <canvas width="256" height="256" ref="canvas"></canvas>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, Ref } from 'vue'
import vertex from './vertex.glsl'
import fragment from './fragment.glsl'

// 返回 0 到 range 范围内的随机整数
function randomInt(range: number) {
  return Math.floor(Math.random() * range)
}

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

export default defineComponent({
  name: 'HelloWorld',
  setup() {
    const canvas = ref<HTMLCanvasElement>()
    const u_gl = useGL(canvas)

    function setRectangle(gl: WebGLRenderingContext, x: number, y: number, width: number, height: number) {
      const x1 = x
      const x2 = x + width
      const y1 = y
      const y2 = y + height

      // 注意: gl.bufferData(gl.ARRAY_BUFFER, ...) 将会影响到
      // 当前绑定点`ARRAY_BUFFER`的绑定缓冲
      // 目前我们只有一个缓冲，如果我们有多个缓冲
      // 我们需要先将所需缓冲绑定到`ARRAY_BUFFER`

      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([x1, y1, x2, y1, x1, y2, x1, y2, x2, y1, x2, y2]), gl.STATIC_DRAW)
    }

    onMounted(() => {
      const gl = u_gl.value!
      const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertex)
      const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragment)
      // 将这两个着色器 link（链接）到一个 program（着色程序）
      const program = createProgram(gl, vertexShader, fragmentShader)

      // 寻找属性值位置（和全局属性位置）应该在初始化的时候完成，而不是在渲染循环中。
      const positionAttributeLocation = gl.getAttribLocation(program, 'a_position')
      // 过设置u_resolution为画布的分辨率， 着色器将会从positionBuffer中获取像素坐标将之转换为对应的裁剪空间坐标
      const resolutionUniformLocation = gl.getUniformLocation(program, 'u_resolution')
      const colorUniformLocation = gl.getUniformLocation(program, 'u_color')

      // 属性值从缓冲中获取数据，所以我们创建一个缓冲
      const positionBuffer = gl.createBuffer()
      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
      // const positions = [0, 0, 0, 0.5, 0.7, 0]
      const positions = [10, 20, 80, 20, 10, 30, 10, 30, 80, 20, 80, 30]
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW)

      // const ratio = window.devicePixelRatio
      // gl.canvas.width = (gl.canvas as HTMLCanvasElement).clientWidth * ratio
      // gl.canvas.height = (gl.canvas as HTMLCanvasElement).clientHeight * ratio

      gl.viewport(0, 0, gl.canvas.width, gl.canvas.height)
      // 清空画布
      gl.clearColor(0, 0, 0, 0)
      gl.clear(gl.COLOR_BUFFER_BIT)
      // 告诉WebGL运行哪个着色程序
      gl.useProgram(program)
      // 告诉WebGL怎么从我们之前准备的缓冲中获取数据给着色器中的属性

      // 启用数据
      gl.enableVertexAttribArray(positionAttributeLocation)
      // 指定从缓冲中读取数据的方式
      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
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
      // const count = 3
      const count = 6
      // gl.drawArrays(primitiveType, offset, count)
      // 绘制50个随机颜色矩形
      for (let ii = 0; ii < 50; ++ii) {
        // 创建一个随机矩形
        // 并将写入位置缓冲
        // 因为位置缓冲是我们绑定在
        // `ARRAY_BUFFER`绑定点上的最后一个缓冲
        setRectangle(gl, randomInt(300), randomInt(300), randomInt(300), randomInt(300))

        // 设置一个随机颜色
        gl.uniform4f(colorUniformLocation, Math.random(), Math.random(), Math.random(), 1)

        // 绘制矩形
        gl.drawArrays(primitiveType, offset, count)
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
  width: 256px;
  height: 256px;
}
</style>
