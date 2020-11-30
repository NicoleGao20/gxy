import request from '@/utils/request'
const baseUrl = ''
/**
 * 手工标签新增
 * @param {*} data
 */
export function getLabelPoolList(data) {
  return request({
    url: '/memberLabel/label/getLabelPoolList',
    method: 'get',
    params: data
  })
}

/**
 * 手工标签新增
 * @param {*} data
 */
export function addManualLabel(data) {
  return request({
    url: '/memberLabel/label/addManualLabel',
    method: 'post',
    data
  })
}

/**
 * 手工标签编辑
 * @param {*} data
 */
export function editManualLabel(data) {
  return request({
    url: '/memberLabel/label/editManualLabel',
    method: 'put',
    data
  })
}

/**
 * 模型标签编辑
 * @param {*} data
 */
export function editModelLable(data) {
  return request({
    url: '/memberLabel/label/editModelLabel',
    method: 'put',
    data
  })
}

/**
 * 属性标签新增
 * @param {*} data
 */
export function editAttributeLabel(data) {
  return request({
    url: '/memberLabel/label/editAttributeLabel',
    method: 'put',
    data
  })
}

/**
 * 规则标签新增
 * @param {*} data
 */
export function addRuleLabel(data) {
  return request({
    url: 'memberLabel/label/addRuleLabel',
    method: 'post',
    data
  })
}

/**
 * 规则标签编辑
 * @param {*} data
 */
export function editRuleLabel(data) {
  return request({
    url: 'memberLabel/label/editRuleLabel',
    method: 'put',
    data
  })
}

/**
 * 查询标签类型
 */
export function getLabelType(data) {
  return request({
    url: '/memberLabel/label/getLabelType',
    method: 'get',
    params: data
  })
}

/**
 * 获取手工标签详情
 */
export function getManualLabel(data) {
  return request({
    url: '/memberLabel/label/getManualLabel',
    method: 'get',
    params: data
  })
}

/**
 * 获取属性标签详情
 */
export function getAttributeLabel(data) {
  return request({
    url: '/memberLabel/label/getAttributeLabel',
    method: 'get',
    params: data
  })
}

/**
 * 获取规则标签详情
 */
export function getRuleLabel(data) {
  return request({
    url: '/memberLabel/label/getRuleLabel',
    method: 'get',
    params: data
  })
}

/**
 * 获取复合标签详情
 */
export function getComplexLabel(data) {
  return request({
    url: '/memberLabel/label/getComplexLabel',
    method: 'get',
    params: data
  })
}

/**
 * 获取复合标签新增
 */
export function addComplexLabel(data) {
  return request({
    url: '/memberLabel/label/addComplexLabel',
    method: 'post',
    data
  })
}

/**
 * 获取复合标签编辑
 */
export function editComplexLabel(data) {
  return request({
    url: '/memberLabel/label/editComplexLabel',
    method: 'put',
    data
  })
}

/**
 * 获取模型标签详情
 */
export function getModelLabel(data) {
  return request({
    url: '/memberLabel/label/getModelLabel',
    method: 'get',
    params: data
  })
}

/**
 * 规则标签删除
 */
export function deleteRuleLabel(data) {
  return request({
    url: '/memberLabel/label/deleteRuleLabel',
    method: 'delete',
    params: data
  })
}

/**
 * 手工标签删除
 */
export function deleteManualLabel(data) {
  return request({
    url: '/memberLabel/label/deleteManualLabel',
    method: 'delete',
    params: data
  })
}

/**
 * 复合标签删除
 */
export function deleteComplexLabel(data) {
  return request({
    url: '/memberLabel/label/deleteComplexLabel',
    method: 'delete',
    params: data
  })
}

/**
 * 模型标签删除
 */
export function deleteModelLabel(data) {
  return request({
    url: '/memberLabel/label/deleteModelLabel',
    method: 'delete',
    params: data
  })
}

/**
 * 属性标签删除
 */
export function deleteAttributeLabel(data) {
  return request({
    url: '/memberLabel/label/deleteAttributeLabel',
    method: 'delete',
    params: data
  })
}

/**
 *  切换标签属性
 */
export function updateTtransform(data) {
  return request({
    url: '/memberLabel/label/updateTtransform',
    method: 'put',
    params: data
  })
}

/**
 * 获取品牌
 */
export function getBrandAll(data) {
  return request({
    url: baseUrl + '/crm-outside/brand/all',
    method: 'GET',
    params: data
  })
}
/**
 * 同步权限
 */
export function retryAuthorization(data) {
  return request({
    url: '/memberLabel/label/retryAuthorization',
    method: 'PUT',
    params: data
  })
}
