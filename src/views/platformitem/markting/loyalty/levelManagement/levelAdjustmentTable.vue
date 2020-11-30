<template>
  <div v-loading="pageLoading" class="level-adjustment-table-container">
    <header style="padding: 20px 0">
      <el-form ref="searchForm" :model="searchForm" :rules="rules" label-position="right" label-width="90px">
        <el-col :span="5">
          <el-form-item label="会员卡号:" label-width="80px" prop="member_id">
            <el-input
              v-model="searchForm.member_id"
              clearable
              placeholder="请输入会员卡号"
              @keyup.enter.native="filterData"
            />
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="手机号:" label-width="80px" prop="mobile_bind">
            <el-input
              v-model="searchForm.mobile_bind"
              clearable
              placeholder="请输入手机号"
              @keyup.enter.native="filterData"
            />
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="会员昵称:" prop="nick">
            <el-input
              v-model="searchForm.nick"
              clearable
              placeholder="请输入会员昵称"
              @keyup.enter.native="filterData"
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="消费金额:" class="monetary-form-container">
            <span class="monetary-container">
              <el-form-item label-width="0" prop="start">
                <el-input
                  v-model="searchForm.start"
                  placeholder="起始金额"/>
              </el-form-item>
            </span>
            到
            <span class="monetary-container">
              <el-form-item label-width="0" prop="end">
                <el-input
                  v-model="searchForm.end"
                  placeholder="结束金额"/>
              </el-form-item>
            </span>
            元
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="会员等级:" label-width="80px" prop="level_code">
            <el-select v-model="searchForm.level_code" placeholder="请选择会员等级">
              <el-option
                v-for="item in levelList"
                :label="item.level_name"
                :value="item.level_code"
                :key="item.id"/>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="来源渠道:" prop="platform_code">
            <el-select v-model="searchForm.platform_code" placeholder="请选择来源渠道">
              <el-option v-for="item in sourceList" :label="item.label" :value="item.value" :key="item.id"/>
            </el-select>
          </el-form-item>
        </el-col>
        <!--        <el-col :span="5">-->
        <!--          <el-form-item label="标签名称:" prop="tag">-->
        <!--            <el-select v-model="searchForm.tag" placeholder="请选择标签名称">-->
        <!--              <el-option v-for="item in tagList" :label="item.label" :value="item.value" :key="item.id"></el-option>-->
        <!--            </el-select>-->
        <!--          </el-form-item>-->
        <!--        </el-col>-->
        <el-col :span="10" class="ml20">
          <el-button type="primary" @click="filterData">查询</el-button>
          <el-button type="primary" @click="handleReset">重置</el-button>
        </el-col>
      </el-form>
    </header>
    <main class="tableMainContent">
      <div class="table-header-checkbox-container">
      <!--        <span><el-checkbox :indeterminate="isIndeterminate" v-model="isCheckAll"-->
      <!--                           @change="handleCheckAllChange"></el-checkbox></span>-->
      <span @click="handleBatchEdit">批量修改</span> <span @click="handleBatchEditResult">批量修改结果集</span></div>
      <el-table
        v-loading="loading"
        stripe
        ref="table"
        :data="tableData"
        :header-cell-style="{ background: '#F5F7FA', color: '#333333' }"
        :row-key="getRowKeys"
        border
        @selection-change="handleSelectionChange"
      >
        <el-table-column :reserve-selection="true" align="center" type="selection" width="55"/>
        <el-table-column prop="mobile_bind" label="手机号"/>
        <el-table-column prop="member_id" label="会员卡号"/>
        <el-table-column prop="level_name" label="会员等级"/>
        <el-table-column prop="last_order_platform_name" label="最近购买渠道"/>
        <el-table-column prop="last_order_time" label="最近下单时间" width="160"/>
        <el-table-column label="操作" fixed="right" border width="100">
          <template slot-scope="scope">
            <el-button
              type="text"
              size="small"
              class="scopeStyle"
              @click="handleEdit(scope.row)">修改等级
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <base-pagination
        v-model="params.page"
        :current-page.sync="params.page"
        :page-size.sync="params.size"
        :page-sizes="pageSizes"
        :total="total"
        @loadData="getAdjustmentListFun"
      />
    </main>
    <el-dialog
      v-loading="dialogLoading"
      :visible.sync="dialogVisible"
      :title="dialogTitle"
      width="600px">
      <el-form ref="form" :model="form" :rules="dialogFormRules" label-width="100px">
        <el-form-item v-if="!(dialogMode === 'batchEditResult')" label="会员手机号:" prop="mobile_bind">
          <div class="phone-number">
            {{ selectedRows && selectedRows.length && selectedRows.map(row => row.mobile_bind).join(',') }}
          </div>
        </el-form-item>
        <el-form-item label="会员等级:" prop="level_code">
          <el-select v-model="form.level_code" placeholder="请选择会员等级">
            <el-option
              v-for="item in formLevelList"
              :label="item.level_name"
              :value="item.level_code"
              :key="item.id"/>
          </el-select>
        </el-form-item>
        <el-form-item label="有效期:" class="validity-form-item">
          <el-radio-group v-model="form.validity_calc_type">
            <el-row type="flex">
              <el-radio :label="1">从变更开始至 <span>
                <el-form-item label-width="0" prop="validity_end_date">
                  <el-date-picker
                    v-model="form.validity_end_date"
                    :picker-options="pickerOptions"
                    :disabled="!(form.validity_calc_type === 1)"
                    class="date-picker-width"
                    placeholder="请选择日期"
                    type="datetime"
                    style="width: 100%;"
                    format="yyyy-MM-dd HH:mm:ss"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    default-time="23:59:59"/>
                </el-form-item>
              </span>
                过期
              </el-radio>
            </el-row>
            <el-row>
              <el-radio :label="2">从变更开始 <span>
                <el-form-item label-width="0" prop="validity_lasting">
                  <el-input v-model="form.validity_lasting" :disabled="form.validity_calc_type === 1" type="number"><template
                    slot="append">天</template></el-input>
                </el-form-item>
              </span>
                后失效
              </el-radio>
            </el-row>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="备注" prop="level_alter_desc">
          <el-input
            :autosize="{ minRows: 2, maxRows: 7}"
            v-model="form.level_alter_desc"
            :maxlength="200"
            type="textarea"
            placeholder="请输入备注"
            clearable
            class="full-width"
            show-word-limit/>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleSubmit">确定</el-button>
        <el-button @click="dialogVisible = false">关闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getPageList, getLevelList, batchUpdateMember, batchUpdateMemberResult } from '@/api/markting/level'
import cacheCondition from '@/utils/cacheCondition'
import { mapGetters } from 'vuex'

export default {
  name: 'LevelAdjustmentTable',
  mixins: [cacheCondition],
  data() {
    return {
      pickerOptions: {
        disabledDate: (time) => {
          let nowData = new Date()
          nowData = new Date(nowData.setDate(nowData.getDate() - 1))
          return time < nowData
        }
      },
      pageLoading: false,
      isCheckAll: false,
      isIndeterminate: false,
      dialogVisible: false,
      dialogLoading: false,
      dialogTitle: '修改等级',
      dialogMode: 'singleEdit',
      levelList: [],
      formLevelList: [],
      sourceList: [],
      tagList: [],
      searchForm: {
        member_id: null,
        mobile_bind: null,
        nick: null,
        platform_code: null,
        level_code: null,
        brand_code: null,
        start: null,
        end: null,
        tag: null
      },
      params: {
        page: 1,
        size: 10
      },
      total: 0,
      pageSizes: [10, 20, 30, 40],
      loading: false,
      tableData: [],
      selectedRows: [],
      row: {},
      form: {
        level_code: '',
        validity_end_date: '',
        validity_lasting: '',
        level_alter_desc: '',
        validity_calc_type: 1
      }
    }
  },
  computed: {
    ...mapGetters(['brandCode']),
    rules() {
      return {
        mobile_bind: [{ min: 11, max: 11, message: '手机号码长度不对', trigger: ['blur', 'change'] },
          { pattern: /^1[3456789]\d{9}$/, message: '目前只支持中国大陆的手机号码', trigger: 'blur' }],
        start: [{ pattern: /^[+]{0,1}(\d+)$/, message: '起始金额需为正整数' },
          { validator: this.validateInitialAmount, trigger: 'blur' }],
        end: [{ pattern: /^[+]{0,1}(\d+)$/, message: '结束金额需为正整数' },
          { validator: this.validateEndAmount, trigger: 'blur' }]
      }
    },
    dialogFormRules() {
      return {
        level_code: [{ required: true, message: '会员等级为必填' }],
        validity_end_date: [{
          required: this.form.validity_calc_type === 1,
          message: '结束日期为必填'
        }],
        validity_lasting: [{
          required: !(this.form.validity_calc_type === 1),
          message: '天数为必填'
        }, { pattern: !(this.form.validity_calc_type === 1) ? /^\+?[1-9]\d*$/ : '', message: '天数需为正整数' }],
        level_alter_desc: [{ required: true, message: '备注为必填' }]
      }
    }
  },
  mounted() {
    this.params.page = 1
    this.initData()
    this.getLevelList()
    this.getSourceList()
    this.getTagList()
    this.resetDialogFormData('mounted')
  },
  methods: {
    clearDeep(obj) {
      if (!obj || !typeof obj === 'object') return
      const keys = Object.keys(obj)
      for (var key of keys) {
        const val = obj[key]
        if (
          typeof val === 'undefined' ||
          ((typeof val === 'object' || typeof val === 'string') && !val)
        ) {
          // 如属性值为null或undefined或''，则将该属性删除
          delete obj[key]
        } else if (typeof val === 'object') {
          // 属性值为对象，递归调用
          this.clearDeep(obj[key])

          if (Object.keys(obj[key]).length === 0) {
            // 如某属性的值为不包含任何属性的独享，则将该属性删除
            delete obj[key]
          }
        }
      }
    },

    getRowKeys(row) {
      return row.member_id
    },
    initData() {
      this.getAdjustmentListFun()
    },
    filterData() {
      this.params.page = 1
      this.initData()
    },
    // 重置
    handleReset() {
      this.$refs.searchForm.resetFields()
      this.searchForm = {
        member_id: null,
        mobile_bind: null,
        nick: null,
        platform_code: null,
        level_code: null,
        brand_code: null,
        start: null,
        end: null,
        tag: null
      }
      this.filterData()
    },
    // 会员等级列表
    getLevelList() {
      getLevelList({ brand_code: this.brandCode }).then(res => {
        if (res && res.data && res.data.list) {
          this.formLevelList = res.data.list
          const _levelList = JSON.parse(JSON.stringify(res.data.list))
          _levelList.unshift({ id: 1, level_name: '不限', level_code: null })
          this.levelList = _levelList
        }
      })
    },
    // 来源渠道列表
    getSourceList() {
      this.sourceList = [
        { id: 1, label: '不限', value: null },
        { id: 2, label: '京东', value: 'jd' },
        { id: 3, label: '淘宝', value: 'taobao' }
      ]
    },
    // 标签名称列表
    getTagList() {
      this.tagList = [
        { id: 1, label: '不限', value: null },
        { id: 2, label: '京东', value: 'jd' },
        { id: 3, label: '淘宝', value: 'taobao' }
      ]
    },
    getAdjustmentListFun() {
      this.loading = true
      const postData = {
        like: {
          member_id: this.searchForm.member_id,
          mobile_bind: this.searchForm.mobile_bind,
          nick: this.searchForm.nick
        },
        equals: {
          platform_code: this.searchForm.platform_code,
          level_code: this.searchForm.level_code,
          brand_code: this.brandCode
        },
        between: {
          amt_payment: {
            start: this.searchForm.start,
            end: this.searchForm.end
          }
        },
        page: this.params.page,
        size: this.params.size
      }
      this.clearDeep(postData)
      getPageList(postData).then((res) => {
        if (res && res.data.list) {
          this.tableData = res.data.list || []
          this.params.page = this.params.page ? this.params.page : 1
          this.params.size = this.params.size ? this.params.size : 10
          this.total = res.data.total
        }
      }).finally(() => {
        this.loading = false
      })
    },
    showPublishDialog(row) {
      this.form = JSON.parse(JSON.stringify(row))
      this.dialogVisible = true
    },
    handleSubmit() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.dialogLoading = true
          if (this.dialogMode === 'batchEditResult') {
            const postData = {
              like: {
                member_id: this.searchForm.member_id,
                mobile_bind: this.searchForm.mobile_bind,
                nick: this.searchForm.nick
              },
              equals: {
                platform_code: this.searchForm.platform_code,
                level_code: this.searchForm.level_code,
                brand_code: this.brandCode
              },
              between: {
                amt_payment: {
                  start: this.searchForm.start,
                  end: this.searchForm.end
                }
              },
              memberLevel: {
                level_alter_desc: this.form.level_alter_desc,
                validity_end_date: this.form.validity_end_date,
                level_code: this.form.level_code,
                validity_lasting: this.form.validity_lasting,
                validity_calc_type: this.form.validity_calc_type,
                level_alter_method: '手动更改',
                brand_code: this.brandCode
              }
            }
            this.clearDeep(postData)
            batchUpdateMemberResult(postData).then(res => {
              if (res && res.data) {
                this.dialogVisible = false
                this.$refs.table.clearSelection()
                this.getAdjustmentListFun()
              }
            }).finally(() => {
              this.dialogLoading = false
            })
          } else {
            const _postData = {
              member_ids: this.selectedRows.map(x => x.member_id).join(),
              memberLevel: {
                level_alter_desc: this.form.level_alter_desc,
                validity_end_date: this.form.validity_end_date,
                level_code: this.form.level_code,
                validity_lasting: this.form.validity_lasting,
                validity_calc_type: this.form.validity_calc_type,
                level_alter_method: '手动更改',
                brand_code: this.brandCode
              }
            }
            this.clearDeep(_postData)
            batchUpdateMember(_postData).then(res => {
              if (res && res.data) {
                this.dialogVisible = false
                this.$refs.table.clearSelection()
                this.getAdjustmentListFun()
              }
            }).finally(() => {
              this.dialogLoading = false
            })
          }
        }
      })
    },

    handleSelectionChange(val) {
      if (val && val.length && val.length === this.tableData.length) {
        this.isIndeterminate = false
        this.isCheckAll = true
      } else if (val && val.length && val.length < this.tableData.length) {
        this.isIndeterminate = true
        this.isCheckAll = false
      } else {
        this.isIndeterminate = false
        this.isCheckAll = false
      }
    },

    handleCheckAllChange(val) {
      if (val) {
        this.$refs.table.toggleAllSelection()
      } else {
        this.$refs.table.clearSelection()
      }
    },
    changeDialogMode(mode) {
      this.dialogMode = mode
      this.collectDialogFormData()
    },
    collectDialogFormData() {
      if (this.dialogMode === 'edit') {
        const row = this.selectedRows[0]
        const _form = {
          level_code: row.level_code,
          level_alter_desc: row.level_alter_desc,
          validity: row.validity,
          validity_lasting: row.validity_lasting
        }
        this.form = { ...this.form, ..._form }
        this.showDialog()
      } else {
        this.resetDialogFormData()
      }
    },
    resetDialogFormData(action) {
      this.form = {
        level_code: '',
        validity_end_date: '',
        validity_lasting: '',
        level_alter_desc: '',
        validity_calc_type: 1
      }
      if (action === 'mounted') return
      this.showDialog()
    },
    showDialog() {
      this.dialogVisible = true
      this.$nextTick(() => {
        this.$refs.form.clearValidate()
      })
    },
    // 修改等级
    handleEdit(row) {
      this.selectedRows = [row]
      this.dialogTitle = '修改等级'
      this.changeDialogMode('edit')
    },
    handleBatchEdit() {
      const selection = this.$refs.table.selection
      if (!selection.length) {
        this.$message.error('请勾选至少一行数据')
        return
      }
      this.selectedRows = selection

      this.dialogTitle = '批量修改等级'
      this.changeDialogMode('batchEdit')
    },
    handleBatchEditResult() {
      this.selectedRows = []
      this.dialogTitle = '批量修改结果集'
      this.changeDialogMode('batchEditResult')
    },
    validateInitialAmount(rule, value, callback) {
      if (Number(this.searchForm.end) >= Number(value)) {
        this.$refs.searchForm.clearValidate(['end'])
        callback()
      } else {
        callback(new Error('起始金额不能大于结束金额'))
      }
    },
    validateEndAmount(rule, value, callback) {
      if (Number(value) >= Number(this.searchForm.start)) {
        this.$refs.searchForm.clearValidate(['start'])
        callback()
      } else {
        callback(new Error('结束金额不能小于起始金额'))
      }
    }
  }
}
</script>

<style lang="less" scoped>
.level-adjustment-table-container {
  header,
  main {
    width: 100%;
    height: auto;
    box-sizing: border-box;
    display: block;
    background: #ffffff;
    padding: 10px 0;

    .scopeStyle {
      cursor: pointer;
    }
  }

  header {
    overflow: hidden;

    /deep/ .monetary-form-container.el-form-item {
      margin-bottom: 0;
    }

    .monetary-container {
      /deep/ .el-form-item {
        width: 100px;
        display: inline-block;
      }
    }
  }

  /deep/ .el-form-item__label {
    color: #666666;
    font-size: 14px;
    font-weight: normal;
    white-space: nowrap;
  }

  /deep/ .el-form-item .el-input {
    width: 100%;
  }

  /deep/ .el-table, /deep/ .el-table__header-wrapper {
    overflow: visible !important;
  }

  /deep/ .el-table__fixed-right::before {
    background: transparent !important;
  }

  /deep/ .el-table th.el-table-column--selection {
    overflow: visible !important;
  }

  /deep/ .el-table th.el-table-column--selection .cell {
    position: relative;
    top: -38px;
  }
  /deep/ .el-textarea .el-input__count {
    background: transparent;
  }

  .el-table__row,
  .has-gutter {
    td {
      &:not(:nth-of-type(2)):not(:nth-of-type(3)):not(:nth-last-of-type(1)) {
        > div {
          text-align: center;
        }
      }
    }

    th {
      &:not(:nth-last-of-type(2)) {
        > div {
          text-align: center;
        }
      }
    }
  }

  .table-header-checkbox-container {
    padding: 10px 20px;

    span {
      margin-right: 20px;
      color: #005dd2;
      cursor: pointer;

      &:first-of-type {
        margin-left: 40px;
      }

      //&:not(:first-child) {
      //  color: #005dd2;
      //  cursor: pointer;
      //}
    }
  }

  /deep/ .validity-form-item .el-form-item {
    display: inline-block;
    width: 200px;
  }

  /deep/ .validity-form-item.el-form-item {
    margin-bottom: 0;
  }

  /deep/ .validity-form-item .el-input-group--append .el-input__inner {
    padding-right: 0 !important;
  }

  .phone-number {
    border: 1px solid rgb(220, 223, 230);
    padding: 0 30px 0 15px;
    font-size: 14px !important;
    border-radius: 2px;
    min-height: 32px;
    line-height: 28px;
    opacity: 0.8;
    box-sizing: border-box
  }
  .ml20 {
    margin-left: 20px;
  }
}
</style>
