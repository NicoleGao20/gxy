<template>
  <div style="position:relative; overflow: auto;">
    <p class="tip">说明：节点间流失人群包括过滤、退订、账号异常、无需求ID账号、非会员人群等</p>
    <marketing-report :activity-qs="activityQs" @sendData="sendFath" @setData="setDataAnalysis"/>
  </div>
</template>
<script>
import marketingReport from './../../marketingSetting/marketingReport/index'
export default {
  components: {
    marketingReport
  },
  props: {
    activityQs: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  methods: {
    sendFath(val) {
      this.$emit('putFlowData', val)
    },
    setDataAnalysis(val) {
      this.$emit('putDataAnalysis', val)
    }
  }
}
</script>
<style lang="less" scoped>
.tip{
  position: absolute;
  top: 0px;
  left: 0px;
  width: 280px;
  white-space: wrap;
  line-height: 1.6;
  color: #303133;
}
</style>
