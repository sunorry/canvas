interface VectorType {
  x: number
  y: number
}
export default class Vector2D extends Array<number> {
  constructor(x = 1, y = 0) {
    super(x, y)
  }

  get x() {
    return this[0]
  }

  set x(v) {
    this[0] = v
  }

  get y() {
    return this[1]
  }

  set y(v) {
    this[1] = v
  }

  get len() {
    return Math.hypot(this.x, this.y)
  }

  get dir() {
    return Math.atan2(this.y, this.x)
  }

  copy() {
    return new Vector2D(this.x, this.y)
  }

  add(v: VectorType) {
    this.x += v.x
    this.y += v.y
    return this
  }

  sub(v: VectorType) {
    this.x -= v.x
    this.y -= v.y
    return this
  }

  scale(a: number) {
    this.x *= a
    this.y *= a
    return this
  }

  rotate(rad: number) {
    const c = Math.cos(rad),
      s = Math.sin(rad)
    const [x, y] = this
    this.x = x * c + y * -s
    this.y = x * s + y * c
    return this
  }

  // 向量的叉乘
  cross(v: VectorType) {
    return this.x * v.y - v.x * this.y
  }

  // 向量的点乘
  dot(v: VectorType) {
    return this.x * v.x + v.y * this.y
  }
  // 归一化，转化为长度为以的向量
  normalize() {
    return this.scale(1 / this.len)
  }
}
