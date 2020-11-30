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
        
    xAxis: {
        type: 'category',
        data: ['00:00', '01:00', '02:00', '03:00', '04:00', '05:00', '06:00',
           '07:00', '08:00', '09:00', '10:00', '11:00', '12:00', 
           '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', 
           '19:00', '20:00', '21:00', '22:00', '23:00']
    },
    yAxis: {
        type: 'value'
    },
    series: [{
        data: [3, 0, 10, 2, 0, 0, 0, 0, 0, 0, 2, 1, 3, 0, 0, 0, 0, 0, 2, 1, 3, 0, 3, 3],
        type: 'line',
        smooth: true
    }]
      })
    }
  }
}
</script>