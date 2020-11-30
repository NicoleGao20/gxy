import request from '@/utils/request'
import { hex_md5 } from '../utils/md5'
const basurl='';
// 账号列表
export function queryByPage(params) {
  return request({
    url: '/users/action/queryByPage',
    method: 'post',
    data: {
      id: hex_md5(JSON.stringify(params)),
      sign: 'BTWVF7PZWCAEACZZZRST',
      timestamp: new Date().getTime(),
      body: params
    }
  })
}
// 查询品牌
export function queryBrandList(params) {
  return request({
    url: '/brands/action/queryList',
    method: 'post',
    data: {
      id: hex_md5(JSON.stringify(params)),
      sign: 'BTWVF7PZWCAEACZZZRST',
      timestamp: new Date().getTime(),
      body: params
    }
  })
}
//校验删除
export function querySensitiveOperationSet(params) {
  return request({
    url: '/security/querySensitiveOperationSet',
    method: 'get',
    data: {
      id: hex_md5(JSON.stringify(params)),
      sign: 'BTWVF7PZWCAEACZZZRST',
      timestamp: new Date().getTime(),
      body: params
    }
  })
}

// 删除账号信息
export function deleteEmploy(params) {
  return request({
    url: '/users/' + params.id,
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
export function setRole(params) {
  return request({
    url: '/users/roles/',
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
export function getEmployDetail(params) {
  return request({
    url: '/users/' + params.id,
    method: 'get',
    data: params
  })
}

// 更新账号信息
export function updataEmploy(params) {
  return request({
    url: '/users/',
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
export function addEmploy(params) {
  return request({
    url: '/users/',
    method: 'post',
    data: {
      id: hex_md5(JSON.stringify(params)),
      sign: 'BTWVF7PZWCAEACZZZRST',
      timestamp: new Date().getTime(),
      body: params
    }
  })
}

export function queryVerifierName(params) {
  return request({
    url:basurl+'/security/queryVerifierName',
    method: 'get',
    params
  })
}
//验证码
export function sendDownloadCheckMsg(params) {
  return request({
    url:basurl+'/downloadMgt/sendDownloadCheckMsg',
    method: 'get',
    params
  })
}
//验证验证码
export function checkVerificationCode(params) {
  return request({
    url:basurl+'/downloadMgt/checkVerificationCode',
    method: 'get',
    params
  })
}
