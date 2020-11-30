<template>
  <div class="chart1Box">
    <div >
      <span>{{ chartObject.TITLE }}</span>
      <span v-if="chartObject.RATE"/>
    </div>
    <div >
      <span>{{ chartObject.NUM }}</span>
      <span v-if="chartObject.RATE">/  {{ chartObject.RATE }}%</span>
    </div>
    <i v-if="is_show" class="el-icon-close" @click="del" />
  </div>
</template>
<script>
export default {
  props: {
    chartObject: {
      type: Object,
      default: function() {
        return {}
      }
    },
    updateRequestData: {
      type: Function,
      default: function() {}
    },
    id: {
      type: String,
      default: ''
    },
    titleName: {
      type: String,
      default: ''
    },
    is_show: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    del() {
      this.$confirm(' 确认删除图表吗 ?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        const is_del = 'Y'
        await this.updateRequestData({ id: this.chartObject.id, template: this.templateId, is_del: is_del })
        this.$message({
          type: 'info',
          message: '删除成功！'
        })
        this.$emit('initData')
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    }
  }
}
</script>
<style lang="less" scoped>
.chart1Box{
  position: relative;
  overflow: hidden;
  display: flex;
  cursor: pointer;
  flex-direction:  column ;
  justify-content : center ;
  font-size: 14px;
  width: 100%;
  height: 70px;
  background-color: #eef6fd;
  text-align: center;
  color: #61acee;
  padding: 20px 10px;
  box-sizing: border-box;
  border: 1px dashed #61acee;
  &>div{
    height:25px;
    line-height:25px;
  }
  .el-icon-close{
    position: absolute;
    font-size: 14px;
    font-weight: 800;
    color: #645b5b;
    right: 5px;
    top: 5px;
  }
}
</style>
