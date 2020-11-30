import { hex_md5 } from '../../utils/md5'
import { login, logout, insertMenuList, V2 } from '@/api/login'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { constantRouterMap } from '@/router'

const user = {
  state: {
    token: '',
    jobNumber: '',
    brandRoles: [],
    merchantId: null,
    name: '',
    avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif?imageView2/1/w/80/h/80',
    roles: [],
    permissions: {},
    personRouter: [],
    set_left_navs: [],
    sidebarRouter: constantRouterMap
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_JOBNUMBER: (state, jobNumber) => {
      state.jobNumber = '180795166'
    },
    SET_LEFT_NAVS: (state, navs) => {
      state.set_left_navs = navs
    },
    SET_BRANDROLES: (state, brandRoles) => {
      state.brandRoles = brandRoles
    },
    SET_MERCHANTID: (state, merchantId) => {
      state.merchantId = '51faa1cdb02b4d3c9646a592abba9278'
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROUTER: (state, router) => {
      state.personRouter = router
    },
    SET_SIDEBAR_ROUTER: (state, newRouter) => {
      state.sidebarRouter = newRouter
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_PERMISSIONS: (state, permissions) => {
      state.permissions = permissions
    }
    // SET_SIDEBAR_ROUTER: (state, newRouter) => {
    //   state.sidebarRouter = []
    // },
    // SET_SIDEBAR_ROUTER: (state, newRouter) => {
    // //   state.sidebarRouter = [{ 'path': '/', 'component': { '_custom': { 'type': 'function', 'display': '<span>ƒ</span> component()' }}, 'hidden': true }, { 'path': '/404', 'component': { '_custom': { 'type': 'component-definition', 'display': 'Layout <span>(src\\views\\layout\\Layout.vue)</span>', 'tooltip': 'Component definition', 'file': 'src\\views\\layout\\Layout.vue' }}, 'hidden': true, 'redirect': '/404/error', 'children': [{ 'path': 'error', 'component': { '_custom': { 'type': 'function', 'display': '<span>ƒ</span> component()' }}, 'name': 'error', 'meta': { 'title': '', 'icon': '', 'hidden': true }}] }, { 'path': '*', 'redirect': '/404', 'hidden': true }, { 'children': [{ 'component': { '_custom': { 'type': 'function', 'display': '<span>ƒ</span> dashboard()' }}, 'hidden': false, 'meta': { 'icon': 'home', 'title': 'dashboard' }, 'path': 'dashboard', 'redirect': '', 'name': 'dashboard' }], 'component': { '_custom': { 'type': 'component-definition', 'display': 'Layout <span>(src\\views\\layout\\Layout.vue)</span>', 'tooltip': 'Component definition', 'file': 'src\\views\\layout\\Layout.vue' }}, 'hidden': false, 'path': '/', 'redirect': 'dashboard' }, { 'children': [{ 'component': { '_custom': { 'type': 'function', 'display': '<span>ƒ</span> conditionLibrary()' }}, 'hidden': false, 'meta': { 'icon': '', 'title': 'conditionLibrary' }, 'path': 'conditionLibrary', 'redirect': '', 'name': 'conditionLibrary' }, { 'component': { '_custom': { 'type': 'function', 'display': '<span>ƒ</span> conditionLibraryMod()' }}, 'hidden': true, 'meta': { 'icon': '', 'title': 'conditionLibraryMod' }, 'path': 'conditionLibraryMod', 'redirect': '', 'name': 'conditionLibraryMod' }], 'component': { '_custom': { 'type': 'component-definition', 'display': 'Layout <span>(src\\views\\layout\\Layout.vue)</span>', 'tooltip': 'Component definition', 'file': 'src\\views\\layout\\Layout.vue' }}, 'hidden': false, 'meta': { 'icon': 'setting', 'title': 'systemSetting' }, 'path': '/system', 'redirect': '/system/conditionLibrary', 'name': 'systemSetting' }, { 'children': [{ 'component': { '_custom': { 'type': 'function', 'display': '<span>ƒ</span> metaform()' }}, 'hidden': false, 'meta': { 'icon': '', 'title': 'metaform' }, 'path': 'metaform', 'redirect': '', 'name': 'metaform' }, { 'component': { '_custom': { 'type': 'function', 'display': '<span>ƒ</span> marketEvent()' }}, 'hidden': false, 'meta': { 'icon': '', 'title': 'marketEvent' }, 'path': 'marketEvent', 'redirect': '', 'name': 'marketEvent' }, { 'component': { '_custom': { 'type': 'function', 'display': '<span>ƒ</span> metafield()' }}, 'hidden': false, 'meta': { 'icon': '', 'title': 'metafield' }, 'path': 'metafield', 'redirect': '', 'name': 'metafield' }, { 'component': { '_custom': { 'type': 'function', 'display': '<span>ƒ</span> marketEventAdd()' }}, 'hidden': true, 'meta': { 'icon': '', 'title': 'marketEventAdd' }, 'path': 'marketEventAdd', 'redirect': '', 'name': 'marketEventAdd' }, { 'component': { '_custom': { 'type': 'function', 'display': '<span>ƒ</span> metaenum()' }}, 'hidden': false, 'meta': { 'icon': '', 'title': 'metaenum' }, 'path': 'metaenum', 'redirect': '', 'name': 'metaenum' }, { 'component': { '_custom': { 'type': 'function', 'display': '<span>ƒ</span> marketEventMod()' }}, 'hidden': true, 'meta': { 'icon': '', 'title': 'marketEventMod' }, 'path': 'marketEventMod/:id', 'redirect': '', 'name': 'marketEventMod' }, { 'component': { '_custom': { 'type': 'function', 'display': '<span>ƒ</span> marketEventField()' }}, 'hidden': false, 'meta': { 'icon': '', 'title': 'marketEventField' }, 'path': 'marketEventField', 'redirect': '', 'name': 'marketEventField' }, { 'component': { '_custom': { 'type': 'function', 'display': '<span>ƒ</span> marketEventFieldAdd()' }}, 'hidden': true, 'meta': { 'icon': '', 'title': 'marketEventFieldAdd' }, 'path': 'marketEventFieldAdd', 'redirect': '', 'name': 'marketEventFieldAdd' }], 'component': { '_custom': { 'type': 'component-definition', 'display': 'Layout <span>(src\\views\\layout\\Layout.vue)</span>', 'tooltip': 'Component definition', 'file': 'src\\views\\layout\\Layout.vue' }}, 'hidden': false, 'meta': { 'icon': 'meta', 'title': 'meta' }, 'path': '/meta', 'redirect': '/meta/metaform', 'name': 'meta' }, { 'children': [{ 'component': { '_custom': { 'type': 'function', 'display': '<span>ƒ</span> labelPool()' }}, 'hidden': false, 'meta': { 'icon': '', 'title': 'labelPool' }, 'path': 'labelPool', 'redirect': '', 'name': 'labelPool' }, { 'component': { '_custom': { 'type': 'function', 'display': '<span>ƒ</span> brandLabelPool()' }}, 'hidden': false, 'meta': { 'icon': '', 'title': 'brandLabelPool' }, 'path': 'brandLabelPool', 'redirect': '', 'name': 'brandLabelPool' }, { 'component': { '_custom': { 'type': 'function', 'display': '<span>ƒ</span> attrLabelEdit()' }}, 'hidden': true, 'meta': { 'icon': '', 'title': 'attrLabelEdit' }, 'path': 'labelPool/attrLabelEdit', 'redirect': '', 'name': 'attrLabelEdit' }, { 'component': { '_custom': { 'type': 'function', 'display': '<span>ƒ</span> manualLabelAdd()' }}, 'hidden': true, 'meta': { 'icon': '', 'title': 'manualLabelAdd' }, 'path': 'labelPool/manualLabelAdd', 'redirect': '', 'name': 'manualLabelAdd' }, { 'component': { '_custom': { 'type': 'function', 'display': '<span>ƒ</span> manualLabelEdit()' }}, 'hidden': true, 'meta': { 'icon': '', 'title': 'manualLabelEdit' }, 'path': 'labelPool/manualLabelEdit', 'redirect': '', 'name': 'manualLabelEdit' }, { 'component': { '_custom': { 'type': 'function', 'display': '<span>ƒ</span> ruleLabelAdd()' }}, 'hidden': true, 'meta': { 'icon': '', 'title': 'ruleLabelAdd' }, 'path': 'labelPool/ruleLabelAdd', 'redirect': '', 'name': 'ruleLabelAdd' }, { 'component': { '_custom': { 'type': 'function', 'display': '<span>ƒ</span> ruleLabelEdit()' }}, 'hidden': true, 'meta': { 'icon': '', 'title': 'ruleLabelEdit' }, 'path': 'labelPool/ruleLabelEdit', 'redirect': '', 'name': 'ruleLabelEdit' }, { 'component': { '_custom': { 'type': 'function', 'display': '<span>ƒ</span> complexLabelAdd()' }}, 'hidden': true, 'meta': { 'icon': '', 'title': 'complexLabelAdd' }, 'path': 'labelPool/complexLabelAdd', 'redirect': '', 'name': 'complexLabelAdd' }, { 'component': { '_custom': { 'type': 'function', 'display': '<span>ƒ</span> complexLabelEdit()' }}, 'hidden': true, 'meta': { 'icon': '', 'title': 'complexLabelEdit' }, 'path': 'labelPool/complexLabelEdit', 'redirect': '', 'name': 'complexLabelEdit' }, { 'component': { '_custom': { 'type': 'function', 'display': '<span>ƒ</span> rfmLabelEdit()' }}, 'hidden': true, 'meta': { 'icon': '', 'title': 'rfmLabelEdit' }, 'path': 'labelPool/rfmLabelEdit', 'redirect': '', 'name': 'rfmLabelEdit' }, { 'component': { '_custom': { 'type': 'function', 'display': '<span>ƒ</span> attrBrandLabelEdit()' }}, 'hidden': true, 'meta': { 'icon': 'attrBrandLabelEdit', 'title': 'attrBrandLabelEdit' }, 'path': 'attrBrandLabelEdit', 'redirect': '', 'name': 'attrBrandLabelEdit' }, { 'component': { '_custom': { 'type': 'function', 'display': '<span>ƒ</span> manualBrandLabelEdit()' }}, 'hidden': true, 'meta': { 'icon': 'manualBrandLabelEdit', 'title': 'manualBrandLabelEdit' }, 'path': 'manualBrandLabelEdit', 'redirect': '', 'name': 'manualBrandLabelEdit' }, { 'component': { '_custom': { 'type': 'function', 'display': '<span>ƒ</span> ruleBrandLabelEdit_f()' }}, 'hidden': true, 'meta': { 'icon': 'ruleBrandLabelEdit_f', 'title': 'ruleBrandLabelEdit_f' }, 'path': 'ruleBrandLabelEdit_f', 'redirect': '', 'name': 'ruleBrandLabelEdit_f' }, { 'component': { '_custom': { 'type': 'function', 'display': '<span>ƒ</span> ruleBrandLabelEdit_s()' }}, 'hidden': true, 'meta': { 'icon': 'ruleBrandLabelEdit_s', 'title': 'ruleBrandLabelEdit_s' }, 'path': 'ruleBrandLabelEdit_s', 'redirect': '', 'name': 'ruleBrandLabelEdit_s' }, { 'component': { '_custom': { 'type': 'function', 'display': '<span>ƒ</span> complexBrandLabelEdit()' }}, 'hidden': true, 'meta': { 'icon': 'complexBrandLabelEdit', 'title': 'complexBrandLabelEdit' }, 'path': 'complexBrandLabelEdit', 'redirect': '', 'name': 'complexBrandLabelEdit' }, { 'component': { '_custom': { 'type': 'function', 'display': '<span>ƒ</span> rfmBrandLabelEdit()' }}, 'hidden': true, 'meta': { 'icon': 'rfmBrandLabelEdit', 'title': 'rfmBrandLabelEdit' }, 'path': 'rfmBrandLabelEdit', 'redirect': '', 'name': 'rfmBrandLabelEdit' }], 'component': { '_custom': { 'type': 'component-definition', 'display': 'Layout <span>(src\\views\\layout\\Layout.vue)</span>', 'tooltip': 'Component definition', 'file': 'src\\views\\layout\\Layout.vue' }}, 'hidden': false, 'meta': { 'icon': 'memberLabel', 'title': 'memberLabel' }, 'path': '/memberLabel', 'redirect': '/memberLabel/labelPool', 'name': 'memberLabel' }]
    // }
  },

  actions: {
    // 设置token
    SetToken({ commit }) {
      commit('SET_TOKEN', getToken('token'))
    },

    // 设置jobNumber
    SetJobNumber({ commit }) {
      commit('SET_JOBNUMBER', getToken('jobNumber'))
    },

    SetRouterList({ commit }) {
      return new Promise((resolve, reject) => {
        V2().then(res => {
          console.log(res)
          commit('SET_LEFT_NAVS', res.body)
          resolve()
        }).catch(() => {
          reject()
        })
      })
    },

    // 设置merchantId
    SetMerchantId({ commit }, merchantId) {
      commit('SET_MERCHANTID', merchantId)
      setToken('merchantId', merchantId)
    },

    // 登录
    Login({ commit }, userInfo) {
      // const userName = userInfo.userName.trim()
      return new Promise((resolve, reject) => {
        const body = {
          id: hex_md5(userInfo),
          sign: 'BTWVF7PZWCAEACZZZRST',
          timestamp: new Date().getTime(),
          body: { 'userName': userInfo.userName, 'password': userInfo.password }
        }
        login(body).then(response => {
          const data = response.body
          commit('SET_NAME', data.userName)
          setToken('token', data.token)
          // sessionStorage.setItem('token', data.token)
          commit('SET_TOKEN', data.token)
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 获取用户品牌权限
    async GetBrandRoles({ commit, state }) {
      try {
        // const jobNumber = state.jobNumber
        // const brandRolesResponse = await getUserBrands({ jobNumber })
        const brandRolesResponse = { 'code': 1, 'data': [{ 'affiliation': 'U010103', 'affiliationName': '虚拟', 'brandEName': 'CRM系统品牌', 'brandName': 'CRM系统品牌', 'brandNo': 'CRMXTPP', 'createOperator': 'adminipms', 'createTime': '2020-01-03 14:22:44', 'id': 'bf1aceecda4a4d6bbef9bddb5061f041', 'merchantCode': '', 'merchantName': '', 'propackageId': '515cd18d663040879a89524b82d8ed80', 'propackageName': 'CRM-OP', 'remark': '', 'state': 1, 'updateOperator': 'adminipms', 'updateTime': '2020-01-03 14:22:44' }], 'bizMsg': '查询成功', 'bizCode': 20000 }
        return brandRolesResponse
      } catch (err) {
        console.log(err)
      }
    },

    // 获取用户信息
    async GetUserInfo({ commit, dispatch, state }, id) {
    // try {
    // const brandRolesResponse = await dispatch('GetBrandRoles')
    // if (!brandRolesResponse.data) {
    //   return Promise.reject('no brand role data')
    // }
    // console.log('brandRolesResponse', brandRolesResponse)
    // const brandRoles = brandRolesResponse.data
    // const merchantId = '51faa1cdb02b4d3c9646a592abba9278' || brandRoles[0].id
    // const brandRolesObj = brandRoles.find(res => res.id === merchantId)
    // const brandCode = brandRolesObj ? brandRolesObj.brandNo : ''
    // setToken('brandCode', brandCode)
    // setToken('brandNo', brandCode)

    // const jobNumber = state.jobNumber
    // const userInfoResponse = { 'code': 1, 'data': {}, 'bizMsg': '请求成功!', 'bizCode': 20000  },

    // const { data } = userInfoResponse
    // console.log(data)
    // if (data.roleList && data.roleList.length > 0) { // 验证返回的roleList是否是一个非空数组
    //   commit('SET_ROLES', data.roleList)
    // } else {
    // reject('getInfo: roles must be a non-null array !')
    // }
    // commit('SET_MERCHANTID', merchantId)
    // commit('SET_NAME', data.username)
    // commit('SET_AVATAR', data.avatar)
    // commit('SET_ROUTER', data.router)
    // commit('SET_PERMISSIONS', data.buttonRoles)
    // commit('SET_BRANDROLES', brandRoles)
    // commit('SET_ALLRESOURCE', data.allResource)
    // localStorage.setItem('allResource', JSON.stringify(data.allResource))
    // setToken('merchantId', merchantId)
    // setToken('userId', data.id)
    // localStorage.setItem('personRouter', JSON.stringify(data.router))
    // if (data.router) {
    //   const newrouter = constantRouterMap.concat(data.router)
    //   commit('SET_SIDEBAR_ROUTER', newrouter)
    //   // setToken('sidebarRouter', newrouter)
    // }
    // return userInfoResponse
    // } catch (err) {
    // console.log(err)
    // }
    },

    // 提交用户权限
    InserMenuList({ commit, state }, data) {
      insertMenuList(data).then(response => {
        console.log('insertMenuList', response)
      })
    },

    // 登出
    LogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        commit('SET_TOKEN', '')
        commit('SET_ROLES', [])
        removeToken('token')
        removeToken('personRouter')
        // removeToken('sidebarRouter')
        resolve()
        logout(state.token).then(() => {
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        commit('SET_JOBNUMBER', '')
        commit('SET_MERCHANTID', '')
        commit('SET_BRANDROLES', [])
        removeToken('token')
        removeToken('jobNumber')
        removeToken('merchantId')
        removeToken('personRouter')
        removeToken('sidebarRouter')
        removeToken('brandCode')
        removeToken('brandName')
        resolve()
      })
    }
  }
}

export default user
