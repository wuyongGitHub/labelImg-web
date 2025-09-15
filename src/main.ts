import { createApp, watch } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';
// 整合ElementPlus
import ElementPlus from 'element-plus';

// 样式文件，elemen-plus样式在index.scss中导入了
import '@/styles/index.scss';

// 图标
import { useElIcon } from '@/utils/setGlobal';

// 国际化
import { i18n } from './locales/index'

// 引入 Pinia Store
import { useLocaleStore } from './stores/locales';
import { useAuthStore } from "./stores/auth"

import { useRouter } from "vue-router";

const app = createApp(App);
app.use(createPinia());
app.use(router);
app.use(ElementPlus);
app.use(i18n)
// 初始化语言设置
const localeStore = useLocaleStore();
const authStore = useAuthStore();
const currentLocale = localeStore.locale;
// 同步 i18n 的语言设置
localeStore.setLocale(currentLocale);

// 监听语言变化，重新应用ElementPlus配置
watch(
  () => localeStore.locale,
  (newLocale) => {
    if (newLocale === 'zh') {
      authStore.lang = 'zh_CN';
    } else {
      authStore.lang = 'en_US';
    }
  },
  { immediate: true }
);


// 全局注册图标`ele-`开头（样式在index.scss中）
useElIcon(app);

app.mount('#app')
