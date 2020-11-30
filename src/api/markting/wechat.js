import { request2 } from '@/utils/request'

// --------------------------------- 微信粉丝列表 开始 ------------------------------------

/**
 * 查询微信粉丝列表
 * @param { data } data
 */
export function queryAllDataBaseWeChatFansPaging(data) {
  return request2({
    url: 'wechatmanage/queryAllDataBaseWeChatFansPaging',
    method: 'get',
    params: data
  })
}

/**
 * 修改微信粉丝备注
 * @param { data } data
 */
export function editFansRemark(data) {
  return request2({
    url: '/wechatmanage/editFansRemark',
    method: 'post',
    data
  })
}

/**
 *  拉入微信粉丝黑名单
 * @param { data } data
 */
export function pullFansBlackList(data) {
  return request2({
    url: '/wechatmanage/pullFansBlackList',
    method: 'post',
    data
  })
}

/**
 *  请求黑名单列表
 * @param { data } data
 */
export function queryAllDataBaseWeChatBlackFansPageing(data) {
  return request2({
    url: '/wechatmanage/queryAllDataBaseWeChatBlackFansPageing',
    method: 'get',
    params: data
  })
}

/**
 *  解除微信黑名单
 * @param { data } data
 */
export function cancelFansBlack(data) {
  return request2({
    url: '/wechatmanage/cancelFansBlack',
    method: 'post',
    data
  })
}
// --------------------------------- 微信粉丝列表 结束 ------------------------------------

// --------------------------------- 内容管理 微信模板 开始 --------------------------------
/**
 * 数据库中获取素材管理微信模板列表
 * @param { data } data
 */
export function queryWeChatMaterialTemplate(data) {
  return request2({
    url: '/wechatmanage/queryWeChatMaterialTemplate',
    method: 'get',
    params: data
  })
}

/**
 * 数据库中获取素材管理微信模板列表分页
 * @param { data } data
 */
export function queryWeChatMaterialTemplatePaging(data) {
  return request2({
    url: '/wechatmanage/queryWeChatMaterialTemplatePaging',
    method: 'get',
    params: data
  })
}

/**
 *  删除素材管理微信模板消息
 * @param { data } data
 */
export function deleteWeChatMaterialTemplate(data) {
  return request2({
    url: '/wechatmanage/deleteWeChatMaterialTemplate',
    method: 'post',
    data
  })
}

/**
 *  获取素材微信模板消息参数
 * @param { data } data
 */
export function getTemplateParmas(data) {
  return request2({
    url: '/wechatmanage/getTemplateParmas',
    method: 'post',
    data
  })
}

// --------------------------------- 内容管理 微信模板 结束 --------------------------------

// --------------------------------- 内容管理 微信图文素材 开始 --------------------------------

/**
 * 数据库获取图文素材分页
 * @param { data } data
 */
export function queryImageTextMaterialPaging(data) {
  return request2({
    url: '/wechatmanage/queryImageTextMaterialPaging',
    method: 'get',
    params: data
  })
}

/**
 *  数据库获取图文素材列表
 * @param { data } data
 */
export function queryImageTextMaterialList(data) {
  return request2({
    url: '/wechatmanage/queryImageTextMaterialList',
    method: 'get',
    params: data
  })
}

// --------------------------------- 内容管理 微信图文素材 结束 --------------------------------

// --------------------------------- 私有化营销 微信模板消息 开始 ------------------------------

/**
 *  获取微信模板消息分页
 * @param { data } data
 */
export function queryWeChatTplMsg(data) {
  return request2({
    url: '/wechatmanage/queryWeChatTplMsg',
    method: 'get',
    params: data
  })
}

/**
 *  获取微信模板消息日志分页
 * @param { data } data
 */
export function queryWxTplmsgLogPaging(data) {
  return request2({
    url: '/wechatmanage/queryWxTplmsgLogPaging',
    method: 'get',
    params: data
  })
}

/**
 * 停止推送微信群发消息
 * @param { data } data
 */
export function stopWxTplmsg(data) {
  return request2({
    url: '/wechatmanage/stopWxTplmsg',
    method: 'get',
    params: data
  })
}

/**
 *  新增微信模板消息
 * @param { data } data
 */
export function insertWeChatTplMsg(data) {
  return request2({
    url: '/wechatmanage/insertWeChatTplMsg',
    method: 'post',
    data
  })
}

/**
 *  编辑微信模板消息
 * @param { data } data
 */
export function updateWeChatTplMsg(data) {
  return request2({
    url: '/wechatmanage/updateWeChatTplMsg',
    method: 'post',
    data
  })
}

/**
 *  微信模板消息详情
 * @param { data } data
 */
export function wxTplmsgDetails(data) {
  return request2({
    url: '/wechatmanage/wxTplmsgDetails',
    method: 'get',
    params: data
  })
}

// --------------------------------- 私有化营销 微信模板消息 结束 ------------------------------

// --------------------------------- 私有化营销 微信群发消息 开始 ------------------------------
/**
 *  获取微信群发消息分页
 * @param { data } data
 */
export function queryMassTextingPaging(data) {
  return request2({
    url: '/wechatmanage/queryMassTextingPaging',
    method: 'get',
    params: data
  })
}

/**
 *  微信群发信息日志分页
 * @param { data } data
 */
export function queryMassTextingLogPaging(data) {
  return request2({
    url: '/wechatmanage/queryMassTextingLogPaging',
    method: 'get',
    params: data
  })
}

/**
 *  新增微信群发信息
 * @param { data } data
 */
export function sendMassTexting(data) {
  return request2({
    url: '/wechatmanage/sendMassTexting',
    method: 'post',
    data: data
  })
}

/**
 *  编辑微信群发信息
 * @param { data } data
 */
export function updateMassTexting(data) {
  return request2({
    url: '/wechatmanage/updateMassTexting',
    method: 'post',
    data: data
  })
}

/**
 * 停止推送微信群发消息
 * @param { data } data
 */
export function stopWxMassTexting(data) {
  return request2({
    url: '/wechatmanage/stopWxMassTexting',
    method: 'get',
    params: data
  })
}

/**
 *  微信群发消息详情
 * @param { data } data
 */
export function wxMassTextingDetails(data) {
  return request2({
    url: '/wechatmanage/wxMassTextingDetails',
    method: 'get',
    params: data
  })
}
// --------------------------------- 私有化营销 微信群发消息 结束 ------------------------------

// ----------------- 私有化营销 微信群发消息/微信模板消息共用接口 开始------------------------------
/**
 *  查询判断任务名称
 * @param { data } data
 */
export function queryMsgName(data) {
  return request2({
    url: '/wechatmanage/queryMsgName',
    method: 'get',
    params: data
  })
}
// ----------------- 私有化营销 微信群发消息/微信模板消息共用接口 结束------------------------------
