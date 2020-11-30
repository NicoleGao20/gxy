<template>
  <div class="wechat-marketing-container">
    <header style="padding: 10px">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="素材群发" name="wechatGroupMessage">
          <wechatGroupMessage v-if="activeName === 'wechatGroupMessage'" ref="wechatGroupMessage"/>
        </el-tab-pane>
        <el-tab-pane label="模板消息" name="wechatTempMessage">
          <wechatTempMessage v-if="activeName === 'wechatTempMessage'" ref="wechatTempMessage"/>
        </el-tab-pane>
        <el-tab-pane label="素材群发日志" name="wechatGroupMsgLog">
          <wechatGroupMsgLog v-if="activeName === 'wechatGroupMsgLog'" ref="wechatGroupMsgLog"/>
        </el-tab-pane>
        <el-tab-pane label="模板消息日志" name="wechatTemplateMsgLog">
          <wechatTemplateMsgLog v-if="activeName === 'wechatTemplateMsgLog'" ref="wechatTemplateMsgLog"/>
        </el-tab-pane>
      </el-tabs>
    </header>
  </div>
</template>
<script>
import wechatGroupMessage from './wechatGroupMessage'
import wechatTempMessage from './wechatTempMessage'
import wechatGroupMsgLog from './wechatGroupMsgLog'
import wechatTemplateMsgLog from './wechatTemplateMsgLog'
export default {
  name: 'WechatMange',
  components: { wechatGroupMessage, wechatTempMessage, wechatGroupMsgLog, wechatTemplateMsgLog },
  data() {
    return {
      activeName: 'wechatGroupMessage'
    }
  },
  created() {
    if (this.$route.query && this.$route.query.activeName) {
      this.activeName = this.$route.query.activeName
    }
  },
  beforeRouteEnter(to, from, next) {
    if (!to.query.activeName) {
      next({ path: to.path, query: { activeName: 'wechatGroupMessage' }})
    } else {
      next()
    }
  },
  methods: {
    handleClick(tab, event) {
      this.$router.push({
        path: this.$route.path,
        query: { activeName: tab.name }
      })
    }
  }
}
</script>
<style lang="less" scoped>
.wechat-marketing-container {
  background-color: #fff;
}
</style>
