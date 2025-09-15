<template>
  <el-container class="layout-container">
    <!-- 右侧垂直 -->
    <el-container direction="vertical">
      <layoutHeader></layoutHeader>
      <layoutMain></layoutMain>
    </el-container>
  </el-container>
</template>
<script setup lang="ts" name="Layout">
// 异步导入
import { defineAsyncComponent } from "vue";
const layoutMain = defineAsyncComponent(() => import("./layoutMain/index.vue"));
const LayoutHeader = defineAsyncComponent(
  () => import("./layoutHeader/index.vue")
);
</script>
<style></style>
