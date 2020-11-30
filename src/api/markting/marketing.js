import { request2 } from '@/utils/request'

// const baseUrl = 'mocks'
const baseUrl = ''
// 获取参数
export function getmarketingListParameter() {
  return request2({
    url: baseUrl + '/marketing/activity/queryCondition',
    method: 'get'
  })
}

// 编辑按钮权限
export function getmarketingBtnIsok(data) {
  return request2({
    url: baseUrl + '/marketing/activity/orgCodeValidate',
    method: 'get',
    params: data
  })
}

// 获取表格数据
export function getmarketingTableParameter(data) {
  return request2({
    url: baseUrl + '/marketing/activity/page',
    method: 'get',
    params: data
  })
}
// 删除活动数据
export function deletemarketingList(data) {
  return request2({
    url: baseUrl + '/marketing/activity/delete',
    method: 'DELETE',
    params: data
  })
}

// 结束活动数据
export function endmarketingList(data) {
  return request2({
    url: baseUrl + '/marketing/activity/over',
    method: 'PUT',
    params: data
  })
}
// 复制活动数据
export function marketingCopyActivity(data) {
  return request2({
    url: baseUrl + '/marketing/activity/copy',
    method: 'post',
    data: data
  })
}

// 获取日志
export function getmarketinglog(params) {
  return request2({
    url: baseUrl + '/marketing/activity/auditLog',
    method: 'get',
    params: params
  })
}

// 获取模版数据
export function getmarketingModule(params) {
  return request2({
    url: baseUrl + '/marketing/template/page',
    method: 'get',
    params: params
  })
}
// 获取模版数据
export function deletemarketingModule(data) {
  return request2({
    url: baseUrl + '/marketing/template/delete',
    method: 'DELETE',
    params: data
  })
}

// 营销活动新增
export function activityCreate(data) {
  return request2({
    url: baseUrl + '/marketing/activity/create',
    method: 'post',
    data: data
  })
}

// 营销活动编辑
export function activityUpdate(data) {
  return request2({
    url: baseUrl + '/marketing/activity/update',
    method: 'put',
    data: data
  })
}

// 营销活动详情查看
export function activityInfo(data) {
  return request2({
    url: baseUrl + `/marketing/activity/info/${data.id}`,
    method: 'get'
  })
}

// 营销活动模板新增
export function activityTemplateCreate(data) {
  return request2({
    url: baseUrl + '/marketing/template/create',
    method: 'post',
    data: data
  })
}

// 营销活动模板编辑
export function activityTemplateUpdate(data) {
  return request2({
    url: baseUrl + '/marketing/template/update',
    method: 'put',
    data: data
  })
}

// 营销活动模板详情查看
export function activityTemplateInfo(data) {
  return request2({
    url: baseUrl + `/marketing/template/info/${data.id}`,
    method: 'get'
  })
}

// 营销活动使用模板创建活动
export function createActivityByTemplate(data) {
  return request2({
    url: baseUrl + `/marketing/template/use`,
    method: 'post',
    data
  })
}

// 营销活动组件资源获取
export function listAssemblyResourceByUser() {
  return request2({
    url: baseUrl + `/authority/available/listAssemblyResourceByUser`,
    method: 'get'
  })
}

// 营销活动审核
export function auditMarketingActivity(data) {
  return request2({
    url: baseUrl + `/marketing/activity/audit`,
    method: 'put',
    data
  })
}

// 营销活动提交
export function submitMarketingActivity(data) {
  return request2({
    url: baseUrl + `/marketing/activity/submit`,
    method: 'put',
    data
  })
}

// 异业券使用确认
export function thirdConfirmUse(params) {
  return request2({
    url: baseUrl + `/component/system/thirdConfirmUse`,
    method: 'get',
    params
  })
}

// 零售运动城券使用确认
export function confirmUse(params) {
  return request2({
    url: baseUrl + `/component/system/confirmUse`,
    method: 'get',
    params
  })
}
