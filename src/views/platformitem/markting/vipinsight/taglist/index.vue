<template>
  <div class="vipinsight-taglist-page app-container">
    <section>
      <header>
        <!-- 条件列表 -->
        <span>条件名称</span>
        <div>
          <el-input
            v-model="searchForm.inputTag"
            style="width: 435px"
            placeholder="请输入关键词搜索条件"
            @keyup.enter.native="onSubmit"
          >
            <i
              slot="suffix"
              class="el-input__icon el-icon-search"
              @click="onSubmit"
            />
          </el-input>
        </div>
      </header>
      <div>
        <el-scrollbar class="taglist">
          <div>
            <el-collapse v-model="activeNames">
              <div
                v-for="(item, index) in tagClassList"
                :key="index"
                style="box-sizing: border-box; padding: 0 15px"
              >
                <div
                  v-if="item.has_label === 1"
                  :class="{
                    'tag-category': true,
                    'tag-category-active': tagClassListValue === item.id,
                  }"
                  @click="onsetTagcategory(item.id)"
                >
                  {{ item.class_name }}
                </div>
                <el-collapse-item
                  v-if="item.has_label !== 1"
                  :title="item.class_name"
                  :name="index"
                >
                  <template v-for="ite in item.children">
                    <el-radio
                      v-model="tagClassListValue"
                      :key="ite.id"
                      :label="ite.id"
                      style="margin-left: 0px; margin-bottom: 10px"
                      border
                      @change="onchange"
                      >{{ ite.class_name }}</el-radio
                    >
                    <!-- <el-radio  v-model="tagClassListValue" :label="ite.id" style="margin-left: 0px;margin-bottom:10px;"  @change="onchange">{{ite.class_name }}</el-radio> -->
                  </template>
                </el-collapse-item>
              </div>
            </el-collapse>
          </div>
        </el-scrollbar>
        <div class="container">
          <div ref="tablecon" class="tablecon">
            <section>
              <el-table
                v-loading="loading"
                :data="tableData"
                :cell-class-name="onsetcellClass"
                :max-height="tableHeight"
                header-cell-class-name="tableHight"
              >
                <el-table-column prop="label_name" fixed="left" width="120" label="条件名称">
                  <template slot-scope="scope">
                    <el-popover trigger="hover" placement="bottom">
                      <p :style="{ textAlign: 'center', 'max-width': '250px' }">
                        {{ scope.row.label_name }}
                      </p>
                      <div slot="reference" class="name-wrapper">
                        {{ scope.row.label_name }}
                      </div>
                    </el-popover>
                  </template>
                </el-table-column>
                <el-table-column prop="label_class_name" width="150" label="条件类目" />
                <el-table-column prop="label_desc" width="250" label="条件说明">
                  <template slot-scope="scope">
                    <el-popover trigger="hover" placement="bottom">
                      <p :style="{ textAlign: 'center', 'max-width': '250px' }">
                        {{ scope.row.label_desc }}
                      </p>
                      <div slot="reference" class="name-wrapper">
                        {{ scope.row.label_desc }}
                      </div>
                    </el-popover>
                  </template>
                </el-table-column>
                <el-table-column prop="update_frequency" label="更新频次">
                  <template slot-scope="scope">
                    <el-tag
                      :type="scope.row.update_frequency === 't_1' ? 'info' : 'success'"
                      disable-transitions
                    >
                      {{
                        scope.row.update_frequency === "t_1" ? "每天" : "实时"
                      }}
                    </el-tag>
                  </template>
                </el-table-column>
                <el-table-column prop="create_time" width="150" label="更新时间">
                  <template slot-scope="scope">
                    {{
                      scope.row.update_frequency === "t_1"
                        ? scope.row.data_collection_time
                        : "-"
                    }}
                  </template>
                </el-table-column>
                <el-table-column label="操作" fixed="right" width="100">
                  <template slot-scope="scope">
                    <el-button
                      type="text"
                      size="small"
                      @click.native.prevent="onlookface(scope.row)"
                    >
                      查看画像
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
            </section>
            <div style="text-align: right; padding: 10px 0">
              <el-pagination
                class="bottomPagination"
                :current-page.sync="params.currentPage"
                :page-size.sync="params.pageSize"
                :page-sizes="pageSizes"
                :total="total"
                background
                layout="total, sizes, prev, pager, next, jumper"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
              />
            </div>
          </div>
        </div>
      </div>
      <!-- <el-drawer :visible.sync="drawer" :with-header="false" size="90%">
        <div slot="title" class="drawerTitle">
          群像分析<span class="tip"
            >（默认展示（杜蕾斯品牌）所有注册会员画像近12个月的消费数据）</span
          >
        </div>
        <div style="display: block; overflow: auto; height: 100%">
          <crm-group-portraint
            v-if="drawer"
            :label-id="drawerInfo.labelId"
            :label_type="drawerInfo.label_type"
            :create-type="drawerInfo.createType"
            link_resource="label"
          />
        </div>
      </el-drawer> -->
      <el-drawer :visible.sync="drawer"  :show-close="true" size="90%">
        <div slot="title" class="drawerTitle">群像分析</div>
        <user-portrait/>
      </el-drawer>
    </section>
  </div>
</template>
<script>
import crmGroupPortraint from "@/views/platformitem/markting/dataAnalysis/crmGroupPortrait/index";
import userPortrait from "@/views/platformitem/insight/user/Userface.vue";
import {
  getlableClassList,
  getlableClassTable,
} from "@/api/markting/vinpinsightTaglist";
import cacheCondition from "@/utils/cacheCondition";
import Cookies from "js-cookie";
export default {
  name: "Taglist",
  components: {
    crmGroupPortraint,
    userPortrait
  },
  mixins: [cacheCondition],
  data() {
    return {
      loading: false,
      drawer: false,
      tableHeight: "550px",
      drawerInfo: {
        labelId: "",
        createType: "",
        label_type: "",
      },
      searchForm: {
        inputTag: "",
      },
      tagClassListValue: "",
      tagClassList: [],
      params: {
        pageSize: 10,
        currentPage: 1,
      },
      pageSizes: [10, 20, 30, 40],
      total: 0,
      activeNames: [0],
      tableData: [],
    };
  },
  watch: {
    tagClassListValue(val) {
      console.log(this.$refs.tablecon, 9);
      this.tableHeight = this.$refs.tablecon.offsetHeight - 60;
    },
  },
  mounted() {
    this.searchForm.inputTag = "";
    this.ongetlableClassList();
  },
  methods: {
    onsetTagcategory(id) {
      // 一级类目挂标签方法
      console.log(id, "houId");
      this.tagClassListValue = id;
      this.searchForm.inputTag = "";
      this.ongetlableClassTable();
    },
    onsetcellClass({ row, column, rowIndex, columnIndex }) {
      // 给第一行添加背景色
      if (columnIndex === 0 || columnIndex === 2) {
        return "setcell-one";
      }
    },
    onlookface(data) {
      // 查看画像按钮
      this.drawerInfo.labelId = data.label_def_id;
      this.drawerInfo.createType = data.create_type;
      this.drawerInfo.label_type = data.label_type;
      this.drawer = true;
      // this.$router.push(`/dataAnalysis/crmGroupPortrait/${data.id}`)
    },
    onchange() {
      // 二级类目方法
      this.searchForm.inputTag = "";
      this.ongetlableClassTable();
    },
    onSubmit() {
      // 标签名搜索方法
      // if (!this.searchForm.inputTag) {
      //   this.$message({
      //     message: '请输入关键词搜索标签',
      //     type: 'warning'
      //   })
      //   return
      // }
      this.params = {
        pageSize: 10,
        currentPage: 1,
      };
      // this.tagClassListValue = ''
      console.log(this.tagClassListValue, "后发+this.tagClassListValue");
      this.ongetlableClassTable();
    },
    ongetlableClassTable() {
      // 获取表格数据
      this.loading = true;
      const obj = {
        current: this.params.currentPage,
        page_size: this.params.pageSize,
        brand_code: Cookies.get("brandCode"),
      };
      if (this.searchForm.inputTag) {
        obj.label_name = this.searchForm.inputTag;
      }
      if (this.tagClassListValue) {
        obj.label_class_def_id = this.tagClassListValue;
      }
      console.log(obj, "后+obj");
      getlableClassTable(obj).then((res) => {
        this.tableData = res.data.list;
        this.total = res.data.pagination.total;
        this.loading = false;
      });
    },
    async ongetlableClassList() {
      // 获取类目数据
      await getlableClassList({}).then((res) => {
        console.log(res, "reddd");
        this.tagClassList = res.data && res.data.list;
        this.activeNames = [0];
        if (res.data.list.length > 0 && res.data.list[0].children.length > 0) {
          this.tagClassListValue = res.data.list[0].children[0].id;
        }
        if (
          res.data.list.length > 0 &&
          res.data.list[0].children.length === 0
        ) {
          this.tagClassListValue = res.data.list[0].id;
        }
        if (res.data.list.length) {
          this.ongetlableClassTable();
        }
      });
    },
    // 分页
    handleSizeChange(val, bv) {
      console.log(
        `每页 ${val} 条`,
        this.params.currentPage,
        this.params.pageSize
      );
      this.ongetlableClassTable();
    },
    handleCurrentChange(val) {
      console.log(
        `当前页: ${val}`,
        this.params.currentPage,
        this.params.pageSize
      );
      this.ongetlableClassTable();
    },
  },
};
</script>
<style lang="less" scoped>
/deep/ .el-drawer__body {
  overflow: auto !important;
}
.el-drawer__body {
  overflow: auto !important;
}
/deep/ .el-drawer__header {
  margin-bottom: 0 !important;
}
.el-drawer__header {
  margin-bottom: 0 !important;
}
.tip {
  margin-left: 10px;
  color: #97a8be;
  font-size: 14px;
}
.vipinsight-taglist-page {
  width: 100%;
  height: 100%;
  background: #f3f3f3;
  /deep/ .el-collapse-item {
    border-bottom: 1px solid #ddd;
  }
  /deep/ .el-collapse-item__header {
    border-bottom: 1px solid #e8eaf1;
  }
  /deep/ .el-collapse {
    border: none;
  }
  /deep/ .el-collapse-item__content {
    padding-top: 25px;
  }
  /deep/ .el-radio__input {
    display: none !important;
  }
  /deep/ .el-radio__label {
    padding-left: 5px !important;
  }
  .setcell-one {
    .name-wrapper {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      max-height: 50px;
    }
  }
  .tag-category {
    width: 100%;
    height: 48px;
    line-height: 48px;
    color: #303133;
    border-bottom: 1px solid #ddd;
    cursor: pointer;
    &.tag-category-active {
      font-weight: 700;
    }
  }
  & > section {
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    padding: 20px;
    background: #fff;
    & > header {
      box-sizing: border-box;
      display: flex;
      align-items: center;
      width: 100%;
      height: 63px;
      padding-bottom: 30px;
      margin-bottom: 10px;
      border-bottom: 1px solid #ecedf0;
      & > span {
        width: 80px;
        color: #606266;
        font-size: 14px;
      }
      & > div {
        flex: 1;
      }
    }
    & > div {
      display: flex;
      flex: 1;
      width: 100%;
      overflow: hidden;
      /deep/ .el-scrollbar__wrap {
        overflow-x: hidden;
      }
      & > .taglist {
        flex: 1;
        max-height: 100%;
        min-width: 200px;
        margin-right: 10px;
        overflow: auto;
        border: 1px solid #ddd;
        border-radius: 5px;
        /deep/ .el-collapse-item__header {
          border-bottom: none;
        }
        /deep/ .el-collapse-item:last-child {
          margin: 0;
        }
        & > div {
          padding: 15px;
          border: 1px solid #e8eaf1;
          margin-right: 18px;
        }
      }
      & > .container {
        width: 70%;
        height: 100%;
        overflow: auto;
        .tablecon {
          height: 100%;
          width: 100%;
          & > section {
            border: 1px solid #eee;
            border-bottom: none;
          }
        }
      }
    }
  }
}
</style>
<style lang="less">
.tableHight {
  background: #f5f7fa !important ;
}
</style>
