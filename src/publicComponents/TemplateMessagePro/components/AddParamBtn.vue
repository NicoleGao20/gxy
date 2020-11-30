<template>
  <div class="addparamBtn" @mousedown="onmousedown($event)" @click="onclick(btnName)">
    {{ btnName }}
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
      default() {
        return () => {}
      }
    }
  },
  methods: {
    onmousedown(e) {
      // 现代浏览器阻止默认事件
      if (e && e.preventDefault) {
        e.preventDefault()
      } else { window.event.returnValue = false }
      return false
    },
    onclick() {
      const se = window.getSelection()
      console.log('se', se)
      if (se.baseNode && se.baseNode.parentNode && (se.baseNode.className === 'editable' || se.baseNode.parentNode.className === 'editable')) {
        this.onadd(this.btnName)
      } else {
        this.$message({
          message: '请先点击多行输入框，然后再点击插入参数',
          type: 'error'
        })
        return false
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
    margin-bottom: 6px;
    background-color: rgba(236, 245, 255, 1);
  }
</style>
