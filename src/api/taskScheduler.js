import request from '@/utils/request'

/**
 * 发送执行定时任务请求
 */
export function sendInstantRunRequest(params) {
  return request({
    url: '/system/ljob/send/request_ljob',
    params
  })
}

/**
 * 发送定时任务自定义执行请求
 */
export function sendInstantRunCustomRequest(params) {
  return request({
    url: '/system/ljob/send/custom_ljob',
    params
  })
}

/**
 * 一键启动所有定时任务
 */
export function startAllInstantTasks(params) {
  return request({
    url: '/system/ljob/startup/all_ljobs',
    // method: 'post',
    params
  })
}

/**
 * 一键启动蓝环境定时任务
 */
export function startBlueInstantTasks(params) {
  return request({
    url: '/system/ljob/startup/blue_ljobs',
    // method: 'post',
    params
  })
}

/**
 * 一键启动绿环境定时任务
 */
export function startGreenInstantTasks(params) {
  return request({
    url: '/system/ljob/startup/green_ljobs',
    // method: 'post',
    params
  })
}

/**
 * 一键关闭蓝环境定时任务
 */
export function stopBlueInstantTasks(params) {
  return request({
    url: '/system/ljob/stop/blue_ljobs',
    // method: 'post',
    params
  })
}

/**
 * 一键关闭绿环境定时任务
 */
export function stopGreenInstantTasks(params) {
  return request({
    url: '/system/ljob/stop/green_ljobs',
    // method: 'post',
    params
  })
}

/**
 * 发送变更定时任务状态请求: 启动 || 关闭
 */
export function updateInstantTaskStatus(params) {
  return request({
    url: '/system/ljob/send/status_ljob',
    // method: 'post',
    params
  })
}
