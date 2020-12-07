<template>
  <ul style="padding: 10px; width: 200px">
    <li v-for="item in links" :key="item.id">
      <b>{{ item.title }}</b>
      <ul>
        <li v-for="el in item.children" :key="el.id">
          <router-link :to="el.route">{{ el.title }}</router-link>
        </li>
      </ul>
    </li>
  </ul>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'Side',
  data() {
    return {
      links: [
        {
          title: 'math',
          id: 1,
          children: [
            {
              title: '向量树',
              id: '1-0',
              route: '/math/tree'
            },
            {
              title: '垂线',
              id: '1-1',
              route: '/math/line'
            },
            {
              title: 'webgl-三角形',
              id: '1-2',
              route: '/math/triangle'
            },
            {
              title: '多边形',
              id: '1-3',
              route: '/math/polygon'
            },
            {
              title: '曲线',
              id: '1-4',
              route: '/math/curve'
            },
            {
              title: '复杂多边形',
              id: '1-5',
              route: '/math/complexPolygon'
            },
            {
              title: '混合多种多边形',
              id: '1-6',
              route: '/math/multiPolygon'
            },
            {
              title: '粒子运动',
              id: '1-7',
              route: '/math/ion'
            }
          ]
        },
        {
          title: 'vision',
          id: 2,
          children: [
            {
              title: '颜色',
              id: '2-1',
              route: '/vision/color'
            },
            {
              title: '随机&重复',
              id: '2-2',
              route: '/vision/repeatAndRandom'
            }
          ]
        },
        {
          title: 'adviced vision',
          id: 3,
          children: [
            {
              title: '简单动画',
              id: '3-1',
              route: '/advicedVision/simpleAnim'
            },
            {
              title: '简单3D',
              id: '3-2',
              route: '/advicedVision/simple3D'
            },
            {
              title: 'camera',
              id: '3-3',
              route: '/advicedVision/camera'
            }
          ]
        },
        {
          title: 'WebGL基础',
          id: 4,
          children: [
            {
              title: 'hello world',
              id: '4-1',
              route: '/base/helloworld'
            },
            {
              title: 'hello world 2',
              id: '4-2',
              route: '/base/helloworld2'
            },
            {
              title: '2DTranslate',
              id: '4-2',
              route: '/base/2DTranslate'
            }
          ]
        },
        {
          title: '性能',
          id: 5,
          children: [
            {
              title: 'compare',
              id: '5-1',
              route: '/performance/compare'
            }
          ]
        },
        {
          title: '数据',
          id: 6,
          children: [
            {
              title: 'qChart',
              id: '6-1',
              route: '/data/qChart'
            }
          ]
        },
        {
          title: 'demo',
          id: 7,
          children: [
            {
              title: 'points',
              id: '7-1',
              route: '/demo/points'
            },
            {
              title: 'triangle',
              id: '7-2',
              route: '/demo/triangle'
            },
            {
              title: 'lines',
              id: '7-3',
              route: '/demo/lines'
            },
            {
              title: 'gradual',
              id: '7-4',
              route: '/demo/gradual'
            },
            {
              title: 'rect',
              id: '7-5',
              route: '/demo/rect'
            },
            {
              title: 'circle',
              id: '7-6',
              route: '/demo/circle'
            }
          ]
        }
      ]
    }
  }
})
</script>
