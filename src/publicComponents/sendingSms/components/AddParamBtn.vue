<template>
  <div class="addparamBtn" @mousedown="onmousedown($event)" @click="onclick(btnName)">
    {{btnName}}
  </div>
</template>
<script>
export default {
  name: 'AddParamBtn',
  props: {
    btnName: {
      type: String,
      default: ''
    },
    onadd: {
      type: Function,
      default () {
        return () => {}
      }
    }
  },
  methods: {
    onmousedown (e) {
      // 现代浏览器阻止默认事件
      if (e && e.preventDefault) {
        e.preventDefault()
      } else { window.event.returnValue = false }
      return false
    },
    onclick () {
      const baseNode = window.getSelection().baseNode
      const isEditable = baseNode && (baseNode.className === 'editable' || baseNode.parentElement.className === 'editable' || baseNode.parentElement.parentElement.className === 'editable')
      if (isEditable) {
        this.onadd(this.btnName)
      } else {
        this.$message.error('请指定插入参数位置')
      }
    }
  }
}
</script>
<style>
  .addparamBtn {
    cursor:pointer;
    padding: 5px 15px !important;
    border-width: 1px;
    border-style: solid;
    border-color: rgba(179, 216, 255, 1);
    border-radius: 4px;
    font-family: '微软雅黑';
    font-weight: 400;
    font-style: normal;
    font-size: 12px;
    color: #366CB3;
    margin-right: 10px;
    margin-bottom: 5px;
    background-color: rgba(236, 245, 255, 1);
  }
</style>
