import {request2} from '@/utils/request'
import { hex_md5 } from '@/utils/md5'

// 宝贝列表
export function queryByPage(params) {
  return request2({
    url: '/babyGoods/selectBabyPage',
    method: 'post',
    data: {
      id: hex_md5(JSON.stringify(params)),
      sign: 'BTWVF7PZWCAEACZZZRST',
      timestamp: new Date().getTime(),
      body: params
    }
  })
}
export function queryPlatformList(params) {
  return request2({
    url: '/babyGoods/queryAllPlatformNameList',
    method: 'get',
    // data: {
    //   // id: hex_md5(JSON.stringify(params)),
    //   // sign: 'BTWVF7PZWCAEACZZZRST',
    //   // timestamp: new Date().getTime(),
    //   // body: params
    // }
  })
}
// 删除菜单信息
export function deleteBrand(params) {
  return request2({
    url: '/brands/' + params.id,
    method: 'delete',
    data: params
  })
}
// //brands//
// 获取单个品牌详情
export function getBrandDetail(params) {
  return request2({
    url: '/brands/' + params.id,
    method: 'get',
  })
}


// 更新菜单信息
export function updataBrand(params) {
  return request2({
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
  return request2({
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
