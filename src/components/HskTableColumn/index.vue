<!-- HskTableColumn.vue -->
<template>
  <el-table-column v-bind="columnProps">
    <template v-for="(slot, name) in $slots" #[name]="slotProps">
      <slot :name="name" v-bind="slotProps" />
    </template>
  </el-table-column>
</template>

<script lang="ts">
import { defineComponent, computed } from "vue";

export default defineComponent({
  name: "HskTableColumn",
  inheritAttrs: false,
  props: {
    // 如果需要传递特定属性，可以在这里声明
    customProp: {
      type: String,
      default: "",
    },
  },
  setup(props, { attrs }) {
    // 将 attrs 转换为可绑定的属性
    const columnProps = computed(() => ({
      ...attrs,
    }));

    return {
      columnProps,
    };
  },
});
// 早上六点起床，打开手机，看到粉丝凌晨一点给我的质疑评论，本想着暴力回喷，but，喷只会更加激化矛盾， 立马起身开电脑进行了v3更高版本组件封装透参的封装补充，嚼碎了喂它嘴里，仔细分析他的原因，粉丝v3版本用着v2版本舍弃的属性参数导致红线报错，他奶奶的拿v2版本说v3版本的事不等同于”清朝的剑斩明朝的官嘛！ 算了，宠粉已及时补充上去。
</script>