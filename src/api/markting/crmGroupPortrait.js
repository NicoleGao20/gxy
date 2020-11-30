import { request2 } from '@/utils/request'
const baseUrl = ''
// 画像图表的id列表
export function initPortraitId(data) {
  return request2({
    url: baseUrl + '/memberLabel/crm/initPortraitId',
    method: 'post',
    data
  })
}

// 根据id 查询图表
export function getPortraitInfoById(data) {
  return request2({
    url: baseUrl + '/memberLabel/crm/getPortraitInfoById',
    method: 'post',
    data
  })
}

//  添加图表的查询
export function getPortraitList(params) {
  return request2({
    url: baseUrl + '/memberLabel/crm/getPortraitList',
    params
  })
}
//  保存图表图表的查询
export function addPortraitInfo(data) {
  return request2({
    url: baseUrl + '/memberLabel/crm/addPortraitInfo',
    method: 'post',
    data
  })
}
// 保存图表图表
export function savePortrait(data) {
  return request2({
    url: baseUrl + '/memberLabel/crm/savePortrait',
    method: 'post',
    data
  })
}

//  删除图表 切换图表位置
export function updatePortraitIndex(data) {
  return request2({
    url: baseUrl + '/memberLabel/crm/updatePortraitIndex',
    method: 'put',
    data
  })
}

//  获取模版list
export function getTemplateList(params) {
  return request2({
    url: baseUrl + '/memberLabel/crm/getTemplateList',
    method: 'get',
    params
  })
}

//  获取模版list
export function addTemplate(data) {
  return request2({
    url: baseUrl + '/memberLabel/crm/addTemplate',
    method: 'post',
    data
  })
}

// 画像模板删除
export function deleteTemplate(params) {
  return request2({
    url: baseUrl + '/memberLabel/crm/deleteTemplate',
    method: 'delete',
    params
  })
}

// 画像导出，文件导出
export function portraitImprot(params) {
  return request2({
    url: baseUrl + '/crm/portraitImprot',
    params
  })
}

// 新增图标和查询图标的接口
export function memberReportFormUpdate(params) {
  return request2({
    url: baseUrl + '/crm/memberReportFormUpdate',
    params
  })
}
// tab 数据查询
export function getLabelType(params) {
  return request2({
    url: baseUrl + '/memberLabel/crm/getLabelType',
    params
  })
}

// 受众列表，标签列表的点击进入，得到查询条件的组件

export function getLabelInfo(params) {
  return request2({
    url: '/group/filter/getLabelInfo',
    params
  })
}

// 受众列表，标签列表的点击进入，得到查询条件的组件
export function addFilterJSON(data) {
  return request2({
    url: baseUrl + '/memberLabel/crm/addFilterJSON',
    method: 'post',
    data
  })
}

// 受众列表，标签列表的点击进入，得到查询条件的组件
export function getFilterJSON(params) {
  return request2({
    url: baseUrl + '/memberLabel/crm/getFilterJSON',
    params
  })
}

// 判断 保存条件至模版的按钮， 禁用和不禁用
export function checkIsNotOrTrue(data) {
  return request2({
    url: baseUrl + '/memberLabel/crm/checkIsNotOrTrue',
    method: 'post',
    data
  })
}
