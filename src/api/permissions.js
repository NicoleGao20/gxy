import request from '@/utils/request'
// import { hex_md5 } from '../../utils/md5'
import { hex_md5 } from '../utils/md5'
// import Cookies from 'js-cookie'
// 分页查询列表
export function queryByPage(params) {
  return request({
    url: '/permissions/role/queryByPage',
    method: 'post',
    data: {
      id: hex_md5(params),
      sign: 'BTWVF7PZWCAEACZZZRST',
      timestamp: new Date().getTime(),
      body: params
    }
  })
}

// 获取角色权限
export function checkFunction(params,platformCode) {
  return request({
    url: '/permissions/role/checkFunction/' + params.id+'/'+platformCode,
    // url: '/permissions/role/checkFunction/' + params.id+'/'+Cookies.get('platformCode'),
    method: 'get'
  })
}

// 获取角色 /permissions/role/
export function getRole(params) {
  return request({
    url: '/permissions/role/' + params.id,
    method: 'get'
  })
}

// 查询角色 /permissions/role/
export function postRole(params) {
  return request({
    url: '/permissions/role/',
    method: 'post',
    data: {
      id: hex_md5(params),
      sign: 'BTWVF7PZWCAEACZZZRST',
      timestamp: new Date().getTime(),
      body: params
    }
  })
}
// 修改角色
export function putRole(params) {
  return request({
    url: '/permissions/role/',
    method: 'put',
    data: {
      id: hex_md5(params),
      sign: 'BTWVF7PZWCAEACZZZRST',
      timestamp: new Date().getTime(),
      body: params
    }
  })
}

// 删除 角色
export function deleteRole(params) {
  return request({
    url: '/users/roles/' + params.id,
    method: 'delete',
  })
}
// 查询单个菜单权限数据
export function getSingleMenuJurisdictionData(parId,id) {
  return request({
    url: `/permissions/role/${parId}/functionFile/${id}`,
    method: 'get',
  })
}
// 获取数据权限规则名称
export function filterParamQueryList(params) {
  return request({
    url: '/permissions/role/filterParamQueryList',
    method: 'post',
    data: {
      id: hex_md5(params),
      sign: 'BTWVF7PZWCAEACZZZRST',
      timestamp: new Date().getTime(),
      body: params
    }
  })
}

// 配置权限
export function permission(params) {
  return request({
    url: '/permissions/role/permission',
    method: 'post',
    data: {
      id: hex_md5(params),
      sign: 'BTWVF7PZWCAEACZZZRST',
      timestamp: new Date().getTime(),
      body: params
    }
  })
}

// 获取角色权限 ,已选择的权限选择显示
export function getFunction(params,platformCode) {
  // let platformCodes=platformCode ? platformCode:Cookies.get('platformCode')
  return request({
    url: '/permissions/role/function/' + params.id+'/'+ platformCode,
    method: 'get'
  })
}

// 批量获取功能动作，字段
export function getActionsAndOperationsByBatch(params) {
  return request({
    url: '/users/functions/getActionsAndOperationsByBatch',
    method: 'post',
    data: {
      id: hex_md5(JSON.stringify(params)),
      sign: 'BTWVF7PZWCAEACZZZRST',
      timestamp: new Date().getTime(),
      body: params
    }
  })
}

// 活动
export function auditRejected(params) {
  return request({
    url: '/sendCouponActivity/action/auditRejected',
    method: 'post',
    data: params
  })
}
export function auditPass(params) {
  return request({
    url: '/sendCouponActivity/action/auditPass',
    method: 'post',
    data: params
  })
}

// 注册远程接口
export function functionFieldCheck(params, id) {
  return request({
    url: '/permissions/role/' + id + '/functionFieldCheck/query',
    method: 'post',
    data: params
  })
}

export function employee_modifyPassword(params){
  return request({
    url: '/users/action/modifyPassword',
    method: 'post',
    data: {
      id: hex_md5(JSON.stringify(params)),
      sign: 'BTWVF7PZWCAEACZZZRST',
      timestamp: new Date().getTime(),
      body: params
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


//解除锁定
export function unlockAccount(params){
  return request({
    url: '/users/action/unlockAccount',
    method: 'post',
    data: {
      id: hex_md5(JSON.stringify(params)),
      sign: 'BTWVF7PZWCAEACZZZRST',
      timestamp: new Date().getTime(),
      body: params
    }
  })
}