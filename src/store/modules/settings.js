import variables from '@/styles/element-variables.less'
import defaultSettings from '@/settings'
import { updateThemeSetting } from '@/api/setting'
import { getToken } from '@/utils/auth'

const { showSettings } = defaultSettings
const state = {
  theme: variables.theme,
  showSettings: showSettings
}

const mutations = {
  CHANGE_SETTING: (state, { key, value }) => {
    if (state.hasOwnProperty(key)) {
      state[key] = value
    }
    // console.log('key', key)
    // console.log('value', value)
    // if (key === 'theme') {
    // window.location.reload()
    // Cookies.set('theme', value)
    // }
  }
}

const actions = {
  changeSetting({ commit }, data) {
    console.log('CHANGE_SETTING', data)
    commit('CHANGE_SETTING', data)
    updateThemeSetting({
      jobNumber: getToken('jobNumber'),
      themeStyle: JSON.stringify({
        [data.key]: data.value
      })
    }).then(() => { console.log('update theme ok') })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

