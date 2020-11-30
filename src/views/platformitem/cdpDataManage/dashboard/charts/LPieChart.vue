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
      default: '260px'
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
        formatter: '{a} <br/>{b}: {c} ({d}%)'
    },
    legend: {
        orient: 'vertical',
        left: 10,
        data: ['未运行', '等待运行', '运行中', '运行成功', '运行失败']
    },
    series: [
        {
            name: '运行状态',
            type: 'pie',
            radius: ['50%', '70%'],
            avoidLabelOverlap: false,
            label: {
                show: false,
                position: 'center'
            },
            emphasis: {
                label: {
                    show: true,
                    fontSize: '30',
                    fontWeight: 'bold'
                }
            },
            labelLine: {
                show: false
            },
            data: [
                {value: 12, name: '未运行'},
                {value: 2, name: '运行失败'},
                {value: 23, name: '运行中'},
                {value: 4, name: '等待运行'},
                {value: 32, name: '运行成功'}
            ]
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