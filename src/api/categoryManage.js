import request from '@/utils/request'
import { hex_md5 } from '../utils/md5'

// 平台列表
export function queryByPage(params) {
  return request({
    url: '/functions/action/queryByPage ',
    method: 'post',
    data: {
      id: hex_md5(JSON.stringify(params)),
      sign: 'BTWVF7PZWCAEACZZZRST',
      timestamp: new Date().getTime(),
      body: params
    }
  })
}
// 平台列表
export function platforms(params) {
  return request({
    url:'/users/platforms',
    method: 'GET',
  })
}
// 删除菜单信息
export function deleteMenu(params) {
  return request({
    url: '/functions/' + params.id,
    method: 'delete',
    data: params
  })
}
// /users/
// 获取单个菜单详情
export function getMenuDetail(params) {
  return request({
    url: '/functions/' + params.id,
    method: 'get',
  })
}

export function getMenuList(data) {
  return request({
    url: '/functions/action/queryList',
    method: 'post',
    data: {
      id: hex_md5(JSON.stringify(data)),
      sign: 'BTWVF7PZWCAEACZZZRST',
      timestamp: new Date().getTime(),
      body: {
        "params": {"functionType": data.functionTypeId,'platformCode':data.platformCode}
      }
    }
  })
}

// 更新菜单信息
export function updataMenu(params) {
  return request({
    url: '/functions/',
    method: 'PUT',
    data: {
      id: hex_md5(JSON.stringify(params)),
      sign: 'BTWVF7PZWCAEACZZZRST',
      timestamp: new Date().getTime(),
      body: params
    }
  })
}

// 新增菜单信息
export function addMenu(params) {
  return request({
    url: '/functions/',
    method: 'post',
    data: {
      id: hex_md5(JSON.stringify(params)),
      sign: 'BTWVF7PZWCAEACZZZRST',
      timestamp: new Date().getTime(),
      body: params
    }
  })
}
