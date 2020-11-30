import { request2 } from '@/utils/request'

export function getRuleList() {
  return request2({
    url: '/integral/rule/queryThrIntegral',
    method: 'post'
  })
}

export function getOneRule(params) {
  return request2({
    url: '/integral/rule/queryIntegral',
    method: 'get',
    params
  })
}

export function getDiyRuleList(data) {
  return request2({
    url: '/integral/rule/queryAllintegral',
    method: 'post',
    data
  })
}

export function setEditIntegral(data) {
  return request2({
    url: '/integral/rule/editIntegral',
    method: 'post',
    data
  })
}

export function getTransaction(params) {
  return request2({
    url: '/integral/rule/queryTransaction',
    method: 'get',
    params
  })
}

export function updateTransaction(data) {
  return request2({
    url: '/integral/rule/updateTransaction',
    method: 'post',
    data
  })
}

export function addRule(data) {
  return request2({
    url: '/integral/rule/addIntegral',
    method: 'post',
    data
  })
}

export function queryAllProduct(data) {
  return request2({
    url: '/integral/rule/queryAllProduct',
    method: 'post',
    data
  })
}

export function querySelProduct(data) {
  return request2({
    url: '/integral/rule/querySelProduct',
    method: 'post',
    data
  })
}

export function queryNewIntegral(params) {
  return request2({
    url: '/integral/rule/queryNewIntegral',
    method: 'get',
    params
  })
}

export function editNewIntegral(data) {
  return request2({
    url: '/integral/rule/editNewIntegral',
    method: 'post',
    data
  })
}

