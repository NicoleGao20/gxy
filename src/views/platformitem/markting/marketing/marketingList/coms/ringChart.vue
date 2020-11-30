<template>
  <div class="contain">
    <div ref="ring" class="ring" />
  </div>
</template>
<script>
import echarts from 'echarts'
export default {
  name: 'RingChart',
  props: {
    info: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  mounted() {
    const legendData = []
    const ringData = []
    this.info.data.forEach(ele => {
      legendData.push(ele.name)
      ringData.push({ value: Number(ele.num), name: ele.name })
    })
    const chart = echarts.init(this.$refs.ring)
    const colors = ['#ebaa38', '#afd559', '#44c2d5', '#8383cc', '#6690ca', '#e7534c', '#bda854', '#5e85a8', '#00686b']
    const option = {
      title: {
        text: this.info.title,
        textStyle: {
          color: '#888888',
          fontWeight: 'normal',
          fontSize: 15
        }
      },
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b}: {c} ({d}%)'
      },
      color: colors,
      legend: {
        orient: 'vertical',
        left: 10,
        top: 35,
        data: legendData
      },
      series: [
        {
          name: '注册来源',
          type: 'pie',
          minAngle: 2,
          radius: ['30%', '50%'],
          avoidLabelOverlap: true,
          label: {
            normal: {
              fontSize: 14,
              // formatter: '{a|{a}}{abg|}\n{hr|}\n  {b|{b}：}{c}  {per|{d}%}  ',
              formatter: ' {b|{b}：}{c}人  {per|{d}%}  ',
              // backgroundColor: '#eee',
              borderColor: '#aaa',
              // borderWidth: 1,
              // borderRadius: 4,
              rich: {
                a: {
                  color: '#999',
                  lineHeight: 22,
                  align: 'center',
                  fontSize: 14
                },
                hr: {
                  borderColor: '#aaa',
                  width: '100%',
                  borderWidth: 0.5,
                  height: 0
                },
                b: {
                  fontSize: 14,
                  lineHeight: 33
                },
                per: {
                  // color: '#aaa',
                  fontSize: 14,
                  // backgroundColor: '#334455',
                  padding: [2, 4]
                  // borderRadius: 2
                }
              }
            }
          },
          data: ringData
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
<style lang="less" scoped>
.contain {
  border: solid 1px rgb(228, 228, 228, 1);
  padding: 15px;
  .ring {
    width: 100%;
    height: 350px;
  }
}
</style>
