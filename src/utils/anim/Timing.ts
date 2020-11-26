export default class Timing {
  startTime: number
  duration: number
  iterations: number
  // duration 一个周期持续时间
  // iterations 周期
  constructor({ duration = 1, iterations = 1 } = {}) {
    this.startTime = Date.now()
    this.duration = duration
    this.iterations = iterations
  }

  get time() {
    return Date.now() - this.startTime
  }

  get p() {
    const progress = Math.min(this.time / this.duration, this.iterations)
    return this.isFinished ? 1 : progress % 1
    // return  progress % 1
  }

  get isFinished() {
    return this.time / this.duration >= this.iterations
  }
}
