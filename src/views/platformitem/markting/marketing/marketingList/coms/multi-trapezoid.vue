<template>
  <div class="multi-contain">
    <div class="info">
      <p>
        <template v-for="(info, index) in services.detail1">
          <span :key="index" style="margin-right:15px;">{{ info.title }} : {{ info.value }}</span>
        </template>
      </p>
    </div>
    <div ref="trapezoid" class="trapezoid" />
  </div>
</template>
<script>
import echarts from 'echarts'
export default {
  name: 'MultiTrapezoid',
  props: {
    services: {
      type: Object,
      default: () => {
        return {}
      }
    },
    type: {
      type: String,
      default: 'All'
    }
  },
  data() {
    return {}
  },
  mounted() {
    const chart = echarts.init(this.$refs.trapezoid)
    const colors = ['#ebaa38', '#afd559', '#44c2d5', '#8383cc', '#6690ca', '#e7534c', '#bda854', '#5e85a8', '#00686b']
    let option = {}
    // 数据处理
    const data1 = []
    const data2 = []
    if (this.services.detail2 && this.services.detail2.length) {
      this.services.detail2.forEach((detail, index) => {
        // outside
        var d1 = detail.dataExtra
        if (d1 && d1.data && d1.data.length) {
          // 多数据拼接
          const obj = {}
          if (detail.dataExtra.rate) {
            obj.rate = detail.dataExtra.rate
          }
          obj.value = 5 * (index + 1) * (index + 2)

          detail.dataExtra.data.forEach((extra, i) => {
            obj['txt' + (i + 1)] = extra.title
            obj['val' + (i + 1)] = extra.value
          })
          data1.push(obj)
        } else {
          var nullObj = { value: 135, label: { show: false }, labelLine: { show: false }}
          nullObj.value = 5 * (index + 1) * (index + 2)
          data1.push(nullObj)
        }
        // inside
        data2.push({ value: 5 * (index + 1) * (index + 2), title: detail.data.title, val: detail.data.value })
      })
    }
    option = {
      calculable: true,
      color: colors,
      series: [
        {
          type: 'funnel',
          left: 0,
          top: '5%',
          // bottom: 60,
          width: '80%',
          // min: 0,
          // max: 100,
          minSize: '10%',
          maxSize: '80%',
          sort: 'descending',
          gap: 2,
          label: {
            show: true,
            position: 'right',
            formatter: function(params) {
              const arr = Object.keys(params.data)
              const resultArr = []
              arr.forEach((da, index) => {
                if (da === 'value') {
                  arr.splice(index, 1)
                }
                if (da === 'rate') {
                  resultArr.push('{big| ' + params.data.rate + '}')
                  arr.splice(index, 1)
                }
              })
              if (arr.indexOf('value') > -1) arr.splice(arr.indexOf('value'), 1)
              arr.forEach((a, i) => {
                if (i % 2 !== 0) {
                  resultArr.push('{b| ' + params.data[arr[i - 1]] + ':' + params.data[a] + '}')
                }
              })
              return resultArr.join('\n')
            },
            rich: {
              big: {
                fontSize: 20,
                fontWeight: 900,
                color: '#409EFF',
                lineHeight: 15
              },
              b: {
                color: '#AEAEAE',
                lineHeight: 15
              },
              x: {
                fontSize: 18,
                fontFamily: 'Microsoft YaHei',
                borderColor: '#449933',
                borderRadius: 4
              }
            }
          },
          labelLine: {
            length: 40,
            lineStyle: {
              width: 1,
              type: 'solid'
            }
          },
          data: data1
        },
        {
          type: 'funnel',
          left: 0,
          top: '5%',
          width: '80%',
          minSize: '10%',
          maxSize: '80%',
          sort: 'descending',
          gap: 2,
          label: {
            show: true,
            position: 'inside',
            formatter: function(data) {
              return [
                '{b| ' + data.data.title + '}',
                '{b| ' + data.data.val + '}'
              ].join('\n')
            },
            rich: {
              b: {
                fontSize: 14,
                color: '#ffffff',
                lineHeight: 16
              }
            }
          },
          data: data2
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
  .multi-contain{
    width: 100%;
    .trapezoid{
      // width: 100%;
      width: 400px;
      height: 400px;
    }
  }
</style>
