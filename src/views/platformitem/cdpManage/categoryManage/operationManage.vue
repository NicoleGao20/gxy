<template>
  <div class="page-container-gap">
    <div class="conditon">
      <el-form label-position="right" label-width="110px">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="显示名称">
              <el-input
                v-model="searchForm.showName"
                @keyup.enter.native="filterData"
              />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="动作名称">
              <el-input
                v-model="searchForm.name"
                @keyup.enter.native="filterData"
              />

            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="显示方式">
              <el-input v-model="searchForm.showLocation" @keyup.enter.native="filterData" />
            </el-form-item>
          </el-col>
          <el-col :span="6" v-if="isMoreinquiries">
            <el-form-item label="动作处理方法">
              <el-input v-model="searchForm.method" @keyup.enter.native="filterData"/>
            </el-form-item>
          </el-col>
           <el-col :span="6">
            <el-button class="search-common" type="primary" @click="filterData">查询</el-button>
              <el-button v-show="!isMoreinquiries" @click="searchMore">更多筛选</el-button>
              <el-button v-show="isMoreinquiries" type="primary" class="search-collapse" @click="searchMore">收起<i class="el-icon-d-arrow-right"/> </el-button>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div style="padding: 10px; background: #fff">
      <!-- <el-button type="primary" style="margin-bottom: 10px" @click="mod('add')"
        >添加按钮</el-button
      > -->
      <el-table v-loading="loading" stripe :data="list" border>
        <el-table-column label="显示名称" fixed="left" width="100" prop="showName" />
        <el-table-column label="动作名称" fixed="left" width="100" prop="name"> </el-table-column>
        <el-table-column label="应用功能ID"  width="140" prop="functionId"> </el-table-column>
        <el-table-column label="显示页面类型"  width="140" prop="showPageType" />
        <el-table-column label="显示方式"  width="140" prop="showLocation" />
        <el-table-column label="动作图标"  width="140" prop="showIcon" />
        <el-table-column label="操作页面地址"  width="100" prop="pageUri" />
        <el-table-column label="动作处理接口"  width="300" prop="processorUri" />
        <el-table-column label="动作处理方法" width="140"  prop="method" />
        <el-table-column label="显示排序" width="100"  prop="position"/>
        <el-table-column label="动作说明" width="300" prop="description" />
        <el-table-column label="操作" fixed="right" width="140">
          <template slot-scope="scope">
            <div>
              <el-button type="text" @click="mod(scope.row, 'view')"
                >查看</el-button
              >
              
              <!-- <el-button type="text" @click="mod(scope.row, 'edit')"
                >编辑</el-button
              >
              <el-button
                type="text"
                class="deleteFontColor"
                @click="deleteFun(scope.row)"
                >删除</el-button
              > -->
            </div>
          </template>
        </el-table-column>
      </el-table>
      <base-pagination
        class="bottomPagination"
        v-model="params.current"
        :page-size.sync="params.pageSize"
        :total="total"
        @loadData="loadData"
      />
    </div>
  </div>
</template>
<script>
import { apiObj } from "@/config/getUrl.js";
import {
  queryByPage,
  listTableNameShow,
  deleteMenu,
} from "@/api/operationManage";
export default {
  name: "operationManage",
  data() {
    return {
      loading: false,
      typeLoading: false,
      isMoreinquiries: false,
      initDone: false,
      searchForm: {
        showName: "",
        Name: "",
      },
      params: {
        pageSize: 10,
        current: 1,
      },
      total: 0,
      list: [],
      tableColumns: [],
      filterColumns: [],
      listTableNameShow: [],
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    searchMore() {
      this.isMoreinquiries = !this.isMoreinquiries
    },
    deleteFun(item) {
      console.log("888");
      this.$confirm("是否删除该菜单？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        closeOnClickModal: false,
        type: "warning",
      })
        .then(() => {
          deleteMenu({
            id: item.id,
          }).then((res) => {
            if (res.code == 0) {
              this.$message({
                message: res.msg,
                type: "success",
              });
              this.filterData();
            }
          });
        })
        .catch(() => {});
    },
    init() {
      this.loadData();
    },
    mod(row, type) {
      if (type == "add") {
        this.$router.push({
          name: "operationManageDetail",
          query: { type: type },
        });
      } else {
        this.$router.push({
          name: "operationManageDetail",
          query: { id: row.id, type: type },
        });
      }
    },
    loadData() {
      this.loading = true;
      const sdata = this.searchForm
        ? JSON.parse(JSON.stringify(this.searchForm))
        : {};
      queryByPage({
        pageNo: this.params.current,
        pageSize: this.params.pageSize,
        params: sdata,
      })
        .then((res) => {
          this.loading = false;
          this.total = parseInt(res.body.total);
          this.list = res.body.records;
        })
        .catch(() => {
          this.loading = false;
        });
    },
    filterData() {
      this.params.current = 1;
      this.loadData();
    },
  },
};
</script>
<style lang="less" scoped>
.page-container-gap {
  // background: white;
  height: 100%;
  .conditon {
    margin-bottom: 10px;
    padding: 15px 15px 0;
    background: white;
  }
}
</style>
