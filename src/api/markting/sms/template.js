import { request2 } from '@/utils/request'

export function fetchList(query) {
  return request2({
    url: '/sms/template/list',
    method: 'get',
    params: query
  })
}

export function fetchTemplate() {
  return request2({
    url: '/sms/template/detail',
    method: 'get'
  })
}

export function createTemplate(data) {
  return request2({
    url: '/sms/template/add',
    method: 'post',
    data
  })
}

export function updateTemplate(data) {
  return request2({
    url: '/sms/template/update',
    method: 'post',
    data
  })
}

export function deleteTemplate(id) {
  return request2({
    url: '/sms/template/delete/' + id,
    method: 'post'
  })
}

