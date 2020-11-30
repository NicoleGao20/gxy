import request from '@/utils/request'
//查询验证人
export function queryDownloadVerifier(params) {
    return request({
      url: 'downloadMgt/queryDownloadVerifier',
      method: 'get',
      params
    })
  }
