import { createRouter, createWebHistory, createWebHashHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router';
// 扩展 RouteMeta 接口，因为 Vue-Router 的配置路由对象的 meta 属性有限，所以需要扩展
// declare module 'vue-router' {
//   interface RouteMeta {
//     title?: string; // 菜单标题
//     icon?: string; // 图标
//     linkTo?: string; // 外链地址
//     cache?: boolean; //是否缓存：true缓存，false不缓存，会将 name 值用于 <keep-alive>的includes上
//     hidden?: boolean; // 是否在菜单中显示：true显示，false隐藏
//     isBreadcrumb?: boolean; // 是否显示到面包屑，默认或true会显示，false不显示。
//   }
// }
// 路由配置数组(单独抽取，后面会后端动态加载)
export const dynamicRoutes: RouteRecordRaw[] = [

  {
    path: '/labelImg',
    name: 'labelImg',
    component: () => import('@/views/labelImgDemo/MainLayout.vue'),
    meta: {
      title: 'labelImg拼接',
      icon: 'ele-HomeFilled',
      cache: false,
      hidden: false,
    }
  },

  {
    path: '/chat',
    name: 'chat',
    component: () => import('@/views/labelImgDemo/chat.vue'),
    meta: {
      title: 'chat',
      icon: 'ele-HomeFilled',
      cache: false,
      hidden: false,
    }
  },
  {
    path: '/',
    name: 'Layout',
    component: () => import('@/views/labelImgDemo/MainLayout.vue'),
    children: [
      {
        path: '/',
        name: 'Home',
        component: () => import('@/views/labelImgDemo/MainLayout.vue'),
        meta: {
          title: '首页',
          icon: 'ele-HomeFilled',
          cache: false,
          hidden: false,
        }
      },
    ]
  }
];
// 创建路由实例
const router = createRouter({
  // 参数获取的是 vite.config.ts 中的 base 属性值
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: dynamicRoutes
});
export default router;