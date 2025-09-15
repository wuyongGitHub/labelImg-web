import request from "@/utils/request";
// 历史记录分页查询
export function getRuleDetail(data = {}) {
  const req = request({
    url: `/skipTest/ruleDetail`,
    method: "POST",
    data
  })
  return req;
}
// 
export function updateRule(data = {}) {
  const req = request({
    url: `/skipTest/updateRule`,
    method: "POST",
    data
  })
  return req;
}