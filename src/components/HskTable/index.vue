<!-- HskTable.vue -->
<template>
  <el-table
    :header-cell-style="{
      background: '#F2F3F5',
      fontFamily: 'PingFang SC',
      fontWeight: '400',
      fontSize: '14px',
      letterSpacing: '0%',
      textAlign: 'center',
      color: '#1D2129',
    }"
    :data="data"
    :border="border"
    :stripe="stripe"
    v-bind="$attrs"
    v-on="eventListeners"
    ref="tableRef"
  >
    <component v-for="(column, index) in columns" :is="column" :key="index" />
  </el-table>
</template>

<script>
import { h, ref, computed } from "vue";

export default {
  name: "HskTable",
  inheritAttrs: false,
  props: {
    data: {
      type: Array,
      default: () => [],
    },
    border: {
      type: Boolean,
      default: true,
    },
    stripe: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, { slots, attrs }) {
    const tableRef = ref(null);

    // 提取默认插槽中的 HskTableColumn 组件
    const columns = slots.default ? slots.default() : [];

    // 计算属性：提取所有事件监听器
    const eventListeners = computed(() => {
      return attrs.on || {};
    });

    return {
      tableRef,
      columns,
      eventListeners,
    };
  },
};
</script>