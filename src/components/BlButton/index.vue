<template>
  <section @click="onclick()" @mousedown="onmousedown($event)">
    <div :id="id">
      <div v-if="beClass" :class="`${beClass} bl-button-common`" ><slot/></div>
      <el-button
        v-if="!beClass"
        :type="elButtonObj.type ? elButtonObj.type : ''"
        :size="elButtonObj.size ? elButtonObj.size : ''"
        :plain="elButtonObj.plain"
        :round="elButtonObj.round"
        :circle="elButtonObj.circle"
        :loading="elButtonObj.loading"
        :icon="elButtonObj.icon"
        :autofocus="elButtonObj.autofocus"
      >
        <slot/>
      </el-button>
    </div>
  </section>
</template>
<script>
export default {
  name: 'BlButton',
  props: {
    isMousedown: { // 是否需要阻止默认事件
      type: Boolean,
      default: false
    },
    href: { // 链接，有传值的时候为A标签，没传值为按钮
      type: String,
      default: ''
    },
    id: { // 按钮id 可选
      type: String,
      default: ''
    },
    name: { // 按钮名称
      type: String,
      default: ''
    },
    beClass: { // 自定义按钮类名
      type: String,
      default: ''
    },
    elButtonObj: { // element-ui 按钮 当beclass 没有值的时候用element-ui样式
      type: Object,
      default() {
        return {
          type: '',
          size: '',
          plain: false,
          round: false,
          circle: false,
          loading: false,
          disabled: false,
          icon: '',
          autofocus: false
        }
      }
    }
  },
  data() {
    return {
    }
  },
  mounted() {
    console.log()
  },
  methods: {
    onclick() { // 百度埋点
      window._hmt.push(['_trackEvent', this.$router.history.path, this.$slots.default[0].text])
      this.$emit('onclick')
      if (this.href) {
        window.location.href = '/#/'
      }
    },
    onmousedown(e) {
      // 现代浏览器阻止默认事件
      if (this.isMousedown && e && e.preventDefault) {
        e.preventDefault()
      } else { window.event.returnValue = false }
      return false
    }
  }
}
</script>
<style>
.belle-control {
  cursor: pointer;
}
.bl-button-common {
  display: inline-block;
  line-height: 1;
  white-space: nowrap;
  cursor: pointer;
  background: #FFF;
  border: 1px solid #DCDFE6;
  color: #606266;
  -webkit-appearance: none;
  text-align: center;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  outline: 0;
  margin: 0;
  -webkit-transition: .1s;
  transition: .1s;
  font-weight: 500;
  -ms-user-select: none;
  padding: 9px 15px;
  font-size: 14px;
  border-radius: 4px;
}
</style>
