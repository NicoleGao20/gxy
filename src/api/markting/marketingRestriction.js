import { request2 } from '@/utils/request'

export function getList(params) {
  return request2({
    url: '/smsList/pageList',
    params
  })
}

export function addSmsList(data) {
  return request2({
    url: '/smsList/addSmsList',
    method:'POST',
    data
  })
}

export function importSmsList(data) {
  return request2({
    url: '/smsList/importSmsList',
    method:'POST',
    data
  })
}


export function delSmsList(params) {
  return request2({
    url: '/smsList/delSmsList',
    method:'DELETE',
    params
  })
}

export function listAll(params) {
  return request2({
    url: '/smsHarass/listAll',
    params
  })
}

export function updateValue(data) {
  return request2({
    url: '/smsHarass/updateValue',
    method:'PUT',
    data
  })
}
