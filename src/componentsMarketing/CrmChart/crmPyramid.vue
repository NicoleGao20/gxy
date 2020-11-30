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
    initChart(callBack) {
      const legend = this.chartObj.data.legend
      let series = this.chartObj.data.data || []
      series = series.reverse()
      const series1 = []
      const colors = ['#ebaa38', '#afd559', '#44c2d5', '#8383cc', '#6690ca', '#e7534c', '#bda854', '#5e85a8', '#00686b']
      series.map((item, index) => {
        series1.push({ value: (index + 1) * 20, name: item.name, rate: item.rate, val1: item.value })
      })

      const option = {
        color: colors,
        calculable: true,
        legend: {
          selectedMode: false,
          data: legend,
          bottom: 0
        },
        series: [
          {
            type: 'funnel',
            left: 'center',
            top: '1%',
            // bottom: 60,
            width: '80%',
            min: 0,
            // max: 100,
            minSize: '0',
            maxSize: '80%',
            sort: 'ascending',
            gap: 2,
            label: {
              show: true,
              position: 'inside',
              textBorderColor: 'transparent',

              formatter: (params) => {
                if (params.dataIndex === 0) {
                  return [
                    '{b| ' + params.data.name + '}',
                    '{b| ' + this.numFormat(params.data.val1) + '/' + params.data.rate + '}'
                  ].join('\n')
                } else {
                  return [
                    '{b| ' + params.data.name + ':' + this.numFormat(params.data.val1) + '/' + params.data.rate + '}'
                  ].join('\n')
                }
              },
              rich: {
                // textBorderColor: '#000',
                big: {
                  fontSize: 16,
                  fontWeight: 900,
                  color: '#000',
                  lineHeight: 20
                },
                b: {
                  fontSize: 13,
                  fontWeight: 500,
                  color: '#000',
                  lineHeight: 15
                },
                x: {
                  fontSize: 18,
                  fontFamily: 'Microsoft YaHei',
                  borderColor: '#449933',
                  borderRadius: 4
                }
              }
            },
            labelLine: {
              length: 40,
              lineStyle: {
                width: 1,
                type: 'solid'
              }
            },
            data: series1
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
    width: 100%;
    height: 500px;
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
