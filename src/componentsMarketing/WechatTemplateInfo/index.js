// 导入组件，组件必须声明 name
import component from './src'

// 为组件提供 install 安装方法，供按需引入
component.install = function(Vue) {
  Vue.component(component.name, component)
}

if (typeof window !== 'undefined' && window.Vue) {
  component.install(window.Vue)
}
// 默认导出组件
export default component
