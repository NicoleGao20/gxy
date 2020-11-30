import { request2 } from '@/utils/request'

// 获取左侧列表数据
export function getlableClassList(params) {
  return request2({
    url: `/labelGroup/label/class`,
    params
  })
}

// 获取表格数据
export function getlableClassTable(params) {
  return request2({
    url: `/labelGroup/label/page`,
    params
  })
}
