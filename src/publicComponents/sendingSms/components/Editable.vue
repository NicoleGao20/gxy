<template>
  <div  @focus="onfouc($event)" @blur="onblur($event)" class="editable"  :contenteditable="contenteditable" @input="computeMaxNum()">{{placeholder}}</div>
</template>
<script>
import extractText from '../utils/extractText.js'
export default {
  name: 'Editable',
  props: {
    placeholder: {
      type: String,
      default: ''
    },
    editableTextarea: {
      type: String,
      default: ''
    },
    parameter: {
      type: String,
      default: ''
    },
    maxNum: {
      type: Number,
      default: 0
    },
    contenteditable: {
      type: Boolean,
      default: true
    }
  },

  mounted () {
    var editableTextarea = (this.editableTextarea || '').replace('\n', '<br>')
    editableTextarea = editableTextarea.replace(/{([^{}]+)}/g, (match, p1) => `<input type="text" style="display:inline-block;border:none;color:#0a8ddf;width:${this.createDom(p1)}px;text-align:center"  class="sms-add-value" value="{${p1}}" readonly/>`)
    this.$el.innerHTML = editableTextarea
    this.$el.addEventListener('DOMSubtreeModified', () => {
      this.computeMaxNum()
    }, false)
    // 禁止输入 大括号
    this.$el.addEventListener('keydown', (e) => {
      let currKey = 0
      e = event || window.event
      currKey = e.keyCode || e.which || e.charCode
      if (currKey === 219 || currKey === 221) {
        e.preventDefault()
      }
    }, false)
    // 解决复制不是纯文本问题
    document.querySelector('div[contenteditable="true"]').addEventListener('paste', function (e) {
      e.stopPropagation()
      e.preventDefault()
      var text = ''; var event = (e.originalEvent || e)
      if (event.clipboardData && event.clipboardData.getData) {
        text = event.clipboardData.getData('text/plain')
      } else if (window.clipboardData && window.clipboardData.getData) {
        text = window.clipboardData.getData('Text')
      }
      if (document.queryCommandSupported('insertText')) {
        document.execCommand('insertText', false, text)
      } else {
        document.execCommand('paste', false, text)
      }
    })
  },
  methods: {
    createDom (data) {
      // 创建节点
      var sbox = document.createElement('span')

      // 设置节点id
      sbox.id = 'lswtColse'

      // 设置节点属性
      sbox.style.top = '-100000px'
      sbox.style.right = '0px'
      sbox.style.fontSize = '12px'
      sbox.style.position = 'absolute'
      sbox.innerHTML = `{ ${data} }`
      document.body.appendChild(sbox)
      return sbox.offsetWidth + 20
    },
    onfouc () {
      let traget = this.$el.innerHTML
      if (traget === this.placeholder) {
        this.$el.innerHTML = ''
      }
    },
    onblur () {
      let traget = this.$el.innerHTML
      if (traget === '') {
        this.$el.innerHTML = this.placeholder
      }
    },
    computeMaxNum () {
      // const dom = this.$el.childNodes
      let result = extractText(this.$el)
      // dom.forEach(element => {
      //   if (element.tagName) {
      //     result += element.value
      //   } else {
      //     result += element.textContent
      //   }
      // })

      let traget = this.$el.innerHTML
      if (traget === this.placeholder) {
        this.$emit('update:editableTextarea', '')
      } else {
        this.$emit('update:editableTextarea', result)
      }

      if (this.maxNum && result.length > this.maxNum) {
        this.$message({
          message: `字数不能超过${this.maxNum}个字`,
          type: 'warning'
        })
      }
    }
  }
}
</script>
<style lang="less" scoped>
  .editable {
    width: 100%;
    height: 100%;
    overflow: auto;
    font-size: 12px;
  }
</style>
