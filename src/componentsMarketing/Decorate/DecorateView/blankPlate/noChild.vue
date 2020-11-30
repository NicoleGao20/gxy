<template>
  <div class="blank-no-child-content">
    <p>未添加子元素</p>
    <div>
      请从左侧『组件』工具栏中拖入『元素』以添加，或选取一个预置的布局模版。
    </div>
    <button @click="changeTemplatePop">选择常用布局</button>
  </div>
</template>
<script>
export default {
  name: 'NoChild',
  methods: {
    changeTemplatePop() {
      this.$store.dispatch('templateShow', true)
    }
  }
}
</script>
<style lang="less" scoped>
.blank-no-child-content {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 100;
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  padding: 20px;
  background: #F5F5F5;
  p {
    font-size:24px;
  }
  div {
    font-size: 14px;
    color: #58666e;
    padding: 20px 0;
    border-bottom: 1px solid #ddd;
  }
  button {
    width: 104px;
    height: 29px;
    margin-top: 20px;
    background: #108cee;
    color: #fff;
    font-size: 12px;
    border: none;
  }
}
</style>
