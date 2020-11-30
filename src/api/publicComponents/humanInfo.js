import request from '@/utils/request'
const basurl='';
/**
 * details about information
 */
export function getEmployDetail(params) {
  return request({
    url: '/users/' + params.id,
    method: 'get',
    data: params
  })
}

 