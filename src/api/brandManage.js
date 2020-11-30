import request from '@/utils/request'
import { hex_md5 } from '../utils/md5'

// 品牌列表
export function queryByPage(params) {
  return request({
    url: '/brands/action/queryByPage',
    method: 'post',
    data: {
      id: hex_md5(JSON.stringify(params)),
      sign: 'BTWVF7PZWCAEACZZZRST',
      timestamp: new Date().getTime(),
      body: params
    }
  })
}
// 删除菜单信息
export function deleteBrand(params) {
  return request({
    url: '/brands/' + params.id,
    method: 'delete',
    data: params
  })
}
// //brands//
// 获取单个品牌详情
export function getBrandDetail(params) {
  return request({
    url: '/brands/' + params.id,
    method: 'get',
  })
}


// 更新菜单信息
export function updataBrand(params) {
  return request({
    url: '/brands/',
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
export function addBrand(params) {
  return request({
    url: '/brands/',
    method: 'post',
    data: {
      id: hex_md5(JSON.stringify(params)),
      sign: 'BTWVF7PZWCAEACZZZRST',
      timestamp: new Date().getTime(),
      body: params
    }
  })
}
