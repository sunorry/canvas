<template>
  <canvas width="512" height="521" ref="canvas"></canvas>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue'

import * as THREE from 'three'

// function useCtx(canvas: Ref<HTMLCanvasElement | undefined>) {
//   const ctx = ref<CanvasRenderingContext2D | null>()
//   onMounted(() => {
//     ctx.value = canvas.value!.getContext('2d')
//   })
//   return ctx
// }

export default defineComponent({
  name: 'color',

  setup() {
    const canvas = ref<HTMLCanvasElement>()
    // const wrapCtx = useCtx(canvas)
    onMounted(() => {
      // const ctx = wrapCtx.value!
      const safeCanvas = canvas.value!
      // 渲染器
      const renderer = new THREE.WebGLRenderer({
        canvas: safeCanvas
      })
      renderer.setClearColor(0x00000)
      // 场景：Three.js中添加的物体都是添加到场景中的，因此它相当于一个大容器。一般说，场景里没有很复杂的操作，在程序最开始的时候进行实例化，然后将物体添加到场景中即可
      const scene = new THREE.Scene()
      // 照相机
      // PerspectiveCamera(fov, aspect, near, far)
      // fov:  Camera frustum vertical field of vie
      const camera = new THREE.PerspectiveCamera(45, 1 / 1, 1, 1000)
      camera.position.set(0, 0, 5)
      scene.add(camera)
      // 长方体：x、y、z方向长度分别为1、2、3的长方体，并将其设置为红色
      const geometry = new THREE.BoxGeometry()
      const material = new THREE.MeshBasicMaterial({
        color: 0x00ff00
      })
      const cube = new THREE.Mesh(geometry, material)
      scene.add(cube)
      camera.position.z = 5
      const animate = function() {
        requestAnimationFrame(animate)
        cube.rotation.x += 0.01
        cube.rotation.y += 0.01
        renderer.render(scene, camera)
      }
      animate()
    })

    return {
      canvas
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
