import request from '@/utils/request'
import { hex_md5 } from '../utils/md5'

// 平台列表
export function queryByPage(params) {
  return request({
    url: '/platforms/action/queryByPage',
    method: 'post',
    data: {
      id: hex_md5(JSON.stringify(params)),
      sign: 'BTWVF7PZWCAEACZZZRST',
      timestamp: new Date().getTime(),
      body: params
    }
  })
}

// 删除账号信息
export function deletePlatform(params) {
  return request({
    url: '/platforms/' + params.id,
    method: 'delete',
    data: params
  })
}
// /users/
// 获取账号信息
export function getEmploy(params) {
  return request({
    url: '/users/' + params,
    method: 'get',
    data: params
  })
}

// 挂载角色权限
export function setPlatforms(params) {
  return request({
    url: '/platforms/roles/',
    method: 'post',
    data: {
      id: hex_md5(JSON.stringify(params)),
      sign: 'BTWVF7PZWCAEACZZZRST',
      timestamp: new Date().getTime(),
      body: params
    }
  })
}

/**
 * details about information
 */
export function getPlatformsDetail(params) {
  return request({
    url: '/platforms/' + params.id,
    method: 'get',
    data: params
  })
}

// 更新账号信息
export function updataPlatforms(params) {
  return request({
    url: '/platforms/',
    method: 'PUT',
    data: {
      id: hex_md5(JSON.stringify(params)),
      sign: 'BTWVF7PZWCAEACZZZRST',
      timestamp: new Date().getTime(),
      body: params
    }
  })
}

// 新增账号信息
export function addPlatforms(params) {
  return request({
    url: '/platforms/',
    method: 'post',
    data: {
      id: hex_md5(JSON.stringify(params)),
      sign: 'BTWVF7PZWCAEACZZZRST',
      timestamp: new Date().getTime(),
      body: params
    }
  })
}
