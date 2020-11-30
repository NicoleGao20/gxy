import { request2 } from '@/utils/request'

// 获取装修左侧组件
export function getDecorateComponents(brands) {
  return request2({
    url: '/system/component/list',
    data: {
      brands
    }
  })
}

// --------------------------- 布局模版 ---------------------------

// 获取装修布局模版列表
export function getDecorateSample(type) {
  return request2({
    url: '/system/template/page?pageNum=1&pageSize=100',
    method: 'get',
    params: {
      type
    }
  })
}

// 删除装修布局模版
export async function deleteSamplePlate(id) {
  return request2({
    url: `/system/template/${id}`,
    method: 'delete'
  })
}
// 新增装修布局模版
export async function addSamplePlate(data) {
  return request2({
    url: `/system/template/add`,
    method: 'post',
    data: data
  })
}

// 修改装修布局模版
export async function changeSamplePlate(data) {
  return request2({
    url: `/system/template/${data.templateId}`,
    method: 'PATCH',
    data: data
  })
}

// 获取装修布局模版内容
export async function getLayoutTemplateDetail(id) {
  return request2({
    url: `/system/template/${id}`
  })
}

// --------------------------- 管理页系统页 ---------------------------

// 获取装修内容
export async function getDecorateDetail(id) {
  return request2({
    url: `/system/page/${id}`
  })
}

// 更新装修内容
export async function updateDecorate(data) {
  return request2({
    url: `/system/page/${data.id}`,
    method: 'PATCH',
    data
  })
}

// 获取装修页详情
export async function getPageDetail(id) {
  return request2({
    url: `/system/page/${id}`
  })
}

// 更新装修页内容
export async function updatePage(data) {
  return request2({
    url: `/system/page/${data.id}`,
    method: 'PATCH',
    data
  })
}

// 获取装修系统页列表
export async function getSystemPageList(params) {
  return request2({
    url: `/system/page/systemPage?type=system`,
    params
  })
}

// 新建装修系统页
export async function createSystemPage(data) {
  return request2({
    url: `/system/page/add`,
    method: 'POST',
    data
  })
}

// 删除装修系统页
export async function deleteSystemPage(id) {
  return request2({
    url: `/system/page/${id}`,
    method: 'DELETE'
  })
}

// --------------------------- 数据字典类型 ---------------------------

// 获取字典类型数据
export async function getDataDictionaries(data) {
  return request2({
    url: `/system/systemDicts/allChild`,
    method: 'get',
    params: {
      value: data
    }
  })
}

// --------------------------- 图文列表 ---------------------------

// 获取装修图文列表数据源列表
export async function getDecorateDataTypes() {
  return request2({
    url: `/api/datasources/typeList`
  })
}

// 获取装修图文列表数据源详情数据
export async function getDecorateProductList(params) {
  return request2({
    // url: `/system/product/page`,
    url: `/memberCenter/getModuleData`,
    params
  })
}

// --------------------------- 装修组件 ---------------------------

// 获取自定义装修组件列表
export async function getDecorateComponentList(type) {
  return request2({
    url: `/system/component/list${type ? '?type=' + type : ''}`,
    method: 'get'
  })
}

// 组件编辑接口
export async function getDecorateComponentEdit(data) {
  console.log(data.id)
  return request2({
    url: `/system/component/${data.id}`,
    method: 'PATCH',
    data: data
  })
}
// 组件编辑添加接口
export async function getDecorateComponentAdd(data) {
  return request2({
    url: `/system/component/add`,
    method: 'post',
    data: data
  })
}

// 组件编辑删除接口
export async function getDecorateComponentDelete(id) {
  return request2({
    url: `/system/component/${id}`,
    method: 'delete'
  })
}
// 页面管理 复制接口
export async function getDecorateManageCopy(data) {
  return request2({
    url: `/system/page/copy`,
    method: 'post',
    data: data
  })
}
