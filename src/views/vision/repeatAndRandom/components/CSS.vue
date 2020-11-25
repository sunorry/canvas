<template>
  <p>background-image</p>
  <canvas width="200" height="200" class="css-canvas"></canvas>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'CSS'
})
</script>

<style lang="scss" scoped>
.css-canvas {
  background-image: linear-gradient(to right, transparent 90%, #ccc 0),
    linear-gradient(to bottom, transparent 90%, #ccc 0);
  background-size: 8px 8px, 8px 8px;
}
</style>
