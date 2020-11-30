<template>
  <el-container class="material-manage-container">
    <el-main class="material-manage">
      <el-tabs v-model="activeName" type="card" tab-position="top" @tab-click="handleTabClick">
        <el-tab-pane label="文本短信" name="smsmaterial">
          <SMSTemplate v-if="activeName === 'smsmaterial'"/>
        </el-tab-pane>
        <el-tab-pane label="数字短信" name="mmsmaterial">
          <MMSTemplate v-if="activeName === 'mmsmaterial'"/>
        </el-tab-pane>
      </el-tabs>
    </el-main>
  </el-container>
</template>

<script>
import SMSTemplate from '@/views/platformitem/markting/sms/SMSTemplate'
import MMSTemplate from '@/views/platformitem/markting/mms/MMSTemplate'

export default {
  name: 'smsmaterial',
  components: { SMSTemplate, MMSTemplate },
  data() {
    return {
      activeName: 'smsmaterial'
    }
  },
  created() {
    // if(this.$route.query&&this.$route.query.activeName){
    //   this.activeName = this.$route.query.activeName
    // }
  },
  methods: {
    handleTabClick(tab) {
      this.activeName = tab.name
      // this.$router.push({
      //   path: this.$route.path,
      //   query: {activeName: this.activeName}
      // })
    }
  }
}
</script>

<style lang="less" scoped>
.material-manage-container {
  padding: 20px;
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
  .material-manage {
    max-width: 100%;
    min-height: 100%;
    background-color: #fff;
  }
}
</style>
