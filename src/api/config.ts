import request from "@/utils/request";

// 检测参数配置详情列表查询
export function getDetails() {
  const req = request({
    url: `/visiondevice/checkParamConfig/getDetails`,
    method: "POST"
  })
  return req;
}

// 检测参数配置详情列表查询
export function saveDetectionConfig(data = {}) {
  const req = request({
    url: `/visiondevice/checkParamConfig/saveConfig`,
    method: "POST",
    data
  })
  return req;
}

//系统配置详情查询  
export function getSystemConfigDetails() {
  const req = request({
    url: `/visiondevice/systemConfig/getDetail`,
    method: "POST"
  })
  return req;
}

// 系统配置保存
export function saveSystemConfigConfig(data = {}) {
  const req = request({
    url: `/visiondevice/systemConfig/saveConfig`,
    method: "POST",
    data
  })
  return req;
}

// 设备故障配置列表 
export function deviceFaultList(data = {}) {
  const req = request({
    url: `/device/fault/list`,
    method: "POST",
    data
  })
  return req;
}

// 保存故障列表 
export function saveDeviceFaultList(data = {}) {
  const req = request({
    url: `/device/fault/saveDeviceFaultList`,
    method: "POST",
    data
  })
  return req;
}

// 获取瑕疵列表 
export function getBlemishList() {
  const req = request({
    url: `/detect/record/getBlemishList`,
    method: "POST"
  })
  return req;
}

// 未绑定故障点位列表  
export function unbindFaultPointList() {
  const req = request({
    url: `/device/fault/unbindFaultPointList`,
    method: "POST"
  })
  return req;
}