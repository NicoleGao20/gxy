import request from '@/utils/request'

/**
 * 通用分页场景相关列表
 */
export function getPageList(type, type2) {
  if (type2 != null) {
    return request({
      url: `/message/${type}/${type2}/page`,
      method: 'GET'
    })
  } else {
    return request({
      url: `/message/${type}/page`,
      method: 'GET'
    })
  }
}

/**
 * 通用获取相关列表
 */
export function getSceneList(type, id, enabled) {
  if (id != null) {
    return request({
      url: `/message/${type}/${id}`,
      method: 'GET'
    })
  } else if (enabled != null) {
    return request({
      url: `/message/${type}?isEnable=${enabled}`,
      method: 'GET'
    })
  } else {
    return request({
      url: `/message/${type}`,
      method: 'GET'
    })
  }
}

/**
 * 通过平台id查询业务模块,可过滤启用状态
 */
export function getModuleByPlatform(platformId, enabled) {
  if (enabled == null || typeof (enabled) === 'undefined') {
    return request({
      url: `/message/businessmodules?platformId=${platformId}`,
      method: 'GET'
    })
  } else {
    return request({
      url: `/message/businessmodules?platformId=${platformId}&isEnable=${enabled}`,
      method: 'GET'
    })
  }
}

/**
 * 通过模块id查询场景,可过滤启用状态
 */
export function getSceneByModule(moduleId, enabled) {
  if (enabled == null || typeof (enabled) === 'undefined') {
    return request({
      url: `/message/scenes?businessModuleId=${moduleId}`,
      method: 'GET'
    })
  } else {
    return request({
      url: `/message/scenes?businessModuleId=${moduleId}&isEnable=${enabled}`,
      method: 'GET'
    })
  }
}

/**
 * 通用编辑操作
 */
export function commonEdit(data, params, type) {
  return request({
    url: `/message/${type}/${params.id}`,
    method: 'PATCH',
    data: data
  })
}

/**
 * 通用添加操作
 */
export function commonAdd(data, params, type) {
  return request({
    url: `/message/${type}`,
    method: 'POST',
    data: data
  })
}

/**
 * 添加业务模块
 */
export function moduleAdd(data, params, type) {
  return request({
    url: `/message/${type}/${data.platformId}`,
    method: 'POST',
    data: data
  })
}

/**
 * 添加场景模块
 */
export function sceneAdd(data, params, type) {
  return request({
    url: `/message/${type}/${data.platformId}/${data.businessModuleId}`,
    method: 'POST',
    data: data
  })
}

/**
 * 启用
 */
export function setEnabled(params, type) {
  return request({
    url: `/message/${type}/${params.id}/enabled`,
    method: 'PUT'
  })
}

/**
 * 通用删除操作
 */
export function deleteRow(params, type) {
  return request({
    url: `/message/${type}/${params.id}`,
    method: 'DELETE'
  })
}

/**
 * 通用禁用操作
 */
export function setDisabled(params, type) {
  return request({
    url: `/message/${type}/${params.id}/disabled`,
    method: 'PUT'
  })
}

/**
 * 模板删除
 */
export function deleteTemplate(params, type) {
  return request({
    url: `/message/${type}`,
    method: 'DELETE',
    data: params
  })
}

/**
 *  获取品牌列表
 */
export function getBrandList() {
  return request({
    url: '/message/brands',
    method: 'GET'
  })
}

/**
 *  获取微信模板详情
 */
export function getWxTemplateDetail(params) {
  return request({
    url: `/message/templateWechats/${params.id}`,
    method: 'GET'
  })
}

/**
 *  同步(添加)微信模板详情
 */
export function addWxTemplateDetail(params) {
  return request({
    url: `/message/templateWechats/template`,
    method: 'POST',
    data: params
  })
}

/**
 *  同步(添加)微信模板详情-从qxclub同步
 */
export function addWxTemplateFormQxclub(params) {
  return request({
    url: `/message/templateWechats/template/syncFromQxclub`,
    method: 'POST',
    data: params
  })
}

/**
 *  获取参数信息
 */
export function getParamByGroupId(id) {
  return request({
    url: `/message/params/group/${id}/param`,
    method: 'GET'
  })
}

/**
 *  获取所有分组和参数
 */
export function getParamGroup(sceneId) {
  if (sceneId == null) {
    return request({
      url: `/message/params/groupAndParam`,
      method: 'GET'
    })
  } else {
    return request({
      url: `/message/params/groupAndParam/${sceneId}`,
      method: 'GET'
    })
  }
}

/**
 *  获取所有参数
 */
export function getAllParam() {
  return request({
    url: `/message/params`,
    method: 'GET'
  })
}

/**
 *  获取指定场景下的所有参数
 */
export function getSceneAllParam(sceneId) {
  if (sceneId == null) {
    return request({
      url: `/message/params`,
      method: 'GET'
    })
  } else {
    return request({
      url: `message/params/scenes/${sceneId}`,
      method: 'GET'
    })
  }
}

/**
 *  查询所有品牌短信可用签名
 */
export function getSmsSign(brandCode) {
  if (brandCode == null) {
    return request({
      url: `/message/smsSigns`,
      method: 'GET'
    })
  } else {
    return request({
      url: `/message/smsSigns?brandCode=${brandCode}`,
      method: 'GET'
    })
  }
}

/**
 *  添加短信模板
 */
export function addSmsTemplate(params) {
  return request({
    url: `/message/templateSmss/template`,
    method: 'POST',
    data: params
  })
}

/**
 *  获取短信模板详情和参数
 */
export function getSmsTemplateAndParam(id) {
  if (id != null) {
    // 单个查询
    return request({
      url: `/message/templateSmss/template/${id}`,
      method: 'GET'
    })
  } else {
    // 全部查询
    return request({
      url: `/message/templateSmss/queryTemplateList`,
      method: 'GET'
    })
  }
}

/**
 * 添加分组操作
 */
export function groupAdd(data) {
  return request({
    url: `/message/params/group`,
    method: 'POST',
    data: data
  })
}

/**
 * 更新分组操作
 */
export function groupUpdate(data) {
  return request({
    url: `/message/params/group/${data.id}`,
    method: 'POST',
    data: data
  })
}

/**
 * 添加参数操作
 */
export function paramAdd(data) {
  return request({
    url: `/message/params/addParam/${data.groupId}`,
    method: 'POST',
    data: data
  })
}

/**
 * 更新参数操作
 */
export function paramUpdate(data) {
  return request({
    url: `/message/params/${data.id}`,
    method: 'PATCH',
    data: data
  })
}

/**
 *  添加场景绑定
 */
export function addSceneConfig(params) {
  return request({
    url: `/message/sceneConfig/editSceneTemplateConfig`,
    method: 'POST',
    data: params
  })
}

/**
 *  添加app场景绑定
 */
export function addAppSceneConfig(params) {
  return request({
    url: `/message/sceneConfig/editSceneAppTemplateConfig`,
    method: 'POST',
    data: params
  })
}

/**
 *  编辑时查询场景配置详细信息
 */
export function getSceneTemplateConfig(sceneConfigId) {
  return request({
    url: `/message/sceneConfig/getSceneTemplateConfig/${sceneConfigId}`,
    method: 'GET'
  })
}

/**
 *  编辑时查询app场景配置详细信息
 */
export function getSceneAppTemplateConfig(sceneConfigId) {
  return request({
    url: `/message/sceneConfig/getSceneAppTemplateConfig/${sceneConfigId}`,
    method: 'GET'
  })
}

/**
 *  通过品牌获取微信模板和结构体
 */
export function getTemplateAndEditBean(brandCode) {
  return request({
    url: `/message/templateWechats/templateAndEditBean/${brandCode}`,
    method: 'GET'
  })
}

/**
 * 参数管理-查询
 */
export function getDictionaryList() {
  return request({
    url: '/message/params/paramManage',
    method: 'get'
  })
}

/**
 * 参数管理-新增
 */
export function createDictionary(data) {
  return request({
    url: '/message/params/paramManage',
    method: 'post',
    data
  })
}

/**
 * 参数管理-保存
 */
export function saveDictionary(data) {
  return request({
    url: `/message/params/paramManage/${data.id}`,
    method: 'put',
    data
  })
}

/**
 * 参数管理-删除
 */
export function delDictionary(data) {
  return request({
    url: `/message/params/paramManage/${data.isLeaf}/${data.id}`,
    method: 'delete'
  })
}

/**
 * 参数管理-上架
 */
export function setEnableDictionary(data) {
  return request({
    url: `/message/params/paramManage/${data.id}/enabled`,
    method: 'put'
  })
}

/**
 * 发送测试短信消息
 */
export function sendTestSmsMessage(data) {
  return request({
    url: `/message/template/sms/sendTestMessage`,
    method: 'post',
    data
  })
}

/**
 * 发送测试微信消息
 */
export function sendTestWechatPublicMessage(data) {
  return request({
    url: `/message/template/wechat/sendTestWechatPublicMessage`,
    method: 'post',
    data
  })
}

/**
 * 发送测试app push消息
 */
export function sendTestAppPushMessage(data) {
  return request({
    url: `/message/template/previewAppTemplateMessage`,
    method: 'post',
    data
  })
}

/**
 *  获取统计用发送模板信息
 */
export function getStatisticsSendTemplate(id) {
  return request({
    url: `/message/statistics/getSendTemplate?sendTemplateId=${id}`,
    method: 'GET'
  })
}

/**
 *  获取导出数据
 */
export function getExport(data) {
  return request({
    url: `/message/statistics/export`,
    method: 'post',
    data
  })
}

/**
 *  手机号获取设备号
 */
export function getDeviceId(data) {
  return request({
    // url: `/mock/messageInternal/template/getDeviceId`,
    url: `/messageInternal/template/getDeviceId?brandCode=${data.brandCode}&mobileList=${data.mobileList}`,
    method: 'get'
  })
}

/**
 *  手机号获取openId
 */
export function getOpenId(data) {
  return request({
    // url: `/mock/messageInternal/template/getOpenId`,
    url: `/messageInternal/template/getOpenId?brandCode=${data.brandCode}&mobileList=${data.mobileList}`,
    method: 'get'
  })
}

