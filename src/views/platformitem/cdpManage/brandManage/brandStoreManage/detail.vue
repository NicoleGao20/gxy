<template>
  <div class="brand-container">
    <div style="padding-bottom: 50px;width:60%;padding-top: 20px;">
      <el-form ref="form" :model="form" :rules="rules" label-position="right" label-width="120px">
        <el-form-item
          label="品牌名称"
          prop="brandCode">
          <el-select v-model="form.brandCode" :disabled="disabled" placeholder="请选择">
            <el-option
              v-for="item in brandList"
              :key="item.brandCode"
              :label="item.brandName"
              :value="item.brandCode"/>
          </el-select>
        </el-form-item>
        <el-form-item
          label="店铺名称"
          prop="storeCode">
          <el-select v-model="form.storeCode" :disabled="disabled" filterable placeholder="请选择">
            <el-option
              v-for="(item,index) in storeList"
              :key="index"
              :label="item.store_name"
              :value="item.store_code"/>
          </el-select>
        </el-form-item>
      </el-form>
    </div>
    <div :style="{left: sidebar.opened?'230px': '50px'}" class="action-wrap">
      <el-button v-if="!disabled" class="top-operate-btn ml-20" type="primary" @click="save">保存</el-button>
      <el-button @click="$router.push({ name: 'brandStoreManage'})">返回</el-button>
    </div>
  </div>
</template>
<script>
import { apiObj } from '@/config/getUrl.js'
// eslint-disable-next-line
import { mapState } from 'vuex'
import { getBrandDetail, updataBrand, addBrand, getBrandList, getAllStores } from '@/api/brandStoreManage'
export default {
  name: 'BrandStoreManage',
  data() {
    return {
      value: '',
      brandList: [],
      storeList: [],
      uploadOss: `${apiObj.uploadOss}/val`,
      parentList: [],
      disabled: false,
      rules: {
        brandCode:
          [
            { required: true, message: '请选择品牌', trigger: 'blur' }
            // { validator: checkData, trigger: 'blur'}
          ],
        storeCode: [{ required: true, message: '请选择店铺', trigger: 'blur' }]
      },
      form: {
        id: '',
        brandCode: '',
        storeCode: ''
      },
      param: {},
      id: '',
      isEdit: false
    }
  },
  computed: {
    ...mapState({
      sidebar: state => state.app.sidebar
    })
  },
  mounted() {
    this.id = this.$route.query.id
    if (this.$route.query.type && this.$route.query.type === 'view') {
      this.disabled = true
    } else {
      this.disabled = false
    }
    if (this.id) {
      this.getDetail()
    }
    this.getBrandListFun()
    this.getAllStoresFun()
  },
  methods: {
    getBrandListFun() {
      getBrandList().then((res) => {
        this.brandList = res.body || []
      })
    },
    getAllStoresFun() {
      getAllStores().then((res) => {
        this.storeList = res.data.list || []
      })
    },
    getDetail() {
      getBrandDetail({ id: this.id }).then((res) => {
        this.form = res.body
      })
    },
    save() {
      this.storeList.forEach((res) => {
        if (res.store_code == this.form.storeCode) {
          this.form['platformId'] = res.crm_mk_platform_id || ''
          this.form['platformName'] = res.platform_name || ''
          this.form['platformCode'] = res.platform_code || ''
          this.form['storeName'] = res.store_name || ''
        }
      })
      this.brandList.forEach((res) => {
        if (this.form.brandCode == res.brandCode) {
          this.form['brandName'] = res.brandName || ''
          this.form['brandLogoUrl'] = res.logo || ''
        }
      })
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.submit()
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    submit() {
      if (this.id) {
        updataBrand(this.form).then((res) => {
          if (res.code == 0) {
            this.$message.success('更新成功')
            this.$router.go(-1)
          }
        })
      } else {
        addBrand(this.form).then((res) => {
          if (res.code == 0) {
            this.$message.success('保存成功')
            this.$router.go(-1)
          }
        })
      }
    }
  }
}
</script>
<style lang="less" scoped>
 .zZindex{
   z-index: 500;
 }
 .tips {
  //  color: #435A82;
  color: #C0C4CC;
   margin-left: 100px;
   line-height: 1.4;
 }
 .brand-container{
   height: 90%;
   background: #fff;
 }
</style>

