<template>
  <div style="padding: 15px;">
    <div style="margin-bottom: 25px;">指标考核得分=指标得分*指标权重；单个指标时，权重默认为100%；2个指标时，得分为指标权重结果之和。</div>
    <el-form ref="form" :model="form" :rules="rules" label-position="left" label-width="120px" style="width: 600px;">
      <div v-if="branchMulNode === 'Y'" >
        <el-form-item label="券核销权重" prop="couponVerificateWeight">
          <el-input v-model="form.couponVerificateWeight" :disabled="onlyRead">
            <template slot="append">%</template>
          </el-input>
        </el-form-item>
        <el-form-item label="链接点击权重" prop="linkClickWeight">
          <el-input v-model="form.linkClickWeight" :disabled="onlyRead">
            <template slot="append">%</template>
          </el-input>
        </el-form-item>
      </div>
      <div v-if="branchMulNode === 'N'" >
        <el-form-item v-if="abTestLevel1FirstNode.component === 'coupon'" label="券核销权重" prop="couponVerificateWeight">
          <el-input v-model="form.couponVerificateWeight" disabled>
            <template slot="append">%</template>
          </el-input>
        </el-form-item>
        <el-form-item v-else label="链接点击权重" prop="linkClickWeight">
          <el-input v-model="form.linkClickWeight" disabled>
            <template slot="append">%</template>
          </el-input>
        </el-form-item>
      </div>
    </el-form>
  </div>
</template>
<script>
export default {
  name: 'Metric',
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
  inject: ['flowChartMap'],
  data() {
    // abTest 节点
    var AB_Test_NodeItem
    var branchMulNode = 'N'
    // abTest 第一层级的第一个节点
    var abTestLevel1FirstNode
    var nodeItemMap = this.generateNodeItemMap(this.flowChartMap.flowData.nodeItems)
    var firstParentId = this.curComConfig.parentId.split(',')[0]
    // 假装是分支但动作
    AB_Test_NodeItem = nodeItemMap[nodeItemMap[firstParentId].parentId]

    // 通过判断节点metric 的parent 的parent 是不是abTest， 来推断ABtest是否是分支多动作
    if (AB_Test_NodeItem.component !== 'abTest') {
      abTestLevel1FirstNode = AB_Test_NodeItem
      AB_Test_NodeItem = nodeItemMap[AB_Test_NodeItem.parentId]
      branchMulNode = 'Y'
    } else {
      abTestLevel1FirstNode = nodeItemMap[firstParentId]
      branchMulNode = 'N'
    }

    var nodeConf = {
      couponVerificateWeight: '',
      linkClickWeight: ''
    }

    if (this.curComConfig.nodeConf.couponVerificateWeight) {
      nodeConf = Object.assign({}, this.curComConfig.nodeConf)
    } else {
      if (branchMulNode === 'N') {
        if (abTestLevel1FirstNode.component === 'coupon') {
          nodeConf.couponVerificateWeight = 100
        } else {
          nodeConf.linkClickWeight = 100
        }
      }
    }

    return {
      abTestLevel1FirstNode: abTestLevel1FirstNode,
      rules: {
        couponVerificateWeight: [
          {
            required: true, trigger: 'change', validator: this.validateValue
          }
        ],
        linkClickWeight: [
          {
            required: true, trigger: 'change', validator: this.validateValue
          }
        ]
      },
      branchMulNode: branchMulNode,
      form: nodeConf
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
  methods: {
    generateNodeItemMap(nodeItems) {
      var nodeItemMap = {}
      for (var i = 0; i < nodeItems.length; i++) {
        nodeItemMap[nodeItems[i].id] = nodeItems[i]
      }
      return nodeItemMap
    },
    validateValue(rule, value, cb) {
      if (this.branchMulNode === 'Y') {
        if (/^[1-9]\d*$/.test(value)) {
          if (parseInt(value) >= 100) {
            cb(new Error('正整数且小于100'))
            return
          }
          if (parseInt(value) <= 0) {
            cb(new Error('正整数且大于0'))
            return
          }

          cb()
        } else {
          cb(new Error('正整数且大于0小于100'))
        }
      } else {
        cb()
      }
    },
    confirmHandler(cb) {
      this.$refs['form'].validate((valid) => {
        if (!valid) {
          cb(false)
          return
        }

        if (this.branchMulNode === 'Y') {
          if ((Number(this.form.couponVerificateWeight) + Number(this.form.linkClickWeight)) !== 100) {
            this.$message({
              type: 'error',
              message: '权重之和不为100'
            })
            cb(false)
            return
          }
        } else {
          if ((Number(this.form.couponVerificateWeight) + Number(this.form.linkClickWeight)) !== 100) {
            this.$message({
              type: 'error',
              message: '权重不为100'
            })
            cb(false)
            return
          }
        }

        this.curComConfig.nodeConf = this.form

        cb(true)
      })
    }
  }
}
</script>
<style>
.metric-title {
  border: 1px solid #e4e7ed;
  padding: 10px 15px;
  background: #f4f6fa;
  color: #435a82;
}
.metric-branch-desc {
  padding: 10px 0;
  line-height: 26px;
  color: #666;
}
</style>
