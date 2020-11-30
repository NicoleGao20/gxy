import store from '@/store'

/**
 * @description 用户角色权限
 * @param {Array} value
 * @returns {Boolean}
 * @example see @/views/decorate/index.vue
 */
export default function checkPermission000(value) {
  if (value && value instanceof Array && value.length > 0) {
    const roles = store.getters && store.getters.roles
    const permissionRoles = value

    const hasPermission = roles.some(role => {
      return permissionRoles.includes(role)
    })

    if (!hasPermission) {
      return false
    }
    return true
  } else {
    console.error(`need roles! Like v-permission="['admin','editor']"`)
    return false
  }
}

/**
 * @description 按钮权限
 * @param {Object} value
 * @returns {Boolean}
 */
export function checkPermission(component, button) {
  if (component && button) {
    const permissions = store.getters && store.getters.permissions
    if (typeof button === 'string') {
      return permissions[component] && permissions[component][button] === '1'
    }
    if (Array.isArray(button)) {
      const newButtons = []
      button.map(button => {
        if (permissions[component] && Object.keys(permissions[component]).includes(button.key)) {
          newButtons.push(button)
        }
      })
      // console.log('newButtons', newButtons)
      return newButtons
    }
  } else {
    console.error('need button permissions!')
    return false
  }
}
