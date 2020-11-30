<template>
  <div class="contain">
    <div ref="funnel" class="funnel" />
  </div>
</template>
<script>
import echarts from 'echarts'
export default {
  name: 'FunnelChart',
  props: {
    info: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  mounted() {
    const resultArr = []
    // { value: 60, name: '访问' }
    this.info.data.forEach((ele, index) => {
      resultArr.push({ value: index * 20 + 20, val: Number(ele.num), name: ele.name, rate: ele.rate })
    })
    const chart = echarts.init(this.$refs.funnel)
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
      color: colors,
      series: [
        {
          type: 'funnel',
          left: '10%',
          top: 60,
          // x2: 80,
          bottom: 30,
          width: '80%',
          // height: {totalHeight} - y - y2,
          // min: 0,
          // max: 100,
          minSize: '0%',
          maxSize: '100%',
          sort: 'ascending',
          gap: 2,
          label: {
            show: true,
            position: 'inside',
            formatter: (params) => {
              const str = []
              str.push(params.data.name)
              str.push('{b|' + params.data.val + ' , ' + params.data.rate + '%' + '}')
              return str.join('\n')
            },
            rich: {
              b: {
                fontSize: 16,
                fontWeight: 500,
                color: '#ffffff'
              }
            }
          },
          labelLine: {
            length: 10,
            lineStyle: {
              width: 1,
              type: 'solid'
            }
          },
          itemStyle: {
            borderColor: '#fff',
            borderWidth: 1
          },
          emphasis: {
            label: {
              fontSize: 20
            }
          },
          data: resultArr
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
.contain {
  display: inline-block;
  // width: 49%;
  width: 100%;
  border: solid 1px rgb(228, 228, 228, 1);
  padding: 15px;
  // margin-bottom: 20px;
  .funnel {
    width: 100%;
    height: 350px;
  }
}
</style>
