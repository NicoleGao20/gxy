/**
 * Created by jiachenpan on 16/11/18.
 */

export function isvalidUsername(str) {
  // const valid_map = ['admin', 'editor']
  // return valid_map.indexOf(str.trim()) >= 0
  const reg = /^[a-zA-Z0-9]\w{3,15}$/
  return reg.test(str)
}

export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

export function validatePhoneNumber(val) {
  const reg = /^\d{3}-\d{7,8}|\d{4}-\d{7,8}$/
  return reg.test(val)
}
export function codeNumber(value) {
  const reg = /^[+-]?(0|([1-9]\d*))(\.\d+)?$/g
  if(!reg.test(value)){
    return  true
  }
}
export function isvalidPassword(str) {
  // const valid_map = ['ndfM>zkw27flKbb']
  // return valid_map.indexOf(str.trim()) >= 0
  return true
}
