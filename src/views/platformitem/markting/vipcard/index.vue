<template>
  <div class="wrapper">
    <div class="selectWrapper">
      <el-select v-model="brand" placeholder="请选择" @change="handleChangeBrand">
        <el-option
          v-for="item in options"
          :key="item.id"
          :label="item.label"
          :value="item.id"
        />
      </el-select>
    </div>
    <div v-if="!data" class="createWrppaer">
      <p class="bold">该品牌未创建微信会员卡</p>
      <p class="explain">(创建前，请确保已在微信公众号后台-开通“卡券功能”)</p>
      <el-button size="large" @click="handleClickCreate">创建会员卡</el-button>
    </div>
    <div v-if="data" class="infoWrapper">
      <el-row type="flex" align="middle" justify="space-between">
        <el-col :span="5">{{ $t('vipcard.vipcardId') }}: {{ vipCardId }}</el-col>
        <el-col :span="5">{{ $t('vipcard.auditStatus') }}: {{ status }}</el-col>
        <el-col :span="5">{{ $t('vipcard.lastOperator') }}: {{ peoplename }}</el-col>
        <el-col :span="5">{{ $t('vipcard.lastOperationTime') }}: {{ updateTime }}</el-col>
        <el-col :span="4" style="text-align:right;">
          <el-button @click="$router.push('/vipcard/cardform')">{{ $t('vipcard.edit') }}</el-button>
        </el-col>
      </el-row>
    </div>
    <div v-if="data" class="contentWrapper">
      <div id="preview" class="preview">
        <div class="cardWrapper">
          <div
            :style="form.couponCoverType === '1' ? {backgroundColor: form.couponColor} : {backgroundImage: `url(${form.couponImage})`}"
            class="card">
            <span class="logo">
              <img v-if="form.businessLogo.length" :src="form.businessLogo" alt="">
            </span>
            <div class="logoArea">
              <span>{{ form.businessName }}</span>
              <p class="cardTitle">{{ form.cardTitle }}</p>
              <span class="qrcode"/>
            </div>
            <div class="msgArea">
              <span class="memberNumber">0123 4567 8901</span>
              <span class="iconInfo" />
            </div>
          </div>
        </div>
        <div class="infoCategoryWrapper">
          <el-row
            v-if="form.infoCategory.length"
            class="borderBottom"
          >
            <el-col
              v-for="(item, index) in form.infoCategory"
              :span="24/form.infoCategory.length"
              :key="index"
              class="borderRight"
            >
              <el-col :span="24" class="title">
                {{ formatInfoCategoryPreview(item) }}
              </el-col>
              <el-col :span="24" class="link">
                {{ formatInfoLink(item) }}
              </el-col>
            </el-col>
          </el-row>
        </div>
        <div class="listWrapper">
          <ul class="list">
            <li>
              <div class="panel">
                <div>
                  <p>{{ $t('vipcard.applicableStores') }}</p>
                </div>
                <span class="icon"/>
              </div>
            </li>
            <li>
              <div class="panel">
                <div>
                  <p>{{ $t('vipcard.publicNumber') }}</p>
                </div>
                <span class="icon"/>
              </div>
            </li>
          </ul>
        </div>
        <div class="customEntryWrapper">
          <ul class="list">
            <li v-if="!form.customEntry.length">
              <div class="panel">
                <div>
                  <p>{{ $t('vipcard.customEntryOptional') }}</p>
                </div>
                <span class="icon"/>
              </div>
            </li>
            <li v-for="(item,index) in form.customEntry" :key="index">
              <div class="panel">
                <div>
                  <p>{{ item.entryName === '' ?$t('vipcard.customEntryOptional') :item.entryName }}<span class="guideLang">{{ item.guideLang }}</span></p>
                </div>
                <span class="icon"/>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div id="form" class="form">
        <p class="title">{{ $t('vipcard.basicInfo') }}</p>
        <el-row class="row">
          <el-col :span="4">{{ $t('vipcard.businessName') }}</el-col>
          <el-col :span="18">{{ form.businessName }}</el-col>
        </el-row>
        <el-row class="row" type="flex" align="middle">
          <el-col :span="4" >{{ $t('vipcard.logo') }}</el-col>
          <el-col :span="18">
            <img :src="form.businessLogo" class="businessLogo" alt="">
          </el-col>
        </el-row>
        <el-row class="row" type="flex" align="middle">
          <el-col :span="4">{{ $t('vipcard.couponCover') }}</el-col>
          <el-col :span="18">
            <span v-if="form.couponCoverType === '1'">
              <span :style="{backgroundColor: form.couponColor}" class="couponCoverColor"/>
            </span>
            <span v-if="form.couponCoverType === '2'">
              <img :src="form.couponImage" class="couponCoverImage" alt="">
            </span>
          </el-col>
        </el-row>
        <el-row class="row">
          <el-col :span="4">{{ $t('vipcard.vipcardTitle') }}</el-col>
          <el-col :span="18">{{ form.cardTitle }}</el-col>
        </el-row>
        <el-row class="row">
          <el-col :span="4">{{ $t('vipcard.infoCategory') }}</el-col>
          <el-col :span="18">{{ formatInfoCategory(form.infoCategory) }}</el-col>
        </el-row>
        <el-row class="row">
          <el-col :span="4">{{ $t('vipcard.validityPeriod') }}</el-col>
          <el-col :span="18">
            <span v-if="form.effectTime === '1'">
              {{ $t('vipcard.permanent') }}
            </span>
            <span v-if="form.effectTime === '2'">
              {{ $t('vipcard.fixedDate') }}: {{ form.fixedDate | formatFixedDate }}
            </span>
          </el-col>
        </el-row>
        <p class="title">
          {{ $t('vipcard.vipcardDetails') }}
        </p>
        <el-row class="row">
          <el-col :span="4">{{ $t('vipcard.privilegeDes') }}</el-col>
          <el-col :span="18">{{ form.privelegeDes }}</el-col>
        </el-row>
        <el-row class="row">
          <el-col :span="4">{{ $t('vipcard.usageNotice') }}</el-col>
          <el-col :span="18">{{ form.usageNotice }}</el-col>
        </el-row>
        <p class="title">
          {{ $t('vipcard.merchantIntro') }}
        </p>
        <el-row class="row">
          <el-col :span="4">{{ $t('vipcard.phone') }}</el-col>
          <el-col :span="18">{{ form.telephone }}</el-col>
        </el-row>
        <div v-for="(item, index) in form.customEntry" :key="index">
          <p class="title">{{ $t('vipcard.customEntry') }}{{ $t(`vipcard.${index}`) }}</p>
          <div v-if="item.jumpType === '1'">
            <el-row class="row">
              <el-col :span="4">{{ $t('vipcard.entryName') }}</el-col>
              <el-col :span="18">{{ item.entryName }}</el-col>
            </el-row>
            <el-row class="row">
              <el-col :span="4">{{ $t('vipcard.guideWords') }}</el-col>
              <el-col :span="18">{{ item.guideLang }}</el-col>
            </el-row>
            <el-row class="row">
              <el-col :span="4">{{ $t('vipcard.jumpType') }}</el-col>
              <el-col :span="18">{{ $t('vipcard.webLinks') }}</el-col>
            </el-row>
            <el-row class="row">
              <el-col :span="4">{{ $t('vipcard.webLinks') }}</el-col>
              <el-col :span="18">{{ item.pageLink }}</el-col>
            </el-row>
          </div>
          <div v-if="item.jumpType === '2'">
            <el-row class="row">
              <el-col :span="4">{{ $t('vipcard.entryName') }}</el-col>
              <el-col :span="18">{{ item.entryName }}</el-col>
            </el-row>
            <el-row class="row">
              <el-col :span="4">{{ $t('vipcard.guideWords') }}</el-col>
              <el-col :span="18">{{ item.guideLang }}</el-col>
            </el-row>
            <el-row class="row">
              <el-col :span="4">{{ $t('vipcard.jumpType') }}</el-col>
              <el-col :span="18">{{ $t('vipcard.miniApp') }}</el-col>
            </el-row>
            <el-row class="row">
              <el-col :span="4">{{ $t('vipcard.miniAppId') }}</el-col>
              <el-col :span="18">{{ item.miniAppId }}</el-col>
            </el-row>
            <el-row class="row">
              <el-col :span="4">{{ $t('vipcard.miniAppPath') }}</el-col>
              <el-col :span="18">{{ item.miniAppPath }}</el-col>
            </el-row>
          </div>
        </div>
        <p class="title">{{ $t('vipcard.otherSettings') }}</p>
        <el-row class="row">
          <el-col :span="4">{{ $t('vipcard.actInfo') }}</el-col>
          <el-col :span="4">{{ $t('vipcard.phoneNumber') }}</el-col>
          <el-col :span="16">{{ $t('vipcard.required') }}</el-col>
        </el-row>
        <el-row v-for="(item) in form.actInfo" v-if="item.name !== 'phoneNumber'" :key="item.name" class="row">
          <el-col :offset="4" :span="4">{{ $t(`vipcard.${item.name}`) }}</el-col>
          <el-col v-if="item.required" :span="16">
            {{ $t('vipcard.required') }}
          </el-col>
          <el-col v-if="!item.required" :span="16">
            {{ $t('vipcard.notRequired') }}
          </el-col>
        </el-row>
        <el-row class="row">
          <el-col :span="4">{{ $t('vipcard.operationTips') }}</el-col>
          <el-col :span="18">{{ form.operationTip }}</el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>
<script>
import axios from 'axios'

export default {
  filters: {
    formatIndex(value) {
      const indexArr = ['一', '二', '三']
      return indexArr[value]
    },
    formatEntryName(value) {
      if (value === '') {
        return '自定义入口(选填)'
      }
      return value
    },
    formatActInfo(value) {
      const infoObj = {
        'phoneNumber': '手机号',
        'name': '姓名',
        'gender': '性别',
        'birthday': '生日',
        'email': '邮箱',
        'address': '详细地址'
      }
      return infoObj[value]
    },
    formatInfoCategory(value) {
      const formatArr = [...value]
      const length = formatArr.length
      const formatObj = {
        integration: '积分',
        level: '等级',
        coupon: '优惠券'
      }
      for (let i = 0; i < length; i++) {
        formatArr[i] = formatObj[formatArr[i]]
      }
      return formatArr.join('、')
    },
    formatFixedDate(value) {
      const startDate = value[0]
      const endDate = value[1]
      return [new Date(startDate * 1000).toLocaleDateString(), new Date(endDate * 1000).toLocaleDateString()].join('--')
    },
    formatInfoCategoryPreview(value) {
      const infoObj = {
        'integration': '积分',
        'level': '等级',
        'coupon': '优惠券'
      }
      return infoObj[value]
    },
    formatInfoLink(value) {
      const infoObj = {
        'integration': '100',
        'level': '钻石会员',
        'coupon': '查看'
      }
      return infoObj[value]
    }
  },
  data() {
    return {
      brand: '',
      data: {},
      options: [{
        id: '111',
        label: 'TopSports'
      }, {
        id: '222',
        label: 'Belle'
      }],
      vipCardId: '123123123123',
      status: '通过',
      peoplename: 'XXX',
      updateTime: '2019.03.09',
      form: {
        businessName: 'TOPSPORTS',
        businessLogo: '',
        couponCoverType: '1',
        couponColor: '#63b359',
        couponImage: '',
        cardTitle: '会员卡',
        infoCategory: ['integration', 'level', 'coupon'],
        effectTime: '2',
        fixedDate: [123123123, 123123444],
        privelegeDes: '特权说明',
        usageNotice: '使用须知',
        telephone: '020-88990088',
        customEntry: [{
          entryName: '附近门店',
          guideLang: '',
          jumpType: '1',
          pageLink: 'http://www.XXXX.com/XXXXX',
          miniAppId: '',
          miniAppPath: ''
        }, {
          entryName: '伯俊秀一秀',
          guideLang: '去玩玩',
          jumpType: '2',
          pageLink: '',
          miniAppId: 'wx3cd3ec5abc67d98d',
          miniAppPath: '/index/pages'
        }],
        actInfo: [{
          name: 'phoneNumber',
          required: true
        }, {
          name: 'gender',
          required: false
        }, {
          name: 'birthday',
          required: false
        }, {
          name: 'address',
          required: true
        }],
        operationTip: '使用时向服务员出示此券'
      }
    }
  },
  mounted() {
    this.handleScroll()
    window.addEventListener('scroll', this.handleScroll, true)
    axios.get('http://10.0.30.96/mock/142/vipcardpreview')
      .then(res => {
        const { data } = res
        this.form = data
        // console.log(res)
      })
      .catch(err => {
        this.$message.error(err)
      })
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.handleScroll, true)
  },
  methods: {
    handleChangeBrand(value) {
      // console.log(value)
      axios.get('http://10.0.30.96/mock/142/vipcardpreview')
        .then(res => {
          const { data } = res
          this.form = data
          // console.log(res)
        })
        .catch(err => {
          this.$message.error(err)
        })
    },
    formatInfoCategory(value) {
      const formatArr = [...value]
      const length = formatArr.length
      for (let i = 0; i < length; i++) {
        formatArr[i] = this.$t(`vipcard.${formatArr[i]}`)
      }
      return formatArr.join('、')
    },
    formatInfoCategoryPreview(value) {
      const infoObj = {
        'integration': 'vipcard.integration',
        'level': 'vipcard.level',
        'coupon': 'vipcard.coupon'
      }
      return this.$t(infoObj[value])
    },
    formatInfoLink(value) {
      const infoObj = {
        'integration': 'vipcard.integrationNum',
        'level': 'vipcard.diamondMember',
        'coupon': 'vipcard.check'
      }
      return this.$t(infoObj[value])
    },
    handleClickCreate() {
      // 通过后台判断是否有开启卡券功能，有则做路由跳转，无则提示未创建
      // console.log(this.$route, this.$router)
    },
    handleScroll() {
      const preview = document.getElementById('preview')
      const form = document.getElementById('form')
      if (!form) {
        return
      }
      const { top } = form.getBoundingClientRect()
      if (top < 50) {
        preview.style.position = 'fixed'
        preview.style.width = '320px'
        preview.style.top = '80px'
        form.style.marginLeft = '360px'
      } else if (top > 50) {
        preview.style.position = 'static'
        preview.style.width = ''
        form.style.marginLeft = '40px'
      }
    }
  }
}
</script>
<style lang="less" scoped>
  .wrapper {
    position: relative;
    padding: 50px 20px;
    .selectWrapper {
      padding: 24px 0 24px 16px;
      border: 1px solid #ccc;
      box-shadow: 0px 5px 10px rgba(0,0,0,.1);
    }
    .createWrppaer {
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      height: 50vh;
      p.bold {
        font-size: 20px;
        font-weight: bold;
        color:rgb(60, 60, 60);
      }
      p.explain {
        font-size: 12px;
        color: rgb(166,166,166);
        margin-bottom: 10px;
      }
    }
    .infoWrapper {
      margin-top: 44px;
      font-size: 14px;
    }
    .contentWrapper {
      margin-top: 30px;
      display: flex;
      .preview {
        height: 570px;
        flex-basis: 320px;
        flex-shrink: 0;
        background-color: #f6f6f8;
        border: 1px solid #e7e7eb;
        .cardWrapper {
          padding: 80px 26px 10px;
          background-image: url('/static/WechatVipCard/topBackground.png');
          background-repeat: no-repeat;
          background-color: #fff;
          .card {
            border: 1px solid #ccc;
            position: relative;
            background-size: cover;
            background-position: top center;
            height: 137px;
            border-radius: 12px;
            .logo {
              position: absolute;
              display: block;
              width: 38px;
              height: 38px;
              top: 24px;
              left: 20px;
              background-color: #fff;
              border:1px solid #e7e7eb;
              border-radius: 22px;
              font-size: 24px;
              img {
                width:100%;
                height: 100%;
                display: block;
                border-radius: 50%;
              }
            }
            .logoArea {
              padding: 24px 20px 12px 66px;
              line-height: 20px;
              color: #fff;
              font-size: 14px;
              font-weight: bolder;
              text-shadow: 1px 1px 3px #666;
              .cardTitle {
                font-size: 14px;
                font-weight: bold;
              }
              .qrcode {
                width: 36px;
                height: 36px;
                background: url('/static/WechatVipCard/vipCardQrcode.png') 0 -147px no-repeat;
                position: absolute;
                top: 26px;
                right: 20px;
              }
            }
            .msgArea {
              padding: 2px 20px 10px;
              position: absolute;
              bottom: 0;
              width: 100%;
              .memberNumber {
                font-size: 17px;
                font-family: menlo,tahoma;
                text-shadow: 1px 1px 2px #666;
                line-height: 18px;
                color: #fff;
              }
              .iconInfo {
                display: block;
                width: 18px;
                height: 18px;
                float: right;
                background: url('/static/WechatVipCard/vipCardQrcode.png') 0 -187px no-repeat;
              }
            }
          }
        }
        .infoCategoryWrapper {
          background-color: #fff;
          .borderBottom {
            padding-bottom: 20px;
            border-bottom: 1px solid #e7e7eb;
            .borderRight {
              border-right: 1px solid #e7e7eb;
            }
            .borderRight:last-of-type{
              border-right: none;
            }
            .title {
              font-size: 12px;
              text-align: center;
              margin-bottom: 10px;
            }
            .link {
              color: rgb(219, 152, 86);
              text-align: center;
            }
          }
        }
        .listWrapper {
          background-color: #fff;
          ul.list {
            margin: 0 10px;
            // border-bottom: 1px solid #e7e7eb;
            li {
              position: relative;
              .panel {
                font-size: 14px;
                padding: 11px 30px 11px 0;
                border-bottom: 1px solid #e7e7eb;
                .icon {
                  position: absolute;
                  top: 36%;
                  right: 5px;
                  width: 16px;
                  height: 15px;
                  background: url('/static/WechatVipCard/vipCardQrcode.png') 0 -128px no-repeat;
                }
              }
              &:last-of-type {
                .panel {
                  border-bottom: none;
                }
              }
            }
          }
        }
        .customEntryWrapper {
          margin-top: 14px;
          background-color: #fff;
          ul.list {
            margin: 0 10px;
            li {
              position: relative;
              .panel {
                font-size: 14px;
                padding: 11px 30px 11px 0;
                border-bottom: 1px solid #e7e7eb;
                .guideLang {
                  color: #8d8d8d;
                  float: right;
                }
                .icon {
                  position: absolute;
                  top: 36%;
                  right: 5px;
                  width: 16px;
                  height: 15px;
                  background: url('/static/WechatVipCard/vipCardQrcode.png') 0 -128px no-repeat;
                }
              }
              &:last-of-type {
                .panel {
                  border-bottom: none;
                }
              }
            }
          }
        }
      }
      .form {
        margin-left: 40px;
        padding: 10px 30px 50px;
        font-size: 12px;
        flex-grow: 1;
        background-color: rgb(244, 245, 249);
        .couponCoverColor {
          display: inline-block;
          width: 30px;
          height: 30px;
        }
        .couponCoverImage {
          display: inline-block;
          width: 100px;
          height: 52px;
        }
        .businessLogo {
          display: inline-block;
          width: 70px;
          height: 70px;
          border-radius: 50%;
          border: 1px solid #ccc;
        }
        .row {
          margin-bottom: 24px;
        }
        .title {
          font-size: 14px;
          color: #333;
          position: relative;
          margin-top: 40px;
          margin-bottom: 36px;
          &::before {
            content: '';
            display: inline-block;
            background-color: #428bca;
            width: 3px;
            height: 20px;
            margin-right: 10px;
            vertical-align: middle;
          }
          &::after{
            content: '';
            display: block;
            background-color: #ccc;
            height: 2px;
            margin-top: 14px;
          }
        }
      }
    }
  }
</style>
