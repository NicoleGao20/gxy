import { request2 } from '@/utils/request'


export function queryTemplateByPage(params) {
  return request2({
    url: '/smsTemplate/queryByPage',
    params
  })
}


export function queryTemplateById(params) {
  return request2({
    url: '/smsTemplate/',
    params
  })
}

export function addTemplate(data) {
  return request2({
    url: '/smsTemplate/',
    method: 'POST',
    data
  })
}

export function editTemplate(data) {
  return request2({
    url: '/smsTemplate/',
    method: 'PUT',
    data
  })
}

export function deleteTemplate(params) {
  return request2({
    url: '/smsTemplate/',
    method: 'DELETE',
    params
  })
}

export function querySMSLog(params) {
  return request2({
    url: '/smsLog/pageList',
    params
  })
}

export function querySMSSign(params) {
  return request2({
    url: '/smsSign/queryByPage',
    params
  })
}

export function querySMSSignById(params) {
  return request2({
    url: '/smsSign/',
    params
  })
}

export function addSMSSign(data) {
  return request2({
    url: '/smsSign/',
    method:'POST',
    data
  })
}

export function editSMSSign(data) {
  return request2({
    url: '/smsSign/',
    method:'PUT',
    data
  })
}

export function deleteSMSSign(params) {
  return request2({
    url: '/smsSign/',
    method:'DELETE',
    params
  })
}

export function setDefault(data) {
  return request2({
    url: '/smsSign/setDefault',
    method:'POST',
    data
  })
}

export function queryParam() {
  return request2({
    url: '/param/queryParam'
  })
}

export function smsFeedBackList(params) {
  return request2({
    url: '/smsFeedBack/pageList',
    params
  })
}

export function addSmsBlacklist(data) {
  return request2({
    url: '/smsFeedBack/addSmsBlacklist',
    method:'POST',
    data
  })
}

export function queryAllTemplate(params) {
  return request2({
    url: '/smsTemplate/list',
    params
  })
}

export function queryAllSign(params) {
  return request2({
    url: '/smsSign/list',
    params
  })
}

export function smsGroupPageList(params) {
  return request2({
    url: '/smsMass/pageList',
    params
  })
}


export function exportExcel(data) {
  return request2({
    url: '/smsFeedBack/exportExcel',
    method:'POST',
    data
  })
}

export function checkBlack(data) {
  return request2({
    url: '/orderArchives/checkBlackList',
    method: 'POST',
    data
  })
}

export function addSmsTemplateGroup(data) {
  return request2({
    url: '/smsMass/groupSms',
    method: 'POST',
    data
  })
}

export function getOneSmsGroupById(params) {
  return request2({
    url: '/smsMass/getOneById',
    params
  })
}

export function stopSmsMassByXxlId(data) {
  return request2({
    url: '/smsMass/stopSmsMassByXxlId',
    method:'POST',
    data
  })
}

export function updateSmsById(data) {
  return request2({
    url: '/smsMass/updateById',
    method:'PUT',
    data
  })
}

export function sendTest(data) {
  return request2({
    url: '/smsMass/sendTest',
    method:'POST',
    data
  })
}
