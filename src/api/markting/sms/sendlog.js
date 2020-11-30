import { request2 } from '@/utils/request'

export function fetchList(query) {
  return request2({
    url: '/sms/sendlog/list',
    method: 'get',
    params: query
  })
}

export function sendMsg(data) {
  return request2({
    url: 'sms/send/massSendSmsByCode',
    method: 'post',
    data
  })
}

export function deleteSendlog(id) {
  return request2({
    url: '/sms/sendlog/delete/' + id,
    method: 'post'
  })
}

export function retrySend(ids) {
  return request2({
    url: '/sms/sendlog/retrySend',
    method: 'post',
    data: { ids: ids }
  })
}
