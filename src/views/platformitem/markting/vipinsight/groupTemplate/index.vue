<template>
  <div class="page-container-gap">
    <div class="search-wrap">
      <el-form label-position="right" label-width="80px">
        <el-row>
          <!-- 受众人群 -->
          <el-col :span="8">
            <el-form-item label="模版名称">
              <el-input
                v-model="searchForm.group_name"
                maxlength="49"
                clearable
                placeholder="请输入模版名称"
                @keyup.enter.native="filterData"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="模版编号">
              <el-input
                v-model="searchForm.group_template_no"
                clearable
                placeholder="请输入模版编号"
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
          <el-col v-show="isMoreinquiries" :span="16">
            <el-form-item label="创建时间">
              <el-date-picker
                v-model="create_time"
                style="width: 100%"
                type="daterange"
                value-format="yyyy-MM-dd"
                range-separator="-"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
              />
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
    </div>
    <main class="tableMainContent">
      <router-link :to="{ name: 'ruleTemplate' }"
        ><el-button type="primary" class="listAddBtnStyle"
          >新增</el-button
        ></router-link
      >
      <el-table
        v-loading="loading"
        stripe
        :data="tableData"
        :header-cell-style="{ background: '#F5F7FA', color: '#333333' }"
        max-height="550"
        border
        style="margin: 15px 0"
      >
        <el-table-column
          fixed
          prop="group_template_no"
          label="模版编号"
          width="120"
        />
        <el-table-column prop="group_name" label="模版名称" width="160">
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
        <el-table-column prop="group_purpose" label="受众目的" width="120">
          <template slot-scope="scope">
            {{ getLabelByValue(scope.row.group_purpose, group_purpose_list) }}
          </template>
        </el-table-column>
        <el-table-column prop="on_status" label="受众状态" width="100">
          <template slot-scope="scope">
            <el-tag
              :type="scope.row.on_status === 'Y' ? 'success' : 'warning'"
              disable-transitions
            >
              {{ getLabelByValue(scope.row.on_status, group_status_list) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="group_attribute" label="受众属性" width="120">
          <template slot-scope="scope">
            {{ getLabelByValue(scope.row.group_attribute, group_type_list) }}
          </template>
        </el-table-column>
        <!-- <el-table-column prop="update_frequency" label="更新频次" width="80">
          <template slot-scope="scope">
            {{ getLabelByValue(scope.row.update_frequency, updateFrequencys) }}
          </template>
        </el-table-column> -->
        <el-table-column prop="create_time" label="创建时间" width="140" />
        <!-- <el-table-column prop="create_region" label="创建区域" width="120"/> -->
        <el-table-column prop="create_user" label="创建人" width="120">
          <template slot-scope="scope">
            <human-info :num="scope.row.create_user_name" :department="scope.row.create_user_phone">{{
              scope.row.create_user
            }}</human-info>
          </template>
        </el-table-column>
        <el-table-column prop="create_type" label="创建方式" width="120">
          <template slot-scope="scope">
            {{ getLabelByValue(scope.row.create_type, create_type_list) }}
          </template>
        </el-table-column>
        <el-table-column prop="update_user" label="修改人" width="120">
          <template slot-scope="scope">
            <human-info :num="scope.row.update_user" :department="scope.row.create_user_phone">{{
              scope.row.update_user
            }}</human-info>
          </template>
        </el-table-column>
        <el-table-column
          prop="last_modify_time"
          label="最新修改时间"
          width="140"
        />
        <el-table-column fixed="right" label="操作" width="280">
          <template slot-scope="scope">
            <!-- 本部查看所有权限  非本部 查看使用 -->
            <el-button type="text" size="small" @click="handleClick(scope.row)"
              >查看模版</el-button
            >
            <el-button
              v-if="
                userId === scope.row.update_user_code &&
                scope.row.on_status !== 'Y'
              "
              type="text"
              size="small"
              @click="edit(scope.row)"
              >编辑</el-button
            >
            <el-button
              v-if="
                userId === scope.row.update_user_code &&
                scope.row.on_status !== 'Y'
              "
              type="text"
              class="deleteFontColor"
              @click="deleteGroup(scope.row)"
              >删除</el-button
            >
            <el-button
              v-if="
                userId === scope.row.update_user_code &&
                scope.row.on_status === 'N'
              "
              type="text"
              size="small"
              @click="changeStatus(scope.row)"
              >启用</el-button
            >
            <el-button
              v-if="
                userId === scope.row.update_user_code &&
                scope.row.on_status === 'Y'
              "
              type="text"
              size="small"
              @click="changeStatus(scope.row)"
              >停用</el-button
            >
            <!-- <el-button v-if="scope.row.status === 'stopped' && userId===scope.row.update_user_code" type="text" size="small" @click="dialogCrowd = true">人群推送</el-button> -->
            <el-button
              v-if="scope.row.on_status === 'Y'"
              type="text"
              size="small"
              @click="setStatus(scope.row)"
              >使用模板</el-button
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
    </main>
  </div>
</template>
<script>
import Cookies from "js-cookie";
import {
  getGroupTemplateList,
  deleteGroupTemplate,
  updateGroupTemplateOnStatus,
} from "@/api/markting/template";
import cacheCondition from "@/utils/cacheCondition";
import { checkPermission } from "@/utils/permission";
import humanInfo from '@/publicComponents/humanInfo'
export default {
  name: "GroupTemplate",
  // mixins: [cacheCondition],
  components: { humanInfo },
  data() {
    return {
      searchForm: {
        group_name: "",
        group_template_no: "",
        group_purpose: "",
        group_attribute: "",
        create_region: "",
        create_user: "",
        start_time: "", // start_time end_time
        end_time: "",
      },
      create_time: [],
      params: {
        current: 1,
        page_size: 10,
      },
      total: 0,
      loading: false,
      userId: "",
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
      group_status_list: [
        { label: "已启用", value: "Y" },
        { label: "已停用", value: "N" },
        { label: "停用中", value: "N" },
      ],
      isMoreinquiries: false,
      tableData: [],
      tableHeight: 550,
      dialogCrowd: false,
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
    Object.keys(this.searchForm).map(item=>{
      this.searchForm[item]=''
    })
    this.initData();
    this.userId = Cookies.get("userId");
  },
  methods: {
    checkPermission,
    initData() {
      this.getGroupList();
    },
    filterData() {
      this.params.current = 1;
      this.getGroupList();
    },
    getGroupList() {
      var params = {
        current: this.params.current,
        page_size: this.params.page_size,
        ...this.searchForm,
        brand_code: Cookies.get("brandCode"),
      };
      for (var attr in params) {
        if (!params[attr]) delete params[attr];
      }
      this.loading = true;
      getGroupTemplateList(params).then((res) => {
        this.loading = false;
        if (res.data) {
          this.tableData = res.data.list;
          this.tableData.map(item=>{
            item.create_user_name=Cookies.get("userName");
            item.create_user_phone=Cookies.get("phone")
          })
          this.params.current = res.data.pagination.current || 1;
          this.params.page_size = res.data.pagination.page_size;
          this.total = res.data.pagination.total || 0;
          if (this.params.current > 1) {
            if (!res.data.list || !res.data.list.length) {
              this.params.current -= 1;
              this.getGroupList();
            }
          }
        }
      });
    },
    deleteGroup(row) {
      this.$confirm("是否确定删除？", "确认提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        deleteGroupTemplate({ id: row.id }).then((res) => {
          this.$message.success("删除成功");
          this.getGroupList();
        });
      });
    },
    changeStatus(row) {
      // 启用停用
      this.$confirm(
        `确定${row.on_status === "Y" ? "停用" : "启用"}该受众模版？`,
        "确认提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).then(() => {
        updateGroupTemplateOnStatus({
          id: row.id,
          on_status: row.on_status === "Y" ? "N" : "Y",
          create_user_code: row.create_user_code,
          brand_code: Cookies.get("brandCode"),
        }).then((res) => {
          const str =
            row.on_status === "Y" ? "停用受众模版成功！" : "启用受众模版成功！";
          this.$message.success(str);
          this.getGroupList();
        });
      });
    },
    setStatus(row) {
      this.$router.push({
        name: "modelTemplate",
        query: {
          id: row.id,
          group_type: row.create_type,
        },
      });
    },
    handleClick(row) {
      this.$router.push({
        name: "ruleTemplateView",
        query: {
          id: row.id,
          group_type: row.create_type,
          view: true,
        },
      });
    },
    edit(row) {
      this.$router.push({
        name: "ruleTemplateEdit",
        query: {
          id: row.id,
          group_type: row.create_type,
        },
      });
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
<style lang="less">
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
      max-height: 40px;
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
  // width: 100px;
}
</style>
