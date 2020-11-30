import request from '@/utils/request'

// 获取营销活动详情
export function queryEventDefDetails(params) {
  return request({
    url: '/metadataManage/event/queryEventDefDetails',
    method: 'GET',
    params
  })
}

// 获取营销事件定义列表
export function queryEventDefList(params) {
  return request({
    url: '/metadataManage/event/queryEventDefList',
    method: 'GET',
    params
  })
}

// 获取当前事件设定好的事件条件列表
export function queryEventParamList(params) {
  return request({
    url: '/metadataManage/event/queryEventParamList',
    method: 'GET',
    params
  })
}

// 获取事件条件字段定义页面事件列表
export function queryEventParamEventList(params) {
  return request({
    url: '/metadataManage/event/queryEventParamEventList',
    method: 'GET',
    params
  })
}

// 获取全部的事件列表
export function queryAllEventList(params) {
  return request({
    url: '/metadataManage/event/queryAllEventList',
    method: 'GET',
    params
  })
}

// 获取当前时间全部的事件条件
export function queryAllEventParamList(params) {
  return request({
    url: '/metadataManage/event/queryAllEventParamList',
    method: 'GET',
    params
  })
}

// 更新事件条件字段
export function updateEventParamList(params) {
  return request({
    url: '/metadataManage/event/updateEventParamList',
    method: 'POST',
    data: params
  })
}
// 查询事件类型列表
export function getEventList(params) {
  return request({
    url: '/event/type/list',
    method: 'GET',
    params
  })
}

export function updateMarketEventField(params) {
  return request({
    url: '/metadataManage/event/updateEventColumnParam',
    method: 'PUT',
    data:params
  })
}