<template>
  <section class="marketing--module-obj-pup">
    <el-form ref="form" :rules="rules" :model="actPreForm">
      <!-- <el-form-item label="营销对象" prop="marketingTarget">
        <el-radio-group v-model="actPreForm.marketingTarget">
          <el-radio v-for="(item,index) in marketingTargets" :key="index" :label="item.label">{{ item.name }} </el-radio>
        </el-radio-group>
      </el-form-item> -->
      <el-form-item prop="marketingType">
        <ul>
          <li v-for="(item,index) in marketTypes" :key="index" :class="item.marketingType === actPreForm.marketingType ? 'active' : ''" @click="changeMarketType(item.marketingType)">
            <span
              :style="{backgroundColor: item.color}">
              <img :src="item.icon" style="width: 70%;height: 70%;">
            </span>
            <div>
              <span>{{ item.name }}</span>
              <p v-html="item.dec"/>
            </div>
          </li>
        </ul>
      </el-form-item>
    </el-form>
  </section>
</template>
<script>

export default {
  name: 'ActPreCondition',
  props: {
    actPreForm: {
      type: Object,
      default() {
        return {
          marketingTarget: '',
          marketingType: ''
        }
      }
    }
  },
  data() {
    return {
      rules: {
        marketingTarget: [
          {
            required: true, message: '请选择营销对象', trigger: 'change'
          }
        ],
        marketingType: [
          {
            message: '请选择营销活动类型', trigger: 'change', validator: this.vaidateMarketingTYpeHandler
          }
        ]
      },
      marketingTargets: [
        {
          label: 'member_id',
          name: '会员'
        },
        {
          label: 'wx_openid',
          name: '关注者'
        }
        // {
        //   label: 'app_openid',
        //   name: '仅APP下载用户'
        // }
      ],
      marketTypes: [
        {
          marketingType: 'diy',
          color: '#fff',
          icon: '/static/market_icons/diyyx.svg',
          name: '主动营销',
          dec: `固定营销人群后，展开单次执行的营销活动。<br/>如给10月份消费满1000元的会员顾客，发送模版消息。`
        },
        {
          marketingType: 'event',
          color: '#fff',
          icon: '/static/market_icons/ssyx.svg',
          name: '实时营销',
          dec: '系统自动针对符合营销事件的会员执行营销动作。<br/>如系统设置顾客注册会员即可获得10元优惠券。'
        },
        {
          marketingType: 'period',
          color: '#fff',
          icon: '/static/market_icons/zqyx.svg',
          name: '周期营销',
          dec: '系统在特定时间（如生日、春节等）自动执行营销动作。<br/>如每年春节给会员发送祝福。'
        }
      ]
    }
  },
  methods: {
    changeMarketType(marketingType) {
      this.actPreForm.marketingType = marketingType
    },
    vaidateMarketingTYpeHandler(rule, value, cb) {
      if (!this.actPreForm.marketingType) {
        return cb(new Error(rule.message))
      }
      cb()
    },
    validateActPre() {
      return new Promise((resolve, reject) => {
        this.$refs['form'].validate((valid) => {
          if (valid) {
            resolve()
          } else {
            reject()
          }
        })
      })
    }
  }
}
</script>
<style lang="less" scope>
.marketing--module-obj-pup {
    ul {
      li {
        &.active {
          background: #fff;
          border: 1px solid #7B8BA7;
          &>div {
            span {
              color:#7B8BA7;
            }
            &::before {
              background: #7B8BA7;
            }
          }
        }
        display: flex;
        align-items: center;
        width: 100%;
        height: 120px;
         border: 1px solid #ddd;
        // background: #ECEEF2;
        margin-bottom: 20px;
        padding: 0 30px 0 128px;
        &>span {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 84px;
          height: 84px;
          border-radius: 50%;
          // background: #7B8BA7;
          margin-right: 29px;
          background-position: center;
          background-repeat: no-repeat;
          background-size: 60px 60px;
        }
        &>div {
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
          justify-content: space-around;
          position: relative;
          box-sizing: border-box;
          width: 448px;
          height: 75px;
          padding-left: 30px;
          span {
            font-size: 18px;
            color: #262626;
          }
          &::before {
            position: absolute;
            top: 50%;
            left: 0;
            content: '';
            width: 1px;
            height:30px;
            margin-top: -15px;
            background: #D6D8DD;
          }
          p {
            font-size: 14px;
            color:#888888;
          }
        }
      }
    }
  }
</style>
