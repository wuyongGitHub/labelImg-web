import request from "@/utils/request";

// 获取日志类型
export function getCheckLogPage(data = {}) {
  const req = request({
    url: `/checkLog/getPage`,
    method: "POST",
    data
  })
  return req;
}

// 获取日志类型下拉列表 /checkLog/getLogTypeSelList
export function getLogTypeSelList() {
  const req = request({
    url: `/checkLog/getLogTypeSelList`,
    method: "GET",
  })
  return req;
}
