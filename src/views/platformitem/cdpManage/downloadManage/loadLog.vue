<template>
  <div class="page-container-gap">
    <div class="searchWrap">
      <!-- 条件库 -->
      <el-form label-position="right" label-width="80px">
        <el-row :gutter="20">
          <el-col :span="6">
           <el-form-item label="文件名称">
              <el-autocomplete
                clearable
                v-model="searchForm.file_name"
                :fetch-suggestions="querySearch"
                @keyup.enter.native="filterData"
                placeholder="请输入文件名称"
                :trigger-on-focus="false"
                @select="handleSelect"
              ></el-autocomplete>
            </el-form-item>
          </el-col>
          <el-col :span="6">
           <el-form-item label="导入人">
              <el-autocomplete
                clearable
                v-model="searchForm.import_user"
                :fetch-suggestions="querySearchCreatUserList"
                @keyup.enter.native="filterData"
                placeholder="请输入创建人"
                :trigger-on-focus="false"
                @select="handleSelect"
              ></el-autocomplete>
            </el-form-item>
          </el-col>
          <el-col :span="6">
               <el-form-item label="导入时间">
              <el-date-picker
                value-format="yyyy-MM-dd"
                v-model="searchForm.import_time"
                type="date"
                placeholder="选择日期"
              ></el-date-picker>
            </el-form-item>
          </el-col>

          <el-col :span="6" style="text-align:center;">
            <el-button type="primary" @click="filterData">查询</el-button>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <main class="tableMainContent">
      <el-table v-loading="loading" stripe :data="rows" :max-height="500" >
        <el-table-column label="文件名称" prop="file_name"></el-table-column>
        <el-table-column label="导入模块" prop="plate_name" />
        <el-table-column label="导入人" prop="import_user"></el-table-column>
        <el-table-column label="验证手机号码" prop="validate_mobile" />
        <el-table-column label="导入时间" prop="import_time" />
        <el-table-column label="IP地址" prop="ip_address" />
        <el-table-column label="导入状态" prop="import_status" />
        <el-table-column label="备注" prop="describe" />
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
import {
  queryDownloadImportLog,
  queryQueryBoxWord,
} from "@/api/security/visit";
export default {
  name: "ConditionLibraryList",
  data() {
    return {
      fileNameList: [],
      importUserList: [],
      loading: false,
      searchForm: {
        file_name: "",
        import_user: "",
        import_time: "", //时间
      },
      fileFounderName: [],
      fileValue: [],

      params: {
        pageSize: 10,
        current: 1,
      },
      total: 0,
      rows: [],
    };
  },
  mounted() {
    this.init();
    Object.keys(this.searchForm).forEach((key) => {
      this.searchForm[key] = "";
    });
  },
  methods: {
    async queryBoxVocabularyFun(queryString, queryType) {
      let param = {};
      if (queryType == "file_name") {
        // 输入文件名
        param.queryFlag = "queryImportLogFlag";
        param.file_name = queryString;
      } else if (queryType == "import_user") {
        // 输入导入人
        param.queryFlag = "queryImportLogFlag";
        param.import_user = queryString;
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
      } else if (queryType == "import_user") {
        let importUserList = [];
        if (data.data.list && data.data.list.length > 0) {
          data.data.list.forEach((item) => {
            importUserList.push({ value: item.import_user });
          });
        }
        return importUserList;
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
    querySearchCreatUserList(queryString, cb) {
      // 当输入导入人调用接口，await返回 数据，
      this.queryBoxVocabularyFun(queryString, "import_user").then((res) => {
        let importUserList = res || [];
        var resultsImportUserList = queryString
          ? importUserList.filter(this.createFilter(queryString))
          : importUserList;
        cb(resultsImportUserList);
      });
    },
    handleSelect(item) {
      console.log(item);
    },
    init() {
      this.loadData();
    },
    loadData() {
      let params = {
        pageNum: this.params.current,
        pageSize: this.params.pageSize,
      };
      Object.keys(this.searchForm).map((item) => {
        if (this.searchForm[item]) {
          params[item] = this.searchForm[item];
        }
      });
      queryDownloadImportLog(params).then((res) => {
        this.rows = (res.data && res.data.list) || [];
        this.params.current = (res.data && res.data.pagination.current) || 1;
        this.params.pageSize = res.data && res.data.pagination.page_size;
        this.total = res.data && res.data.pagination.total;
      });
    },
    tableFile(type, typeName, tableNameShow) {
      if (tableNameShow !== "") {
        this.loading = true;
        setTimeout(() => {
          this.loading = false;
          if (typeName === "文件名称") {
            this.fileValue = type.filter((item) => {
              return (
                item.label.toLowerCase().indexOf(tableNameShow.toLowerCase()) >
                -1
              );
            });
          } else {
            this.fileFounderName = type.filter((item) => {
              return (
                item.label.toLowerCase().indexOf(tableNameShow.toLowerCase()) >
                -1
              );
            });
          }
        }, 200);
      }
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