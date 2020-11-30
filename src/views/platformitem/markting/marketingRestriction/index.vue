<template>
  <el-container class="material-manage-container">
    <el-main class="material-manage">
      <el-tabs v-model="activeName" type="card" tab-position="top" @tab-click="handleTabClick">
        <el-tab-pane label="短信黑名单" name="smsBlacklist">
          <SMStable type="sms_blacklist" v-if="this.activeName === 'smsBlacklist'"/>
        </el-tab-pane>
        <el-tab-pane label="数据黑名单" name="dataBlacklist">
          <SMStable type="data_blacklist" v-if="this.activeName === 'dataBlacklist'"/>
        </el-tab-pane>
        <el-tab-pane label="营销白名单" name="marketingWhitelist">
          <SMStable type="marketing_whitelist" v-if="this.activeName === 'marketingWhitelist'"/>
        </el-tab-pane>
        <el-tab-pane label="防骚扰设置" name="antiHarassment">
          <antiHarassment v-if="this.activeName === 'antiHarassment'"/>
        </el-tab-pane>
      </el-tabs>
    </el-main>
  </el-container>
</template>

<script>
import SMStable from './table'
import antiHarassment from './antiHarassment'
export default {
  components:{
    SMStable,
    antiHarassment
  },
    data(){
        return {
            activeName:'smsBlacklist'
        }
    },
    methods:{
      handleTabClick(){
        
      }
    }
}
</script>


<style lang="scss" scoped>
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