import { request2 } from '@/utils/request'

// 获取rfm 选择项和时间选择项数据
export function getRfmValue(params) {
  return request2({
    url: `/labelGroup/label/rfm/values`,
    params
  })
}

// 获取表格和图片数据
export function getRfmtbaleData(params) {
  return request2({
    url: `/labelGroup/label/rfm/stat`,
    method: 'post',
    data: params
  })
}
