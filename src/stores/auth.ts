import { defineStore } from 'pinia';
import type { RouteRecordRaw } from 'vue-router';
import { getBlemishList } from "../api/config";

export const useAuthStore = defineStore('auth', {
  state: (): AuthState<RouteRecordRaw> => {
    return {
      // '/systemSetting', '/log'
      userRouterLogins: ["/systemSetting", "/configurationOfFaultHandlingPlan"],  // 那些登录页面需要登录
      userName: "user",
      userPwd: "",
      lang: "zh-CN",
      skipTestFlag: false,
      defectList: [] // 瑕疵列表库
    }
  },
  actions: {
    // 登录操作
    userLogin(loginData: LoginData) {
      return new Promise<void>((resolve, reject) => {
        this.userName = loginData.username;
        this.userPwd = loginData.password;
        resolve();
      });
    },
    // 获取瑕疵列表库
    async getDefectList() {
      try {
        const res = await getBlemishList(); // 调用 API 获取瑕疵列表
        console.log("获取瑕疵列表成功:", res);
        // 假设 API 返回的数据结构是数组，直接赋值给 defectList
        this.defectList = res.data;

        // 如果 API 返回的数据需要额外处理，可以在这里进行格式化
        // 例如：this.defectList = res.map(item => ({ ...item, customField: true }));
      } catch (error) {
        this.defectList = []
        console.error("获取瑕疵列表失败:", error);
        throw error; // 将错误抛出，便于外部捕获
      }
    }
  }
});
