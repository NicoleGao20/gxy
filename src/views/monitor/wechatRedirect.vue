<template>
  <div class="container wechat-redirect">
    <el-row :gutter="40">
      <el-col :span="12">
        <h3 class="title">{{ $t('wechatRedirect.getCoupon') }}</h3>
        <el-form ref="couponForm" :model="couponForm" :rules="rules" label-width="150px">
          <el-form-item :label="$t('wechatRedirect.openID')" prop="openID">
            <el-input v-model="couponForm.openID" style="width: 200px"/>
          </el-form-item>
          <el-form-item :label="$t('wechatRedirect.shopOrgCode')" prop="shopOrgCode">
            <el-input v-model="couponForm.shopOrgCode" style="width: 200px"/>
          </el-form-item>
          <el-form-item :label="$t('wechatRedirect.brandCode')" prop="brandCode">
            <el-input v-model="couponForm.brandCode" style="width: 200px"/>
          </el-form-item>
          <el-form-item style="">
            <el-button type="primary" @click="handleRedirect('coupon')">{{ $t('wechatRedirect.redirect') }}</el-button>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span="12">
        <h3 class="title">{{ $t('wechatRedirect.register') }}</h3>
        <el-form ref="registerForm" :model="registerForm" :rules="rules" label-width="150px">
          <el-form-item :label="$t('wechatRedirect.openID')" prop="openID">
            <el-input v-model="registerForm.openID" style="width: 200px"/>
          </el-form-item>
          <el-form-item :label="$t('wechatRedirect.shopOrgCode')" prop="shopOrgCode">
            <el-input v-model="registerForm.shopOrgCode" style="width: 200px"/>
          </el-form-item>
          <el-form-item :label="$t('wechatRedirect.brandCode')" prop="brandCode">
            <el-input v-model="registerForm.brandCode" style="width: 200px"/>
          </el-form-item>
          <el-form-item style="">
            <el-button type="primary" @click="handleRedirect('register')">{{ $t('wechatRedirect.redirect') }}</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import { getWechatPage } from '@/api/businessMonitor'
export default {
  name: 'WechatRedirect',
  components: {
  },
  data() {
    return {
      redirectPages: [],
      couponForm: {
        openID: '',
        shopOrgCode: '',
        brandCode: ''
      },
      registerForm: {
        openID: '',
        shopOrgCode: '',
        brandCode: ''
      },
      rules: {
        openID: [
          { required: true, message: this.$t('wechatRedirect.openID') + this.$t('form.isRequired'), trigger: 'blur' }
        ],
        shopOrgCode: [
          { required: true, message: this.$t('wechatRedirect.shopOrgCode') + this.$t('form.isRequired'), trigger: 'blur' }
        ],
        brandCode: [
          { required: true, message: this.$t('wechatRedirect.brandCode') + this.$t('form.isRequired'), trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    getWechatPage().then(res => {
      this.redirectPages = res && res.data && res.data.list
    })
  },
  methods: {
    handleRedirect(type) {
      const formName = `${type}Form`
      const form = this[formName]
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const types = { coupon: 'Coupon', register: 'Regist' }
          const page = this.redirectPages.find(item => item.pageType === types[type])
          const { openID, shopOrgCode, brandCode } = form
          const a = document.createElement('a')
          a.setAttribute('href', `${page.pageUrl}?openID=${openID}&shopOrgCode=${shopOrgCode}&brandCode=${brandCode}`)
          a.setAttribute('target', '_blank')
          a.click()
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
.container {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  padding: 30px;
}
.title {
  margin-bottom: 30px;
  padding-bottom: 10px;
  border-bottom: 1px solid #eee;
}
.text-red {
  color: #F56C6C;
}
.text-blue {
  color: #409EFF;
}

</style>
