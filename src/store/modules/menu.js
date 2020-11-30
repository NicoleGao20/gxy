/* eslint-disable prettier/prettier */
/**
 * vuex
 * 参见 https://github.com/vuejs/vuex/tree/dev/examples/shopping-cart
 */
import router from '../../router/index'
import { generaMenu } from '../menufilter'
import { functions } from '../../api/user'

const Menu = {
  namespace: true,
  state: {
    nav: [],
    brandCode:'',
    routes: [],
    activeNavs: [],
    token: '',
    asideWidth: 230,
    asideType: false, // false 显示完整 true 显示小导航
    hideAside: false,
    bodyheight: 0,
    nav_child: [],
    all_func: [],
    sub_func: {},
    sub_func_id: 0,
    isRefresh: false,
    isSubGetFunc: false,
    left_navs: [],
    parent_name: '',
    cur_right_navs: [],
    config: {},
    refreshSearchForm: false
  },
  mutations: {
    add_is_refresh(state, status) {
      console.log(state,status)
      state.isRefresh = status
    },
    set_config(state, config) {
      state.config = config
    },
    add_is_sub_get_func(state, status) {
      state.isSubGetFunc = status
    },
    change_nav_brand(state,status){
      state.brandCode = status
    },
    add_func(state, list) {
      state.all_func = list
    },
    add_Routes(state, list) {
      // 这里的 `state` 对象是模块的局部状态
      state.nav = list
      const routes = []
      generaMenu(routes, list) // 将后台的路由数据components转化成组件
      // console.log(routes)
      state.routes = routes
      const arr = []
      for (const item of router.options.routes) {
        if (item.path === '/') {
          item.children = routes
          arr.push(item)
        }
      }
      // router.addRoutes(arr)  // 添加路由
      // const href = window.location.pathname;
      // console.log(href)
      // console.log(process.env.BASE_URL)
      // let isneed = false;
      // if (href == process.env.BASE_URL || href+'/' == process.env.BASE_URL || window.location.href.indexOf('login') != -1
      // || window.location.href.indexOf('login') != -1) {
      //     isneed = true;
      // }
      // 跳转
      // if (isneed) {
      //     setTimeout(() => {
      //         replace_route(router, arr)
      //     }, 100)
      // }
    },
    add_All_Routes(state, list) {
      state.nav = list
    },
    add_Active_Routes(state, list) {
      console.log(list)
      state.activeNavs = list
    },
    setToken(state, token) {
      state.token = token
    },
    set_sub_func(state, item) {
      console.log(item,888888)
      if (!item.nosetId) {
        state.sub_func_id = item.id
      }
      state.sub_func[item.id] = item.list
    },
    set_sub_func_id(state, id) {
      state.sub_func_id = id
      // state.sub_func[item.id] = item.list;
    },
    set_left_navs(state, left_navs) {
      state.left_navs = left_navs
    },
    set_parent_name(state, parent_name) {
      state.parent_name = parent_name
    },
    set_cur_right_navs(state, cur_right_navs) {
      state.cur_right_navs = cur_right_navs
    },
    set_refresh_search_form(state, refreshStatus) {
      state.refreshSearchForm = refreshStatus
    }
  },
  getters: {
    getIsRefresh(state, status) {
      return state.isRefresh
    },
    getIsGetSubFuncs(state, status) {
      return state.isSubGetFunc
    },
    getConfig(state, config) {
      return state.config
    },
    getSubFunc: (state, getters) => (id) => {
      const sid = id !== undefined && id !== -1 ? id : state.sub_func_id
      console.log(JSON.parse(JSON.stringify(state.sub_func)))
      let info = state.sub_func[sid]
      if (!info) {
        info = {
          functionOperations: [],
          functionFields: [],
          functionQueryFields: [],
          isNo: true
        }
      }
      return info
    },
    getNavChild(state) {
      return state.nav_child
    },
    getNavs(state) {
      return state.nav
    },
    getRoutes(state) {
      return state.routes
    },
    getActiveNavs(state) {
      return state.activeNavs
    },
    getToken(state) {
      return state.token
    }
  },
  actions: {
    async add_Routes({ commit }, list) {
      commit('add_Routes', list)
      // let res = await Api.get_user_function({}, false);
      // if (res == -1) {
      //     return false;
      // }
      // commit('add_func', res.body);
    },
    async add_sub_func({ commit, state }, id) {
      if (state.sub_func[id]) {
        return false
      }
      const res = await functions({ functionId: id }, false)
      if (res === -1) {
        return false
      }
      commit('set_sub_func', {
        id: id,
        list: res.body
      })
    },
    add_All_Routes({ commit }, list) {
      commit('add_All_Routes', list)
    },
    add_Active_Routes({ commit }, list) {
      commit('add_Active_Routes', list)
    },
    setToken({ commit }, token) {
      commit('setToken', token)
    }
  }
}
export default Menu
