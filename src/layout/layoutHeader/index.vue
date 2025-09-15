<template>
  <el-header class="layout-header">
    <!-- 右侧头部区域 -->
    <div class="header-box">
      <logo />
    </div>
    <div
      class="header-navigation-bar"
      style="display: flex; justify-content: space-between"
    >
      <div style="width: 50%">
        <el-menu
          :router="true"
          :default-active="$route.path"
          class="el-menu-demo el-menu-height"
          mode="horizontal"
        >
          <!-- 
          @select="handleSelect" -->
          <el-menu-item index="/"
            ><span class="menu-text">{{
              $t("header.home")
            }}</span></el-menu-item
          >
          <el-sub-menu index="/detectionConfig">
            <template #title
              ><span class="menu-text">{{
                $t("header.inspectionSettings")
              }}</span></template
            >
            <el-menu-item index="/detectionConfig"
              ><span class="menu-text">{{
                $t("header.inspectionSettings")
              }}</span></el-menu-item
            >
            <el-menu-item index="/faultConfig"
              ><span class="menu-text">{{
                $t("header.faultConfiguration")
              }}</span></el-menu-item
            >
          </el-sub-menu>
          <!-- <el-menu-item index="/systemSetting"
            ><span class="menu-text">{{
              $t("header.systemConfiguration")
            }}</span></el-menu-item
          > -->
          <el-sub-menu index="/systemSetting">
            <template #title
              ><span class="menu-text">{{
                $t("header.systemConfiguration")
              }}</span></template
            >
            <el-menu-item index="/systemSetting">
              <span class="menu-text">{{
                $t("header.systemConfiguration")
              }}</span>
            </el-menu-item>
            <el-menu-item index="/configurationOfFaultHandlingPlan"
              ><span class="menu-text">{{
                $t("header.configurationOfFaultHandlingPlan")
              }}</span></el-menu-item
            >
            <div class="kpts-menu" @click="handleClick">空跑调试</div>
          </el-sub-menu>
          <!-- <el-sub-menu index="/log">
            <template #title
              ><span class="menu-text">{{ $t("header.logs") }}</span></template
            >
            <el-menu-item index="/log">
              <span class="menu-text">{{ $t("header.logsInstall") }}</span>
            </el-menu-item>
            <el-menu-item index="/deviceRun"
              ><span class="menu-text">{{
                $t("header.deviceRun")
              }}</span></el-menu-item
            >
          </el-sub-menu> -->
          <el-menu-item index="/log">
            <span class="menu-text">{{ $t("header.logs") }}</span>
          </el-menu-item>
          <el-menu-item index="/historicalRecords">
            <span class="menu-text">{{ $t("header.historicalRecords") }}</span>
          </el-menu-item>
          <el-menu-item @click="gotoBigScren()">
            <span class="menu-text">检测大屏</span>
          </el-menu-item>
        </el-menu>
      </div>
      <div style="margin-right: 50px" class="el-menu-height language-select">
        <el-dropdown class="el-menu-height" @command="handleCommand">
          <div class="el-dropdown-link" style="display: flex">
            <div>{{ currentLan }}</div>
            <div
              class="el-menu-height"
              style="margin-left: 4px; line-height: 47px"
            >
              <SvgIcon name="ele-ArrowDown"></SvgIcon>
            </div>
          </div>

          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item
                v-for="lang in langs"
                :key="lang.key"
                :command="lang"
                >{{ lang.title }}</el-dropdown-item
              >
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>
    <!-- 登录 -->
    <el-dialog
      v-model="dialogFormVisible"
      :show-close="false"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      center
      :title="$t('login.login')"
      width="400"
    >
      <el-form
        :model="form"
        label-width="auto"
        :rules="loginRules"
        ref="loginFormRef"
      >
        <el-form-item :label="$t('login.userName')" prop="username">
          <el-input
            v-model="form.username"
            :placeholder="$t('login.userNamePlaceholder')"
          />
        </el-form-item>
        <el-form-item :label="$t('login.password')" prop="password">
          <el-input
            v-model="form.password"
            :placeholder="$t('login.userPwdPlaceholder')"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="cancelLogin">{{
            $t("login.loginCancel")
          }}</el-button>
          <el-button type="primary" @click="submitLogin(loginFormRef)">
            {{ $t("login.loginConfirm") }}
          </el-button>
        </div>
      </template>
    </el-dialog>
  </el-header>
  <el-dialog
    v-model="dialogVisible"
    title="Tips"
    width="400"
    :show-close="false"
  >
    <div style="width: 50px; margin: 0px auto">
      <el-radio-group v-model="skipTestFlag" :disabled="!checked1">
        ><el-radio :label="true">OK空跑</el-radio>
        <el-radio :label="false">NG空跑</el-radio>
      </el-radio-group>
    </div>
    <template #header="{ close }">
      <el-button type="text" @click="close"> 返回 </el-button>
      <el-checkbox
        @change="emtyCheckChange"
        style="margin-left: 110px"
        v-model="checked1"
        size="large"
        ><template #default>
          <div style="font-size: 20px; color: black">空跑测试</div>
        </template></el-checkbox
      >
      <el-divider style="margin-top: 10px; margin-bottom: 0px" />
    </template>
    <template #footer>
      <el-button
        type="primary"
        style="
          width: 90%;
          margin: 0px auto;
          margin-right: 20px;
          background: #165dff;
          border: #165dff 1px solid;
        "
        @click="submitEmtryClick"
      >
        确认
      </el-button>
    </template>
  </el-dialog>
</template>
<script setup lang="ts" name="LayoutHeader1">
import { computed, defineAsyncComponent, reactive, unref, watch } from "vue";
import { ref } from "vue";
import { ElMessage } from "element-plus";
import { useI18n } from "vue-i18n";
const { t } = useI18n();
import type { FormInstance } from "element-plus";
//正确用法
import { langs } from "../../locales/index"; //这个是你自己的国际化配置文件
import { useLocaleStore } from "../../stores/locales";
import { useAuthStore } from "../../stores/auth";
import { useRouter } from "vue-router";

import { getRuleDetail, updateRule } from "../../api/emptyRunTest";

const Logo = defineAsyncComponent(() => import("./logo.vue"));
const useLocale = useLocaleStore();
const router = useRouter();
const authStore = useAuthStore();
const loginFormRef = ref<FormInstance>();
let curLocale = useLocale.locale;
let currentLan = ref(langs.find((cur) => cur.key === curLocale)?.title || "");
const dialogFormVisible = ref(false);

const checked1: any = ref(""); // 空泡测试复选
const dialogVisible = ref(false); // 空跑测试弹窗
const skipTestFlag: any = ref(""); // 单选
const emptyRunTestId: any = ref("");

watch(
  () => router.currentRoute.value.path,
  (newValue, oldValue) => {
    if (
      authStore.$state?.userRouterLogins &&
      Array.isArray(authStore.$state.userRouterLogins)
    ) {
      const formEl = unref(loginFormRef); // 解包 Ref
      if (formEl) {
        formEl.resetFields(); // 调用 resetFields 方法
      }
      // 每一次进入需要登录的页面都需要将用户初始化
      authStore.userName = "user";
      authStore.userPwd = "";
      if (authStore.$state.userRouterLogins.includes(newValue)) {
        dialogFormVisible.value = true;
      }
    } else {
      console.warn("authStore.$state.userRouterLogins 未定义或不是数组");
    }
  },
  { immediate: true }
);

const loginRules = computed(() => ({
  username: [
    {
      required: true,
      message: t("login.userNamePlaceholder"),
      trigger: "blur",
    },
  ],
  password: [
    { required: true, message: t("login.userPwdPlaceholder"), trigger: "blur" },
  ],
}));
// const loginRules = reactive<FormRules>({
//   username: [
//     {
//       required: true,
//       message: t("login.userNamePlaceholder"),
//       trigger: "blur",
//     },
//   ],
//   password: [
//     { required: true, message: t("login.userPwdPlaceholder"), trigger: "blur" },
//   ],
// });
const gotoBigScren = () => {
  window.open("http://192.168.80.32:9528/ai-screen/monitorWebEnd", "_blank");
};
// 登录
const submitLogin = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.validate((valid) => {
    if (valid) {
      if (form.username === "admin" && form.password === "Hsk123") {
        authStore.userLogin(form);
        dialogFormVisible.value = false;
      } else {
        ElMessage.error(t("login.loginFail"));
      }
    } else {
      console.log("error submit!");
    }
  });
};
const emtyCheckChange = (e: any) => {
  if (e) {
    skipTestFlag.value = true;
  } else {
    skipTestFlag.value = "";
  }
};

const handleClick = async () => {
  dialogVisible.value = true;
  try {
    const res = await getRuleDetail();
    checked1.value = res.data.skipTestFlag;
    emptyRunTestId.value = res.data.id;
    skipTestFlag.value =
      res.data.requireResult !== null ? res.data.requireResult : "";
  } catch (error) {}
};
// 空跑提交
const submitEmtryClick = () => {
  let updateRuleObj: any = {
    id: emptyRunTestId.value,
    requireResult: skipTestFlag.value,
    skipTestFlag: checked1.value,
  };
  console.log(updateRuleObj);
  try {
    const res = updateRule({ ...updateRuleObj });
    authStore.skipTestFlag = checked1.value;
    ElMessage.success(t("systemConfig.savaSuccessTip"));
  } catch (error) {}

  dialogVisible.value = false;
};
// 取消登录跳转到上一页
const cancelLogin = () => {
  const formEl = unref(loginFormRef); // 解包 Ref
  if (formEl) {
    formEl.resetFields(); // 调用 resetFields 方法
  }
  form.username = "";
  form.password = "";
  router.go(-1);
  dialogFormVisible.value = false;
};
// 定义表单
const form = reactive({
  username: "",
  password: "",
});
const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.resetFields();
};

//
const handleCommand = (command: any) => {
  currentLan.value = command.title;
  useLocale.setLocale(command.key);
  // 切换中英文后重新获取瑕疵列表
  authStore.getDefectList();
};
</script>
<style scoped lang="scss">
.el-menu--horizontal {
  --el-menu-horizontal-height: 30px;
}
.header-box {
  height: 60px;
  width: 100%;
  background-color: #ebf2ff;
  line-height: 52px;
  border-bottom: 1px solid #f3f3f3;
}
.el-menu--horizontal.el-menu {
  border: none !important;
}
.language-select {
  cursor: pointer;
}
.kpts-menu {
  width: 100%;
  height: 36px;
  font-size: 14px;
  font-weight: 400;
  line-height: 36px;
  padding-left: 12px;
  cursor: pointer;
  transition: background-color 0.3s ease 0.2s, color 0.3s ease 0.2s;
}
.kpts-menu:hover {
  background-color: #ecf5ff;
  color: #409eff;
  // transition-delay: 0.1s; /* 悬停时立即开始或设置延迟 */
}
.delete-btn {
  width: 45px !important;
  height: 20px !important;
  line-height: 20px !important;
}
</style>
