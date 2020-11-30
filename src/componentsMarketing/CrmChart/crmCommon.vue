<template>
  <div class="chart1Box">
    <div >
      <span>{{ chartObject.crmTitle }}</span>
      <!-- <span v-if="chartObject.crmRate">/ 占比</span> -->
    </div>
    <div >
      <span>{{ crmNum }}</span>
      <!-- <span v-if="chartObject.crmRate">/  {{ chartObject.crmRate }}</span> -->
    </div>
    <i v-if="is_show" class="el-icon-close" @click="del" />
  </div>
</template>
<script>
import cacheChart from './cacheChart'
export default {
  mixins: [cacheChart],
  props: {
    version: {
      type: String,
      default: ''
    },
    marketAction: {
      type: String,
      default: ''
    },
    link_resource: {
      type: String,
      default: 'all'
    },
    labelId: {
      type: [String, Number],
      default: '938'
    },
    actionId: {
      type: String,
      default: ''
    },
    marketingNo: {
      type: String,
      default: ''
    },
    createType: {
      type: String,
      default: 'filter'
    },
    groupDataTable: {
      type: String,
      default: ''
    },
    crowdFilter: {
      type: String,
      default: ''
    },
    FilterJson: {
      type: String,
      default: ''
    },
    chartObject: {
      type: Object,
      default: function() {
        return {}
      }
    },
    requestData: {
      type: Function,
      default: function() {
      }
    },
    updateRequestData: {
      type: Function,
      default: function() {}
    },
    templateId: {
      type: Number,
      default: 50000
    },
    is_show: {
      type: Boolean,
      default: true
    },
    is_no_border: {
      type: Boolean,
      default: true
    },
    brand_detail_no: {
      type: String,
      default: ''
    },
    brandBoolean: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      crmNum: ''
    }
  },
  mounted() {
    this.requestDataFun()
  },
  methods: {
    async requestDataFun() {
      let param = {}
      if (this.brandBoolean !== true) {
        // 添加侧拉弹出需求字段
        param = { templateId: this.templateId,
          id: this.chartObject.id,
          link_resource: this.link_resource,
          createType: this.createType,
          labelId: this.labelId,
          actionId: this.actionId,
          marketingNo: this.marketingNo,
          groupDataTable: this.groupDataTable,
          crowdFilter: this.crowdFilter,
          version: this.version,
          marketAction: this.marketAction,
          filterJson: this.FilterJson }
      } else {
        param = { brand_detail_no: this.brand_detail_no, id: this.chartObject.id }
      }
      for (var i in param) {
        if (!param[i] && i === 'version') delete param[i]
        if (!param[i] && i === 'marketAction') delete param[i]
      }
      this.chartObj = await this.requestDataWrap(param)
      this.title = this.chartObj.data.title
      this.crmNum = this.numFormat(this.chartObj.data.crmNum)
    },
    numFormat(num) {
      var c = (num.toString().indexOf('.') !== -1) ? num.toLocaleString() : num.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,')
      return c
    },
    async del() {
      this.$confirm(' 确认删除图表吗 ?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        const is_del = 'Y'
        await this.updateRequestData({ id: this.chartObject.id, template: this.templateId, is_del: is_del })
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
  padding: 20px 20px;
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
