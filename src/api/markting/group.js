import { request2 } from '@/utils/request'
// import { ssoServer } from '@/utils/params'

export function getGrupList(params) {
  return request2({
    url: `/labelGroup/memberLabel/group/getGroupListByCon`,
    params
  })
}
