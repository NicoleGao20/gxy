<template>
  <div class="page-container-gap">
    <el-form :inline="true" :model="form">
      <el-form-item label="模版名称">
        <el-input size="small" v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="短信类型">
        <el-select v-model="form.type">
          <el-option
            v-for="item in typeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="模版类型">
        <el-select v-model="form.smsType">
          <el-option
            v-for="item in smsTypeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="审核状态">
        <el-select v-model="form.status">
          <el-option
            v-for="item in statusOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getTableData(1, 10)"
          >查询</el-button
        >
      </el-form-item>
    </el-form>
    <main class="tableMainContent">
      <el-button type="primary" class="listAddBtnStyle" @click="$router.push({name:'newMMSTemplate'})">新增</el-button>
      <el-table
        :data="tableData"
        stripe
        border
        style="width: 100%"
        v-loading="tableLoading"
      >
        <el-table-column
          prop="template_name"
          label="模版名称"
          width="180"
          :resizable="false"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="template_content_cn"
          label="模版内容"
          width="360"
          :resizable="false"
          header-align="center"
        >
        </el-table-column>
        <el-table-column
          label="短信类型"
          width="150"
          :resizable="false"
          align="center"
        >
          <template slot-scope="scope">
            {{ templateType(scope.row.template_type) }}
          </template>
        </el-table-column>
        <el-table-column
          label="模版类型"
          width="150"
          :resizable="false"
          align="center"
        >
          <template slot-scope="scope">
            {{ scope.row.type == 0 ? "动态模版" : "静态模版" }}
          </template>
        </el-table-column>
        <el-table-column
          prop="address"
          label="审核状态"
          width="150"
          :resizable="false"
          align="center"
        >
          <template slot-scope="scope">
            <span :class="{ warn: scope.row.status == 2 }">{{
              templateStatus(scope.row.status)
            }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="remark"
          label="申请说明"
          width="300"
          :resizable="false"
          header-align="center"
        >
        </el-table-column>
        <el-table-column
          label="失败原因"
          width="200"
          :resizable="false"
          header-align="center"
        >
          <template slot-scope="scope">
            {{ scope.row.status == 2 ? scope.row.reason : "无审核备注" }}
          </template>
        </el-table-column>
        <el-table-column
          prop="create_time"
          label="创建时间"
          width="150"
          :resizable="false"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="create_user"
          label="创建人"
          width="150"
          :resizable="false"
          align="center"
        >
        </el-table-column>
        <el-table-column
          label="操作"
          width="150"
          fixed="right"
          :resizable="false"
          header-align="center"
        >
          <template slot-scope="scope">
            <el-button type="text" @click="jump('view', scope.row.id)"
              >查看</el-button
            >
            <el-button
              type="text"
              @click="jump('edit', scope.row.id)"
              v-if="scope.row.status == 2"
              >编辑</el-button
            >
            <el-button
              type="text"
              @click="deleteTemplate(scope.row.id, scope.row.template_code)"
              class="deleteFontColor"
              v-if="scope.row.status != 0"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        class="bottomPagination"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="pageNum"
        :page-sizes="[10, 20, 30, 40, 50]"
        :page-size="pageSize"
        background
        layout="prev, pager, next, sizes"
        :total="total"
      >
      </el-pagination>
    </main>
  </div>
</template>


<script>
import {
  queryTemplateByPage,
  deleteTemplate,
} from "@/api/markting/SMSFunction";
export default {
  mounted() {
    this.getTableData(1, 10);
  },
  data() {
    return {
      templateType(type) {
        if (type === 0) return "验证码";
        if (type === 1) return "短信通知";
        if (type === 2) return "推广短信";
        if (type === 3) return "国际/港澳台消息";
      },
      templateStatus(type) {
        if (type == 0) return "审核中";
        if (type == 1) return "通过审核";
        if (type == 2) return "未通过审核";
      },

      typeOptions: [
        {
          label: "不限",
          value: "",
        },
        {
          label: "验证码",
          value: 0,
        },
        {
          label: "短信通知",
          value: 1,
        },
        {
          label: "推广短信",
          value: 2,
        },
        {
          label: "国际/港澳台消息",
          value: 3,
        },
      ],
      smsTypeOptions: [
        {
          label: "不限",
          value: "",
        },
        {
          label: "动态模版",
          value: 0,
        },
        {
          label: "静态模版",
          value: 1,
        },
      ],
      statusOptions: [
        {
          label: "不限",
          value: "",
        },
        {
          label: "审核中",
          value: 0,
        },
        {
          label: "审核通过",
          value: 1,
        },
        {
          label: "审核失败",
          value: 2,
        },
      ],
      form: {
        name: "",
        type: "",
        smsType: "",
        status: "",
      },
      tableData: [],
      pageNum: 1,
      pageSize: 10,
      total: 0,
      tableLoading: false,
    };
  },
  methods: {
    getTableData(pageNum, pageSize) {
      this.tableLoading = true;
      let obj = {};
      if (this.form.name) obj.template_name = this.form.name;
      if (this.form.type) obj.template_type = this.form.type;
      if (this.form.status) obj.status = this.form.status;
      queryTemplateByPage({
        pageNum,
        pageSize,
        ...obj,
      }).then(({ data }) => {
        this.tableLoading = false;
        this.tableData = data.list;
        this.pageNum = data.pagination.current;
        this.pageSize = data.pagination.page_size;
        this.total = data.pagination.total_page;
      }).catch(()=>{
        this.tableLoading = false;
      })
    },
    handleSizeChange(val) {
      this.getTableData(1, val);
    },
    handleCurrentChange(val) {
      this.getTableData(val, this.pageSize);
    },
    jump(mode, id) {
      this.$router.push({ name: "newSMSTemplate", query: { mode, id } });
    },
    deleteTemplate(id, template_code) {
      this.$confirm("确认删除吗", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        deleteTemplate({
          id,
          template_code,
        }).then(() => {
          this.getTableData(this.pageNum, this.pageSize);
          this.$message({
            type: "success",
            message: "删除成功!",
          });
        });
      });
    },
  },
};
</script>


<style lang="scss" scoped>
.warn {
  color: red;
}
</style>