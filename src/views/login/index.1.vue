<template>
  <div class="login-container">
    <el-row >
      <el-col :span="14">
        <div class="grid-content-left">
          <img :src="$store.getters.getConfig.websiteLogo || logo" width="180" alt >
        </div>
      </el-col>
      <el-col :span="10">
        <div class="grid-content-right">
          <div class="grid-content-box">
            <div slot="header" class="header">
              <!-- <h3>{{ $t('login.title') }}</h3> -->
              <h3>{{ websiteName }}</h3>
              <span v-if="desc">{{ desc }}</span>
              <span v-else>提高团队进行科学的洞察分析的能力及营销推广管理的能力，助力构建高效营销体系及品牌的可持续发展。</span>
            </div>
            <el-form
              ref="loginForm"
              :model="loginForm"
              :rules="loginRules"
            >
              <el-form-item prop="userName">
                <span >
                  用户名
                  <!-- <svg-icon icon-class="user" /> -->
                </span>
                <el-input
                  :suoplaceholder="$t('login.userName')"
                  v-model="loginForm.userName"
                  placeholder="请输入用户名！"
                  type="text"
                  name="userName"
                  auto-complete="on"
                />
              </el-form-item>
                 <!-- <el-form-item ref="password" prop="password"> -->
              <el-form-item   prop="password">
                <span >
                  密码
                  <!-- <svg-icon icon-class="password" /> -->
                </span>
                <el-input
                  :type="pwdType"
                  v-model="loginForm.password"
                  placeholder="请输入登陆密码！"
                  name="password"
                  auto-complete="on"
                  @keyup.enter.native="handleLogin"
                />
                <span class="show-pwd" @click="showPwd">
                  <svg-icon :icon-class="pwdType === 'password' ? 'eye' : 'eye-open'" />
                </span>
              </el-form-item>
              <el-form-item v-if="is_msg_verify =='Y'" prop="verificationCode" >
                <span >
                  短信验证码
                </span>
                <el-input
                  v-model="loginForm.verificationCode "
                  placeholder="请输入登陆密码！"
                  @keyup.enter.native="handleLogin"
                />
                <span    v-if="!tiemBoole"  class="verificationCode" @click="getVerificationCode">
                     获取验证码
                </span>
                <span v-else  class="verificationCode">{{ time +"s" }}</span>
              </el-form-item>
            </el-form>
            <el-button
              :loading="loading"
              style="width: 100%"
              type="primary"
              class="elBottonPrimary"
              @click.native.prevent="handleLogin">
              登录
            </el-button>
          </div>
          <div class="tips">{{ $store.getters.getConfig.versionInfo }}</div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
var logo = require('@/assets/img/logo.png') // 表格默认图片
import Cookies from 'js-cookie'
import { mapActions } from 'vuex'
import { isvalidUsername, isvalidPassword, codeNumber } from '@/utils/validate'
import navs from '@/config/navs'
import { login, secondVerification, sendVerificationCode } from '@/api/login'
export default {
  name: 'Login',
  data() {
    const validateUsername = (rule, value, callback) => {
      console.log(isvalidUsername(value), 999)
      if (!isvalidUsername(value)) {
        callback(new Error('请输入正确的用户名'))
      } else {
        callback()
      }
    }
    const codeNumbers = (rule, value, callback) => {
      if (!value) {
        callback(new Error('验证码不能为空'))
      } else if (codeNumber(value)) {
        callback(new Error('只能输入数字'))
      }
      callback()
    }
    const validatePass = (rule, value, callback) => {
      console.log(value, 999)
      if (!value) {
        callback(new Error('密码不能为空'))
      } else if (this.message) {
        callback(new Error(this.message))
      } else {
        callback()
      }
    }
    return {
      clickBoolean:false,
      tiemBoole:false,
      countdown:'',
      time:61,
      timer:null,
      message: '',
      websiteName: '',
      desc: '',
      logo: logo,
      is_msg_verify: '',
      verificationCodeKey: '',
      loginForm: {
        userName: '', // admin
        password: '', // burgeon123
        verificationCode: ''
      },
      loginRules: {
        userName: [
          { required: true, trigger: 'blur', validator: validateUsername }
        ],
        password: [
          { required: true, trigger: 'blur', validator: validatePass }
        ],
        verificationCode: [{ required: true, trigger: 'blur', validator: codeNumbers }]
      },
      loading: false,
      pwdType: 'password',
      redirect: undefined
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  mounted() {
    this.getSecondVerification()
    this.desc = this.$store.getters.getConfig.websiteDesc
    this.websiteName = this.$store.getters.getConfig.websiteName || '数据营销平台'
    console.log(this.$store.getters.getConfig)
  },
  beforeDestroy() {
    if(this.timer) { //如果定时器在运行则关闭
      clearInterval(this.timer); 
    }
  },
  methods: {
    ...mapActions({ setToken: 'setToken' }),
    showPwd() {
      if (this.pwdType === 'password') {
        this.pwdType = ''
      } else {
        this.pwdType = 'password'
      }
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
          else if (this.time > 0 && this.time < 10) {
            this.tiemBoole = true;
            this.time = "0" + this.time;
          }
          else if(this.time ==0) {
            this.tiemBoole = false;
            this.time = 0;
            clearInterval(this.timer);
            this.clickBoolean=false
          }
        }, 1000);
      }
   
    },
    handleLogin() {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          this.loading = true;
          let loginInfo = {...this.loginForm}
          loginInfo.is_msg_verify=this.is_msg_verify
          console.log(this.verificationCodeKey,'verificationCodeKey')
          loginInfo.verificationCodeKey=this.verificationCodeKey
          loginInfo.password = this.$encrypt(loginInfo.password).toString()
          login(loginInfo)
            .then((res) => {
              // debugger
              this.loading = false
              this.message = res.msg
              // 暂时先去掉，以后还要还原，

              
              // this.$refs['loginForm'].validateField('password', function(e) {})
              this.message = ''
              const data = JSON.stringify(res.body)
              this.$utils.setSession('token', res.body.token)
              this.$utils.setSession('userInfo', data)
              this.$utils.setSession('id', data.id)
              this.$utils.setSession('empNo', data.empNo)
              console.log(this.message, res, 'res1')
              // 登陆之后，设置cookie值，每次请求的时候，都带上cookie就可以
              this.setToken(res.body.token)
              this.$store.commit('setUserInfo', res.body)
              console.log(this.message, res, 'res2')
              this.$store.dispatch('add_Routes', navs)
              this.$router.push({ name: 'index' })
              console.log(this.message, res, 'res3')
              Cookies.set('userName', res.body.userName)
              Cookies.set('name', res.body.name)
              Cookies.set('userId', res.body.id)
              Cookies.set('token', res.body.token)
              Cookies.set('phone', res.body.phone)
              this.message = res.body.msg
              console.log(this.message, res, 'res')
            })
            .catch(() => {
              this.loading = false
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 获取是否开启二次验证。Y ==is_msg_verify 是开启验证。
    getSecondVerification() {
      secondVerification().then((res) => {
        console.log(res, 9933339)
        this.is_msg_verify = res.data.is_msg_verify || ''
      })
    },
    // 获取验证码
    getVerificationCode() {

      // 这里是一个开关，只能点击一次，点击第二次的时，return。
      if(this.clickBoolean){
        return
      } 
      this.clickBoolean=true;
      this.$refs.loginForm.validateField('userName')
      this.$refs.loginForm.validateField('password')
      if (!this.loginForm.userName) {
        return
      }
      if (!this.loginForm.password) {
        return
      }
      this.time = 61;
      this.setTime();
      const params = {}
      params.password = this.loginForm.password
      params.username = this.loginForm.userName
      sendVerificationCode(params).then((res) => {
        // this.clickBoolean=false
        this.verificationCodeKey = res.body.verificationCodeKey ||''
      }).catch(() => {
        this.clickBoolean=false
        this.time = 61
        this.setTime('clear')
      })
    }
  }
}
</script>
<style lang="less" scoped>
@bg: #01337Ade;
@dark_gray: #889aa4;
@light_gray: #eee;
.login-container {
  // position: fixed;
  box-sizing: border-box;
  height: 100%;
  width: 100%;
  // background-position: center center;
  // background-size: cover;
  // background-image: url(../../assets/img/login.jpg);
  .el-row{
    height: 100%;
    .el-col{
      height: 100%;
      .grid-content-right{
        position: relative;
        height: 100%;
        background-color:@bg;
        .grid-content-box{
          position: absolute;
          width: 80%;
          transform: translate(-50%,-50%);
          left: 50%;
          top:43%;
          .header{
            margin-bottom: 30px
          }
          h3{
            color:#fff;
            height: 30px;
            line-height: 30px;
            font-size: 24px;
            text-align: center;
            margin-bottom:50px
          }
          span{
            display: inline-block;
            font-size: 14px;
            height: 25px;
            line-height: 25px;
            color:#ccdeee;
          }
          .verificationCode, .show-pwd{
            position: absolute;
            right: 10px;
            top: 7px;
          }
          .show-pwd {
            font-size: 16px;
            color: @dark_gray;
            cursor: pointer;
            user-select: none;
          }
          .verificationCode{
            font-size: 12px;
            color: #3EDD83;
            cursor: pointer;
            border-bottom: 1px solid #3EDD83;
            height: 19px;
          }
          .elBottonPrimary{
            margin-top: 20px;
            background-color:#007BE6;
            border-color: #007BE6
          }
        }
        .tips {
          position: absolute;
          bottom:5%;
          width: 100%;
          text-align: center;
          color:#ccdeee;
          &:before,&:after{
            content: "";
            display: block;
            position: absolute;
            top: 4px;
            width: 20%;
            height: 1px;
            background-color: #ccdeee;
            -webkit-transform: scaleY(0.5);
            -moz-transform: scaleY(0.5);
            transform: scaleY(0.5);
          }
          &:after{
            right: 0;
          }
        }
      }
      .grid-content-left{
        height: 100%;
        background-position: center center;
        background-size: cover;
        background-image: url(../../assets/img/login2.png);
        background-color:@bg;
          img {
            display: inline-block;
            margin:20px 0 0 20px ;
            width: 10%;
          }
      }

    }
  }
  .title {
    font-size: 26px;
    font-weight: 400;
    color: @light_gray;
    margin: 0px auto 40px auto;
    text-align: center;
    font-weight: bold;
  }

}
//  .login-container{
//     position: absolute;
//     top: 0;
//     bottom: 0;
//     left: 0;
//     right: 0;
//     height: 100%;
//     width: 100%;
//     background-position: center center;
//     background-size: cover;
//     // background-image: url(../../assets/img/login.jpg);
//     .box{
//       width: 350px;
//       position: absolute;
//       right: 40%;
//       top: 30%;
//     }
//   }
</style>
