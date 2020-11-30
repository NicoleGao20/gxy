import request, { requestLogin } from '@/utils/request'
import { hex_md5 } from '../utils/md5'
import Cookies from 'js-cookie'

export function login(params) {
  return requestLogin({
    url: '/users/action/login',
    method: 'post',
    data: {
      id: hex_md5(params),
      sign: 'BTWVF7PZWCAEACZZZRST',
      timestamp: new Date().getTime(),
      body: params
    }
  })
}

export function userLogout(params) {
  return requestLogin({
    url: '/users/action/logout',
    method: 'post',
    data: {
      id: hex_md5(params),
      sign: 'BTWVF7PZWCAEACZZZRST',
      timestamp: new Date().getTime(),
      body: params
    }
  })
}

export function logout() {
  return request({
    url: '/user/logout',
    method: 'post'
  })
}

export function getUserBrands(params) {
  return request({
    url: `/system/saaspms/api/listMerchant`,
    params: {
      ...params,
      bizCode: 'e785ec8aa12d11e991cf000c29'
    }
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
    url: `/system/saaspms/api/insertMenuList`,
    method: 'post',
    data: params
  })
}

// router list
export function V2(params, platformCode) {
  // let platformCodes=platformCode ? platformCode:Cookies.get('platformCode')
  return request({
    url: '/users/functions/V2/' + platformCode,
    method: 'get',
    params
  })
}

// router list
export function navBrands() {
  // let platformCodes=platformCode ? platformCode:Cookies.get('platformCode')
  return request({
    url: '/users/brands/',
    method: 'get'
  })
}

// 是否二次验证
export function secondVerification() {
  // let platformCodes=platformCode ? platformCode:Cookies.get('platformCode')
  return request({
    url: '/security/queryLoginPlanSet',
    method: 'get'
  })
}
// 获取登陆验证码
export function sendVerificationCode(params) {
  return requestLogin({
    url: '/users/action/sendVerificationCode',
    method: 'post',
    data: {
      id: hex_md5(params),
      sign: 'BTWVF7PZWCAEACZZZRST',
      timestamp: new Date().getTime(),
      body: params
    }
  })
}
