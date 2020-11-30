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
    domref: {
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
    onChange: {
      type: Function,
      default() {
        return () => {}
      }
    },
    paramCollect: { // 参数集合
      type: Array,
      default: function() {
        return []
      }
    }
  },
  mounted() {
    this.$refs[this.domref].addEventListener('DOMSubtreeModified', () => {
      this.computeMaxNum()
    }, false)
    this.$refs[this.domref].innerHTML = this.placeholder
  },
  methods: {
    parentHandleclick(testA) {
      this.$refs[this.domref].innerHTML = testA
    },
    onfouc() {
      const traget = this.$refs[this.domref].innerHTML
      if (traget === this.placeholder) {
        this.$refs[this.domref].innerHTML = ''
      }
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
      let paramLength = 0
      dom.forEach(element => {
        if (element.tagName) {
          // result += element.value
          let valueContent = element.value
          valueContent = valueContent.replace(/({)/g, '').replace(/(})/g, '')
          // console.log('valueContent' + valueContent)
          // console.log(this.paramCollect)
          if (this.paramCollect !== undefined && this.paramCollect.length > 0) {
          // result += textContent
            this.paramCollect.forEach(item => {
              // console.log(item)
              if (item.paramKey === valueContent) {
                // console.log('paramLength' + paramLength)
                paramLength = paramLength + item.predictLength
              }
            })
          }
        } else {
          // console.log(element.textContent)
          // result += element.textContent
          // 对于参数，添加预估长度
          result += element.textContent
        }
      })
      // console.log('result' + result)
      this.$emit('textLength', result.length + paramLength)
      // if (this.maxNum && result.length > this.maxNum) {
      //   this.$message({
      //     message: `字数不能超过${this.maxNum}个字`,
      //     type: 'warning'
      //   })
      // }
      this.onChange(result)
    }
  }
}
</script>
<style lang="less" scoped>
  .editable {
    width: 100%;
    height: 100%;
    overflow: auto;
  }
</style>
