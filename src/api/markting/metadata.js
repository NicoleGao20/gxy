import { request2 } from '@/utils/request'

export function getDictionaryList() {
  return request2({
    url: '/system/systemDicts',
    method: 'get'
  })
}

export function createDictionary(data) {
  return request2({
    url: '/system/systemDicts',
    method: 'post',
    data
  })
}

export function saveDictionary(data) {
  return request2({
    url: `/system/systemDicts/${data.id}`,
    method: 'put',
    data
  })
}

export function delDictionary(id) {
  return request2({
    url: `/system/systemDicts/${id}`,
    method: 'delete'
  })
}

export function sortDictionary(data) {
  return request2({
    url: '/system/systemDicts/sorting',
    method: 'put',
    data
  })
}
