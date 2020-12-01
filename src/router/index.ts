import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
// import Line from '../views/line/Line.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/math'
  },
  {
    path: '/math',
    component: () => import('../views/math/index.vue'),
    redirect: '/math/line',
    children: [
      {
        path: 'tree',
        component: () => import(/* webpackChunkName: "tree" */ '../views/math/tree/index.vue')
      },
      {
        path: 'line',
        component: () => import(/* webpackChunkName: "line" */ '../views/math/line/Line.vue')
      },
      {
        path: 'triangle',
        component: () => import(/* webpackChunkName: "triangle" */ '../views/math/triangle/Triangle.vue')
      },
      {
        path: 'polygon',
        component: () => import(/* webpackChunkName: "polygon" */ '../views/math/polygon/Polygon.vue')
      },
      {
        path: 'curve',
        component: () => import(/* webpackChunkName: "curve" */ '../views/math/curve/Curve.vue')
      },
      {
        path: 'complexPolygon',
        component: () => import(/* webpackChunkName: "polygon" */ '../views/math/complexPolygon/Polygon.vue')
      },
      {
        path: 'multiPolygon',
        component: () => import(/* webpackChunkName: "multiPolygon" */ '../views/math/multiPolygon/MultiPolygon.vue')
      },
      {
        path: 'ion',
        component: () => import(/* webpackChunkName: "ionAnimation" */ '../views/math/ionAnimation/IonAnimation.vue')
      }
    ]
  },
  {
    path: '/vision',
    component: () => import('../views/vision/index.vue'),
    redirect: 'vision/color',
    children: [
      {
        path: 'color',
        component: () => import(/* webpackChunkName: "color" */ '../views/vision/color/index.vue')
      },
      {
        path: 'repeatAndRandom',
        component: () => import(/* webpackChunkName: "repeatAndRandom" */ '../views/vision/repeatAndRandom/index.vue')
      }
    ]
  },
  {
    path: '/advicedVision',
    component: () => import('../views/advancedVision/index.vue'),
    redirect: 'advicedVision/simpleAnim',
    children: [
      {
        path: 'simpleAnim',
        component: () => import(/* webpackChunkName: "simpleAnim" */ '../views/advancedVision/simpleAnim/index.vue')
      },
      {
        path: 'simple3D',
        component: () => import(/* webpackChunkName: "simple3D" */ '../views/advancedVision/simple3D/index.vue')
      },
      {
        path: 'camera',
        component: () => import(/* webpackChunkName: "camera" */ '../views/advancedVision/camera/index.vue')
      }
    ]
  },
  {
    path: '/base',
    component: () => import('../views/base/index.vue'),
    redirect: 'base/helloworld',
    children: [
      {
        path: 'helloworld',
        component: () => import(/* webpackChunkName: "helloworld" */ '../views/base/helloWorld/index.vue')
      },
      {
        path: 'helloworld2',
        component: () => import(/* webpackChunkName: "helloworld2" */ '../views/base/helloWorld2/index.vue')
      },
      {
        path: '2DTranslate',
        component: () => import(/* webpackChunkName: "2DTranslate" */ '../views/base/2DTranslate/index.vue')
      }
    ]
  }

  // {
  //   path: "/about",
  //   name: "About",
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () =>
  //     import(/* webpackChunkName: "about" */ "../views/About.vue")
  // }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
