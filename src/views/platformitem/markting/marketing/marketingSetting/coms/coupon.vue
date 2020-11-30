<template>
  <el-form ref="form" :model="nodeConf" label-position="right" label-width="90px" @submit.native.prevent>
    <el-form-item
      :rules="{
        message: '请填写流程简要说明', trigger: 'change', required: true
      }"
      label="流程说明"
      prop="node_desc">
      <el-input v-model="nodeConf.node_desc" :disabled="onlyRead" placeholder="流程说明"/>
    </el-form-item>
    <div class="hor-line"/>
    <belle-choose-coupon ref="belleChooseCoupon" v-model="nodeConf.nodeData" :checked-coupons="checkedCoupons" :only-read="onlyRead" :config="config"/>
  </el-form>
</template>
<script>
import { confirmUse } from '@/api/markting/marketing'
import belleChooseCoupon from '@/privatemodules/belle-choose-coupon'
import { getToken } from '@/utils/auth'

export default {
  components: {
    belleChooseCoupon
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
        AppToken: 't'
      },
      nodeConf: {
        node_desc: this.curComConfig.nodeConf.node_desc || '',
        nodeData: this.curComConfig.nodeConf || {}
      },
      checkedCoupons: [],
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
  created() {
    this.init()
  },
  mounted() {
    if (this.curComConfig.nodeConf.couponRuleCode) {
      this.readyCode = this.curComConfig.nodeConf
    }
  },
  methods: {
    init() {
      var nodeItems = this.flowChartMap.flowData.nodeItems
      var checkedCoupons = []
      for (var i = 0; i < nodeItems.length; i++) {
        if (nodeItems[i].component === 'coupon' && nodeItems[i].id !== this.curComConfig.id) {
          checkedCoupons.push(nodeItems[i].nodeConf.couponRuleCode)
        }
      }
      this.checkedCoupons = checkedCoupons
    },
    confirmUse(couponType, couponRuleCode, operationType) {
      const params = {
        couponType: couponType,
        couponRuleCode: couponRuleCode,
        operationType: operationType
      }
      confirmUse(params).then(res => {
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
          this.$refs['belleChooseCoupon'].changeCouponRuleCode()
          if (this.nodeConf.nodeData.couponRuleCode) {
            this.curComConfig.nodeConf = {
              ...this.nodeConf.nodeData,
              node_desc: this.nodeConf.node_desc
            }
            /* if (this.readyCode.couponRuleCode !== this.curComConfig.nodeConf.couponRuleCode) {
              if (!this.readyCode.couponRuleCode) {
                if (this.curComConfig.nodeConf.couponRuleCode) {
                  this.confirmUse(this.curComConfig.nodeConf.couponType, this.curComConfig.nodeConf.couponRuleCode, 1)
                }
              } else {
                // 释放 占用
                this.confirmUse(this.readyCode.couponType, this.readyCode.couponRuleCode, 2)
                this.confirmUse(this.curComConfig.nodeConf.couponType, this.curComConfig.nodeConf.couponRuleCode, 1)
              }
            } */
            cb(true)
          } else {
            cb(false)
            this.$message.warning('请选择优惠券')
          }
        }
      })
    }
  }
}
</script>
