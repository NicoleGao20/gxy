<template >
  <el-popover
    placement="bottom-start"
    trigger="hover"
  >
    <div class="staff-info-content">
      <p v-if="num">工号:{{ num }}</p>
      <p v-if="department">部门：{{ department }}</p>
    </div>
    <div slot="reference"><slot/></div>
  </el-popover>
</template>
<script>
export default {
  name: 'StaffInfo',
  props: {
    num: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      department: ''
    }
  },
  mounted() {
    setTimeout(() => {
      this.department = '伯俊软件/新零 售平台/集团科技中心 /会员系统部/产品组'
    }, 500)
  }
}
</script>
<style lang="less" scoped>
  .staff-info-content {
    max-width: 180px;
  }
</style>
