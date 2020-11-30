<template>
  <div>
    <div>
      <el-upload
        :show-file-list="false"
        :action="actionUrl"
        :headers="{
          Authorization: `Bearer ${getCookie('token')}`
        }"
        :before-upload="beforeUpload"
        :on-success="uploadSuccess"
        :disabled="onlyRead"
        style="display: inline-block;"
        size="mini"
        class="upload-demo">
        <el-button :disabled="onlyRead" :loading="uploading" size="mini" type="primary">点击上传</el-button>
      </el-upload>
      <el-button type="primary" size="mini" plain @click="exportNullExcel">下载模版</el-button>
    </div>
    <div class="store-item-wrap">
      {{ storeItemsStr }}
    </div>
  </div>
</template>
<script>
import emitter from 'element-ui/src/mixins/emitter'
// json -> excel
import ExportJsonExcel from 'js-export-excel'

export default {
  name: 'UploadStore',
  mixins: [emitter],
  props: {
    value: {
      type: String,
      default: ''
    },
    onlyRead: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      actionUrl: '/crm-backend/backend/file/upload',
      storeItemsStr: '',
      uploading: false
    }
  },
  mounted() {
    if (this.value) {
      this.queryShopList(this.value)
    }
  },
  methods: {
    getCookie(name) {
      const reg = new RegExp('(^| )' + name + '=([^;]*)(;|$)')
      const arr = document.cookie.match(reg)
      if (arr) {
        return unescape(arr[2])
      } else {
        return null
      }
    },
    queryShopList(batchNo) {
      this.$request({
        url: `/component/choosingStore/queryShopList`,
        method: 'GET',
        params: { batchNo: batchNo }
      }).then(res => {
        this.storeItemsStr = (res.data.list || []).map(item => item.orgName).join(',')
      })
    },
    beforeUpload(file) {
      var extendName = /[^\.]\w*$/.exec(file.name)[0]
      if (['xlsx'].indexOf(extendName) === -1) {
        this.$message({
          type: 'error',
          message: '请上传xlsx格式文件'
        })

        return false
      }

      this.uploading = true
      return true
    },
    uploadSuccess(response) {
      this.$request({
        url: '/component/choosingStore/uploadExcelReturnShopList',
        method: 'POST',
        params: {
          filePath: response.data
        }
      }).then(res => {
        if (res.data && res.data.list && res.data.list.length) {
          var list = res.data.list.map((item) => {
            return {
              org_code_long: item.orgCodeLong, type: 'include'
            }
          })

          this.$request({
            url: `/component/choosingStore/saveShopList`,
            method: 'POST',
            data: { list: list }
          }).then(res => {
            this.uploading = false
            this.$emit('input', res.data.batchNo)

            this.queryShopList(res.data.batchNo)
            // 触发校验事件
            this.dispatch('ElFormItem', 'el.form.change', [''])
          })
        } else {
          this.$message({
            type: 'error',
            message: '上传的门店编码未能匹配到'
          })
          this.uploading = false
        }
      })
    },
    exportNullExcel() {
      var option = {
        datas: [ // 可多张sheet
          {
            sheetData: [{ id: '' }], // 数据
            // sheetName: 'sheet', //左下角tab页的sheet名
            sheetFilter: ['id'], // json的key，需要和header的每一项顺序对应
            sheetHeader: ['门店编号'], // .xlsx的表头
            columnWidths: [5] // 表格宽度
          }
        ],
        fileName: '导入门店模版'
      }
      const toExcel = new ExportJsonExcel(option)
      toExcel.saveExcel()
    }
  }
}
</script>
<style scoped>
  .store-item-wrap {
    margin-top: 5px;
    border: 1px solid #ccc;
    height: 80px;
    overflow: auto;
  }
</style>
