<template>
  <div class="page-container-gap">
    <div class="searchWrap">
      <el-form label-position="right" label-width="80px">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="文件名">
              <el-autocomplete
                clearable
                v-model="searchForm.file_name"
                :fetch-suggestions="querySearch"
                 @keyup.enter.native="filterData"
                placeholder="请输入下载人"
                :trigger-on-focus="false"
                @select="handleSelect"
              ></el-autocomplete>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="下载人">
              <el-autocomplete
                clearable
                v-model="searchForm.download_user"
                :fetch-suggestions="downloadFounder"
                @keyup.enter.native="filterData"
                placeholder="请输入下载人"
                :trigger-on-focus="false"
                @select="handleSelect"
              ></el-autocomplete>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="下载时间">
              <el-date-picker
                v-model="searchForm.download_time"
                value-format="yyyy-MM-dd"
                type="date"
                placeholder="选择日期"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="6" style="text-align: center">
            <el-button type="primary" @click="filterData">查询</el-button>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <main class="tableMainContent">
      <el-table v-loading="loading" stripe :data="rows" :max-height="500">
        <el-table-column label="文件名称" prop="file_name"></el-table-column>
        <el-table-column label="来源模块" prop="source_name" />
        <el-table-column label="下载人" prop="download_user"></el-table-column>
        <el-table-column label="验证手机号码" prop="mobile" />
        <el-table-column label="下载时间" prop="download_time" />
        <el-table-column label="IP地址" prop="ip_address" />
        <el-table-column label="下载状态" prop="download_status" />
      </el-table>
      <base-pagination
        class="bottomPagination"
        v-model="params.current"
        :page-size.sync="params.pageSize"
        :total="total"
        @loadData="loadData"
      />
    </main>
  </div>
</template>
<script>
import { queryDownloadVerifier, queryQueryBoxWord } from "@/api/security/visit";
export default {
  name: "journal",
  props: ["name"],
  data() {
    return {
      loading: false,
      isMoreinquiries: false,
      fileValue: [],
      fileFounderName: [],
      searchForm: {
        file_name: "",
        download_user: "",
        create_user: "",
        update_user: "",
        download_time: "",
      },
      params: {
        pageSize: 10,
        current: 1,
      },
      total: 0,
      rows: [],
      id: "",
    };
  },
  mounted() {
    let from = this.$props.name;
    if (from) {
      console.log(this.$route, "hhh");
      this.init(this.$route.query.id);
    } else {
      console.log("jjjj");
      this.init();
    }
  },
  methods: {
    init(id) {
      console.log(id, "idname");
      this.loadData(id);
    },
    loadData(id) {
      let params = {
        pageNum: this.params.current,
        pageSize: this.params.pageSize,
      };

      if (id) {
        params.file_id = id;
      }
      Object.keys(this.searchForm).forEach((key) => {
        if (this.searchForm[key]) {
          params[key] = this.searchForm[key];
        }
      });
      this.loading = true;
      queryDownloadVerifier(params).then((res) => {
        this.loading = false;
        this.rows = (res.data && res.data.list) || [];
        this.params.current = (res.data && res.data.pagination.current) || 1;
        this.params.pageSize = res.data && res.data.pagination.page_size;
        this.total = res.data && res.data.pagination.total;
      });
    },
    async queryBoxVocabularyFun(queryString, queryType) {
      let param = {};
      if (queryType == "file_name") {
        // 输入文件名
        param.queryFlag = "queryLogFlag";
        param.file_name = queryString;
      } else if (queryType == "download_user") {
        // 输入下载人
        param.queryFlag = "queryLogFlag";
        param.download_user = queryString;
      }
      let data = await queryQueryBoxWord(param);
      if (queryType == "file_name") {
        let fileNameList = [];
        if (data.data.list && data.data.list.length > 0) {
          data.data.list.forEach((item) => {
            fileNameList.push({ value: item.file_name });
          });
        }
        return fileNameList;
      } else if (queryType == "download_user") {
        let downloadUser = [];
        if (data.data.list && data.data.list.length > 0) {
          data.data.list.forEach((item) => {
            downloadUser.push({ value: item.download_user });
          });
        }
        return downloadUser;
      }
    },
    createFilter(queryString) {
      return (restaurant) => {
        console.log("sssss", queryString);
        return (
          restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) ===
          0
        );
      };
    },
    //文件名
    querySearch(queryString, cb) {
      // 当输入文件名时候，调用接口，await返回 数据，
      this.queryBoxVocabularyFun(queryString, "file_name").then((res) => {
        let fileNameList = res || [];
        var results = queryString
          ? fileNameList.filter(this.createFilter(queryString))
          : fileNameList;
        cb(results);
      });
    },
    downloadFounder(queryString, cb) {
      // 当输入导入人调用接口，await返回 数据，
      this.queryBoxVocabularyFun(queryString, "download_user").then((res) => {
        let downloadUser = res || [];
        var resultsImportUserList = queryString
          ? downloadUser.filter(this.createFilter(queryString))
          : downloadUser;
        cb(resultsImportUserList);
      });
    },
    handleSelect(item) {
      console.log(item);
    },
    //查询
    filterData() {
      this.params.current = 1;
      this.loadData();
    },
  },
};
</script>
<style lang="less" scoped>
/deep/ .el-autocomplete,
/deep/ .el-date-editor--date {
  width: 100%;
}
</style>
