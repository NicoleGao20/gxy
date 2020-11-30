<template>
  <div class="progress-contain">
    <p class="title">{{ info.desc }}</p>
    <div v-for="(pro, j) in info.branchDetail" :key="j">
      <progress-line :progress="pro" :index="j" :parent="info"/>
    </div>
  </div>
</template>
<script>
import echarts from 'echarts'
import progressLine from './progress'
export default {
  name: 'ProgressChart',
  components: {
    progressLine
  },
  props: {
    info: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  mounted() {
    const chart = echarts.init(this.$refs.progress)
    const colors = ['#ebaa38', '#afd559', '#44c2d5', '#8383cc', '#6690ca', '#e7534c', '#bda854', '#5e85a8', '#00686b']
    const option = {
      tooltip: {
        trigger: 'axis',
        axisPointer: { // 坐标轴指示器，坐标轴触发有效
          type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
        }
      },
      color: colors,
      grid: {
        left: 0,
        right: 0,
        top: 0,
        bottom: 0
      },
      xAxis: {
        type: 'value',
        show: false
      },
      yAxis: {
        type: 'category',
        show: false,
        data: ['张数']
      },
      series: [{
        type: 'bar',
        name: '核销张数',
        data: [this.info.actual_num],
        // barWidth: 30,
        z: 10,
        itemStyle: {
          color: '#60acfc'
        }
      }, {
        type: 'bar',
        name: '成功发送总数',
        data: [this.info.total_num],
        barGap: '-100%',
        itemStyle: {
          color: '#e5f0fe'
        }
      }]
    }
    chart.setOption(option)
    const fn = () => {
      chart.resize()
    }
    window.addEventListener('resize', fn)
    this.$on('hook:beforeDestroy', () => {
      window.removeEventListener('resize', fn)
    })
  }
}
</script>
<style lang="less">
  .progress-contain{
    margin-bottom: 10px;
    .title{
      padding: 15px;
      font-size: 14px;
      color: rgb(96, 98, 102);
      box-sizing: border-box;
      border-color: rgba(201, 201, 201, 1);
      background-color: rgba(228, 228, 228, 0.2);
    }
  }
</style>
