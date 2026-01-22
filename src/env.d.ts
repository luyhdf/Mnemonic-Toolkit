/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'

  const component: DefineComponent<object, object, any>
  export default component
}

declare module 'slip39' {
  const Slip39: any
  export default Slip39
}
