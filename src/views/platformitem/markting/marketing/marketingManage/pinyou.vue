<template>
  <div class="jing-dong-shu-fang-container">
    <header class="searchWrap">
      <el-form label-position="right" label-width="100px">
        <el-col :span="6">
          <el-form-item label="任务名称:">
            <el-input
              v-model="searchForm.taskName"
              clearable
              placeholder="请输入"
              @keyup.enter.native="filterData"
            />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="受众名称:">
            <el-input
              v-model="searchForm.group_name"
              clearable
              placeholder="请输入"
              @keyup.enter.native="filterData"
            />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="推送状态:">
            <el-select v-model="searchForm.ads_push_status" style="width: 100%;margin-bottom: 10px;" filterable placeholder="请选择">
              <el-option
                v-for="item in pushStateList"
                :key="item.value"
                :label="item.label"
                :value="item.value"/>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-button type="primary" @click="filterData">查询</el-button>
          <el-button type="primary" >更多查询</el-button>
        </el-col>
      </el-form>
    </header>
    <main class="tableMainContent">
      <router-link :to="{name:'newpinyou'}"><el-button type="primary" class="mb10">新增</el-button></router-link>
      <el-table
        v-loading="loading"
        stripe
        :data="tableData"
        :header-cell-style="{ background: '#F5F7FA', color: '#333333' }"
        border
      >
        <el-table-column prop="ads_name" label="任务名称" width="110" />
        <el-table-column prop="group_no" label="受众名称" width="110" />
        <el-table-column prop="ads_name_later" label="推送后名称" width="100" />
        <el-table-column prop="ID_type" label="ID类型" width="110" />
        <el-table-column prop="cnt_audience" label="受众人群数" width="110" />
        <el-table-column prop="cnt_audience_valid" label="有效人群数" width="110" />
        <el-table-column prop="ads_push_status" label="推送状态" width="100" />
        <el-table-column prop="create_time" label="创建时间" width="140" />
        <el-table-column prop="create_user" label="创建人" width="120" />
        <el-table-column prop="update_user" label="修改人" width="120" />
        <el-table-column prop="update_time" label="修改时间" width="140" />
        <el-table-column label="操作" fixed="right" border width="200">
          <template slot-scope="scope">
            <el-button
              type="text"
              size="small"
              class="scopeStyle"
              @click="view(scope.row)"
            >
              查看
            </el-button>
            <el-button
              type="text"
              size="small"
              class="scopeStyle"
              @click="edit(scope.row)"
            >
              编辑
            </el-button>
            <el-button
              type="text"
              size="small"
              class="scopeStyle"
              @click="handleReSubmit(scope.row)"
            >
              重新推送
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
        @loadData="getAdvertisingListFun"
      />
    </main>
  </div>
</template>
<script>
import { getAdvertisingList } from "@/api/markting/advertising";
import cacheCondition from "@/utils/cacheCondition";
export default {
  name: "GroupTemplate",
  mixins: [cacheCondition],
  data() {
    return {
      searchForm: {
        ads_name: "",
        group_name: '',
        ads_push_status: ''
      },
      params: {
        page: 1,
        pageSize: 10,
      },
      total: 0,
      pageSizes: [10, 20, 30, 40],
      loading: false,
      tableData: [],
      pushStateList: []
    };
  },
  mounted() {
    this.initData();
  },
  methods: {
    initData() {
      this.getAdvertisingListFun();
      this.getPushStateList();
    },
    getPushStateList(){
      this.pushStateList = [
        { id: 0, value: '待推送', label: '待推送' },
        { id: 1, value: '推送中', label: '推送中' },
        { id: 2, value: '推送成功', label: '推送成功' },
        { id: 3, value: '推送失败', label: '推送失败' }
        ]
    },
    filterData() {
      this.params.page = 1;
      this.initData();
    },
    getAdvertisingListFun() {
      this.loading = true;
      getAdvertisingList({
        integ_channel_name: '京东数坊',
        ads_name: this.searchForm.ads_name,
        group_name: this.searchForm.group_name,
        ads_push_status: this.searchForm.ads_push_status,
        page: this.params.page,
        pageSize: this.params.pageSize,
      }).then((res) => {
        this.loading = false;
        this.tableData = res.data.list || [];
        this.params.page = (res.data && res.data.pagination.current) || 1;
        this.params.pageSize = res.data && res.data.pagination.page_size;
        this.total = res.data && res.data.pagination.total;
      });
    },

    // 查看
    view(row){
      const formData = encodeURIComponent(JSON.stringify(row))
      this.$router.push({
        name: 'viewJingdongShufang',
        query: {formData}
      });
    },

    // 编辑
    edit(row) {
      const formData = encodeURIComponent(JSON.stringify(row))
      this.$router.push({
        name: "editJingdongShufang",
        query: { formData }
      });
    },

    // 重新推送
    handleReSubmit(){

    }
  },
};
</script>
<style lang="less" scoped>
.jing-dong-shu-fang-container {
  padding: 0 15px;
  header,
  main {
    width: 100%;
    height: auto;
    box-sizing: border-box;
    display: block;
    background: #ffffff;
    padding: 10px 25px;
    .scopeStyle {
      cursor: pointer;
    }
    .pagination-container{
      padding-right: 20px;
    }
  }
  header {
    margin: 15px 0;
    overflow: hidden;
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
.mb10{
  margin-bottom: 10px;
}
</style>
