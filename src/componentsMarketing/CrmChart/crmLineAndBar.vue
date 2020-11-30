<template>
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
      title: '',
      chartObj: { data: {}}
    }
  },
  computed: {
    tAxis() {
      return this.chartObj.data.tAxis
    },
    xAxis() {
      return this.chartObj.data.xAxis
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
    numFormat(num) {
      var c = (num.toString().indexOf('.') !== -1) ? num.toLocaleString() : num.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,')
      return c
    },
    initChart() {
      const colors = ['#9999cc', '#ffd996', '#91c5f3', '#6a92cb', '#41c7db', '#006699', '##0099cc']
      const legend = this.chartObj.data.legend
      const xAxis = this.chartObj.data.xAxis
      const getYAxis = this.chartObj.data.yAxis
      const yAxis = []
      const series = []

      getYAxis.map((item, index) => {
        if (index === 0) {
          var MaxYData = Math.max.apply(null, item)
          series.push({
            name: legend[index],
            type: 'bar',
            barWidth: '13%',
            // barMinHeight: 10,
            data: item
          })
          yAxis.push({
            type: 'value',
            name: legend[index],
            splitNumber: 4,
            // yAxisIndex: 0,
            // min: 0,
            max: MaxYData,
            // interval: 50,
            axisLabel: {
              formatter: '{value}'
            }
          })
        } else if (index === 1) {
          series.push({
            name: legend[index],
            type: 'line',
            valueType: 'percent',
            yAxisIndex: 1,
            data: item

          })
          yAxis.push({
            type: 'value',
            name: legend[index],
            // yAxisIndex: 1,
            // min: 0,
            // max: 250,
            // interval: 5,

            // yAxisIndex: 0,
            // min: 0,
            max: 100,
            splitNumber: 4,
            splitLine: {
              show: false
            },
            axisLabel: {
              formatter: '{value} %'
            }
          })
        }
      })
      const option = {
        tooltip: {
          trigger: 'axis',
          formatter: (params) => {
            var html = params[0].name + '<br>'
            for (var i = 0; i < params.length; i++) {
              html += `<span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:${params[i].color}"></span>`
              if (option.series[params[i].seriesIndex].valueType === 'percent') {
                html += params[i].seriesName + ':' + params[i].value + '%<br>'
              } else {
                html += params[i].seriesName + ':' + this.numFormat(params[i].value) + '<br>'
              }
            }
            return html
          }
        },
        color: colors,
        legend: {
          data: legend,
          bottom: 0
        },
        xAxis: [
          {
            type: 'category',
            data: xAxis,
            axisLabel: {
              verticalAlign: 'top',
              interval: 0,
              rotate: 25,
              formatter: function(value) {
                var arr = []
                if (value.length > 5 && value.indexOf('-') > -1) {
                  arr = value.split('-')
                  arr[0] = arr[0] + '-'
                  return arr.join('\n')
                } else {
                  return value
                }
              }
            }
          }
        ],
        yAxis: yAxis,
        series: series
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
.showDiv {
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
}
.containTip {
  flex: 1;
  position: relative;
  left: 10px;
  display: block;
}
.cssarrow {
  display: none;
  position: absolute;
  top: -20px;
  // left: 15px;
  // left: 160px;
  z-index: 9999;
	background: #435A82;
  border: 3px solid #435A82;
  color: white;
  font-weight: normal;
  font-size: 13px;
  > p {
    line-height: 1.6;
  }
}
.cssarrow:after,
.cssarrow:before {
	right: 100%;
	top: 20px;
	border: solid transparent;
	content: " ";
	height: 0;
	width: 0;
	position: absolute;
	pointer-events: none;
}
.cssarrow:after {
	border-color: rgba(136, 183, 213, 0);
	border-right-color: #435A82;
	border-width: 6px;
	margin-top: 0px;
}
.cssarrow:before {
	border-color: rgba(194, 225, 245, 0);
	border-right-color: #435A82;
	border-width: 9px;
	margin-top: -3px;
}
.showMore{
  cursor: pointer;
}
.showMore:hover + .containTip .cssarrow {
  display: block;
}
</style>
