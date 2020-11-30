import { request2 } from '@/utils/request'

// 获取装修左侧组件
export function getLabelPoolList() {
  return request2({
    url: '/api/memberLabel/labelPool/list'
  })
}
