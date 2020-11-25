import vertex from '../shaders/vertex.glsl'
import fragment from '../shaders/fragment.glsl'
import randomTriangles from '../utils/randomTriangles'

export default class CanvasGL {
  gl: WebGLRenderingContext
  program: WebGLProgram
  triangles: {
    u_color: number[]
    u_rotation: number
    u_scale: number
    u_time: number
    u_duration: number
    u_dir: number[]
    startTime: number
  }[]
  constructor(gl: WebGLRenderingContext) {
    this.triangles = []
    this.gl = gl
    this.program = this.init()
  }

  init() {
    const program = this.initShaderProgram()
    return program
  }

  draw(vertexPosition: number[]) {
    // const gl = this.gl
    this.buffer(vertexPosition)
    this.setPos2Vertex()
    // gl.drawArrays(gl.TRIANGLES, 0, vertexPosition.length)
  }

  setUniforms({
    u_color,
    u_rotation,
    u_scale,
    u_time,
    u_duration,
    u_dir
  }: {
    u_color: number[]
    u_rotation: number
    u_scale: number
    u_time: number
    u_duration: number
    u_dir: number[]
    startTime: number
  }) {
    const { gl, program } = this
    // gl.getUniformLocation 拿到uniform变量的指针
    let loc = gl.getUniformLocation(program, 'u_color')
    // 将数据传给 unfirom 变量的地址
    gl.uniform4fv(loc, u_color)
    loc = gl.getUniformLocation(program, 'u_rotation')
    gl.uniform1f(loc, u_rotation)
    loc = gl.getUniformLocation(program, 'u_scale')
    gl.uniform1f(loc, u_scale)
    loc = gl.getUniformLocation(program, 'u_time')
    gl.uniform1f(loc, u_time)
    loc = gl.getUniformLocation(program, 'u_duration')
    gl.uniform1f(loc, u_duration)
    loc = gl.getUniformLocation(program, 'u_dir')
    gl.uniform2fv(loc, u_dir)
  }

  animate() {
    requestAnimationFrame(this.update.bind(this))
  }

  private update() {
    const { gl, triangles } = this
    for (let i = 0; i < 5 * Math.random(); i++) {
      triangles.push(randomTriangles())
    }
    gl.clear(gl.COLOR_BUFFER_BIT)
    // 对每个三角形重新设置u_time
    triangles.forEach(triangle => {
      triangle.u_time = (performance.now() - triangle.startTime) / 1000
      this.setUniforms(triangle)
      gl.drawArrays(gl.TRIANGLES, 0, 3) // 3 = position.length/2
    })
    // 移除已经结束动画的三角形
    this.triangles = triangles.filter(triangle => {
      return triangle.u_time <= triangle.u_duration
    })
    this.animate()
  }

  private initShaderProgram() {
    const { vertexShader, fragmentShader } = this.initShader()
    const program = this.initProgram(vertexShader, fragmentShader)
    return program
  }

  private initShader() {
    const { gl } = this
    const vertexShader = gl.createShader(gl.VERTEX_SHADER)!
    gl.shaderSource(vertexShader, vertex)
    gl.compileShader(vertexShader)

    const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER)!
    gl.shaderSource(fragmentShader, fragment)
    gl.compileShader(fragmentShader)
    return {
      vertexShader,
      fragmentShader
    }
  }

  private initProgram(vertexShader: WebGLShader, fragmentShader: WebGLShader) {
    const { gl } = this
    const program = gl.createProgram()!
    gl.attachShader(program, vertexShader)
    gl.attachShader(program, fragmentShader)
    gl.linkProgram(program)
    gl.useProgram(program)
    return program
  }

  private buffer(position: number[]) {
    const gl = this.gl
    const p = new Float32Array(position)
    const bufferId = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferId)
    gl.bufferData(gl.ARRAY_BUFFER, p, gl.STATIC_DRAW)
  }

  private setPos2Vertex() {
    const { gl, program } = this
    const vPosition = gl.getAttribLocation(program, 'position')
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0)
    gl.enableVertexAttribArray(vPosition)
  }
}
