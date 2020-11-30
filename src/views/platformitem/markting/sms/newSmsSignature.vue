<template>
  <el-container v-loading="pageLoading" class="template-msg-container">
    <el-main class="template-msg">
      <el-row type="flex">
        <el-col>
          <el-form
            ref="form"
            :model="form"
            :rules="rules"
            label-width="100px"
            :disabled="mode === 'view'"
          >
            <el-form-item label="签名名称：" prop="name">
              <el-input placeholder="请输入签名名称" maxlength="30" v-model="form.name"></el-input>
            </el-form-item>
            <el-form-item label="签名来源：" prop="name">
              <el-select  v-model="form.origin">
                <el-option
                  v-for="item in originOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="申请说明：" prop="explain">
              <el-input type="textarea" maxlength="200" v-model="form.explain"></el-input>
            </el-form-item>
          </el-form>
          
          <el-row>
            <div class="tip">
              <p>预计两小时完成审核</p>
              <p>审核工作时间: 周一至周日9:00-23:00（法定节日顺延）</p>
            </div>
          </el-row>
        </el-col>
        <el-col class="iphone-x-container">
          <div class="device iphone-x">
            <!--    外部轮廓    -->
            <div class="frame">
              <div class="content">
                <div class="time">10:19</div>
              </div>
            </div>

            <!--    天线    -->
            <div class="stripe" />

            <!--    听筒孔    -->
            <div class="header">
              <div class="sensors" />
            </div>

            <!--    按键    -->
            <div class="btns" />
            <div class="power" />
          </div>
        </el-col>
      </el-row>
      <el-row class="form_footer">
            <el-button
              v-if="mode !== 'view'"
              type="primary"
              @click="handleSubmit"
            >
              提交审核
            </el-button>
            <el-button @click="handleCancel">{{
              mode === "view" ? "返回" : "取消"
            }}</el-button>
          </el-row>
    </el-main>
  </el-container>
</template>

<script>
import { querySMSSignById, addSMSSign, editSMSSign } from "@/api/markting/SMSFunction"
export default {
  mounted(){
    if(this.$route.query.mode){
      this.pageLoading = true
      this.mode = this.$route.query.mode
      querySMSSignById({id:this.$route.query.id}).then(({data})=>{
        this.pageLoading = false
        this.form.name = data.sign_name
        this.form.origin = data.sign_source
        this.form.explain = data.remark
        this.id = data.id
      })
    }
  },
  data() {
    return {
      pageLoading:false,
      mode:'',
      id:'',
      originOptions:[
        {
          label: "企事业单位的全程或简称",
          value: 0,
        },
        {
          label: "工信部备案网站的全称或简称",
          value: 1,
        },
        {
          label: "APP应用的全称或简称",
          value: 2,
        },
        {
          label: "公众号或小程序的全称或简称",
          value: 3,
        },
        {
          label: "电商平台店铺名的全程或简称",
          value: 4,
        },
        {
          label: "商标名的全程或简称",
          value: 5,
        },
      ],
      form: {
        name: "",
        origin:"",
        explain: "",
      },
      rules:{
          name:[{ required: true, message: '请输入签名名称', trigger: 'blur' },{  min: 2, max: 12, message: '长度限2－12个字符，建议为用户真实应用名/网站名/公司名', trigger: 'blur' }],
          origin:[{ required: true, message: '请选择签名来源', trigger: 'change' }],
          explain:[{ required: true, message: '请描述您的业务使用场景', trigger: 'blur' }]
      }
    };
  },
  methods:{
      handleSubmit(){
          this.$refs.form.validate((valid) => {
          if (valid) {
            this.pageLoading = true
            if(this.mode === 'edit'){
              editSMSSign({
                id:this.id,
                sign_name:this.form.name,
                sign_source:this.form.origin,
                remark:this.form.explain
              }).then(()=>{
                this.$message.success('添加成功')
                setTimeout(()=>{
                  this.handleCancel()
                },2000)
              }).catch(()=>{
                this.pageLoading = false
              })
            }else if(!this.mode){
              addSMSSign({
                sign_name:this.form.name,
                sign_source:this.form.origin,
                remark:this.form.explain
              }).then(()=>{
                this.$message.success('添加成功')
                setTimeout(()=>{
                  this.handleCancel()
                },2000)
              }).catch(()=>{
                this.pageLoading = false
              })
            }
          } else {
            return false;
          }
        });
      },
      handleCancel(){
        this.$router.push({name:'smsMange',query:{activeName:'smsSignature'}})
      }
  }
};
</script>

<style lang="less" scoped>
.template-msg-container {
  padding: 20px;
  width: 100%;
  min-height: 100%;

  .template-msg {
    width: 100%;
    min-height: 100%;
    background-color: #fff;
  }

  .audience-number {
    padding: 0 0 0 10px;
    line-height: 30px;
    color: #606266;
  }

  .footer {
    margin-left: 100px;
  }

  .tip{
      padding: 20px 100px;
      color: #ccc;
  }
}
</style>
