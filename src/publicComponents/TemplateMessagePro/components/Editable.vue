<template>
  <div :ref="domref" class="editable" contenteditable="true" @focus="onfouc($event)" @blur="onblur($event)" @input="computeMaxNum()"/>
</template>
<script>
export default {
  name: 'Editable',
  props: {
    placeholder: {
      type: String,
      default: ''
    },
    value: {
      type: String,
      default: ''
    },
    domref: {
      type: String,
      default: ''
    },
    maxNum: {
      type: Number,
      default: 0
    },
    contentLength: {
      type: Number,
      default: 0
    },
    onChange: {
      type: Function,
      default() {
        return () => {}
      }
    }
  },
  data() {
    return {
    }
  },
  created() {
  },
  mounted() {
    this.$refs[this.domref].addEventListener('DOMSubtreeModified', () => {
      this.computeMaxNum()
    }, false)
    // this.bindEvents()
  },
  methods: {
    bindEvents() {
      // console.log('editor', this.$refs[this.domref])
      document.addEventListener('selectionchange', (e) => {
        const element = e.target.activeElement
        if (element.className !== 'editable') {
          return // 不是编辑器
        }
        let start
        let txt = ''
        if (window.getSelection) { // 判断是否支持document.selection属性
          const se = window.getSelection() // 获取Selection对象
          // console.log('se', se)
          start = se.anchorOffset // 获取起始位置，这个是字符的序号位置，而不是坐标
          const end = se.focusOffset // 获取结束位置
          const startEl = se.anchorNode.parentElement // 获取起始的dom元素
          const endEl = se.focusNode.parentElement // 获取结束的dom元素
          const startText = startEl.innerText // 获取起始dom元素的文本内容
          if (startEl === endEl) {
            txt = startText.substring(start, end)
          }
        } else if (e.selectionStart || e.selectionStart === '0') {
          // firefox
          start = e.selectionStart
        }
        // console.log('start', start)
        console.log('txt', txt)
        this.cursorIndex = start
        element.cursorIndex = start
        return start
      })
    },
    onfouc() {
      // let targetHtml = this.$refs[this.domref].innerHTML
      // console.log('targetHtml', targetHtml)
      // if (targetHtml === this.placeholder) {
      //   this.$refs[this.domref].innerHTML = ''
      // }
    },
    onblur() {
      const traget = this.$refs[this.domref].innerHTML
      if (traget === '') {
        this.$refs[this.domref].innerHTML = this.placeholder
      }
    },
    computeMaxNum() {
      const dom = this.$refs[this.domref].childNodes
      let result = ''
      dom.forEach(element => {
        if (element.tagName) {
          result += element.value
        } else {
          let textContent = element.textContent
          textContent = textContent.replace(/({)/g, '').replace(/(})/g, '')
          result += textContent
        }
      })
      this.$refs[this.domref].data = result
      // console.log('result', result)
      this.onChange(result)
    }
  }
}
</script>
<style lang="less" scoped>
  .editable {
    width: 100%;
    height: 100%;
    padding: 5px;
    overflow: auto;
  }
</style>
