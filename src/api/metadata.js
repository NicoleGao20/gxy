import request from '@/utils/request'

export function getDictionaryList() {
  return request({
    url: '/system/systemDicts',
    method: 'get'
  })
}

export function createDictionary(data) {
  return request({
    url: '/system/systemDicts',
    method: 'post',
    data
  })
}

export function saveDictionary(data) {
  return request({
    url: `/system/systemDicts/${data.id}`,
    method: 'put',
    data
  })
}

export function delDictionary(id) {
  return request({
    url: `/system/systemDicts/${id}`,
    method: 'delete'
  })
}

export function sortDictionary(data) {
  return request({
    url: '/system/systemDicts/sorting',
    method: 'put',
    data
  })
}
