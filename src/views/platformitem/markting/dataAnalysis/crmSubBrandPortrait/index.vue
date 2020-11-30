<template>
  <div class="app-container crmGroupPortraint">
    <div class="crmGroupPortraintBox">
      <el-row >
        <el-form label-width="80px">
          <el-row >
            <el-col :span="12">
              <div>
                <el-form-item label="品牌">
                  <el-select v-model="brand_detail_no" placeholder="请选择模版" @change="initData">
                    <el-option
                      v-for="item in brandList"
                      :key="item.brand_detail_no"
                      :label="item.brand_detail_name"
                      :value="item.brand_detail_no"/>
                  </el-select>
                </el-form-item>
              </div>
              <div>
                <el-form-item label="消费日期">
                  <el-date-picker
                    v-model="create_time"
                    :picker-options="pickerOptions0"
                    type="daterange"
                    value-format="yyyy-MM-dd"
                    range-separator="-"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    @change="initData"
                  />
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="12" style="text-align: right; color: #222;">
              <div class="member_amount_box">{{ lastNowDay }}至{{ nowDay }}</div>
              <div class="member_amount_box">在{{ brandName }}品牌消费过的会员：<span class="member_amount">{{ member_amount }}</span>人</div>
            </el-col>
          </el-row>
        </el-form>
      </el-row>
      <div class="chartsBoxTop">
        <!-- <p class="fontColorStyle" style="height:25px;line-height:25px;margin-top: 15px;">会员总览</p> -->
        <!-- <div class="">
          <chart-Analysis v-if="overViewArr && overViewArr.length>0" :chart-arr="overViewArr" :update-request-data="updateChartDataById" :lg="6" :md="6" :xl="4" @initData="initData" />
        </div> -->
        <div class="chartTabs">
          <div class="ad-status filter-btns" style="font-size: 13px;">
            <ul>
              <li
                v-for="(adStatusItem, index) in adStatusItems"
                :key="index"
                :class="{'on': adStatusItem.value == ISSUE_STATUS }"
                @click="filterFun(adStatusItem.value)">{{ adStatusItem.label }}
              </li>
            </ul>
          </div>
          <div >
            <chart-Analysis
              v-if=" chartIdArr && chartIdArr.length>0"
              :request-data="getChartDataById"
              :chart-arr="chartIdArr"
              :is_show="is_show"
              :start-time="startTime"
              :end-time="endTime"
              :brand_detail_no="brand_detail_no"
              :brand-boolean="brandBoolean"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { getMemberOverview, getMemberBasicAttr, getMemberMemberLevel, getMemberconsume, getSubBrandList } from '@/api/markting/crmSubBrandPortrait'
export default {
  name: 'CrmSubBrandPortant',
  data() {
    return {
      pickerOptions0: {
        disabledDate(time) {
          var now = new Date()
          var year = now.getFullYear() // 得到年份
          var month = now.getMonth() + 1
          var date = now.getDate() - 1// 得到日期
          if (date < 10) {
            date = '0' + date // 得到月份
          }
          if (month < 10) {
            month = '0' + month // 得到月份
          } else {
            month = now.getMonth() + 1// 得到月份
          }

          const lastTwoNowDay = (year - 2) + '-' + month + '-' + date
          return time.getTime() > Date.now() - 86400000 || time.getTime() < new Date(lastTwoNowDay).getTime()
        }
      },
      create_time: [],
      startTime: '',
      endTime: '',
      is_show: false,
      brandBoolean: true,
      brandList: [],
      brand_detail_no: '',
      brandName: '',
      adStatusItems: [{
        label: '基础属性',
        value: 'memberBasicAttr'
      }, {
        label: '会员等级',
        value: 'memberLevel'
      }, {
        label: '会员消费',
        value: 'memberconsume'
      }],
      chartIdArrAll: [],
      ISSUE_STATUS: 'memberBasicAttr',
      chartIdArr: [],
      member_amount: '',
      lastNowDay: '',
      nowDay: ''

    }
  },
  mounted() {
    this.writeCurrentDate()
    this.getSubBrandListFun()
  },
  methods: {
    numFormat(num) {
      var c = (num.toString().indexOf('.') !== -1) ? num.toLocaleString() : num.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,')
      return c
    },
    writeCurrentDate(timeStatus) {
      var now = new Date()
      var year = now.getFullYear() // 得到年份
      var month = now.getMonth()
      var date = now.getDate()// 得到日期
      this.create_time = [new Date(year - 1, month, date - 1), new Date(year, month, date - 1)]

      this.lastNowDay = new Date(this.create_time[0]).Format('yyyy年MM月dd日')
      this.nowDay = new Date(this.create_time[1]).Format('yyyy年MM月dd日')
    },
    getSubBrandListFun() {
      getSubBrandList().then((res) => {
        if (res.data.subBrandList && res.data.subBrandList.length > 0) {
          this.brandList = res.data.subBrandList
          this.brand_detail_no = this.brandList[0].brand_detail_no
          this.brandName = this.brandList[0].brand_detail_name
          this.getMemberOverviewFun()
        }
      })
    },
    initData() {
      if (this.brandList && this.brandList.length > 0) {
        this.brandList.map((item) => {
          if (this.brand_detail_no === item.brand_detail_no) {
            this.brandName = item.brand_detail_name
          }
        })
      }
      if (this.brand_detail_no) {
        this.getMemberOverviewFun()
      } else {
        this.$message.error('等品牌加载完成，才可以点击查询按钮哦！')
      }
      this.lastNowDay = new Date(this.create_time[0]).Format('yyyy年MM月dd日')
      this.nowDay = new Date(this.create_time[1]).Format('yyyy年MM月dd日')
    },
    getChartDataById(param) {
      if (this.ISSUE_STATUS === 'memberBasicAttr') {
        return getMemberBasicAttr(param)
      } else if (this.ISSUE_STATUS === 'memberLevel') {
        return getMemberMemberLevel(param)
      } else if (this.ISSUE_STATUS === 'memberconsume') {
        return getMemberconsume(param)
      }
    },
    getMemberOverviewFun() {
      if (this.create_time && this.create_time.length > 0) {
        var startTime = new Date(this.create_time[0]).Format('yyyy-MM-dd')
        var endTime = new Date(this.create_time[1]).Format('yyyy-MM-dd')
        this.endTime = endTime
        this.startTime = startTime
      }
      this.chartIdArr = []
      getMemberOverview({ brand_detail_no: this.brand_detail_no, startTime: startTime, endTime: endTime }).then((res) => {
        this.member_amount = this.numFormat(res.data.member_amount)

        this.chartIdArrAll = res.data.crmAllIdList
        this.chartIdArrAll.map((item) => {
          if (item.type === this.ISSUE_STATUS) {
            this.chartIdArr = item.idlist
          }
        })
      })
    },
    filterFun(adStatus) {
      if (!this.brand_detail_no) {
        return
      }
      this.ISSUE_STATUS = adStatus
      this.chartIdArr = []
      this.chartIdArrAll.map((item) => {
        if (item.type === adStatus) {
          this.chartIdArr = item.idlist
        }
      })
    }
  }
}
</script>
<style lang="less" >

</style>
<style lang="less" scoped>
/deep/.el-dialog__body{
  padding: 10px 20px
}
.crmGroupPortraint {
  padding: 15px ;
  .crmGroupPortraintBox{
    .member_amount_box{
      font-size: 15px;
      .member_amount{
        color: red;
        font-size: 18px;
      }
    }

    background: #ffffff;
    padding: 10PX;
    .chartsBoxTop{
      min-height: 600px;
    }
    .filter-btns{
      margin: 10PX 0 20PX 0;
    }
    .filter-btns ul li{
      padding: 0 15px;
    }

    .fontColorStyle{
      color: #97a8be
    }
    .el-checkbox-group{
      display: inline-block
    }
    .condtionStyle{
      height: 30px;
      line-height: 30px;
    }
    .FilterStyle{
      display: flex;
      justify-content: flex-end
    }
    .chartAnalysis{
      margin-top: 20px;
    }
    .imgBox{
      width:100%;
      height: 300px;
      overflow-y: scroll;
      position: relative;
      .el-col{
        text-align: center;
        .imgIconItem{
            position: relative;
            display: inline-block;
            height: 100px;
            border: 1px solid #97a8be;
            text-align: center;
          .maskBox{
            position:absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0 , 0, 0.5);
            .el-icon-circle-check{
              position: absolute;
              top: 0;
              left: 0;
              color: red;
              font-size: 28px
            }
          }
        }
      }
    }
    .el-select {
    width: 350px;
}
  }
  .header-title{
    height: 31px;
    border-bottom: 1px solid #c0c0c0;
  }
  .header-title:before{
    content: '';
    width: 4px;
    height: 16px;
    background-color: #3c5175;
    display: inline-block;
    position: absolute;
  }
  .title-name{
    padding-left: 15px
  }
  .boxss{
    border: 1px solid red;
    height: 100px;
  }
}
</style>
