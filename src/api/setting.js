import request from '@/utils/request'

// 获取主题设置
export function getThemeSetting(params) {
  return request({
    url: `/system/themeSettings`,
    params
  })
}

// 更新主题设置
export function updateThemeSetting(data) {
  return request({
    url: `/system/themeSettings/settings`,
    method: 'POST',
    data
  })
}
