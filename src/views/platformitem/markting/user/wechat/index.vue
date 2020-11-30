<template>
  <el-container class="wechat-fan-container">
    <el-main class="wechat-fan">
      <el-tabs v-model="tabName" type="card" tab-position="top" @tab-click="handleTabClick">
        <el-tab-pane label="粉丝列表" name="fan" class="cia-pane-content">
          <wechat-fan-list ref="fan"/>
        </el-tab-pane>
        <el-tab-pane label="黑名单" name="black">
          <wechat-black-order ref="black"/>
        </el-tab-pane>
      </el-tabs>
    </el-main>
  </el-container>
</template>

<script>
import WechatFanList from '@/views/platformitem/markting/user/wechat/wechatFanList'
import WechatBlackOrder from '@/views/platformitem/markting/user/wechat/wechatBlackOrder'

export default {
  name: 'Index',
  components: { WechatFanList, WechatBlackOrder },
  data() {
    return {
      tabName: 'fan'
    }
  },
  created() {
    if (this.$route.query && this.$route.query.tabName) {
      this.tabName = this.$route.query.tabName
    }
  },
  methods: {
    handleTabClick(tab) {
      this.tabName = tab.name
      this.$router.push({ path: this.$route.path, query: { activeName: 'wechatFanList', tabName: this.tabName }})
    }
  }
}
</script>

<style lang="less" scoped>
.wechat-fan-container {
  width: 100%;
  min-height: 100%;
 /deep/ .el-tabs--card > .el-tabs__header {
   border-bottom: transparent !important;
 }
  /deep/ .el-tabs__item {
    background-color: #f4f7fa;
    border-bottom: 1px solid #E4E7ED;
    &.is-active {
      background-color: #fff;
    }
  }
  .wechat-fan {
    max-width: 100%;
    min-height: 100%;
    background-color: #fff;
  }
}
</style>
