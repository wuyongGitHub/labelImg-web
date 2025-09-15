<template>
  <div class="heatmap-container">
    <img
      :src="backgroundImage"
      alt="Background Image"
      class="background-image"
    />
    <vue-heatmap
      :data="heatmapData"
      :radius="20"
      :maxOpacity="0.8"
      :minOpacity="0"
      :blur="0.75"
      :gradient="{
        '.25': 'blue',
        '.5': 'cyan',
        '.75': 'lime',
        '.90': 'yellow',
        '1': 'red',
      }"
      class="heatmap-overlay"
    />
  </div>
</template>

<script>
import VueHeatmap from "vue-heatmap";

export default {
  components: {
    VueHeatmap,
  },
  data() {
    return {
      backgroundImage: "../assets/canvasImg.png", // 替换为你的背景图片路径
      heatmapData: [
        { x: 10, y: 20, value: 1 }, // 示例数据点，你需要根据实际情况填充这些数据点
        { x: 30, y: 40, value: 2 },
        // 更多的数据点...
      ],
    };
  },
};
</script>

<style scoped>
.heatmap-container {
  position: relative;
  width: 100%;
  height: 100%;
}

.background-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.heatmap-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
</style>
