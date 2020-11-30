// pop
import request from '@/utils/request'

export function operationsAndFeildsfunctions(data) {
  return request({
    url: '/users/functions/operationsAndFeilds/'+data.functionId,
    method: 'get',
  })
}
