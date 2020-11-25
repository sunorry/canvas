<template>
  <SimpleTranslate />
  <ComplexTranslate />
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import SimpleTranslate from './simpleTranslate/SimpleTranslate.vue'
import ComplexTranslate from './complexTranslate/ComplexTranslate.vue'

export default defineComponent({
  name: '2DTranslate',
  components: {
    SimpleTranslate,
    ComplexTranslate
  }
})
</script>
