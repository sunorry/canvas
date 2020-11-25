import earcut from 'earcut'
import vertex from './vertex.glsl'
import fragment from './fragment.glsl'
import { vertices } from '../cfg'

export function renderWebGLPolygon(gl: WebGLRenderingContext) {
  const vertexShader = gl.createShader(gl.VERTEX_SHADER)!
  gl.shaderSource(vertexShader, vertex)
  gl.compileShader(vertexShader)

  const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER)!
  gl.shaderSource(fragmentShader, fragment)
  gl.compileShader(fragmentShader)

  const program = gl.createProgram()!
  gl.attachShader(program, vertexShader)
  gl.attachShader(program, fragmentShader)
  gl.linkProgram(program)
  gl.useProgram(program)
  // points 顶点 triangles 三角剖分
  const { points, triangles } = getPointsInfo()

  const position = new Float32Array(points)
  const cells = new Uint16Array(triangles)

  const pointBuffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, pointBuffer)
  gl.bufferData(gl.ARRAY_BUFFER, position, gl.STATIC_DRAW)

  const vPosition = gl.getAttribLocation(program, 'position')
  // 给变量设置长度和类型，每次迭代运行提取 2 个单位数据，每个单位数据类型是 32 位
  gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0)
  gl.enableVertexAttribArray(vPosition)

  const cellsBuffer = gl.createBuffer()
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cellsBuffer)
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, cells, gl.STATIC_DRAW)

  // u_color 是一个 uniform(全局变量) 变量
  const colorLoc = gl.getUniformLocation(program, 'u_color')
  gl.uniform4fv(colorLoc, [1, 0, 0, 1])

  gl.clear(gl.COLOR_BUFFER_BIT)
  gl.drawElements(gl.TRIANGLES, cells.length, gl.UNSIGNED_SHORT, 0)
  // gl.drawElements(gl.LINE_STRIP, cells.length, gl.UNSIGNED_SHORT, 0)

  return {
    program,
    vertices,
    cells
  }
}

function getPointsInfo() {
  const points = vertices.flat()
  const triangles = earcut(points) as number[]
  return {
    points,
    triangles
  }
}
// triangles => [1, 0, 9, 9, 8, 7, 7, 6, 5, 4, 3, 2, 2, 1, 9, 9, 7, 5, 4, 2, 9, 9, 5, 4]
// 这里的值，比如 1 表示 vertices 中下标为 1 的顶点，即点 (-0.4, 0.3)，每三个值可以构成一个三角形，所以 1、0、9 表示由 (-0.4, 0.3)、(-0.7, 0.5) 和 (-0.45, 0.0) 构成的三角形。
