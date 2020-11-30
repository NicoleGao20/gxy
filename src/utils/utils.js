/**
 * @author leo_zhu(563803119@qq.com)
 * @file 统一公用方法
 */

const Utils = {
  /**
     * 图片转base64
     * @param {*} file
     */
  readFile(file) {
    // 判断是否是图片类型
    if (!/image\/\w+/.test(file.type)) {
      alert('只能选择图片')
      return false
    }
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = function(e) {
        resolve(this.result)
      }
    })
  },
  /**
     * 手机号码截取字符串并替换
     * 参数
     * str：需要修改的字符串（必填）
     * 返回
     * 格式：134****9090
     */
  repleaceStr(str) {
    const str1 = str.substr(3, 4)
    str = str.replace(str1, '****')
    return str
  },
  /**
     * 计算剩余时间
     * @param {*} stime 开始时间
     * @param {*} etime 结束时间
     * @param {*} isTimeStamp 是否为时间戳 默认 true
     */
  getTransferDataTime(stime, etime, isTimeStamp = true) {
    let start, current
    if (isTimeStamp) {
      start = new Date(parseInt(stime) * 1000)
      current = new Date(parseInt(etime) * 1000)
    } else {
      start = new Date(stime.replace(new RegExp(/-/gm), '/'))
      current = new Date(etime.replace(new RegExp(/-/gm), '/'))
    }
    // 总秒数
    const millisecond = Math.floor((current.getTime() - start.getTime()) / 1000)
    // 总天数
    const allDay = Math.floor(millisecond / (24 * 60 * 60))
    // 注意同getYear的区别
    const startYear = start.getFullYear()
    const currentYear = current.getFullYear()
    // 闰年个数
    let leapYear = 0
    for (let i = startYear; i < currentYear; i++) {
      if (this.isLeapYear(i)) {
        leapYear++
      }
    }
    // 年数
    let year = Math.floor((allDay - leapYear * 366) / 365 + leapYear)
    // 天数
    let day
    if (allDay > 366) {
      day = (allDay - leapYear * 366) % 365
    } else {
      day = allDay
    }
    // 取余数(秒)
    const remainder = millisecond % (24 * 60 * 60)
    // 小时数
    let hour = Math.floor(remainder / (60 * 60))
    // 分钟数
    let minute = Math.floor(remainder % (60 * 60) / 60)
    // 秒数
    let second = remainder - hour * 60 * 60 - minute * 60
    if (year >= 1 && year <= 9) {
      year = '0' + year
    }
    if (day >= 0 && day <= 9) {
      day = '0' + day
    }
    if (hour >= 0 && hour <= 9) {
      hour = '0' + hour
    }
    if (minute >= 0 && minute <= 9) {
      minute = '0' + minute
    }
    if (second >= 0 && second <= 9) {
      second = '0' + second
    }
    const time = (parseInt(year) > 0 ? (year + '年') : '') + (parseInt(day) > 0 ? (day + '天') : '') +
            (parseInt(hour) > 0 ? (hour + '时') : '') + (parseInt(minute) > 0 ? (minute + '分') : '') + second + '秒'
    return time
  },
  isLeapYear(year) {
    if ((year % 4 == 0 && year % 100 != 0) || (year % 100 == 0 && year % 400 == 0)) {
      return true
    }
    return false
  },
  /**
     * 时间格式化
     * @param {s} time 时间
     * @param {*} parmas 年月日中间分割 默认： ’-‘
     * @param {*} isTimeStamp 传入的time是否为时间戳
     * @param {*} isAll 是否要完整的带 年月日时分
     */
  TransferDataFormat(time, parmas = '-', isTimeStamp = true, isAll = true) {
    let date = ''
    if (isTimeStamp) {
      date = new Date(parseInt(time) * 1000)
    } else {
      date = new Date(time.replace(new RegExp(/-/gm), '/'))
    }
    let month = date.getMonth() + 1
    let strDate = date.getDate()
    let hour = date.getHours()
    let min = date.getMinutes()
    let second = date.getSeconds()
    if (month >= 1 && month <= 9) {
      month = '0' + month
    }
    if (strDate >= 0 && strDate <= 9) {
      strDate = '0' + strDate
    }
    if (hour >= 0 && hour <= 9) {
      hour = '0' + hour
    }
    if (min >= 0 && min <= 9) {
      min = '0' + min
    }
    if (second >= 0 && second <= 9) {
      second = '0' + second
    }
    const arr = []
    let currentdate = ''
    currentdate = date.getFullYear() + parmas + month + parmas + strDate
    arr.push(currentdate)
    const currenttime = hour + ':' + min
    if (isAll) {
      return currentdate + ' ' + currenttime
    }
    arr.push(currenttime)
    arr.push(strDate)
    return arr
  },
  /**
     * 数据格式化工具
     * @param data 需要格式化的数据
     * @param end 是否需要后缀，K,M,G,T
     * @param keep_len end为True的情况下，保留位数 如：10000000， 若keep_len=6 则返回10,000k, 若kee_len=3则,返回10G
     * @returns {string} 格式化的结果
     */
  numberFormat(data, end = true, keep_len = 6) {
    if (data) {
      let data_str = data.toString()
      if (data_str.includes('.')) {
        return data.toFixed(2).replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,')
      }
      if (!end) {
        return data.toFixed(0).replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,')
      } else {
        let erase_len = 0
        if (data_str.length > keep_len) {
          erase_len = Math.floor((data_str.length - keep_len) / 3) + 1
          if (data_str.length - erase_len * 3 == 0) {
            erase_len = erase_len - 1
          }
          data_str = data_str.substring(0, (data_str.length - erase_len * 3))
          data = parseInt(data_str)
        }
        let sufix = ''
        switch (erase_len) {
          case 1:
            sufix = 'K'
            break
          case 2:
            sufix = 'M'
            break
          case 3:
            sufix = 'G'
            break
          case 4:
            sufix = 'T'
            break
          case 5:
            sufix = 'P'
            break
          default:
            break
        }
        return data.toFixed(0).replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,') + sufix
      }
    } else {
      return '0'
    }
  },
  // 存储sessionstorage数据
  setSession(key, data) {
    if (window.sessionStorage) {
      const sStorage = window.sessionStorage
      sStorage.setItem(key, data)
    }
  },
  // 获取sessionstorage数据
  getSession(key) {
    if (window.sessionStorage) {
      const sStorage = window.sessionStorage
      const data = JSON.parse(sStorage.getItem(key))
      for (const key in data) {
        if (data[key] === 'null') {
          data[key] = ''
        }
      }
      return data
    }
  },
  // 删除sessionstorage数据
  selSession(key) {
    if (window.sessionStorage) {
      const sStorage = window.sessionStorage
      sStorage.removeItem(key)
    }
  },
  // 比较两个日期大小
  dateCompare(date1, date2) {
    if (isNaN(date1) || isNaN(date2)) {
      throw new Error(date1 + ' - ' + date2)
    } else if (date1 instanceof Date && date2 instanceof Date) {
      return (date1 < date2) ? -1 : (date1 > date2) ? 1 : 0
    } else {
      throw new TypeError(date1 + ' - ' + date2)
    }
  },
  fmoney(s, n, isfixed = false) {
    n = n > 0 && n <= 20 ? n : 2
    if (!parseFloat((s + '').replace(/[^\d\.-]/g, ''))) {
      if (isfixed) {
        return '0.00'
      } else {
        return '0'
      }
    }
    s = parseFloat((s + '').replace(/[^\d\.-]/g, '')).toFixed(n) + ''
    const l = s.split('.')[0].split('').reverse()
    const r = s.split('.')[1]
    let t = ''
    for (let i = 0; i < l.length; i++) {
      t += l[i] + ((i + 1) % 3 == 0 && (i + 1) != l.length ? ',' : '')
    }
    if (isfixed) {
      return t.split('').reverse().join('') + '.' + r
    } else {
      return t.split('').reverse().join('')
    }
  },
  /**
     * 下载文件
     * @param url 文件地址
     */
  downloadFile(url, name, isblob = false) {
    const fileName = url // 文件地址
    const downName = name || url // 文件下载名称
    let blob
    if (!isblob) {
      blob = new Blob([fileName])
    } else {
      blob = fileName
    }
    if (window.navigator.msSaveOrOpenBlob) {
      // 兼容IE10
      navigator.msSaveBlob(blob, downName)
    } else {
      //  chrome/firefox
      const aTag = document.createElement('a')
      aTag.download = downName
      aTag.href = URL.createObjectURL(blob)
      aTag.click()
      URL.revokeObjectURL(aTag.href)
    }
  },
  downloadFile1(url, i) {
    const frame = document.createElement('iframe')
    frame.setAttribute('id', 'iframe_' + i)
    frame.src = url
    document.body.appendChild(frame)
    setTimeout(function() {
      document.body.removeChild(frame)
    }, 1000)
  },
  // base64转blob
  base64ToBlob(code) {
    const parts = code.split(';base64,')
    const contentType = parts[0].split(':')[1]
    const raw = window.atob(parts[1])
    const rawLength = raw.length

    const uInt8Array = new Uint8Array(rawLength)

    for (let i = 0; i < rawLength; ++i) {
      uInt8Array[i] = raw.charCodeAt(i)
    }
    return new Blob([uInt8Array], { type: contentType })
  },
  /**
     * 判断数组是否包含某个字段 并返回 下标
     * arr 数组
     * val 判断的值
     * name 需要判断的字段 默认id
     *
     */
  checkArrIsVal: function(arr, val, name = 'id') {
    for (let i = 0; i < arr.length; i++) {
      if (arr[i][name] == val) {
        return i
      }
    }
    return -1
  },
  /**
     * 判断是否 有权限
     * @param {*} list
     * @param {*} val
     */
  checkIsAuth(list, val) {
    for (const key in list) {
      if (list.hasOwnProperty(key)) {
        if (list[key].id == val && list[key].isAuth) {
          return true
        }
        if (list[key].children && list[key].children.length > 0) {
          const is = this.checkIsAuth(list[key].children, val)
          if (is) {
            return is
          }
        }
      }
    }
    return false
  },
  /**
     * 动态生成favicon.ico
     * @param {*} url favicon.ico地址
     */
  createfavicon(url) {
    const link = document.querySelector("link[rel*='icon']") || document.createElement('link')
    link.type = 'image/x-icon'
    link.rel = 'shortcut icon'
    link.href = url
    document.getElementsByTagName('head')[0].appendChild(link)
  },
  /**
     * 生成随机数
     * @param {*} n 随机数长度
     */
  createRandom(n) {
    let chars = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'],
      res = ''
    for (let i = 0; i < n; i++) {
      const id = Math.ceil(Math.random() * 35) // 10+24  因为Math.random()取不到1，所以需要往上+1,也许吧
      res += chars[id]
    }
    return res
  },
  copyclipboardData(txt) {
    const oInput = document.createElement('input')
    oInput.value = txt
    document.body.appendChild(oInput)
    oInput.select() // 选择对象
    document.execCommand('Copy') // 执行浏览器复制命令
    oInput.style.display = 'none'
    return true
  },
  getLen(arr, type) {
    let len = 0
    for (let i = 0; i < arr.length; i++) {
      if (arr[i].name == type) {
        len++
      }
    }
    return len
  },
  timestampToTime(timestamp) {
    var date = new Date(timestamp * 1000)
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    const hour = date.getHours()
    const minute = date.getMinutes()
    const second = date.getSeconds()
    return [year, month, day].map(Utils.formatNumber).join('-') + ' ' + [hour, minute, second].map(Utils.formatNumber).join(':')
  },
  formatNumber(n) {
    n = n.toString()
    return n[1] ? n : '0' + n
  },
  is_lang_zh() {
    var n = navigator
    var lang = n.languages ? n.languages[0] : (n.language || n.userLanguage)
    return (lang && lang.toLowerCase().indexOf('zh') == 0)
  },
  applyDrag(arr, dragResult) {
    const { removedIndex, addedIndex, payload } = dragResult
    if (removedIndex === null && addedIndex === null) return arr

    const result = [...arr]
    let itemToAdd = payload

    if (removedIndex !== null) {
      itemToAdd = result.splice(removedIndex, 1)[0]
    }

    if (addedIndex !== null) {
      result.splice(addedIndex, 0, itemToAdd)
    }
    return result
  },
  copyToClipboard(copyTxt, fn) {
    if (!copyTxt) {
      return false
    }
    var createInput = document.createElement('input')
    createInput.value = copyTxt
    document.body.appendChild(createInput)
    createInput.select() // 选择对象
    document.execCommand('Copy') // 执行浏览器复制命令
    createInput.className = 'createInput'
    createInput.style.display = 'none'
    // layer.msg('复制成功，可以粘贴了！');//没有layui的可以改为alert
    fn(1)
  },
  /**
     * 判断是否为今日
     * @param {*} str
     */
  isToday(str) {
    if (!str) return false
    // return (new Date().getTime() - new Date(str.replace(new RegExp(/-/gm), "/")).getTime()) < 86400000;

    var date = new Date()
    var y = date.getFullYear() // 年
    var m = (date.getMonth() + 1) <= 9 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1 // 月份从0开始的
    var d = date.getDate() <= 9 ? '0' + date.getDate() : date.getDate() // 日
    return str.replace(new RegExp(/-/gm), '/').split(' ')[0] == (y + '/' + m + '/' + d)
  },
  getToFixed(value, params = 2) {
    if (value == undefined || value == null || value == '') return ''
    if (!(typeof value === 'number' && !isNaN(value))) {
      return value
    }
    return value.toFixed(params)
  }
}
// console.log(Utils)
export default Utils
