<template>
  <div class="page-container-gap">
    <div class="searchWrap">
      <el-form label-position="right" label-width="80px">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="启用">
              <el-select
                v-model="searchForm.on_status"
                style="width: 100%"
                clearable
                placeholder="请选择"
              >
                <el-option
                  v-for="(labelAttribute, index) in brand"
                  :key="index"
                  :label="labelAttribute.label"
                  :value="labelAttribute.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="渠道">
              <el-select
                v-model="searchForm.integ_channel_name"
                style="width: 100%"
                clearable
                placeholder="请选择"
              >
                <el-option
                  v-for="(item, index) in channelAttributes"
                  :key="index"
                  :label="item.integ_channel_name"
                  :value="item.integ_channel_name"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="品牌">
              <el-select
                v-model="searchForm.brand_name"
                style="width: 100%"
                clearable
                placeholder="请选择"
              >
                <el-option
                  v-for="(labelAttribute, index) in labelAttributes"
                  :key="index"
                  :label="labelAttribute.brandName"
                  :value="labelAttribute.brandName"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6" style="text-align: center">
            <el-button type="primary" @click="filterData">查询</el-button>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <main class="tableMainContent">
      <el-button type="primary" @click="labelModalVisble = true"
        >新增</el-button
      >
      <el-table
        v-loading="loading"
        :data="tableList"
        max-height="450"
        border
        style="margin-top: 10px"
      >
        <el-table-column label="序号" fixed="left">
          <template slot-scope="scope">
            <span>{{ scope.$index + 1 }}</span>
          </template>
        </el-table-column>
        <el-table-column label="品牌" prop="brand_name" width="100"  fixed="left"/>
        <el-table-column label="渠道" prop="integ_channel_name" width="100"  fixed="left"/>
        <el-table-column label="类型" prop="type_name" width="160" />
        <el-table-column label="启用状态" prop="on_status" width="160">
          <template slot-scope="scope">
            <span>{{ scope.row.on_status }}</span>
          </template>
        </el-table-column>
        <el-table-column label="创建人" prop="create_user" width="150" />
        <el-table-column label="创建时间" prop="create_time" width="150" />
        <el-table-column label="修改人" prop="update_user" width="180" />
        <el-table-column label="修改时间" prop="update_time" width="180" />
        <el-table-column label="操作" width="220" fixed="right">
          <template slot-scope="scope">
            <el-button type="text" @click="handler(scope.row, '查看')"
              >查看</el-button
            >
            <el-button
              v-if="scope.row.on_status == '停用'"
              type="text"
              @click="handler(scope.row, '编辑')"
              >编辑</el-button
            >
            <el-button
              v-if="scope.row.on_status == '停用'"
              type="text"
              class="deleteFontColor"
              @click="deletaFiles(scope.row)"
              >删除</el-button
            >
            <el-button
              v-if="scope.row.on_status == '停用'"
              type="text"
              @click="enableFiles(scope.row)"
              >启用</el-button
            >
            <el-button
              v-if="scope.row.on_status == '启用'"
              type="text"
              @click="enableFiles(scope.row)"
              >停用</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <base-pagination
        v-model="pageParams.current"
        :page-size.sync="pageParams.page_size"
        :total="total"
        @loadData="getList"
      />
    </main>
    <el-dialog :visible.sync="labelModalVisble" title="增加渠道">
      <el-tabs v-model="activeName" type="card">
        <el-tab-pane label="消息通知" name="first">
          <notification :added-list="newsAddedList" />
        </el-tab-pane>
        <el-tab-pane label="电子邮件" name="second">
          <ailCloud :added-list="mailAddedList" />
        </el-tab-pane>
        <el-tab-pane label="短信" name="third">
          <message :added-list="shortAddedList" />
        </el-tab-pane>
        <el-tab-pane label="数据服务" name="fourth">
          <record :added-list="dateAddedList" />
        </el-tab-pane>
        <el-tab-pane label="其他" name="five">
          <other :added-list="other" />
        </el-tab-pane>
      </el-tabs>
    </el-dialog>
    <el-dialog :show-close="false" :visible.sync="dialogVisible" width="30%">
      <div class="dialog-title" style="margin-bottom: 20px">
        <div class="dialog-nav">
          <span>品牌:{{ brand_code }}</span>
          <span>渠道:{{ channel_type }}</span>
        </div>
      </div>
      <span>是否删除此条数据</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="deletaComfie()">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog :show-close="false" :visible.sync="enable" width="30%">
      <div class="dialog-title">
        <div class="dialog-nav">
          <span>品牌:杜蕾斯</span>
          <span>渠道:微信</span>
        </div>
      </div>
      <span style="display: block; margin-top: 20px"
        >是否{{ service === "停用" ? "启用" : "停用" }}此条数据</span
      >
      <span slot="footer" class="dialog-footer">
        <el-button @click="enable = false">取 消</el-button>
        <el-button type="primary" @click="comfim()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import {
  queryAllIntegration,
  onStatus,
  delIntegration,
  deletOnStatus,
  queryPlatformName,
  getType,
  queryChl,
} from "@/api/security/visit";
import { queryBrandList } from "@/api/employ";
import notification from "./notification/notification.vue";
import ailCloud from "./ailCloud/ailCloud.vue";
import message from "./message/message.vue";
import miniprogram from "./miniprogram/miniprogram.vue";
import apppush from "./apppush/apppush.vue";
import record from "./record/record.vue";
import other from "./other/other.vue";

export default {
  components: {
    notification,
    ailCloud,
    message,
    miniprogram,
    apppush,
    record,
    other,
  },
  data() {
    return {
      activeName: "first", // tab切换
      pageParams: {
        page_size: 10,
        current: 1,
      },
      total: 10,
      pageSizes: [10, 20, 30, 40],
      loading: false,
      brand: [
        { label: "启用", value: "on" },
        { label: "停用", value: "off" },
      ],
      tableList: [],
      searchForm: {
        on_status: "",
        integ_channel_name: "",
        brand_name: "",
      },
      labelAttributes: [],
      channelAttributes: [],
      dialogVisible: false,
      enable: false,
      labelModalVisble: false,
      service: "",
      brand_code: "", // 品牌
      channel_type: "", // 渠道
      deletaId: "", // 删除id
      // tab数据
      newsAddedList: [], // 新增数据
      mailAddedList: [],
      shortAddedList: [],
      dateAddedList: [],
      other: [],
      crmChlId: "",
      integChlId: "",
    };
  },
  mounted() {
    Object.keys(this.searchForm).map((item) => {
      this.searchForm[item] = "";
    });
    this.getList();
    this.getType();
    this.brandName();
    this.brands();
  },
  methods: {
    getList() {
      const param = {
        pageSize: this.pageParams.page_size,
        pageNum: this.pageParams.current,
      };
      Object.keys(this.searchForm).map((item) => {
        if (this.searchForm[item]) {
          param[item] = this.searchForm[item];
        }
      });
      queryAllIntegration(param).then((res) => {
        this.loading = false;
        this.tableList = res.data.list;
        this.pageParams.current = res.data.pagination.current || 1;
        this.pageParams.page_size = res.data.pagination.page_size;
        this.total = res.data.pagination.total || 0;
        this.tableList.map((item, index) => {
          if (item.on_status == "off") {
            item.on_status = "停用";
          } else {
            item.on_status = "启用";
          }
        });
        this.$forceUpdate();
      });
    },
    //品牌接口
    brands() {
      let params = {};
      queryBrandList({ params: {} }).then((res) => {
        this.labelAttributes = res.body;
      });
    },
    // 新增
    getType() {
      const params = {};
      getType(params).then((res) => {
        if (res) {
          this.newsAddedList = res.data[0].list;
          this.mailAddedList = res.data[1].list;
          this.shortAddedList = res.data[2].list;
          this.dateAddedList = res.data[3].list;
          this.other = res.data[4].list;
        }
      });
    },
    // 查询
    filterData() {
      this.pageParams.current = 1;
      this.getList();
    },
    // 渠道
    brandName() {
      const params = {};
      queryChl(params).then((res) => {
        if (res.code == "1") {
          this.channelAttributes = res.data.list;
        }
      });
    },
    // 查看编辑
    handler(row, type) {
      this.$router.push({
        name: "integratEdedit",
        query: {
          id: row.id,
          type: type,
          channel_type: row.channel_type,
          crm_mp_integ_chl_id: row.crm_mp_integ_chl_id,
          on_status: row.on_status,
          type_name: row.type_name,
          integ_channel_name: row.integ_channel_name,
        },
      });
    },
    // 删除
    deletaFiles(row) {
      this.brand_code = row.brand_code;
      this.channel_type = row.channel_type;
      this.dialogVisible = true;
      this.deletaId = row.id;
      this.integChlId = row.crm_mp_integ_chl_id;
    },
    // 删除弹窗确认按钮
    deletaComfie() {
      const params = {
        id: this.deletaId,
        crm_mp_integ_chl_id: this.integChlId,
      };
      delIntegration(params)
        .then((res) => {
          if (res.code == 1) {
            this.dialogVisible = false;
            this.deletOpen();
            this.getList();
          }
        })
        .catch((error) => {
          console.log(error,'error')
        });
    },
    // 启用/停用
    enableFiles(row) {
      this.service = row.on_status;
      this.serviceId = row.id;
      this.enable = true;
      this.crmChlId = row.crm_mp_integ_chl_id;
    },
    // 启用/停用弹窗确认
    comfim() {
      this.enable = false;
      if (this.service == "停用") {
        this.service = "on";
      } else {
        this.service = "off";
      }
      const params = {
        on_status: this.service,
        id: this.serviceId,
        crm_mp_integ_chl_id: this.crmChlId,
        on_status: this.service,
      };
      onStatus(params)
        .then((res) => {
          console.log(res, "redd");
          if (res.code == "1") {
            if ((this.service = "on")) {
              this.service == "启用";
            } else {
              this.service == "停用";
            }
            this.serviceOpen(this.service);
            this.getList();
          }
        })
        .catch((fail) => {
          this.loading = false;
        });
    },
    deletOpen() {
      this.$message({
        message: "删除成功",
        type: "success",
      });
    },
    // 启用/停用弹框
    serviceOpen(service) {
      this.$message({
        message: `${service == "on" ? "启用" : "停用"}成功`,
        type: "success",
      });
    },
    // 每页条数切换
    handleSizeChange(val, bv) {
      this.pageParams.current = 1;
      this.pageParams.page_size = val;
      this.getList();
    },
    // 页码切换
    handleCurrentChange(val) {
      this.pageParams.current = val;
      this.getList();
    },
  },
};
</script>
<style lang="less" scoped>
.searchWrap {
  background: white;
}
main {
  margin-top: 10px;
  padding: 15px;
  background: white;
}
</style>
