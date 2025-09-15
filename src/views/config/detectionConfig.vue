<template>
  <div class="content-box">
    <div class="header">
      <el-button class="headerbtn" type="text" @click="goBack"
        ><SvgIcon name="ele-Back" @click="goBack"> </SvgIcon
        >{{ $t("detectionConfig.back") }}</el-button
      >
      <span class="title">{{ $t("detectionConfig.title") }}</span>
    </div>
    <div class="station-box">
      <div class="station-text">
        {{ $t("detectionConfig.station1") }}
      </div>
      <div class="station-text">
        {{ $t("detectionConfig.station2") }}
      </div>
      <div class="station-text">
        {{ $t("detectionConfig.station3") }}
      </div>
    </div>
    <div class="center-box">
      <div class="content-item">
        <div
          v-for="(item, index) in stationOne"
          :key="index"
          style="
            width: 300px;
            margin: 0px auto;
            text-align: left;
            margin-left: 185px;
            margin-bottom: 26px !important;
          "
        >
          <div style="display: flex">
            <div style="width: 200px !important; position: relative">
              <el-checkbox
                v-model="item.isEnable"
                :true-label="1"
                :false-label="0"
              >
                <template #default>
                  <span style="font-size: 18px">{{ item.blemishName }}</span>
                </template>
              </el-checkbox>
            </div>
            <div style="position: relative; left: 0">
              <ColourSle v-model="item.blemishColor"></ColourSle>
            </div>
          </div>
        </div>
      </div>
      <div class="content-item">
        <div
          v-for="(item, index) in stationTwo"
          :key="index"
          style="
            width: 300px;
            margin: 0px auto;
            text-align: left;
            margin-left: 185px;
            margin-bottom: 26px !important;
          "
        >
          <div style="display: flex">
            <div style="width: 200px !important; position: relative">
              <el-checkbox
                v-model="item.isEnable"
                :true-label="1"
                :false-label="0"
              >
                <template #default>
                  <span style="font-size: 18px">{{ item.blemishName }}</span>
                </template>
              </el-checkbox>
            </div>
            <div style="position: relative; left: 0">
              <ColourSle v-model="item.blemishColor"></ColourSle>
            </div>
          </div>
        </div>
      </div>
      <div class="content-item">
        <div
          v-for="(item, index) in stationThree"
          :key="index"
          style="
            width: 300px;
            margin: 0px auto;
            text-align: left;
            margin-left: 185px;
            margin-bottom: 26px !important;
          "
        >
          <div style="display: flex">
            <div style="width: 200px !important; position: relative">
              <el-checkbox
                v-model="item.isEnable"
                :true-label="1"
                :false-label="0"
              >
                <template #default>
                  <span style="font-size: 18px">{{ item.blemishName }}</span>
                </template>
              </el-checkbox>
            </div>
            <div style="position: relative; left: 0">
              <ColourSle
                v-model="item.blemishColor"
                popoverRight="left"
              ></ColourSle>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="footer">
      <el-button type="primary" class="savabtn" @click="saveConfig">{{
        $t("detectionConfig.saveConfigButton")
      }}</el-button>
    </div>
  </div>
</template>

<script lang="ts" setup name="DetectionConfig">
import { computed, defineAsyncComponent, reactive, unref, watch } from "vue";
import { ref } from "vue";
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import { useI18n } from "vue-i18n";
const { t } = useI18n();
import HskTable from "../../components/HskTable/index.vue";
const ColourSle = defineAsyncComponent(
  () => import("../../components/colourSle/index.vue")
);
import { useLocaleStore } from "../../stores/locales";

import { getDetails, saveDetectionConfig } from "../../api/config";

import { useAuthStore } from "../../stores/auth";

const authStore = useAuthStore();

const selectedColor = ref("#00FF00");
// 初始化语言设置
const localeStore = useLocaleStore();
const router = useRouter();
const selectable = (row: any) => ![1, 2].includes(row.id);
const goBack = () => {
  router.go(-1);
};
const handleRowClick = (row: any) => {
  console.log("Row clicked:", row);
};
// 定义 gwtype 的类型
interface station {
  blemishName?: string;
  blemishSn?: string;
  id?: string;
  isEnable?: Number | string | boolean;
  workStationName?: string;
  workStationSn?: string;
  workStationSort?: string;
  blemishColor?: string;
  blemishColorRgb?: string;
}
// 定义 gwtype 为 GwItem 数组类型
type gwtype = station[];
const stationOne = ref<gwtype>([]);
const stationThree = ref<gwtype>([]);
const stationTwo = ref<gwtype>([]);

const saveConfig = async () => {
  try {
    console.log("stationOne.value", stationOne.value);
    for (let i = 0; i < stationOne.value.length; i++) {
      if (stationOne.value[i]) {
        stationOne.value[i].blemishColorRgb = hexToRgba(
          stationOne.value[i].blemishColor,
          -1
        );
      } else {
        console.warn(`stationOne[${i}] 数据不完整`);
      }
    }

    for (let i = 0; i < stationTwo.value.length; i++) {
      if (stationTwo.value[i]) {
        stationTwo.value[i].blemishColorRgb = hexToRgba(
          stationTwo.value[i].blemishColor,
          -1
        );
      } else {
        console.warn(`stationTwo[${i}] 数据不完整`);
      }
    }

    for (let i = 0; i < stationThree.value.length; i++) {
      if (stationThree.value[i]) {
        stationThree.value[i].blemishColorRgb = hexToRgba(
          stationThree.value[i].blemishColor,
          -1
        );
      } else {
        console.warn(`stationThree[${i}] 数据不完整`);
      }
    }
    const res = await saveDetectionConfig([
      ...stationOne.value,
      ...stationTwo.value,
      ...stationThree.value,
    ]);

    authStore.getDefectList();
    ElMessage.success(t("detectionConfig.savaSuccessTip"));
  } catch (error) {
    console.log("报错");
  }
};
// 十六进制转换成RGB颜色
function hexToRgba(hexColor: any, a = 1) {
  // 移除前缀#符号
  hexColor = hexColor.replace(/^\s*#|\s*$/g, "");
  // 将三位十六进制转换为六位
  if (hexColor.length === 3) {
    hexColor = hexColor.replace(/(.)/g, "$1$1");
  }
  // 提取R、G、B各自的十六进制表示方式
  const r = parseInt(hexColor.substr(0, 2), 16);
  const g = parseInt(hexColor.substr(2, 2), 16);
  const b = parseInt(hexColor.substr(4, 2), 16);
  const rgb = a < 0 || a > 1 ? `${r},${g},${b}` : `${r},${g},${b},${a}`;
  return rgb;
}
const getData = async () => {
  stationOne.value = [];
  stationTwo.value = [];
  stationThree.value = [];
  try {
    const { data } = await getDetails();
    if (data) {
      for (let i = 0; i < data.length; i++) {
        if (
          data[i].workStationName === "工位1" ||
          data[i].workStationName === "station1"
        ) {
          stationOne.value.push({
            blemishName: data[i].blemishName,
            isEnable: data[i].isEnable ? 1 : 0,
            blemishSn: data[i].blemishSn,
            id: data[i].id,
            workStationName: data[i].workStationName,
            workStationSn: data[i].workStationSn,
            workStationSort: data[i].workStationSort,
            blemishColor: data[i].blemishColor,
            blemishColorRgb: data[i].blemishColorRgb,
          });
        } else if (
          data[i].workStationName === "工位2" ||
          data[i].workStationName === "station2"
        ) {
          stationTwo.value.push({
            blemishName: data[i].blemishName,
            isEnable: data[i].isEnable ? 1 : 0,
            blemishSn: data[i].blemishSn,
            id: data[i].id,
            workStationName: data[i].workStationName,
            workStationSn: data[i].workStationSn,
            workStationSort: data[i].workStationSort,
            blemishColor: data[i].blemishColor,
            blemishColorRgb: data[i].blemishColorRgb,
          });
        } else if (
          data[i].workStationName === "工位3" ||
          data[i].workStationName === "station3"
        ) {
          stationThree.value.push({
            blemishName: data[i].blemishName,
            isEnable: data[i].isEnable ? 1 : 0,
            blemishSn: data[i].blemishSn,
            id: data[i].id,
            workStationName: data[i].workStationName,
            workStationSn: data[i].workStationSn,
            workStationSort: data[i].workStationSort,
            blemishColor: data[i].blemishColor,
            blemishColorRgb: data[i].blemishColorRgb,
          });
        }
      }
    }
  } catch (error) {
    console.log("报错");
  }
};

// 监听语言变化
watch(
  () => localeStore.locale,
  (newLocale) => {
    // 调用获取详情接口
    getData();
  },
  { immediate: true }
);
</script>

<style lang="scss" scoped>
.content-box {
  width: 100%;
  height: 100%;
  background: white;
  .header {
    width: 100%;
    height: 40px;
    background: white;
    text-align: center;
    position: relative;
    line-height: 40px;
    // border-bottom: 1px solid #e6e6e6;
    .headerbtn {
      position: absolute;
      font-weight: 400;
      font-size: 14px;
      line-height: 22px;
      letter-spacing: 0%;
      color: #165dff;
      left: 20px;
    }
    .title {
      font-family: PingFang SC;
      font-weight: 400;
      font-size: 18px;
      line-height: 22px;
      letter-spacing: 0%;
    }
  }
  .radio-text {
    font-family: PingFang SC;
    font-weight: 400;
    font-size: 14px;
    line-height: 22px;
    letter-spacing: 0%;
    text-align: center;
  }
  .footer {
    width: 100%;
    display: flex;
    justify-content: center;
    margin-top: 20px;
    .savabtn {
      width: 1300px;
      background: var(--wyk-zt-color);
      margin-left: 80px;
      font-size: 16px;
      line-height: 30px;
      vertical-align: middle;
    }
  }
}
.center-box {
  width: 100%;
  margin: 20px;
  display: flex;
  justify-content: center;
  max-height: 700px;
  overflow-y: scroll;
  .content-item {
    width: 466px;
    height: 100%;
    font-size: 16px;
    line-height: 28px;
    text-align: center;
  }
}
.station-box {
  width: 98%;
  margin-top: 10px;
  display: flex;
  height: 40px;
  line-height: 40px;
  justify-content: center;
  margin: 0px auto;
  background: #ffffff;
  border: 1px solid #e6e6e6;
  .station-text {
    margin-bottom: 15px;
    width: 466px;
    height: 40px;
    line-height: 40px;
    font-weight: 400;
    font-size: 14px;
    letter-spacing: 0%;
    text-align: center;
  }
}
</style>