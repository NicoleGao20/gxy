<template>
  <div class="table">
    <el-table
      v-loading="loading"
      ref="elTable"
      :data="data"
      :style="tableStyle"
      :empty-text="emptyText"
      border
      stripe
      size="mini"
      @sort-change="sortChange"
      @selection-change="selectionChange"
    >
      <template v-for="column in columns">
        <el-table-column
          v-if="column.type == 'index'"
          type="index"
          width="50"
          :key="column.type"
        />
        <el-table-column
          v-if="column.type == 'selection'"
          :selectable="column.selectable ? column.selectable : null"
          type="selection"
          width="55"
          :key="column.type"
        />
        <el-table-column
          v-if="
            (column.visible != null ? column.visible : true) &&
            column.type != 'selection' &&
            column.type != 'template' &&
            column.type != 'index'
          "
          :show-overflow-tooltip="
            column.showTip == null ? true : column.showTip
          "
          :prop="column.prop"
          :label="column.label"
          :sortable="column.sortable ? column.sortable : false"
          :width="column.width"
          :align="column.align ? column.align : 'left'"
          :formatter="
            column.formatter
              ? column.formatter
              : column.dataType
              ? formatter
              : null
          "
          :context="column"
          header-align="center"
          :key="column.type"
        />
        <el-table-column
          v-if="column.type == 'template' && column.templateType === 'input'"
          :prop="column.prop"
          :label="column.label"
          :width="column.width"
          :align="column.align ? column.align : 'center'"
          :sortable="column.sortable ? column.sortable : false"
          :context="column"
          :fixed="column.fixed"
          header-align="center"
          :key="column.type"
        >
          <template
            slot-scope="scope"
            v-for="(template, ind) in column.template"
          >
            <el-input
              v-if="
                template.visibleFunction
                  ? template.visibleFunction(scope, template.prop)
                  : true
              "
              :disabled="template.disabled ? template.disabled(scope) : false"
              v-model="scope.row[column.prop]"
              size="mini"
              @change="
                template.change ? template.change(scope, template.prop) : null
              "
              @blur="template.blur(scope, template.prop)"
              :key="ind"
            />
          </template>
        </el-table-column>
        <el-table-column
          v-if="column.type == 'template' && column.templateType === 'button'"
          :prop="column.prop"
          :label="column.label"
          :width="column.width"
          :align="column.align ? column.align : 'center'"
          :sortable="column.sortable ? column.sortable : false"
          :context="column"
          :fixed="column.fixed"
          header-align="center"
          :key="column.type"
        >
          <template
            slot-scope="scope"
            v-for="(template, index) in column.template"
          >
            <el-button
              v-if="
                template.visibleFunction
                  ? template.visibleFunction(scope, template.prop)
                  : true
              "
              :key="index"
              :disabled="template.disabled ? template.disabled(scope) : false"
              :type="template.class"
              size="mini"
              @click="template.click(scope, template.prop)"
              >{{
                template.label ? template.label : scope.row[column.prop]
              }}</el-button
            >
          </template>
        </el-table-column>
      </template>
    </el-table>
    <el-row v-if="isPaging" style="padding-top: 10px">
      <div class="grid-content bg-purple-light" style="text-align: right">
        <el-pagination
          :total="total"
          :page-size="pageSize"
          background
          :layout="paginationLayout"
          :page-sizes="[10, 50, 100]"
          @size-change="chageSize($event)"
          @current-change="changePage($event)"
        />
      </div>
    </el-row>
  </div>
</template>
<script>
import { camel2UnderLine } from "@/utils/index";
import request from "@/utils/request";

export default {
  components: {},
  props: {
    tableStyle: {
      type: String,
      default: "width:100%;",
    },
    columns: Array,
    isPaging: {
      type: Boolean,
      default: true,
    },
    paginationLayout: {
      type: String,
      default: "total, sizes, prev, pager, next, jumper",
    },
    pageSize: {
      type: Number,
      default: 10,
    },
    emptyText: {
      type: String,
      default: "暂无数据",
    },
  },
  data() {
    return {
      data: [],
      pageNum: 1,
      total: 1,
      sortOrder: "",
      sortProp: "",
      url: "",
      filter: {},
      loading: false,
    };
  },
  methods: {
    selectionChange(evt) {
      this.$emit("selectionChange", evt);
    },
    toggleSelection(rows) {
      if (rows) {
        rows.forEach((row) => {
          this.$refs.elTable.toggleRowSelection(row);
        });
      } else {
        this.$refs.elTable.clearSelection();
      }
    },
    formatter(row, column, cellValue, index) {
      let value = cellValue;
      const context = this.columns[index];
      if (!context) {
        return;
      }
      if (context.dataType === "dateTime") {
        if (value != null) {
          value = new Date(value).Format("yyyy-MM-dd hh:mm:ss");
        }
      } else if (context.dataType === "yesOrNo") {
        if (value != null) {
          if (value === "Y") {
            value = "是";
          } else {
            value = "否";
          }
        }
      } else if (context.dataType === "array") {
        if (context.array) {
          for (const v of context.array) {
            if (v.value === cellValue) {
              value = v.label;
            }
          }
        }
      }
      return value;
    },
    // 分页的事件
    changePage(pageNum = 1) {
      this.pageNum = pageNum;
      this.getData(this.url, this.filter);
    },
    chageSize(pageSize) {
      this.pageSize = pageSize;
      this.getData(this.url, this.filter);
    },
    sortChange(column, prop, order) {
      this.sortProp = column.prop ? camel2UnderLine(column.prop) : "";
      this.sortOrder = column.order
        ? column.order === "ascending"
          ? "asc"
          : "desc"
        : "";
      this.getData(this.url, this.filter);
    },
    getData(url, filter = {}) {
      const param = {};
      this.url = url;
      this.filter = filter;
      param.params = filter;
      if (this.isPaging) {
        param.params.current = this.pageNum;
        param.params.pageSize = this.pageSize;
      }
      if (this.sortProp) {
        param.params.sortColumns = this.sortProp + " " + this.sortOrder;
      }
      this.loading = true;
      request({ url, params: param.params })
        .then((res) => {
          if (this.isPaging) {
            if (res.data) {
              // 渲染表格
              this.data = res.data.list;
              // 设置当前一页几条数据
              this.pageSize = res.data.pagination.pageSize;
              // 设置总共几页
              this.total = res.data.pagination.total;
            } else {
              this.removeAll();
            }
          } else {
            if (res.data) {
              this.data = res.data;
            } else {
              this.data = res;
            }
          }
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
        });
    },
    removeAll() {
      this.data = [];
      this.pageNum = 1;
      this.total = 1;
    },
  },
};
</script>
<style lang="scss" scoped="scoped">
table {
  width: 100% !important;
}
.table {
  overflow: hidden;
  width: 100% !important;
  .block {
    margin: 20px auto;
  }
  .mask {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.4);
    z-index: 1000;
    .jia-moduld {
      font-size: 20px;
      line-height: 1.5em;
      color: #666;
      width: 300px;
      position: fixed;
      top: 50%;
      left: 50%;
      padding: 10px 40px 20px 40px;
      background-color: #fff;
      // z-index: 2000;
      transform: translate3d(-50%, -50%, 0);
      .edit-item {
        .tip {
          visibility: hidden;
        }
      }
      .title {
        font-size: 30px;
        text-align: center;
        padding: 20px 0;
      }
      .btn-box {
        padding: 10px;
        text-align: center;
      }
    }
  }
}
.ta-body > .ta-listgroup:last-child {
  border-bottom: 1px solid #ebeef5;
}
.ta-list,
.ta-listhead {
  width: 20%;
  border-top: 1px solid #ebeef5;
  border-left: 1px solid #ebeef5;
  text-align: center;
  font-size: 14px;
  padding: 8px 3px;
  color: #909399;
}
.ta-head > .ta-listhead:last-child,
.ta-listgroup > .ta-list:last-child {
  border-right: 1px solid #ebeef5;
}
.ta-list {
  // height: 100px;
  color: #333333;
}
.ta-listbig {
  width: 34%;
}
.ta-listmini {
  width: 6%;
}
</style>
