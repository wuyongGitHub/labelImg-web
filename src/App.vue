<script setup lang='ts'>
import { computed, onMounted } from "vue";
import { useLocaleStore } from "./stores/locales";
import { useAuthStore } from "./stores/auth";
import zhCn from "element-plus/es/locale/lang/zh-cn";
import en from "element-plus/es/locale/lang/en";

const localeStore = useLocaleStore();
const authStore = useAuthStore();
const currentLocale = computed(() => {
  return localeStore.locale === "zh" ? zhCn : en;
});
authStore.getDefectList();
</script>
<template>
  <!-- 不要少了`class="h100"` 高度100%，不然布局的高度无法占满 -->
  <div class="h100">
    <!-- 路由组件渲染出品 -->
    <!-- <router-view></router-view> -->
    <el-config-provider :locale="currentLocale">
      <router-view />
    </el-config-provider>
  </div>
</template>
<style scoped>
</style>