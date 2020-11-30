import {request2} from '@/utils/request'

export function fetchSendLogList(query) {
  return request2({
    url: '/email/sendlog/list',
    method: 'get',
    params: query
  })
}

export function sendEmail(data) {
  return request2({
    url: '/email/send/massSendEmailByCode',
    method: 'post',
    data
  })
}

export function deleteSendlog(id) {
  return request2({
    url: '/email/sendlog/delete/' + id,
    method: 'post'
  })
}

export function retrySend(ids) {
  return request2({
    url: '/email/sendlog/retrySend',
    method: 'post',
    data: { ids: ids }
  })
}
