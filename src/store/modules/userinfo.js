const UserInfo = {
  state: {
    user_info: {}
  },
  mutations: {
    setUserInfo(state, user_info) {
      state.user_info = JSON.parse(JSON.stringify(user_info))
    }
  },
  getters: {
    getUserInfo(state) {
      return state.user_info
    }
  }
}
export default UserInfo
