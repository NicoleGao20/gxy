<template>
  <div class="contain">
    <div ref="mixing" class="mixing" />
  </div>
</template>
<script>
import echarts from 'echarts'
export default {
  name: 'MixedChart',
  props: {
    info: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  mounted() {
    const chart = echarts.init(this.$refs.mixing)
    const days = []
    const humanArr = []
    const consumption = []
    this.info.data.forEach(ele => {
      days.push(ele.day)
      humanArr.push(ele.human_num)
      consumption.push(ele.consumption_amount)
    })
    const colors = [
      '#ebaa38',
      '#afd559',
      '#44c2d5',
      '#8383cc',
      '#6690ca',
      '#e7534c',
      '#bda854',
      '#5e85a8',
      '#00686b'
    ]
    const option = {
      title: {
        text: this.info.title,
        textStyle: {
          color: '#888888',
          fontWeight: 'normal',
          fontSize: 15
        }
      },
      color: colors,
      tooltip: {
        trigger: 'axis',
        backgroundColor: 'rgba(255,255,255,.7)',
        textStyle: {
          color: '#444444'
        },
        axisPointer: {
          type: 'shadow',
          label: {
            backgroundColor: 'rgba(255,255,255,.5)'
          }
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '8%',
        containLabel: true
      },
      legend: {
        data: ['人数', '销售额'],
        bottom: '0px'
      },
      xAxis: [
        {
          type: 'category',
          boundaryGap: true,
          data: days,
          axisTick: {
            alignWithLabel: true
          }
        },
        {
          type: 'category',
          boundaryGap: true
        }
      ],
      yAxis: [
        {
          type: 'value',
          // name: '人数',
          splitNumber: 4,
          // min: 'dataMin',
          // max: 5,
          minInterval: 1,
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            formatter: '{value}人'
          }
        },
        {
          type: 'value',
          // name: '销售额',
          splitNumber: 4,
          splitLine: {
            show: false
          },
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            formatter: '{value}元'
          }
        }
      ],
      series: [
        {
          name: '人数',
          type: 'bar',
          data: humanArr,
          barWidth: '30%',
          barMinHeight: 5,
          label: {
            normal: {
              show: true,
              position: 'top',
              color: '#444444'
            }
          }
        },
        {
          name: '销售额',
          type: 'line',
          data: consumption,
          label: {
            normal: {
              show: true,
              position: 'top',
              color: '#444444'
            }
          },
          yAxisIndex: 1
        }
      ]
    }
    chart.setOption(option, true)
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
.contain {
  border: solid 1px rgb(228, 228, 228, 1);
  padding: 15px;
  .mixing {
    width: 100%;
    height: 350px;
  }
}
</style>
