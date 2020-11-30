import request from '@/utils/request'

/**
 * 获取单个手动控制功能
 */
export function getManualControlById(params) {
  return request({
    url: '/system/log/manualControlQueues/queuesParams',
    params
  })
}

/**
 * 执行手动控制功能
 */
export function executeManualControl(data) {
  return request({
    url: '/system/log/manualControlQueues/execute',
    method: 'POST',
    data
  })
}

/**
 * 获取微信跳转页面
 */
export function getWechatPage(params) {
  return request({
    url: '/system/log/manualControlQueues/wechatPage',
    params
  })
}

