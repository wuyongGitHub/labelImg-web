// 登录信息
declare interface LoginData {
  username: string;
  password: string;
}
// 用户认证信息
declare interface AuthState<T = any> {
  rememberData?: LoginData; // 记住我（登录数据）
  accessToken?: string; //访问令牌
  userRouterLogins?: string[];
  userName?: string;
  userPwd?: string;
  lang?: string
  skipTestFlag?: any
  defectList?: Array
}
