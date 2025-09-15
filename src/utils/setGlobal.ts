import { type App } from 'vue';
// element-plus图标
import * as ElementPlusIconsVue from '@element-plus/icons-vue';
// 图标组件
import SvgIcon from '@/components/svgIcon/index.vue';
// element-plus图标以 ele- 开头
export function useElIcon(app: App) {
  // 全局注册所有element-plus图标
  for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(`ele-${key}`, component);
  }
  // 图标组件 +++++
  app.component('SvgIcon', SvgIcon);
}
