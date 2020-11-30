import urlConfig from '@/config/config.js'
var defult_404_avata = require('@/assets/404_images/404_defult.png') // 表格默认图片
export const apiObj = {
  // 上传图片
  uploadOss: urlConfig.uploadUrl,
  defult_404_avata: defult_404_avata
}
export const storeImportant = {
  fileUrl: `${urlConfig.url}/store/sto/importExcel`
}
