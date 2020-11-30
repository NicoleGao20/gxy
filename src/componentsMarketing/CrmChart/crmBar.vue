<template>
  <div class="chartBoxs" >
    <div v-loading="loading" :class="is_no_border? 'is_border' :'no_border'" class="dataChartBox" >
      <div v-if="tAxis && tAxis.length">
        <span>
          {{ title }}
          <el-tooltip placement="right" effect="light" popper-class="primary-poper">
            <i class="showMore el-icon-question"/>
            <div slot="content">
              <div v-for="(rowText, index) in tAxis.split(/\r\n/)" :key="index">
                {{ rowText }}
              </div>
            </div>
          </el-tooltip>
        </span>
      </div>
      <i v-if="is_show" class="el-icon-close" @click="del(id)"/>
      <div ref="chart" class="chartStyle" />
    </div>
  </div>
</template>
<script>
import echarts from 'echarts'
import cacheChart from './cacheChart'
export default {
  componentName: 'crmBar',
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
      title: '',
      chartInstance: null,
      chartObj: { data: {}}
    }
  },
  computed: {
    tAxis() {
      return this.chartObj.data.tAxis
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

    this.$on('hook:beforeDestroy', () => {
      this.chartInstance.dispose()
      this.chartInstance = null
    })

    this.chartInstance.on('finished', () => {
      this.$emit('chartNum', 1)
    })
    this.requestDataFun()
  },
  methods: {
    async requestDataFun() {
      this.loading = true
      let param = {}
      if (this.brandBoolean !== true) {
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
    initChart() {
      const colors = ['#9999cc', '#ffd996', '#91c5f3', '#6a92cb', '#41c7db', '#006699', '#0099cc']
      const xAxis = this.chartObj.data.xAxis
      const legend = this.chartObj.data.legend
      const series = this.chartObj.data.series
      const option = {
        color: colors,
        legend: {
          bottom: 0
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          // bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            data: xAxis,
            axisTick: {
              alignWithLabel: true
            },
            axisLabel: {// 坐标轴刻度标签的相关设置。
              verticalAlign: 'top',
              interval: 0,
              rotate: 15,
              formatter: function(value) {
                var str = ''
                var num = 6// 每行显示字数
                var valLength = value.length // 该项x轴字数
                var rowNum = Math.ceil(valLength / num) // 行数

                if (rowNum > 1) {
                  for (var i = 0; i < rowNum; i++) {
                    var temp = ''
                    var start = i * num
                    var end = start + num

                    temp = value.substring(start, end) + '\n'
                    str += temp
                  }
                  return str
                } else {
                  return value
                }
              }
            }
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        series: [
          {
            name: legend,
            type: 'bar',
            barWidth: '20%',
            data: series
          }
        ]
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
  position: relative;
  width: 100%;
  height: 350px;
  padding: 20px 20px;
  border-radius: 1px;
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
