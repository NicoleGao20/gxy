<template>
  <div class="container task-scheduler-list">
    <div class="server-info">
      <div class="text-red">
        {{ $t("taskSchedulerList.dataSource") }}： {{ serverStatus }}
      </div>
      <div class="text-blue">{{ statistics }}</div>
    </div>
    <el-data-table
      ref="dataTable"
      :url="url"
      :columns="columns"
      :header-buttons="headerButtons"
      :extra-buttons="[]"
      :operation-attrs="{ minWidth: '150px', align: 'center', fixed: 'right' }"
      :has-new="false"
      :has-edit="false"
      :has-delete="false"
      :has-operation="false"
      :pagination-size="pageSize"
      :search-form="searchForm"
      :before-search="beforeSearch"
      data-path="data.ljobList"
      total-path="data.pagination.total"
      @update="handleTabeDataUpdate"
    />
    <el-dialog
      :append-to-body="true"
      :visible.sync="customFormVisible"
      :top="'20vh'"
      :title="$t('taskSchedulerList.sendInstantRunCustomRequest')"
      width="600px"
    >
      <el-form ref="customForm" :model="customForm" label-width="130px">
        <el-form-item :label="$t('taskSchedulerList.ip')">{{
          customForm.ip
        }}</el-form-item>
        <el-form-item :label="$t('taskSchedulerList.projectName')">{{
          customForm.projectName
        }}</el-form-item>
        <el-form-item :label="$t('taskSchedulerList.jobName')">{{
          customForm.jobName
        }}</el-form-item>
        <el-form-item
          :label="$t('taskSchedulerList.customParams')"
          prop="customParams"
        >
          <el-input v-model="customForm.customParams" style="width: 400px" />
        </el-form-item>
        <el-form-item style="display: flex; justify-content: flex-end">
          <el-button plain @click="customFormVisible = false">{{
            $t("form.cancel")
          }}</el-button>
          <el-button
            type="primary"
            @click="handleSendInstantRunCustomRequest"
            >{{ $t("taskSchedulerList.startNow") }}</el-button
          >
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
import * as api from "@/api/taskScheduler";
export default {
  name: "TaskScheduler",
  components: {},
  data() {
    const headerButtons = [
      {
        type: "button",
        key: "startAll",
        text: this.$t("taskSchedulerList.oneKeyStart"),
        atClick: () =>
          this.handleTaskOperation(
            "startAllInstantTasks",
            this.$t("taskSchedulerList.oneKeyStart")
          ),
      },
      {
        type: "button",
        key: "startBlue",
        text: this.$t("taskSchedulerList.oneKeyStart") + this.$t("common.blue"),
        atClick: () =>
          this.handleTaskOperation(
            "startBlueInstantTasks",
            this.$t("taskSchedulerList.oneKeyStart") + this.$t("common.blue")
          ),
      },
      {
        type: "button",
        key: "startGreen",
        text:
          this.$t("taskSchedulerList.oneKeyStart") + this.$t("common.green"),
        atClick: () =>
          this.handleTaskOperation(
            "startGreenInstantTasks",
            this.$t("taskSchedulerList.oneKeyStart") + this.$t("common.green")
          ),
      },
      {
        type: "button",
        key: "closeBlue",
        text: this.$t("taskSchedulerList.oneKeyClose") + this.$t("common.blue"),
        atClick: () =>
          this.handleTaskOperation(
            "stopBlueInstantTasks",
            this.$t("taskSchedulerList.oneKeyClose") + this.$t("common.blue")
          ),
      },
      {
        type: "button",
        key: "closeGreen",
        text:
          this.$t("taskSchedulerList.oneKeyClose") + this.$t("common.green"),
        atClick: () =>
          this.handleTaskOperation(
            "stopGreenInstantTasks",
            this.$t("taskSchedulerList.oneKeyClose") + this.$t("common.green")
          ),
      },
    ];
    // const extraButtons = [
    //   { type: 'button', key: 'closeTask', text: '关闭定时任务', atClick: this.handleLayout },
    //   { type: 'button', key: 'sendInstantRunRequest', text: '发送即时执行请求', atClick: this.handleLayout }
    // ]
    return {
      url: "/system/ljob/online/ljobs",
      columns: [
        { prop: "ip", label: this.$t("taskSchedulerList.ip"), align: "center" },
        {
          prop: "projectName",
          label: this.$t("taskSchedulerList.projectName"),
          align: "center",
        },
        {
          prop: "jobName",
          label: this.$t("taskSchedulerList.jobName"),
          align: "center",
        },
        {
          prop: "distributed",
          label: this.$t("taskSchedulerList.distributed"),
          align: "center",
          formatter: (row, column, cellValue) =>
            cellValue ? this.$t("common.true") : this.$t("common.false"),
        },
        {
          prop: "jobCronExpression",
          label: this.$t("taskSchedulerList.jobCronExpression"),
          align: "center",
        },
        {
          prop: "sendTimeShow",
          label: this.$t("taskSchedulerList.sendTimeShow"),
          align: "center",
        },
        {
          prop: "taskSheduler",
          label: this.$t("taskSchedulerList.taskSheduler"),
          align: "center",
          formatter: (row) => this.handleTaskSheduler(row),
        },
        {
          prop: "sendInstantRunRequest",
          label: this.$t("taskSchedulerList.sendInstantRunRequest"),
          align: "center",
          formatter: (row) => (
            <div>
              {row.supportInstantRunReq && (
                <el-button
                  size="mini"
                  onClick={() =>
                    this.handleSendInstantRunRequest({
                      ljobKey: row.projectName + "_" + row.jobName,
                      ip: row.ip,
                    })
                  }
                >
                  {this.$t("common.send")}
                </el-button>
              )}
              {row.supportCustomRunReq && (
                <el-button
                  size="mini"
                  onClick={() => this.handleShowCustomForm(row)}
                >
                  {this.$t("common.custom")}
                </el-button>
              )}
            </div>
          ),
        },
        {
          prop: "ljobRunHistorys",
          label: this.$t("taskSchedulerList.ljobRunHistorys"),
          align: "center",
          formatter: (row) => (
            <el-popover placement="right" trigger="hover">
              <div class="table-wrapper">
                <table class="table">
                  <thead>
                    <th>{this.$t("taskSchedulerList.runStartTime")}</th>
                    <th>{this.$t("taskSchedulerList.runEndTime")}</th>
                  </thead>
                  <tbody>
                    {row.ljobRunHistorys.map((item) => (
                      <tr class="table-row">
                        <td>{item.startTime}</td>
                        <td>{item.endTime}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <el-link slot="reference" type="primary">
                {this.$t("common.view")}
              </el-link>
            </el-popover>
          ),
        },
      ],
      pageSize: 10,
      serverStatus: "",
      statistics: "",
      headerButtons: headerButtons, // checkPermission('taskscheduler', headerButtons),
      searchForm: [
        {
          type: "input",
          id: "projectName",
          label: this.$t("taskSchedulerList.projectName"),
          el: { placeholder: `${this.$t("taskSchedulerList.projectName")}` },
        },
        {
          type: "input",
          id: "jobName",
          label: this.$t("taskSchedulerList.jobName"),
          el: { placeholder: `${this.$t("taskSchedulerList.jobName")}` },
        },
      ],
      beforeSearch: () => {
        this.url = "/system/ljob/online/fuzzy_ljobs";
        return Promise.resolve();
      },
      customFormVisible: false,
      customForm: {
        customParams: "",
      },
    };
  },
  created() {
    // this.$store.dispatch('InserMenuList', {
    //   path: 'taskscheduler',
    //   buttonList: [
    //     { name: '一键启动', url: 'startAll' },
    //     { name: '一键启动蓝', url: 'startBlue' },
    //     { name: '一键启动绿', url: 'startGreen' },
    //     { name: '一键关闭蓝', url: 'closeBlue' },
    //     { name: '一键关闭绿', url: 'closeGreen' }
    //   ]
    // })
  },
  methods: {
    handleTabeDataUpdate(data, res) {
      console.log("数据更新");
      console.log(res.data.serverStatus);
      this.serverStatus = res && res.data && res.data.serverStatus;
      this.statistics = res && res.data && res.data.statistics;
    },
    handleTask(row) {
      console.log("row", row);
    },
    handleRunHistory(row) {
      console.log("row", row);
    },
    handleTaskSheduler(row) {
      const isStart = row.startup;
      const buttonType = isStart ? "" : "success";
      const buttonText =
        isStart && row.supportCloseJob
          ? this.$t("taskSchedulerList.close")
          : this.$t("taskSchedulerList.start");
      // const buttonAction = isStart ? 'handleStartTask' : 'handleCloseTask'
      return (
        <div>
          {row.startup ? (
            <div style="color: #67C23A">
              {this.$t("taskSchedulerList.running")}
            </div>
          ) : (
            <div style="color: #F56C6C">
              {this.$t("taskSchedulerList.closed")}
            </div>
          )}
          <el-button
            type={buttonType}
            size="mini"
            plain
            onClick={() => this.handleUpdateInstantTaskStatus(row)}
          >
            {buttonText}
          </el-button>
        </div>
      );
    },
    handleShowCustomForm(row) {
      this.customForm = { ...row, customParams: "" };
      this.customFormVisible = true;
    },
    handleResult(response, operation, callback) {
      if (response.code === 1) {
        this.$message({
          message: `${operation}成功`,
          type: "success",
        });
      } else {
        this.$message({
          message: (response && response.errorCode) || `${operation}错误`,
          type: "error",
        });
      }
      this.url = this.url;
      if (callback) callback();
    },
    async handleTaskOperation(key, label) {
      const response = await api[key]();
      this.handleResult(response, label);
      this.$refs.dataTable.getList();
      return Promise.resolve();
    },
    async handleSendInstantRunRequest(params) {
      const response = await api.sendInstantRunRequest(params);
      this.handleResult(
        response,
        this.$t("taskSchedulerList.sendInstantTaskRunRequest")
      );
      this.$refs.dataTable.getList();
    },
    async handleSendInstantRunCustomRequest() {
      const response = await api.sendInstantRunCustomRequest({
        ljobKey: this.customForm.projectName + "_" + this.customForm.jobName,
        ip: this.customForm.ip,
        customParams: this.customForm.customParams,
      });
      this.handleResult(
        response,
        this.$t("taskSchedulerList.sendInstantTaskRunCustomRequest"),
        () => {
          this.customFormVisible = false;
        }
      );
      this.$refs.dataTable.getList();
    },
    async handleUpdateInstantTaskStatus(row) {
      if (!row.supportCloseJob && !row.startup) {
        // 关闭
        return;
      }
      const response = await api.updateInstantTaskStatus({
        ljobKey: row.projectName + "_" + row.jobName,
        ip: row.ip,
        status: row.startup ? 0 : 1,
      });
      this.handleResult(
        response,
        row.startup
          ? this.$t("taskSchedulerList.close")
          : this.$t("taskSchedulerList.start")
      );
      this.$refs.dataTable.getList();
    },
  },
};
</script>
<style lang="less" scoped>
.container {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  padding: 20px 15px;
}
.server-info {
  position: absolute;
  right: 15px;
  top: 20px;
  // z-index: -1;
  text-align: right;
  & > div {
    padding: 5px 0 0;
  }
}
.text-red {
  color: #f56c6c;
}
.text-blue {
  color: #409eff;
}
.table-wrapper {
  padding: 10px;
}
.table {
  width: 100%;
}
.table th {
  padding: 5px 20px 5px 0;
}
.table-row td {
  padding: 5px 20px 5px 0;
  border-top: 1px solid #eee;
  white-space: nowrap;
}
</style>
