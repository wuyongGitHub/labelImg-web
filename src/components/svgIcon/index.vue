<script setup lang='ts'>
import { h, resolveComponent } from "vue";
const props = withDefaults(
  defineProps<{
    name?: string; // 图标名称
    color?: string; // 图标颜色
    size?: number; // 图标大小
  }>(),
  {
    name: "",
    size: 18,
  }
);
const render = () => {
  if (props.name?.startsWith("ele-")) {
    return h(
      resolveComponent("el-icon"),
      { color: props.color, size: props.size },
      () => h(resolveComponent(props.name))
    );
  } else {
    return h("i");
  }
};
</script>
<template>
  <!--模板中直接引用虚拟Dom -->
  <render />
</template>
