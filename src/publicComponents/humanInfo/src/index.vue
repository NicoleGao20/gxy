<template >
  <el-popover
    placement="bottom"
    trigger="hover"
    @show="handleStatus()"
  >
    <div class="staff-info-content">
      <p >账号:{{ account }}</p>
      <p>手机号:{{ phoneNum }}</p>
    </div>
    <div slot="reference"><slot/></div>
  </el-popover>
</template>
<script>
import { getEmployDetail } from '@/api/publicComponents/humanInfo.js'
export default {
  name: 'HumanInfo',
  props: {
    id:{
      type: String,
      default: ''
    },
    num: {
      type: String,
      default: ''
    },
    department: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      account:'',
      phoneNum:'',
      name:''
    }
  },
  mounted() {
   
    setTimeout(() => {
      // this.department = '百丽集团/新零 售平台/集团科技中心 /会员系统部/产品组'
    }, 500)
  },
  methods: {
    handleStatus(scope){
      this.getDetail();
    },
    getDetail(){
      getEmployDetail({id:this.id}).then((res)=>{
        this.phoneNum=res.body.phone||''
        this.account=res.body.userName||''
        this.name=res.body.name||''
        
      })
    }
  }
}
</script>
<style lang="less" scoped>
  .staff-info-content {
    max-width: 180px;
  }
</style>
