<template>
  <div class="security-center">
    <div class="security-information">
      <div class="sensitive-container">
        <div class="description">
          <ul>
            <li>
              1、下载数据有效期：为了保障数据安全防止下载数据长时间保留导致数据泄露，需要控制数据可下载时间，系统默认为3天内可下载，可根据公司内部需要自定义可下载时间段，最长可设置7天
            </li>
            <li>
              2、下载数据验证：系统中有数据被下载时我们会发送验证码到此号码进行二次确认，防止您的数据被恶意泄露
            </li>
            <li>3、启用时请确保有足够短信余额，当余额不足将无法下载数据</li>
          </ul>
        </div>
        <ol class="security-longin">
          <li class="security-color">下载数据有效期设置</li>
          <li>
            <span class="security-input">
              可下载时间段:数据生成后
              <el-input
                v-model="from.time_valid"
                type="number"
                min="1"
                max="7"
                onkeyup="from.is_download_verification=from.is_download_verification.replace(/\D/g,'')"
                @change="dayInput"
              />
            </span>
           <template>天内可下载,超过时间无法下载</template>
          </li>
        </ol>
        <ul class="security-service">
          <li class="security-color">下载数据验证设置</li>
          <li>
            <div class="security-out">
              <span>是否启用验证:</span>
              <el-switch
                v-model="from.is_download_verification"
                active-color="#13ce66"
                inactive-color="#DCDFE6"
              />
            </div>
            <div
              v-if="from.is_download_verification == true"
              class="security-out"
            >
              <span>二次下载是否启用验证:</span>
              <el-switch
                v-model="from.is_sec_download_verification"
                active-color="#13ce66"
                inactive-color="#DCDFE6"
              />
              <span
                v-if="from.is_sec_download_verification == true"
                class="security-input"
              >
                在
                <el-input
                  v-model="from.time_sec_dl_interval"
                  type="number"
                  onkeyup="this.from.is_download_verification=this.from.is_download_verification.replace(/\D/g,'')"
                  @change="hourTime"
                />
              </span>
               <template  v-if="from.is_sec_download_verification == true">小时无需验证</template>
            </div>
          </li>
        </ul>
        <div class="security-people">
          <li>验证人信息:</li>
          <li>
            当系统中有数据被下载时，会发送验证码到验证人手机上进行二次确认，防止您的数据被恶意泄露
          </li>
          <li>
            <button class="addButton" @click="verifier('data')">添加</button>
            <button class="addButton" @click="seseMore('')">查看更多</button>
          </li>
        </div>
        <nameInformation
          v-if="list1 !== []"
          :list="list1"
          :verification="from.is_download_verification"
          ref="seseMoreType"
          :isScroll="isScroll"
        />
        <ul class="security-service">
          <li class="security-color">员工账号删除验证设置</li>
          <li class="security-verification">
            <div class="security-out">
              <span>是否启用验证:</span>
              <el-switch
                v-model="from.is_use_del_verification"
                active-color="#13ce66"
                inactive-color="#DCDFE6"
              />
            </div>
            <ol class="security-people">
              <li>验证人信息:</li>
              <li>
                当系统中有员工需要删除时,会发送验证码到验证人手机上进行二次确认,避免恶意操作
              </li>
              <li>
                <button class="addButton" @click="verifier('people')">
                  添加
                </button>
                 <button class="addButton" @click="seseMore('account')">查看更多</button>
              </li>
            </ol>
            <nameInformation
              v-if="list !== []"
              :list="list"
              :verification="from.is_use_del_verification"
              ref="seseMoreType"
              :isScroll="isScroll1"
            />
          </li>
        </ul>
      </div>
    </div>
    <el-dialog
      :visible.sync="dialogFormVisible"
      :show-close="false"
      title="请输入验证信息"
    >
      <el-form
        ref="modalForm"
        :model="modalForm"
        :rules="rules"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="验证人姓名" prop="information">
          <el-input v-model="modalForm.information"/>
        </el-form-item>
        <el-form-item label="手机号码" prop="phone">
          <el-input v-model="modalForm.phone"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="resetForm('modalForm')">取消</el-button>
        <el-button type="primary" @click="confirm('modalForm')">确定</el-button>
      </div>
    </el-dialog>
    <el-dialog
      :visible.sync="Errodialog"
      :show-close="false"
      title="提示"
      width="30%"
    >
      <span>修改内容不能为空,请补全修改内容</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="Errodialog = false">确 定</el-button>
      </span>
    </el-dialog>
    <div class="form_footer">
      <el-row>
        <el-button type="primary" @click.native="preservation">保存</el-button>
        <el-button @click.native="revert">取消</el-button>
      </el-row>
    </div>
  </div>
</template>
<script>
import nameInformation from '@/components/nameInformation/nameInformation.vue'
import {
  querySensitiveOperationSet,
  editSensitiveOperationSet,
  addVerifierInfo,
  queryVerifierInf
} from '@/api/security/visit'
export default {
  components: {
    nameInformation
  },
  data() {
    return {
      loading: false,
      obj: {},
      list: [],
      list1: [],
      dialogFormVisible: false,
      identification: '',
      validate_user_type: '',
      seseMoreScroll:'',
      isScroll: false,
      isScroll1: false,
      modalForm: {
        information: '',
        phone: ''
      },
      from: {
        is_sec_download_verification: true,
        is_use_del_verification: true,
        is_download_verification: true,
        time_valid: '',
        time_sec_dl_interval: ''
      },
      valueBoole: 'Y',
      timeBoole: 'Y',
      deletesBoole: 'Y',
      rules: {
        information: [
          { required: true, message: '请输入验证姓名', trigger: 'blur' },
          { min: 2, max: 5, message: '长度在 2 到 5 个汉字', trigger: 'blur' },
          { pattern: /^[\u4e00-\u9fa5]+$/gi, message: '目前只支持汉字' }
        ],
        phone: [
          { required: true, message: '请输入手机号码', trigger: 'blur' },
          { min: 11, max: 11, message: '手机号码长度不对', trigger: 'blur' },
          // { type: 'number', message: '手机号码必须为纯数字'},
          {
            pattern: /^1[3456789]\d{9}$/,
            message: '目前只支持中国大陆的手机号码'
          }
        ]
      },
      Errodialog: false
    }
  },
  mounted() {
    this.sensitive()
    this.queryVerifier()
  },
  methods: {
    // 添加
    verifier(type) {
      this.identification = type
      this.dialogFormVisible = true
      Object.keys(this.modalForm).forEach((key) => {
        this.modalForm[key] = ''
      })
    },
    seseMore(type){
      console.log('sfdsfsdfs',type)
      // this.seseMoreScroll=!this.seseMoreScroll
      //  this.$refs.seseMoreType.parentHandleclick(this.seseMoreScroll=!this.seseMoreScroll)
      if(type){
        console.log('hhdshdhd')
      this.isScroll1 = !this.isScroll1
      }else{
        this.isScroll = !this.isScroll
        console.log('isscroll',this.isScroll)
      }
    },
    // 内容
    dayInput() {
      this.from.time_valid = Number(this.from.time_valid)
      if (this.from.time_valid > 7) {
        this.from.time_valid = 7
        this.open('最长时间不能超过7天')
      } else if (this.from.time_valid <= 1) {
        this.from.time_valid = 1
        this.openTime('time_valid')
      }
    },
    hourTime() {
      if (this.from.time_sec_dl_interval < 1) {
        this.from.time_sec_dl_interval = 1
        this.openTime('time_sec_dl_interval')
      }
    },
    // 返回
    revert() {
      this.$router.go(-1)
    },
    openTime(type) {
      if (type == 'time_valid') {
        this.open('最短的时间不能少于1天')
      } else {
        this.open('最短的时间不能少于1小时')
      }
    },
   // 查询内容
    sensitive() {
      const params = {}
      querySensitiveOperationSet(params)
        .then((res) => {
          this.loading = false
          this.obj = res.data.list
          Object.keys(this.from).forEach((key) => {
            if (this.obj[key] === 'Y') {
              this.obj[key] = true
            } else if (this.obj[key] === 'N') {
              this.obj[key] = false
            }
            this.from[key] = this.obj[key]
          })
        })
        .catch((fail) => {
          this.loading = false
        })
    },
    // 保存
    preservation() {
      if (this.from.time_valid == '' || this.from.time_sec_dl_interval == '') {
        this.Errodialog = true
      } else {
        this.valueBoole = this.from.is_download_verification ? 'Y' : 'N'
        this.timeBoole = this.from.is_sec_download_verification ? 'Y' : 'N'
        this.deletesBoole = this.from.is_use_del_verification ? 'Y' : 'N'
        const params = {
          time_valid: this.from.time_valid,
          is_download_verification: this.valueBoole,
          is_sec_download_verification: this.timeBoole,
          time_sec_dl_interval: this.from.time_sec_dl_interval,
          is_use_del_verification: this.deletesBoole
        }
        editSensitiveOperationSet(params)
          .then((res) => {
            this.loading = false
            this.obj = res.data.list
            if (res.code) {
              this.open1()
            }
          })
          .catch((fail) => {
            this.loading = false
          })
      }
    },
    // 取消按钮
    resetForm(formName) {
      this.dialogFormVisible = false
      this.$refs[formName].resetFields()
    },
    // 弹窗确认按钮
    confirm(name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          this.validate_user_type = this.identification == 'data' ? 't1' : 't2'
          const params = {
            validate_user_name: this.modalForm.information,
            validate_user_mobile: this.modalForm.phone,
            validate_user_type: this.validate_user_type
          }
          addVerifierInfo(params)
            .then((res) => {
              this.loading = false
              if (res.code == '1') {
                this.open1()
                this.dialogFormVisible = false
                this.queryVerifier()
              }
            })
            .catch((fail) => {
              this.loading = false
            })
        } else {
          return false
        }
      })
    },
    // 查询验证信息
    queryVerifier() {
      const params = {
        validate_user_type: 't1'
      }
      queryVerifierInf(params)
        .then((res) => {
          this.loading = false
         if (res.code == 1) {
            this.list1 = res.data.list1
            this.list = res.data.list2
          }
        })
        .catch((fail) => {
          this.loading = false
        })
    },
    //提示
     open(type) {
       this.$message({
          message:`${type}`,
          type: 'warning'
        });
    },
    //成功
    open1() {
      this.$message({
          message: '保存成功',
          type: 'success'
        });
    },
  }
}
</script>
<style lang="scss" scoped>
.security-center {
  max-height: calc(100vh - 100px);
  background: #fff;
  padding-left: 30px;
  display: flex;
  flex-direction: column;
  overflow-x: hidden;
  .security-information {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow-y: scroll;
    .description {
      width: 85%;
      padding: 15px;
      background: #fafafa;
      border-radius: 8px;
      border: 1px dotted #dcdfe6;
      margin: 10px 0;
      ul {
        padding: 0;
        li {
          line-height: 20px;
        }
      }
    }
    .security-longin {
      display: flex;
      flex-direction: column;
      margin: 40px 0;
      li:first-of-type {
        font-size: 14px;
        color: #606266;
        margin-bottom: 30px;
      }
      li:last-of-type {
        display: flex;
        align-items: center;
        span {
          font-size: 13px;
          display: inline-block;
          color: #606266;
          input {
            border: 0;
            background: 0;
            display: inline-block;
            width: 40px;
            height: 17px;
            line-height: 17px;
            font-size: 12px;
            text-align: center;
            border: 1px solid #dcdfe6;
            border-radius: 5px;
            margin: 0 6px;
            color: #606266;
          }
        }
      }
    }
    .security-service {
      display: flex;
      flex-direction: column;
      margin-top: 40px;
      li:first-of-type {
        font-size: 14px;
        color: #606266;
        margin-bottom: 30px;
      }
      li:nth-of-type(2) {
        span {
          font-size: 15px;
          margin-right: 20px;
          color: #606266;
        }
        input {
          border: 0;
          background: 0;
          display: inline-block;
          width: 40px;
          height: 17px;
          line-height: 17px;
          font-size: 12px;
          text-align: center;
          border: 1px solid #dcdfe6;
          border-radius: 5px;
          margin: 0 6px;
          margin-left: 20px;
        }
        span:last-of-type {
          display: inline-block;
          margin-bottom: 10px;
        }
        .security-out {
          span {
            font-size: 13px;
            display: inline-block;
            color: #606266;
          }
          /deep/ .el-switch {
            margin-right: 9px;
          }
        }
      }
    }
    .security-people {
      display: flex;
      li:first-of-type{
        margin-right:10px;
      }
      li {
        font-size: 13px;
        color: #606266;
        font-weight: Regular;
      }
      li:nth-of-type(3) {
        .addButton {
          border: 0;
          background: 0;
          padding: 4px;
          background: #435a82;
          width: 80px;
          height: 30px;
          line-height: 20px;
          color: #fff;
          font-size: 14px;
          border-radius: 4px;
        }
        margin: -8px 20px;
        .dialog-footer {
          button {
            padding: 10px;
            color: #9a9a9a;
            background: 0;
            border: 1px solid #9a9a9a;
            border-radius: 4px;
          }
        }
      }
    }
    /deep/ .security-name {
      margin: 0 !important;
    }
    .security-out {
      margin-bottom: 8px;
      span {
        color: #606266;
        font-size: 13px;
        font-weight: Regular;
      }
      /deep/.el-switch__core {
        height: 16px;
        top: -2px;
      }
      /deep/ .el-switch__core:after {
        top: -1px;
      }
    }
    .security-input {
      display: flex;
      align-items: center;
      /deep/ .el-input {
        width: 6%;
        .el-input__inner {
          height: 22px;
          width: 59px;
          padding-right: 1px;
          border-radius: 4px;
          margin: 0 6px;
        }
      }
    }
    .security-input:first-of-type {
      /deep/ .el-input {
        width: 10%;
      }
    }
    
  }
 .security-footer {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
   .security-color{
        font-weight: Bold;
      }
}
</style>
