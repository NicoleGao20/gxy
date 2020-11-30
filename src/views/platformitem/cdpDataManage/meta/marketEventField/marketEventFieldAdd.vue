<template>
  <div class="page-container">
    <div >
      <el-form ref="form" :model="searchForm" :rules="rules" label-position="right" label-width="100px">
        <div v-if="!$route.query.id" style="width: 600px;margin:20px 0;">
          <el-form-item label="事件名称" prop="table_name_show">
            <el-select v-model="searchForm.table_name_show" style="width: 100%;" clearable >
              <el-option v-for="(market, index) in marketList" :key="index" :label="market.label" :value="market.value"/>
            </el-select>
          </el-form-item>
        </div>
        <el-form-item label="事件条件字段" class="rules">
          <el-button :disabled="$route.query.view === 'view'" type="primary" @click="addList">选择字段</el-button>
        </el-form-item>
        <el-form-item label="" prop="remark">
          <div>
            <!-- <el-button type="primary" class="listAddBtnStyle">新增</el-button> -->
            <el-table
              :data="tableList"
              style="width: 100%"
              max-height="450">
              <el-table-column
                fixed
                prop="column_name_show"
                label="字段名称"/>
              <el-table-column
                prop="column_name_desc"
                label="字段描述"/>
              <el-table-column
                prop="column_type"
                label="字段类型"/>
              <el-table-column
                prop="default_value"
                label="字段默认值"/>
              <el-table-column v-if="$route.query.view !== 'view'" label="操作" width="300">
                <template slot-scope="scope">
                  <el-button type="text" @click="del(scope.$index)">删除</el-button>
                  <el-button :disabled="scope.$index === 0" style="font-size:16px;" type="text" class="el-icon-arrow-up" @click="orderPosition(scope.$index, scope.$index - 1)"/>
                  <el-button :disabled="scope.$index === 0" style="font-size:16px;transform:rotate(90deg);" type="text" class="el-icon-d-arrow-left" @click="treme(scope.$index, 1)"/>
                  <el-button :disabled="scope.$index === tableList.length - 1" style="font-size:16px;" type="text" class="el-icon-arrow-down" @click="orderPosition(scope.$index, scope.$index + 1)"/>
                  <el-button :disabled="scope.$index === tableList.length - 1" style="font-size:16px;transform:rotate(90deg);" type="text" class="el-icon-d-arrow-right" @click="treme(scope.$index, 0)"/>
                </template>
              </el-table-column>
            </el-table>
            <!-- <base-pagination
              v-model="params.current"
              :page-size.sync="params.page_size"
              :total="total"
              @loadData="loadData"
            /> -->
          </div>
        </el-form-item>
      </el-form>
    </div>
    <div class="action-wrap">
      <el-button size="small" @click="$router.back()">返回列表</el-button>
      <el-button :disabled="$route.query.view === 'view'" :loading="actionLoading" size="small" type="primary" @click="confirmHandler">确 认</el-button>
    </div>
    <el-dialog
      :visible.sync="dialogVisible"
      title="选择事件条件字段"
      width="630px">
      <div v-if="dialogVisible" class="">
        <el-form label-position="right" label-width="130px">
          <el-row :gutter="20">
            <el-col :span="19">
              <el-form-item label="选择事件条件字段">
                <el-input v-model="dialogForm.table_name_show" clearable @keyup.enter.native="getDialogList"/>
              </el-form-item>
            </el-col>
            <el-col :span="3">
              <el-button type="primary" @click="getDialogList">查询</el-button>
            </el-col>
          </el-row>
          <el-table
            ref="multipleTable"
            :data="dialogForm.list"
            style="width: 100%"
            max-height="250"
            row-key="id"
            @selection-change="handleSelectionChange">
            <el-table-column
              :reserve-selection="true"
              type="selection"/>
            <el-table-column
              prop="column_name_show"
              label="字段名称"/>
            <el-table-column
              prop="column_name_desc"
              label="字段描述"/>
            <el-table-column
              prop="column_type"
              label="字段类型"/>
            <el-table-column
              label="字段默认值"
              prop="default_value"/>
          </el-table>
          <base-pagination
            v-model="dialogForm.current"
            :page-size.sync="dialogForm.page_size"
            :total="dialogForm.total"
            style="margin-top:10px;"
            @loadData="getDialogList"
          />
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveDialog">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
// queryAllEventParamList
import { queryAllEventList, updateEventParamList, queryAllEventParamList, queryEventParamList } from '@/api/marketEvent'
export default {
  name: 'MarketEventAdd',
  data() {
    return {
      searchForm: {
        table_name_show: ''
      },
      dialogForm: {
        table_name_show: '',
        list: [],
        total: 0,
        current: 1,
        page_size: 10
      },
      marketList: [],
      tableList: [],
      selectArr: [],
      params: {
        current: 1,
        page_size: 10
      },
      total: 0,
      actionLoading: false,
      dialogVisible: false,
      rules: {
        table_name_show: [
          { required: true, message: '请选择标签类型', trigger: 'change' }
        ]
      }
    }
  },
  watch: {
    tableList(val) {
      this.tableList.forEach((ele, index) => {
        ele.seq_no = index
      })
    }
  },
  mounted() {
    // review || edit
    if (this.$route.query.id) {
      this.searchForm.table_name_show = this.$route.query.id
      this.getTableList()
    } else {
      this.getList()
    }
  },
  methods: {
    orderPosition(val1, val2) {
      let obj1 = Object.assign({}, this.tableList[val1])
      let obj2 = Object.assign({}, this.tableList[val2])
      this.tableList[val1].seq_no = obj2.seq_no
      this.tableList[val2].seq_no = obj1.seq_no
      obj1 = null
      obj2 = null
      this.tableList[val1] = this.tableList.splice(val2, 1, this.tableList[val1])[0]
    },
    treme(val, type) {
      var short
      short = this.tableList.splice(val, 1)[0]
      if (type) { // 置顶
        this.tableList.unshift(short)
        this.tableList.forEach((ele, index) => {
          ele.seq_no = index
        })
      } else {
        short.seq_no = this.tableList[this.tableList.length - 1].seq_no + 1
        this.tableList.push(short)
      }
    },
    getTableList() {
      queryEventParamList({ id: this.$route.query.id }).then(res => {
        if (res.data.list[0].seq_no) {
          this.tableList = res.data.list.sort(this.compare('seq_no'))
        } else {
          res.data.list.forEach((element, index) => {
            element.seq_no = index
          })
          this.tableList = res.data.list
        }
      })
    },
    getList() {
      queryAllEventList().then(res => {
        this.marketList = res.data || []
        if (this.marketList.length) {
          this.marketList.forEach(ele => {
            this.$set(ele, 'label', ele.table_name_show)
            this.$set(ele, 'value', ele.id)
          })
        }
      })
    },
    compare(property) {
      return function(a, b) {
        var value1 = a[property]
        var value2 = b[property]
        return value1 - value2
      }
    },
    addList() {
      this.$refs['form'].validate((valid) => {
        if (!valid) return
        this.dialogVisible = true
        this.getDialogList()
      })
    },
    getDialogList() {
      const params = {
        current: this.dialogForm.current,
        page_size: this.dialogForm.page_size,
        meta_table_id: this.searchForm.table_name_show
      }
      if (this.dialogForm.table_name_show) params.column_name_show = this.dialogForm.table_name_show
      queryAllEventParamList(params).then(res => {
        this.dialogForm.list = res.data.list || []
        this.dialogForm.current = res.data.pagination.current
        this.dialogForm.page_size = res.data.pagination.page_size
        this.dialogForm.total = res.data.pagination.total
        // 回显选中
        this.$refs.multipleTable.clearSelection()
        if (this.tableList.length) {
          this.tableList.forEach(row => {
            this.$refs.multipleTable.toggleRowSelection(row)
          })
        }
      })
    },
    handleSelectionChange(val) {
      this.selectArr = val
    },
    saveDialog() {
      this.tableList = this.selectArr
      const hash = {}
      this.tableList = this.tableList.reduce((item, next) => {
        hash[next.id] ? '' : hash[next.id] = true && item.push(next)
        return item
      }, [])
      this.dialogVisible = false
    },
    confirmHandler() {
      this.$refs['form'].validate((valid) => {
        if (!valid) return
        // if (!this.tableList.length) return
        this.actionLoading = true
        const eventParamRecords = []
        this.tableList.forEach(row => {
          eventParamRecords.push({ id: row.id, seq_no: row.seq_no })
        })
        const params = {
          meta_table_id: this.searchForm.table_name_show,
          eventParamRecords: eventParamRecords
        }
        updateEventParamList(params).then(res => {
          this.actionLoading = false
          this.$message.success('保存成功！')
          this.$router.back()
        }).catch(fail => {
          this.actionLoading = false
        })
      })
    },
    del(index) {
      this.$alert(`<p style="margin-top:10px;">是否确认删除此指标？</p><small style="margin-top:10px;">取消后，不再作为指标限制</small>`, '提示', {
        dangerouslyUseHTMLString: true,
        type: 'warning',
        showCancelButton: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(res => {
        this.$message.success('删除成功')
        this.tableList.splice(index, 1)
        this.selectArr = this.tableList
      })
    },
    loadData() {}
  }
}
</script>
<style lang="less">
  .page-container{
    height: 100%;
    // padding: 15px;
    background: white;
  }
  /deep/ .el-message-box__status{
    position: relative;
    top: 5px;
  }
  .rules{
    position: relative;
    &::after{
      position: absolute;
      content: "*";
      top:28%;
      left: -5px;
      color: #F56C6C;
    }
  }
</style>
