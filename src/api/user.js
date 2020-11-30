// pop
import request from '@/utils/request'

export function functions(data) {
  return request({
    url: '/users/functions',
    method: 'get',
    data
  })
}
