<template>
  <div class="single-contain">
    <div ref="trapezoid" class="trapezoid"/>
    <div class="single-info">
      <p v-for="(info, index) in coupon.detail2" :key="index">{{ info.title }}: <b>{{ info.value }}</b></p>
    </div>
  </div>
</template>
<script>
import echarts from 'echarts'
export default {
  name: 'SingleTrapezoid',
  props: {
    coupon: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {

    }
  },
  mounted() {
    const chart = echarts.init(this.$refs.trapezoid)
    const colors = ['#bda854', '#00686b', '#ebaa38', '#afd559', '#44c2d5', '#8383cc', '#6690ca', '#e7534c']
    let option = {}
    if (this.coupon.detail1) {
      const data1 = []
      const data2 = []
      const arr = [30, 70, 100]
      if (this.coupon.detail1.length) {
        this.coupon.detail1.forEach((coupon, index) => {
          data1.push({ value: arr[index], name: coupon.data.title, num: coupon.data.value })
          if (coupon.dataExtra) {
            const obj = {}
            obj.value = arr[index]
            coupon.dataExtra.data.forEach((extra, i) => {
              obj['txt' + (i + 1)] = extra.title
              obj['num' + (i + 1)] = extra.value
            })
            data2.push(obj)
          } else {
            data2.push({ value: arr[index] })
          }
        })
      }
      option = {
        calculable: true,
        title: {
          text: '发送转化',
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
            left: '2%',
            top: 60,
            bottom: 60,
            width: '70%',
            minSize: '20%',
            maxSize: '100%',
            sort: 'descending',
            gap: 2,
            label: {
              show: true,
              position: 'right',
              fontSize: 16,
              formatter: (params) => {
                const arr = Object.keys(params.data)
                arr.forEach((da, index) => { if (da === 'value') arr.splice(index, 1) })
                const resultArr = []
                arr.forEach((a, i) => {
                  if (i % 2 !== 0) {
                    resultArr.push('{b| ' + params.data[arr[i - 1]] + ':' + params.data[a] + '}')
                  }
                })
                return resultArr.join('\n')
              },
              rich: {
                bg: {
                  fontSize: 20,
                  color: '#ffffff',
                  lineHeight: 15
                }
              }
            },
            labelLine: {
              length: 20,
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
            data: data2
          }, {
            type: 'funnel',
            left: '2%',
            top: 60,
            bottom: 60,
            width: '70%',
            minSize: '20%',
            maxSize: '100%',
            sort: 'descending',
            gap: 2,
            label: {
              show: true,
              position: 'inside',
              formatter: (int) => {
                return [
                  '{b|' + int.data.name + '}',
                  '{b|' + int.data.num + '}'
                ].join('\n')
              },
              rich: {
                b: {
                  fontSize: 14,
                  color: '#ffffff',
                  lineHeight: 18
                }
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
            data: data1
          }
        ]
      }
    } else {
      option = {
        calculable: true,
        title: {
          text: '发送转化',
          textStyle: {
            color: '#888888',
            fontWeight: 'normal',
            fontSize: 15
          }
        },
        series: [
          {
            type: 'funnel',
            left: '2%',
            top: 60,
            bottom: 60,
            width: '70%',
            minSize: '20%',
            maxSize: '100%',
            sort: 'descending',
            gap: 2,
            label: {
              show: false,
              position: 'right'
            },
            data: [
              { value: 30 },
              { value: 70 },
              { value: 100 }
            ]
          }
        ]
      }
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
  .single-contain{
    border: solid 1px rgb(228, 228, 228, 1);
    padding: 15px;
    display: flex;
    width: 100%;
    position: relative;
    &::before{
      position: absolute;
      content: "";
      top: 25%;
      right: 50%;
      height: 50%;
      width: 1px;
      background: #606266;
    }
    .trapezoid{
      width: 45%;
      // min-width: 400px;
      // width: 500px;
      max-height: 50%;
      height: 400px;
      position: relative;
    }
    .single-info{
      display: flex;
      padding-left: 15%;
      flex-direction: column;
      justify-content: center;
      font-size: 18px;
      p{
        line-height: 3;
        color: rgb(96, 98, 102);
        b{
          font-size: 24px;
          font-weight: 600;
          color: #0099FF;
        }
      }
    }
  }
</style>
