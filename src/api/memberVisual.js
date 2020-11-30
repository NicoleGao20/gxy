import request from '@/utils/request'

/**
 * 获取可视化项目列表
 */
export function getMemberVisualList(data) {
  return request({
    url: '/system/memberVisual',
    method: 'GET',
    params: data
  })
}

/**
 * 获取堆栈列表
 */
export function getStackList() {
  return request({
    url: '/system/stackApplication/getStackList',
    method: 'GET'
  })
}
