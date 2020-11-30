import request from '@/utils/request'

/**
 * 品牌标签池列表
 */
export function getBrandLabelList(data) {
  return request({
    url: '/memberLabel/brandLabel/getBrandLabelList',
    method: 'GET',
    params: data
  })
}

/**
 * 品牌属性标签详情查看接口
 */
export function getAttrBrandLabel(data) {
  return request({
    url: '/memberLabel/brandLabel/getAttrBrandLabel',
    method: 'GET',
    params: data
  })
}

/**
 * 启动|停止标签接口
 */
export function updateLabelStatus(data) {
  return request({
    url: '/memberLabel/brandLabel/updateLabelStatus',
    method: 'PUT',
    params: data
  })
}

/**
 * 上下架标签接口
 */
export function updateShelfStatus(data) {
  return request({
    url: '/memberLabel/brandLabel/updateShelfStatus',
    method: 'PUT',
    params: data
  })
}

/**
 * 删除品牌标签
 */
export function deleteBrandLabel(data) {
  return request({
    url: '/memberLabel/brandLabel/deleteBrandLabel',
    method: 'DELETE',
    params: data
  })
}

/**
 * 查询类目树
 */
export function getClassTree(data) {
  return request({
    url: '/memberLabel/brandLabel/getClassTree',
    method: 'GET',
    params: data
  })
}

/**
 * 类目拖动排序
 */
export function sortClass(data) {
  return request({
    url: '/memberLabel/brandLabel/sortClass',
    method: 'PUT',
    data
  })
}

/**
 * 添加类目
 */
export function addClass(data) {
  return request({
    url: '/memberLabel/brandLabel/addClass',
    method: 'POST',
    data
  })
}

/**
 * 删除类目
 */
export function deleteClass(data) {
  return request({
    url: '/memberLabel/brandLabel/deleteClass',
    method: 'DELETE',
    params: data
  })
}

/**
 * 编辑类目
 */
export function editClass(data) {
  return request({
    url: '/memberLabel/brandLabel/editClass',
    method: 'PUT',
    params: data
  })
}

/**
 * 品牌复合标签详情  create_type:filter
 */
export function getComplexBrandLabel(data) {
  return request({
    url: '/memberLabel/brandLabel/getComplexBrandLabel',
    method: 'GET',
    params: data
  })
}

/**
 * 品牌标签池-复合标签编辑  create_type:filter
 */
export function editComplexBrandLabel(data) {
  return request({
    url: '/memberLabel/brandLabel/editComplexBrandLabel',
    method: 'PUT',
    data
  })
}

/**
 * 品牌模型标签详情
 */
export function getModelBrandLabel(data) {
  return request({
    url: '/memberLabel/brandLabel/getModelBrandLabel',
    method: 'GET',
    params: data
  })
}

/**
 * 品牌标签池-模型标签编辑
 */
export function editModelBrandLabel(data) {
  return request({
    url: '/memberLabel/brandLabel/editModelBrandLabel',
    method: 'PUT',
    data
  })
}

/**
 * 品牌手工标签详情接口
 */
export function getManualBrandLabel(data) {
  return request({
    url: '/memberLabel/brandLabel/getManualBrandLabel',
    method: 'GET',
    params: data
  })
}

/**
 * 品牌标签池-规则标签编辑
 */
export function editRuleBrandLabel(data) {
  return request({
    url: '/memberLabel/brandLabel/editRuleBrandLabel',
    method: 'PUT',
    data
  })
}

/**
 * 品牌规则标签详情接口
 */
export function getRuleBrandLabel(data) {
  return request({
    url: '/memberLabel/brandLabel/getRuleBrandLabel',
    method: 'GET',
    params: data
  })
}

/**
 * 分配类目
 */
export function distributeClass(data) {
  return request({
    url: '/memberLabel/brandLabel/distributeClass',
    method: 'PUT',
    data
  })
}

// 品牌标签池编辑
export function editBrandLabel(data) {
  return request({
    url: '/memberLabel/brandLabel/editBrandLabel',
    method: 'PUT',
    data
  })
}
