<template>
<!-- :class="[informationGialog===false?'contaion-scroll':'contaion-name']" -->
  <div :class="[isScroll===false?'contaion-scroll':'contaion-name']">
    <ul v-for="(item,index) in list" :key="index">
      <li>
        <span></span>
        <div class="contaion-userName">
          <span>验证人姓名:{{item.validate_user_name}}</span>
          <span>手机号码:{{item.validate_user_mobile}}</span>
        </div>
      </li>
      <li>
        <button @click="edit(item,index)">
          <i class="el-icon-edit"></i>
          <span>编辑</span>
        </button>
        <button @click="deleteContent(item)">
          <i class="el-icon-delete"></i>
          <span>删除</span>
        </button>
      </li>
      <el-row></el-row>
    </ul>
    <el-dialog title="删除人信息" :visible.sync="dialogVisible" width="30%">
      <div class="page-informationName">
        <span>验证人姓名:{{personalInfo.validate_user_name}}</span>
        <span>验证人手机号码:{{personalInfo.validate_user_mobile}}</span>
      </div>
      <span class="page-informationBoole">确认删除以上信息吗？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="deleteName(personalInfo)">确 定</el-button>
      </span>
    </el-dialog>
    <!-- <el-dialog
  title="提示"
  :visible.sync="dialogName"
  width="30%"
  >
  <el-input v-model="inputName" placeholder="请输入登录账号"></el-input>
  <span slot="footer" class="dialog-footer">
    <el-button @click="dialogName = false">取 消</el-button>
    <el-button type="primary" @click="comfirmName">确 定</el-button>
  </span>
</el-dialog> -->
      <el-dialog title="请输入验证信息" :visible.sync="dialogFormVisible" :show-close="false">
          <el-form
            :model="form"
            :rules="rules"
            ref="form"
            label-width="100px"
            class="demo-ruleForm"
          >
            <el-form-item label="验证人姓名" prop="information">
              <el-input v-model="form.information" :placeholder="dialogName?'请输入登录人的姓名':'请输入验证人'"></el-input>
            </el-form-item>
            <el-form-item label="手机号码" prop="phone">
              <el-input v-model="form.phone" :placeholder="dialogName?'请输入登录人绑定的手机号码':'请输入手机号'"></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false" style="width:100px">取 消</el-button>
            <el-button type="primary" @click="confirm('form')" style="width:100px">确 定</el-button>
          </div>
        </el-dialog>
  </div>
</template>
<script>
import { editVerifierInfo, delVerifierInfo,checkLoginUserInfo } from "@/api/security/visit";
import Cookies from 'js-cookie'
export default {
  data() {
    return {
      dialogFormVisible: false,
      dialogVisible: false,
      validate_user_type: false,
      dialogName:false,//提示账户信息
      inputName:'',
      personalInfo: {},
      informationGialog:false,
      form: {
        information: "",
        phone: "",
        id: "",
      },
      rules: {
        information: [
          { required: true, message: "请输入验证姓名", trigger: "blur" },
          { pattern: /^[\u4e00-\u9fa5]+$/gi, message: "目前只支持汉字" },
          { min: 2, max: 5, message: "长度在2到5个汉字", trigger: "blur" },
        ],
        phone: [
          { required: true, message: "请输入手机号码", trigger: "blur" },
          { min: 11, max: 11, message: "手机号码长度不对", trigger: "blur" },
          {
            pattern: /^1[3456789]\d{9}$/,
            message: "目前只支持中国大陆的手机号码",
          },
        ],
      },
      informationType: false,
      phoneType: false,
    };
  },
  props: ["list", "verification", "isScroll"],
  mounted() {
    console.log(this.list, "$props");
  },
    watch:{
    // parentHandleclick: function (newVal ,oldVal){ //不能用箭头函数
    //    console.log(newVal ,oldVal,'newVal ,oldVal')
    // }
  },
  methods: {
    // parentHandleclick(type){
    //     this.informationGialog=type
    //     this.$forceUpdate();
    //     // this.$set(this.informationGialog,type)
    //     console.log(this.informationGialog,'this.informationGialog11221')
    // },
    edit(item, index) {
      console.log(this.list, "jdjd");
      this.dialogFormVisible = true;
      this.form.information = item.validate_user_name;
      this.form.phone = item.validate_user_mobile;
      this.form.id = item.id;
    },
    //删除
    deleteContent(item) {
      this.personalInfo = item
      console.log(this.$props.verification, item.typeFlag,"this.list[index]");
      if(this.$props.verification){
         this.dialogName=true;
         this.dialogFormVisible=true
      
      } else if (!this.$props.verification) {
        this.dialogVisible=true;
        this.dialogFormVisible=false
        // this.validate_user_type = item.typeFlag;
        // this.deleteInformation(this.validate_user_type, item.id);
      }
    },
    comfirmName(){
      let params={
        userName:this.inputName
      }
      checkLoginUserInfo(params).then((res)=>{
          if(res.code=='1' && res.data.flag){
             this.dialogName=false;
             this.dialogVisible=true;
          }
      }).catch((fail) => {
        console.log(fail)
        // this.loading = false;
      });
      // this.dialogName = false
    },
    //弹窗确认
    confirm(name) {
      console.log(this.$refs[name],'this.$refs[name]')
      this.$refs[name].validate((valid) => {
        if (valid) {
          console.log('99')
          if(this.dialogName){
            let name=Cookies.get('name');
            let phone=Cookies.get('phone')
            console.log(name,phone,'phone')
            if(name===this.form.information && phone===this.form.phone){
              this.dialogFormVisible = false;
              this.dialogVisible=true;
            }else{
              this.dialogFormVisible = true;
              this.$message.error('输入的登录人的姓名和登录人绑定的手机号码不一致,请重新输入');

            }
          }else{
             let params = {
            validate_user_name: this.form.information,
            validate_user_mobile: this.form.phone,
            id: this.form.id,
          };
          editVerifierInfo(params)
            .then((res) => {
              this.loading = false;
              if (res.code == 1) {
                this.dialogFormVisible = false;
                let params = {};
                this.$parent.queryVerifier(params);
                this.open1();
              }
            })
            .catch((fail) => {
              this.loading = false;
            });
          }
         
        } else {
          return false;
        }
      });
    },
    deleteName(item) {
      this.dialogVisible = false  
      this.deleteInformation(item.typeFlag, item.id);
    },
    deleteInformation(validate_user_type, id) {
      let params = {
        id: id,
        validate_user_type: validate_user_type,
      };

      delVerifierInfo(params)
        .then((res) => {
          this.loading = false;
          console.log(res, "delVerifierInfo");
          if (res.code == 1) {
            this.dialogFormVisible = false;
            let params = {
              validate_user_type: this.validate_user_type,
            };
            this.$parent.queryVerifier(params);
            this.deletepen();
          }
        })
        .catch((fail) => {
          this.loading = false;
        });
    },
    async open1() {
      this.$message({
        message: '保存成功',
        type: 'success'
      });
    },
    async deletepen() {
      this.$message({
        message: '删除成功',
        type: 'success'
      });
    },
    
  },
  

};
</script>
<style lang="less" scoped>
.contaion-scroll{
   max-height: calc(50vh - 50px);
   overflow-y: scroll;
}
.contaion-name,.contaion-scroll {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  margin-top: 15px;
  ul {
    width: 30%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-direction: column;
    margin: 10px 5px;
    border: 1px solid #dcdfe6;
    height: 132px;
    li:first-of-type {
      display: flex;
      align-items: center;
      width: 100%;
      padding: 20px 15px;
      justify-content: center;
      border-bottom: 1px solid #dcdfe6;
      > span {
        display: inline-block;
        width: 50px;
        height: 50px;
        background: #ebf0fc;
        border-radius: 50%;
      }
      .contaion-userName {
        display: flex;
        flex-direction: column;
        margin-left: 20px;
        span {
          font-size: 13px;
          color: #606266;
          font-weight: Regular;
        }
        span:last-of-type {
          margin-top: 5px;
        }
        > span:first-of-type {
          display: inline-block;
          margin-bottom: 8px;
        }
      }
    }
    li:last-of-type {
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-item: center;
      > button {
        background: 0;
        border: 0;
        width: 50%;
        height: 40px;
        display: flex;
        justify-content: center;
        align-items: center;
        span {
          font-size: 13px;
          color: #606266;
          font-weight: Regular;
          margin-left: 5px;
        }
      }
      .editActive {
        background: #435a82;
      }
      .deleteActive {
        background: #e17b93;
      }
    }
    /deep/ .is-circle {
      width: 35px;
    }
    .dialog-footer {
      > button {
        padding: 10px;
        color: #9a9a9a;
        background: 0;
        border: 1px solid #9a9a9a;
        border-radius: 4px;
      }
    }
    /deep/ .el-form-item__label:before {
      content: "" !important;
      margin-right: 4px;
    }
  }
      /deep/ .el-dialog__body {
      padding: 30px;
      display: flex;
      flex-direction: column;
      .page-informationName {
        display: flex;
        justify-content: space-between;
      }
      .page-informationBoole {
        display: flex;
        justify-content: center;
        align-items: center;
        margin-top: 30px;
      }
    }
}
</style>