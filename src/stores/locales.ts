import { defineStore } from 'pinia'
import { ref } from 'vue'
import { i18n } from '../locales/index'

export const useLocaleStore = defineStore(
  'locale',
  () => {
    // 初始化时从 localStorage 获取语言设置，默认为 'en'
    const locale = ref(localStorage.getItem('user-locale') || i18n.global.locale.value);

    // 设置locale
    function setLocale(lang: any) {
      locale.value = lang
      i18n.global.locale.value = lang
      localStorage.setItem('user-locale', lang); // 持久化存储到 localStorage
    }

    return { locale, setLocale }
  }
)
