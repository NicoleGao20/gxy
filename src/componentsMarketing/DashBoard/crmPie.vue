<template>
  <div :class="is_no_border? 'is_border' :'no_border'" class="dataChartBox" >
    <span>{{ title }}</span>
    <div :id="id" class="chartStyle" />
  </div>
</template>
<script>
import echarts from 'echarts'
export default {
  props: {
    chartObject: {
      type: Object,
      default: function() {
        return {}
      }
    },
    requestData: {
      type: Function,
      default: function() {

      }
    },
    updateRequestData: {
      type: Function,
      default: function() {}
    },
    templateId: {
      type: Number,
      default: 50000
    },
    id: {
      type: String,
      default: ''
    },
    is_show: {
      type: Boolean,
      default: true
    },
    is_no_border: {
      type: Boolean,
      default: true
    }

  },
  data() {
    return {
      title: 'DDDDD'
    }
  },
  mounted() {
    this.requestDataFun()
    console.log(this.templateId + 'ccc')
  },
  methods: {
    async requestDataFun() {
      // this.chartObj = await this.requestData({ id: this.chartObject.id })
      // this.title = this.chartObj.data.title
      this.initChart()
    },
    async del() {
      const is_del = 'Y'
      await this.updateRequestData({ id: this.chartObject.id, template: this.templateId, is_del: is_del })
      this.$emit('initData')
    },
    initChart() {
      const Chart = echarts.init(document.getElementById(this.id))
      const option = {
        tooltip: {
          trigger: 'item',
          formatter: '{b}: {c} ({d}%)'
        },
        legend: {
          orient: 'horizontal',
          // x: 'center',
          bottom: '0',
          legend: ['APP', '小程序', '公众号', '线下门店', '手动导入', '其他']
        },
        series: [
          {
            name: '来源分布',
            type: 'pie',
            radius: ['45%', '60%'],
            label: {
              normal: {
                // formatter: '{a|{a}}{abg|}\n{hr|}\n  {b|{b}：}{c}  {per|{d}%}  ',
                formatter: ' {b|{b}：}{c}  {per|{d}%}  ',
                backgroundColor: '#eee',
                borderColor: '#aaa',
                borderWidth: 1,
                borderRadius: 4,
                rich: {
                  a: {
                    color: '#999',
                    lineHeight: 22,
                    align: 'center'
                  },
                  hr: {
                    borderColor: '#aaa',
                    width: '100%',
                    borderWidth: 0.5,
                    height: 0
                  },
                  b: {
                    fontSize: 12,
                    lineHeight: 33
                  },
                  per: {
                    color: '#eee',
                    backgroundColor: '#334455',
                    padding: [2, 4],
                    borderRadius: 2
                  }
                }
              }
            },
            data: [
              { value: 335, name: 'APP' },
              { value: 310, name: '小程序' },
              { value: 234, name: '公众号' },
              { value: 135, name: '线下门店' },
              { value: 1048, name: '手动导入' },
              { value: 102, name: '其他' }]
          }
        ]
      }
      // const getSeries = this.chartObj.data.series
      // const option = {
      //   tooltip: {
      //     trigger: 'item',
      //     formatter: '{a} <br/>{b} : {c} ({d}%)'
      //   },
      //   legend: {
      //     itemWidth: 10,
      //     itemHeight: 10,
      //     itemGap: 15,
      //     orient: 'vertical',
      //     bottom: 'bottom',
      //     icon: 'circle'
      //   },
      //   series: [
      //     {
      //       name: '访问来源',
      //       type: 'pie',
      //       radius: '55%',
      //       center: ['50%', '50%'],
      //       data: getSeries,
      //       itemStyle: {
      //         emphasis: {
      //           shadowBlur: 0,
      //           shadowOffsetX: 0,
      //           shadowColor: 'rgba(0, 0, 0, 0.5)'
      //         }
      //       }
      //     }
      //   ]
      // }
      Chart.setOption(option)
      window.addEventListener('resize', () => {
        // Chart.setOption(option, true)
        Chart.resize()
      })
    }
  }
}
</script>
<style lang="less" scoped>
.is_border{
   border: 1px solid #EDEDED;
}
.no_border{
  border: none
}
.dataChartBox{
    width: 100%;
    height: 300px;
    padding: 20px 20px;
    border-radius: 1px;
    position: relative;
    text-align: center;
    color: #435A82;
  .chartStyle{
    width: 100%;
    height: 100%;
  }
  .el-icon-close{
    position: absolute;
    font-size: 14px;
    font-weight: 800;
    right: 8px;
    top: 8px;
    cursor: pointer;
  }
}
</style>
