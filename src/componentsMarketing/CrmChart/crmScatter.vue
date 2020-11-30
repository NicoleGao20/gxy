<template>
  <div v-loading="loading" :class="is_no_border? 'is_border' :'no_border'" class="dataChartBox" >
    <span>{{ title }}</span>
    <i v-if="is_show" class="el-icon-close" @click="del"/>
    <div ref="chart" class="chartStyle" />
  </div>
</template>
<script>
import echarts from 'echarts'
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
    },
    startTime: {
      type: String,
      default: ''
    },
    endTime: {
      type: String,
      default: ''
    },
    isPrint: {
      type: Boolean,
      default: false
    }

  },
  data() {
    return {
      loading: false,
      title: ''
    }
  },
  mounted() {
    var fn
    this.chartInstance = echarts.init(this.$refs['chart'])
    if (!this.isPrint) {
      fn = () => {
        this.chartInstance.resize()
      }
      window.addEventListener('resize', fn, false)
      this.$on('hook:beforeDestroy', () => {
        window.removeEventListener('resize', fn)
      })
    }
    this.chartInstance.on('finished', () => {
      this.$emit('chartNum', 1)
    })

    this.$on('hook:beforeDestroy', () => {
      this.chartInstance.dispose()
      this.chartInstance = null
    })
    this.requestDataFun()
  },
  methods: {
    async requestDataFun() {
      this.loading = true
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
        param = { brand_detail_no: this.brand_detail_no, id: this.chartObject.id, startTime: this.startTime, endTime: this.endTime }
      }
      for (var i in param) {
        if (!param[i] && i === 'version') delete param[i]
        if (!param[i] && i === 'marketAction') delete param[i]
      }
      this.chartObj = await this.requestDataWrap(param)
      this.loading = false
      this.title = this.chartObj.data.title
      this.initChart()
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
    },
    initChart(callBack) {
      // const colors = ['#9999cc', '#ffd996', '#91c5f3', '#6a92cb', '#41c7db', '#006699', '##0099cc']
      // const legend = this.chartObj.data.legend
      const data = this.chartObj.data.series.data
      // const getYAxis = this.chartObj.data.yAxis
      // const yAxis = []
      // const series = []

      const option = {
        tooltip: {
          trigger: 'item',
          formatter: '{b}: {c} '
        },
        xAxis: {
          type: 'category'
        },
        yAxis: {

        },
        series: [{
          symbolSize: 8,
          data: data,
          type: 'scatter'
        }]
      }
      if (this.chartInstance) {
        this.chartInstance.setOption(option)
      }
    }
  }
}
</script>
<style lang="less" scoped>
.is_border{
  border: 1px solid #d3d5de;
}
.no_border{
  border: none
}
.dataChartBox{
    width: 100%;
    height: 400px;
    padding: 20px 20px;
    border-radius: 1px;
    position: relative;
    text-align: left;
    color: #435A82;
    span{
      font-weight: 600;
    }
  .chartStyle{
    width: 100%;
    height: 100%;
  }
  .el-icon-close{
    position: absolute;
    font-size: 14px;
    font-weight: 800;
    right: 8px;
    top: 8px;
    cursor: pointer;
  }
}
</style>
