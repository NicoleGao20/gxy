import axios from 'axios'
import { Message } from 'element-ui' // MessageBox
import store from '../store'
import { ssoServer } from '@/utils/params'
import router from '../router/index'
import urlConfig, { configBackend, configXxl, configLogin } from '@/config/config.js'
// import { delete } from 'vue/types/umd'

axios.interceptors.request.use(
  config => {
    // 不是  绝对路径的时候，就拼接 process.env.BASE_API 比如绝对路径：/users/functions/V2
    if (!isAbsoluteURL(config.url)) {
      config.url = urlConfig.url + config.url
    }
    // config.url = process.env.BASE_API + config.url
    if (config.method === 'get') {
      config.url = config.url.replace(/size=/, 'pageSize=')
      config.url = config.url.replace(/page=/, 'current=')
    }
    if (store.getters.token) {
      // config.headers['X-Token'] = getToken('Admin-Token') // 让每个请求携带自定义token 请根据实际情况自行修改
      config.headers['Authorization'] = `Bearer ${store.getters.token}` // 让每个请求携带自定义token 请根据实际情况自行修改
    }
    return config
  },
  error => {
    // console.log('axios error', error)
    return Promise.reject(error)
  }
)

function isAbsoluteURL(url) {
  return /(^[a-z][a-z\d\+\-\.]*:)?\/\//i.test(url)
}

// 创建axios实例
const service = axios.create({
  baseURL: urlConfig.url, // api 的 base_url
  timeout: 1000000 // 请求超时
})

// request拦截器
service.interceptors.request.use(
  config => {
    if (config.method === 'get') {
      config.url = config.url.replace(/size=/, 'pageSize=')
      config.url = config.url.replace(/page=/, 'current=')
    }
    if (store.getters.token && config.url.indexOf('/action/login') === -1) {
      // config.headers['X-Token'] = getToken('Admin-Token') // 让每个请求携带自定义token 请根据实际情况自行修改
      config.headers['Authorization'] = `Bearer ${store.getters.token}` // 让每个请求携带自定义token 请根据实际情况自行修改
    }
    return config
  },
  error => {
    // Do something with request error
    // console.log('request error', error)
    Message({
      message: `请求错误 ${error.code}: ${error.name}`,
      type: 'error',
      duration: 3 * 1000
    })
    Promise.reject(error)
  }
)

// response 拦截器
service.interceptors.response.use(
  response => {
    if (response.code === -1 || response.status === 401) {
      // 权限失效
      location.href = `${response.data.url}?returnUrl=${window.location.href}`
    } else {
      /**
       * code为非20000是抛错 可结合自己业务进行修改
       */
      const res = response.data
      if (res && res.errorMsg) {
        Message({
          message: res.errorMsg,
          type: 'error',
          duration: 3 * 1000
        })
      } else {
        if (res && res.code == 2) {
          Message({
            message: res.msg,
            type: 'error',
            duration: 3 * 1000
          })
        }
      }
      return response.data
    }
  },
  error => {
    if (error.response && error.response.status === 401) {
      Message({
        message: error.response.data.bizMsg,
        type: 'error',
        duration: 3 * 1000
      })
      store.dispatch('FedLogOut').then(() => {
        router.push({ path: '/login' })
      })
      return
    }
    if (error.response && error.response.data) {
      const res = error.response.data
      if (res && res.errorMsg) {
        Message({
          message: res.errorMsg,
          type: 'error',
          duration: 3 * 1000
        })
      } else if (res && res.bizCode !== 20000 && res.bizCode !== '20000') {
        // 50141 [BELLE]无法下发
        if (res.bizCode === 50141 || res.bizCode === '50141') {
          let rt = /\[(.+?)\]/g.exec(res.bizMsg)[1]
          rt = rt.split(',')
          const brand_list = JSON.parse(sessionStorage.getItem('brand_list'))
          rt.forEach((reg, index) => {
            reg = reg.trim()
            brand_list.forEach(element => {
              if (reg === element.brandCode) {
                rt[index] = element.brandCName
              }
            })
          })
          rt = rt.join(',')
          Message({
            message: rt + '无法下发',
            type: 'error',
            duration: 3 * 1000
          })
        } else if (res.bizCode === 50101) { // login 失效
          Message({
            message: res.bizMsg,
            type: 'error',
            duration: 3 * 1000
          })
          router.push({ path: '/login' })
        } else {
          Message({
            message: res.bizMsg,
            type: 'error',
            duration: 3 * 1000
          })
        }
      } else {
        Message({
          message: res.data.message,
          type: 'error',
          duration: 3 * 1000
        })
      }
    } else {
      Message({
        message: error.message,
        type: 'error',
        duration: 3 * 1000
      })
    }
    return Promise.reject(error)
  }
)

export const request2 = axios.create({
  baseURL: configBackend.url, // api 的 base_url
  timeout: 1000000 // 请求超时
})

// request拦截器
request2.interceptors.request.use(
  config => {
    if (config.method === 'get') {
      config.url = config.url.replace(/size=/, 'pageSize=')
      config.url = config.url.replace(/page=/, 'current=')
    }
    config.url = encodeURI(config.url)
    if (store.getters.token && config.url.indexOf('/action/login') === -1) {
      // config.headers['X-Token'] = getToken('Admin-Token') // 让每个请求携带自定义token 请根据实际情况自行修改
      config.headers['Authorization'] = `Bearer ${store.getters.token}` // 让每个请求携带自定义token 请根据实际情况自行修改
    }
    return config
  },
  error => {
    // Do something with request error
    // console.log('request error', error)
    Message({
      message: `请求错误 ${error.code}: ${error.name}`,
      type: 'error',
      duration: 3 * 1000
    })
    Promise.reject(error)
  }
)

// response 拦截器
request2.interceptors.response.use(
  response => {
    if (response.code === -1 || response.status === 401) {
      // 权限失效
      location.href = `${response.data.url}?returnUrl=${window.location.href}`
    } else {
      /**
       * code为非20000是抛错 可结合自己业务进行修改
       */
      const res = response.data
      if (res && res.errorMsg) {
        Message({
          message: res.errorMsg,
          type: 'error',
          duration: 3 * 1000
        })
      } else {
        if (res && res.code == 2) {
          Message({
            message: res.msg,
            type: 'error',
            duration: 3 * 1000
          })
        }
      }
      return response.data
    }
  },
  error => {
    if (error.response && error.response.status === 401) {
      Message({
        message: error.response.data.bizMsg,
        type: 'error',
        duration: 3 * 1000
      })
      store.dispatch('FedLogOut').then(() => {
        router.push({ path: '/login' })
      })
      return
    }
    if (error.response && error.response.data) {
      const res = error.response.data
      if (res && res.errorMsg) {
        Message({
          message: res.errorMsg,
          type: 'error',
          duration: 3 * 1000
        })
      } else if (res && res.bizMsg) {
        Message({
          message: res.bizMsg,
          type: 'error',
          duration: 3 * 1000
        })
      } else if (res && res.bizCode !== 20000 && res.bizCode !== '20000') {
        // 50141 [BELLE]无法下发
        if (res.bizCode === 50141 || res.bizCode === '50141') {
          let rt = /\[(.+?)\]/g.exec(res.bizMsg)[1]
          rt = rt.split(',')
          const brand_list = JSON.parse(sessionStorage.getItem('brand_list'))
          rt.forEach((reg, index) => {
            reg = reg.trim()
            brand_list.forEach(element => {
              if (reg === element.brandCode) {
                rt[index] = element.brandCName
              }
            })
          })
          rt = rt.join(',')
          Message({
            message: rt + '无法下发',
            type: 'error',
            duration: 3 * 1000
          })
        } else if (res.bizCode === 50101) { // login 失效
          Message({
            message: res.bizMsg,
            type: 'error',
            duration: 3 * 1000
          })
          router.push({ path: '/login' })
        } else {
          Message({
            message: res.bizMsg,
            type: 'error',
            duration: 3 * 1000
          })
        }
      } else {
        Message({
          message: res.data.message,
          type: 'error',
          duration: 3 * 1000
        })
      }
    } else {
      Message({
        message: error.message,
        type: 'error',
        duration: 3 * 1000
      })
    }
    return Promise.reject(error)
  }
)

export const requestXxl = axios.create({
  baseURL: configXxl.url, // api 的 base_url
  timeout: 1000000 // 请求超时
})

// request拦截器
requestXxl.interceptors.request.use(
  config => {
    if (config.method === 'get') {
      config.url = config.url.replace(/size=/, 'pageSize=')
      config.url = config.url.replace(/page=/, 'current=')
    }
    config.url = encodeURI(config.url)
    if (store.getters.token && config.url.indexOf('/action/login') === -1) {
      // config.headers['X-Token'] = getToken('Admin-Token') // 让每个请求携带自定义token 请根据实际情况自行修改
      config.headers['Authorization'] = `Bearer ${store.getters.token}` // 让每个请求携带自定义token 请根据实际情况自行修改
    }
    return config
  },
  error => {
    // Do something with request error
    // console.log('request error', error)
    Message({
      message: `请求错误 ${error.code}: ${error.name}`,
      type: 'error',
      duration: 3 * 1000
    })
    Promise.reject(error)
  }
)

// response 拦截器
requestXxl.interceptors.response.use(
  response => {
    if (response.code === -1 || response.status === 401) {
      // 权限失效
      location.href = `${response.data.url}?returnUrl=${window.location.href}`
    } else {
      /**
       * code为非20000是抛错 可结合自己业务进行修改
       */
      const res = response.data
      if (res && res.errorMsg) {
        Message({
          message: res.errorMsg,
          type: 'error',
          duration: 3 * 1000
        })
      } else {
        if (res && res.code == 2) {
          Message({
            message: res.msg,
            type: 'error',
            duration: 3 * 1000
          })
        }
      }
      return response.data
    }
  },
  error => {
    if (error.response && error.response.status === 401) {
      Message({
        message: error.response.data.bizMsg,
        type: 'error',
        duration: 3 * 1000
      })
      store.dispatch('FedLogOut').then(() => {
        router.push({ path: '/login' })
      })
      return
    }
    if (error.response && error.response.data) {
      const res = error.response.data
      if (res && res.errorMsg) {
        Message({
          message: res.errorMsg,
          type: 'error',
          duration: 3 * 1000
        })
      } else if (res && res.bizCode !== 20000 && res.bizCode !== '20000') {
        // 50141 [BELLE]无法下发
        if (res.bizCode === 50141 || res.bizCode === '50141') {
          let rt = /\[(.+?)\]/g.exec(res.bizMsg)[1]
          rt = rt.split(',')
          const brand_list = JSON.parse(sessionStorage.getItem('brand_list'))
          rt.forEach((reg, index) => {
            reg = reg.trim()
            brand_list.forEach(element => {
              if (reg === element.brandCode) {
                rt[index] = element.brandCName
              }
            })
          })
          rt = rt.join(',')
          Message({
            message: rt + '无法下发',
            type: 'error',
            duration: 3 * 1000
          })
        } else if (res.bizCode === 50101) { // login 失效
          Message({
            message: res.bizMsg,
            type: 'error',
            duration: 3 * 1000
          })
          router.push({ path: '/login' })
        } else {
          Message({
            message: res.bizMsg,
            type: 'error',
            duration: 3 * 1000
          })
        }
      } else {
        Message({
          message: res.data.message,
          type: 'error',
          duration: 3 * 1000
        })
      }
    } else {
      Message({
        message: error.message,
        type: 'error',
        duration: 3 * 1000
      })
    }
    return Promise.reject(error)
  }
)
export const requestLogin = axios.create({
  baseURL: configLogin.url, // api 的 base_url
  timeout: 1000000 // 请求超时
})

// request拦截器
requestLogin.interceptors.request.use(
  config => {
    if (config.method === 'get') {
      config.url = config.url.replace(/size=/, 'pageSize=')
      config.url = config.url.replace(/page=/, 'current=')
    }
    config.url = encodeURI(config.url)
    if (store.getters.token && config.url.indexOf('/action/login') === -1) {
      // config.headers['X-Token'] = getToken('Admin-Token') // 让每个请求携带自定义token 请根据实际情况自行修改
      config.headers['Authorization'] = `Bearer ${store.getters.token}` // 让每个请求携带自定义token 请根据实际情况自行修改
    }
    return config
  },
  error => {
    // Do something with request error
    // console.log('request error', error)
    Message({
      message: `请求错误 ${error.code}: ${error.name}`,
      type: 'error',
      duration: 3 * 1000
    })
    Promise.reject(error)
  }
)

// response 拦截器
requestLogin.interceptors.response.use(
  response => {
    if (response.code === -1 || response.status === 401) {
      // 权限失效
      location.href = `${response.data.url}?returnUrl=${window.location.href}`
    } else {
      /**
       * code为非20000是抛错 可结合自己业务进行修改
       */
      const res = response.data
      if (res && res.errorMsg) {
        Message({
          message: res.errorMsg,
          type: 'error',
          duration: 3 * 1000
        })
      } else {
        if (res && res.code == 2) {
          Message({
            message: res.msg,
            type: 'error',
            duration: 3 * 1000
          })
        }
      }
      return response.data
    }
  },
  error => {
    if (error.response && error.response.status === 401) {
      Message({
        message: error.response.data.bizMsg,
        type: 'error',
        duration: 3 * 1000
      })
      store.dispatch('FedLogOut').then(() => {
        router.push({ path: '/login' })
      })
      return
    }
    if (error.response && error.response.data) {
      const res = error.response.data
      if (res && res.errorMsg) {
        Message({
          message: res.errorMsg,
          type: 'error',
          duration: 3 * 1000
        })
      } else if (res && res.bizCode !== 20000 && res.bizCode !== '20000') {
        // 50141 [BELLE]无法下发
        if (res.bizCode === 50141 || res.bizCode === '50141') {
          let rt = /\[(.+?)\]/g.exec(res.bizMsg)[1]
          rt = rt.split(',')
          const brand_list = JSON.parse(sessionStorage.getItem('brand_list'))
          rt.forEach((reg, index) => {
            reg = reg.trim()
            brand_list.forEach(element => {
              if (reg === element.brandCode) {
                rt[index] = element.brandCName
              }
            })
          })
          rt = rt.join(',')
          Message({
            message: rt + '无法下发',
            type: 'error',
            duration: 3 * 1000
          })
        } else if (res.bizCode === 50101) { // login 失效
          Message({
            message: res.bizMsg,
            type: 'error',
            duration: 3 * 1000
          })
          router.push({ path: '/login' })
        } else {
          Message({
            message: res.bizMsg,
            type: 'error',
            duration: 3 * 1000
          })
        }
      } else {
        Message({
          message: res.data.message,
          type: 'error',
          duration: 3 * 1000
        })
      }
    } else {
      Message({
        message: error.message,
        type: 'error',
        duration: 3 * 1000
      })
    }
    return Promise.reject(error)
  }
)
export default service
