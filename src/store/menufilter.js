/* eslint-disable prettier/prettier */
// import store from './index'
import { lazy } from './lazyLoading'
// 要重新遍历一下，是因为，通常我们动态路由的时候，
// 是获取服务端数据，这个component属性是一个字符串转化成组件
// generaMenu(routers, data);

export const generaMenu = function(routers, data) {
  data.forEach((item) => {
    if (item.isNav !== false && item.isAuth) {
      // item.title = store.getters.getLangMsg[item.title]
      const menu = Object.assign({}, item)
      menu.component = lazy(menu.file)
      menu.meta = {
        auth: true,
        title: item.title,
        keepAlive: item.keepAlive === true,
        icon: item.icon ? item.icon : '',
        hide: item.hide === true,
        hideChild: item.hideChild !== false,
        func_id: item.cid ? item.cid : ''
      }
      if (item.children) {
        menu.children = []
        generaMenu(menu.children, item.children)
      }
      routers.push(menu)
    }
  })
}

export const replace_route = function(router, arr) {
  if (arr[0].children && arr[0].children.length > 0) {
    replace_route(router, arr[0].children)
  } else {
    router.push({ name: arr[0].name })
  }
}

