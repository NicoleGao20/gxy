import Vue from 'vue'

Vue.filter('translateProductClassify', (val, model) => {
  let classify = ''
  if (model.length > 0) {
    [{ name: classify }] = model.filter((item, index) => {
      return item.classify == val
    })
  }
  return classify || val
})

Vue.filter('translateProductType', (val, model) => {
  const type = ''
  const arr = model.filter((item, index) => {
    return item.id == val
  })
  return arr[0]['text']
})

Vue.filter('translateProductStatus', (val, model) => {
  const status = ''
  const arr = model.filter((item, index) => {
    return item.id == val
  })
  if (arr.length > 0) {
    return arr[0]['text']
  } else {
    return val
  }
})
