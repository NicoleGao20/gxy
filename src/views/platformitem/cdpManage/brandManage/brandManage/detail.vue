<template>
  <div class="brand-container">
    <div style="padding-bottom: 50px;width:550px">
      <el-form ref="form" :model="form" :rules="rules" label-position="right" label-width="120px">
        <el-form-item
          label="品牌编号"
          prop="brandCode">
          <el-input v-model="form.brandCode" maxlength="100" :disabled="disabled" clearable />
        </el-form-item>
        <el-form-item
          label="品牌名称"
          prop="brandName">
          <el-input v-model="form.brandName"  maxlength="100"  :disabled="disabled" clearable />
        </el-form-item>
        <el-form-item
          label="品牌描述"
          prop="description">
          <el-input v-model="form.description" :rows="2"  maxlength="200"  :disabled="disabled" type="textarea" clearable/>
        </el-form-item>
        <el-form-item label="品牌logo" prop="logo"  ref="image">
          <el-upload
            class="avatar-uploader"
            :action="uploadOss"
            accept=".jpg,.png"
            :show-file-list="false"
            :on-remove="handleRemove"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload">
            <div  v-if="form.logo"  class="uploadImgBox">
              <img :src="form.logo" class="avatar">
              <!-- <span class="el-icon-close" @click.stop="removeImg"></span> -->
            </div>
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
          <span class="uploadImgTip">建议上传图片格式为 JPG、PNG，大小不超过1M</span>
        </el-form-item>
      </el-form>
    </div>
    <div :style="{left: sidebar.opened?'230px': '50px'}" class="action-wrap">
      <el-button v-if="!disabled" class="top-operate-btn ml-20" type="primary" @click="save">保存</el-button>
      <el-button @click="$router.push({ name: 'brandManage'})">返回</el-button>
    </div>
  </div>
</template>
<script>
import {apiObj} from '@/config/getUrl.js'
// eslint-disable-next-line
import { mapState } from 'vuex'
import { getBrandDetail,updataBrand,addBrand} from '@/api/brandManage'
export default {
  name: 'ConditionLibraryMod',
  data() {
                
    //自定义正则
    var valiIcon = (rule, value, callback) => {
          // 图片验证
      if (!this.form.logo) { 
        callback(new Error("请上传品牌logo"));
      } else {
        callback();
      }
    }
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
      uploadOss:`${apiObj.uploadOss}/val`,
      parentList:[],
      disabled: false,
      rules: {
        brandCode:
          [
            { required: true, message: '请输入品牌code', trigger: 'blur' },
            { validator: checkData, trigger: 'blur'}
          ],
        brandName:[{ required: true, message: '请输入品牌名称', trigger: 'blur' }],
        logo:[{ required: true,  validator: valiIcon }],
      },
      form: {
        id:'',
        brandCode:"",
        brandName:'',
        logo:'',
        description:''
      },
      param: {},
      id: '',
      isEdit: false,
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
    } else{
      this.disabled = false
    }
    if(this.id){
      this.getDetail()
    }
  },
  methods: {
    handleAvatarSuccess(response, file) {
        this.form.logo = response.body.url
        this.$refs.image.clearValidate();
    },
    beforeAvatarUpload(file) {
      if(file.name&&!this.isImgage(file.name)){
          this.$message.error('请上传格式为 JPG、PNG的图片');
        return false
      }
      const isLt2M = file.size / 1024 /1024 > 1;
      if (isLt2M) {
        this.$message.error('上传头像图片大小不能超过 1MB!');
        return  false;
      }
      
    },
    isImgage(name){
      var reg =/\.[jpg|png]/i ;
      console.log(name.match(reg))
      return name.match(reg)
    },
    handleRemove(){},
    removeImg(){
      this.form.logo =''
      this.$refs.image.validate();
    },
    getDetail() {
      getBrandDetail({ id: this.id }).then((res) => {
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
 .uploadImgBox{
   position: relative;
   .el-icon-close{
     position: absolute;
     top: 0;
     right: 0;
     color: red;
   }
 }
</style>

