<template>
  <div class="product-container">
    <div style="padding-bottom: 50px;width:550px">
      <el-form ref="form" :model="form" :rules="rules" label-position="right" label-width="120px">
        <el-form-item
          label="商品名称"
          prop="product_name_cn">
          <el-input v-model="form.product_name_cn" maxlength="100" :disabled="disabled" clearable />
        </el-form-item>
        <el-form-item
          label="商品编号"
          prop="product_code">
          <el-input v-model="form.product_code" maxlength="100" :disabled="disabled" clearable />
        </el-form-item>
        <el-form-item
          label="产品分类"
          prop="product_type">
          <el-select v-model="form.product_type" :disabled="disabled" clearable placeholder="请选择">
            <el-option
              v-for="item in product_type_list"
              :key="item.product_type_code"
              :label="item.product_type"
              :value="item.product_type_code">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="产品系列"
          prop="product_series">
          <el-select v-model="form.product_series" :disabled="disabled" clearable placeholder="请选择">
            <el-option
              v-for="item in product_series_list"
              :key="item.product_series_code"
              :label="item.product_series"
              :value="item.product_series_code">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </div>
    <div :style="{left: sidebar.opened?'230px': '50px'}" class="action-wrap">
      <el-button v-if="!disabled" class="top-operate-btn ml-20" type="primary" @click="save">保存</el-button>
      <el-button @click="$router.push({ name: 'commodityList'})">返回</el-button>
    </div>
  </div>
</template>
<script>
import { queryByPage, getCommodityQueryBox ,getDetail,addCommodity,updataCommodity} from '@/api/interaction/commodityList'
import {apiObj} from '@/config/getUrl.js'
// eslint-disable-next-line
import { mapState } from 'vuex'
// import { getDetail,updataBrand,addBrand} from '@/api/brandManage'
export default {
  name: 'ConditionLibraryMod',
  data() {
    var checkData=(rule, value, callback) =>{
      // if (/[^\w\.\/]/ig.test(value)) {
      //     callback(new Error('不能输入汉字或者空格！'));
      //   }
      if (value) {
        if (/[^\w\.\/]/ig.test(value)) {
          callback(new Error('只能输入数字或者英文字符！'));
        } else {
          callback();
        }
      }
      callback();
    }
    return {
      product_type_list:[],
      product_series_list:[],
      uploadOss:`${apiObj.uploadOss}/val`,
      parentList:[],
      disabled: false,
      rules: {
        product_name_cn:
          [
            { required: true, message: '请输入商品名称', trigger: 'blur' },
          ],
        product_code:
          [
            { required: true, message: '请输入商品code', trigger: 'blur' },
            { validator: checkData, trigger: 'blur'}
          ],
        product_type:[{ required: true, message: '请选择产品分类', trigger: 'blur' }],
        product_series:[{ required: true, message: '请选择产品系列', trigger: 'blur' }],
      },
      form: {
        id:'',
        product_name_cn:"",
        product_code:'',
        product_type:'',
        product_series:"",
      },
      param: {},
      id: '',
    }
  },
  computed: {
    ...mapState({
      sidebar: state => state.app.sidebar
    })
  },
  mounted() {
    this.getCommodityQueryBoxFun()
    this.id = this.$route.query.id
    if (this.$route.query.type && this.$route.query.type === 'view') {
      this.disabled = true
    } else{
      this.disabled = false
    }
    if(this.id){
      this.getDetail()
    }
  },
  methods: {
    getCommodityQueryBoxFun(){
      getCommodityQueryBox().then((res)=>{
        this.product_series_list=res.data.productSeriesList||[]
        this.product_type_list=res.data.productSeriesList||[]
      })
    },
    getDetail() {
      getDetail({ id: this.id }).then((res) => {
        this.form = res.body
      })
    },
    save() {
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
        updataCommodity(this.form).then((res) => {
          if (res.code == 0) {
            this.$message.success('更新成功')
            this.$router.go(-1)
          }
        })
      } else {
        addCommodity(this.form).then((res) => {
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
 .product-container{
   height: 90%;
   background: #fff;
    .el-select {
        width: 100%;
   }
 }
</style>

