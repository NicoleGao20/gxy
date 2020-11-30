<template>
  <div class="page-container-gap">
    <header style="padding: 10px">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="数字化短信群发" name="MMSGroup">
          <massSend v-if="activeName === 'MMSGroup'"/>
        </el-tab-pane>
        <el-tab-pane label="数字化短信日志" name="mmsSendLog">
          <MMSLog v-if="activeName === 'mmsSendLog'"/>
        </el-tab-pane>
         
      </el-tabs>
    </header>
  </div>
</template>
<script>
import MMSLog from "./MMSLog"
import massSend from "./massSendingMMS"
export default {
  name: 'mmsMange',
  components: { MMSLog, massSend },
  data() {
    return {
      activeName: "MMSGroup",
    };
  },
  methods: {
    handleClick(tab, event) {
      console.log(tab, event);
    },
  },
  created(){
    if(this.$route.query.activeName){
      if(this.$route.query.activeName === 'MMSGroup' || this.$route.query.activeName === 'mmsSendLog'){
        this.activeName = this.$route.query.activeName
      }
    }
  }
};
</script>

<style lang="less">
.crmArchivesList {
  padding: 0 15px;
  header {
    margin: 15px 0;
    overflow: hidden;
  }
}
</style>
