<template>
  <div class="contain">
    <div ref="pie" class="pie"/>
  </div>
</template>
<script>
import echarts from 'echarts'
export default {
  name: 'PieChart',
  props: {
    info: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  mounted() {
    const nData = []
    this.info.data.forEach(ele => {
      nData.push({ value: Number(ele.num), name: ele.name })
    })
    const chart = echarts.init(this.$refs.pie)
    const colors = ['#ebaa38', '#afd559', '#44c2d5', '#8383cc', '#6690ca', '#e7534c', '#bda854', '#5e85a8', '#00686b']
    const option = {
      title: {
        text: this.info.title,
        // subtext: '总人数: 84595人',
        textStyle: {
          color: '#888888',
          fontWeight: 'normal',
          fontSize: 15
        }
      },
      color: colors,
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b} : {c} ({d}%)'
      },
      grid: {
        width: '70%'
      },
      series: [
        {
          name: this.info.title,
          type: 'pie',
          radius: '60%',
          minAngle: 5,
          center: ['50%', '60%'],
          data: nData,
          label: {
            formatter: (mate) => {
              if (this.info.type === 'GenderDistribution' || this.info.type === 'VersionPersonDistribution') {
                // 人
                return `${mate.data.name}: ${mate.data.value}人 \n ${mate.percent}%`
              } else {
                // 单
                return `${mate.data.name}: ${mate.data.value}单 \n ${mate.percent}%`
              }
            }
          },
          itemStyle: {
            emphasis: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      ]
    }
    if (this.info.type === 'VersionPersonDistribution') option.title.subtext = '总人数: ' + this.info.totalNum
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
  .contain{
    display: inline-block;
    width: 100%;
    border: solid 1px rgb(228, 228, 228, 1);
    padding: 15px;
    .pie{
      width: 100%;
      height: 350px;
    }
  }
</style>
