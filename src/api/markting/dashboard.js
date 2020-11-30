import { request2 } from '@/utils/request'
const baseUrl = ''
//  获得会员总览
export function queryMemberShipOverviewTotal(params) {
  return request2({
    url: baseUrl + '/memberHomePage/homePage/queryMemberShipOverviewTotal',
    params
  })
}
// 新增会员
export function queryNewMember(params) {
  return request2({
    url: baseUrl + '/memberHomePage/homePage/queryNewMember',
    params
  })
}
//  新注册会员来源分布
export function memberSourceDistribution(params) {
  return request2({
    url: baseUrl + '/memberHomePage/homePage/queryNewRegisterMemberSourceDistribution',
    params
  })
}

//  注册城市会员量分布
export function memberCityDistribution(params) {
  return request2({
    url: baseUrl + '/memberHomePage/homePage/queryNewRegisterMemberCityDistribution',
    params
  })
}

//  获取新老会员消费占比
export function newAndOldMemberRate(params) {
  return request2({
    url: baseUrl + '/memberHomePage/homePage/queryProportionOfNewAndOldMember',
    params
  })
}

//  获取各渠道消费会员
export function queryConsumptionType(params) {
  return request2({
    url: baseUrl + '/memberHomePage/homePage/queryConsumptionType',
    params
  })
}

// 各等级消费会员/占比
export function queryConsumptionLevel(params) {
  return request2({
    url: baseUrl + '/memberHomePage/homePage/queryConsumptionLevel',
    params
  })
}

// 各等级会员量分布
export function queryMemberLevelDistribution(params) {
  return request2({
    url: baseUrl + '/memberHomePage/homePage/queryMemberLevelDistribution',
    params
  })
}

// 获取各等级会员迁移数
export function queryMemberLevelTransfer(params) {
  return request2({
    url: baseUrl + '/memberHomePage/homePage/queryMemberLevelTransfer',
    params
  })
}
