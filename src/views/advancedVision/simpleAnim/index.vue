<template>
  <div class="bird"></div>
  <div ref="block" class="sq"></div>
  <div ref="time" class="sq"></div>
  <div class="container">
    <div class="block"></div>
    <div class="block"></div>
    <div class="block"></div>
    <div class="block"></div>
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
      const animator = new Animator({ duration: 1000, iterations: 3 })
      ;(async function() {
        let i = 0
        // eslint-disable-next-line no-constant-condition
        while (true) {
          await animator.animate(blocks[i++ % 4], ({ target, timing }: { target: any; timing: any }) => {
            target.style.transform = `rotate(${timing.p * 360}deg)`
          })
        }
      })()
    })

    return {
      block,
      time
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
