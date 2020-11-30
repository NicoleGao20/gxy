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
      default() {
        return {}
      }
    }
  },
  mounted() {
    const chart = echarts.init(this.$refs.normalBar)
    const colors = ['#ebaa38', '#afd559', '#44c2d5', '#8383cc', '#6690ca', '#e7534c', '#bda854', '#5e85a8', '#00686b']
    const seriesArr = []
    const legendData = []
    const data = this.info.data
    data.forEach((ele, index) => {
      legendData.push(ele.name)
      // 目标人数  发送成功 发送失败 素材打开 素材分享 -素材打开率
      // 目标人数  发送成功 发送失败 链接点击 -链接点击率
      // 目标人数  发送成功 发送失败 链接点击 -链接点击率
      // 目标人数  发送成功 发送失败 使用人数 -用券订单金额
      // 消费人数  首单人数 复购人数 升级人数 -消费金额 -首单金额 -复购金额
      const invaldeData = {
        name: ele.name,
        type: 'bar', // 'line'
        barGap: 0,
        data: ele.value,
        label: {
          normal: {
            show: true,
            position: 'top',
            color: '#444444'
          }
        },
        itemStyle: {}
      }
      if (ele.name === 'ROI') {
        legendData.splice(legendData.indexOf('ROI'), 1)
        invaldeData.label = {}
        invaldeData.itemStyle.color = '#ffffff'
      }
      // 区分bar line
      // 短信触达phoneSms 微信模版消息触达wxTemplateMsg APP PUSH触达appPush 优惠券触达coupon 最后一位是line
      // 消费分析consumptionAnalysis 最后三位 line
      if (this.info.type === 'phoneSms' || this.info.type === 'wxTemplateMsg' || this.info.type === 'appPush' || this.info.type === 'coupon') {
        if (index === this.info.data.length - 1) invaldeData.type = 'line'
      }
      if (this.info.type === 'consumptionAnalysis') {
        if (index === this.info.data.length - 3) invaldeData.type = 'line'
        if (index === this.info.data.length - 2) invaldeData.type = 'line'
        if (index === this.info.data.length - 1) invaldeData.type = 'line'
      }
      if (invaldeData.type === 'line') {
        invaldeData.yAxisIndex = 1
      }
      seriesArr.push(invaldeData)
    })
    const option = {
      title: {
        text: this.info.title,
        // subtext: '总人数: 84595人',
        textStyle: {
          color: '#888888',
          fontWeight: 'normal',
          fontSize: 15
        },
        subtextStyle: {
          width: '100%'
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
        top: '22%',
        left: '3%',
        right: '4%',
        bottom: '8%',
        containLabel: true
      },
      legend: {
        data: legendData,
        itemWidth: 15,
        itemGap: 5,
        bottom: '0px'
      },
      xAxis: [
        {
          type: 'category',
          axisTick: { show: false },
          data: this.info.version
        }
      ],
      yAxis: [
        {
          type: 'value',
          splitNumber: 6,
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          }
        },
        {
          type: 'value',
          splitNumber: 6,
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
            formatter: (params) => {
              if (this.info.type === 'coupon' || this.info.type === 'consumptionAnalysis') {
                return params + '元'
              } else {
                return params + '%'
              }
            }
          }
        }
      ],
      series: seriesArr
    }
    option.title.subtext = this.subtext()
    setTimeout(() => {
      chart.setOption(option)
    }, 100)
    const fn = () => {
      chart.resize()
    }
    window.addEventListener('resize', fn)
    this.$on('hook:beforeDestroy', () => {
      window.removeEventListener('resize', fn)
    })
  },
  methods: {
    subtext() {
      let str = ''
      if (this.info.totalTargetCustomerNum > -1) str += '目标总人次：' + this.info.totalTargetCustomerNum + '人 , '
      if (this.info.totalCustomerNum > -1) str += '总人数：' + this.info.totalCustomerNum + '人 , '
      if (this.info.totalConsumptionAmount > -1) str += '总金额：' + this.info.totalConsumptionAmount + '元 , '
      if (this.info.totalFirstOrderCustomerNum > -1) str += '首单购买人数：' + this.info.totalFirstOrderCustomerNum + '人 , '
      if (this.info.totalFirstOrderConsumptionAmount > -1) str += '首单金额：' + this.info.totalFirstOrderConsumptionAmount + '元 , '
      if (this.info.totalRepeatCustomerNum > -1) str += '复购人数：' + this.info.totalRepeatCustomerNum + '人 , '
      if (this.info.totalRepeatConsumptionAmount > -1) str += '复购金额：' + this.info.totalRepeatConsumptionAmount + '元'
      if (this.info.totalSuccessSendNum > -1) str += '发送成功人次：' + this.info.totalSuccessSendNum + '人 , '
      if (this.info.totalFailSendNum > -1) str += '失败发送人次：' + this.info.totalFailSendNum + '人 , ' + '\n'
      if (this.info.totalMaterialOpenCustomerNum > -1) str += '素材打开人次：' + this.info.totalMaterialOpenCustomerNum + '人 , '
      if (this.info.totalMaterialShareCustomerNum > -1) str += '素材分享人次：' + this.info.totalMaterialShareCustomerNum + '人'
      if (this.info.totalClickLinkCustomerNum > -1) str += '点击链接人次：' + this.info.totalClickLinkCustomerNum
      if (this.info.totalUseCustomerNum > -1) str += '使用人次：' + this.info.totalUseCustomerNum
      return str
    }
  }
}
</script>
<style lang="less">
.contain {
  border: solid 1px rgb(228, 228, 228, 1);
  padding: 15px;
  width: 100%;
  margin-top: 20px;
  .normalBar {
    width: 100%;
    height: 350px;
  }
}
</style>
