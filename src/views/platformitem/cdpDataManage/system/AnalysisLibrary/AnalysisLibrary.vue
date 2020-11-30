<template>
  <div class="page-container-gap">
    <div class="searchWrap">
      <cmpFilter @getData="getData"></cmpFilter>
      <!-- <el-form label-position="right" label-width="90px">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="数据集">
              <el-select v-model="searchForm.table_name_show" :loading="typeLoading" clearable style="width: 100%;" filterable @focus="getlistTableNameShow">
                <el-option v-for="(item, index) in listTableNameShow" :key="index" :label="item.table_name_show" :value="item.table_name_show"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="创建人">
              <el-input v-model="searchForm.create_user" clearable @keyup.enter.native="filterData" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="修改人">
              <el-input v-model="searchForm.update_user" clearable @keyup.enter.native="filterData"/>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-button type="primary" @click="filterData">查询</el-button>
          </el-col>
        </el-row >
      </el-form>  -->
    </div>
    <main  class="tableMainContent">
      <el-table
        v-loading="loading"
        stripe
        :data="rows"
        max-height="550"
        border>
        <el-table-column
          label="类型"
          prop="table_type" >
          <template slot-scope="scope">
            <span v-if="scope.row.table_type==='analysis'">
              分析数据
            </span>
          </template>
        </el-table-column>
        <el-table-column
          label="数据集"
          prop="table_name_show"/>
        <el-table-column
          label="更新频次"
          prop="update_frequency">
          <template slot-scope="scope">
            <span v-if="scope.row.update_frequency==='realtime'">
              实时
            </span>
            <span v-if="scope.row.update_frequency==='t_1'">
              每天
            </span>
          </template>
        </el-table-column>
        <el-table-column
          label="创建人"
          prop="create_user"/>
        <el-table-column
          label="修改人"
          prop="update_user"/>
        <el-table-column
          label="逻辑表名"
          prop="table_name"/>
        <el-table-column
          label="描述"
          prop="table_name_desc"/>
        <el-table-column
          label="创建时间"
          width="120"
          prop="create_time"/>
        <el-table-column
          label="操作"
          width="140">
          <template slot-scope="scope">
            <div>
              <el-button type="text" @click="mod(scope.row,'view')">查看</el-button>
              <el-button type="text" @click="mod(scope.row,'edit')">编辑</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <base-pagination
        class="bottomPagination"
        v-model="params.current"
        :page-size.sync="params.pageSize"
        :total="total"
        @loadData="loadData"
        background
      />
    </main>

  </div>
</template>
<script>
import {pages} from '@/mixins/pages'
import getFuncs from '@/mixins/getFuncs'
import getOptions from '@/mixins/getOptions'
import cmpFilter from '@/publicComponents/cmpFilter/index.vue'
import { listCondition, listTableNameShow } from '@/api/conditionLibrary'
// import cacheCondition from '@/utils/cacheCondition'
export default {
  mixins: [getFuncs,getOptions,pages],
  name: 'AnalysisLibrary',
  components: {
        cmpFilter,
  }, 
  data() {
    return {
      loading: false,
      typeLoading: false,
      isMoreinquiries: false,
      initDone: false,
      searchForm: {
        table_type: '',
        table_name_show: '',
        create_user: '',
        update_user: ''
      },
      params: {
        pageSize: 10,
        current: 1
      },
      total: 0,
      rows: [],
      tableColumns: [],
      filterColumns: [],
      labelTypes: [
        { label: '标签数据', value: 'analysis' },
        { label: '行为数据', value: 'aggregation' }
      ],
      listTableNameShow: []
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    clearData() {
      this.params.table_name_show = ''
    },
    init() {
      this.loadData()
    },
    getData(){
      this.loadData()
    },
    getlistTableNameShow() {
      this.typeLoading = true
      const params = {  table_type: 'analysis',}
      listTableNameShow(params).then((res) => {
        this.typeLoading = false
        this.listTableNameShow = res.data.list
      })
    },
    mod(row, type) {
      // this.$router.push({ path: `/system/conditionLibraryMod/123` })
      this.$router.push({
        name: 'AnalysisLibraryMod',
        query: { id: row.meta_table_id, isEdit: type, 'table_type': row.table_type }
      })
      /* if(row.id) {
        this.$router.push({ path: `/system/conditionLibraryMod/${row.id}` })
      } */
    },
    loadData() {
      var params = {
        current: this.params.current,
        page_size: this.params.pageSize,
        table_type: 'analysis',
        table_name_show: this.searchForm.table_name_show,
        create_user: this.searchForm.create_user,
        update_user: this.searchForm.update_user

        // column_name_show: this.params.column_name_show
      }
      this.loading = true
      listCondition(params).then((res) => {
        this.loading = false
        this.rows = res.data && res.data.list || []
        this.params.current = res.data && res.data.pagination.current || 1
        this.params.pageSize = res.data && res.data.pagination.page_size
        this.total = res.data && res.data.pagination.total
      })
    },
    filterData() {
      this.params.current = 1
      this.loadData()
    }
  }
}
</script>
<style lang="less" scoped>
</style>
