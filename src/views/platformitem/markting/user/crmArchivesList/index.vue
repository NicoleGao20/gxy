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
    <el-table v-loading="tableLoading" :data="tableData" border style="width: 100%">
      <el-table-column
        :resizable="false"
        fixed="left"
        prop="member_id"
        label="会员卡号"
        align="center"
      />
      <el-table-column
        :resizable="false"
        prop="level_name"
        label="会员等级"
        align="center"
      />
      <el-table-column
        :resizable="false"
        prop="mobile_bind"
        label="手机号"
        align="center"
      />
      <el-table-column
        :resizable="false"
        prop="amt_payment"
        label="购买金额"
        align="center"
      />
      <el-table-column
        :resizable="false"
        prop="cnt_order"
        label="下单次数"
        align="center"
      />
      <el-table-column
        :resizable="false"
        prop="cnt_refund"
        label="退款次数"
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
        prop="cnt_member"
        label="成为会员天数"
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
            @click="jump(scope.row.member_id)">
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
  </div>
</template>

<script>
import { getMemberFilterResult } from '@/api/markting/vipArchives'
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
      obj.type = 'member'
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
      this.$router.push({ name: 'crmArchivesPortrait', query: { memberId: id }})
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
