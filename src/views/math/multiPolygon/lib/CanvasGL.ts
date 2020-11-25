import { tesselate, WINDING_ODD, WINDING_NONZERO, POLYGONS } from 'tess2'
// BOUNDARY_CONTOURS: 2
// CONNECTED_POLYGONS: 1
// POLYGONS: 0
// WINDING_ABS_GEQ_TWO: 4
// WINDING_NEGATIVE: 3
// WINDING_NONZERO: 1
// WINDING_ODD: 0
// WINDING_POSITIVE: 2
// import { vertices } from '@/views/complexPolygon/cfg'
export default class CanvasGL {
  canvas: HTMLCanvasElement
  gl: WebGLRenderingContext
  color: number[]
  bgColor: number[]
  program: WebGLProgram
  constructor(canvas: HTMLCanvasElement, { color = '#000000', bgColor = '#FFFFFF' } = {}) {
    this.canvas = canvas
    this.gl = canvas.getContext('webgl')!
    this.color = hex2RGB(color)
    this.bgColor = hex2RGB(bgColor)
    this.program = this.init()
    this.clear()
  }

  init() {
    const size = this.canvas.width
    // TODO: vec4(position, 1.0, 256.0)
    //  1. position 是顶点
    //  2. 1.0 和 256.0 是什么，猜想是把 1 分成多少份，保持跟 canvas 一致
    const vertex = `
      attribute vec2 position;
      uniform vec4 u_color;
      varying vec4 vColor;
      void main() {
        gl_PointSize = 1.0;
        gl_Position = vec4(position, 1.0, ${(size / 2).toFixed(1)});
        vColor = u_color;
      }
    `
    // gl_FragColor = vec4(${this.color.map(x => x.toFixed(1)).join(',')});
    // gl_FragColor = vColor
    const fragment = `
      precision mediump float;
      varying vec4 vColor;
      void main() {
        gl_FragColor = vColor;
      }
    `
    const program = this.initShaderProgram(vertex, fragment)
    this.gl.useProgram(program)
    return program
  }

  clear() {
    const { gl, bgColor } = this
    const [red, green, blue, alpha] = bgColor
    gl.clearColor(red, green, blue, alpha)
    gl.clear(gl.COLOR_BUFFER_BIT)
    gl.clearDepth(1.0)
    gl.enable(gl.DEPTH_TEST)
    gl.depthFunc(gl.LEQUAL)
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
  }

  polygon(points: [number, number][], { rule = 'nonzero' } = {}) {
    this.clear()
    const triangles = this.polygonToTriangles(points, { rule })
    triangles.forEach(el => this.triangle(el))
  }

  triangle(points: [number, number][]) {
    // this.init()
    const { gl, program } = this
    this.buffer(points.flat())
    const vPosition = gl.getAttribLocation(program, 'position')
    // 给变量设置长度和类型，每次迭代运行提取 2 个单位数据，每个单位数据类型是 32 位，不需要要归一化数据，强烈建议读下课本
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0)
    gl.enableVertexAttribArray(vPosition)

    // u_color 是一个 uniform(全局变量) 变量
    const colorLoc = gl.getUniformLocation(program, 'u_color')
    gl.uniform4fv(colorLoc, this.getRandomColor())

    // WebGL 将对应的 buffer 数组传给顶点着色器，开始绘制
    gl.drawArrays(gl.TRIANGLES, 0, points.length)
  }

  buffer(data: number[]) {
    const gl = this.gl
    const positionBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW)
  }

  // doc: https://github.com/memononen/tess2.js
  // 'nonzero' | 'evenodd'
  polygonToTriangles(points: [number, number][], { rule = 'nonzero' } = {}) {
    const res = tesselate({
      contours: [points.flat()],
      windingRule: rule === 'nonzero' ? WINDING_NONZERO : WINDING_ODD,
      elementType: POLYGONS,
      polySize: 3,
      vertexSize: 2,
      strict: false
    })
    const triangles = []
    for (let i = 0; i < res.elements.length; i += 3) {
      const a = res.elements[i]
      const b = res.elements[i + 1]
      const c = res.elements[i + 2]
      triangles.push([
        [res.vertices[a * 2], res.vertices[a * 2 + 1]],
        [res.vertices[b * 2], res.vertices[b * 2 + 1]],
        [res.vertices[c * 2], res.vertices[c * 2 + 1]]
      ])
    }
    return triangles as [number, number][][]
  }

  getRandomColor() {
    return [random(), random(), random(), 1.0]
  }

  private initShaderProgram(vertex: string, fragment: string) {
    const { gl } = this
    const vertexShader = this.loadShader(gl.VERTEX_SHADER, vertex)
    const fragmentShader = this.loadShader(gl.FRAGMENT_SHADER, fragment)
    const shaderProgram = gl.createProgram()!
    gl.attachShader(shaderProgram, vertexShader)
    gl.attachShader(shaderProgram, fragmentShader)
    gl.linkProgram(shaderProgram)
    return shaderProgram
  }

  private loadShader(type: number, source: string) {
    const { gl } = this
    const shader = gl.createShader(type)!
    gl.shaderSource(shader, source)
    gl.compileShader(shader)
    return shader
  }
}

export function hex2RGB(hex: string, alpha = 1) {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)

  return [r, g, b, alpha]
}

function random() {
  return Number(Math.random().toFixed(1))
}
