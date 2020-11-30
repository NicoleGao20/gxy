<template>
  <div>
    <div v-if="openTip" class="template-info-tip">
      <span class="el-icon-close template-info-close-icon" @click="closeTip"/>
      <ul>
        <li class="tip-item">
          <span class="red-dot"/>当前模版无法满足营销场景需求，建议使用空白画布创建营销活动
        </li>
        <li class="tip-item">
          <span class="red-dot"/>点击下方操作栏，使用模版按钮，可进行活动编辑
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
export default {
  name: 'TemplateInfoTip',
  data() {
    return {
      openTip: true
    }
  },
  methods: {
    closeTip() {
      this.openTip = false
    }
  }
}
</script>
<style scoped>
.template-info-tip {
  left: 50px;
  top: 50px;
  position: absolute;
  width: 450px;
  padding: 10px;
  z-index: 200;
  border-radius: 4px;
  box-shadow: 0 0 3px rgba(0,0,0,.2);
  background: rgba(255,255,255,.8);
}
.template-info-close-icon {
  position: absolute;
  right: 5px;
  top: 5px;
  cursor: pointer;
  color: #666;
}
.tip-item {
  position: relative;
  padding-left: 14px;
  line-height: 26px;
  color: #666;
}
.red-dot {
  position: absolute;
  top: 50%;
  left: 5px;
  transform: translate(-50%, -50%);
  background: #ff5135;
  display: inline-block;
  width: 6px;
  height: 6px;
  border-radius: 50%;
}
</style>
