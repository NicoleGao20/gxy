<template>
  <div class="contain">
    <div ref="normalBar" class="normalBar" />
  </div>
</template>
<script>
import echarts from 'echarts'
export default {
  name: 'NormalBar',
  props: {
    info: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  mounted() {
    // xData barData
    const xData = []
    let val = ''
    let isUp = false
    const seriesData = []
    if (this.info.type !== 'CityConsumptionDistribution') {
      const barData = []
      this.info.data.forEach(ele => {
        xData.push(this.xAxisName(ele.name))
        barData.push(Number(ele.num))
      })
      seriesData.push({
        name: this.filterName(this.info.type),
        data: barData,
        type: 'bar',
        barMaxWidth: '150',
        label: {
          normal: {
            show: true,
            position: 'top',
            color: '#444444',
            formatter: (params) => {
              let txt = '人'
              if (this.info.type === 'MoneyDistribution') {
                txt = '单'
              }
              if (this.info.data.length > 6) {
                return `${params.data}${txt}\n ${this.info.data[params.dataIndex].rate}% `
              } else {
                if (val === params.data && !isUp) {
                  isUp = true
                  return `${params.data}${txt} ,${this.info.data[params.dataIndex].rate}% \n`
                } else if (val === params.data && isUp) {
                  isUp = false
                  return `${params.data}${txt} ,${this.info.data[params.dataIndex].rate}%`
                } else if (val !== params.data) {
                  isUp = false
                  val = params.data
                  return `${params.data}${txt} ,${this.info.data[params.dataIndex].rate}%`
                }
              }
            }
          }
        }
      })
    } else {
      const bar1 = []
      const bar2 = []
      this.info.data.forEach(ele => {
        xData.push(ele.name || ele.organ_name)
        bar1.push(Number(ele.memberNum))
        bar2.push(Number(ele.totalMemberNum))
      })
      seriesData.push({
        name: '会员人数',
        data: bar2,
        type: 'bar',
        barGap: 0,
        barMaxWidth: '150',
        label: {
          normal: {
            show: true,
            position: 'top',
            color: '#444444',
            formatter: (params) => {
              return `${params.data}人，${this.info.data[params.dataIndex].memberRate}%`
            }
          }
        }
      })
      seriesData.push({
        name: '消费会员人数',
        data: bar1,
        type: 'bar',
        barGap: 0,
        barMaxWidth: '150',
        label: {
          normal: {
            show: true,
            position: 'top',
            color: '#444444',
            formatter: (params) => {
              console.log(this.info.data.length)
              if (this.info.data.length > 6) {
                return `${params.data}人\n ${this.info.data[params.dataIndex].memberRate}% `
              } else {
                if (val === params.data && !isUp) {
                  isUp = true
                  return `${params.data}人 , ${this.info.data[params.dataIndex].memberRate}% \n`
                } else if (val === params.data && isUp) {
                  isUp = false
                  return `${params.data}人 , ${this.info.data[params.dataIndex].memberRate}%`
                } else if (val !== params.data) {
                  isUp = false
                  val = params.data
                  return `${params.data}人 , ${this.info.data[params.dataIndex].memberRate}%`
                }
              }
            }
          }
        }
      })
    }
    const chart = echarts.init(this.$refs.normalBar)
    const colors = ['#9999cc', '#ffd996', '#91c5f3', '#6a92cb', '#41c7db', '#006699', '##0099cc']
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
        top: '21%',
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        nameRotate: 45,
        data: xData,
        axisLabel: {
          interval: 0,
          formatter(mate) {
            if (mate.length > 4) {
              if (mate.indexOf('-') > -1) {
                return mate.substring(0, mate.indexOf('-')) + '\n' + mate.substring(mate.indexOf('-'))
              } else {
                return mate.substring(0, 4) + '\n' + mate.substring(4)
              }
            } else {
              return mate
            }
          }
        },
        axisTick: {
          alignWithLabel: true
        }
      },
      yAxis: {
        type: 'value',
        axisLine: {
          show: false
        },
        axisTick: {
          show: false
        },
        axisLabel: {
          show: false
        },
        splitLine: {
          show: false
        }
      },
      series: seriesData
    }
    if (this.info.type === 'TargetCustomerNum') option.title.subtext = '总人数: ' + this.info.totalNum
    chart.setOption(option)
    const fn = () => {
      chart.resize()
    }
    window.addEventListener('resize', fn)
    this.$on('hook:beforeDestroy', () => {
      window.removeEventListener('resize', fn)
    })
  },
  methods: {
    filterName(name) {
      if (name === 'AgeDistribution' || name === 'ConsumptionOrderNum' || name === 'LifeCycleDistribution') return '人数'
      if (name === 'MoneyDistribution' || name === 'ConsumptionOrderAmount') return '订单数'
      if (name === 'CityDistribution') return '会员人数'
      if (name === 'TargetCustomerNum') return '客户数'
    },
    xAxisName(name) {
      if (name.indexOf('区间')) {
        return name.replace('区间', '')
      }
    }
  }
}
</script>
<style lang="less">
.contain {
  border: solid 1px rgb(228, 228, 228, 1);
  padding: 15px;
  .normalBar {
    width: 100%;
    height: 350px;
  }
}
</style>
