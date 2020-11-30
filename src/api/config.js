import request from '@/utils/request'
import { hex_md5 } from '../utils/md5'

/**
 * 网站基本信息保存
 */
export function addWebSiteInfo(params) {
  return request({
    url: '/users/addWebSiteInfo',
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
 * 网站基本信息获取
 */
export function getWebsiteInfo(data) {
  return request({
    url: '/users/getWebsiteInfo',
    method: 'get',
    params: data
  })
}

/**
 * 网站基本信息编辑
 */
export function editWebSiteInfo(params) {
  return request({
    url: '/users/editWebSiteInfo',
    method: 'post',
    data: {
      id: hex_md5(JSON.stringify(params)),
      sign: 'BTWVF7PZWCAEACZZZRST',
      timestamp: new Date().getTime(),
      body: params
    }
  })
}
