<template>
<div>
  <div>
    固定帧动画:css animation
    <div class="bird"></div>
  </div>
  <div>
    增量动画: requestAnimationFrame rotaiton++
    <div ref="block" class="sq"></div>
  </div>
  <div>
    时序动画: requestAnimationFrame(update)，按照时间计算旋转角度
    <div ref="time" class="sq">update</div>
  </div>
  <div class="container">
    准动画模型，Timing 处理时间，Animator 控制动画过程
    <div class="block"></div>
    <div class="block"></div>
    <div class="block"></div>
    <div class="block"></div>
  </div>
  <div>
    插值: 点击运行
    <div class="sqw">
      <div ref="cz" class="sq" @click="czAnim" style="position: absolute"></div>
    </div>
  </div>
  <div>
    加速：点击运行
    <div style="position: relative" class="sqw">
      <div ref="js" class="sq" @click="jsAnim" style="position: absolute"></div>
    </div>
  </div>
  <div>
    减速：点击运行
    <div style="position: relative" class="sqw">
      <div ref="jsd" class="sq" @click="jsdAnim" style="position: absolute"></div>
    </div>
  </div>
</div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue'
import Animator from '@/utils/anim/Animator'
export default defineComponent({
  name: 'simpleAnim',

  setup() {
    const block = ref<HTMLDivElement>()
    const time = ref<HTMLDivElement>()
    const cz = ref<HTMLDivElement>()
    const js = ref<HTMLDivElement>()
    const jsd = ref<HTMLDivElement>()

    function czAnim() {
      const block = cz.value!
      const animator = new Animator({ duration: 300, iterations: 1 })
      animator.animate(
        {
          el: block,
          start: 100,
          end: 800
        },
        ({ target, timing }: { target: any; timing: any }) => {
          const left = target.start * (1 - timing.p) + target.end * timing.p
          target.el.style.left = `${left}px`
          console.log(target.el, left)
        }
      )
    }

    function jsAnim() {
      const block = js.value!
      const animator = new Animator({ duration: 300, iterations: 1 })
      animator.animate(
        {
          el: block,
          start: 100,
          end: 800
        },
        ({ target, timing }: { target: any; timing: any }) => {
          const p = timing.p ** 2
          const left = target.start * (1 - p) + target.end * p
          target.el.style.left = `${left}px`
          console.log(target.el, left)
        }
      )
    }

    function jsdAnim() {
      const block = jsd.value!
      const animator = new Animator({ duration: 300, iterations: 1 })
      animator.animate(
        {
          el: block,
          start: 100,
          end: 800
        },
        ({ target, timing }: { target: any; timing: any }) => {
          const p = timing.p * ( 2 - timing.p)
          const left = target.start * (1 - p) + target.end * p
          target.el.style.left = `${left}px`
          console.log(target.el, left)
        }
      )
    }

    onMounted(() => {
      const blockEl = block.value!
      let rotation = 0
      requestAnimationFrame(function update() {
        blockEl.style.transform = `rotate(${rotation++}deg)`
        requestAnimationFrame(update)
      })

      const timeEl = time.value!
      const startAngle = 0
      const T = 2000
      let startTime: number | null = null
      function update() {
        startTime = startTime === null ? Date.now() : startTime
        const p = (Date.now() - startTime) / T
        const angle = startAngle + p * 360
        timeEl.style.transform = `rotate(${angle}deg)`
        requestAnimationFrame(update)
      }
      update()

      const blocks = document.querySelectorAll('.block')
      const animator = new Animator({ duration: 1000, iterations: 1.1 })
      ;(async function() {
        let i = 0
        // eslint-disable-next-line no-constant-condition
        while (true) {
          await animator.animate(blocks[i++ % 4], ({ target, timing }: { target: HTMLDivElement; timing: any }) => {
            target.style.transform = `rotate(${timing.p * 360}deg)`
          })
        }
      })()

      // 插值
    })

    return {
      block,
      time,
      cz,
      czAnim,
      js,
      jsd,
      jsdAnim,
      jsAnim
    }
  }
})
</script>

<style lang="scss" scoped>
.bird {
  width: 86px;
  height: 64px;
  margin: 20px;
  background-repeat: no-repeat;
  background-image: url(https://p.ssl.qhimg.com/t01f265b6b6479fffc4.png);
  background-position: -178px -2px;
  animation: flappy 0.5s step-end infinite;
}

@keyframes flappy {
  0% {
    background-position: -178px -2px;
  }
  33% {
    background-position: -90px -2px;
  }
  66% {
    background-position: -2px -2px;
  }
}

.sq {
  width: 100px;
  height: 100px;
  margin: 20px;
  transform-origin: 50% 50%;
  background: blue;
}

.sqw {
  width: 100px;
  height: 100px;
  position: relative;
  margin-bottom: 20px;
}

.container {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  width: 300px;
}
.block {
  width: 100px;
  height: 100px;
  margin: 20px;
  flex-shrink: 0;
  transform-origin: 50% 50%;
}
.block:nth-child(1) {
  background: red;
}
.block:nth-child(2) {
  background: blue;
}
.block:nth-child(3) {
  background: green;
}
.block:nth-child(4) {
  background: orange;
}
</style>
