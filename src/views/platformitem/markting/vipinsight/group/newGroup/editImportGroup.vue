<template>
  <div class="page-container-gap">
    <!-- 受众名称--编辑 -->
    <section>
      <header>
        <el-form ref="form" :model="searchForm" :rules="rules" label-position="right" label-width="80px">
          <div class="label-title">
            <i class="linev-tip"/><span class="label-desc">基本信息</span>
            <span class="info_tip">* 为必填</span>
          </div>
          <el-row :gutter="20">
            <el-col :span="8">
              <el-form-item label="受众名称" prop="group_name">
                <el-input v-model.trim="searchForm.group_name" clearable />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="创建方式">
                <el-select v-model="searchForm.create_type" style="width: 100%;" clearable placeholder="请选择" disabled>
                  <el-option
                    v-for="(labelType, index) in create_type_list"
                    :key="index"
                    :label="labelType.label"
                    :value="labelType.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="受众目的">
                <el-select v-model="searchForm.group_purpose" style="width: 100%;" clearable placeholder="请选择">
                  <el-option
                    v-for="(labelType, index) in group_purpose"
                    :key="index"
                    :label="labelType.label"
                    :value="labelType.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-form-item label="受众说明">
              <el-input
                v-model="searchForm.group_desc"
                type="textarea"
                autosize
                maxlength="400"
                placeholder="根据导入的数据说明受众人群，最多可以填400字"/>
            </el-form-item>
          </el-row>
              <el-row v-if="!readOnly" :gutter="20">
              <el-col :span="24">
              <el-form-item label="导入方式" prop="import_method">
                <el-radio-group v-model="searchForm.import_method" size="medium">
                  <el-radio v-for="(item, index) in import_mode" :key="index" :label="item.value"
                    :disabled="item.disabled">{{item.label}}</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-if="searchForm.import_method == 1 && !readOnly" :gutter="20" class="star-mark">
            <el-col :span="24">
              <el-form-item label="ID类型" prop="import_type">
                <!-- radioChange -->
                <el-radio v-for="item in radio_phone" v-model="searchForm.import_type" :key="item.value" :label="item.key"  :disabled="item.key==='2' || item.key==='3' || item.key==='4' || item.key==='5'">{{ item.label }}{{item.id}}</el-radio
                >
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </header>
      <main class="tableMainContent">
        <div class="upLoad-contain">
          <div :class="upLoading?'relativeBtn':'btns'">
            <el-upload
              ref="upload"
              :on-success="handleSuccess"
              :on-error="handleError"
              :headers="{ 'Authorization':'Bearer ' + $store.getters.token}"
              :before-upload="beforeUpload"
              :data="uploadFileData"
              :show-file-list="false"
              :file-list="fileList"
              :multiple="false"
              accept=".xls,.xlsx"
              name="file"
              :action="uploadOss">
              <el-button v-if="!upLoading" size="small" type="primary"> <i class="el-icon-upload2"/> 上传文件</el-button>
            </el-upload>
            <div v-if="upLoading" class="disabledBtn"><i class="el-icon-upload2"/> 上传文件</div>
            <el-button style="margin-top:15px;" size="small" type="primary" @click="exportNullExcel"> <i class="el-icon-download"/> 下载模版</el-button>
          </div>
          <div class="information">
            <!-- 上传状态  成功提示  失败提示  失败详情 -->
            <div v-if="uploadStatus == 'defult'" class="defult-info">
              <h4 class="defult-title">会员信息表</h4>
              <p>重复导入会员信息时，会直接覆盖已导入的会员信息.</p>
              <p>文件后缀名必须为xlsx,文件大小不得大于5M.</p>
              <p v-if="memberInfo && uploadStatus == 'defult' && loadFile.name === ''" style="color: #435a82;">成功上传条数：{{ memberInfo }}条</p>
              <!-- 正上传列表 -->
              <div v-if="loadFile.name" class="uploadFile">
                <span>{{ loadFile.name }}  ({{ loadFile.size | sizeFormat }})</span>
                <i class="el-icon-loading" style="margin-left:20px; color:#4D6CA1;"/>
              </div>
            </div>
            <div v-if="uploadStatus == 'success'" class="suc-info">
              <h4 class="suc-title">批量导入成功</h4>
              <p>成功导入数量：{{ failTip.success_total }}</p>
              <p>失败导入数量：0</p>
            </div>
            <div v-if="uploadStatus == 'failure'" class="fail-info">
              <div>
                <h4 class="suc-title">{{ failTip.total === failTip.fail_total ? '全部导入失败':'部分导入成功' }}</h4>
                <p>导入总条数：{{ failTip.success_total + failTip.fail_total }}</p>
                <p>失败条数：{{ failTip.fail_total }}</p>
                <el-button style="margin-top:15px;" size="small" type="primary" @click="exportExcel">导出明细</el-button>
              </div>
              <div class="fail-details">
                <p v-for="(item,i) in failTip.fail_list" :key="i">第{{ item.number }}行，{{ item.member_id }}{{ item.error_reason }}</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </section>
    <footer :style="{left: sidebar.opened?'230px': '50px'}" class="action-wrap">
      <el-button :loading="isLoading" type="primary" size="small" class="search-more" @click="drawerTo">查看画像</el-button>
      <el-button :loading="isLoading" type="primary" size="small" class="search-more" @click="save('stopped')">保存草稿</el-button>
      <el-button :loading="isLoading" type="primary" size="small" class="search-more" @click="save('started')">保存并启用</el-button>
      <el-button :loading="isLoading" type="primary" size="small" class="search-more" @click="cancel">取消</el-button>
    </footer>
    <el-drawer
      :visible.sync="drawer"
      :with-header="false"
      title="群像分析"
      size="90%">
      <span>
        <crm-group-portraint v-if="drawer" :label-id="$route.query.id" :group-data-table="uploadFileData.group_data_table" :create-type="$route.query.group_type" link_resource="group"/>
      </span>
    </el-drawer>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import { apiObj } from '@/config/getUrl.js'
import { getGroupDetails, importGroup, getMemberInfo, editGroup } from '@/api/markting/vinpinsightGrouplist'
import crmGroupPortraint from '@/views/platformitem/markting/dataAnalysis/crmGroupPortrait/index'
// json -> excel
import ExportJsonExcel from 'js-export-excel'
export default {
  filters: {
    sizeFormat(size) {
      if (size / 1024 / 1024 < 1) {
        return (size / 1024).toFixed(2) + 'KB'
      } else {
        return (size / 1024 / 1024).toFixed(2) + 'MB'
      }
    }
  },
  components: {
    crmGroupPortraint
  },
  data() {
    return {
      drawer: false,
      upLoading: false,
      isLoading: false,
      readOnly:'',
      uploadOss: `${apiObj.uploadOss}/backend/file/upload`,
      searchForm: {
        id: '',
        status: '',
        group_name: '',
        create_type: 'file_import',
        create_region: '华北',
        brand_code: 'belle',
        group_purpose: '',
        group_desc: '',
        import_method: '1',
        import_type: '1'
      },
      memberForm: {
        id: '',
        brand_code: 'belle',
        group_data_table: this.$route.query.group_data_table
      },
      memberInfo: '',
      rules: {
        group_name: [
          { required: true, message: '请输入受众名称', trigger: 'blur' }
        ],
        create_type: [
          { required: true, message: '请选择创建方式', trigger: 'blur' }
        ],
         // 导入方式
        import_method: [{
          required: true,
          message: '请选择导入方式',
          trigger: 'change'
        }],
        //类型
        import_type: [
          { required: true, message: '请选择ID地址',  trigger: "change"}
        ]
      },
      create_type_list: [
        { label: '导入受众', value: 'file_import' },
        { label: '普通受众', value: 'normal' },
        { label: '高级受众', value: 'advanced' }
      ],
      group_purpose: [
        { label: '常规营销', value: 'regular_marketing' },
        { label: '休眠唤醒', value: 'sleep_wake ' },
        { label: '流失召回', value: 'loss_recall' },
        { label: '店铺引流', value: 'shop_drainage' },
        { label: '活动宣传', value: 'event_promotion' },
        { label: '会员关怀', value: 'member_care' },
        { label: '系统通知', value: 'system_notification' }
      ],
         radio_phone: [
        { label: '手机号码', value: '手机号码', key: '1' },
        { label: '邮箱', value: '邮箱', key: '2' },
        { label: 'MAC地址', value: 'MAC地址', key: '3' },
        { label: '手机IDFA', value: '手机IDFA', key: '4' },
        { label: '手机IMEA', value: '手机IMEA', key: '5' },
        { label: '淘宝NICK', value: '淘宝NICK', key: '6' },
        { label: '京东PIN', value: '京东PIN', key: '7' }
      ],
      import_mode: [{
        "label": "手机上传",
        "value":'1'
      }, {
        "label": "从QuickAudience导入",
        "value": '2'
      }],
      fileList: [],
      loadFile: {
        name: '',
        size: ''
      },
      filename: '',
      uploadStatus: 'defult', // defult success failure
      successTip: {},
      failTip: {},
      vaildForm: true,
      group_data_table: '',
      uploadFileData: {
        id: this.$route.query.id,
        group_data_table: this.$route.query.group_data_table
      }
    }
  },
  computed: {
    ...mapState({
      sidebar: state => state.app.sidebar
    })
  },
  mounted() {
    this.init()
    this.getMemberNum(this.$route.query.group_data_table)
  },
  methods: {
    init() {
      getGroupDetails({ id: this.$route.query.id, group_type: this.$route.query.group_type }).then(res => {
        this.searchForm.id = res.data.id
        this.memberForm.id = res.data.id
        this.searchForm.group_data_table = res.data.group_data_table
        this.searchForm.status = res.data.status
        this.searchForm.group_name = res.data.group_name
        this.searchForm.group_purpose = res.data.group_purpose
        this.searchForm.group_desc = res.data.group_desc
      })
    },
    getMemberNum(group_data) {
      this.group_data_table = group_data
      getMemberInfo({ id: this.$route.query.id, group_data_table: group_data }).then(res => {
        this.memberInfo = res.data.total
        this.failTip.success_total = res.data.total
      })
    },
    beforeUpload(file) {
      this.upLoading = true
      this.uploadStatus = 'defult'
      this.loadFile.name = file.name
      this.loadFile.size = file.size
      const splitArr = file.name.split('.')
      const isXLSX = splitArr[splitArr.length - 1] === 'xlsx' || splitArr[splitArr.length - 1] === 'xls'
      const isLt100M = file.size / 1024 / 1024 < 5
      if (!isXLSX) {
        this.$message.error('上传文件只能是Excel格式!')
        this.upLoading = false
        this.loadFile.name = ''
      }
      if (!isLt100M) {
        this.$message.error('上传文件大小不能超过 5MB!')
        this.upLoading = false
        this.loadFile.name = ''
      }
      return isXLSX && isLt100M
    },
    handleSuccess(response, file, fileList) {
      this.updata(response.data)
    },
    updata(file) {
      const params = {
        create_region: '华东',
        brand_code: 'belle',
        group_rule: 'aaa',
        filePath: file,
        ...this.searchForm
      }
      importGroup(params).then(res => {
        // this.getMemberNum(this.$route.query.group_data_table)
        if(res.code==='1'){
          this.upLoading = false
          this.saveId = res.data.id
          this.uploadFileData.group_data_table = res.data.group_data_table
          this.searchForm.group_data_table = res.data.group_data_table
          res.data.fail_total ? this.uploadStatus = 'failure' : this.uploadStatus = 'success'
          this.failTip = res.data
          this.memberInfo = res.data.success_total
        }
     
      // eslint-diselable-next-line handle-callback-err
      }).catch(err => {
        this.upLoading = false
        this.loadFile = {
          name: '',
          size: ''
        }
      })
    },
    handleError(err, file, fileList) {
      this.upLoading = false
      this.$message.error(err.bizMsg)
    },
    exportExcel() {
      // 导出文件
      var option = {
        datas: [ // 可多张sheet
          {
            sheetData: [], // 数据
            // sheetName: 'sheet', //左下角tab页的sheet名
            sheetFilter: ['member_id', 'error_reason'], // json的key，需要和header的每一项顺序对应
            sheetHeader: ['id', 'error_reason'], // .xlsx的表头
            columnWidths: [5, 20] // 表格宽度
          }
        ],
        fileName: '导入信息失败列表'
      }
      option.datas[0].sheetData = this.failTip.fail_list
      const toExcel = new ExportJsonExcel(option)
      toExcel.saveExcel()
    },
    exportNullExcel() {
      var option = {
        datas: [ // 可多张sheet
          {
            sheetData: [{ id: '' }], // 数据
            // sheetName: 'sheet', //左下角tab页的sheet名
            sheetFilter: ['id'], // json的key，需要和header的每一项顺序对应
            sheetHeader: ['会员账号'], // .xlsx的表头
            columnWidths: [5] // 表格宽度
          }
        ],
        fileName: '导入受众模版'
      }
      const toExcel = new ExportJsonExcel(option)
      toExcel.saveExcel()
    },
    save(type) {
      if (this.upLoading) {
        this.$message({
          message: '文件正在上传中，上传成功之后请继续操作',
          type: 'warning'
        })
        return
      }
      // 上传文件
      // y ==> 当前受众状态 + file + updata data
      // n ==> 用户点击状态 +  ''  + updata data
      if (type === 'started' && (!this.memberInfo || !this.failTip.success_total)) {
        this.$message.error('请上传文件')
        return
      }
      this.isLoading = true
      this.searchForm.status = type
      const params = {
        create_region: '华东',
        brand_code: 'belle',
        group_rule: 'aaa',
        filePath: '',
        ...this.searchForm
      }
      editGroup(params).then(res => {
        this.$message({
          message: '保存成功!',
          type: 'success',
          duration: 1000
        })
        setTimeout(() => {
          this.isLoading = false
          this.$router.push({ name: 'groupList' })
        }, 500)
      }).catch(() => {
        this.isLoading = false
      })
    },
    drawerTo() {
      if (!this.memberInfo) {
        this.$message.error('请先上传文件')
      } else {
        this.drawer = true
      }
    },
    cancel() {
      if (this.upLoading) {
        this.$message({
          message: '文件正在上传中，上传成功之后请继续操作',
          type: 'warning'
        })
        return
      }
      this.$router.push({ name: 'groupList' })
    }
  }
}
</script>
<style lang="less" scoped>
  /deep/ .el-drawer__body{
    overflow: auto !important;
  }
  .el-drawer__body {
    overflow: auto !important;
  }
  /deep/ .el-drawer__header{
    margin-bottom: 0 !important;
  }
  .el-drawer__header{
    margin-bottom: 0 !important;
  }
  .vipinsight-taglist-page{
    height: 100%;
    width: 100%;
    background: #f3f3f3;
    & > section{
      position: relative;
      padding: 20px 20px 60px;
      height: 100%;
      background: white;
    }
    /deep/ .el-form-item__label {
      color: #606266;
      font-size: 14px;
      font-weight: normal;
    }
    /deep/ .el-textarea{
      width: 100%;
    }
    /deep/ .el-upload-dragger{
      width: 160px;
    }
}
    .upLoad-contain{
      margin-top: 20px;
      display: flex;
      .btns,.relativeBtn{
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 120px;
      }
      .relativeBtn {
        position: relative;
        top: -8px;
      }
      .information{
        flex: 1;
        min-height: 120px;
        margin-left: 10px;
        background: #F6F8FA;
        padding: 10px;

        .defult-info,.suc-info, .fail-info > div:nth-of-type(1){
          h4{
            font-size: 18px;
            font-weight:500;

            line-height:28px;
          }
          .defult-title{
            color:rgba(67,90,130,1);
          }
          .suc-title{
            color: #D45E58;
          }
          p{
            font-size: 14px;
            font-weight:500;
            color:rgba(158,157,157,1);
            line-height:28px;
          }
          .uploadFile{
            line-height:28px;
          }
        }
        .fail-info {
          display: flex;
            .fail-details {
              flex: 1;
              max-height: 130px;
              margin-left: 20px;
              background: white;
              padding: 10px;
              overflow: auto;
              p{
                display: inline-block;
                width: 50%;
                padding-left: 15px;
                font-size: 12px;
                line-height: 1.8;
                text-align: left;
                &:nth-of-type(odd){
                  position: relative;
                  &::before {
                    position: absolute;
                    content: "";
                    top: 0;
                    right: 0;
                    height: 100%;
                    width: 1px;
                    background: #DDE1E9;
                  }
                }
              }
            }
        }
      }
    }
  .search-more{
    border: 1px solid rgba(67,90,130,1);
    background: none;
    color: #435A82;
    &:hover{
      background: #435A82;
      color: white;
    }
    &:disabled{
      border-color: #E4E7ED;
      background: #E4E7ED;
      color: #C0C4CC;
    }
  }
  .disabledBtn{
    cursor: pointer;
    height: 32px;
    padding: 9px 15px;
    font-size: 12px;
    border: 1px solid rgba(67,90,130,1);
    border-color: #E4E7ED;
    background: #E4E7ED;
    color: #C0C4CC;
  }
  .label-title {
    height: 16px;
    position: relative;
    line-height: 16px;
    padding-left: 10px;
    margin-bottom: 20px;
    .info_tip{
      color: red;
      font-size: 12px;
      margin-left: 15px;
    }
  }
  .linev-tip {
    display: inline-block;
    width: 4px;
    height: 16px;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    position: absolute;
    background: #435a82;
  }
  footer{
    .el-button--primary, .el-button--default {
      display: inline-block;
      width: 100px;
    }
  }
</style>
