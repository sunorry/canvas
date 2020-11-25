import Timing from './Timing'

type argsType = {
  duration: number
  iterations: number
}
export default class Animator {
  timing: argsType
  constructor({ duration, iterations }: argsType) {
    this.timing = { duration, iterations }
  }

  animate(target: any, update: any) {
    let frameIndex = 0
    const timing = new Timing(this.timing)
    return new Promise(resolve => {
      function next() {
        if (update({ target, frameIndex, timing }) !== false && !timing.isFinished) {
          requestAnimationFrame(next)
        } else {
          resolve(timing)
        }
        frameIndex++
      }
      next()
    })
  }
}
