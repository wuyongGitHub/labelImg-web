<script setup lang='ts'>
</script>
<template>
  <div class="layout-logo logo-box">
    <img class="layout-logo-img" src="@/assets/image/logo.png" />
    <span class="layout-logo-text">{{ $t("header.title") }}</span>
  </div>
</template>
<style scoped lang="scss">
.logo-box {
  display: flex;
  align-items: center;
  padding-left: 10px;
  .layout-logo-text {
    color: #000;
    font-family: "PingFang SC";
    font-size: 24px;
    font-style: normal;
    font-weight: 400;
    line-height: 60px;
    margin-left: 10px;
  }
}
</style>