import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)
// import develop from './develop'
// import Layout from '../views/layout/Layout'
import navs from '../config/navs'
import { generaMenu } from '../store/menufilter'
import store from '@/store'
const getNavs = function() {
  const routes = []
  generaMenu(routes, navs) // 将后台的路由数据components转化成组件
  return routes
}
const anavs = getNavs()

export const constantRouterMap = [
  {
    path: '/login',
    name: 'login',
    meta: { auth: false, title: '登录页', keepAlive: true },
    component: (resolve) => require(['@/views/login/index.1'], resolve)
  },
  {
    path: '/',
    name: 'index',
    meta: { auth: true, title: '首页', keepAlive: true },
    component: resolve => require(['@/views/home/index.vue'], resolve),
  },
  {
    path: '/manage',
    name: 'manage',
    meta: { auth: true, title: '管理平台', keepAlive: true },
    component: resolve => require(['@/views/land/index.vue'], resolve),
    children: anavs
  },
  // {
  //   path: '/largeScreenIndex',
  //   name: 'largeScreenIndex',
  //   meta: { auth: true, title: '大屏', keepAlive: true },
  //   component: resolve => require(['@/views/largeScreen/index.vue'], resolve),
  //   hidden: true
  // },
  {
    path: '/largeScreen',
    name: 'largeScreen',
    meta: { auth: true, title: '大屏', keepAlive: true },
    component: resolve => require(['@/views/platformitem/sycm/largeScreen/largeScreen.vue'], resolve),
    hidden: true
  },
  {
    path: '/help',
    name: 'help',
    meta: { auth: true, title: '大屏', keepAlive: true },
    component: resolve => require(['@/views/help/index.vue'], resolve),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/error-page/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/error-page/401'),
    hidden: true
  },
  {
    path: '/404',
    redirect: '/404/error',
    children: [
      {
        path: '401',
        component: () => import('@/views/error-page/401'),
        name: 'Page401',
        meta: { title: 'page401', noCache: true }
      },
      {
        path: '404',
        component: () => import('@/views/error-page/404'),
        name: 'Page404',
        meta: { title: '', icon: '', hidden: true }
      }
    ]
  },
  { path: '*', redirect: '/404', hidden: true }
]

// if (process.env.NODE_ENV === 'development') {
//   constantRouterMap = constantRouterMap.concat(develop)
// }

const router = new Router({
  // mode: 'history',
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})
/**
 * 全局前置守卫
 */
router.beforeEach((to, from, next) => {
  var toFunPath = /\/\w+\/(\w+)\/(\w+)?/.exec(to.path)
  var fromFunPath = /\/\w+\/(\w+)\/(\w+)?/.exec(from.path)
  if(toFunPath&&fromFunPath) {
      // 查询条件是否为刷新的标志符
      if((toFunPath[2] && fromFunPath[2]) && (toFunPath[2] == fromFunPath[2])) {
        store.commit('set_refresh_search_form', false)
      } else {
        store.commit('set_refresh_search_form', true)
      }
  } else {
      toFunPath = /\/\w+\/(\w+)/.exec(to.path)
      fromFunPath = /\/\w+\/(\w+)/.exec(from.path)
      // 查询条件是否为刷新的标志符
      if(toFunPath&&fromFunPath&&(toFunPath[1] == fromFunPath[1])) {
        store.commit('set_refresh_search_form', false)
      } else {
        store.commit('set_refresh_search_form', true)
      }
  }

  if (
      to.meta.auth &&
      !sessionStorage.getItem('token') &&
      to.path != '/login'
  ) {
      next({
          path: '/login'
      })
      return false
  }
  next()
})
export default router
// export default new Router({
//   scrollBehavior: () => ({ y: 0 }),
//   routes: constantRouterMap
// })

// router.beforeEach((to, from, next) => {
//   if (
//     to.meta.auth &&
//       !sessionStorage.getItem('token') &&
//       to.path !== '/login'
//   ) {
//     next({
//       path: '/login'
//     })
//     return false
//   }
//   next()
// })
// {
//   path: '/404',
//   component: Layout,
//   hidden: true,
//   redirect: '',
//   children: [
//     {
//       path: '/404',
//       component: () => import('@/views/404'),
//       name: '404',
//       meta: { title: '404', icon: '404', hidden: true }
//     }
//   ]
// },
