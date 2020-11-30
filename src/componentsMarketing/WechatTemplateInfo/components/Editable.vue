<template>
  <div :class="{'is-focus': isFocus}" class="editable-container">
    <div
      :ref="domref"
      :contenteditable="!$attrs['only-read']"
      class="editable"
      @focus="onfouc($event)"
      @blur="onblur($event)"
      @input="computeMaxNum('input',$event)"/>
    <el-popover
      v-if="!$attrs['only-read']"
      ref="popover"
      placement="bottom-start"
      width="350"
      trigger="click"
    >
      <span slot="reference" class="personalized-text" @click="handlePopover"><i class="el-icon-plus"/><span v-if="!onlyIcon">个性化文本</span></span>
      <div class="tips-content">
        <div class="mb10">插入个性化文本</div>
        <el-cascader
          v-if="showCascader"
          ref="cascader"
          v-model="selectedParam"
          :options="tempIndex.paramsOptions"
          :show-all-levels="false"
          :props="{ expandTrigger: 'hover'}"
          @change="tagChange"/>
      </div>
    </el-popover>
  </div>
</template>
<script>
import { getDom, convertValueToDom, getCursor, insertHtml } from '../utils'

export default {
  name: 'Editable',
  inject: ['tempIndex'],
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
        return () => {
        }
      }
    },
    onlyIcon: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      isFocus: false,
      showCascader: false,
      selectedParam: [],
      cursor: {
        sel: '',
        range: ''
      }
    }
  },
  mounted() {
    if (this.value) {
      this.$refs[this.domref].innerHTML = convertValueToDom(this.value)
    } else {
      this.$refs[this.domref].innerHTML = this.placeholder
    }
    this.$refs[this.domref].addEventListener('DOMSubtreeModified', () => {
      this.computeMaxNum('event Listener')
    }, false)
  },
  methods: {
    handlePopover() {
      if (this.cursor.sel && this.cursor.range || this.$attrs['is-new']) {
        this.showCascader = true
        this.isFocus = true
      } else {
        this.$message.error(`请点击文本框中想插入的位置`)
        this.$nextTick(() => {
          this.$refs.popover.doClose()
        })
      }
    },

    onfouc() {
      this.isFocus = true
      const target = this.$refs[this.domref].innerHTML
      if (!this.value && target === this.placeholder) {
        this.$refs[this.domref].innerHTML = ''
      }
      this.cursor = getCursor()
    },

    onblur() {
      this.$emit('triggerValidate')
      this.isFocus = false
      const target = this.$refs[this.domref].innerHTML
      if (!this.value && target === '') {
        this.$refs[this.domref].innerHTML = this.placeholder
      }
      this.cursor = getCursor()
    },
    computeMaxNum(type, event) {
      if (!this.value && this.$refs[this.domref].innerHTML === this.placeholder) return
      this.$emit('triggerValidate')
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
      this.$emit('update:value', result)
      this.onChange(result)
    },
    tagChange() {
      this.insertAtCaret()
      this.selectedParam = []
      this.$refs.popover.doClose()
      this.showCascader = false
    },

    insertAtCaret() {
      const value = this.selectedParam && this.selectedParam[1]
      const html = getDom(value)
      if (this.selectedParam) {
        if (!this.value && this.$refs[this.domref].innerHTML === this.placeholder) {
          this.$refs[this.domref].innerHTML = ''
        }
        if (this.cursor.sel && this.cursor.range) {
          insertHtml(html, this.cursor, this.$refs[this.domref])
        } else {
          this.$refs[this.domref].focus()
          this.insertAtCaret()
        }
      } else {
        this.$message('请选择参数')
      }
    }
  }
}
</script>
<style lang="less" scoped>
.editable-container {
  background: #fff;
  border: 1px solid rgb(220, 223, 230);
  border-radius: 2px;
  display: flex;
  justify-content: space-between;
  align-items: center;

  &.is-focus {
    border: 1px solid #01337A;
  }
}
.mb10 {
  margin-bottom: 10px
}
.editable {
  flex: 1;
  width: 100%;
  height: 100%;
  overflow: auto;
  border-right: none;
  padding: 0 30px 0 15px;
  font-size: 12px;
  min-height: 30px;
  line-height: 30px;
  opacity: 0.8;
  box-sizing: border-box;
  word-break: break-word;
}

.personalized-text {
  background: #fff;
  color: #649eee;
  cursor: pointer;
  padding-right: 20px;
}
</style>
