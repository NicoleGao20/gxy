import { request2 } from '@/utils/request'
const baseUrl = ''
// 获取营销活动详情
export function queryMarketingDetail(params) {
  return request2({
    url: '/marketing/report/queryMarketingDetail',
    method: 'get',
    params
  })
}

// 获取效果总览
export function queryResultOverview(params) {
  return request2({
    url: '/marketing/report/queryResultOverview',
    method: 'get',
    params
  })
}

// 周期分析
export function queryPeriodAnalysis(params) {
  return request2({
    url: '/marketing/report/queryPeriodAnalysis',
    method: 'get',
    params
  })
}

// 人群流向分析
export function queryCrowdFlowDetail(params) {
  return request2({
    url: '/marketing/report/queryCrowdFlowDetail',
    method: 'get',
    params
  })
}

// 消息触达分析
export function queryMessageContactDetail(params) {
  return request2({
    url: '/marketing/report/queryMessageContactDetail',
    method: 'get',
    params
  })
}

// 优惠券转化分析
export function queryCouponDetail(params) {
  return request2({
    url: '/marketing/report/queryCouponDetail',
    method: 'get',
    params
  })
}

// 触达消费分析
export function queryConsumptionDetail(params) {
  return request2({
    url: '/marketing/report/queryConsumptionDetail',
    method: 'get',
    params
  })
}

// AB测试分析
export function queryTestAnalysis(params) {
  return request2({
    url: baseUrl + '/marketing/report/queryTestAnalysis',
    method: 'get',
    params
  })
}

// 事件人群分析
export function queryEventPopulationAnalysis(params) {
  return request2({
    url: baseUrl + '/marketing/report/queryEventPopulationAnalysis',
    method: 'get',
    params
  })
}

// 获取周期营销活动版本列表
export function queryPeriodVersion(params) {
  return request2({
    url: '/marketing/report/queryPeriodVersion',
    method: 'get',
    params
  })
}
// excel文件流导出
export function exportMarketingExcel(params) {
  return request2({
    url: '/marketing/reportExport/exportMarketingExcel',
    responseType: 'blob',
    method: 'get',
    params
  })
}
