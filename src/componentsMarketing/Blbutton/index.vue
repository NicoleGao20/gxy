<template>
  <div :style="blStyle" :class="type + ' el-button '" @click="onclick()">
    <slot/>
  </div>
</template>
<script>
export default {
  name: 'Blbutton',
  props: {
    type: {
      // primary 实心
      type: String,
      default: 'bl-button'
    },
    blStyle: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  methods: {
    onclick() {
      this.$emit('click')
    }
  }
}
</script>
<style lang="less" scoped>
  .primary{
    display: flex;
    justify-content: center;
    align-items: center;
    width: 102px;
    height:32px;
    border-radius: 0;
    background: #435a82;
    font-size: 14px;
    color: #fff;
  }
  .bl-button {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 102px;
    height:32px;
    border:1px solid #435A82;
    color: #435A82;
    font-size: 14px;
    border-radius: 0;
  }
</style>
