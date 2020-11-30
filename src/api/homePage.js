import request from '@/utils/request'
/**
 * 品牌标签池列表
 */
export function getPlatformList(data) {
  return request({
    url:'/users/platforms',
    method: 'GET',
  })
}
  