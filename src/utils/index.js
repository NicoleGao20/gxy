
/**
 * Check if an element has a class
 * @param {HTMLElement} elm
 * @param {string} cls
 * @returns {boolean}
 */
export function hasClass(ele, cls) {
  return !!ele.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'))
}

/**
 * Add class to element
 * @param {HTMLElement} elm
 * @param {string} cls
 */
export function addClass(ele, cls) {
  if (!hasClass(ele, cls)) ele.className += ' ' + cls
}

/**
 * Remove class from element
 * @param {HTMLElement} elm
 * @param {string} cls
 */
export function removeClass(ele, cls) {
  if (hasClass(ele, cls)) {
    const reg = new RegExp('(\\s|^)' + cls + '(\\s|$)')
    ele.className = ele.className.replace(reg, ' ')
  }
}

/**
    * 频率控制函数， fn执行次数不超过 1 次/delay
    * @param fn{Function}     传入的函数
    * @param delay{Number}    时间间隔
    * @param options{Object}  如果想忽略开始边界上的调用则传入 {leading:false},
    *                         如果想忽略结束边界上的调用则传入 {trailing:false},
    * @returns {Function}     返回调用函数
    */

export function throttle(fn, delay, options) {
  var wait = false
  options = options || {}
  return function() {
    var that = this; var args = arguments
    if (!wait) {
      if (!(options.leading === false)) {
        fn.apply(that, args)
      }
      wait = true
      setTimeout(function() {
        if (!(options.trailing === false)) {
          fn.apply(that, args)
        }
        wait = false
      }, delay)
    }
  }
}
/**
   * 空闲控制函数， fn仅执行一次
   * @param fn{Function}     传入的函数
   * @param delay{Number}    时间间隔
   * @param options{Object}  如果想忽略开始边界上的调用则传入 {leading:false},
   *                         如果想忽略结束边界上的调用则传入 {trailing:false},
   * @returns {Function}     返回调用函数
  */
export function debounce(fn, delay, options) {
  var timeoutId; var leadingExc = false
  options = options || {}

  return function() {
    var that = this; var args = arguments
    if (!leadingExc && !(options.leading === false)) {
      fn.apply(that, args)
    }
    leadingExc = true
    if (timeoutId) {
      clearTimeout(timeoutId)
    }

    timeoutId = setTimeout(function() {
      if (!(options.trailing === false)) {
        fn.apply(that, args)
      }
      leadingExc = false
    }, delay)
  }
}

export const mixinMsgBox = {
  data() {
    return {
      delMsgOptions: {
        title: '确认提示',
        message: '确定删除数据？',
        type: 'warning',
        showCancelButton: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }
    }
  },
  methods: {
    // 如果传入options，请
    openMsgModal(callback, options) {
      this.$msgbox({
        title: options && options.title || this.delMsgOptions.title,
        message: options && options.message || this.delMsgOptions.message,
        showClose: true,
        distinguishCancelAndClose: true,
        type: options && options.type || this.delMsgOptions.type,
        showCancelButton: this.delMsgOptions.showCancelButton,
        confirmButtonText: this.delMsgOptions.confirmButtonText,
        cancelButtonText: this.delMsgOptions.cancelButtonText,
        beforeClose: debounce((action, instance, done) => {
          if (action === 'confirm') {
            instance.confirmButtonLoading = true
            instance.confirmButtonText = '执行中...'
            callback(() => {
              done()
              instance.confirmButtonLoading = false
            })
          } else {
            instance.confirmButtonLoading = false
            done()
          }
        }, 300, { trailing: false })
      }).catch((data) => {
        console.log(data)
      })
    }
  }
}

export const mixinDel = {
  data() {
    return {
      delMsgOptions: {
        title: '确认提示',
        message: '确定删除数据？',
        type: 'warning',
        showCancelButton: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }
    }
  },
  methods: {
    // 如果传入options，请
    openDeleteModal(callback, options) {
      if (!options) options = {}
      this.$msgbox({
        dangerouslyUseHTMLString: options.dangerouslyUseHTMLString || false,
        title: options && options.title || this.delMsgOptions.title,
        message: options && options.message || this.delMsgOptions.message,
        showClose: true,
        distinguishCancelAndClose: true,
        type: options && options.type || this.delMsgOptions.type,
        showCancelButton: this.delMsgOptions.showCancelButton,
        confirmButtonText: this.delMsgOptions.confirmButtonText,
        cancelButtonText: this.delMsgOptions.cancelButtonText,
        beforeClose: debounce((action, instance, done) => {
          if (action === 'confirm') {
            instance.confirmButtonLoading = true
            instance.confirmButtonText = '执行中...'
            callback(() => {
              done()
              instance.confirmButtonLoading = false
            })
          } else {
            instance.confirmButtonLoading = false
            done()
          }
        }, 300, { trailing: false })
      }).catch((data) => {
        console.log(data)
      })
    }
  }
}

/* eslint-disable */

Date.prototype.Format = function(fmt) {
  var o = {
    'M+': this.getMonth() + 1,
    'd+': this.getDate(),
    'h+': this.getHours(),
    'm+': this.getMinutes(),
    's+': this.getSeconds(),
    'q+': Math.floor((this.getMonth() + 3) / 3),
    'S': this.getMilliseconds()
  }
  if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length))
  for (var k in o) if (new RegExp('(' + k + ')').test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
  return fmt
}

/*
* 驼峰转下划线
*/
export function camel2UnderLine(str) {
  return str.replace(/([A-Z])/g, "_$1").toUpperCase()
}

/*
* 下划线转驼峰
*/
export function underLine2Camel(str) {
  return str.replace(/_(\w)/g, function () {
    let args = arguments;
    return args[1].toUpperCase();
  });
}

window.mixinDel = mixinDel
