<template>
  <el-form ref="form" :model="nodeConf" label-position="right" label-width="80px" @submit.native.prevent>
    <el-form-item
      :rules="{
        message: '请填写流程简要说明', trigger: 'change', required: true
      }"
      label="流程说明"
      prop="node_desc">
      <el-input v-model="nodeConf.node_desc" :disabled="onlyRead" placeholder="流程说明"/>
    </el-form-item>
    <div class="hor-line"/>
    <belle-choose-third-coupon ref="belleChooseThirdCoupon" v-model="nodeConf.nodeData" :config="config" :only-read="onlyRead" :checked-coupons="checkedCrossCoupon"/>
  </el-form>
</template>
<script>
import { thirdConfirmUse } from '@/api/markting/marketing'
import belleChooseThirdCoupon from '@/privatemodules/belle-choose-third-coupon'
import { getToken } from '@/utils/auth'

export default {
  name: 'CrossCoupon',
  components: {
    belleChooseThirdCoupon
  },
  inject: ['flowChartMap'],
  props: {
    curComConfig: {
      type: Object,
      default() {
        return {}
      }
    },
    actionType: {
      type: String,
      default() {
        return 'edit'
      }
    }
  },
  data() {
    return {
      config: {
        brandCode: getToken('brandCode'),
        AppToken: 'test'
      },
      nodeConf: {
        node_desc: this.curComConfig.nodeConf.node_desc || '',
        nodeData: this.curComConfig.nodeConf || {}
      },
      checkedCrossCoupon: [],
      readyCode: ''
    }
  },
  computed: {
    onlyRead() {
      if (this.actionType === 'edit' || this.actionType === 'add') {
        return false
      } else {
        return true
      }
    }
  },
  mounted() {
    if (this.curComConfig.nodeConf.ticketRuleCode) {
      this.readyCode = this.curComConfig.nodeConf
    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      var nodeItems = this.flowChartMap.flowData.nodeItems
      var checkedCrossCoupons = []
      for (var i = 0; i < nodeItems.length; i++) {
        if (nodeItems[i].component === 'crossCoupon' && nodeItems[i].id !== this.curComConfig.id) {
          checkedCrossCoupons.push(nodeItems[i].nodeConf.ticketRuleCode)
        }
      }
      this.checkedCrossCoupon = checkedCrossCoupons
    },
    confirmUse(ticketRuleCode, operationType) {
      const params = {
        couponRuleCode: ticketRuleCode,
        operationType: operationType
      }
      thirdConfirmUse(params).then(res => {
        // this.$refs['comSetting'].confirmHandler(this.validCallback)
      })
    },
    confirmHandler(cb) {
      this.$refs['form'].validate((valid) => {
        if (!valid) {
          cb(false)
          return
        }
        if (this.$route.query.create_type === 'template') {
          this.curComConfig.nodeConf = {
            ...this.nodeConf.nodeData,
            node_desc: this.nodeConf.node_desc
          }
          cb(true)
        } else {
          this.$refs['belleChooseThirdCoupon'].changeCouponRuleCode()
          if (this.nodeConf.nodeData.ticketRuleCode) {
            this.curComConfig.nodeConf = {
              ...this.nodeConf.nodeData,
              node_desc: this.nodeConf.node_desc
            }
            /* if (this.readyCode.ticketRuleCode !== this.curComConfig.nodeConf.ticketRuleCode) {
              if (!this.readyCode.ticketRuleCode) {
                if (this.curComConfig.nodeConf.ticketRuleCode) {
                  this.confirmUse(this.curComConfig.nodeConf.ticketRuleCode, 1)
                }
              } else {
                // 释放 占用
                this.confirmUse(this.readyCode.ticketRuleCode, 2)
                this.confirmUse(this.curComConfig.nodeConf.ticketRuleCode, 1)
              }
            } */
            cb(true)
          } else {
            cb(false)
            this.$message.warning('请选择异业券')
          }
        }
      })
    }
  }
}
</script>
