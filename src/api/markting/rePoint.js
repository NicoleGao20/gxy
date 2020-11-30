import { request2 } from '@/utils/request'

export function queryAdjustList(data) {
  return request2({
    url: '/adjust/integral/queryAllAdjust',
    method: 'post',
    data
  })
}

export function editAdjust(data) {
  return request2({
    url: '/adjust/integral/editAdjust',
    method: 'post',
    data
  })
}

export function editManyAdjust(data) {
  return request2({
    url: '/adjust/integral/editManyAdjust',
    method: 'post',
    data
  })
}

export function editAllAdjust(data) {
  return request2({
    url: '/adjust/integral/editAllAdjust',
    method: 'post',
    data
  })
}

export function importExcel(data) {
  return request2({
    url: '/adjust/integral/importAdjustExcel',
    method: 'post',
    data
  })
}
