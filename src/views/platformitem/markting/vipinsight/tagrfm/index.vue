<template>
  <div class="vipinsight-tagrfm-page">
    <header>
      <div>
        <span>RFM模型：<span style="margin-right: 20px;">（数据更新频次：每天</span><span> 数据更新时间：{{ updateValue }} )</span></span>
        <ul>
          <li>R（Recency）：客户最近一次交易时间的间隔。R值越大，表示客户交易发生的日期越久，反之则表示客户交易发生的日期越近。</li>
          <li>F（Frequency）：客户在最近一段时间内交易的次数。F值越大，表示客户交易越频繁，反之则表示客户交易不够活跃。</li>
          <li>M（Monetary）：客户在最近一段时间内交易的金额。M值越大，表示客户价值越高，反之则表示客户价值越低。</li>
        </ul>
      </div>
    </header>
    <section>
      <header>
        <!-- <div>
          <span> RFM值：</span>
          <el-select v-model="searchForm.rfmOptionValue" placeholder="请选择">
            <el-option
              v-for="item in rfmOption"
              :key="item.id"
              :label="item.label"
              :value="item.id"/>
          </el-select>
        </div> -->
        <div>
          <span>查询时间：</span>
          <div class="time" @dblclick="ondblclick()">
            <div v-if="isinputTime" class="dinput">
              <el-input v-model="timeStringValue" placeholder="请输入日期，多个日期以,号隔开"/>
            </div>
            <el-date-picker
              v-model="searchForm.timeValue"
              :clearable="true"
              :editable="true"
              :picker-options="pickerOptions"
              style="width:70%"
              value-format="yyyy-MM-dd"
              type="dates"
              format="yyyy-MM-dd"
              placeholder="选择一个或多个日期"/>
          </div>
        </div>
        <el-button type="primary" @click="onsearch()">
          查询
        </el-button>
      </header>
      <div v-loading="loading" id="rfm-pic" class="pic"/>
      <div class="table">
        <div>
          <el-table
            v-loading="loading"
            :data="tableData"
            header-cell-class-name="tableHight"
            style="width: 100%"
          >
            <el-table-column
              v-for="(item,index ) in tableHeader"
              :key="index"
              :prop="item.prop"
              :label="item.label"
              :formatter="numFormat"
              width="150"/>
          </el-table>
        </div>
      </div>
    </section>
  </div>
</template>
<script>
const pickDate = (opt) => {
  var minTime = +new Date(opt.minTime)// 计算2019/5/20的时间，精确到毫秒
  var oneDay = 24 * 3600 * 1000 // 计算一天的时间，精确到毫秒 86400000
  var date = []
  var today = +new Date(new Date().toLocaleDateString().split('/').join(','))
  var date_len = (today - minTime) / oneDay// 今天距离某一天的天数
  var now = new Date(minTime)

  for (var i = 0; i < date_len; i++) {
    now = [now.getFullYear(), now.getMonth() + 1, now.getDate()].join('-')
    date.push(now)
    now = new Date(+new Date(now) + oneDay)
  }
  date.push(new Date().toLocaleDateString().split('/').join('-'))
  return date
}
const defaultDay = (day) => {
  if (!day) {
    return
  }
  // const end = new Date()
  const arry = []
  for (let index = day - 1; index >= 0; index--) {
    const start = new Date()
    start.setTime(start.getTime() - 3600 * 1000 * 24 * index)
    arry.push(dateFormat('YYYY-mm-dd', start))
  }
  return arry
}
// 格式化时间
const dateFormat = (fmt, date) => {
  let ret
  const opt = {
    'Y+': date.getFullYear().toString(), // 年
    'm+': (date.getMonth() + 1).toString(), // 月
    'd+': date.getDate().toString(), // 日
    'H+': date.getHours().toString(), // 时
    'M+': date.getMinutes().toString(), // 分
    'S+': date.getSeconds().toString() // 秒
    // 有其他格式化字符需求可以继续添加，必须转化成字符串
  }
  for (const k in opt) {
    ret = new RegExp(`(${k})`).exec(fmt)
    if (ret) {
      fmt = fmt.replace(ret[1], (ret[1].length === 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, '0')))
    }
  }
  return fmt
}
import echarts from 'echarts'
import { checkPermission } from '@/utils/permission'
import { getRfmtbaleData, getRfmValue } from '@/api/markting/vinpinsightTagrfm'
import cacheCondition from '@/utils/cacheCondition'
export default {
  name: 'Tagrfm',
  mixins: [cacheCondition],
  data() {
    return {
      isinputTime: false,
      timeStringValue: '',
      loading: false,
      updateValue: '',
      rfmOption: [],
      searchForm: {
        // rfmOptionValue: '',
        timeValue: []
      },
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now()
        },
        shortcuts: [{
          text: '近7天',
          onClick(picker) {
            picker.$emit('pick', defaultDay(7))
          }
        }, {
          text: '近15天',
          onClick(picker) {
            picker.$emit('pick', defaultDay(15))
          }
        }, {
          text: '近30天',
          onClick(picker) {
            picker.$emit('pick', defaultDay(30))
          }
        }, {
          text: '近60天',
          onClick(picker) {
            picker.$emit('pick', defaultDay(60))
          }
        }, {
          text: '近90天',
          onClick(picker) {
            picker.$emit('pick', defaultDay(90))
          }
        },
        {
          text: '近180天',
          onClick(picker) {
            picker.$emit('pick', defaultDay(180))
          }
        }, {
          text: '近一年',
          onClick(picker) {
            picker.$emit('pick', defaultDay(365))
          }
        }, {
          text: '上线至今',
          onClick(picker) {
            picker.$emit('pick', pickDate({
              minTime: '2020,03,26'
            }))
          }
        }
        ]
      },
      timeList: [],
      date: [],
      picName: [],
      tableHeaderTemplate: [
        {
          prop: '100',
          label: '标签值'
        },
        {
          prop: '101',
          label: '平均R值'
        },
        {
          prop: '102',
          label: '平均F值'
        },
        {
          prop: '103',
          label: '平均M值'
        }
      ],
      tableHeader: [],
      seriesTemplate: [

      ],
      series: [],
      tableData: []
    }
  },
  watch: {
    // 'searchForm.rfmOptionValue'(newV, oldV) {
    //   this.rfmOption.length && this.rfmChange()
    // }
  },
  mounted() {
    // this.$store.dispatch('InserMenuList', {
    //   path: 'crmGroupPortrait',
    //   buttonList: [
    //     { name: '复制模版', url: 'copy' },
    //     { name: '画像导出', url: 'export' },
    //     { name: '添加图表', url: 'addChart' },
    //     { name: '保存条件至模版', url: 'save' },
    //     { name: '删除模版', url: 'delete' },
    //     { name: '人群选择', url: 'select' }
    //   ]
    // })
    // this.$store.dispatch('InserMenuList', {
    //   path: 'marketingModule',
    //   buttonList: [
    //     { name: '查看模版', url: 'lookTemplate' },
    //     { name: '使用模版', url: 'playTemplate' }
    //   ]
    // })
    // 默认时间是最近7天
    this.searchForm.timeValue = defaultDay(7)
    this.ongetData()
    document.onkeydown = (e) => {
      let currKey = 0
      e = event || window.event
      currKey = e.keyCode || e.which || e.charCode
      if (currKey === 13) {
        // this.onsearch()
        this.dealResulte()
      }
    }
    this.ongetRfmValue()
  },
  methods: {
    ondblclick() {
      this.isinputTime = true
      this.timeStringValue = this.searchForm.timeValue.join(',')
    },
    dealResulte() {
      const value = this.timeStringValue ? this.timeStringValue.split(',') : []

      var reg = /^[1-9]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])$/
      var regExp = new RegExp(reg)
      for (let index = 0; index < value.length; index++) {
        const element = value[index]
        if (regExp.test(element)) {
          if (this.disabledDate(element)) {
            this.$message.error(element + '此日期不在可选范围')
            return
          }
        } else {
          this.$message.error(element + '此日期格式错误')
          return
        }
      }
      this.searchForm.timeValue = value
      this.isinputTime = false
    },
    numFormat(row, column, cellValue, index) {
      if (cellValue && cellValue.split('（')[1]) {
        return this.format(cellValue.split('（')[0]) + '（' + cellValue.split('（')[1]
      } else {
        return cellValue
      }
    },
    format(num) {
      var c = (num.toString().indexOf('.') !== -1) ? num.toLocaleString() : num.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,')
      return c
    },
    checkPermission,
    getNextDate(date, day) {
      var dd = new Date(date)
      dd.setDate(dd.getDate() + day)
      var y = dd.getFullYear()
      var m = dd.getMonth() + 1 < 10 ? '0' + (dd.getMonth() + 1) : dd.getMonth() + 1
      var d = dd.getDate() < 10 ? '0' + dd.getDate() : dd.getDate()
      return y + '-' + m + '-' + d
    },
    disabledDate(date) {
      const start = new Date(date).Format('yyyy-MM-dd') < new Date(this.getNextDate(this.timeList[0], 1)).Format('yyyy-MM-dd')
      const end = new Date(date).Format('yyyy-MM-dd') > new Date(this.getNextDate(this.timeList[this.timeList.length - 1], -1)).Format('yyyy-MM-dd')
      if (start && end) {
        return false
      } else {
        return true
      }
    },
    dealData(data) { //  处理数据
      this.date = data.stat_date ? data.stat_date : []
      const tableHeader = this.date.length ? this.tableHeaderTemplate.concat() : []
      for (let index = 0; index < this.date.length; index++) {
        const element = this.date[index]
        tableHeader.push({
          prop: element,
          label: element
        })
      }
      this.tableData = data.list
      this.tableHeader = tableHeader
    },
    onsearch() {
      this.ongetData()
    },
    dealDraw(data) {
      this.date = data.stat_date
      this.picName = []
      this.series = []
      const seriesTemplate = Object.assign({}, this.seriesTemplate)
      const chartDataNum = data.chart_data ? data.chart_data.length : 0
      for (let index = 0; index < chartDataNum; index++) {
        const element = data.chart_data[index]
        this.picName.push(element.label_value)
        seriesTemplate[index] = {
          type: 'line',
          areaStyle: {
            color: '#f5cfcf'
          }
        }
        seriesTemplate[index].name = element.label_value
        seriesTemplate[index].data = element.list
        this.series.push(seriesTemplate[index])
      }
      this.draw()
    },
    ongetData() {
      this.loading = true
      const obj = {}
      if (this.searchForm.timeValue.length) {
        // obj.stat_date = this.searchForm.timeValue.join(',')
        obj.stat_date = this.searchForm.timeValue
      }
      getRfmtbaleData(obj).then(res => {
        const data = res.data
        this.loading = false
        this.dealDraw(data)
        this.dealData(data)
      })
    },
    // rfmChange(value) {
    //   // rfm 选择项变化时候改变时间选择项的选择内容
    //   for (let index = 0; index < this.rfmOption.length; index++) {
    //     const element = this.rfmOption[index]
    //     if (element.rfm_value === this.searchForm.rfmOptionValue) {
    //       this.timeList = element.stat_date_list
    //       this.ongetData()
    //     }
    //   }
    // },
    async ongetRfmValue() {
      // 获取rfm 选择项和时间选择项数据
      await getRfmValue().then(res => {
        this.updateValue = res.data.data_update_time ? res.data.data_update_time : res.data.list[0].stat_date_list[0]
      })
    },
    tableRowClassName({ row, rowIndex }) {
      if (rowIndex === 0) {
        return 'tableHight'
      }
      return ''
    },
    draw() {
      var myChart = echarts.init(document.getElementById('rfm-pic'))
      myChart.clear()
      const option = {
        title: {
          text: ''
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          top: 'bottom',
          icon: 'rect',
          itemHeight: 15,
          itemWidth: 15,
          itemGap: 15,
          // data: ['邮件营销', '联盟广告', '视频广告', '直接访问', '搜索引擎']
          data: this.picName
        },
        grid: {
          left: '2%',
          right: '4%',
          bottom: '16%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            boundaryGap: false,
            data: this.date,
            // data: ['2019-09-01', '2019-09-01', '2019-09-01', '2019-09-01', '2019-09-01', '2019-09-01', '2019-09-01'],
            'axisLine': { // y轴
              'show': false

            },
            'axisTick': { // y轴刻度线
              'show': false
            }

          }
        ],
        yAxis: [
          {
            type: 'value',
            'axisLine': { // y轴
              'show': false

            },
            'axisTick': { // y轴刻度线
              'show': false
            },
            splitLine: { // 网格线
              lineStyle: {
                type: 'dashed' // 设置网格线类型 dotted：虚线   solid:实线
              },
              show: true // 隐藏或显示
            }

          }
        ],
        series: this.series
      }
      myChart.setOption(option)
      window.onresize = () => {
        myChart.resize()
      }
    }
  }
}
</script>
<style lang="less" scoped>
  .vipinsight-tagrfm-page {
    display: flex;
    align-items: center;
    flex-direction: column;
    box-sizing: border-box;
    padding: 15px;
    width: 100%;
    height: 100%;
    background: #f3f3f3;
    overflow: auto;
    overflow-x: hidden;
    &>header {
      box-sizing: border-box;
      padding: 50px 0px 0px 35px;
      width: 100%;
      height: 195px;
      font-size: 16px;
      color: #777;
      background: #fff;
      &>div {
        &>span {
          display:flex;
          align-items: center;
          color:#6e7074;
          font-size: 16px;
          font-weight: 700;
          margin-bottom: 20px;
          &>span {
            color: #33496f;
            font-size: 12px;
          }
          &:before {
            display:inline-block;
            content:'';
            width:4px;
            height: 16px;
            margin-right: 10px;
            background: #435a82;
          }
        }
        ul {
          li {
            margin-bottom: 10px;
            color: #999;
            font-size: 14px;
          }
        }
      }
    }
    &>section {
      // flex:1;
      // display: flex;
      // justify-content: space-between;
      // align-items: center;
      // flex-direction: column;
      width: 100%;
      margin-top: 30px;
      color: #777;
      font-size: 14px;
      background: #fff;
      &>header {
        box-sizing: border-box;
        display: flex;
        &>div {
          position: relative;
          display: flex;
          align-items: center;
          &>span {
            width: 80px;
            text-align: right;
          }
          &>.time {
            position: relative;
            width: 400px;
            .dinput {
              z-index: 1000;
              position: absolute;
              width: 400px;
              background:#fff;
            }

          }
        }
        // justify-content: space-between;
        align-items: center;
        padding: 20px 35px 0px;
        padding-right: 100px;
        width: 100%;
        height: 110px;
        background: #fff;
        &>div {
          margin-right: 35px;
        }
      }
      &>.pic{
        width: 100%;
        height: 400px;
        padding:  20px 0px;
        background: #fff;
      }
      &>.table{
        width: 100%;
        padding:  0px 20px 20px;
        background: #fff;
        &>div {
          border: 1px solid  #eee;
          border-bottom: none;
        }
      }
    }
  }
</style>
<style lang="less">
.tableHight{
    background: #f5f7fa !important ;
  }
</style>
