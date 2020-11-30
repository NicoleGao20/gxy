<template>
  <div class="app-container marketing-report">
    <section class="report-contain">
      <header>
        <div class="label-title">
          <i class="linev-tip"/><span class="label-desc">营销活动报告</span>
        </div>
        <div class="head-info">
          <div class="stripe"/>
          <div class="introData">
            <el-row>
              <el-col :span="8">最新更新时间：{{ marketingDetail.lastUpdateTime }}</el-col>
              <el-col :span="8">截止更新时间：{{ marketingDetail.cutOffTime }}</el-col>
            </el-row>
            <el-row>
              <el-col>营销说明：{{ marketingDetail.marketExplain }}</el-col>
            </el-row>
            <el-row>
              <el-col :span="19">营销时间：{{ marketingDetail.marketBeginTime }} -- {{ marketingDetail.marketEndTime }}</el-col>
              <el-col :span="5" style="text-align:right;">
                <el-button type="primary" @click="$router.back()">返回列表</el-button>
                <el-button :loading="IsdownLoadPdf" type="primary" @click="TransitExcel">报告导出</el-button>
              </el-col>
            </el-row>
          </div>
        </div>
      </header>
      <main class="tableMainContent">
        <div v-if="$route.query.marketingType === 'period'" class="search">
          <span style="margin-right:30px;color: #666666;">周期选择</span>
          <el-select v-model="version" placeholder="请选择" @change="changeVersion">
            <el-option
              v-for="item in periodVersion"
              :key="item.value"
              :label="item.label"
              :value="item.value"/>
          </el-select>
        </div>
        <div class="label-title">
          <i class="linev-tip"/><span class="label-desc">效果总览</span>
        </div>
        <div class="grid">
          <template v-for="(view, index) in resultOverview">
            <div :key="index" class="item">
              <p>{{ view.name }}</p>
              <span>{{ view.value }}</span>
            </div>
          </template>
        </div>
        <div class="label-title">
          <i class="linev-tip"/><span class="label-desc">详情分析</span>

        </div>
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="人群流向分析" name="FlowDetail">
            <foot-print v-if="activeName === 'FlowDetail'" :activity-qs="print" @putFlowData="crowdFlowDetail" @putDataAnalysis="getAnalysisData"/>
          </el-tab-pane>
          <el-tab-pane v-if="$route.query.marketingType === 'period'" label="周期分析" name="CycleAnalysis">
            <template v-if="activeName === 'CycleAnalysis'">
              <div class="Cycle-card">
                <p class="title">周期总览</p>
                <div class="twoNode">
                  <pie-chart :info="cycleAnalysis[0]"/>
                  <normal-bar :info="cycleAnalysis[1]"/>
                </div>
              </div>
              <div class="Cycle-card">
                <p class="title">触达分析</p>
                <div class="twoNode">
                  <multiple-chart v-if="cycleAnalysis[2].data" :info="cycleAnalysis[2]"/>
                  <multiple-chart v-if="cycleAnalysis[3].data" :info="cycleAnalysis[3]"/>
                  <multiple-chart v-if="cycleAnalysis[4].data" :info="cycleAnalysis[4]"/>
                  <multiple-chart v-if="cycleAnalysis[5].data" :info="cycleAnalysis[5]"/>
                  <multiple-chart v-if="cycleAnalysis[6].data" :info="cycleAnalysis[6]"/>
                </div>
              </div>
              <div class="Cycle-card">
                <p class="title">消费分析</p>
                <div class="oneNode">
                  <multiple-chart :info="cycleAnalysis[7]"/>
                </div>
                <div class="twoNode">
                  <pie-chart :info="cycleAnalysis[8]"/>
                  <normal-bar :info="cycleAnalysis[9]"/>
                </div>
                <div class="oneNode">
                  <normal-bar :info="cycleAnalysis[10]"/>
                </div>
              </div>
              <div class="Cycle-card">
                <p class="title">会员属性分析</p>
                <div class="oneNode">
                  <normal-bar :info="cycleAnalysis[11]"/>
                  <!-- <normal-bar :info="cycleAnalysis[10]"/> -->
                </div>
              </div>
            </template>
          </el-tab-pane>
          <el-tab-pane v-if="detailsMap.includes('eventSelect') || detailsMap.includes('eventJudge')" label="事件人群分析" name="EventCrowd">
            <template v-if="activeName === 'EventCrowd'">
              <p v-if="!eventPopulationAnalysis.length">暂无事件人群分析相关数据</p>
              <div v-for="(event, index) in eventPopulationAnalysis" :key="index" class="Cycle-card">
                <div class="nav">
                  <p>{{ event.consumptionDesc }}</p>
                  <div class="row">
                    <p>节点人数：{{ event.nodeTargetNum }}人</p>
                  </div>
                </div>
                <div class="threeNode">
                  <pie-chart v-if="event.data[0]" :info="event.data[0]"/>
                  <normal-bar v-if="event.data[1]" :info="event.data[1]"/>
                  <funnel-chart v-if="event.data[2]" :info="event.data[2]"/>
                </div>
                <div class="unevenNode-left">
                  <normal-bar v-if="event.data[3]" :info="event.data[3]"/>
                  <ring-chart v-if="event.data[4]" :info="event.data[4]"/>
                </div>
                <div class="oneNode">
                  <normal-bar v-if="event.data[5]" :info="event.data[5]"/>
                </div>
                <div class="threeNode">
                  <pie-chart v-if="event.data[6]" :info="event.data[6]"/>
                  <mixed-chart v-if="event.data[7]" :info="event.data[7]"/>
                  <mixed-chart v-if="event.data[8]" :info="event.data[8]"/>
                </div>
                <div class="unevenNode-left">
                  <normal-bar v-if="event.data[9]" :info="event.data[9]"/>
                  <normal-bar v-if="event.data[10]" :info="event.data[10]"/>
                </div>
              </div>
            </template>
          </el-tab-pane>
          <el-tab-pane v-if="detailsMap.includes('wxTemplateMsg') || detailsMap.includes('phoneSms') || detailsMap.includes('appPush') || detailsMap.includes('wxNews')" label="消息触达分析" name="ContactDetail">
            <div v-if="activeName === 'ContactDetail'" class="two-contain">
              <p v-if="!contactDetail.length">暂无消息触达分析相关数据</p>
              <template v-for="(detail, index) in contactDetail">
                <div :key="index" class="card">
                  <div class="nav">
                    <el-row>
                      <el-col :span="18">
                        <p>{{ detail.actionDesc }}</p>
                      </el-col>
                      <el-col :span="6">
                        <el-select v-if="detail.type && detail.type === 'AppPush'" v-model="choseType" placeholder="请选择">
                          <el-option
                            v-for="item in PushList"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"/>
                        </el-select>
                      </el-col>
                    </el-row>
                    <div class="row">
                      <p>节点人数：{{ detail.nodeTargetNum || 0 }}人</p>
                    </div>

                  </div>
                  <div>
                    <multi-trapezoid v-if="detail.type && detail.type === 'AppPush'" :services="detail[choseType]" :type="choseType" :key="choseType"/>
                    <multi-trapezoid v-else :services="detail"/>
                  </div>
                </div>
              </template>
            </div>
          </el-tab-pane>
          <el-tab-pane v-if="detailsMap.includes('coupon')" label="优惠券转化分析" name="CouponDetail">
            <template v-if="activeName === 'CouponDetail'">
              <p v-if="!couponDetail.length">暂无优惠券转化分析相关数据</p>
              <div v-for="(coupon,index) in couponDetail" :key="index" class="card" style="margin-bottom:20px;">
                <div class="nav">
                  <p>{{ coupon.actionDesc }}</p>
                  <div class="row">
                    <p>节点人数：{{ coupon.nodeTargetNum }}人</p>
                  </div>
                </div>
                <div class="one-contain">
                  <single-trapezoid :coupon="coupon"/>
                </div>
              </div>
            </template>
          </el-tab-pane>
          <el-tab-pane v-if="detailsMap.includes('abTest')" label="AB测试分析" name="TestAnalysis">
            <template v-if="activeName === 'TestAnalysis'">
              <div v-for="(test,index) in testAnalysis" :key="index" class="card">
                <div class="nav">
                  <p>{{ test.node_name }}</p>
                  <div class="row">
                    <p>节点人数：{{ test.target_number }}人</p>
                  </div>
                </div>
                <div class="one-contain">
                  <progress-chart v-for="(detail, i) in test.details" :info="detail" :key="i"/>
                </div>
              </div>
            </template>
          </el-tab-pane>
          <el-tab-pane v-if="detailsMap.includes('wxTemplateMsg') || detailsMap.includes('phoneSms') || detailsMap.includes('appPush') || detailsMap.includes('wxNews')" label="触达消费分析" name="ConsumptionDetail">
            <template v-if="activeName === 'ConsumptionDetail'">
              <p v-if="!consumptionDetail.length">暂无触达消费分析相关数据</p>
              <div v-for="(event, index) in consumptionDetail" :key="index" class="Cycle-card">
                <div class="nav">
                  <p>{{ event.consumptionDesc }}</p>
                  <div class="row">
                    <p>节点人数：{{ event.nodeTargetNum }}人</p>
                  </div>
                </div>
                <div class="threeNode">
                  <mixed-chart v-if="event.data[0]" :info="event.data[0]"/>
                  <normal-bar v-if="event.data[1]" :info="event.data[1]"/>
                  <normal-bar v-if="event.data[2]" :info="event.data[2]"/>
                </div>
                <div class="threeNode">
                  <pie-chart v-if="event.data[3]" :info="event.data[3]"/>
                  <mixed-chart v-if="event.data[4]" :info="event.data[4]"/>
                  <mixed-chart v-if="event.data[5]" :info="event.data[5]"/>
                </div>
              </div>
            </template>
          </el-tab-pane>
        </el-tabs>
      </main>
    </section>
    <el-drawer
      :visible.sync="drawer"
      :with-header="false"
      title="群像分析"
      size="90%">
      <span>
        <crm-group-portraint v-if="drawer" :action-id="actionId" :version="version" :market-action="marketAction" :marketing-no="$route.query.marketingNo" link_resource="marketing"/>
      </span>
    </el-drawer>
  </div>
</template>
<script>
import { queryMarketingDetail, queryResultOverview, queryPeriodVersion, queryPeriodAnalysis, queryMessageContactDetail, queryCouponDetail, queryConsumptionDetail, queryTestAnalysis, queryEventPopulationAnalysis, exportMarketingExcel } from '@/api/markting/report'
import footPrint from './coms/footprint' // 流程图
import progressChart from './coms/progressChart' // 进度条
import normalBar from './coms/normalBar' // 普通柱状图
import mixedChart from './coms/mixedChart' // 单柱状 + 折线图
import multipleChart from './coms/multipleChart' // 多柱状 + 折现
import pieChart from './coms/pieChart' // 饼图
import normalChart from './coms/normalChart' // 柱状图
import ringChart from './coms/ringChart' // 圆环
import funnelChart from './coms/funnelChart' // 金字塔
import multiTrapezoid from './coms/multi-trapezoid' // 倒梯形 -> 多行说明
import singleTrapezoid from './coms/single-trapezoid' // 倒梯形 -> 单行说明
import crmGroupPortraint from '@/views/platformitem/markting/dataAnalysis/crmGroupPortrait/index'
export default{
  name: 'MarketingReport',
  components: {
    crmGroupPortraint,
    footPrint,
    progressChart,
    normalBar,
    mixedChart,
    multipleChart,
    pieChart,
    normalChart,
    ringChart,
    funnelChart,
    multiTrapezoid,
    singleTrapezoid
  },
  data() {
    return {
      drawer: false,
      IsdownLoadPdf: false,
      requestOver: true,
      // time: [],
      periodVersion: [], // 周期版本
      version: '',
      marketingDetail: '', // 主体信息
      resultOverview: '',
      cycleAnalysis: [], // 周期分析
      contactDetail: '', // 消息触达分析
      eventPopulationAnalysis: [], // 事件人群分析
      couponDetail: '', // 优惠券转化
      consumptionDetail: '', // 触达消费
      testAnalysis: [], // AB测试
      detailsMap: [],
      activeName: 'FlowDetail',
      print: {
        marketingNo: this.$route.query.marketingNo || '',
        marketingId: this.$route.query.marketingId || '',
        marketingType: this.$route.query.marketingType || ''
      },
      actionId: '',
      PushList: [
        { label: '全部', value: 'All' },
        { label: 'Android', value: 'Android' },
        { label: 'ios', value: 'ios' },
        { label: '未知', value: 'unKnown' }
      ],
      choseType: 'All',
      marketAction: ''
    }
  },
  mounted() {
    this.init()
    this.getResult()
    if (this.$route.query.marketingType === 'period') {
      this.getVersion()
      this.getCycleAnalysis()
    }
    // 画像导出 请求全部的数据
    // Promise.all([this.getMessageContactDetail(), this.getCouponDetail(), this.getEventPopulationAnalysis(), this.getConsumptionDetail(), this.getTestAnalysis()]).then(result => {
    //   this.requestOver = false
    // })
  },
  methods: {
    TransitExcel() {
      this.IsdownLoadPdf = true
      const params = {
        marketingNo: this.$route.query.marketingNo,
        marketingType: this.$route.query.marketingType
      }
      exportMarketingExcel(params).then(res => {
        const filename = '营销活动报告'
        const blob = new Blob([res], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
        if (typeof window.navigator.msSaveBlob !== 'undefined') {
          // 兼容IE，window.navigator.msSaveBlob：以本地方式保存文件
          window.navigator.msSaveBlob(blob, decodeURI(filename))
        } else {
          // 创建新的URL并指向File对象或者Blob对象的地址
          const blobURL = window.URL.createObjectURL(blob)
          // 创建a标签，用于跳转至下载链接
          const tempLink = document.createElement('a')
          tempLink.style.display = 'none'
          tempLink.href = blobURL
          tempLink.setAttribute('download', decodeURI(filename))
          // 兼容：某些浏览器不支持HTML5的download属性
          if (typeof tempLink.download === 'undefined') {
            tempLink.setAttribute('target', '_blank')
          }
          // 挂载a标签
          document.body.appendChild(tempLink)
          tempLink.click()
          document.body.removeChild(tempLink)
          // 释放blob URL地址
          window.URL.revokeObjectURL(blobURL)
        }
        this.IsdownLoadPdf = false
      }).catch(() => {
        this.IsdownLoadPdf = false
      })
      // this.IsdownLoadPdf = true
      // this.htmlToPdf(dom, title, (res) => {
      //   this.IsdownLoadPdf = false
      // })
    },
    crowdFlowDetail(list) {
      if (list.nodeItems.length) {
        this.detailsMap = []
        list.nodeItems.forEach(ele => {
          this.detailsMap.push(ele.component)
        })
      }
    },
    getAnalysisData(row) {
      this.drawer = true
      this.actionId = row.id
      var arr = ['coupon', 'crossCoupon', 'wxTemplateMsg', 'phoneSms', 'wxNews', 'appPush']
      if (arr.indexOf(row.name) > -1) {
        this.marketAction = row.name
      }
    },
    getVersion() {
      this.periodVersion = []
      const params = {
        marketingNo: this.$route.query.marketingNo
      }
      queryPeriodVersion(params).then(res => {
        if (res.data.length) {
          this.periodVersion.push({ value: '', label: '全部' })
          res.data.forEach(ele => {
            this.periodVersion.push({ value: ele.version, label: ele.versionName })
          })
        }
      })
    },
    changeVersion() {
      this.reset()
      this.getResult()
    },
    reset() {
      if (this.activeName === 'ContactDetail') this.getMessageContactDetail()
      if (this.activeName === 'CycleAnalysis') this.getCycleAnalysis()
      if (this.activeName === 'CouponDetail') this.getCouponDetail()
      if (this.activeName === 'TestAnalysis') this.getTestAnalysis() // AB测试分析
      if (this.activeName === 'EventCrowd') this.getEventPopulationAnalysis()
      if (this.activeName === 'ConsumptionDetail') this.getConsumptionDetail()
    },
    init() {
      queryMarketingDetail({ marketingId: this.$route.query.marketingId, marketingNo: this.$route.query.marketingNo }).then(res => {
        if (res.data) {
          this.marketingDetail = res.data || []
        }
      })
    },
    getResult() {
      const params = {
        marketingType: this.$route.query.marketingType,
        marketingNo: this.$route.query.marketingNo
      }
      queryResultOverview(params).then(res => {
        if (res.data) {
          this.resultOverview = res.data || []
        }
      })
    },
    getMessageContactDetail() {
      this.contactDetail = []
      const params = {
        marketingId: this.$route.query.marketingId,
        marketingNo: this.$route.query.marketingNo,
        marketingType: this.$route.query.marketingType,
        version: this.version
      }
      return new Promise((resolve, reject) => {
        queryMessageContactDetail(params).then(res => {
          this.contactDetail = res.data || []
          this.contactDetail.forEach(ele => {
            if (ele.actionDesc.indexOf('PUSH') > -1 && ele.actionDesc.indexOf('APP') > -1) {
              this.$set(ele, 'type', 'AppPush')
            }
          })
          resolve(res)
        })
      })
    },
    getCycleAnalysis() {
      this.cycleAnalysis = []
      const params = {
        marketingNo: this.$route.query.marketingNo
      }
      return new Promise((resolve, reject) => {
        queryPeriodAnalysis(params).then(res => {
          this.cycleAnalysis = res.data || []
          resolve(res)
        })
      })
    },
    getCouponDetail() {
      this.couponDetail = []
      const params = {
        marketingId: this.$route.query.marketingId,
        marketingType: this.$route.query.marketingType,
        version: this.version
      }
      return new Promise((resolve, reject) => {
        queryCouponDetail(params).then(res => {
          this.couponDetail = res.data || []
          resolve(res)
        })
      })
    },
    getConsumptionDetail() {
      this.consumptionDetail = []
      const params = {
        marketingId: this.$route.query.marketingId,
        marketingNo: this.$route.query.marketingNo,
        marketingType: this.$route.query.marketingType,
        version: this.version
      }
      return new Promise((resolve, reject) => {
        queryConsumptionDetail(params).then(res => {
          this.consumptionDetail = res.data.list || []
          resolve(res)
        })
      })
    },
    getTestAnalysis() {
      this.testAnalysis = []
      const params = {
        marketingType: this.$route.query.marketingType,
        marketingNo: this.$route.query.marketingNo,
        version: this.version
      }
      return new Promise((resolve, reject) => {
        queryTestAnalysis(params).then(res => {
          this.testAnalysis = res.data.list || []
          resolve(res)
        })
      })
    },
    getEventPopulationAnalysis() {
      this.eventPopulationAnalysis = []
      const params = {
        marketingId: this.$route.query.marketingId,
        marketingType: this.$route.query.marketingType,
        marketingNo: this.$route.query.marketingNo,
        version: this.version
      }
      return new Promise((resolve, reject) => {
        queryEventPopulationAnalysis(params).then(res => {
          this.eventPopulationAnalysis = res.data || []
          resolve(res)
        })
      })
    },
    handleClick(tab, event) {
      this.reset()
    }
  }
}
</script>
<style lang="less" scoped>
  /deep/ .el-drawer__body{
    overflow: auto;
  }
  /deep/ .el-drawer__header{
    margin-bottom: 0;
  }
  .pdfTitle {
    position: relative;
      padding-top: 15px;
      padding-bottom: 15px;
      padding-left: 10px;
      font-size: 20px;
    &:before{
      content: "";
      position: absolute;
      top: 21px;
      left: 0;
      width: 2px;
      height: 12px;
      background-color: #3c5175;
    }
  }
  .pdfContain {
    background: white;
    padding: 15px;
    width: 100%;
    position: fixed;
    left: 3000px;
    .row {
      position: relative;
    }
  }
  .marketing-report{
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    width: 100%;
    height: 100%;
    background: #f6f6f6;
  }
  .report-contain{
    &>header,&>main{
      background: white;
      padding: 20px;
      margin-bottom: 15px;
    }
    &>header{
      .head-info{
        color: #666666;
        background: #f9f9f9;
        .stripe{
          width: 100%;
          height: 10px;
          background: linear-gradient(
            -45deg,
            rgba(67, 90, 130) 0, rgba(67, 90, 130) 14%, transparent 14%, transparent 50%,
            rgba(67, 90, 130) 50%, rgba(67, 90, 130) 64%, transparent 64%, transparent
          );
          background-size: 40px 40px;
          background-color: #e6e9ed;
        }
        .introData{
          padding: 15px;
          /deep/ .el-row{
            line-height: 40px;
            &:not(:nth-of-type(1)){
              padding-left: 30px;
            }
          }
        }
      }
    }
    &>main{
      .search{
        padding: 15px;
        background: #f9f9f9;
        margin-bottom: 30px;
      }
      .grid{
        padding-bottom: 20px;
        margin-bottom: 20px;
        display: grid;
        grid-template-columns: repeat(5, 20%);
        border-bottom: solid 1px #e5e7ef;
        .item{
          display: flex;
          margin-bottom: 20px;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          width:150px;
          height:60px;
          color: #57A7ED;
          font-weight: 500;
          color: #61acee;
          background-color: #eef6fd;
          box-sizing: border-box;
          border: 1px dashed #61acee;
          p{
            font-weight: bold;
            margin-bottom: 10px;
          }
        }
      }
      /deep/ .el-tabs{
        /deep/ .el-tabs__item{
          font-size: 13px;
          padding: 0;
          padding: 0 15px;
          height: 28px;
          line-height: 28px;
          // width: 120px;
          color: #435A82;
          text-align: center;
        }
        /deep/ .is-active{
          background: #435a82;
          color: white;
        }
        /deep/ .el-tabs__active-bar {
          background: transparent;
        }
      }
    }
  }
  /deep/ .el-tabs__content{
    // height: 400px;
    padding: 25px;
  }
  .label-title {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 16px;
    position: relative;
    line-height: 16px;
    padding-left: 10px;
    margin-bottom: 20px;
    .linev-tip {
      display: inline-block;
      width: 4px;
      height: 16px;
      left: 0;
      top: 50%;
      transform: translateY(-50%);
      position: absolute;
      background: #435a82;
    }
  }
  .search-more{
    border: 1px solid rgba(67,90,130,1);
    background: none;
    color: #435A82;
    &:hover{
      color: #FFFFFF;
      background-color: #435A82;
      border-color: #435A82;
    }
  }
  .card{
    padding: 20px;
    border: solid 1px rgb(228, 228, 228, 1);
  }
  .Cycle-card{
    padding: 0 20px 20px;
    border: solid 1px rgb(228, 228, 228, 1);
    margin-bottom: 10px;
    .nav {
      margin-top: 20px;
      margin-bottom: 0;
    }
    .title {
      color: #666666;
      margin-top: 20px;
      // line-height: 60px;
    }
    .oneNode {
      display: grid;
      grid-template-columns: 1fr;
      grid-template-rows: auto;
    }
    .twoNode {
      display: grid;
      grid-column-gap: 20px;
      grid-template-columns: 1fr 1fr;
      grid-template-rows: auto;
    }
    .threeNode {
      display: grid;
      grid-column-gap: 20px;
      grid-template-columns: 1fr 1fr 1fr;
      grid-template-rows: auto;
    }
    .unevenNode-left {
      display: grid;
      grid-column-gap: 20px;
      grid-template-columns: 1fr 2fr;
      grid-template-rows: auto;
    }
    .unevenNode-right {
      display: grid;
      grid-column-gap: 20px;
      grid-template-columns: 2fr 1fr;
      grid-template-rows: auto;
    }
  }
  .nav{
    color: #888888;
    margin-bottom: 10px;
    .row{
      display: flex;
      >p:nth-of-type(1){
        margin-right: 100px;
      }
    }
    p{
      line-height: 26px;
      font-size: 16px;
    }
  }
  .third-contain,.two-contain{
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    .contain{
      margin-bottom: 20px;
    }
  }
  .two-contain > .card{
    width: 49%;
    margin-bottom: 15px;
  }
</style>
