import { request2 } from '@/utils/request'

/**
 * @param { queryObj } data
 */
export function getAdvertisingList(data) {
  return request2({
    url: '/advertising/getAdvertisingList',
    method: 'get',
    params: data
  })
}

/**
 * @param { postData } data
 */
export function insertAdvertising(data) {
  return request2({
    url: '/advertising/insertAdvertising',
    method: 'post',
    params: data
  })
}

/**
 * @param { info } data
 */
export function updateAdvertising(data) {
  return request2({
    url: '/advertising/updateAdvertising',
    method: 'put',
    params: data
  })
}
