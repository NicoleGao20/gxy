<template>
  <div class="page-container">
    <div class="search-wrap">
      <el-form label-position="right" label-width="80px">
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="事件名称">
              <el-input v-model="searchForm.table_name_show" clearable @keyup.enter.native="filterData"/>
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
    <main class="tableMainContent">
      <!-- <el-button type="primary" @click="hrefEdit">新增</el-button> -->
      <el-table v-loading="loading" stripe :data="tableList" max-height="550" border style="margin-top: 10px;">
        <el-table-column label="事件名称" prop="table_name_show" width="150" fixed="left"/>
        <el-table-column label="事件类型" prop="business_type" width="150" fixed="left">
          <template slot-scope="scope">
            {{ getLabelByValue(scope.row.business_type, eventTypeList) }}
          </template>
        </el-table-column>
        <el-table-column label="备注" prop="table_name_desc" width="300"/>
        <el-table-column label="事件对象" prop="marketing_target" width="150">
          <template slot-scope="scope">
            {{ scope.row.marketing_target === 'member_id' ? '会员' : '关注者' }}
          </template>
        </el-table-column>
        <el-table-column label="创建人" prop="create_user" width="150" />
        <el-table-column label="创建时间" prop="create_time" width="150" />
        <el-table-column label="修改人" prop="update_user" width="180" />
        <el-table-column label="修改时间" prop="update_time" width="180" />
        <el-table-column label="操作" width="160" fixed="right">
          <template slot-scope="scope">
            <el-button type="text" @click="handler(scope.row, 'view')">查看</el-button>
            <el-button type="text" @click="handler(scope.row, '')">编辑</el-button>
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
    </main>
  </div>
</template>
<script>
import { queryEventParamEventList } from '@/api/marketEvent'
import { mixinDel } from '@/utils/index'
import cacheCondition from '@/utils/cacheCondition'

export default {
  name: 'MarketEventList',
  mixins: [mixinDel, cacheCondition],
  data() {
    return {
      params: {
        page_size: 10,
        current: 1
      },
      total: 10,
      pageSizes: [10, 20, 30, 40],
      loading: false,
      tableList: [],
      searchForm: {
        table_name_show: ''
      },
      eventTypeList: [
        { label: '会员事件', value: 'member' },
        { label: '消费事件', value: 'order' },
        { label: '活动事件', value: 'activities' },
        { label: '浏览/点击事件', value: 'scan_click' },
        { label: '微信事件', value: 'weixin' }
      ]
    }
  },
  mounted() {
    this.loadData()
  },
  methods: {
    hrefEdit() {
      this.$router.push({ name: 'marketEventFieldAdd' })
    },
    filterData() {
      this.params.current = 1
      this.loadData()
    },
    loadData() {
      this.loading = true
      var params = {
        ...this.params,
        ...this.searchForm
      }
      for (var attr in params) {
        if (!params[attr]) delete params[attr]
      }
      queryEventParamEventList(params).then(res => {
        this.loading = false
        this.tableList = res.data.list
        this.params.current = res.data.pagination.current
        this.params.pageSize = res.data.pagination.pageSize
        this.total = res.data.pagination.total
      }).catch(fail => {
        this.loading = false
      })
    },
    handler(row, type) {
      this.$router.push({
        name: 'marketEventFieldAdd',
        query: {
          id: row.id,
          view: type
        }
      })
    },
    del(row) {
      this.openDeleteModal((closeModal) => {
        // 发送请求，调用cb
        // deleteEvent({ id: row.id }).then(() => {
        //   closeModal()
        // }, (data) => {
        //   closeModal()
        // })
      })
    },
    getLabelByValue(value, list, opts) {
      if (!list || list.length === 0) return ''

      opts = opts || { valueKey: 'value', labelKey: 'label' }
      for (var i = 0, len = list.length; i < len; i++) {
        if (list[i][opts.valueKey] === value) {
          return list[i][opts.labelKey]
        }
      }

      return ''
    }
  }
}
</script>
<style lang="less" scoped>
  .page-container{
    min-height: 100%;
    background: white;
  }
  .search-wrap{
    padding: 0;
    margin: 0px 0;
  }
</style>
