<template>
  <div class="dc-upload-content">
    <ComTitle :name="setdata.name" :data="data" :setdata="setdata"/>
    <el-upload
      :v-model="(setdata.index === '0'|| setdata.index )? data.children[setdata.index][setdata.pop] : data[setdata.pop]"
      :show-file-list="false"
      :before-upload="beforeUpload"
      :on-progress="onProgress"
      :on-success="onSuccess"
      :on-error="onError"
      action="/crm-backend/backend/image/upload"
      list-type="picture"
      accept=".jpg, .jpeg, .png"
      class="dc-image-upload"
    >
      <div v-loading="loading" class="upload-image-preview">
        <img :src="(setdata.index === '0'|| setdata.index )? data.children[setdata.index][setdata.pop] : data[setdata.pop] || '/static/decorate/image-placeholder.png'" >
      </div>
      <el-button size="small" type="primary">更换图片</el-button>
      <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过1M</div>
    </el-upload>
  </div>
</template>
<script type="text/javascript">
import ComTitle from './comTitle'
export default {
  name: 'DecorateUpload',
  components: {
    ComTitle
  },
  props: {
    setdata: {
      type: Object,
      default() {
        return {}
      }
    },
    data: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      loading: false
    }
  },
  methods: {
    beforeUpload(file) {
      const isLt1M = file.size / 1024 / 1024 < 1
      if (!isLt1M) {
        this.$message.error('图片大小不能超过1M！')
      }
      return isLt1M
    },
    onProgress(response, file, fileList) {
      this.loading = true
    },
    onSuccess(response, file, fileList) {
      this.loading = false
      if (this.setdata.index === '0' || this.setdata.index) {
        this.data.children[this.setdata.index][this.setdata.pop] = response.data
      } else {
        this.data[this.setdata.pop] = response.data
      }
      this.$store.dispatch('updateChildComponent', this.data)
    },
    onError(event, file, fileList) {
      setTimeout(() => {
        this.loading = false
      }, 3000)
      this.$message.error('上传失败')
    }
  }
}
</script>
<style lang="less" scoped>
  .dc-upload-content {
    .upload-image-preview {
      width: 180px;
      height: 100px;
      border: 1px solid #eee;
      background: url(/static/decorate/trans_bg.gif) repeat center top;
      text-align: center;

      img {
        height: 100%;
      }
    }
  }
</style>
<style lang="less">
.dc-image-upload {
  .el-upload {
    .el-button {
      display: block;
      width: 100%;
      padding: 3px 15px;
      border-radius: 0;
    }
  }
}
</style>

