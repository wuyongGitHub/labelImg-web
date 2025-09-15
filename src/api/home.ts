import request from "@/utils/request";

// 开始检测
export function StartDetectionData(data = {}) {
  const req = request({
    url: `/visiondevice/mainInterface/star`,
    method: "POST",
    data
  })
  return req;
}

// 关闭检测
export function closeDetectionData(data = {}) {
  const req = request({
    url: `/visiondevice/mainInterface/end`,
    method: "POST",
    data
  })
  return req;
}

// 故障复位
export function resetDetectionData(data:any) {
  const req = request({
    url: `/device/fault/resetFault`,
    method: "POST",
    data
  })
  return req;
}