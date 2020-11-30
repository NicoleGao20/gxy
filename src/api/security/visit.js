import request from '@/utils/request'
// const basurl='mocks'
// const basurl='http://192.168.12.195:8088 '
const basurl='';
//查询登录策略设置
export function queryLoginPlanSet(params) {
  return request({
    url:basurl+'/security/queryLoginPlanSet',
    method: 'get',
    params
  })
}
//访问控制开关
export function queryAccessControlSet(params) {
  return request({
    url:basurl+'/security/queryAccessControlSet',
    method: 'get',
    params
  })
}
//修改登录策略设置
export function editLoginPlanSet(data) {
  return request({
    url:basurl+'/security/editLoginPlanSet',
    method: 'POST',
    data
  })
}
//添加可访问IP 
export function modifyAccessibleIP(data) {
  return request({
    url:'/security/addAccessibleIP',
    method: 'POST',
    data
  })
}
//查询可访问IP
export function queryAccessibleIP(params) {
  return request({
    url:'/security/queryAccessibleIP',
    method: 'get',
    params
  })
} 
// 修改访问控制设置--开关状态有问题
export function editAccessControlSet(data) {
  return request({
    url:'/security/editAccessControlSet',
    method: 'POST',
    data
  })
}
//删除可访问IP
export function deleteTemplate(data) {
  return request({
    url:`/security/delAccessibleIP`, 
    method: 'DELETE',
    data
  })
}

//登录监控
//请求接口
// const abc="http://192.168.10.237:8080";
export function queryAllUserLoginInfo(params) {
  return request({
    url:`/security/queryAllUserLoginInfo`,
    method: 'get',
    params
  })
}
//查询敏感操作设置
export function querySensitiveOperationSet(params) {
  return request({
    url:`/security/querySensitiveOperationSet`,
    method: 'get',
    params 
  })
}
//验证用户信息
export function checkLoginUserInfo(params) {
  return request({
    url:basurl+`/downloadMgt/checkLoginUserInfo`,
    method: 'get',
    params 
  })
}
//修改敏感操作设置
export function editSensitiveOperationSet(data) {
  return request({
    url:'/security/editSensitiveOperationSet',
    method: 'POST',
    data
  })
}
// 添加验证人信息
export function addVerifierInfo(data) {
  return request({
    url:'/security/addVerifierInfo',
    method: 'POST',
    data
  })
}
// 查询验证人信息
export function queryVerifierInf(params) {
  return request({
    url:`/security/queryVerifierInfo`,
    method: 'get',
    params 
  })
}
//修改验证人信息
export function editVerifierInfo(data) {
  return request({
    url:'/security/editVerifierInfo',
    method: 'POST',
    data
  })
}
//删除验证
export function delVerifierInfo(data) {
  return request({
    url:`/security/delVerifierInfo`, 
    method: 'DELETE',
    data
  })
}
export function queryQueryBoxWord(params) {
  return request({
    url:basurl+`downloadMgt/queryBoxWordList`,
    method: 'get',
    params 
  })
}

//日志下载--查询接口
export function queryDownloadVerifier(params) {
  return request({
    url:'/downloadMgt/queryDownloadLog',
    method: 'get',
    params
  })
}
//数据下载
export function queryDownloadRecord(params) {
  return request({
    url:basurl+'/downloadMgt/queryDownloadRecord',
    method: 'get',
    params
  })
}
export function queryVerifierName(params) {
  return request({
    url:'/security/queryVerifierName',
    method: 'get',
    params
  })
}
//验证码
export function sendDownloadCheckMsg(params) {
  return request({
    url:basurl+'/downloadMgt/sendDownloadCheckMsg',
    method: 'get',
    params
  })
}
//验证验证码
export function checkVerificationCode(params) {
  return request({
    url:basurl+'/downloadMgt/checkVerificationCode',
    method: 'get',
    params
  })
}
//操作日志
//下拉
export function queryRelatedWord(data) {
  return request({
    url:'/security/queryRelatedWord',
    method: 'POST',
    data
  })
}
export function queryOperationLog(data) {
  return request({
    url:'/security/queryOperationLog',
    method: 'POST',
    data
  })
}
//导入接口
export function queryDownloadImportLog(params) {
  return request({
    url:basurl+'/downloadMgt/queryDownloadImportLog',
    method: 'get',
    params
  })
}
//验证人姓名
export function queryDownloadVerifierName(params) {
  return request({
    url:'/downloadMgt/queryDownloadVerifier',
    method: 'get',
    params
  })
}
export function queryScreeningCriteria(params) {
  return request({
    url:basurl+'/downloadMgt/queryScreeningCriteria',
    method: 'get',
    params
  })
}
//集成配置查询接口
export function queryAllIntegration(params) {
  return request({
    url:basurl+'/integration/integra/queryAllIntegration',
    method: 'get',
    params
  })
}
//新增
export function getType(params) {
  return request({
    url:basurl+'/integration/integra/getType',
    method: 'get',
    params
  })
}

//停用/启用
export function onStatus(data) {
  return request({
    url:'/integration/integra/onStatus',
    method: 'POST',
    data
  })
}
//平台
export function queryChl(params) {
  return request({
    url:basurl+'/integration/integra/queryChl',
    method: 'get',
    params
  })
}
//查看和编辑接口
export function queryIntegration(params) {
  return request({
    url:'/integration/integra/queryIntegration',
    method: 'get',
    params
  })
}
//删除
export function delIntegration(params) {
  return request({
    url:'/integration/integra/delIntegration',
    method: 'DELETE',
    params
  })
}
//保存
export function editIntegration(params) {
  return request({
    url:'store/sto/editIntegration',
    method: 'DELETE',
    params
  })
}
//启用/停用
export function deletOnStatus(params) {
  return request({
    url: '/integration/integra/onStatus',
    method: 'POST',
    params
  })
}
//新增保存
export function preservationAdd(params) {
  return request({
    url:'/integration/integra/addIntegration',
    method: 'POST',
    params
  })
}
//新增
export function getChls(params) {
  return request({
    url:'/integration/integra/getChl',
    method: 'get',
    params
  })
}
//店铺档案
//显示全部数据/查询
export function queryAllStore(params) {
  return request({
    url:'/store/sto/queryAllStore',
    method: 'get',
    params
  })
}
//新增
export function addStor(data) {
  return request({
    url:'/store/sto/addStore',
    method: 'POST',
    data
  })
}
//保存--编辑
export function editStore(data) {
  return request({
    url:'/store/sto/editStore',
    method: 'POST',
    data
  })
}
//编辑
export function updateStore(params) {
  return request({
    url:'/store/sto/updateStore',
    method: 'get',
    params
  })
}
//删除
export function delStore(params) {
  return request({
    url:'/store/sto/delStore',
    method: 'DELETE',
    params
  })
}

export function queryPlatformName(params) {
  return request({
    url:'/store/sto/queryPlatformName',
    method: 'get',
    params
  })
}
export function editConfig(data) {
  return request({
    url:'/integration/integra/editIntegration',
    method: 'POST',
    data
  })
}
//品牌唯一
export function integraCheckChl(params) {
  return request({
    url:'/integration/integra/checkChl',
    method: 'get',
    params
  })
}
//唯一码
export function checkOmsCode(params) {
  return request({
    url:'/store/sto/checkOmsCode',
    method: 'get',
    params
  })
}


//评价档案  查询
export function queryOrderArchives(data) {
  return request({
    url:'/orderArchives/queryOrderArchives',
    method: 'POST',
    data
  })
}
// 省市区
export function queryProvinceAndCity(params) {
  return request({
    url:'/orderArchives/queryProvinceAndCity',
    method: 'get',
  params
  })
}
//评价档案
export function queryEvaluationArchives(data) {
  return request({
    url:'/evaluationArchives/queryEvaluationArchives',
    method: 'POST',
    data
  })
}
//会员等级
export function levelList(params) {
  return request({
    url:'/orderArchives/querySearchBoxList',
    method: 'get',
    params
  })
}
//商品信息
export function queryProductInfoList(params) {
  return request({
    url:'/evaluationArchives/queryProductInfoList',
    method: 'get',
    params
  })
}
//解释
export function editExplainInfo(data) {
  return request({
    url:'/evaluationArchives/editExplainInfo',
    method: 'POST',
    data
  })
}
//全选
export function editBatchExplainInfo(data) {
  return request({
    url:'/evaluationArchives/editBatchExplainInfo',
    method: 'POST',
    data
  })
}


export function queryBoxVocabulary(params) {
  return request({
    url:basurl+`/downloadMgt/queryBoxVocabulary`,
    method: 'get',
    params 
  })
}







