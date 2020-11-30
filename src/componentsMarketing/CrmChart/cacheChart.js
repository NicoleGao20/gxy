
import blueimpMd5 from 'blueimp-md5'

export default {
  methods: {
    requestDataWrap(params) {
      var paramsStr = blueimpMd5(JSON.stringify(params))
      var chartData = sessionStorage.getItem(paramsStr)
      if (chartData) {
        return new Promise((resolve, reject) => {
          var chartJson
          try {
            chartJson = JSON.parse(chartData)
          } catch (err) {
            console.log(err)
          }
          if (chartJson) {
            resolve(chartJson)
          } else {
            this.requestData(params).then((data) => {
              resolve(data)
            }, () => {
              reject()
            })
          }
        })
      } else {
        return new Promise((resolve, reject) => {
          this.requestData(params).then((data) => {
            sessionStorage.setItem(paramsStr, JSON.stringify(data))
            resolve(data)
          }).catch(() => {
            reject()
          })
        })
      }
    }
  }
}
