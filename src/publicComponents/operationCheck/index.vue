<template>
  <div class="container-operation-check">
    <el-dialog
      :title="title"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      @close="closeModel"
      width="30%"
      class="namePhone"
    >
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" class="checkModel">
        <el-form-item prop="value"> 
          <el-select
            filterable 
            size="small"
            class="verifUser"
            v-model="ruleForm.verifUser"
            placeholder="请选择验证人"
            @change="verifierChange($event)">
            <template v-for="item in verifierNameList">
              <el-option
                :key="item.id"
                :label="item.validate_user_name"
                :value="item.id"
              ></el-option>
            </template>
          </el-select>
        </el-form-item>
        <el-form-item prop="verificationKey">
          <el-input
            size="small"
            class="verificationKey"
            placeholder="请输入验证码"
            v-model="ruleForm.verificationCode"
            clearable
          ></el-input>
          <el-button
            @click="verification('ruleForm')"
            :disabled="tiemBoole"
            >{{ tiemBoole ? "发送验证码"+time : "发送验证码" }}</el-button>
          </el-form-item>
          <el-button
            class="submitButton"
            type="primary"
            @click="submit"
            size="small"
            >{{btnText}}</el-button>
          <el-button @click="closeModel">取消</el-button>
      </el-form>
    </el-dialog>
  </div>
</template>
<script type="text/javascript">
import { queryVerifierName,sendDownloadCheckMsg,checkVerificationCode } from '@/api/employ'
export default {
  name: 'container-operation-check',
  props: {
     //安全验证人，当requestType为空时，查询的是下载数据验证人。当requestType =='t2'时，查询的是账号删除验证人
    requestType:{
      type: String,
      default: ''
    },
    btnText: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    },
    dialogVisible: {
      type:Boolean ,
      default () { return false }
    },
    
  },
  data () {
    return {
      keyCode:'',
      time:11,
      timer:null,
      tiemBoole: false,
      dataId:'',
      validateList:[],
      validate_id: "",
      verifierNameList:[],
      disabled:true,
      ruleForm:{
        verificationCode:'',
        verifUser:''
      },
      rules:{},
    }
  },
  watch: {
    
  },
  mounted () {
   this.ruleForm.verificationCode=''
   this.verifUser=''
    // 查询校验人list数据
    this.VerifierUseList()
  },
   beforeDestroy() {
    if(this.timer) { //如果定时器在运行则关闭
      clearInterval(this.timer); 
    }
  },
  methods: {
    closeModel(){
         this.$emit('update:dialogVisible',false);
    },
    submit() {
      if(!this.ruleForm.verifUser){
        this.$message.error('验证人不能为空');
         return
      }
      else if(!this.ruleForm.verificationCode){
        this.$message.error('验证码不能为空');
         return
      }
      let params = {
        verificationCode: this.ruleForm.verificationCode,
        verificationKey: this.keyCode,
        id: this.validate_id,
      };
      checkVerificationCode(params).then((res) => {
          if (res.code === "1") {
            // this.dialogVisible = false;
            this.$emit('update:dialogVisible',false);
            this.$emit('submitCheckResult',{mobile: this.validate_user_mobile,keyCode: this.keyCode})
          } else {
            this.dialogVisible = true;
            // this.$message.error("验证失败,请重新操作");
          }
        })
        .catch((err) => {
          this.$message.error(`${err}`);
        });
    },
       //点击发送验证码
    verification(formName) {
     
      if(!this.ruleForm.verifUser){
         this.$message.error('验证人不能为空');
         return
      }
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.time = 61;
          this.setTime();
          const params = { validate_user_mobile: this.validate_user_mobile };
          sendDownloadCheckMsg(params).then((res) => {
            if (res.code === "1") {
              this.keyCode = res.data.key|| '';
            } else if (res.code === "2") {
              this.time = 61;
              this.setTime('clear')
            }
          });
        } 
      });
    },
    //切换手机号
    verifierChange(id) {
      let validate_list = this.verifierNameList.filter((item) => { return item.id == id})
      validate_list.map((item) => {
        this.validate_id = item.id;
        this.validate_user_mobile = item.validate_user_mobile;
      });
    }, 
    VerifierUseList(row) {
      // this.dataId = row.id;
      let params = {};
    
      if(this.requestType){
        params.type=this.requestType
      }
      queryVerifierName(params).then((res) => {
        if (res.code === "1") {
          this.verifierNameList = res.data.list || [];
        }
      });
    },
    setTime(type) {
      if(type){
        clearInterval(this.timer)
      }else{
        this.timer = setInterval(() => {
          this.time--;
          if(this.time ==60){
            this.tiemBoole = true;
            this.time = 60
          }
          else if(this.time > 11 && this.time < 60){
            this.tiemBoole = true;
          }
          else if (this.time > 0 && this.time < 10) {
            this.tiemBoole = true;
            this.time = "0" + this.time;
          }
          else if(this.time ==0) {
            this.tiemBoole = false;
            this.time = 0;
            clearInterval(this.timer);
          }
          console.log(this.time,8888)
        }, 1000);
      }
   
    },
  }
}
</script>
<style  lang="less" scoped>
  .namePhone {
    .checkModel{
      text-align: center;
      width:300px ;
    }
    .verificationKey{
      width: 177px;
    }
    .verifUser{
      width: 280px; 
    }
    /deep/ .el-dialog__body {
      display: flex;
      flex-direction: column;
      align-items: center;
       .el-col {
        width: 80%;
         .el-input__inner {
          border: 0;
          border-bottom: 1px solid #eee;
          padding: 23px 0;
        }
         .el-select {
          width: 100% !important;
        }
        button {
          float: right;
          margin-top: 15px;
        }
        button:first-of-type{
            position: absolute;
            bottom: 39%;
            right: 31%;
        }
        button:last-of-type{
            width: 100%;
            background: #4a4e52;
            color: #fff;
            border-radius: 23px;
            height: 44px;
            margin-top:27px;
            
        }
      }
    }
  }
</style>
