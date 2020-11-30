<template>
  <el-container v-loading="pageLoading" class="level-adjustment-file-import-container">
    <el-form ref="form" label-position="right" label-width="100px">
      <el-form-item label="第一步:">
        <div>请下载模板并按模板中格式编辑您要导入的数据(支持*.xls及*.xlsx文件格式)。 <span
          class="download-template"
          @click="downloadTemplate">点击下载模板</span></div>
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
        <el-input v-model="remark" :rows="3" type="textarea" resize="none"/>
      </el-form-item>
      <div class="import-button-container">
        <el-button type="primary" @click="handleImport">导入</el-button>
      <span v-if="showDetail" @click="handleViewImportDetail">查看导入详情</span></div>
      <import-tip
        v-if="showResult"
        :icon="!!failCount?'el-icon-error':'el-icon-success'"
        :success-count="successCount"
        :fail-count="failCount"
        :fail-list="failList"
        :url="returnUrl"
        :show-line="showLine"/>
    </el-form>
  </el-container>
</template>

<script>
import { importLevelExcel } from '@/api/markting/level'
import importTip from '@/componentsMarketing/importTip/importTip'
export default {
  name: 'LevelAdjustmentFileImport',
  components: {
    importTip
  },
  data() {
    return {
      showDetail: false,
      remark: '',
      isFile: false,
      // 导入详情数据
      showResult: false,
      successCount: 0,
      failCount: 0,
      showLine: false,
      failList: [],
      icon: '',
      returnUrl: '',
      pageLoading: false
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
      this.$router.push({ name: 'levelChangeLog' })
    },

    downloadTemplate() {
      window.location.href = 'https://auth-setting.oss-cn-shanghai.aliyuncs.com/memberModelExcel16f0018aefde48a8a98bc75a7acf2d80.xlsx'
    },
    uploadFile(file) {
      const data = new FormData()
      data.append('file', file.file)
      if (this.remark) data.append('remark', this.remark)
      this.pageLoading = true
      importLevelExcel(data).then(res => {
        if (res && Number(res.code) === 1 && res.data) {
          this.showResult = true
          this.showDetail = true
          this.successCount = res.data.success_count
          this.failCount = res.data.fail_count
          res.data.row.forEach((item, index) => {
            item.line = index + 1
          })
          this.failList = res.data.row
          this.returnUrl = res.data.message_file_url
        }
      }).finally(() => {
        this.pageLoading = false
      })
    }
  }
}
</script>

<style lang="less" scoped>
.level-adjustment-file-import-container {
  padding: 20px;

  .import-button-container {
    .el-button {
      margin-left: 30px;
    }

    > span {
      margin-left: 20px;
      color: red;
      cursor: pointer;
    }
  }
  .importTip {
    margin-left: 20px;
  }
  .download-template {
    cursor: pointer;
    color: #005dd2;
  }
}
</style>
