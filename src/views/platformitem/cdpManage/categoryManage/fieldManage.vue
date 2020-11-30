<template>
  <div class="page-container-gap">
    <div class="conditon">
      <el-form label-position="right" label-width="90px">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="字段名称">
              <el-input
                v-model="searchForm.name"
                @keyup.enter.native="filterData"
              />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="显示名称">
              <el-input
                v-model="searchForm.showName"
                @keyup.enter.native="filterData"
              />

            </el-form-item>
          </el-col>     
          <el-col :span="6">
            <el-form-item label="字段类型">
              <el-input
                v-model="searchForm.fieldType"
                @keyup.enter.native="filterData"
              />
            </el-form-item>
          </el-col>
          <el-col  v-show="isMoreinquiries" :span="6">
            <el-form-item label="是否可为空">
              <el-input
                v-model="searchForm.nullable"
                @keyup.enter.native="filterData"
              />
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
        >添加字段</el-button
      > -->
      <el-table v-loading="loading" stripe :data="list"  border>
        <el-table-column label="字段名" fixed="left" width="180" prop="name" />
        <el-table-column label="显示名称" fixed="left" width="160" prop="showName"> </el-table-column>
        <el-table-column label="功能ID" width="140" prop="functionId"> </el-table-column>
        <el-table-column label="字段类型" width="200" prop="fieldType" />
        <el-table-column label="显示排序" width="200" prop="position" />
        <el-table-column label="是否可为空" width="140" prop="nullable" />
        <el-table-column label="字段权限规则串" width="200" prop="rules" />
        <el-table-column label="备注" width="500" prop="description" />
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
} from "@/api/fieldManage";
export default {
  name: "menulist",
  data() {
    return {
      default_img: 'this.src="' + apiObj.defult_404_avata + '"',
      loading: false,
      typeLoading: false,
      isMoreinquiries: false,
      initDone: false,
      searchForm: {
        platformName: "",
        showName: "",
      },
      params: {
        pageSize: 10,
        current: 1,
      },
      total: 0,
      list: [],
      tableColumns: [],
      filterColumns: [],
      labelTypes: [
        { label: "基础属性", value: "normal" },
        { label: "聚合属性", value: "aggregation" },
      ],
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
          name: "fieldManageDetail",
          query: { type: type },
        });
      } else {
        this.$router.push({
          name: "fieldManageDetail",
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
