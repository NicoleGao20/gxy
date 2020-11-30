import request from '@/utils/request'
import { ssoServer } from '@/utils/params'
import { hex_md5 } from '../utils/md5'

export function login(params) {
  return request({
    url: '/backendUsers/action/login',
    method: 'post',
    data: {
      id: hex_md5(params),
      sign: 'BTWVF7PZWCAEACZZZRST',
      timestamp: new Date().getTime(),
      body: params
    }
  })
}

export function backLogout(params) {
  return request({
    url: '/backendUsers/action/logout',
    method: 'post',
    data: {
      id: hex_md5(params),
      sign: 'BTWVF7PZWCAEACZZZRST',
      timestamp: new Date().getTime(),
      body: params
    }
  })
}

export function getUserBrands(params) {
  return request({
    url: `/system/saaspms/api/listMerchant`,
    params: params,
    defaults: { timeout: 100000 }
  })
}

export function getUserInfo(params) {
  return request({
    url: `/system/saaspms/api/sysUserInfoByLoginName`,
    params
  })
}

export function insertMenuList(params) {
  return request({
    url: `${ssoServer}/system/saaspms/api/insertMenuList`,
    method: 'post',
    data: params
  })
}
