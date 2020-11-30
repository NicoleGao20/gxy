<template>
  <div>
    <el-form>
      <el-form-item>
        <rule-filter ref="ruleFilter" applicationType="complex_group" :hidden-people-counts="true" :hidden-remove-box="true"/>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getFilterJson">查询</el-button>
        <el-button type="primary" @click="clearFilter">重置</el-button>
      </el-form-item>
    </el-form>
    <main class="tableMainContent">
    <el-table v-loading="tableLoading" :data="tableData" border style="width: 100%">
      <el-table-column
        :resizable="false"
        fixed="left"
        prop="mobile_bind"
        label="手机号"
        align="center"
      />
      <el-table-column
        :resizable="false"
        prop="last_order_time"
        label="最近购买时间"
        align="center"
      />
      <el-table-column
        :resizable="false"
        prop="platform_name"
        label="最近购买渠道"
        align="center"
      />
      <el-table-column
        :resizable="false"
        prop="avg_oder_time"
        label="回购周期"
        align="center"
      />
      <el-table-column
        :resizable="false"
        prop="cnt_potential"
        label="成为潜客天数"
        align="center"
      />
      <el-table-column
        :resizable="false"
        prop="operation"
        label="操作"
        align="center"
      >
        <template slot-scope="scope">
          <el-button
            type="text"
            @click="jump(scope.row.buyer_id)">
            查看
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      :page-num="page_num"
      :page-size="page_size"
      :pager-count="5"
      :count="counts"
      @handleSizeChange="changePageSize"
      @handleCurrentChange="changePageNum"
    />
    </main>
  </div>
</template>

<script>
import { getMemberFilterResult } from '@/api/markting/memberArchives'
import ruleFilter from '@/componentsMarketing/FilterCombine/ruleFilter'
import pagination from '@/componentsMarketing/pagination/pagination'
export default {
  components: {
    ruleFilter,
    pagination
  },
  data() {
    return {
      tableData: [],
      tableLoading: false,
      filter:'',
      // 分页
      page_num: 1,
      page_size: 10,
      counts: 0
    }
  },
  mounted() {
    this.getTableData(1, 10)
  },
  methods: {
    clearFilter() {
      this.$refs.ruleFilter.clearCondtions()
      this.filter = null
      this.$nextTick(()=>{
        this.getTableData(1, 10)
      })
    },
    getFilterJson() {
      this.$refs.ruleFilter.validateRuleValue().then(() => {
        this.filter = this.$refs.ruleFilter.getFilterJson()
        this.$nextTick(()=>{
          this.getTableData(1, 10)
        })
      }).catch(e => {

      })
    },
    getTableData(pageNum, pageSize) {
      this.tableLoading = true
      let obj = {}
      if(this.filter) obj.json_sql = this.filter
      obj.current = pageNum
      obj.size = pageSize
      obj.type = 'buyer'
      getMemberFilterResult(obj).then(({data})=>{
        this.tableData = data.rows
        this.page_num = data.pageNum
        this.page_size = data.pageSize
        this.counts = data.total
        this.tableLoading = false
      }).catch(()=>{
        this.tableLoading = false
      })
    },
    changePageSize(val) {
      this.getTableData(1, val)
    },
    changePageNum(val) {
      this.getTableData(val, this.page_size)
    },
    jump(id) {
      this.$router.push({ name: 'userArchivesPortrait', query: { buyerId: id }})
    }
  }
}
</script>

<style lang="scss" scoped>
.crmArchivesList{
  margin: 20px;
  padding: 20px;
  background: #fff;
}
</style>
