<template>
  <div ref="chart"></div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue'
import { Scene } from 'spritejs'
import * as d3 from 'd3'
import { NumberValue } from 'd3'

export default defineComponent({
  name: 'd3',
  setup() {
    const chart = ref<HTMLDivElement>()
    const dataset = [125, 121, 127, 193, 309]

    onMounted(() => {
      const scene = new Scene({
        container: chart.value!,
        width: 1200,
        height: 1200
      })

      const scale = d3.scaleLinear()
        .domain([100, d3.max(dataset)] as any)
        .range([0, 500])

      const fglayer = scene.layer('fglayer')
      const s = d3.select(fglayer as any)

      const colors = ['#fe645b', '#feb050', '#c2af87', '#81b848', '#55abf8']
      const c = s.selectAll('sprite')
        .data(dataset)
        .enter()
        .append('sprite')
        .attr('x', 450)
        .attr('y', (_, i: number) => 200 + i * 95)
        .attr('width', scale) 
        .attr('height', 80) 
        .attr('bgcolor', (_, i: number) =>  colors[i])
    })
    return {
      chart
    }
  }
})
</script>

<style lang="scss" scoped>
.ml10 {
  margin-left: 10px;
}
</style>
