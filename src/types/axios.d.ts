/* eslint-disable */
import * as axios from 'axios';
// 自行扩展 axios 返回的数据类型
declare module 'axios' {
  export interface AxiosResponse<T = any> {
    code: number;
    message: string;
    data: T;
  }
}
