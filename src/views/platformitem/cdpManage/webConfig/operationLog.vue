<template>
  <div class="page-container-gap">
    <div class="searchWrap">
      <!-- 条件库 -->
      <el-form label-position="right" label-width="80px">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="账号">
              <el-autocomplete
                clearable
                v-model="searchForm.login_user_code"
                :fetch-suggestions="accountNumber"
                 @keyup.enter.native="filterData"
                placeholder="请输入账号"
                :trigger-on-focus="false"
                @select="handleSelect"
              ></el-autocomplete>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="用户名">
              <el-autocomplete
                clearable
                v-model="searchForm.user_group_name"
                :fetch-suggestions="fileName"
                 @keyup.enter.native="filterData"
                placeholder="请输入用户名"
                :trigger-on-focus="false"
                @select="handleSelect"
              ></el-autocomplete>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="IP地址">
              <el-autocomplete
                clearable
                v-model="searchForm.login_ip"
                :fetch-suggestions="loginIp"
                @keyup.enter.native="filterData"
                placeholder="请输入IP地址"
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
      <!-- <el-button type="primary" @click="labelModalVisble = true" class="listAddBtnStyle">新增</el-button> -->
      <!-- <el-button type="primary" @click="sycn">重试下发条件</el-button> -->
      <el-table v-loading="loading" stripe :data="rows" :max-height="500">
        <el-table-column label="账号" prop="login_user_code"></el-table-column>
        <el-table-column label="用户名" prop="user_group_name" />
        <el-table-column label="IP地址" prop="login_ip"></el-table-column>
        <el-table-column label="操作模块" prop="operate_modular" />
        <el-table-column label="操作类型" prop="operate_type" />
        <el-table-column label="操作对象" prop="operate_object">
          <template slot-scope="scope">
            {{ scope.row.operate_object ? scope.row.operate_object : "-" }}
          </template>
        </el-table-column>
        <el-table-column label="操作时间" prop="operate_time" />
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
import { queryOperationLog, queryRelatedWord } from "@/api/security/visit";
export default {
  name: "ConditionLibraryList",
  data() {
    return {
      loading: false,
      isMoreinquiries: false,
      searchForm: {
        login_user_code: "",
        user_group_name: "",
        login_ip: "",
      },
      fileValue: "",
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
    init() {
      this.loadData();
    },
    async queryBoxVocabularyFun(queryString, queryType) {
      let param = {
        fuzzy_type: {},
      };
      if (queryType == "login_user_code") {
        param.fuzzy_type[queryType] = queryString;
      } else if (queryType == "login_ip") {
        param.fuzzy_type[queryType] = queryString;
      } else if (queryType == "user_group_name") {
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
      } else if (queryType == "user_group_name") {
        let groupName = [];
        if (data.data.list && data.data.list.length > 0) {
          data.data.list.forEach((item) => {
            groupName.push({ value: item.user_group_name });
          });
        }
        return groupName;
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
      // 当输入账号时候，调用接口，await返回 数据，
      this.queryBoxVocabularyFun(queryString, "login_user_code").then((res) => {
        let loginUserCode = res || [];
        var results = queryString
          ? loginUserCode.filter(this.createFilter(queryString))
          : loginUserCode;
        cb(results);
      });
    },
     fileName(queryString, cb) {
      // 当输入用户名时候，调用接口，await返回 数据，
      this.queryBoxVocabularyFun(queryString, "user_group_name").then((res) => {
        let groupName = res || [];
        var results = queryString
          ? groupName.filter(this.createFilter(queryString))
          : groupName;
        cb(results);
      });
    },
    loginIp(queryString, cb) {
      // 当输入IP调用接口，await返回 数据，
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
    loadData() {
      let params = {
        pageNum: this.params.current,
        pageSize: this.params.pageSize,
      };
      const { login_user_code, user_group_name, login_ip } = this.searchForm;
      params.general_type = {
        login_user_code,
        user_group_name,
        login_ip,
      };
      let arr1 = Object.keys(params.general_type);
      arr1.map((item) => {
        if (
          !params.general_type[item] ||
          (Array.isArray(params.general_type[item]) &&
            params.general_type[item].length === 0)
        ) {
          delete params.general_type[item];
        }
      });
      queryOperationLog(params).then((res) => {
        this.rows = (res.data && res.data.list) || [];
        this.params.current = (res.data && res.data.pagination.current) || 1;
        this.params.pageSize = res.data && res.data.pagination.page_size;
        this.total = res.data && res.data.pagination.total;
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
<style lang="less" scoped>
/deep/ .el-autocomplete,
/deep/ .el-date-editor--date {
  width: 100%;
}
</style>
