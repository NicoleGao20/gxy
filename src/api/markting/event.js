import request, { request2 } from '@/utils/request'

export function getEventTypeList(data) {
  return request2({
    url: '/event/type/list',
    method: 'get',
    params: data
  })
}

/**
 *
 * @param { eventTypeCode } data
 */
export function getEventListByType(data) {
  return request2({
    url: '/event/list',
    method: 'get',
    params: data
  })
}

/**
 *
 * @param { metaTableId } data
 */
export function getFilterAttributes(data) {
  return request2({
    url: '/event/config/filterAttributes',
    method: 'get',
    params: data
  })
}

export function queryEventDefList(params) {
  return request({
    url: '/metadataManage/event/queryEventDefList',
    method: 'GET',
    params
  })
}

export function queryEventParamList(params) {
  return request({
    url: '/metadataManage/event/queryEventParamList',
    method: 'GET',
    params
  })
}

