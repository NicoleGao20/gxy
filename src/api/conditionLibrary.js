/**
 * created by xu.l@burgeon.cn
 */

import request from '@/utils/request'
const baseUrl = ''

/**
 * 条件库列表查询页面初始化
 * @param {*} params
 */
export function initListPageUi() {
  return request({
    url: baseUrl + '/systemConfig/condition/InitListPageUi',
    // url: baseUrl + '/systemConfig/condition/InitListPageUi',
    method: 'get'
  })
}

/**
 * 条件库列表分页查询
 * @param {*} data
 */
export function listCondition(params) {
  return request({
    url: baseUrl + '/systemConfig/condition/listCondition',
    // url: baseUrl + '/systemConfig/condition/listCondition',
    method: 'get',
    params
  })
}

/**
 * 详情页初始化
 * @param {*} params {id, table_type}
 */
export function detailCondtion(params) {
  return request({
    url: baseUrl + '/systemConfig/condition/detailCondition',
    // url: baseUrl + '/systemConfig/condition/detailCondtion',
    method: 'get',
    params
  })
}

/**
 * 是否升级为标签
 * @param {*} params {id, table_type, up_or_down}
 */
export function setLabel(data) {
  return request({
    url: baseUrl + '/systemConfig/condition/setLabel',
    // url: baseUrl + '/systemConfig/condition/setLabel',
    method: 'put',
    data
  })
}

/**
 * 设置是否可见
 * @param {*} params {id, table_type ,is_or_not}
 */
export function setVisible(data) {
  return request({
    url: baseUrl + '/systemConfig/condition/setVisible',
    // url: baseUrl + '/systemConfig/condition/setVisible',
    method: 'put',
    data
  })
}

/**
 * 获取筛选类别列表
 * @param {*} params {id, table_type ,is_or_not}
 */

export function listTableNameShow(data) {
  return request({
    url: baseUrl + '/systemConfig/condition/listTableNameShow',
    // url: baseUrl + '/systemConfig/condition/listTableNameShow',
    method: 'get',
    params: data
  })
}

