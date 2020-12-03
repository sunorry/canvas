<template>
  <div style="display: block">
    点击我试试
    <canvas ref="canvas" width="512" height="512" @click="handleClickCanvas"></canvas>
  </div>
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

function getGL(canvas: HTMLCanvasElement) {
  return canvas.getContext('webgl')!
}

function useGL(canvas: Ref<HTMLCanvasElement | undefined>) {
  const gl = ref<WebGLRenderingContext>()
  onMounted(() => (gl.value = canvas.value!.getContext('webgl')!))
  return gl
}

function randomColor() {
  return [Math.random() * 255, Math.random() * 255, Math.random() * 255, 1]
}

export default defineComponent({
  name: 'base_',
  setup() {
    const canvas = ref<HTMLCanvasElement>()
    const gl = useGL(canvas)
    const u_Color = ref<WebGLUniformLocation>()
    const a_Position = ref<number>()

    const points: {
      x: number
      y: number
      color: number[]
    }[] = []

    function handleClickCanvas(e: MouseEvent) {
      const safeGL = gl.value!
      console.log(e)
      points.push({
        x: e.offsetX,
        y: e.offsetY,
        color: randomColor()
      })
      safeGL.clearColor(0, 0, 0, 1.0)
      //用上一步设置的清空画布颜色清空画布。
      safeGL.clear(safeGL.COLOR_BUFFER_BIT)

      for (let i = 0; i < points.length; i++) {
        const point = points[i]
        const color = point.color
        console.log(u_Color.value!)
        safeGL.uniform4f(u_Color.value!, color[0], color[1], color[2], color[3])
        safeGL.vertexAttrib2f(a_Position.value!, point.x, point.y)
        safeGL.drawArrays(safeGL.POINTS, 0, 1)
      }
    }

    onMounted(() => {
      const gl = getGL(canvas.value!)
      // // 创建顶点着色器对象
      // const vertexShader = gl.createShader(gl.VERTEX_SHADER)!
      // // 将源码分配给顶点着色器对象
      // gl.shaderSource(vertexShader, vertex)
      // // 编译顶点着色器程序
      // gl.compileShader(vertexShader)
      // // 创建片元着色器程序
      // const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER)!
      // // 将源码分配给片元着色器对象
      // gl.shaderSource(fragmentShader, fragment)
      // // 编译片元着色器
      // gl.compileShader(fragmentShader)
      // //创建着色器程序
      // const program = gl.createProgram()!
      // //将顶点着色器挂载在着色器程序上。
      // gl.attachShader(program, vertexShader)
      // //将片元着色器挂载在着色器程序上。
      // gl.attachShader(program, fragmentShader)
      // //链接着色器程序
      // gl.linkProgram(program)
      // // 使用刚创建好的着色器程序。
      // gl.useProgram(program)
      const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertex)
      const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragment)
      const program = createProgram(gl, vertexShader, fragmentShader)
      gl.useProgram(program)
      //设置清空画布颜色为黑色。
      gl.clearColor(0.0, 0.0, 0.0, 1.0)

      //用上一步设置的清空画布颜色清空画布。
      gl.clear(gl.COLOR_BUFFER_BIT)

      a_Position.value = gl.getAttribLocation(program, 'a_Position')
      //找到顶点着色器中的变量a_Screen_Size
      const a_Screen_Size = gl.getAttribLocation(program, 'a_Screen_Size')

      //找到片元着色器中的变量u_Color
      u_Color.value = gl.getUniformLocation(program, 'u_Color')!

      gl.vertexAttrib2f(a_Screen_Size, canvas.value!.width, canvas.value!.height)

      gl.clearColor(0, 0, 0, 1.0)
      //用上一步设置的清空画布颜色清空画布。
      gl.clear(gl.COLOR_BUFFER_BIT)

      //绘制点。
      // gl.drawArrays(gl.POINTS, 0, 1)
    })
    return {
      canvas,
      gl,
      a_Position,
      u_Color,
      handleClickCanvas
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
