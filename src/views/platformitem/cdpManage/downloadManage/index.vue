<template>
  <div class="page-container-gap">
    <div class="searchWrap">
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
            <el-form-item label="创建人">
              <el-autocomplete
                clearable
                v-model="searchForm.create_user"
                :fetch-suggestions="querySearchCreatUserList"
                @keyup.enter.native="filterData"
                placeholder="请输入创建人"
                :trigger-on-focus="false"
                @select="handleSelect"
              ></el-autocomplete>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="创建时间">
              <el-date-picker
                v-model="searchForm.file_create_time"
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
      <el-table v-loading="loading" stripe :data="tableList" :max-height="500">
        <el-table-column label="序号">
          <template slot-scope="scope">
            <span>{{ scope.$index + 1 }}</span>
          </template>
        </el-table-column>
        <el-table-column label="文件名称" prop="file_name" width="160" />
        <el-table-column label="来源模块" prop="plate_name" width="140" />
        <el-table-column label="品牌" prop="brand_code" width="160">
          <template slot-scope="scope">
            {{ scope.row.brand_code ? scope.row.brand_code : "-" }}
          </template>
        </el-table-column>
        <el-table-column label="店铺范围" prop="shop_name" width="160" />
        <el-table-column label="数据行数" prop="data_count" width="180" />
        <el-table-column label="数据范围" prop="data_filter" width="140">
          <template slot-scope="scope">
            <span class="see" @click="headClick(scope.row)">{{
              scope.row.data_filter
            }}</span>
          </template>
        </el-table-column>
        <el-table-column label="创建人" prop="create_user" width="150" />
        <el-table-column label="生成状态" prop="generate_status" width="150" />
        <el-table-column label="结果描述" prop="remark" width="150" />
        <el-table-column label="创建时间" prop="file_create_time" width="150" />
        <el-table-column
          label="生成时间"
          prop="file_generate_time"
          width="150"
        />
        <el-table-column label="操作" width="160" fixed="right">
          <!-- 查看记录 -->
          <template slot-scope="scope">
            <el-button
              v-if="scope.row.generate_status == '已完成'"
              type="text"
              @click="handler(scope.row)"
              >查看记录</el-button
            >
            <el-button
              type="text"
              @click="downloadFiles(scope.row)"
              v-if="scope.row.tipsFlag == true"
              >下载文件</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <base-pagination
        class="bottomPagination"
        v-model="params.current"
        :page-size.sync="params.pageSize"
        :total="total"
        @loadData="getList"
      />
    </main>
    <operationCheck
      :requestType="operationCheckObj.requestType"
      v-if="operationCheckObj.dialogVisible"
      :dialogVisible.sync="operationCheckObj.dialogVisible"
      :btnText="operationCheckObj.btnText"
      :title="operationCheckObj.title"
      @submitCheckResult="modalDownLoad($event)"
    />
    <el-dialog :title="file_name" :visible.sync="dialogInformation" width="30%">
      <p>时间:{{ file_generate_time }}</p>
      <p>内容:{{ plate_name }}</p>
    </el-dialog>
  </div>
</template>

<style lang="less" scoped>
/deep/ .el-autocomplete,
/deep/ .el-date-editor--date {
  width: 100%;
}
</style>
<script>
import {
  queryDownloadRecord,
  queryDownloadVerifierName,
  queryScreeningCriteria,
  queryBoxVocabulary,
  queryVerifierName,
  sendDownloadCheckMsg,
  checkVerificationCode,
  downloadMgtFile,
  queryQueryBoxWord,
} from "@/api/security/visit";
import operationCheck from "@/publicComponents/operationCheck/index.vue";
import urlConfig from "@/config/config.js";
export default {
  name: "MarketEventList",
  components: {
    // 挂载组件
    operationCheck: operationCheck,
  },
  data() {
    return {
      fileNameList: [],
      creatUserList: [],
      operationCheckObj: {
        //  requestType:'t2',组件里面，查询删除验证人。
        requestType: "",
        dialogVisible: false,
        btnText: "确定下载",
        title: "下载文件",
        id: "",
      },
      params: {
        current: 1,
        pageSize: 10,
      },
      total: 0,
      loading: false,
      dialogInformation: false,
      tableList: [],
      searchForm: {
        file_name: "",
        create_user: "",
        file_create_time: "", //时间
      },
      dialogVisible: false,
      file_name: "",
      file_generate_time: "",
      plate_name: "",
      dataId: "",
      fileValue: [],
      verifierName: [],
      validate_user_mobile: "",
      validate_user_name: "",
      keyCode: "",
      validateList: [],
      validate_id: "",
      time: 10,
      tiemBoole: false,
      fileFounderName: [],
      timer: "",
      fileType: false,
      ruleForm: {
        verifier: "",
        verificationCode: "",
      },
      rules: {
        verifier: [
          { required: true, message: "请输入验证人", trigger: "blur" },
        ],
        verificationCode: [
          { required: true, message: "请输入验证码", trigger: "blur" },
        ],
      },
    };
  },
  mounted() {
    //初始化
    Object.keys(this.searchForm).forEach((key) => {
      this.searchForm[key] = "";
    });
    this.getList();
  },

  methods: {
    async queryBoxVocabularyFun(queryString, queryType) {
      let param = {};
      if (queryType == "file_name") {
        // 输入文件名
        param.queryFlag = "queryRecordFlag";
        param.file_name = queryString;
      } else if (queryType == "create_user") {
        // 输入导入人
        param.queryFlag = "queryRecordFlag";
        param.create_user = queryString;
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
      } else if (queryType == "create_user") {
        let importUserList = [];
        if (data.data.list && data.data.list.length > 0) {
          data.data.list.forEach((item) => {
            importUserList.push({ value: item.create_user });
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
      this.queryBoxVocabularyFun(queryString, "create_user").then((res) => {
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
    //请求数据
    getList() {
      let params = {
        pageNum: this.params.current,
        pageSize: this.params.pageSize,
        queryFlag: "queryRecordFlag",
      };
      Object.keys(this.searchForm).forEach((key) => {
        if (this.searchForm[key]) {
          params[key] = this.searchForm[key];
        }
      });
      queryDownloadRecord(params).then((res) => {
        this.loading = false;
        this.tableList = res.data.list;
        this.params.current = res.data.pagination.current || 1;
        this.params.pageSize = res.data.pagination.page_size;
        this.total = res.data.pagination.total || 0;
      });
    },
    //查询
    filterData() {
      this.getList();
    },
    //点击查看记录
    handler(row) {
      this.$router.push({
        name: "dataDownload/journalType",
        query: {
          id: row.id,
        },
      });
    },
    // 弹框验证后下载
    modalDownLoad(data) {
      window.location.href = `${urlConfig.url}/downloadMgt/downloadFile?fileId=${this.dataId}&phone=${data.mobile}`;
    },
    //下载文件
    downloadFiles(row) {
      this.dataId = row.id;
      if (!row.checkFlag) {
        window.location.href = `${urlConfig.url}/downloadMgt/downloadFile?fileId=${row.id}&phone=${this.validate_user_mobile}`;
      } else {
        this.operationCheckObj.dialogVisible = true;
      }

      // Object.keys(this.ruleForm).forEach((key) => {
      //   this.ruleForm[key] = "";
      // });
      // if (row.checkFlag) {
      //   this.dialogVisible = true;
      // } else {
      //   this.dialogVisible = false;
      //   window.location.href = `${urlConfig.url}/downloadMgt/downloadFile?fileId=${row.id}`;
      // }

      // this.Verifier(row);
      // this.setTime("close");
    },
    Verifier(row) {
      this.dataId = row.id;
      let params = {};
      queryVerifierName(params).then((res) => {
        if (res.code === "1") {
          this.verifierName = res.data.list;
        }
      });
    },
    //验证手机号
    verifierChange(id) {
      let validate_list = (this.validateList = this.verifierName.filter(
        (item) => {
          return item.id == id;
        }
      ));
      validate_list.map((item) => {
        this.validate_id = item.id;
        this.validate_user_mobile = item.validate_user_mobile;
        this.validate_user_name = item.validate_user_name;
      });
    },
    // 输入返回回来的验证码
    timeFile() {
      let params = {
        verificationCode: this.ruleForm.verificationCode,
        verificationKey: this.keyCode,
        id: this.validate_id,
      };
      checkVerificationCode(params)
        .then((res) => {
          console.log(res, "reddd");
          if (res.code === "1") {
            this.dialogVisible = false;
            window.location.href = `${urlConfig.url}/downloadMgt/downloadFile?fileId=${this.dataId}&phone=${this.validate_user_mobile}`;
          } else {
            this.dialogVisible = true;
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    //点击发送验证码
    verification(formName) {
      this.time = 10;
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const params = { validate_user_mobile: this.validate_user_mobile };
          sendDownloadCheckMsg(params).then((res) => {
            if (res.code === "1") {
              this.setTime();
              this.keyCode = res.data.key;
              this.fileType = true;
            }
          });
        }
      });
    },
    //倒计时
    setTime(type) {
      if (type) {
        clearInterval(this.timer);
        this.tiemBoole = false;
      } else {
        this.timer = setInterval(() => {
          this.time--;
          if (this.time > 0 || this.time < 10) {
            this.tiemBoole = true;
          }
          if (this.time < 10) {
            this.time = "0" + this.time;
          }
          3;
          if (this.time < 1) {
            console.log(this.time, "this.time");
            this.tiemBoole = false;
            clearInterval(this.timer);
          }
        }, 1000);
      }
    },
    headClick(row) {
      this.file_name = "文件名称-" + row.file_name;
      let params = {
        id: row.id,
      };
      queryScreeningCriteria(params).then((res) => {
        if (res.code == 1) {
          this.dialogInformation = true;
          this.file_generate_time = res.data.date_filter;
          this.plate_name = res.data.content;
        }
      });
    },
  },
};
</script>



