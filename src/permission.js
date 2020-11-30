// import router from './router'
// import { forRouter } from './router/dynamic'
import store from './store'
// import NProgress from 'nprogress' // Progress 进度条
// import 'nprogress/nprogress.css'// Progress 进度条样式
// import { Message } from 'element-ui'
// // import { getToken } from '@/utils/auth' // 验权
// import { ssoServer } from '@/utils/params'
// // import '@/utils/setCokieData' // sso 登陆失败时 打开这个注释，就可以跳过登陆从权限系统获取数据了

// const whiteList = ['/login'] // 不重定向白名单

// store.dispatch('SetToken')
store.dispatch('SetJobNumber')
// const isHavePower = (to, from, next) => {
//   const allArr = []
//   const perArr = []
//   const allResource = JSON.parse(localStorage.getItem('allResource'))
//   const personRouter = JSON.parse(localStorage.getItem('personRouter'))
//   const forArr = (data, arr) => {
//     if (!data || data.length === 0) {
//       next()
//     }
//     for (let index = 0; index < data.length; index++) {
//       const element = data[index]
//       for (let i = 0; i < element.children.length; i++) {
//         const nv = element.children[i]
//         if (element.path === '/') {
//           arr.push('/' + nv.path)
//         } else {
//           arr.push(element.path + '/' + nv.path)
//         }
//       }
//     }
//   }
//   forArr(allResource, allArr)
//   forArr(personRouter, perArr)
//   const link = to.matched[1] ? to.matched[1].path : ''
//   const findAllRouter = allArr.find(res => {
//     return new RegExp(link).test(res)
//   })
//   const findPerRouter = perArr.find(res => {
//     return new RegExp(link).test(res)
//   })
//   if (findAllRouter && findPerRouter) {
//     next()
//   }
//   if (!findAllRouter && !findPerRouter) {
//     next()
//   }
//   if (findAllRouter && !findPerRouter) {
//     next({ path: '/401' })
//   }
// }

// router.beforeEach((to, from, next) => {
//   NProgress.start()
//   document.onkeydown = '' // 去掉页面绑定
//   const istoPage = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ7fSIsImlhdCI6MTU3NDIzNzYyNCwiZXhwIjoxNTc0MjY3NjI0fQ.BswH5SIGDzDPJUnq0qJdSIp6FeYXLXd165fuKgKtHR_92K4QI4nlHAQj_w3oLXa5_yETp8fqLS4BIIFpwfHDWw'
//   if (istoPage) {
//     // console.log(getToken('token'))
//     localStorage.removeItem('redirect')
//     if (store.getters.brandRoles.length === 0) {
//       store.dispatch('GetUserInfo').then(res => {
//         const personRouter = res.data.router
//         forRouter(personRouter)
//         router.addRoutes(personRouter)
//         next({ to, replace: true, path: to.redirectedFrom })
//       }).catch((err) => {
//         store.dispatch('FedLogOut').then(() => {
//           Message.error(err || 'Verification failed, please login again')
//           console.log(ssoServer)
//           location.href = `${ssoServer}/logout`
//         })
//       })
//     } else {
//       isHavePower(to, from, next)
//     }
//   } else {
//     console.error('no token')
//     if (process.env.NODE_ENV === 'development') {
//       next()
//       NProgress.done()
//     } else {
//       if (whiteList.indexOf(to.path) !== -1) {
//         next()
//       } else {
//         // if (!localStorage.getItem('redirect')) {
//         //   localStorage.setItem('redirect', '1')
//         //   location.href = `${ssoServer}/login?returnUrl=${window.location.href}`
//         // }
//         // location.href = `${ssoServer}/login?returnUrl=${window.location.href}`
//         this.$router.push('/')
//         NProgress.done()
//       }
//     }
//   }
// })

// router.afterEach(() => {
//   NProgress.done() // 结束Progress
// })
