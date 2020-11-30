<template>
  <div class="page-container-gap">
    <header class="searchWrap">
      <el-form label-position="right" label-width="100px">
        <el-col :span="8">
          <el-form-item label="手机号">
            <el-input
              v-model="searchForm.memberid"
              clearable
              placeholder="请输入"
              @keyup.enter.native="filterData"
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="最近购买渠道">
            <el-input
              v-model="searchForm.memberid"
              clearable
              placeholder="请输入"
              @keyup.enter.native="filterData"
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="成为潜客天数">
            <el-input
              v-model="searchForm.memberid"
              clearable
              placeholder="请输入"
              @keyup.enter.native="filterData"
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="回购周期">
            <el-input
              v-model="searchForm.memberid"
              clearable
              placeholder="请输入"
              @keyup.enter.native="filterData"
            />
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-button type="primary" @click="filterData">查询</el-button>
        </el-col>
      </el-form>
    </header>
    <main class="tableMainContent">
      <!-- <router-link :to="{name:'ruleTemplate'}"><el-button type="primary" class="listAddBtnStyle">新增</el-button></router-link> -->
      <el-table
        v-loading="loading"
        stripe
        :data="tableData"
        :header-cell-style="{ background: '#F5F7FA', color: '#333333' }"
        border
      >
        <el-table-column prop="logonname" label="头像" width="110" />
        <el-table-column prop="organ_name" label="粉丝昵称" width="110" />
        <el-table-column prop="shop_name" label="备注" width="200" />
        <el-table-column prop="register_date" label="性别" width="110" />
        <el-table-column prop="level_name" label="语言" width="110" />
        <el-table-column prop="member_type" label="省份" width="110" />
        <el-table-column prop="member_class" label="城市" width="110" />
        <el-table-column prop="is_premium" label="国家" width="110" />
        <el-table-column prop="is_premium" label="UnionID" width="110" />
        <el-table-column prop="is_premium" label="OpenID" width="110" />
        <el-table-column prop="is_premium" label="手机号" width="110" />
        <el-table-column prop="is_premium" label="首次关注时间" width="110" />
        <el-table-column prop="is_premium" label="关注时间" width="110" />
        <el-table-column prop="is_premium" label="取关时间" width="110" />
        <el-table-column prop="is_premium" label="更新时间" width="110" />
        <el-table-column label="操作" fixed="right" border width="200px">
          <template slot-scope="scope">
            <el-button
              type="text"
              size="small"
              class="scopeStyle"
              @click="edit(scope.row)"
            >
              查看
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
    </main>
  </div>
</template>
<script>
import { getMemberList } from '@/api/markting/crmArchivesList'
import cacheCondition from '@/utils/cacheCondition'
export default {
  name: 'GroupTemplate',
  mixins: [cacheCondition],
  data() {
    return {
      searchForm: {
        memberid: ''
      },
      create_time: [],
      params: {
        page: 1,
        pageSize: 10
      },
      total: 0,
      pageSizes: [10, 20, 30, 40],
      loading: false,
      group_purpose_list: [
        { label: '常规营销', value: 'regular_marketing' },
        { label: '休眠唤醒', value: 'sleep_wake ' },
        { label: '流失召回', value: 'loss_recall' },
        { label: '店铺引流', value: 'shop_drainage' },
        { label: '活动宣传', value: 'event_promotion' },
        { label: '会员关怀', value: 'member_care' },
        { label: '系统通知', value: 'system_notification' }
      ],
      isMoreinquiries: false,
      tableData: []
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
      getMemberList({
        memberId: this.searchForm.memberid,
        page: this.params.page,
        pageSize: this.params.pageSize
      }).then((res) => {
        this.loading = false
        this.tableData = res.data.list || []
        this.params.page = (res.data && res.data.pagination.current) || 1
        this.params.pageSize = res.data && res.data.pagination.page_size
        this.total = res.data && res.data.pagination.total
      })
    },
    edit(row) {
      this.$router.push({
        name: 'crmArchivesPortrait',
        query: {
          memberId: row.memberid
        }
      })
    }
  }
}
</script>
<style lang="less">
.crmArchivesList {
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
  /deep/ .el-input {
    width: 80%;
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
  .search-collapse {
    border: none;
    background: none;
    color: #435a82;
    .el-icon-d-arrow-right {
      font-size: 14px;
      position: relative;
      left: 4px;
      transform: rotate(-90deg);
    }
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
}
.linkArea {
  width: 100%;
  display: flex;
  justify-content: center;
  border: 1px solid rgba(236, 238, 242, 1);
  margin-top: 15px;
  cursor: pointer;
  box-sizing: border-box;
  &:nth-of-type(1) {
    margin-top: 0px;
  }
  > a {
    width: 60%;
  }
  &:hover {
    border: 1px solid rgba(123, 139, 167, 1);
  }
}
.grid-content {
  display: flex;
  align-items: center;
  .icon {
    width: 140px;
    box-sizing: border-box;
    text-align: center;
    img {
      width: 100px;
    }
  }
  .info {
    flex: 1;
    position: relative;
    &::before {
      position: absolute;
      content: "";
      left: -20px;
      top: 25%;
      height: 50%;
      width: 1px;
      transform: scaleY(0.5);
      background: rgba(123, 139, 167, 1);
    }
    > p {
      font-size: 18px;
      color: #000000;
      line-height: 1.8;
    }
    > span {
      font-size: 14px;
      line-height: 1.8;
      color: #666666;
    }
  }
}
.error-info {
  .error-tip {
    display: flex;
    i {
      margin-right: 15px;
      font-size: 25px;
      color: #cf614f;
    }
    .tip {
      p {
        color: #435a82;
        font-weight: 500;
        line-height: 1.6;
      }
      span {
        color: #888888;
        line-height: 1.6;
      }
    }
  }
  .error-content {
    margin: 10px 0;
    .scroll {
      max-height: 40px;
      font-size: 14px;
      line-height: 1.6;
      overflow: auto;
      padding: 10px;
      background: #f9fafb;
    }
    /deep/ .el-checkbox {
      margin-top: 15px;
      display: block;
    }
    /deep/ .el-checkbox__label {
      vertical-align: top;
      display: inline-block;
      white-space: normal;
      word-break: break-all;
    }
  }
}
</style>
