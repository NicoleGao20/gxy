<template>
  <div class="page-container-gap">
    <header class="searchWrap">
      <el-form :model="searchForm" class="searchForm" label-position="right" label-width="100px">
        <el-col :span="7">
          <el-form-item label="粉丝昵称" prop="nickname">
            <el-input
              v-model="searchForm.nickname"
              :maxlength="13"
              clearable
              placeholder="请输入"
              @keyup.enter.native="filterData"
            />
          </el-form-item>
        </el-col>
        <el-col :span="7">
          <el-form-item label="UnionID">
            <el-input
              v-model="searchForm.unionid"
              clearable
              placeholder="请输入"
              @keyup.enter.native="filterData"
            />
          </el-form-item>
        </el-col>
        <el-col :span="7">
          <el-form-item label="OpenID">
            <el-input
              v-model="searchForm.openid"
              clearable
              placeholder="请输入"
              @keyup.enter.native="filterData"
            />
          </el-form-item>
        </el-col>
        <el-col :span="3">
          <el-button type="primary" @click="filterData">查询</el-button>
        </el-col>
      </el-form>
    </header>
    <main class="tableMainContent">
      <el-table
        v-loading="loading"
        :data="tableData"
        :header-cell-style="{ background: '#F5F7FA', color: '#333333' }"
        stripe
        border
      >
        <el-table-column fixed="left" prop="headimgUrl" label="头像" width="110">
          <template slot-scope="scope">
            <el-avatar :size="50" :src="scope.row.headimgurl" shape="square" alt=""/>
          </template>
        </el-table-column>
        <el-table-column prop="nickname" label="粉丝昵称" width="150"/>
        <el-table-column prop="remark" label="备注" width="200"/>
        <el-table-column prop="sex" label="性别" width="110">
          <template slot-scope="scope">
            {{ scope.row.sex | genderFilter }}
          </template>
        </el-table-column>
        <el-table-column prop="language" label="语言" width="110">
          <template slot-scope="scope">
            {{ scope.row.language | languageFilter }}
          </template>
        </el-table-column>
        <el-table-column prop="province" label="省份" width="110"/>
        <el-table-column prop="city" label="城市" width="110"/>
        <el-table-column prop="country" label="国家" width="110"/>
        <el-table-column prop="unionid" label="UnionID" width="300"/>
        <el-table-column prop="openid" label="OpenID" width="300"/>
        <el-table-column prop="mobile" label="手机号" width="110"/>
        <el-table-column prop="subscribe" label="关注状态" width="100">
          <template slot-scope="scope">
            {{ scope.row.subscribe | subscribeFilter }}
          </template>
        </el-table-column>
        <el-table-column prop="first_follow_time" label="首次关注时间" width="140"/>
        <el-table-column prop="subscribe_time" label="关注时间" width="140"/>
        <el-table-column prop="cancel_follow_time" label="取关时间" width="140"/>
        <el-table-column prop="update_time" label="更新时间" width="140"/>
        <el-table-column label="操作" fixed="right" border width="200px">
          <template slot-scope="scope">
            <el-button
              type="text"
              size="small"
              class="scope-style"
              @click="showEditDialog(scope.row)"
            >
              修改备注
            </el-button>
            <el-button
              type="text"
              size="small"
              class="scope-style"
              @click="showBlackOrderDialog(scope.row)"
            >
              加入黑名单
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <base-pagination
        v-model="params.page"
        :current-page.sync="params.page"
        :page-size.sync="params.pageSize"
        :page-sizes="pageSizes"
        :total="total"
        @loadData="getFanListFun"
      />
    </main>
    <el-dialog
      v-loading="editDialogLoading"
      :visible.sync="editDialogVisible"
      title="修改备注"
      width="400px">
      <el-form ref="form" :model="form" :rules="rules" label-width="0">
        <el-form-item prop="remark">
          <el-input v-model="form.remark" :rows="3" :maxlength="200" type="textarea"/>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleEditRemark">确定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      v-loading="bOrderDialogLoading"
      :visible.sync="bOrderDialogVisible"
      title="加入黑名单"
      width="400px">
      <p>是否确定将该用户加入黑名单？</p>
      <p>如需从黑名单中移除，请前往黑名单中操作</p>
      <span slot="footer" class="dialog-footer">
        <el-button @click="bOrderDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleAddBOrder">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { queryAllDataBaseWeChatFansPaging, editFansRemark, pullFansBlackList } from '@/api/markting/wechat'
import cacheCondition from '@/utils/cacheCondition'
const GENDER_MAP = { 0: '其他', 1: '男', 2: '女' }
const LANGUAGE_MAP = { 'zh_CN': '中文', 'en_US': '英文', 'zh_TW': '中文繁体' }
const SUBSCRIBE_MAP = { 1: '已关注', 0: '取消关注' }
export default {
  name: 'WechatFanList',
  filters: {
    formatDate: function(val) {
      if (!val) return
      const date = new Date(val)
      function timeAdd0(num) {
        let str = String(num)
        if (str.length <= 1) {
          str = '0' + str
        }
        return str
      }
      return date.getFullYear() + '-' + timeAdd0(date.getMonth() + 1) + '-' + timeAdd0(date.getDate()) +
        ' ' + timeAdd0(date.getHours()) + ':' + timeAdd0(date.getMinutes()) +
        ':' + timeAdd0(date.getSeconds())
    },
    genderFilter(gender) {
      return GENDER_MAP[gender]
    },
    languageFilter(language) {
      return LANGUAGE_MAP[language]
    },
    subscribeFilter(status) {
      return SUBSCRIBE_MAP[status]
    }
  },
  mixins: [cacheCondition],
  data() {
    return {
      searchForm: {
        nickname: '',
        unionid: '',
        openid: ''
      },
      params: {
        page: 1,
        pageSize: 10
      },
      total: 0,
      pageSizes: [10, 20, 30, 40],
      loading: false,
      form: {
        remark: ''
      },
      tableData: [],
      editDialogLoading: false,
      editDialogVisible: false,
      bOrderDialogLoading: false,
      bOrderDialogVisible: false
    }
  },
  computed: {
    rules() {
      return {
        remark: { required: true, message: '备注信息是必填的', trigger: ['blur', 'change'] }
      }
    }
  },
  mounted() {
    this.initData()
  },
  methods: {
    initData() {
      this.form = {}
      this.getFanListFun()
    },
    filterData() {
      this.params.page = 1
      this.initData()
    },
    getFanListFun() {
      this.loading = true
      queryAllDataBaseWeChatFansPaging({
        unionid: this.searchForm.unionid,
        openid: this.searchForm.openid,
        nickname: this.searchForm.nickname,
        pageNum: this.params.page,
        pageSize: this.params.pageSize
      }).then((res) => {
        if (res && res.data) {
          this.loading = false
          this.tableData = res.data.list || []
          this.params.page = (res.data && res.data.pageNum) || 1
          this.params.pageSize = res.data && res.data.pageSize
          this.total = res.data && res.data.total
        }
      })
    },

    showEditDialog(row) {
      this.form = { remark: '', ...row }
      this.editDialogVisible = true
    },

    showBlackOrderDialog(row) {
      this.form = { remark: '', ...row }
      this.bOrderDialogVisible = true
    },

    handleEditRemark() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.editDialogLoading = true
          editFansRemark({ openid: this.form.openid, remark: this.form.remark }).then(res => {
            if (res) {
              console.log('edit remark success', res)
              this.editDialogVisible = false
              this.initData()
            }
          }).finally(() => {
            this.editDialogLoading = false
          })
        }
      })
    },
    handleAddBOrder() {
      this.bOrderDialogLoading = true
      pullFansBlackList({ openid_list: [this.form.openid] }).then(res => {
        if (res) {
          this.bOrderDialogVisible = false
          this.initData()
        }
      }).finally(() => {
        this.bOrderDialogLoading = false
      })
    },

    timeAdd0(num) {

    }
  }
}
</script>
<style lang="less" scoped>
/deep/ .el-dialog__body {
  padding: 30px 20px !important;
  line-height: 2 !important;
}
</style>
<style lang="less">
.wechat-fan-list-container {
  header,
  main {
    width: 100%;
    height: auto;
    box-sizing: border-box;
    display: block;
    background: #ffffff;

    .scope-style {
      cursor: pointer;
    }
  }

  header {
    margin: 15px 0;
    overflow: hidden;
    background-color: #f2f2f2;
    padding: 20px 0 0;

    /deep/ .el-input {
      width: 80%;
    }
  }

  main {
    padding: 10px 0;
  }

  /deep/ .el-form-item__label {
    color: #666666;
    font-size: 14px;
    font-weight: normal;
    white-space: nowrap;
  }

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
}
</style>
