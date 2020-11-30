import { request2 } from '@/utils/request'
const baseUrl = ''
export function organLevel() {
  return request2({
    url: baseUrl + '/authority/available/listRoleByUserId',
    method: 'get'
  })
}
//  memberId  来获取详情
export function getMemberBasicInformation(params) {
  return request2({
    url: baseUrl + '/member/archives/getMemberBasicInformation',
    params
  })
}

// 根据memberid查询指标卡
export function getIndexCard(params) {
  return request2({
    url: baseUrl + '/member/archives/getIndexCard',
    params
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
export function addPortraitInfo(params) {
  return request2({
    url: baseUrl + '/memberLabel/crm/addPortraitInfo',
    method: 'post',
    params
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
export function addTemplate(params) {
  return request2({
    url: baseUrl + '/memberLabel/crm/addTemplate',
    method: 'post',
    params
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
    url: baseUrl + '/memberLabel/label/getLabelType',
    params
  })
}
// tab 数据查询
export function getTrajectoryData(params) {
  return request2({
    url: baseUrl + '/member/archives/getBehaviorTrajectory',
    params
  })
}
