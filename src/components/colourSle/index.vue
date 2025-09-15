<template>
  <div class="color-picker-wrapper" ref="wrapperRef">
    <el-popover
      width="205px"
      ref="colorPopover"
      @confirm="handleConfirm"
      :placement="popoverRight"
      @cancel="handleCancel"
      v-model:visible="popconfirmVisible"
      trigger="focus"
    >
      <template #reference>
        <div @click="handleClick" class="color-box">
          <div
            class="color-pice"
            :style="{ backgroundColor: colorValue }"
          ></div>
        </div>
      </template>
      <div style="width: 180px; text-align: left">
        <div
          style="
            font-size: 12px;
            width: 100%;
            background-color: #f4f5f7;
            height: 20px;
            line-height: 20px;
            padding-left: 5px;
            margin-bottom: 5px;
            color: #444e63;
          "
        >
          默认颜色
        </div>
        <div
          style="
            height: 15px;
            display: flex;
            justify-content: space-around;
            flex-wrap: wrap;
            align-items: center;
          "
        >
          <div
            class="theme-color-item"
            v-for="(item, index) in defaultColor.slice(0, 10)"
            @click="colorSelect(item)"
            :key="index"
            :style="{ background: item }"
          ></div>
        </div>
        <div
          style="
            height: 15px;
            display: flex;
            justify-content: space-around;
            flex-wrap: wrap;
            align-items: center;
          "
        >
          <div
            class="theme-color-item"
            v-for="(item, index) in defaultColor.slice(10, 20)"
            @click="colorSelect(item)"
            :key="index"
            :style="{ background: item }"
          ></div>
        </div>
        <!-- <div
          style="
            font-size: 12px;
            width: 100%;
            background-color: #f4f5f7;
            height: 20px;
            line-height: 20px;
            padding-left: 5px;
            margin-bottom: 5px;
            margin-top: 7px;
            color: #444e63;
          "
        >
          主题颜色
        </div>
        <div
          style="height: 20px; display: flex; justify-content: space-between"
        >
          <div
            class="theme-color-item"
            v-for="(item, index) in themeColors"
            @click="colorSelect(item)"
            :key="index"
            :style="{ background: item }"
          ></div>
        </div> -->

        <!-- <div style="width: 100%; display: flex; justify-content: space-between">
          <div
            v-for="(item, index) in gradientColors"
            :key="index"
            style="
              height: 64px;
              width: 12px;
              display: flex;
              flex-direction: column;
              justify-content: space-between;
            "
          >
            <div
              v-for="(item1, index1) in item"
              :key="index1"
              @click="colorSelect(item1)"
              :style="{ background: item1 }"
              class="theme-color-block"
            ></div>
          </div>
        </div> -->
      </div>
      <!-- <div class="theme-color">标准色</div>
      <div style="height: 20px; display: flex; justify-content: space-between">
        <div
          class="theme-color-item"
          v-for="(item, index) in standardColors"
          :key="index"
          @click="colorSelect(item)"
          :style="{ background: item }"
        ></div>
      </div> -->
      <el-divider style="margin: 0; margin-top: 8px"></el-divider>

      <div class="colorPalette-box">
        <!-- <img :src="'../../assets/image/colorPalette.png':'../../assets/image/colorPalette.png'" style="width: 26px" /> -->
        <div class="colorPalette-text" @click="showColor" style="display: flex">
          <div style="" class="colorPalette-icon"></div>
          <div style="width: 90px">其他字体颜色...</div>
          <el-color-picker
            :teleported="false"
            v-model="colorValue"
            @change="colorChange"
            size="small"
          />
        </div>
      </div>
    </el-popover>
  </div>
</template>

<script setup lang="ts">
import { onUnmounted, ref, watch } from "vue";
const emit = defineEmits(["update:modelValue"]);
const props = defineProps({
  modelValue: {
    type: String,
    default: "#FFFFFF",
  },
  popoverRight: {
    type: String,
    default: "right",
  },
});
watch(
  () => props.modelValue,
  (newVal) => {
    // console.log("modelValue changed:", newVal);
    colorValue.value = newVal; // 更新子组件的内部状态
  }
);
const colorValue = ref(props.modelValue);
const colorPopover: any = ref(null);
// 默认颜色
const defaultColor = ref([
  "#004E56",
  "#0E56F4",
  "#4C8498",
  "#67CDC6",
  "#7DC8AD",
  "#AD6640",
  "#ADACCE",
  "#B6BEC5",
  "#B8D7E4",
  "#C1EA8A",
  "#CADDC9",
  "#E14C51",
  "#F0DCB1",
  "#F2B666",
  "#F86341",
  "#FAB67B",
  "#FFB1C5",
  "#FFD91E",
  "#30C0B4",
  "#E54C5E",
]);
// 主题色
const themeColors = ref([
  "#FFFFFF",
  "#000000",
  "#E7E6E6",
  "#44546A",
  "#4874CB",
  "#EE822F",
  "#F2BA02",
  "#75BD42",
  "#30C0B4",
  "#E54C5E",
]);
// 标准色 Standard color
const standardColors = ref([
  "#C00000",
  "#FF0000",
  "#FFC000",
  "#FFFF00",
  "#92D050",
  "#00B050",
  "#00B0F0",
  "#0070C0",
  "#002060",
  "#7030A0",
]);
// 主题渐变色
const gradientColors = ref([
  ["#F2F2F2", "#D9D9D9", "#BFBFBF", "#A6A6A6", "#808080"],
  ["#808080", "#595959", "#404040", "#262626", "#0D0D0D"],
  ["#D0CECE", "#AFABAB", "#767171", "#3B3838", "#181717"],
  ["#D6DCE5", "#ADB9CA", "#8497B0", "#333F50", "#222A35"],
  ["#DAE3F5", "#B6C7EA", "#91ACE0", "#2E54A1", "#1E386B"],
  ["#FCE6D5", "#F8CDAC", "#F5B482", "#C65F10", "#843F0B"],
  ["#FFF2CA", "#FEE695", "#FED961", "#B68C02", "#795D01"],
  ["#E3F2D9", "#C8E5B3", "#ACD78E", "#588E32", "#3B5F21"],
  ["#D4F4F2", "#A9E9E4", "#7DDFD7", "#249087", "#18605A"],
  ["#FADBDF", "#F5B7BF", "#EF949E", "#C81D31", "#851321"],
]);
const popconfirmVisible = ref(false);
const showColor = () => {};
const colorChange = (val: any) => {
  emit("update:modelValue", colorValue.value); // 更新父组件中的值
  handleCancel();
};
const handleClick = () => {
  popconfirmVisible.value = true; // 显示 Popconfirm
};

const handleConfirm = () => {
  popconfirmVisible.value = false; // 隐藏 Popconfirm
};
const colorSelect = (val: any) => {
  colorValue.value = val;
  emit("update:modelValue", colorValue.value); // 更新父组件中的值
  handleCancel();
};
const handleCancel = () => {
  popconfirmVisible.value = false; // 隐藏 Popconfirm
};
const clicked = ref(false);
</script>
<style lang="scss" scoped>
.color-box:hover {
  border-color: #409eff;
  transition: 0.5s;
}
.color-box {
  width: 22px;
  height: 22px;
  background-color: #fff;
  border: 1px solid #dcdfe6;
  border-radius: 2px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  .color-pice {
    width: 14px;
    height: 14px;
  }
}
::v-deep .el-popconfirm__action {
  margin-top: 0px !important;
  text-align: left;
}
.theme-color-block {
  width: 12px;
  height: 12px;
  cursor: pointer;
  border: 1px solid #dcdfe6;
}
.theme-color-block:hover {
  border: 1px solid #ffa800 !important;
  transition: 0.5s !important;
}
.theme-color-item {
  width: 12px;
  height: 12px;
  cursor: pointer;
  border: 1px solid #dcdfe6;
}
.theme-color-item:hover {
  border: 1px solid #ffa800;
  transition: 0.5s;
}
.colorPalette-box {
  display: flex;
  font-size: 12px;
  width: 100%;
  cursor: pointer;
  height: 26px;
  line-height: 26px;
  padding-left: 2px;
  margin-bottom: 5px;
  margin-top: 6px;
  text-align: left;
  color: #444e63;
}
.colorPalette-box:hover {
  color: #165dff;
  .colorPalette-icon {
    background-image: url("../../assets/image/colorPaletteActive.png");
  }
}
.colorPalette-box:hover {
  background: #f2f2f2;
  transition: 0.3s;
}
.colorPalette-icon {
  width: 26px;
  height: 26px;
  position: relative;
  left: -5px;
  background-image: url("../../assets/image/colorPalette.png");
  background-repeat: repeat; /* 在两个方向上平铺背景图片 */
  background-size: cover; /* 覆盖整个元素，可能会被裁剪以适应尺寸 */
  background-position: center; /* 背景图片居中 */
}
.colorPalette-text {
  position: relative;
  margin-left: 4px;
}
.theme-color {
  font-size: 12px;
  width: 100%;
  background-color: #f4f5f7;
  height: 20px;
  text-align: left;
  line-height: 20px;
  padding-left: 5px;
  margin-bottom: 5px;
  margin-top: 6px;
  color: #444e63;
}
::v-deep .el-color-picker__panel {
  position: absolute;
  top: -0px !important;
  left: 180px !important;
}
::v-deep .el-color-picker__trigger {
  width: 179px;
  border: none;
  position: relative;
  top: 0px;
  left: -142px;
  z-index: 10000;
}
::v-deep .el-color-picker__color {
  display: none !important;
}
</style>