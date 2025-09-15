<template>
  <div class="content-box">
    <div class="header">
      <el-button class="headerbtn" type="text" @click="goBack"
        ><SvgIcon name="ele-Back" @click="goBack"> </SvgIcon
        >{{ $t("faultConfig.back") }}</el-button
      >
      <span class="title">{{ $t("faultConfig.title") }}</span>
    </div>
    <hsk-table
      style="margin: 0px auto; width: 970px"
      :data="tableData"
      stripe
      @row-click="handleRowClick"
    >
      <el-table-column
        prop="faultTypeValue"
        align="center"
        :label="$t('faultConfig.faultType')"
        width="220"
      >
        <template #default="scoped">
          {{ scoped.row.faultTypeValue }}
          <el-tooltip :content="scoped.row.faultDescription" placement="right">
            <span style="position: relative; top: 5px; cursor: pointer">
              <SvgIcon name="ele-QuestionFilled"></SvgIcon
            ></span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column
        prop="czfa"
        :label="$t('faultConfig.disposalPlan')"
        width="750"
        align="center"
      >
        <template #default="scoped">
          <el-radio-group v-model="scoped.row.dealWayFlag">
            <el-radio value="alarm" size="large"
              ><span class="radio-text">{{
                $t("faultConfig.alarmTitle")
              }}</span></el-radio
            >
            <el-radio value="shutdown" size="large"
              ><span class="radio-text">{{
                $t("faultConfig.shutDown")
              }}</span></el-radio
            >
          </el-radio-group>
        </template>
      </el-table-column>
    </hsk-table>
    <div class="footer">
      <el-button type="primary" class="savabtn" @click="saveConfig">{{
        $t("faultConfig.saveConfigButton")
      }}</el-button>
    </div>
  </div>
</template>

<script lang="ts" setup name="FaultConfig">
import { computed, defineAsyncComponent, reactive, unref, watch } from "vue";
import { ref } from "vue";
import { useRouter } from "vue-router";
import HskTable from "../../components/HskTable/index.vue";
import { deviceFaultList, saveDeviceFaultList } from "../../api/config";
import { useI18n } from "vue-i18n";
import { useLocaleStore } from "../../stores/locales";
import ElMessage from "element-plus/es/components/message/index.mjs";
const { t } = useI18n();

const localeStore = useLocaleStore();
const router = useRouter();
const selectable = (row: any) => ![1, 2].includes(row.id);
const goBack = () => {
  router.go(-1);
};
const handleRowClick = (row: any) => {
  console.log("Row clicked:", row);
};
const checkData = ref([
  { name: t("faultConfig.alarmTitle"), isCheck: "alram" },
  { name: t("faultConfig.shutDown"), isCheck: "shutdown" },
]);
const tableData: any = ref([]);

const getDeviceFaultList = async () => {
  const res = await deviceFaultList();
  console.log(res);
  tableData.value = res.data;
};
const saveConfig = async () => {
  try {
    const res = await saveDeviceFaultList(tableData.value);
    ElMessage.success(t("systemConfig.savaSuccessTip"));
  } catch (error) {}
};

// 监听语言变化
watch(
  () => localeStore.locale,
  (newLocale) => {
    getDeviceFaultList();
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
    margin-top: 40px;
    .savabtn {
      width: 970px;
      background: var(--wyk-zt-color);
      font-size: 16px;
      line-height: 30px;
      vertical-align: middle;
    }
  }
}
</style>
