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
    isPrint: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      loading: false,
      chartObj: {},
      title: '',
      chartInstance: null
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
    del() {
      this.$confirm(' 确认删除图表吗 ?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        const is_del = 'Y'
        await this.updateRequestData({ id: this.chartObject.id, template: this.templateId, is_del: is_del })
        this.$emit('initData')
        this.$message({
          type: 'success',
          message: '删除成功！'
        })
      }).catch(() => {
        this.$message({
          type: 'success',
          message: '已取消删除'
        })
      })
    },
    async requestDataFun() {
      this.loading = true
      this.chartObj = await this.requestDataWrap({ id: this.chartObject.id })
      this.title = this.chartObj.data.title
      this.loading = false
      this.initChart()
    },
    initChart() {
      const xAxis = this.chartObj.data.xAxis
      const legend = this.chartObj.data.legend
      const series = this.chartObj.data.series
      const seriesList = []
      for (var i = 0; i < legend.length; i++) {
        seriesList.push({
          name: legend[i],
          type: 'line',
          stack: '总量',
          center: ['50%', '50%'],
          areaStyle: {},
          data: series[i]
        })
      }

      const option = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#6a7985'
            }
          }
        },
        legend: {
          data: legend,
          itemWidth: 10,
          itemHeight: 10,
          itemGap: 20,
          orient: 'vertical',
          bottom: 'bottom',
          icon: 'circle'
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '13%',
          top: '10%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            boundaryGap: false,
            data: xAxis
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        series: seriesList
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
  height: 300px;
  padding: 20px 20px;
  border-radius: 1px;
  position: relative;
  text-align: center;
  color: #435A82;
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
