<template>
  <div style="display: block;">
    <p>重复，分形，随机</p>
    <CSS />
    <GL />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import CSS from './components/CSS.vue'
import GL from './components/GL.vue'
export default defineComponent({
  name: 'repeatAndRandom',
  components: { CSS, GL }
})
</script>

<style lang="scss" scoped></style>
