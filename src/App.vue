<template>
  <div class="df">
    <Side />
    <router-view />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Side from './views/Side.vue'

export default defineComponent({
  name: 'App',
  components: {
    Side
  }
})
</script>

<style lang="scss">
.df {
  display: flex;
}
</style>
