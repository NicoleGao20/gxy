<template>
  <div class="page-container-gap">
    <header style="padding: 10px">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="短信群发" name="SMSGroup">
        <SMSGroup @changeId="changeId"/>
        </el-tab-pane>
        <el-tab-pane label="短信反馈" name="SMSFeedback">
        <SMSFeedback/>
        </el-tab-pane>
        <el-tab-pane label="短信签名" name="smsSignature">
        <smsSignature/>
        </el-tab-pane>
        <el-tab-pane label="短信日志" name="smssendlog">
        <smssendlog v-if="this.activeName === 'smssendlog'" :sid="id" @back="back"/>
        </el-tab-pane>
         
      </el-tabs>
    </header>
  </div>
</template>
<script>
import SMSGroup from "./SMSGroup"
import smssendlog from "./smssendlog"
import smsSignature from "./smsSignature"
import SMSFeedback from "./SMSFeedback"
export default {
  name: 'smsMange',
  components: { SMSGroup,smssendlog,SMSFeedback,smsSignature},
  data() {
    return {
      activeName: "SMSGroup",
      id:''
    };
  },
  methods: {
    handleClick(tab, event) {
      this.id = ''
    },
    changeId(id){
      this.id = id
      this.activeName = 'smssendlog'
    },
    back(){
      this.id = ''
      this.activeName = 'SMSGroup'
    }
  },
  created(){
    if(this.$route.query.activeName){
      if(this.$route.query.activeName === 'SMSGroup' || this.$route.query.activeName === 'SMSFeedback' || this.$route.query.activeName === 'smsSignature' || this.$route.query.activeName === 'smssendlog'){
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
