<template>
  <div class="wechat-group-message-container">
    <header class="searchWrap">
      <el-form ref="searchForm" :model="searchForm" label-position="right" label-width="100px">
        <el-col :span="7">
          <el-form-item label="任务名称">
            <el-input
              v-model="searchForm.msg_name"
              clearable
              placeholder="请输入"
              @keyup.enter.native="filterData"
            />
          </el-form-item>
        </el-col>
        <el-col :span="7">
          <el-form-item label="受众名称">
            <el-input
              v-model="searchForm.group_name"
              clearable
              placeholder="请输入"
              @keyup.enter.native="filterData"
            />
          </el-form-item>
        </el-col>
        <el-col :span="7">
          <el-form-item label="发送状态">
            <el-select v-model="searchForm.status">
              <el-option
                v-for="item in statusList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="3">
          <el-button type="primary" @click="filterData">查询</el-button>
        </el-col>
      </el-form>
    </header>
    <main class="tableMainContent">class="tableMainContent">
      <router-link :to="{name:'newWechatGroupMessage'}"><el-button type="primary" class="mb10">新增</el-button></router-link>
      <el-table
        v-loading="loading"
        stripe
        :data="tableData"
        :header-cell-style="{ background: '#F5F7FA', color: '#333333' }"
        border
      >
        <el-table-column prop="msg_name" label="消息名称" min-width="110" />
        <el-table-column prop="group_name" label="受众名称" width="200" />
        <el-table-column prop="cnt_audience" label="受众人群数" width="110" />
        <el-table-column prop="cnt_audience_valid" label="有效人群数" width="110" />
        <el-table-column prop="status" label="发送状态" width="130" />
        <el-table-column prop="create_time" label="创建时间" width="140" />
        <el-table-column prop="create_user" label="创建人" width="130" />
        <el-table-column prop="update_user" label="修改人" width="130" />
        <el-table-column prop="last_modify_time" label="修改时间" width="140" />
        <el-table-column label="操作" fixed="right" border width="200px">
          <template slot-scope="scope">
            <el-button
              type="text"
              size="small"
              class="scopeStyle"
              @click="handleView(scope.row)"
            >
              查看
            </el-button>
            <el-button
              type="text"
              size="small"
              class="scopeStyle"
              @click="handleEdit(scope.row)"
            >
              编辑
            </el-button>
            <el-button
              type="text"
              size="small"
              class="scopeStyle"
              @click="showStopDialog(scope.row)"
            >
              停止
            </el-button>
            <el-button
              type="text"
              size="small"
              class="scopeStyle"
              @click="handleViewLog(scope.row)"
            >
              查看日志
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <base-pagination
        class="bottomPagination"
        v-model="params.page"
        :current-page.sync="params.page"
        :page-size.sync="params.pageSize"
        :page-sizes="pageSizes"
        :total="total"
        @loadData="getMemberListFun"
      />
      <el-dialog
        v-loading="stopDialogLoading"
        :visible.sync="stopDialogVisible"
        title="停止发送"
        width="560px">
        <p class="dialog-text">确定停止发送吗? </p>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="handleStop">确定</el-button>
          <el-button @click="stopDialogVisible = false">取消</el-button>
        </span>
      </el-dialog>
    </main>
  </div>
</template>
<script>
import { queryWeChatTplMsg } from '@/api/markting/wechat'
import cacheCondition from '@/utils/cacheCondition'
export default {
  name: 'WechatTempMessage',
  mixins: [cacheCondition],
  data() {
    return {
      stopDialogLoading: false,
      stopDialogVisible: false,
      row: {},
      searchForm: {
        msg_name: '',
        group_name: '',
        status: ''
      },
      params: {
        page: 1,
        pageSize: 10
      },
      total: 0,
      pageSizes: [10, 20, 30, 40],
      loading: false,
      statusList: [
        { label: '待发送', value: '待发送' },
        { label: '已发送', value: '已发送' },
        { label: '发送中', value: '发送中' }
      ],
      isMoreinquiries: false,
      tableData: [{
        'cnt_audience': 27927,
        'update_user': 'sys',
        'create_time': '2020-10-12 10:57:02',
        'group_name': '五年',
        'last_modify_time': '2020-10-12 10:57:02',
        'msg_name': 'wyuw',
        'cnt_audience_valid': 12221,
        'id': 1,
        'create_user': 'sys',
        'group_no': '1'
      }]
    }
  },
  watch: {
    create_time(val) {
      if (val) {
        this.searchForm.start_time = val[0]
        this.searchForm.end_time = val[1]
      } else {
        this.searchForm.start_time = ''
        this.searchForm.end_time = ''
      }
    }
  },
  mounted() {
    this.initData()
  },
  methods: {
    initData() {
      this.row = {}
      this.getMemberListFun()
    },
    fun() {
      this.$router.push({ name: 'crmArchivesPortrait' })
    },
    filterData() {
      this.params.page = 1
      this.initData()
    },
    getMemberListFun() {
      this.loading = true
      queryWeChatTplMsg({
        msg_name: this.searchForm.msg_name,
        group_name: this.searchForm.group_name,
        status: this.searchForm.status,
        pageNum: this.params.page,
        pageSize: this.params.pageSize
      }).then((res) => {
        this.tableData = res.data.list || []
        this.params.page = (res.data && res.data.pagination.current) || 1
        this.params.pageSize = res.data && res.data.pagination.page_size
        this.total = res.data && res.data.pagination.total
      }).finally(() => {
        this.loading = false
      })
    },
    handleView(row) {
      console.log('view', row)
    },
    handleEdit(row) {
      console.log('edit', row)
    },
    handleViewLog(row) {
      console.log('view log', row)
    },
    showStopDialog(row) {
      this.row = row
      this.stopDialogVisible = true
    },
    handleStop() {
      this.stopDialogLoading = true
      // deleteMemberLevel({ id: this.row.id }).then(res => {
      //   if (res && res.data) {
      //     this.deleteDialogVisible = false
      //     this.initData()
      //   }
      // }).finally(() => {
      //   this.deleteDialogLoading = false
      // })
    }
  }
}
</script>
<style lang="less" scoped>
.wechat-group-message-container {
  padding: 0 15px;
  header,
  main {
    width: 100%;
    height: auto;
    box-sizing: border-box;
    display: block;
    background: #ffffff;
    .scopeStyle {
      cursor: pointer;
    }
  }
  header {
    margin: 15px 0;
    overflow: hidden;
    /deep/ .el-input {
      width: 80%;
    }
  }
  main {
    padding: 10px 25px;
  }

  /deep/ .el-form-item__label {
    color: #666666;
    font-size: 14px;
    font-weight: normal;
    white-space: nowrap;
  }

  /deep/ .el-date-editor--daterange {
    width: 80%;
  }
  /deep/ .el-textarea {
    width: 91.5%;
  }
  .search-more {
    border: 1px solid rgba(67, 90, 130, 1);
    background: none;
    color: #435a82;
    &:hover {
      color: #ffffff;
      background-color: #435a82;
      border-color: #435a82;
    }
  }
}
</style>
<style lang="less">
.wechat-group-message-container{
  .el-table__row,
  .has-gutter {
    td {
      &:not(:nth-last-of-type(1)) {
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
  .mb10 {
    margin-bottom: 10px;
  }
}
</style>
