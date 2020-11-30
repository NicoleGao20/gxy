<template>
<!-- 受众人群 -->
  <div class="page-container-gap">
    <el-form
      label-position="right"
      label-width="120px"
      style="background: #fff; padding: 15px 15px 0; margin-bottom: 15px"
    >
      <el-row>
        <el-col :span="8">
          <el-form-item label="受众名称">
            <el-input
              v-model="searchForm.group_name"
              maxlength="50"
              clearable
              placeholder="请输入受众名称"
              @keyup.enter.native="filterData"
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="受众编号">
            <el-input
              v-model="searchForm.group_no"
              clearable
              placeholder="请输入受众编号"
              @keyup.enter.native="filterData"
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="受众目的">
            <el-select
              v-model="searchForm.group_purpose"
              style="width: 100%"
              clearable
              placeholder="请选择"
            >
              <el-option
                v-for="(labelType, index) in group_purpose_list"
                :key="index"
                :label="labelType.label"
                :value="labelType.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="受众属性">
            <el-select
              v-model="searchForm.group_attribute"
              style="width: 100%"
              clearable
              placeholder="请选择"
            >
              <el-option
                v-for="(labelType, index) in group_type_list"
                :key="index"
                :label="labelType.label"
                :value="labelType.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="受众状态">
            <el-select
              v-model="searchForm.status"
              style="width: 100%"
              clearable
              placeholder="请选择"
            >
              <el-option
                v-for="(labelType, index) in group_status_list"
                :key="index"
                :label="labelType.label"
                :value="labelType.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col v-show="isMoreinquiries" :span="8">
          <el-form-item label="创建人">
            <el-input
              v-model="searchForm.create_user"
              clearable
              placeholder="请输入创建人"
              @keyup.enter.native="filterData"
            />
          </el-form-item>
        </el-col>
        <el-col v-show="isMoreinquiries" :span="16" style="height: 51px">
          <el-form-item label="创建时间">
            <el-date-picker
              v-model="create_time"
              type="daterange"
              style="width: 100%"
              value-format="yyyy-MM-dd"
              range-separator="-"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            />
          </el-form-item>
        </el-col>
        <el-col v-show="isMoreinquiries" :span="8">
          <el-form-item label="创建方式">
            <el-select
              v-model="searchForm.create_type"
              style="width: 100%"
              clearable
              placeholder="请选择"
            >
              <el-option
                v-for="(labelType, index) in create_type_list"
                :key="index"
                :label="labelType.label"
                :value="labelType.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item style="white-space: nowrap">
            <el-button type="primary" @click="filterData">查询</el-button>
            <el-button
              v-show="!isMoreinquiries"
              @click="isMoreinquiries = !isMoreinquiries"
              >更多筛选</el-button
            >
            <el-button
              v-show="isMoreinquiries"
              type="primary"
              class="search-collapse"
              @click="isMoreinquiries = !isMoreinquiries"
              >收起<i class="el-icon-d-arrow-right" />
            </el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <main class="tableMainContent">
      <el-button type="primary" @click="dialogVisible = true">新增</el-button>
      <el-table
        v-loading="loading"
        stripe
        :data="tableData"
        :header-cell-style="{ background: '#F5F7FA', color: '#333333' }"
        max-height="550"
        border
        style="margin: 15px 0"
      >
        <el-table-column fixed prop="group_no" label="受众编号" width="120" />
        <el-table-column prop="group_name" label="受众名称" width="160">
          <template slot-scope="scope">
            <el-popover trigger="hover" placement="bottom">
              <p style="max-width: 160px">{{ scope.row.group_name }}</p>
              <div slot="reference" class="marketing-list-page-name-wrapper">
                {{ scope.row.group_name }}
              </div>
            </el-popover>
          </template>
        </el-table-column>
         <el-table-column prop="group_desc" label="受众说明" width="220">
          <template slot-scope="scope">
            <el-popover trigger="hover" placement="bottom">
              <p style="textalign: center; max-width: 200px">
                {{ scope.row.group_desc }}
              </p>
              <div slot="reference" class="marketing-list-page-name-wrapper">
                {{ scope.row.group_desc }}
              </div>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column prop="create_type" label="创建方式" width="140">
          <template slot-scope="scope">
            {{ getLabelByValue(scope.row.create_type, create_type_list) }}
          </template>
        </el-table-column>
        <el-table-column prop="group_purpose" label="受众目的" width="120">
          <template slot-scope="scope">
            {{ getLabelByValue(scope.row.group_purpose, group_purpose_list) }}
          </template>
        </el-table-column>
        <el-table-column prop="group_attribute" label="受众属性" width="120">
          <template slot-scope="scope">
            {{ getLabelByValue(scope.row.group_attribute, group_type_list) }}
          </template>
        </el-table-column>
        <el-table-column prop="status" label="受众状态" width="100">
          <template slot-scope="scope">
            <el-tag
          :type="scope.row.status === 'started' ? 'success' : 'warning'"
          disable-transitions>
          <!-- success/info/warning/danger -->
            {{ getLabelByValue(scope.row.status, group_status_list) }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column prop="data_update_status" label="计算状态" width="100">
          <template slot-scope="scope">
            <el-tag
          :type="scope.row.data_update_status === 'update_success' ? 'success' : 'warning'"
          disable-transitions>
            {{ getLabelByValue(scope.row.data_update_status, group_data_update_status_list) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="update_frequency" label="更新频次" width="80">
          <template slot-scope="scope">
            <el-tag
          :type="scope.row.tag === 'realtime' ? 'success' : 'info'"
          disable-transitions>
            {{ getLabelByValue(scope.row.update_frequency, updateFrequencys) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="data_update_time"
          label="数据更新时间"
          width="140"
        >
          <template slot-scope="scope">
            {{ scope.row.data_update_time ? scope.row.data_update_time : "-" }}
          </template>
        </el-table-column>
        <el-table-column prop="create_user" label="创建人" width="120">
          <template slot-scope="scope">
            <human-info :num="scope.row.create_user_name" :department="scope.row.create_user_phone">
              {{scope.row.create_user}}</human-info>
          </template>
        </el-table-column>
        <el-table-column prop="create_time" label="创建时间" width="140"/>
        <el-table-column prop="update_user" label="修改人" width="120">
          <template slot-scope="scope">
            <human-info :num="scope.row.up_user_name" :department="scope.row.create_user_phone">
              {{scope.row.update_user}}</human-info>
          </template>
        </el-table-column>
        <el-table-column
          prop="last_modify_time"
          label="修改时间"
          width="140"
        />
        <el-table-column fixed="right" label="操作" width="240">
          <template slot-scope="scope">
            <!-- scope.row.status started stopped -->
            <el-button type="text" size="small" @click="handleClick(scope.row)"
              >查看</el-button
            >
            <el-button
              v-if="
                scope.row.status === 'stopped' &&
                userId===scope.row.update_user_code &&
                !scope.row.is_marketing_dependence
              "
              type="text"
              size="small"
              @click="edit(scope.row)"
              >编辑</el-button
            >
            <el-button
              class="deleteFontColor"
              v-if="
                scope.row.status === 'stopped' &&
                 userId===scope.row.update_user_code &&
                !scope.row.is_marketing_dependence
              "
              type="text"
              @click="deleteGroup(scope.row)"
              >删除</el-button
            >
            <el-button
              class="updateoffStatus"
              v-if="scope.row.status === 'started' &&  userId===scope.row.update_user_code"
              type="text"
              size="small"
              @click="setStatus(scope.row)"
              >停用</el-button
            >
            <el-button
              class="updateonStatus"
              v-if="scope.row.status === 'stopped' &&  userId===scope.row.update_user_code"
              type="text"
              size="small"
              @click="setStatus(scope.row)"
              >启用</el-button
            >
            <el-button
              v-if="
                scope.row.status === 'started' ||
                scope.row.status === 'stopping'
              "
              type="text"
              size="small"
              @click="drawerTo(scope.row)"
              >查看画像</el-button
            >
            <!-- <el-button v-if="getToken('brandCode') !== ('TS' || 'FS')" type="text" size="small">导出人群</el-button> -->
            <el-button
              v-if="scope.row.status === 'started' &&  userId===scope.row.update_user_code"
              type="text"
              size="small"
              @click="dialogCrowd = true"
              >人群推送</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <base-pagination
        v-model="params.current"
        :page-size.sync="params.page_size"
        :total="total"
        @loadData="getGroupList"
      />
      <el-dialog
        :visible.sync="dialogVisible"
        :before-close="handleClose"
        title="创建会员受众"
        width="700px"
      >
        <section class="linkArea">
          <router-link to="groupList/normalGroup" class="grid-content bg-purple-light">
            <div class="icon">
              <img src="/static/images/normal.png" alt="" srcset="" />
            </div>
            <div class="info">
              <p>普通受众</p>
              <span>提示：你可通过选择标签，自由组合创建会员受众</span>
            </div>
          </router-link>
        </section>
        <section class="linkArea">
          <router-link to="advancedGroup" class="grid-content bg-purple-light">
            <div class="icon">
              <img src="/static/images/advanced.png" alt="" srcset="" />
            </div>
            <div class="info">
              <p>高级受众</p>
              <span
                >提示：你可通过选择标签和已有会员受众，自由组合创建新会员受众</span
              >
            </div>
          </router-link>
        </section>
        <section class="linkArea">
          <router-link to="groupList/importGroup" class="grid-content bg-purple-light">
            <div class="icon">
              <img src="/static/images/import.png" alt="" srcset="" />
            </div>
            <div class="info">
              <p>导入受众</p>
              <span>提示：你可通过上传文件导入会员创建受众</span>
            </div>
          </router-link>
        </section>
      </el-dialog>
      <!-- <el-drawer :visible.sync="drawer" :with-header="false" size="90%">
        <div slot="title" class="drawerTitle">群像分析</div>
        <crm-group-portraint
          v-if="drawer"
          :label-id="drawerInfo.labelId"
          :create-type="drawerInfo.createType"
          :group-data-table="drawerInfo.groupDataTable"
          link_resource="group"
        />
      </el-drawer> -->
      <el-drawer :visible.sync="drawer" :with-header="false" size="90%">
        <div slot="title" class="drawerTitle">群像分析</div>
        <user-portrait/>
      </el-drawer>
      <el-dialog :visible.sync="showDialogVisible" title="提示" width="27%">
        <div class="error-info">
          <div class="error-tip">
            <i class="el-icon-error" />
            <div class="tip">
              <p>停用失败</p>
              <span
                >原因：{{
                  errMsg[0]
                }}
                ，无法停用，请停止相关活动后再操作。</span
              >
            </div>
          </div>
          <div v-if="errorContent" class="error-content">
            <div class="scroll">
              <p v-for="(msg, index) in errMsg" :key="index">
                {{ index + 1 }} . {{ msg }}
              </p>
            </div>
            <el-checkbox
              v-model="forceVal"
              label="勾选后，此受众无法被新的高级受众/营销活动使用，执行中的不会被影响"
              name="type"
            />
          </div>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button v-if="!errorContent" @click="errorContent = true"
            >更 多</el-button
          >
          <el-button type="primary" @click="ForceSet">确 定</el-button>
        </span>
      </el-dialog>
    </main>
    <el-dialog :visible.sync="dialogCrowd" title="创建推送功能" width="700px">
      <ul class="page-tool">
          <li  v-for="item in dateAddedList" :key="item.id" @click="crowd(item,'受众')">
            <div class="page-img">
              <img :src="item.icon_url" alt />
            </div>
            <div class="page-signal">
              <span>{{ item.integ_channel_name }}</span>
              <span>{{ item.chl_desc }}</span>
            </div>
          </li>
      </ul>
    </el-dialog>
  </div>
</template>
<script>
// import { getToken } from '@/utils/auth'
import crmGroupPortraint from "@/views/platformitem/markting/dataAnalysis/crmGroupPortrait/index";
import userPortrait from "@/views/platformitem/insight/user/Userface.vue";
import cacheCondition from "@/utils/cacheCondition";
import Cookies from 'js-cookie'
import {
  getGroupListByCon,
  setStatus,
  deleteGroup,
  setStopping,
  getMemberInfo,
  getGroupDetails,
  getOrgCodeLongStatus,
} from "@/api/markting/vinpinsightGrouplist";
// import { checkPermission } from '@/utils/permission'
import { getType } from "@/api/security/visit";
import '../newGroup/scss/components.scss'
export default {
  name: "GroupList",
  components: {
    crmGroupPortraint,
    userPortrait
  },
  mixins: [cacheCondition],
  data() {
    return {
      drawer: false,
      searchForm: {
        group_name: "",
        group_no: "",
        group_purpose: "",
        group_attribute: "",
        status: "",
        create_region: "",
        create_user: "",
        start_time: "", // start_time end_time
        end_time: "",
        create_type: "",
      },
      drawerInfo: {
        labelId: "",
        createType: "",
        groupDataTable: "",
      },
      create_time: [],
      forceVal: false,
      forceId: "",
      params: {
        current: 1,
        page_size: 10,
      },
      total: 0,
      loading: false,
      group_purpose_list: [
        { label: "常规营销", value: "regular_marketing" },
        { label: "休眠唤醒", value: "sleep_wake " },
        { label: "流失召回", value: "loss_recall" },
        { label: "店铺引流", value: "shop_drainage" },
        { label: "活动宣传", value: "event_promotion" },
        { label: "会员关怀", value: "member_care" },
        { label: "系统通知", value: "system_notification" },
      ],
      group_type_list: [
        { label: "静态受众", value: "static" },
        { label: "动态受众", value: "dynamic" },
      ],
      group_status_list: [
        { label: "已启用", value: "started" },
        { label: "已停用", value: "stopped" },
        { label: "停用中", value: "stopping" },
      ],
      group_data_update_status_list: [
        { label: "计算中", value: "updating" },
        { label: "计算成功", value: "update_success" },
        { label: "计算失败", value: "update_failure" },
      ],
      create_type_list: [
        { label: "导入受众", value: "file_import" },
        { label: "普通受众", value: "normal" },
        { label: "高级受众", value: "advanced" },
      ],
      is_share_list: [
        { label: "是", value: "yes" },
        { label: "否", value: "no" },
      ],
      updateFrequencys: [
        { label: "实时", value: "realtime" },
        { label: "每天", value: "t_1" },
      ],
      actionRouteMap: {
        normal_add: "normalGroup",
        advanced_add: "advancedGroup",
        file_import_add: "importGroup",

        normal_edit: "normalGroup",
        advanced_edit: "advancedGroup",
        file_import_edit: "editImportGroup",
      },
      isMoreinquiries: false,
      tableData: [],
      dialogVisible: false,
      showDialogVisible: false,
      errMsg: "上海-休眠唤醒-送券活动在使用",
      errorContent: false,
      dialogCrowd: false, // 人群推送状态
      dateAddedList: [], // 人群推送
      userId: "",
      userPhone:'',
      userName:'',
    };
  },
  watch: {
    create_time(val) {
      if (val) {
        this.searchForm.start_time = val[0];
        this.searchForm.end_time = val[1];
      } else {
        this.searchForm.start_time = "";
        this.searchForm.end_time = "";
      }
    },
  },
  mounted() {
    this.multitude();
    this.initData();
    Object.keys(this.searchForm).forEach((key) => {
      this.searchForm[key] = "";
    });
    this.userId = Cookies.get("userId");
    this.userName=Cookies.get("userName");
    this.userPhone=Cookies.get("phone")
  },
  methods: {
    initData() {
      this.getGroupList();
    },
    filterData() {
      this.params.current = 1;
      this.getGroupList();
    },
    // 人群推送
    multitude() {
      const params = {};
      getType(params).then((res) => {
        if (res) {
          this.dateAddedList = res.data[3].list;
        }
      });
    },
    getGroupList() {
      var params = {
        current: this.params.current,
        page_size: this.params.page_size,
        brand_code:Cookies.get('brandCode'),
        ...this.searchForm,
      };
      for (var attr in params) {
        if (!params[attr]) delete params[attr];
      }
      this.loading = true;
      getGroupListByCon(params).then((res) => {
        this.loading = false;
        if (res.data) {
          this.tableData = res.data.list;
          this.tableData.map(item=>{
            item.create_user_name=this.userName;
            item.create_user_phone=this.userPhone
          })
          console.log(this.tableData, "this.tableData");

          this.params.current = Number(res.data.pagination.current) || 1;
          this.params.page_size = res.data.pagination.page_size;
          this.total = res.data.pagination.total || 0;

          // 如果不是第一页，执行完获取接口发现返回的长度不存在，就向前推进一页，再次尝试调用接口
          if (this.params.current > 1) {
            if (!res.data.list || !res.data.list.length) {
              this.params.current -= 1;
              this.getGroupList();
            }
          }
        }
      });
    },
    //人群推送
    crowd(item,type){
      console.log(type,'type')
      this.$router.push({
        name: 'newJingdongShufang',
        query: {
          type,
          integ_channel_name: item.integ_channel_name,
        }
      })
    },
    setStatus(row) {
      this.$confirm(
        `确定${row.status === "started" ? "停用" : "启用"}该受众？`,
        "确认提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).then(() => {
        if (row.status !== "started") {
          if (row.create_type !== "file_import") {
            getGroupDetails({ id: row.id, group_type: row.create_type }).then(
              (res) => {
                if (res.data.slave_info) {
                  this.setFunc(row);
                } else {
                  this.$alert(
                    `<p style="margin-top:10px;">${
                      row.status === "started" ? "停用" : "启用"
                    }失败</p><small style="margin-top:10px;">此受众内没有设置筛选器规则，请设置后再操作！</small>`,
                    "提示",
                    {
                      dangerouslyUseHTMLString: true,
                      type: "error",
                    }
                  );
                }
              }
            );
          } else {
            getMemberInfo({
              id: row.id,
              group_data_table: row.group_data_table,
            }).then((res) => {
              if (res.data.total) {
                this.setFunc(row);
              } else {
                this.$alert(
                  `<p style="margin-top:10px;">启用失败</p><small style="margin-top:10px;">此受众内没有导入会员数据，请导入相关数据后再操作！</small>`,
                  "提示",
                  {
                    dangerouslyUseHTMLString: true,
                    type: "error",
                  }
                );
              }
            });
          }
        } else {
          this.setFunc(row);
        }
      });
    },
    setFunc(row) {
      setStatus({
        id: row.id,
        stop_or_start: row.status === "started" ? "stop" : "start",
        update_frequency: row.update_frequency,
        group_attribute: row.group_attribute,
      })
        .then((res) => {
          this.getGroupList();
          this.$message.success(
            row.status === "started" ? "停用成功" : "启用成功"
          );
          // this.$alert(`<p style="margin-top:10px;">${row.status === 'started' ? '停用' : '启用'}成功</p>
          //     <small style="margin-top:10px;">${row.status === 'started' ? '受众数据将不再更新且不可以在高级受众或营销活动中使用' : '受众数据将更新，可以在受众或营销活动中'}！</small>`, '提示', {
          //   dangerouslyUseHTMLString: true,
          //   type: 'success'
          // })
        })
        .catch((fail) => {
          if (
            fail.response.data.bizCode === "50136" ||
            fail.response.data.bizCode === 50136
          ) {
            // 50136 受众正在被使用
            this.forceId = row.id;
            if (fail.response.data.bizMsg) {
              this.errMsg = fail.response.data.bizMsg.splice(";");
              this.errMsg.pop();
            }
            this.showDialogVisible = true;
          }
        });
    },
    ForceSet() {
      if (this.forceVal) {
        setStopping({ id: this.forceId }).then((res) => {
          this.getGroupList();
          this.showDialogVisible = false;
        });
      } else {
        this.forceId = "";
        this.showDialogVisible = false;
      }
    },
    deleteGroup(row) {
      this.$confirm("是否确定删除？", "确认提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        deleteGroup({ id: row.id, create_type: row.create_type }).then(
          (res) => {
            this.$message.success("删除成功");
            this.getGroupList();
          }
        );
      });
    },
    handleClick(row, type) {
      this.$router.push({
        name: this.actionRouteMap[row.create_type + "_add"], // advancedGroup
        query: {
          id: row.id,
          group_type: row.create_type,
          group_data_table: row.group_data_table,
          view: true,
          type,
        },
      });
    },
    edit(row) {
      getOrgCodeLongStatus({ id: row.id }).then((res) => {
        if (!res.data.stauts) {
          this.$router.push({
            name: this.actionRouteMap[row.create_type + "_edit"],
            query: {
              id: row.id,
              group_type: row.create_type,
              group_data_table: row.group_data_table,
            },
          });
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    handleClose() {
      this.dialogVisible = false;
    },
    drawerTo(row) {
      this.drawerInfo.labelId = row.id;
      this.drawerInfo.createType = row.create_type;
      this.drawerInfo.groupDataTable = row.group_data_table;
      this.drawer = true;
    },
    getLabelByValue(value, list, opts) {
      if (!list || list.length === 0) return "-";
      opts = opts || { valueKey: "value", labelKey: "label" };
      for (var i = 0, len = list.length; i < len; i++) {
        if (list[i][opts.valueKey] === value) {
          return list[i][opts.labelKey];
        }
      }
      return "-";
    },
  },
};
</script>
<style lang="less" scoped>
/deep/ .el-drawer__body {
  overflow: auto;
}
/deep/ .el-drawer__header {
  margin-bottom: 0;
}
.vipinsight-taglist-page {
  width: 100%;
  height: 100%;
  background: #f3f3f3;
  header,
  main {
    width: 100%;
    height: auto;
    box-sizing: border-box;
    display: block;
    background: #ffffff;
  }
  header {
    margin-bottom: 10px;
    overflow: hidden;
  }
  /deep/ .el-dialog__body {
    padding: 20px;
  }
  /deep/ .el-form-item__label {
    color: #666666;
    font-size: 14px;
    font-weight: normal;
    white-space: nowrap;
  }
  .search-more,
  .search {
    border: 1px solid rgba(67, 90, 130, 1);
    background: none;
    color: #435a82;
    &:hover {
      color: #ffffff;
      background-color: #435a82;
      border-color: #435a82;
    }
  }
  .search {
    color: #ffffff;
    background-color: #435a82;
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
}
.linkArea {
  width: 100%;
  display: flex;
  justify-content: center;
  border: 1px solid rgba(236, 238, 242, 1);
  margin-top: 15px;
  cursor: pointer;
  box-sizing: border-box;
  &:nth-of-type(1) {
    margin-top: 0px;
  }
  > a {
    width: 60%;
  }
  &:hover {
    border: 1px solid rgba(123, 139, 167, 1);
  }
}
.grid-content {
  display: flex;
  align-items: center;
  .icon {
    width: 140px;
    box-sizing: border-box;
    text-align: center;
    img {
      width: 100px;
    }
  }
  .info {
    flex: 1;
    position: relative;
    &::before {
      position: absolute;
      content: "";
      left: -20px;
      top: 25%;
      height: 50%;
      width: 1px;
      transform: scaleY(0.5);
      background: rgba(123, 139, 167, 1);
    }
    > p {
      font-size: 18px;
      color: #000000;
      line-height: 1.8;
    }
    > span {
      font-size: 14px;
      line-height: 1.8;
      color: #666666;
    }
  }
}
.error-info {
  .error-tip {
    display: flex;
    i {
      margin-right: 15px;
      font-size: 25px;
      color: #cf614f;
    }
    .tip {
      p {
        color: #435a82;
        font-weight: 500;
        line-height: 1.6;
      }
      span {
        color: #888888;
        line-height: 1.6;
      }
    }
  }
  .error-content {
    margin: 10px 0;
    .scroll {
      max-height: 60px;
      font-size: 14px;
      line-height: 1.6;
      overflow: auto;
      padding: 10px;
      background: #f9fafb;
    }
    /deep/ .el-checkbox {
      margin-top: 15px;
      display: block;
    }
    /deep/ .el-checkbox__label {
      vertical-align: top;
      display: inline-block;
      white-space: normal;
      word-break: break-all;
    }
  }
}
.marketing-list-page-name-wrapper {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-height: 50px;
}
.el-button--primary,
.el-button--default {
  display: inline-block;
  width: 100px;
}
</style>
