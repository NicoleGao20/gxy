import { request2 } from '@/utils/request'

export function queryAllLog(data) {
  return request2({
    url: '/adjust/integral/queryAllLog',
    method: 'post',
    data
  })
}

export function queryPlatformName() {
  return request2({
    url: '/store/sto/queryPlatformName'
  })
}

