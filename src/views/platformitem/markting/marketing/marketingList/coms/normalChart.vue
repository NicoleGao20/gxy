<template>
  <div class="normal-contain">
    <div ref="normal" class="normal"/>
  </div>
</template>
<script>
import echarts from 'echarts'
export default {
  name: 'NormalChart',
  mounted() {
    const chart = echarts.init(this.$refs.normal)
    const colors = ['#ebaa38', '#afd559', '#44c2d5', '#8383cc', '#6690ca', '#e7534c', '#bda854', '#5e85a8', '#00686b']
    const option = {
      title: {
        text: '会员消费订单数量',
        textStyle: {
          color: '#888888',
          fontWeight: 'normal',
          fontSize: 15
        }
      },
      color: colors,
      tooltip: {
        trigger: 'axis',
        axisPointer: { // 坐标轴指示器，坐标轴触发有效
          type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: [
        {
          type: 'category',
          data: ['Mon', 'Tue', 'Wed', 'Thu'],
          axisTick: {
            alignWithLabel: true
          }
        }
      ],
      yAxis: [
        {
          type: 'value',
          splitNumber: 4,
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          }
        }
      ],
      series: [
        {
          name: '直接访问',
          type: 'bar',
          barWidth: '60%',
          label: {
            show: true,
            position: 'top',
            color: '#444444',
            formatter: '{b}:{c}'
          },
          data: [10, 390, 330, 220]
        }
      ]
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
  .normal-contain{
    border: solid 1px rgb(228, 228, 228, 1);
    padding: 15px;
    margin-bottom: 20px;
    .normal{
      width: 300px;
      height: 300px;
    }
  }
</style>
