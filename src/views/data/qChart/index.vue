<template>
  <div ref="chart" style="width: 512px; height: 512px"></div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue'
import { Chart, Line, Axis, Tooltip, Legend } from '@qcharts/core'

export default defineComponent({
  name: 'Curve',
  setup() {
    const chart = ref<HTMLDivElement>()
    const data = [
      { date: '05-01', category: '图例一', sales: 15.2 },
      { date: '05-02', category: '图例一', sales: 39.2 },
      { date: '05-03', category: '图例一', sales: 31.2 },
      { date: '05-04', category: '图例一', sales: 65.2 },
      { date: '05-05', category: '图例一', sales: 55.2 },
      { date: '05-06', category: '图例一', sales: 75.2 },
      { date: '05-07', category: '图例一', sales: 95.2 },
      { date: '05-08', category: '图例一', sales: 100 }
    ]
    onMounted(() => {
      const c = new Chart({
        container: chart.value!
      })

      c.source(data, {
        row: 'category',
        value: 'sales',
        text: 'date'
      })

      const line = new Line()
      const axisBottom = new Axis().style('grid', false)
      const axisLeft = new Axis({ orient: 'left' }).style('axis', false)
      const legend = new Legend()
      const tooltip = new Tooltip()
      c.append([line, axisBottom, axisLeft, legend, tooltip])
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
