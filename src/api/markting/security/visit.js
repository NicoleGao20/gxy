import { request2 } from '@/utils/request'
// 评价档案  查询
// const basulr = 'mocks'
// http://192.168.10.237:8099--剑飞
// http://192.168.12.227:8088--马云龙
const basulr ='';
export function queryOrderArchives(data) {
  return request2({
    url: basulr+'/orderArchives/queryOrderArchives',
    method: 'POST',
    data
  })
}
// 省市区
export function queryProvinceAndCity(params) {
  return request2({
    url: '/orderArchives/queryProvinceAndCity',
    method: 'get',
    params
  })
}
// 评价档案
export function queryEvaluationArchives(data) {
  return request2({
    url: basulr + '/evaluationArchives/queryEvaluationArchives',
    method: 'POST',
    data
  })
}
//短信模板
export function smsTemplate(params) {
  return request2({
    url: basulr + '/smsTemplate/queryListByTypet',
    method: 'get',
    params
  })
}

// //黑名单
// export function checkBlackList(params) {
//   return request2({
//     url: basulr + '/evaluationArchives/checkBlackList',
//     method: 'get',
//     params
//   })
// }
// 发送短信
export function batchSendMsg(data) {
  return request2({
    url: basulr + '/sms/sendSms',
    method: 'POST',
    data
  })
}

// 会员等级
export function levelList(params) {
  return request2({
    url: basulr + '/orderArchives/querySearchBoxList',
    method: 'get',
    params
  })
}
//黑名单
export function checkBlacklist(data) {
  return request2({
    url: basulr + '/orderArchives/checkBlackList',
    method: 'POST',
    data
  })
}
// 商品信息
export function queryProductInfoList(params) {
  return request2({
    url: '/evaluationArchives/queryProductInfoList',
    method: 'get',
    params
  })
}
// 解释
export function editExplainInfo(data) {
  return request2({
    url: '/evaluationArchives/editExplainInfo',
    method: 'POST',
    data
  })
}
// 全选
export function editBatchExplainInfo(data) {
  return request2({
    url: '/evaluationArchives/editBatchExplainInfo',
    method: 'POST',
    data
  })
}
// 受众列表
// 人群推送
// 新增
export function getType(data) {
  return request2({
    url: 'integration/integra/getType',
    method: 'get',
    data
  })
}

// 店铺档案
// 显示全部数据/查询
export function queryAllStore(params) {
  return request2({
    url: '/store/sto/queryAllStore',
    method: 'get',
    params
  })
}
//显示五条记录
export function storeQuerySto(params) {
  return request2({
    url:'/store/sto/querySto',
    method: 'get',
    params
  })
}
// 新增
export function addStor(data) {
  return request2({
    url: '/store/sto/addStore',
    method: 'POST',
    data
  })
}
// 保存--编辑
export function editStore(data) {
  return request2({
    url: '/store/sto/editStore',
    method: 'POST',
    data
  })
}
// 编辑
export function updateStore(params) {
  return request2({
    url: '/store/sto/updateStore',
    method: 'get',
    params
  })
}
// 删除
export function delStore(params) {
  return request2({
    url: '/store/sto/delStore',
    method: 'DELETE',
    params
  })
}

export function queryPlatformName(params) {
  return request2({
    url: '/store/sto/queryPlatformName',
    method: 'get',
    params
  })
}
export function editConfig(data) {
  return request2({
    url: '/integration/integra/editIntegration',
    method: 'POST',
    data
  })
}
// 唯一码
export function checkOmsCode(params) {
  return request2({
    url: '/store/sto/checkOmsCode',
    method: 'get',
    params
  })
}

export function editFileName(data) {
  return request2({
    url: '/orderArchives/editFileName',
    method: 'POST',
    data
  })
}
//导入
export function importResultSet(data) {
  return request2({
    url: '/orderArchives/importResultSet',
    method: 'POST',
    data
  })
}
//条码表
//请求接口
export function getBarCodeTableList(data) {
  return request2({
    url: '/barcode/getBarCodeTableList',
    method: 'POST',
    data
  })
}
// 删除
export function delBarCodeTableList(data) {
  return request2({
    url: '/barcode/delBarCodeTableList',
    method: 'DELETE',
    data
  })
}
//产品名称
export function queryProductInfoByName(params) {
  return request2({
    url: '/barcode/queryProductInfoByName',
    method: 'get',
    params
  })
}
//编辑--保存
export function editBarCodeTableList(data) {
  return request2({
    url: '/barcode/editBarCodeTableList',
    method: 'PUT',
    data
  })
}
//商品条码--唯一
export function checkIsOnlyOne(params) {
  return request2({
    url: '/barcode/checkIsOnlyOne',
    method: 'get',
    params
  })
}
//编辑
export function getBarCodeTableListById(params) {
  return request2({
    url: '/barcode/getBarCodeTableListById',
    method: 'get',
    params
  })
}
//条码对照表
//请求接口
export function getBarCodeList(data) {
  return request2({
    url: '/barCodeComparison/getBarCodeList',
    method: 'POST',
    data
  })
}
//删除
export function delBarCode(data) {
  return request2({
    url: '/barCodeComparison/delBarCode',
    method: 'DELETE',
    data
  })
} 
//编辑
export function updateBarCodeEdit(params) {
  return request2({
    url: '/barCodeComparison/selectBarCodeById',
    method: 'get',
    params
  })
} 
//编辑保存
export function updateBarCode(params) {
  return request2({
    url: 'barCodeComparison/updateBarCode',
    method: 'PUT',
    params
  })
} 




