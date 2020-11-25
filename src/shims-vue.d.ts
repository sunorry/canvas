declare module '*.vue' {
  import { defineComponent } from 'vue'
  const component: ReturnType<typeof defineComponent>
  export default component
}

declare module '*.glsl'

declare module 'earcut'

declare module 'tess2'

declare module 'gl-renderer'
