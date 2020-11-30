import { request2 } from '@/utils/request'
// const baseUrl = 'mocks'
const baseUrl = ''
/**
 * 受众列表查询
 */
export function getGroupListByCon(params) {
  return request2({
    url: baseUrl + `/memberInsight/group/getGroupListByCon`,
    method: 'GET',
    params
  })
}
/**
 * 获取所有已启用状态的受众人群列表
 */
export function groupAction(params) {
  return request2({
    url: baseUrl + `/memberInsight/group/groupAction`,
    method: 'GET',
    params
  })
}

// 受众列表 编辑
export function getOrgCodeLongStatus(params) {
  return request2({
    url: baseUrl + `/memberInsight/group/editGroup`,
    method: 'PUT',
    params
  })
}
/**
 * 受众启用停用
 */
export function setStatus(params) {
  return request2({
    url: baseUrl + `/memberInsight/group/setStatus`,
    method: 'PUT',
    params
  })
}

/**
 * 删除受众
 */
export function deleteGroup(params) {
  return request2({
    url: baseUrl + `/memberInsight/group/deleteGroup`,
    method: 'DELETE',
    params
  })
}

/**
 * 新增普通/高级受众
 */
export function insertGroupByFilter(params) {
  return request2({
    url: baseUrl + `/memberInsight/group/insertGroupByFilter`,
    method: 'POST',
    data: params
  })
}

/**
 * 导入受众
 */
export function importGroup(params) {
  return request2({
    url: baseUrl + `/memberInsight/group/importGroup`,
    method: 'POST',
    data: params,
    timeout: 60000
  })
}

/**
 * 导入受众编辑
 */
export function editGroup(params) {
  return request2({
    url: baseUrl + `/memberInsight/group/editGroup`,
    method: 'PUT',
    data: params
  })
}

// 普通/高级受众编辑
export function editFilterGroup(params) {
  return request2({
    url: baseUrl + `/memberInsight/group/editFilterGroup`,
    method: 'PUT',
    data: params
  })
}

/**
 * 受众详情
 */
export function getGroupDetails(params) {
  return request2({
    url: baseUrl + `/memberInsight/group/getGroupDetails`,
    method: 'GET',
    params
  })
}

/**
 * 设置停用中
 */
export function setStopping(params) {
  return request2({
    url: baseUrl + `/memberInsight/group/setStopping`,
    method: 'PUT',
    params
  })
}

/**
 * 查询受众会员
 */
export function getMemberInfo(params) {
  return request2({
    url: baseUrl + `/memberInsight/group/getMemberInfo`,
    method: 'GET',
    params
  })
}

/**
 * 根据品牌查询已启用的受众
 */
export function queryIdAndNoAndName(params) {
  return request2({
    url: baseUrl + `/memberInsight/group/queryIdAndNoAndName`,
    method: 'GET',
    params
  })
}

/**
 * 根据品牌查询已启用的受众
 */
export function getCountsByGroupId(params) {
  return request2({
    url: baseUrl + `/memberInsight/group/getCountsByGroupId`,
    method: 'GET',
    params
  })
}
