<template>
  <div :ref="domref" :style="'color:'+color" class="editable" contenteditable="true" @focus="onfouc($event)" @blur="onblur($event)" @input="computeMaxNum()"/>
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
    color: {
      type: String,
      default: 'black'
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
      console.log('heiheihei')
      this.$refs[this.domref].innerHTML = testA
    },
    onfouc() {
      // const traget = this.$refs[this.domref].innerHTML
      // if (traget === this.placeholder) {
      //   this.$refs[this.domref].innerHTML = ''
      // }
    },
    onblur() {
      // const traget = this.$refs[this.domref].innerHTML
      // if (traget === '') {
      //   this.$refs[this.domref].innerHTML = this.placeholder
      // }
    },
    computeMaxNum() {
      const dom = this.$refs[this.domref].childNodes
      let result = ''
      dom.forEach(element => {
        if (element.tagName) {
          result += element.value
        } else {
          result += element.textContent
        }
      })
      if (this.maxNum && result.length > this.maxNum) {
        this.$message({
          message: `字数不能超过${this.maxNum}个字`,
          type: 'warning'
        })
      }
      this.$emit('textLength', result.length)
      this.$emit('getParameter', this.parameter)
      // if (this.maxNum && result.length > this.maxNum) {
      //   this.$message({
      //     message: `字数不能超过${this.maxNum}个字`,
      //     type: 'warning'
      //   })
      // }
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
