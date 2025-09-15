/// <reference types="vite/client" />
// 声明文件 *.vue 文件，交给 vue 模块处理
declare module '*.vue' {
  import type { DefineComponent } from 'vue';
  const component: DefineComponent<{}, {}, any>;
  export default component;
}
