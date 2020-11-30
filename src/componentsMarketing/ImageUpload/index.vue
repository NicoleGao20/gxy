<template>
  <!--   单图片上传预览组件-->
  <div class="image-upload-container">
    <el-upload
      ref="upload"
      :action="postUrl"
      :on-change="handleImageChange"
      :show-file-list="false"
      :auto-upload="false"
      :multiple="false"
      :limit="1"
      :before-upload="beforeImageUpload"
      :on-success="handleSuccess"
      :on-error="handleError"
      list-type="picture-card"
      accept=".jpg,.jpeg,.png,.JPG,.JPEG"
      class="image-upload"
      name="file">
      <div v-if="imageUrl" class="mask">
        <i class="el-icon-zoom-in" @click.stop="handleImagePreview"/>
        <i class="el-icon-plus"/>
        <i class="el-icon-delete" @click.stop="handleImageRemove"/>
      </div>
      <img v-if="imageUrl" :src="imageUrl" class="avatar">
      <i v-else class="el-icon-plus avatar-uploader-icon"/>
    </el-upload>
    <el-dialog :visible.sync="dialogVisible" custom-class="cia-dialog--without-header">
      <img :src="imageUrl" width="100%" alt="">
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: 'Index',
  props: {
    imageUrl: {
      type: String,
      default: ''
    },
    postUrl: {
      type: String,
      default: ''
    },
  },
  data() {
    return {
      dialogVisible: false,
      isError: false,
    }
  },
  mounted() {
    console.log('post url', this.postUrl)
  },
  methods: {
    /**
     *  上传图片改变
     */
    handleImageChange(file, fileList) {
      const FILE = file.raw
      const IS_IMAGE = (FILE.type).indexOf('image/') > -1
      const IS_LT_1M = FILE.size / 1024 / 1024 < 1
      if (!IS_IMAGE) {
        this.$message.error('只支持jpg、png、jpeg格式!')
        this.handleImageRemove()
        return
      }
      if (!IS_LT_1M) {
        this.$message.error('上传头像图片大小不能超过 1MB!')
        this.handleImageRemove()
        return
      }
      if(!this.isError){
        this.getBase64(FILE).then(result => {
          if (result) {
            this.$emit('imageChange', result)
          }
        })
        return
      }
      this.isError = false
    },

    /**
     *  图片转 base64
     */
    getBase64(file) {
      return new Promise(function(resolve, reject) {
        const reader = new FileReader()
        let imgResult = ''
        reader.readAsDataURL(file)
        reader.onload = function() {
          imgResult = reader.result
        }
        reader.onerror = function(error) {
          reject(error)
        }
        reader.onloadend = function() {
          resolve(imgResult)
        }
      })
    },

    /**
     *  转为 blob
     */
    getBlob(file) {
      return new Promise(function(resolve, reject) {
        if (window.createObjectURL !== undefined) {
          // basic
          resolve(window.createObjectURL(file))
        } else if (window.URL !== undefined) {
          // mozilla(firefox)
          resolve(window.URL.createObjectURL(file))
        } else if (window.webkitURL !== undefined) {
          // webkit or chrome
          resolve(window.webkitURL.createObjectURL(file))
        } else {
          reject()
        }
      })
    },

    /**
     *  图片上传成功
     */
    beforeImageUpload(file) {
      const isImage = (file.type).indexOf('image/') > -1
      const isLt1M = file.size / 1024 / 1024 < 1
      if (!isImage) {
        this.$message.error('只支持jpg、png、jpeg格式!')
      }
      if (!isLt1M) {
        this.$message.error('上传头像图片大小不能超过 1MB!')
      }
      return isImage && isLt1M
    },

    /**
     *  图片上传成功
     *  @param res   Resource
     *  @param file  File uploaded
     */
    handleSuccess(res, file) {
      if (Number(res.code) === 0) {
        this.$emit('imageChange', res.body.url)
        this.$emit('submitFormData')
      }
    },

    /**
     *  图片上传失败
     *  @param err   err
     *  @param file  file
     *  @param fileList  file list
     */
    handleError(err, file, fileList){
      this.isError = true
      this.$message.error(JSON.stringify(err))
      this.handleImageRemove()
      this.$emit('update:loading', false)
    },

    /**
     *  图片预览
     */
    handleImagePreview() {
      this.dialogVisible = true
    },

    /**
     *  提交上传
     */
    submitUpload() {
      this.$refs.upload.submit()
    },

    /**
     * 移除本地图片
     */
    handleImageRemove() {
      this.$refs.upload.clearFiles()
      this.$emit('imageChange', '')
    }
  }
}
</script>

<style lang="less">
.image-upload-container {
  .image-upload .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    width: 200px;
    height: 120px;
  }

  .image-upload .el-upload:hover {
    border-color: #409EFF;
  }

  .image-upload-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }

  .avatar {
    width: 200px;
    height: 120px;
    display: block;
  }

  .mask {
    width: 100%;
    height: 100%;
    overflow: hidden;
    opacity: 0;
    position: absolute;
    background: rgba(0, 0, 0, 0.2);
    cursor: pointer;
    transition: opacity 0.4s;
    z-index: 2;
    display: flex;
    justify-content: space-between;
    flex-direction: row;
    align-items: center;

    &:hover {
      opacity: 1;
    }

    i {
      flex: 1;
      color: #fff;
    }
  }

  .el-dialog__headerbtn {
    top: 10px
  }
}

</style>
