<template>
  <div class="page-container">
    <div class="search-wrap">
      <el-form label-position="right" label-width="80px">
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="事件名称">
              <el-input
                v-model="searchForm.table_name_show"
                clearable
                @keyup.enter.native="filterData"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="事件类型">
              <el-select v-model="searchForm.business_type" style="width: 100%;" clearable>
                <el-option
                  v-for="(labelAttribute, index) in labelAttributes"
                  :key="index"
                  :label="labelAttribute.label"
                  :value="labelAttribute.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item>
              <el-button type="primary" @click="filterData">查询</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <el-table
      v-loading="loading"
      :data="tableList"
      max-height="550"
      border
      style="margin-top: 10px;"
    >
      <el-table-column label="序号">
        <template slot-scope="scope">
          <span>{{ (scope.$index+1) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="事件名称" prop="table_name_show" width="160" />
      <el-table-column label="事件类型" prop="business_type" width="140">
        <template slot-scope="scope">{{ getLabelByValue(scope.row.business_type, labelAttributes) }}</template>
      </el-table-column>
      <el-table-column label="备注" prop="table_name_desc" width="240" />
      <el-table-column label="事件对象" prop="partition_level" />
      <el-table-column label="创建人" prop="create_user" width="140" />
      <el-table-column label="创建时间" prop="create_time" width="150" />
      <el-table-column label="操作" width="160" fixed="right">
        <template slot-scope="scope">
          <el-button type="text" @click="handler(scope.row)">查看</el-button>
          <!-- <el-button type="text" @click="handler(scope.row,'edit')">编辑</el-button> -->
        </template>
      </el-table-column>
    </el-table>
    <base-pagination
    class="bottomPagination"
      v-model="params.current"
      :page-size.sync="params.page_size"
      :total="total"
      @loadData="loadData"
    />
  </div>
</template>
<script>
import { getEventList, queryEventDefList } from "@/api/marketEvent";
import { mixinDel } from "@/utils/index";
import cacheCondition from "@/utils/cacheCondition";

export default {
  name: "MarketEventList",
  mixins: [mixinDel, cacheCondition],
  data() {
    return {
      params: {
        page_size: 10,
        current: 1,
      },
      total: 10,
      pageSizes: [10, 20, 30, 40],
      loading: false,
      tableList: [],
      labelAttributes: [],
      searchForm: {
        table_name_show: "",
        business_type: "",
      },
    };
  },
  mounted() {
    this.getList();
  },
  methods: {
    getList() {
      getEventList().then((res) => {
        this.loadData();
        this.labelAttributes = res.data.list;
        if (this.labelAttributes.length) {
          this.labelAttributes.forEach((ele) => {
            this.$set(ele, "label", ele.eventTypeName);
            this.$set(ele, "value", ele.eventTypeCode);
          });
        }
      });
    },
    filterData() {
      this.params.current = 1;
      this.loadData();
    },
    loadData() {
      this.loading = true;
      var params = {
        ...this.searchForm,
        ...this.params,
      };
      for (var attr in params) {
        if (!params[attr]) delete params[attr];
      }
      queryEventDefList(params)
        .then((res) => {
          this.loading = false;
          this.tableList = res.data.list;
          this.params.current = res.data.pagination.current || 1;
          this.params.page_size = res.data.pagination.page_size;
          this.total = res.data.pagination.total || 0;
        })
        .catch((fail) => {
          this.loading = false;
        });
    },
    handler(row,type) {
      this.$router.push({
        name: "marketEventAdd",
        query: {
          id: row.id,
          type:type
        },
      });
    },
    getLabelByValue(value, list, opts) {
      if (!list || list.length === 0) return "";
      opts = opts || { valueKey: "value", labelKey: "label" };
      for (var i = 0, len = list.length; i < len; i++) {
        if (list[i][opts.valueKey] === value) {
          return list[i][opts.labelKey];
        }
      }
      return "";
    },
  },
};
</script>
<style lang="less" scoped>
.page-container {
  background: white;
  min-height: 100%;
  padding: 15px;
}
.search-wrap {
  padding: 0;
  margin: 0px 0;
}
</style>
