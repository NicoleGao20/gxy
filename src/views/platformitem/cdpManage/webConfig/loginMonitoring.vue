<template>
  <div class="page-container-gap">
    <div class="searchWrap">
      <el-form label-position="right" label-width="80px">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="登录账号">
              <el-autocomplete
                clearable
                v-model="searchForm.login_user_code"
                :fetch-suggestions="accountNumber"
                 @keyup.enter.native="filterData"
                placeholder="请输入登录账号"
                :trigger-on-focus="false"
                @select="handleSelect"
              ></el-autocomplete>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="登录时间">
              <el-date-picker
                default-time="12:00:00"
                value-format="yyyy-MM-dd"
                v-model="searchForm.login_time"
                type="date"
                placeholder="选择日期"
                @change="dataTime"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="登录IP">
              <el-autocomplete
                clearable
                v-model="searchForm.login_ip"
                :fetch-suggestions="loginIp"
                @keyup.enter.native="filterData"
                placeholder="请输入登录IP"
                :trigger-on-focus="false"
                @select="handleSelect"
              ></el-autocomplete>
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
        <el-table-column label="公司名称" prop="company_name"></el-table-column>
        <el-table-column label="登录账号" prop="login_user_code" />
        <el-table-column label="登录时间" prop="login_time"></el-table-column>
        <el-table-column label="登录IP" prop="login_ip" />
        <el-table-column prop="login_status" label="登陆结果" width="120">
          <template slot-scope="scope">
            {{ scope.row.login_status === "Y" ? "登陆成功" : "登陆失败" }}
          </template>
        </el-table-column>
        <el-table-column label="失败原因" prop="fail_reason" />
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
<style lang="less" scoped>
/deep/ .el-autocomplete,
/deep/ .el-date-editor--date {
  width: 100%;
}
</style>
<script>
import { queryAllUserLoginInfo, queryRelatedWord } from "@/api/security/visit";
export default {
  name: "ConditionLibraryList",
  data() {
    return {
      loading: false,
      searchForm: {
        login_user_code: "",
        login_ip: "",
        login_time: "", //时间
      },
      params: {
        pageSize: 10,
        current: 1,
      },
      total: 0,
      rows: [],
      fileValue: "",
    };
  },
  mounted() {
    this.init();
    Object.keys(this.searchForm).forEach((key) => {
      this.searchForm[key] = "";
    });
  },
  methods: {
    init() {
      this.loadData();
    },
    async queryBoxVocabularyFun(queryString, queryType) {
      let param = {
        fuzzy_type: {},
      };
      if (queryType == "login_user_code") {
        param.typeFlag = "accessMonitor";
        param.fuzzy_type[queryType] = queryString;
      } else if (queryType == "login_ip") {
        param.typeFlag = "accessMonitor";
        param.fuzzy_type[queryType] = queryString;
      }
      console.log(param, "param");
      let data = await queryRelatedWord(param);
      if (queryType == "login_user_code") {
        let loginUserCode = [];
        if (data.data.list && data.data.list.length > 0) {
          data.data.list.forEach((item) => {
            loginUserCode.push({ value: item.login_user_code });
          });
        }
        return loginUserCode;
      } else if (queryType == "login_ip") {
        let loginIp = [];
        if (data.data.list && data.data.list.length > 0) {
          data.data.list.forEach((item) => {
            loginIp.push({ value: item.login_ip });
          });
        }
        return loginIp;
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
    //登录账号
    accountNumber(queryString, cb) {
      // 当输入文件名时候，调用接口，await返回 数据，
      this.queryBoxVocabularyFun(queryString, "login_user_code").then((res) => {
        let loginUserCode = res || [];
        var results = queryString
          ? loginUserCode.filter(this.createFilter(queryString))
          : loginUserCode;
        cb(results);
      });
    },
    loginIp(queryString, cb) {
      // 当输入导入人调用接口，await返回 数据，
      this.queryBoxVocabularyFun(queryString, "login_ip").then((res) => {
        let loginIp = res || [];
        var resultsImportUserList = queryString
          ? loginIp.filter(this.createFilter(queryString))
          : loginIp;
        cb(resultsImportUserList);
      });
    },
    handleSelect(item) {
      console.log(item);
    },

    //时间
    dataTime(query) {
      this.searchForm.login_time = query;
    },
    loadData() {
      let params = {
        pageNum: this.params.current,
        pageSize: this.params.pageSize,
      };
      let keys = Object.keys(this.searchForm);
      keys.map((item) => {
        if (this.searchForm[item]) {
          params[item] = this.searchForm[item];
        }
      });
      queryAllUserLoginInfo(params).then((res) => {
        console.log(res, "ressd");
        this.rows = (res.data && res.data.list) || [];
        this.params.current = (res.data && res.data.currentPage) || 1;
        this.params.pageSize = res.data && res.data.pageSize;
        this.total = res.data && res.data.totalRecord;
      });
    },
    //查询
    filterData() {
      this.params.current = 1;
      this.loadData();
    },
  },
};
</script>

