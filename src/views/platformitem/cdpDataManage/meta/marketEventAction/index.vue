<template>
  <div class="page-container">
    <div class="search-wrap">
      <el-form label-position="right" label-width="80px">
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="动作名称">
              <el-select v-model="searchForm.act_type" style="width: 100%;" clearable>
                <el-option v-for="(action, index) in actionNodeTypes" :key="index" :label="action.label" :value="action.value" placeholder="请选择动作名称"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="动作编号">
              <el-input v-model="searchForm.action_id" clearable placeholder="请输入动作编号"/>
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
    <el-table v-loading="loading" stripe :data="list" max-height="550" border style="margin-top: 10px;">
      <el-table-column label="动作编号" prop="action_id"/>
      <el-table-column label="动作名称">
        <template slot-scope="scope">
          {{ getLabelByValue(scope.row.act_type, actionNodeTypes) }}
        </template>
      </el-table-column>
      <!-- <el-table-column label="动作描述"/> -->
      <el-table-column label="创建时间" prop="create_time"/>
      <!-- <el-table-column label="操作"/> -->
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
// getActionList 接口不存在 暂时注释掉
// import { getActionList } from '@/api/marketEvent'
import cacheCondition from '@/utils/cacheCondition'
export default {
  mixins: [cacheCondition],
  data() {
    return {
      searchForm: {
        act_type: '',
        action_id: ''
      },
      actionNodeTypes: [
        {
          label: '优惠券',
          value: 'coupon'
        },
        {
          label: '异业券',
          value: 'crossCoupon'
        },
        {
          label: '微信模版消息',
          value: 'wxTemplateMsg'
        },
        {
          label: '短信',
          value: 'phoneSms'
        },
        {
          label: '图文素材',
          value: 'wxNews'
        },
        {
          label: 'APP PUSH',
          value: 'appPush'
        }
      ],
      options: [],
      total: 0,
      params: {
        page_size: 10,
        current: 1
      },
      loading: false,
      list: []
    }
  },
  mounted() {
    this.loadData()
  },
  methods: {
    loadData() {
      // this.loading = true
      var params = {
        ...this.params,
        ...this.searchForm
      }
      for (var attr in params) {
        if (!params[attr]) delete params[attr]
      }
      // getActionList(params).then(res => {
      //   this.loading = false
      //   this.list = res.data.list
      //   this.params.current = res.data.pagination.current
      //   this.params.pageSize = res.data.pagination.pageSize
      //   this.total = res.data.pagination.total
      // }).catch(fail => {
      //   this.loading = false
      // })
    },
    filterData() {
      this.params.current = 1
      this.loadData()
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
<style lang="less">
  .page-container{
    min-height: 100%;
    background: white;
  }
  .search-wrap{
    padding: 0;
    margin: 0px 0;
  }
</style>
