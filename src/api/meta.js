import request from '@/utils/request'

/**
 * 获取字段表格数据
 */
export function getMetafieldData(params) {
  return request({
    url: '/system-center/metadataManage/column/page',
    params
  })
}

export function gettry(data) {
  return request({
    url: '/metadataManage/metadataParse',
    method: 'get',
    params: data
  })
}
/**
 * 获取元数据枚举表格
 */
export function getMetaenumData(params) {
  return request({
    url: '/system-center/metadataManage/enum/page',
    params
  })
}

/**
 * 获取元数据表数据
 */
export function getMetaformData(params) {
  return request({
    url: '/system-center/metadataManage/table/page',
    params
  })
}
