const brand = {
  state: {
    brandCode: '',
    brandName: ''
  },
  mutations: {
    SET_BRAND_CODE(state, brandCode) {
      state.brandCode = brandCode
    },
    SET_BRAND_NAME(state, brandName) {
      state.brandName = brandName
    }
  },
  actions: {
    setBrandCode({ commit }, brandCode) {
      commit('SET_BRAND_CODE', brandCode)
    },
    setBrandName({ commit }, brandName) {
      commit('SET_BRAND_NAME', brandName)
    }
  }
}
export default brand
