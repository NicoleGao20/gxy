import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
// import 'element-ui/lib/theme-chalk/index.css'
import './theme/index.css'
import locale from 'element-ui/lib/locale/lang/en' // lang i18n
import i18n from './lang' // Internationalization
// https://github.com/FEMessage/el-data-table 导入所需的包且全局注册相应组件和方法
import ElDataTable from '@/privatemodules/el-data-table'
import ElFormRenderer from '@femessage/el-form-renderer'
import axios from 'axios'
import basePagination from '@/components/basePagination'
import belleChooseBrand from '@/privatemodules/belle-choose-brand'
// import VueQrcode from '@chenfengyuan/vue-qrcode'

import '@/styles/index.less' // global css

import App from './App'
import store from './store'
import router from './router'

import '@/icons' // icon
import '@/permission' // permission control
import '@/styles/vue-draggable-resizable.less'
import '@/styles/icon.less'
import iconSvg from '@/components/SvgIcon'
import BlButton from '@/components/BlButton'
import '@/components/BelleForm'
import '@/components/BelleTable'
import request, { request2 } from '@/utils/request'
import humanInfo from '@/publicComponents/humanInfo'
import ElSelectAll from '@/privatemodules/el-select-all'
import {Encrypt} from '@/utils/AESUtils'

import Utils from './utils/utils.js'
import navs from './config/navs'

Vue.use(ElementUI, {
  locale,
  i18n: (key, value) => i18n.t(key, value)
})
Vue.component('human-info', humanInfo)
Vue.prototype.$ELEMENT = { size: 'small' }
Vue.component(iconSvg.name, iconSvg)
Vue.component('el-form-renderer', ElFormRenderer)
Vue.component('el-data-table', ElDataTable)
Vue.component('blButton', BlButton)
Vue.component('base-pagination', basePagination)
Vue.component('belle-choose-brand', belleChooseBrand)
// Vue.component(VueQrcode.name, VueQrcode)
Vue.component('el-select-all', ElSelectAll)
Vue.prototype.$utils = Utils
Vue.prototype.$axios = axios
Vue.prototype.$request = request
Vue.prototype.$request2 = request2
Vue.config.productionTip = true
Vue.prototype.$encrypt = Encrypt

const token = sessionStorage.getItem('token')
if (token) {
  store.dispatch('setToken', token)
}
let userInfo = sessionStorage.getItem('userInfo')
if (userInfo) {
  userInfo = JSON.parse(userInfo)
  store.commit('setUserInfo', userInfo)
  // 修改
  store.dispatch('add_Routes', navs)
}

new Vue({
  el: '#app',
  router,
  store,
  i18n,
  render: h => h(App)
})
