export default {
  data() {
    return {
      fullPath: ''
    }
  },
  created() {
    this.fullPath = this.$route.fullPath

    try {
      var conditionParams = JSON.parse(sessionStorage.getItem(this.fullPath)) || {}
      if (this.params) {
        Object.assign(this.params, conditionParams.params)
      }
      if (this.searchForm) {
        Object.assign(this.searchForm, conditionParams.searchForm)
      }
    } catch (err) {
      console.log(err)
    }
  },
  beforeDestroy() {
    var conditionParams = {
      params: this.params,
      searchForm: this.searchForm
    }
    try {
      sessionStorage.setItem(this.fullPath, JSON.stringify(conditionParams))
    } catch (err) {
      console.log(err)
    }
  }
}

export function clearOtherPageSessionStorage(to, from) {
  var reg = /\/([^\/]+)/
  var fromFirstLevelPath
  var toFirsetLevelPath
  if (from.path.match(reg)) {
    fromFirstLevelPath = from.path.match(reg)[0]
  }
  if (to.path.match(reg)) {
    toFirsetLevelPath = to.path.match(reg)[0]
  }

  if (fromFirstLevelPath !== toFirsetLevelPath) {
    var pathArr = Object.keys(sessionStorage)

    for (var i = 0; i < pathArr.length; i++) {
      if (pathArr[i].indexOf(fromFirstLevelPath) > -1) {
        sessionStorage.removeItem(pathArr[i])
      }
    }
  }
}
