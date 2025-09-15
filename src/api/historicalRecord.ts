import request from "@/utils/request";
// 历史记录分页查询
export function recordPageQuery(data = {}) {
  const req = request({
    url: `/detect/record/pageQuery`,
    method: "POST",
    data
  })
  return req;
}
// 检测结果下拉列表 
export function getDetectResultSelList(data = {}) {
  const req = request({
    url: `/detect/record/getDetectResultSelList`,
    method: "POST",
    data
  })
  return req;
}