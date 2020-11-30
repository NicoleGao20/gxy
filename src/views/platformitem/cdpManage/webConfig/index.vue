<template>
  <div class="web-config">
    <el-card shadow="never">
      <p class="title">网站设置</p>
      <el-form label-position="left" label-width="120px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="网站名称">
              <el-input v-model="form.websiteName" maxlength="50" placeholder="请输入网站名称"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="网站LOGO">
               <el-upload
                class="avatar-uploader"
                :action="uploadOss"
                accept=".jpg,.png"
                :show-file-list="false"
                :on-success="handleLogoSuccess"
                :before-upload="beforeLogoUpload">
                <img v-if="form.websiteLogo" :src="form.websiteLogo" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
              <span class="uploadImgTip">建议上传图片格式为.png ,.jpg的图片 ，大小不超过1M</span>
              <!-- <el-upload
                v-if="!form.websiteLogo"
                :show-file-list="false"
                :before-upload="beforeLogoUpload"
                :on-success="handleLogoSuccess"
                :on-error="uploadErr"
                :action="uploadOss"
                class="upload-demo"
                drag
                accept=".jpg,.jpeg,.png,.JPG,.JPEG"
                name="file">

                <i v-show="!loading1" class="el-icon-upload"/>
                <i v-show="loading1" class="el-icon-loading"/>
                <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                <div slot="tip" class="el-upload__tip">建议尺寸180 * 60 （像素）</div>
              </el-upload>
              <section v-else class="imgContent">
                <img :src="form.websiteLogo" alt="图像暂不可加载">
                <transition name="show">
                  <div class="del" @click="delImg('websiteLogo')">
                    <i class="el-icon-delete"/>
                  </div>
                </transition>
              </section> -->
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="地址栏图标">
               <el-upload
                class="avatar-uploader"
                :action="uploadOss"
                accept=".ico"
                :show-file-list="false"
                :on-success="handleIcoSuccess"
                :before-upload="beforeIcoUpload">
                <img v-if="form.addressIcon" :src="form.addressIcon" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
              <span class="uploadImgTip">建议上传图片格式为.ico 的图片 ，大小不超过1M</span>
              <!-- <el-upload
                v-if="!form.addressIcon"
                :show-file-list="false"
                :before-upload="beforeIcoUpload"
                :on-success="handleIcoSuccess"
                :on-error="uploadErr"
                :action="uploadOss"
                class="upload-demo"
                drag
                accept=".ico"
                name="file">
                <i v-show="!loading2" class="el-icon-upload"/>
                <i v-show="loading2" class="el-icon-loading"/>
                <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                <div slot="tip" class="el-upload__tip">建议尺寸32 * 32 （像素）<br> 如果无法正常显示新上传的图标，清空浏览器缓存后访问。</div>
              </el-upload>
              <section v-else class="imgContent">
                <img :src="form.addressIcon" alt="图像暂不可加载">
                <transition name="show">
                  <div class="del" @click="delImg('addressIcon')">
                    <i class="el-icon-delete"/>
                  </div>
                </transition>
              </section> -->
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="网站关键词">
              <el-input v-model="form.websiteKeyWord" maxlength="50" placeholder="多个关键词用英文状态下的逗号分隔，建议3到4个关键词"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="网站描述">
              <el-input v-model="form.websiteDesc" :rows="3" type="textarea" placeholder="网站描述（100字以内）" maxlength="100"/>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
    <el-card shadow="never" style="margin-top:15px;">
      <p class="title">底部信息设置（显示在网站前台底部）</p>
      <el-form label-position="left" label-width="120px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="版权信息">
              <el-input v-model="form.versionInfo" maxlength="200" placeholder="请输入版权信息"/>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
    <div class="form_footer">
      <!-- <el-button class="top-operate-btn" @click="$router.back()">
        返回
      </el-button> -->
      <template>
        <el-button class="top-operate-btn ml-20" type="primary" @click="save">保存</el-button>
      </template>
    </div>
  </div>
</template>
<script>
import { apiObj } from '@/config/getUrl.js'
import { addWebSiteInfo, getWebsiteInfo, editWebSiteInfo } from '@/api/config'
export default {
  name: 'Config',
  data() {
    return {
      loading1: false,
      loading2: false,
      uploadOss: `${apiObj.uploadOss}/val`,
      form: {
        id: '',
        deleted: '0',
        websiteName: '',
        websiteLogo: '',
        phoneLogo: '',
        addressIcon: '',
        websiteKeyWord: '',
        websiteDesc: '',
        versionInfo: '',
        addressPostcode: '',
        contactInfo: '',
        otherInfo: ''
      }
    }
  },
  created() {
    this.getDetail()
  },
  methods: {
    delImg(type) {
      this.form[type] = ''
    },
    beforeLogoUpload(file) {
      if(file.name&&!this.isImgage(file.name)){
        this.$message.error('请上传格式为 JPG、PNG的图片');
        return false
      }
      const isLt2M = file.size / 1024 /1024 > 1;
      if (isLt2M) {
        this.$message.error('上传头像图片大小不能超过 1MB!');
        return  false;
      }
      // this.loading1 = true
      // return true
    },
    isImgage(name,type){
      var reg =/\.[jpg|png]/i ;
      console.log(name.match(reg))
      return name.match(reg)
    },
    beforeIcoUpload(file) {
      if(file.name&&!this.isIcoImg(file.name)){
        this.$message.error('请上传格式为.ico的图片');
        return false
      }
      const isLt2M = file.size / 1024 /1024 > 1;
      if (isLt2M) {
        this.$message.error('地址栏icon大小不能超过 1MB!');
        return  false;
      }
      // this.loading2 = true
      // return true
    },
    isIcoImg(name,type){
      var reg =/\.[ico]/i ;
      return name.match(reg)
    },
    handleLogoSuccess(response, file, fileList) {
      this.form.websiteLogo = response.body.url
      // this.loading1 = false
    },
    handleIcoSuccess(response, file, fileList) {
      this.form.addressIcon = response.body.url
      // this.loading2 = false
    },
    uploadErr(file) {
      this.$message.error('网络异常，请稍后重试！')
    },
    getDetail() {
      getWebsiteInfo().then(res => {
        Object.keys(this.form).forEach(key => {
          this.form[key] = res.body[key] || this.form[key]
        })
      })
    },
    save() {
      const parm = Object.assign({}, this.form)
      if (!parm.id) {
        delete parm['id']
        addWebSiteInfo(parm).then(res => {
          this.$message.success('配置成功')
        })
      } else {
        editWebSiteInfo(parm).then(res => {
          this.$message.success('编辑成功')
        })
      }
    }
  }
}
</script>
<style lang="less" scoped>
  .web-config {
    padding-bottom: 50px;
    /deep/.el-upload__tip {
      line-height: 1.5;
      position: absolute;
      left: 380px;
      bottom: 10px;
      min-width: 150px;
    }
    .title {
      font-size: 16px;
      position: relative;
      // left: 6px;
      padding-left: 10px;
      margin-bottom: 15px;
      &::after {
        content: "";
        position: absolute;
        top: 5%;
        left: 1px;
        width: 3px;
        height: 90%;
        background: #435a82;

      }
    }
    /deep/.el-icon-loading {
      font-size: 67px;
      color: #C0C4CC;
      margin: 40px 0 16px;
      line-height: 50px;
    }
    .imgContent {
      position: relative;
      padding: 10px;
      width: 360px;
      height: 180px;
      border-radius: 6px;
      overflow: hidden;
      border: 1px dashed #d9d9d9;
      &:hover .del{
        display: block;
      }
      .del {
        display: none;
        position: absolute;
        left: -10px;
        bottom: 0;
        width: calc(100% + 20px);
        line-height: 40px;
        text-align: center;
        background-color: #f56c6c;
        font-size: 16px;
        cursor: pointer;
      }
    }
  }
</style>
