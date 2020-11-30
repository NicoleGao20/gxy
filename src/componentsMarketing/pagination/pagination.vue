<template>
  <div class="pagination_wrap">
    <div class="all">
      <template>
        <el-checkbox v-if="isAll==true" v-model="checked" @change="allChange">选择全部</el-checkbox>
      </template>
    </div>
    <el-pagination
      :background="paginationBackground"
      :current-page="pageNum"
      :page-sizes="page_sizes"
      :page-size="pageSize"
      :layout="layouts"
      :total="count"
      :small="small||false"
      :pager-count="countPager"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>
<script>
export default {
  props: {
    pageSize: {
      type: Number,
      default: 10
    },
    count: {
      type: Number,
      default: null
    },
    isAll: {
      type: Boolean,
      default: false
    },
    check: {
      type: Boolean,
      default: false
    },
    pageNum: {
      type: Number,
      default: 1
    },
    pagerCount: {
      type: Number,
      default: null
    },
    small: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      page_sizes: [10, 20, 30, 50, 100],
      layouts: "total, sizes, prev, pager, next, jumper",
      paginationBackground: true,
      checked: false,
      countPager: this.pagerCount ? this.pagerCount : 7
    };
  },
  watch: {
    check() {
      this.checked = this.check;
    }
  },
  mounted() {
    this.checked = this.check;
  },
  methods: {
    handleSizeChange(val) {
      // pageSize 改变时会触发
      this.$emit("handleSizeChange", val);
    },
    handleCurrentChange(val) {
      // 当前页 改变时会触发
      this.$emit("handleCurrentChange", val);
    },
    allChange(val) {
      this.$emit("allChange", val);
    },
    parentMsg(val) {}
  }
};
</script>

<style scoped>
.pagination_wrap {
  position: relative;
  text-align: center;
  padding: 20px;
}
.pagination_wrap .all {
  position: absolute;
  left: 0;
}
</style>

