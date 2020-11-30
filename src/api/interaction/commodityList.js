import {request2} from '@/utils/request'
import { hex_md5 } from '@/utils/md5'

// 宝贝列表
export function queryByPage(params) {
  return request2({
    url: '/commodity/getCommodityList',
    method: 'post',
    data: {
      id: hex_md5(JSON.stringify(params)),
      sign: 'BTWVF7PZWCAEACZZZRST',
      timestamp: new Date().getTime(),
      body: params
    }
  })
}
export function getCommodityQueryBox(params) {
  return request2({
    url: '/commodity/getCommodityQueryBox',
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
export function delCommodity(params) {
  return request2({
    url: '/commodity/delCommodity' + params.id,
    method: 'delete',
    data: params
  })
}
// //brands//
// 获取单个产品详情
export function getDetail(params) {
  return request2({
    url: '/commodity/getCommodityById' + params.id,
    method: 'get',
  })
}


// 更新菜单信息
export function updataCommodity(params) {
  return request2({
    url: '/commodity/editCommodityInfoById',
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
export function addCommodity(params) {
  return request2({
    url: '/commodity/addCommodity',
    method: 'post',
    data: {
      id: hex_md5(JSON.stringify(params)),
      sign: 'BTWVF7PZWCAEACZZZRST',
      timestamp: new Date().getTime(),
      body: params
    }
  })
}
