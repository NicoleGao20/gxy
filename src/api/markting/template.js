import { request2 } from '@/utils/request'
/**
 * 查询受众模板列表
 */
export function getGroupTemplateList(params) {
  return request2({
    url: `/memberInsight/groupTemplate/getGroupTemplateList`,
    method: 'GET',
    params
  })
}

/**
 * 受众模板详情
 */
export function getGroupTemplateDetail(params) {
  return request2({
    url: `/memberInsight/groupTemplate/getGroupTemplateDetail`,
    method: 'GET',
    params
  })
}

/**
 * 新增受众模板
 */
export function addGroupTemplate(params) {
  return request2({
    url: `/memberInsight/groupTemplate/addGroupTemplate`,
    method: 'POST',
    data: params
  })
}
//启动
export function updateGroupTemplateOnStatus(params) {
  return request2({
    url: `/memberInsight/groupTemplate/updateGroupTemplateOnStatus`,
    method: 'PUT',
    params
  })
}

/**
 * 编辑受众模板
 */
export function editGroupTemplate(params) {
  return request2({
    url: `/memberInsight/groupTemplate/editGroupTemplate`,
    method: 'PUT',
    data: params
  })
}

/**
 * 删除受众模板
 */
export function deleteGroupTemplate(params) {
  return request2({
    url: `/memberInsight/groupTemplate/deleteGroupTemplate`,
    method: 'DELETE',
    params
  })
}
/**
 * 查询总部权限
 */
export function isHeadquarters(params) {
  return request2({
    url: `/memberInsight/groupTemplate/isHeadquarters`,
    method: 'GET',
    params
  })
}
