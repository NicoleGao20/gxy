import request from '@/utils/request'

/**
 * 获取表格jsonData
 * @param {*} data
 */
export function getJsonData(data) {
  return request({
    url: '/system/log/log_page/9ba7d159a48311ea8f0f0050568b3e34',
    method: 'get',
    params: data
  })
}
