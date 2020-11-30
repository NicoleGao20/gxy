// 导入组件，组件必须声明 name
import Component from './src'

// 为组件提供 install 安装方法，供按需引入
Component.install = function(Vue) {
  Vue.component(Component.name, Component)
}

if (typeof window !== 'undefined' && window.Vue) {
  Component.install(window.Vue)
}
// 默认导出组件
export default Component
