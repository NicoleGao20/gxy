import { request2 } from '@/utils/request'

// --------------------------------- 等级规划 开始 ------------------------------------
/**
 * 获取等级规则列表
 * @param { brand_code } data
 */
export function getLevelList(data) {
  return request2({
    url: '/member/level/list',
    method: 'get',
    params: data
  })
}

/**
 * 根据等级规则id查询等级规则
 * @param { id } data
 */
export function getMemberLevel(data) {
  return request2({
    url: '/member/level/getMemberLevel',
    method: 'get',
    params: data
  })
}

/**
 * 查询等级规则列表
 * @param { id } data
 */
export function getReleaseList(data) {
  return request2({
    url: '/member/level/releaseList',
    method: 'get',
    params: data
  })
}

/**
 * 根据id更新等级规则
 * @param { info } data
 */
export function updateLevelInfo(data) {
  return request2({
    url: '/member/level/update',
    method: 'PUT',
    data
  })
}

/**
 * 新增等级规则版本接口
 * @param { info } data
 */
export function saveMemberLevel(data) {
  return request2({
    url: '/member/level/saveMemberLevel',
    method: 'POST',
    data
  })
}

/**
 * 根据id更新等级状态
 * @param { info } data
 */
export function updateLevelStatus(data) {
  return request2({
    url: '/member/level/enableLevelStatus',
    method: 'PUT',
    data
  })
}

/**
 * 校验等级名称
 * @param { data } data
 */
export function checkLevelName(data) {
  return request2({
    url: '/member/level/checkLevelName',
    method: 'get',
    params: data
  })
}

/**
 * 更新并重新计算所有会员等级
 * @param { data } data
 */
export function updateMemberAllByBrand(data) {
  return request2({
    url: '/member/level/updateMemberAllByBrand',
    method: 'put',
    data
  })
}

// --------------------------------- 等级规划 结束 ------------------------------------

// --------------------------------- 等级调整 开始 ------------------------------------

/**
 * 分页多条件查询会员档案
 * @param { info } data
 */
export function getPageList(data) {
  return request2({
    url: '/member/level/alter/pageList',
    method: 'post',
    data
  })
}

/**
 * 批量修改会员等级接口
 * @param {{validity_exist: string, member_ids: string, level_code: string, validity_end_date: string, level_alter_desc: string, validity_lasting: string, level_alter_method: default.methods.form.level_alter_method}} data
 */
export function batchUpdateMember(data) {
  return request2({
    url: '/member/level/alter/batchUpdateMember',
    method: 'put',
    data
  })
}

/**
 * 导入会员列表接口
 * @param { info } data
 */
export function importLevelExcel(data) {
  return request2({
    url: '/member/level/alter/importLevelExcel',
    method: 'put',
    data
  })
}

/**
 * 根据结果集批量修改会员等级
 * @param { info } data
 */
export function batchUpdateMemberResult(data) {
  return request2({
    url: '/member/level/alter/batchUpdateMemberResult',
    method: 'put',
    data
  })
}

// --------------------------------- 等级调整 结束 ------------------------------------

// --------------------------------- 等级发布 开始 ------------------------------------
/**
 * 根据品牌查询等级规则版本列表
 * @param { data } data
 */
export function getLevelVersionListPage(data) {
  return request2({
    url: '/member/level/getLevelVersionListPage',
    method: 'get',
    params: data
  })
}

/**
 * 根据id删除等级规则版本
 * @param { data } data
 */
export function deleteMemberLevel(data) {
  return request2({
    url: '/member/level/deleteMemberLevel',
    method: 'delete',
    params: data
  })
}

/**
 * 根据id发布等级
 * @param { data } data
 */
export function releaseMemberLevel(data) {
  return request2({
    url: '/member/level/releaseMemberLevel',
    method: 'put',
    data
  })
}
// --------------------------------- 等级发布 结束 ------------------------------------

// --------------------------------- 等级变更日志 开始 ------------------------------------
/**
 * 获取等级变更日志列表
 * @param { data } data
 */
export function getLevelAlterLogList(data) {
  return request2({
    url: '/member/level/alter/getLevelAlterLogList',
    method: 'post',
    data
  })
}
// --------------------------------- 等级变更日志 结束 ------------------------------------
