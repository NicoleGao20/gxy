<template>
  <div class="page-container">
    <div class="search-wrap">
      <el-form label-position="right" label-width="80px">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="品牌">
              <el-select v-model="searchForm.label_type" style="width: 100%;" clearable >
                <el-option v-for="(optionItem, index) in options" :key="index" :label="optionItem.label" :value="optionItem.value"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="参数名称">
              <el-select v-model="searchForm.label_type" style="width: 100%;" clearable >
                <el-option v-for="(optionItem, index) in options" :key="index" :label="optionItem.label" :value="optionItem.value"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="参数类型">
              <el-select v-model="searchForm.label_type" style="width: 100%;" clearable >
                <el-option v-for="(optionItem, index) in options" :key="index" :label="optionItem.label" :value="optionItem.value"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item>
              <el-button type="primary" @click="filterData">查询</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <el-button type="primary" class="listAddBtnStyle">新增</el-button>
    <el-table v-loading="loading" stripe :data="list" border style="margin-top: 10px;">
      <el-table-column label="品牌"/>
      <el-table-column label="参数名称"/>
      <el-table-column label="参数类型"/>
      <el-table-column label="参数值"/>
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
export default {
  data() {
    return {
      searchForm: {

      },
      options: [],
      total: 0,
      params: {
        current: '',
        page_size: 10
      },
      loading: false,
      list: []
    }
  },
  methods: {
    loadData() {

    }
  }
}
</script>
