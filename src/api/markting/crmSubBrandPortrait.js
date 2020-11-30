import { request2 } from '@/utils/request'
const baseUrl = ''
// 子品牌的下拉接口
export function getSubBrandList(params) {
  return request2({
    url: baseUrl + '/memberLabel/crm/getSubBrandList',
    params
  })
}
//  消费过的会员数
export function getMemberOverview(params) {
  return request2({
    url: baseUrl + '/memberLabel/crm/getMemberOverview',
    params
  })
}

// 基础属性
export function getMemberBasicAttr(params) {
  return request2({
    url: baseUrl + '/memberLabel/crm/getMemberBasicAttr',
    params
  })
}

//  会员等级
export function getMemberMemberLevel(params) {
  return request2({
    url: baseUrl + '/memberLabel/crm/getMemberMemberLevel',
    params
  })
}
//  会员消费
export function getMemberconsume(params) {
  return request2({
    url: baseUrl + '/memberLabel/crm/getMemberconsume',
    params
  })
}
