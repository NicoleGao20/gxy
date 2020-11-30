import request from '@/utils/request'
import { hex_md5 } from '../utils/md5'

// 品牌列表
export function queryByPage(params) {
  return request({
    url: '/storeBrand/action/queryByPage',
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
    url: '/storeBrand/' + params.id,
    method: 'delete',
    data: params
  })
}
// //brands//
// 获取单个品牌详情
export function getBrandDetail(params) {
  return request({
    url: '/storeBrand/' + params.id,
    method: 'get',
  })
}


// 更新菜单信息
export function updataBrand(params) {
  return request({
    url: '/storeBrand/',
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
    url: '/storeBrand/',
    method: 'post',
    data: {
      id: hex_md5(JSON.stringify(params)),
      sign: 'BTWVF7PZWCAEACZZZRST',
      timestamp: new Date().getTime(),
      body: params
    }
  })
}
// 获取品牌列表
export function getBrandList(params) {
  return request({
    url: '/brands/action/queryList',
    method: 'post',
    data:{
      "id": "00cfd088ff190c6550e3c5ff47cfc34d",
      "sign": "BTWVF7PZWCAEACZZZRST",
      "timestamp": 1600937680458,
      "body": {
      "params": {}
      }
    }
  })
}

// 获取店铺列表
export function getAllStores(params) {
  return request({
    url: '/store/sto/queryAllStores',
    method: 'get',
  })
}
