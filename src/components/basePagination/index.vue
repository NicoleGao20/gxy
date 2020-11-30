<template>
  <div style="text-align: right">
    <el-pagination
       class="bottomPagination"
      :current-page="value"
      :page-sizes="pageSizes"
      :page-size="pageSize"
      :total="total"
      background
      layout="total, sizes, prev, pager, next, jumper"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>
<script>
export default {
  props: {
    value: {
      type: Number,
      default: 1
    },
    pageSize: {
      type: Number,
      default: 10
    },
    pageSizes: {
      type: Array,
      default() {
        return [10, 20, 30, 40]
      }
    },
    total: {
      type: Number,
      default: 0
    }
  },
  methods: {
    handleSizeChange(size) {
      this.$emit('update:pageSize', size)
      if (this.value !== 1) {
        this.$emit('input', 1)
      }
      this.$emit('loadData')
    },
    handleCurrentChange(curPage) {
      this.$emit('input', curPage)
      this.$emit('loadData')
    }
  }
}
</script>
<style lang="less" scoped>
   /deep/ .el-pagination__total{
     float: left;
   }
   /deep/ .el-pagination__sizes{
     float: left;
   }
</style>
