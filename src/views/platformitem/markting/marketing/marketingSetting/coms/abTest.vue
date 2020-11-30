<template>
  <div>
    <el-form ref="form" :rules="rules" :model="form" label-position="right" label-width="80px">
      <el-form-item label="流程说明" prop="node_desc">
        <el-input v-model="form.node_desc" :disabled="onlyRead" placeholder="流程说明"/>
      </el-form-item>
      <div class="hor-line"/>
      <el-form-item label="测试人数" prop="end_numb">
        <el-input v-model="form.end_numb" :disabled="onlyRead" placeholder="测试人数"/>
      </el-form-item>

      <!-- 如果abTest 有分支，则将branchMulNode 置为禁用状态-->
      <el-form-item v-if="isMember" label="测试动作">
        <el-radio-group v-model="form.branchMulNode" :disabled="branchMulNodeDisabled || onlyRead">
          <el-radio label="N">测试单个营销动作</el-radio>
          <el-radio label="Y">测试多个营销动作</el-radio>
        </el-radio-group>
      </el-form-item>
      <!-- 实时营销 -->
      <el-form-item v-if="abTestType === 'event'" label="测试时间" prop="end_time">
        <el-date-picker
          v-model="form.end_time"
          :disabled="onlyRead"
          :append-to-body="false"
          :picker-options="{ disabledDate : disabledDate }"
          format="yyyy-MM-dd HH:mm:ss"
          value-format="yyyy-MM-dd HH:mm:ss"
          type="datetime"
          placeholder="请选择测试结束时间"/>
        <div>（注：当测试人数或测试时间其中一项达到设置值时，结束AB测试）</div>
      </el-form-item>
      <el-form-item label="分支名称">
        <div style="border: 1px solid #D8DCE6;padding-top: 15px; padding-left: 15px; padding-right: 15px;background: #F4F6FA;">
          <el-row v-for="(actionItem, index) in form.actions_ABtest" :key="index">
            <el-col :span="15">
              <el-form-item
                :label="'分支'+(index+1)"
                :prop="'actions_ABtest.'+index+'.desc'"
                label-width="60px">
                <el-input v-model="actionItem.desc" :disabled="onlyRead" placeholder="请简要说明分支动作，如发送50元优惠券"/>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item
                :prop="'actions_ABtest.'+index+'.percent'"
                label="流量配比">
                <el-input v-model.number="actionItem.percent" :disabled="onlyRead">
                  <template slot="append">%</template>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="1">
              <div v-if="(!(onlyRead || activityCreateIfByTemplate()))&&index>=2" class="el-icon-close" style="padding: 9px; cursor: pointer;position: absolute; right: 0;top: 0;" @click="delActions(index)"/>
            </el-col>
          </el-row>
        </div>
        <el-button v-if="(!(onlyRead || activityCreateIfByTemplate())) && form.actions_ABtest.length<8" type="text" @click="addActions">
          <span class="el-icon-plus" style="border: 1px dashed rgb(89, 109, 145);border-radius: 50%;font-size: 13px;"/>
          新增分支
        </el-button>
      </el-form-item>
      <el-form-item label="人群流向">
        <el-radio v-model="form.end_flow_status" :disabled="onlyRead" :label="1">进入最优分支（注：人群流向指营销活动中非测试人员统一流入最优分支）</el-radio>
      </el-form-item>
      <el-form-item
        v-if="abTestType === 'diy'"
        :rules="{
          trigger: 'change', required: true, validator: vaidateValueHandler
        }"
        label="等待时间"
        prop="wait_day_hour">
        <el-input v-model="form.wait_day" :disabled="onlyRead" clearable style="width: 200px;">
          <template slot="append">天</template>
        </el-input>
        <el-select v-model="form.wait_hour" :disabled="onlyRead" clearable style="display: inline-block; width: 200px;">
          <el-option v-for="hour in 23" :label="hour" :value="hour" :key="hour"/>
        </el-select>
        <span>小时</span>
        <div>
          （注：此处等待时间指停止测试后，测试动作的指标计算周期）
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { getCurNodeNextNodes, getPreviousEventNodesInfo } from '../util'
export default {
  name: 'AbTest',
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
    var form = {
      node_desc: '',
      end_numb: '',
      end_time: '',
      wait_day: '',
      wait_hour: '',
      branchMulNode: 'N',
      end_flow_status: 1,
      actions_ABtest: [
        {
          desc: '分支一',
          percent: ''
        },
        {
          desc: '分支二',
          percent: ''
        }
      ]
    }
    var rules = {
      node_desc: [
        {
          required: true, message: '请填写流程简要说明', trigger: 'change'
        }
      ],
      end_numb: [
        {
          required: true, message: '请填写测试人数', trigger: 'change'
        },
        {
          trigger: ['change', 'blur'], validator: this.validateEndNumbHandler
        }
      ],
      end_time: [
        {
          required: true, validator: this.validateAbTestEndTime, trigger: 'change'
        }
      ],
      actions_ABtest: []
    }
    if (this.curComConfig.nodeConf && this.curComConfig.nodeConf.node_desc) {
      form = JSON.parse(JSON.stringify(this.curComConfig.nodeConf))
    }

    for (var i = 0; i < form.actions_ABtest.length; i++) {
      rules.actions_ABtest.push({
        desc: [
          {
            required: true, message: '请填写分支名称', trigger: 'change'
          }
        ],
        percent: [
          {
            required: true, message: '请填写流量配比', trigger: 'change'
          },
          {
            trigger: 'change', validator: this.vaidateAbBranchPercentHandler
          }
        ]
      })
    }

    var previousEventNodesInfo = getPreviousEventNodesInfo(this.curComConfig, this.flowChartMap.flowData.nodeItems)
    var isMember = false
    var mainIdtypeGroup = previousEventNodesInfo.main_idtype_group.concat(this.$route.query.marketing_target)

    if (mainIdtypeGroup.indexOf('member_id') > -1) {
      isMember = true
    }

    // abTest 类型默认为marketing_type
    // period 周期性活动，没有abTest
    var abTestType = this.$route.query.marketing_type
    if (this.$route.query.marketing_type !== 'period') {
      if (previousEventNodesInfo.previousEventNodes.length) {
        abTestType = 'event'
      } else {
        abTestType = 'diy'
      }
    } else {
      abTestType = 'event'
    }

    return {
      abTestType: abTestType,
      isMember: isMember,
      rules: rules,
      actionTempalte: {
        desc: '',
        percent: ''
      },
      form: form
    }
  },
  computed: {
    onlyRead() {
      if (this.actionType === 'edit' || this.actionType === 'add') {
        return false
      } else {
        return true
      }
    },
    branchMulNodeDisabled() {
      return !!getCurNodeNextNodes(this.curComConfig.id, this.flowChartMap.flowData.nodeItems).length
    }
  },
  methods: {
    validateAbTestEndTime(rule, value, cb) {
      if (this.form.end_time > this.flowChartMap.$refs['activityMainSetting'].form.marketingTimeBegin && this.form.end_time < this.flowChartMap.$refs['activityMainSetting'].form.marketingTimeEnd) {
        cb()
      } else {
        cb(new Error('请测试结束时间需大于活动开始时间，小于活动结束时间'))
      }
    },
    disabledDate(date) {
      if ((new Date(date).Format('yyyy-MM-dd HH:mm:ss') > this.flowChartMap.$refs.activityMainSetting.form.marketingTimeBegin && new Date(date).Format('yyyy-MM-dd HH:mm:ss') < this.flowChartMap.$refs.activityMainSetting.form.marketingTimeEnd)) {
        return false
      } else {
        return true
      }
    },
    activityCreateIfByTemplate() {
      if (this.flowChartMap.activityInfo.marketingTemplateDefId) {
        return true
      }
      return false
    },
    confirmHandler(cb) {
      this.$refs['form'].validate((valid) => {
        if (!valid) {
          cb(false)
          return
        }
        var percentSum = 0
        for (var i = 0; i < this.form.actions_ABtest.length; i++) {
          percentSum += Number(this.form.actions_ABtest[i].percent)
        }
        if (percentSum !== 100) {
          this.$message({
            type: 'error',
            message: '分支流量配比和不为100'
          })
          cb(false)
          return
        }

        this.curComConfig.nodeConf = this.form
        cb(true)
      })
    },
    addActions() {
      this.form.actions_ABtest.push({
        desc: '',
        percent: ''
      })
      this.rules.actions_ABtest.push({
        desc: [
          {
            required: true, message: '请填写分支名称', trigger: 'change'
          }
        ],
        percent: [
          {
            required: true, message: '请填写流量配比', trigger: 'change'
          },
          {
            trigger: 'change', validator: this.vaidateAbBranchPercentHandler
          }
        ]
      })
    },
    delActions(index) {
      this.form.actions_ABtest.splice(index, 1)
    },
    validateEndNumbHandler(rule, value, cb) {
      if (!/^[1-9]\d*$/.test(this.form.end_numb)) {
        cb(new Error('请填写正整数'))
        return
      }
      cb()
    },
    vaidateAbBranchPercentHandler(rule, value, cb) {
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
        return
      } else {
        cb(new Error('正整数且大于0小于100'))
        return
      }
    },
    vaidateValueHandler(rule, value, cb) {
      if (!/^[1-9]\d*$/.test(this.form.wait_day) && !/^[1-9]\d*$/.test(this.form.wait_hour)) {
        cb(new Error('请填写正整数'))
        return
      } else {
        if (this.form.wait_day) {
          if (!/^[1-9]\d*$/.test(this.form.wait_day)) {
            cb(new Error('请填写正整数'))
            return
          }
        }
        if (this.form.wait_hour) {
          if (!/^[1-9]\d*$/.test(this.form.wait_hour)) {
            cb(new Error('请填写正整数'))
            return
          }
        }
        cb()
      }
    }
  }
}
</script>
