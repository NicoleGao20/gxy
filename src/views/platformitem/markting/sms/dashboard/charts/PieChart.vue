<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
import resize from './mixins/resize'

export default {
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '300px'
    }
  },
  data() {
    return {
      chart: null
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.initChart()
    })
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    initChart() {
      this.chart = echarts.init(this.$el, 'macarons')

      this.chart.setOption({
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          left: 'center',
          bottom: '10',
          data: ['引入期', '成长期', '成熟期', '休眠期', '流失期']
        },
        series: [
          {
            name: 'WEEKLY WRITE ARTICLES',
            type: 'pie',
            roseType: 'radius',
            radius: [15, 95],
            center: ['50%', '38%'],
            data: [
              { value: 320, name: '成长期' },
              { value: 240, name: '休眠期' },
              { value: 149, name: '成熟期' },
              { value: 200, name: '引入期' },
              { value: 59, name: '流失期' }
            ],
            animationEasing: 'cubicInOut',
            animationDuration: 2600
          }
        ]
      })
    }
  }
}
</script>
// 生命周期指标
// 引入期（近期活跃的新用户）：首次浏览小于30天，且前15天-1天内有浏览，且30天内成交1单及以下，t+1更新
// 成长期（近期活跃但贡献小的老用户）：首次浏览大于30天前，且前15天-1天内有浏览，且30天内成交1单及以下，t+1更新
// 成熟期（近期活跃且贡献大的用户）：前15天-1天内有浏览，且30天内成交2单及以上，t+1更新
// 休眠期（近期不活跃的用户）：前30天-16天内有浏览，但前15天-1天内无浏览，t+1更新
// 流失期（长期不活跃的用户）：前30天内无浏览，t+1更新