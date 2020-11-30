<template>
  <el-container class="level-adjustment-file-import-container">
    <el-form label-position="right" label-width="100px">
      <el-form-item label="第一步:">
        <div>请下载模板并按模板中格式编辑您要导入的数据(支持*.xls及*.xlsx文件格式)。 <el-button type="text" @click="downloadTemplate">点击下载模板</el-button></div>
        <div>多个文件，则将文件名按照顺序命名，如：模版文件001.xls，模版文件002.xls，再压缩成zip格式上传！</div>
        <div>注：只有存在系统中的会员才能够导入，否则将被过滤！</div>
      </el-form-item>
      <el-form-item label="第二步:">
        <el-upload
          ref="upload"
          :show-file-list="true"
          :auto-upload="false"
          :limit="1"
          :http-request="uploadFile"
          :on-change="fileChange"
          :before-remove="removeFile"
          accept=".xls, .xlsx, .zip"
          action=""
        >
          <el-button size="small" type="primary">选择文件</el-button>
        </el-upload>
      </el-form-item>
      <el-form-item label="操作说明:">
        <el-input :rows="3" v-model="remark" type="textarea" resize="none"/>
      </el-form-item>
      <div class="import-button-container"><el-button type="primary" @click="handleImport" :loading="btnLoading">导入</el-button> <el-button type="text" v-show="showDetail" @click="handleViewImportDetail">查看导入详情</el-button></div>
      <import-tip v-if="showResult" :icon="failCount*1 > 0 ? 'el-icon-error' : 'el-icon-success'" :success-count="successCount*1" :fail-count="failCount*1" :fail-list="failList" :url="returnUrl"/>
    </el-form>
  </el-container>
</template>

<script>
import importTip from '@/componentsMarketing/importTip/importTip'
import { importExcel } from '@/api/markting/rePoint'
export default {
  components: {
    importTip
  },
  data() {
    return {
      showDetail: false,
      form: {

      },
      remark: '',
      isFile: false,
      btnLoading:false,
      // 导入详情数据
      showResult: false,
      successCount: 0,
      failCount: 0,
      failList: [],
      icon: '',
      returnUrl: ''
    }
  },
  methods: {
    fileChange() {
      this.isFile = true
    },
    removeFile() {
      this.isFile = false
    },
    // 导入
    handleImport() {
      if (this.isFile) {
        this.$refs.upload.submit()
      } else {
        this.$message('请选择文件')
      }
    },

    // 查看导入详情
    handleViewImportDetail() {
      this.$router.push({ name: 'pointslog' })
    },

    downloadTemplate() {
      window.open('https://auth-setting.oss-cn-shanghai.aliyuncs.com/valc2cd1633-0772-4681-9acb-306ce6d3b31b积分调整.xlsx')
    },
    uploadFile(file) {
      this.btnLoading = true
      var data = new FormData()
      data.append('file', file.file)
      if (this.remark) data.append('remark', this.remark)
      importExcel(data).then(({ data }) => {
        this.btnLoading = false
        this.$refs.upload.clearFiles()
        this.isFile = false
        this.showResult = true
        this.showDetail = true
        this.successCount = data.success_count,
        this.failCount = data.fail_count,
        this.failList = data.row,
        this.returnUrl = data.message_file_url
      })
    }
  }
}
</script>

<style lang="less" scoped>
.level-adjustment-file-import-container {
  padding: 20px;
  .import-button-container {
    .el-button{
      margin-left: 30px;
    }
    >span{
      margin-left: 20px;
      color: red;
      cursor: pointer;
    }
  }
}
</style>
