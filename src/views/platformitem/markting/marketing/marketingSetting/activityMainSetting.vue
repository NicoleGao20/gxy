<template>
  <div class="main-info-wrap">
    <el-collapse-transition>
      <div v-show="showMainInfo">
        <div class="actvity-main-setting" style="padding-top: 15px; border: 1px solid #EBEEF5; background: #fff">
          <div style="padding: 5px 0 15px 20px;">
            <div class="label-title">
              <i class="linev-tip"/><span class="label-desc">活动主体信息</span>
            </div>
          </div>
          <el-form ref="form" :model="form" :rules="rules" label-position="right" label-width="100px" style="padding: 0 20px;">
            <el-row :gutter="60">
              <el-col :span="12">
                <el-form-item label="营销目的" prop="marketingPurpose">
                  <el-select :disabled="marketingPurposeDisabled" v-model="form.marketingPurpose" placeholder="请选择营销目的" style="width: 100%;">
                    <el-option v-for="(activityPurposeItem, index) in marketingPurposes" :key="index" :label="activityPurposeItem.name" :value="activityPurposeItem.value"/>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="营销名称" prop="marketingName">
                  <el-input :disabled="inputDisabled" v-model="form.marketingName" clearable placeholder="请填写营销名称"/>
                  <div style="position: absolute; right: 0; top: 26px; font-size: 12px; cursor:pointer; color: #435A82;">
                    <el-popover
                      placement="left"
                      title="名称规范"
                      width="200"
                      trigger="hover">
                      <span slot="reference">名称规范</span>
                      <p solt="content" style="fontSize: 12px;">内容说明：直观体现活动内容，如“发送20元优惠券”<br><br>字数说明：不超过200个字符，一个汉字占两个字符，一个数字、字母、空格占一个字符；</p>
                    </el-popover>
                  </div>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="营销时间" prop="marketingTimeStartEnd">
                  <el-date-picker
                    :disabled="inputDisabled"
                    v-model="form.marketingTimeStartEnd"
                    :picker-options="{ disabledDate : disabledDate }"
                    format="yyyy-MM-dd HH:mm:ss"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    style="width: 100%;"
                    type="datetimerange"
                    align="right"
                    unlink-panels
                    range-separator="-"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    @change="changeMarketingTimeHandler"/>
                </el-form-item>
              </el-col>
              <el-col v-if="$route.query.marketing_type === 'event'||$route.query.marketing_type === 'period'" :span="12">
                <el-form-item label="营销限制" style="margin-bottom: 0;">
                  <el-form-item style="display: inline-block; float:left;width: 20%;">
                    <el-switch :disabled="inputDisabled" v-model="limitSwitch" :inactive-value="0" :active-value="1" @input="changeLimitTimesAndTimeUnit"/>
                  </el-form-item>
                  <span v-if="!limitSwitch" style="line-height: 32px; color: #606266;">不限参与次数。（点击切换为限制次数）</span>
                  <el-form-item v-if="limitSwitch" prop="limitTimes" style="display: inline-block; float:left; width: 40%;height: 32px;">
                    <div style="padding-left: 4px;">
                      <el-input :disabled="inputDisabled" v-model="form.limitTimes" clearable>
                        <template slot="append">次</template>
                      </el-input>
                    </div>
                  </el-form-item>
                  <el-form-item v-if="limitSwitch" prop="limitTimeUnit" style="display: inline-block; float:left; width: 40%;height: 32px;">
                    <div style="padding-left: 4px;">
                      <el-select :popper-append-to-body="false" :disabled="inputDisabled" v-model="form.limitTimeUnit">
                        <el-option v-for="(limitOptItem, index) in limitOpts" :key="index" :value="limitOptItem.value" :label="limitOptItem.label"/>
                      </el-select>
                    </div>
                  </el-form-item>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
      </div>
    </el-collapse-transition>
    <div :class="[showMainInfo===true?'el-icon-arrow-up':'el-icon-arrow-down']" class="main-info-close" @click="showMainInfo=!showMainInfo"/>
  </div>
</template>
<script>

import { generateNodeItemMap, getNextChildNodeIds, checkJsplumbNodesExistSameEvent } from './util'
import { activityCreate, activityUpdate, activityInfo, getmarketingListParameter, submitMarketingActivity } from '@/api/markting/marketing'
import RtSameEvent from './rtSameEvent'
export default {
  name: 'ActivityMainInfo',
  inject: ['flowChartMap'],
  components: {
    RtSameEvent
  },
  data() {
    var marketingTimeStartEnd = [
      { required: true, message: '请选择时间', trigger: 'change' }
    ]

    if ((this.flowChartMap.actionType === 'edit' || this.flowChartMap.actionType === 'add')) {
      marketingTimeStartEnd.push({ message: '活动时间不能小于当前系统时间', validator: this.validateMarketingTimeStart, trigger: 'change' })
    }
    return {
      inputDisabled: !!(this.flowChartMap.actionType === 'view' || this.flowChartMap.actionType === 'audit'),
      showMainInfo: false,
      form: {
        marketingName: '',
        marketingPurpose: '',
        marketingTimeBegin: '',
        marketingTimeEnd: '',
        marketingType: this.$route.query.marketing_type,
        limitTimes: this.$route.query.marketing_type === 'diy' ? 1 : 9999,
        limitTimeUnit: 'activityRange',
        marketingTimeStartEnd: [],
        marketingTarget: this.$route.query.marketing_target,
        id: ''
      },
      // 活动复制标志
      marketingDefIdOrg: null,
      // 活动使用模版创建活动标志
      marketingTemplateDefId: null,

      limitSwitch: 0,
      marketingPurposes: [],
      rules: {
        marketingPurpose: [
          { required: true, message: '请选择营销目的', trigger: 'change' }
        ],
        marketingName: [
          { required: true, message: '请填写营销名称', trigger: 'change' },
          { message: '营销营销名称输入不符合规范', trigger: 'change', validator: this.vaidateMarketingNameValueHandler }
        ],
        marketingTimeStartEnd: marketingTimeStartEnd,
        limitTimes: [
          { required: true, message: '请填写次数', trigger: 'change' },
          { message: '不大于9999正整数', trigger: 'change', validator: this.validateLimitTimesHandler }
        ],
        limitTimeUnit: [
          { required: true, message: '请选择', trigger: 'change' }
        ]
      },
      actionDoing: false
    }
  },
  computed: {
    marketingPurposeDisabled() {
      if (this.inputDisabled || this.marketingTemplateDefId || this.marketingDefIdOrg) {
        return true
      }
      return false
    },
    limitOpts() {
      if (this.$route.query.marketing_type === 'event') {
        return [
          {
            label: '天',
            value: 'day'
          },
          {
            label: '周',
            value: 'week'
          },
          {
            label: '月',
            value: 'month'
          },
          {
            label: '活动期',
            value: 'activityRange'
          }
        ]
      } else if (this.$route.query.marketing_type === 'period') {
        return [
          {
            label: '活动期',
            value: 'activityRange'
          }
        ]
      } else {
        return []
      }
    }
  },
  mounted() {
    getmarketingListParameter().then((res) => {
      if (res.code === 1 && res.bizCode === 20000) {
        this.marketingPurposes = res.data.marketingPurpose
      }
    })
    if (this.$route.query.id) {
      activityInfo({ id: this.$route.query.id }).then((res) => {
        if ((res.code === '1' || res.code === 1) && res.bizCode === 20000) {
          if (res.data) {
            this.$emit('activityInfoDataLoaded', res.data)
            var data = res.data

            if (!data.marketingName) {
              this.showMainInfo = true
            } else {
              this.showMainInfo = false
            }

            this.form.id = data.id
            this.form.marketingPurpose = data.marketingPurpose
            this.form.marketingType = data.marketingType
            this.form.marketingName = data.marketingName
            this.form.marketingTimeBegin = data.marketingTimeBegin
            this.form.marketingTimeEnd = data.marketingTimeEnd
            this.form.limitTimes = data.limitTimes
            this.form.limitTimeUnit = data.limitTimeUnit
            this.form.marketingTarget = data.marketingTarget

            if (data.marketingTemplateDefId) {
              this.marketingTemplateDefId = data.marketingTemplateDefId
            }
            if (data.marketingDefIdOrg) {
              this.marketingDefIdOrg = data.marketingDefIdOrg
            }

            if (this.form.marketingTimeBegin || this.form.marketingTimeEnd) {
              this.form.marketingTimeStartEnd = [this.form.marketingTimeBegin || null, this.form.marketingTimeEnd || null]
            } else {
              this.form.marketingTimeStartEnd = []
            }

            if (this.form.limitTimes && (this.form.limitTimes < 9999)) {
              this.limitSwitch = 1
            } else {
              this.limitSwitch = 0
            }
          }
        }
      })
    } else {
      this.showMainInfo = true
    }
  },
  methods: {
    submitMarketingActivity() {
      if (this.form.marketingType === 'event' && this.form.limitTimes >= 2) {
        if (this.checkJsplumbNodesExistSameEvent()) {
          return
        }
      }

      this.$refs['form'].validate((valid) => {
        if (!valid) {
          this.showMainInfo = true
          return
        }

        var params
        // todo... 每个活动节点数据校验
        if (!this.validateFlowData()) return

        params = {
          id: this.$route.query.id || this.form.id,
          marketingPurpose: this.form.marketingPurpose,
          marketingName: this.form.marketingName,
          marketingContent: JSON.stringify(this.flowChartMap.flowData),
          marketingTimeBegin: this.form.marketingTimeBegin,
          marketingTimeEnd: this.form.marketingTimeEnd
        }

        submitMarketingActivity(params)
          .then(() => {
            this.$message({
              type: 'success',
              message: '营销活动提交成功，当前为待审核'
            })
            this.$router.push({ name: 'marketingList' })
          })
      })
    },
    saveActivityInfo(actionType) {
      if (this.form.marketingType === 'event' && this.form.limitTimes >= 2) {
        if (this.checkJsplumbNodesExistSameEvent()) {
          return
        }
      }

      if (this.actionDoing) {
        return
      }
      this.actionDoing = true
      // actionType save  saveAndSumbit
      this.$refs['form'].validate((valid) => {
        if (!valid) {
          this.showMainInfo = true
          this.actionDoing = false
          return
        }
        var params
        params = {
          marketingName: this.form.marketingName,
          marketingPurpose: this.form.marketingPurpose,
          marketingTimeBegin: this.form.marketingTimeBegin,
          marketingTimeEnd: this.form.marketingTimeEnd,
          marketingType: this.form.marketingType || this.$route.query.marketing_type,
          marketingTarget: this.form.marketingTarget,
          marketingIsValid: 'Y'
        }

        if (this.form.limitTimes) {
          params.limitTimes = this.form.limitTimes
        }

        if (this.form.limitTimeUnit) {
          params.limitTimeUnit = this.form.limitTimeUnit
        }
        console.log(this.flowChartMap,'flowChartMap')

        if (this.form.id || this.$route.query.id) {
          params.id = this.form.id || this.$route.query.id
          params.marketingContent = JSON.stringify(this.flowChartMap.flowData)

          activityUpdate(params).then(() => {
            this.$message({
              message: '保存成功',
              type: 'success'
            })
            this.showMainInfo = false
            this.actionDoing = false
          }, () => {
            this.actionDoing = false
          })
        } else {
          activityCreate(params).then((res) => {
            var data = {
              marketingName: this.form.marketingName,
              marketingPurpose: this.form.marketingPurpose,
              marketingTimeBegin: this.form.marketingTimeBegin,
              marketingTimeEnd: this.form.marketingTimeEnd,
              marketingType: this.form.marketingType || this.$route.query.marketing_type,
              limitTimes: this.form.limitTimes,
              limitTimeUnit: this.form.limitTimeUnit,
              id: res.data.id,
              marketingTarget: this.form.marketingTarget,
              marketingContent: JSON.stringify(this.flowChartMap.flowData)
            }
            this.form.id = res.data.id
            // 新增营销画布的时候，初始化画布节点。
            this.$emit('activityInfoDataLoaded', data)
            this.$message({
              message: '保存成功',
              type: 'success'
            })
            this.showMainInfo = false
            this.actionDoing = false
          }, () => {
            this.actionDoing = false
          })
        }
      })
    },
    checkJsplumbNodesExistSameEvent() {
      var eventExitObj = checkJsplumbNodesExistSameEvent(this.flowChartMap.flowData.nodeItems)
      if (eventExitObj.existSameEvent) {
        const h = this.$createElement
        // 给出提示
        this.$msgbox({
          title: '实时营销事件重复',
          customClass: 'event-repeat-tip',
          message: h('rt-same-event', { props: { eventMap: eventExitObj.eventMap }}),
          showClose: true,
          distinguishCancelAndClose: true,
          showCancelButton: false,
          confirmButtonText: '确定'
        })
        return true
      }
      return false
    },
    changeMarketingTimeHandler() {
      this.form.marketingTimeBegin = this.form.marketingTimeStartEnd[0]
      this.form.marketingTimeEnd = this.form.marketingTimeStartEnd[1]
    },
    sideDragValidate() {
      // 拷贝节点信息
      var flowData = this.flowChartMap.flowData
      var nodeItems = flowData.nodeItems

      if (nodeItems.length > 1) {
        for (var i = 0; i < nodeItems.length; i++) {
          if (!nodeItems[i].parentId && !nodeItems[i].headNode) {
            this.$message({
              type: 'error',
              message: '当前画布有未被使用的节点'
            })
            return false
          }
        }
      }

      return this.sideDragValidateNodeWrap(flowData)
    },
    sideDragValidateNodeWrap(marketingContent) {
      var that = this
      var nodeItems = marketingContent.nodeItems
      var linkItems = marketingContent.linkItems
      // 将list[节点对象, 节点对象] 转换成map {节点ID1:节点对象1, 节点ID2:节点对象2}

      var nodeItemMap = generateNodeItemMap(nodeItems)
      var validateOk = true

      function validateNode(nodeItem) {
        var nextChildNodeIds = getNextChildNodeIds(nodeItem, linkItems)
        var j
        var curNode
        var abTestLevel2NodeIds = []
        var metricNode

        if (nextChildNodeIds.length) {
          if (nodeItem.name === 'abTest') {
            if (that.validateNodeComponentData(nodeItem, nodeItemMap)) {
              for (j = 0; j < nextChildNodeIds.length; j++) {
                curNode = nodeItemMap[nextChildNodeIds[j]]
                if (!that.validateNodeComponentData(curNode, nodeItemMap)) {
                  validateOk = false
                  return false
                }
                // 如果是分支多动作，则将第二级动作节点id 保存下来，继续做abTest节点数据有效性校验
                if (nodeItem.nodeConf.branchMulNode === 'Y') {
                  abTestLevel2NodeIds = abTestLevel2NodeIds.concat(getNextChildNodeIds(curNode, linkItems))
                }
              }

              if (nodeItem.nodeConf.branchMulNode !== 'Y') {
                metricNode = nodeItemMap[getNextChildNodeIds(nodeItemMap[nextChildNodeIds[0]], linkItems)[0]]
                return validateNode(metricNode)
              } else {
                // 校验分支第二级动作节点
                for (var i = 0; i < abTestLevel2NodeIds.length; i++) {
                  if (!that.validateNodeComponentData(nodeItemMap[abTestLevel2NodeIds[i]], nodeItemMap)) {
                    validateOk = false
                    return false
                  }
                }
                metricNode = nodeItemMap[getNextChildNodeIds(nodeItemMap[abTestLevel2NodeIds[0]], linkItems)[0]]
                return validateNode(metricNode)
              }
            } else {
              validateOk = false
              return false
            }
          } else if (nodeItem.name === 'eventSelect') {
            if (that.validateNodeComponentData(nodeItem, nodeItemMap)) {
              if (nextChildNodeIds.length) {
                for (j = 0; j < nextChildNodeIds.length; j++) {
                  curNode = nodeItemMap[nextChildNodeIds[j]]
                  if (!validateNode(curNode)) {
                    return false
                  }
                }
              }

              return true
            } else {
              validateOk = false
              return false
            }
          } else if (nodeItem.name === 'eventJudge') {
            if (that.validateNodeComponentData(nodeItem, nodeItemMap)) {
              // 事件判断是否分支，必须有一个有内容
              if (that.validateEventJudgeWrap(nextChildNodeIds, nodeItemMap)) {
                for (j = 0; j < nextChildNodeIds.length; j++) {
                  curNode = nodeItemMap[nextChildNodeIds[j]]
                  if (curNode.component) {
                    if (!validateNode(curNode)) {
                      return false
                    }
                  }
                }
                return true
              } else {
                that.$message({
                  type: 'error',
                  message: '事件判断须至少有一个分支有内容'
                })
                validateOk = false
                return false
              }
            } else {
              validateOk = false
              return false
            }
          } else {
            if (that.validateNodeComponentData(nodeItem, nodeItemMap)) {
              if (nextChildNodeIds.length) {
                for (j = 0; j < nextChildNodeIds.length; j++) {
                  curNode = nodeItemMap[nextChildNodeIds[j]]
                  if (!validateNode(curNode)) {
                    return false
                  }
                }
              }
              return true
            } else {
              validateOk = false
              return false
            }
          }
        } else {
          if (!that.validateNodeComponentData(nodeItem, nodeItemMap)) {
            validateOk = false
            return false
          } else {
            return true
          }
        }
      }

      validateNode(nodeItems[0])

      return validateOk
    },
    validateFlowData() {
      // 拷贝节点信息
      var flowData = this.flowChartMap.flowData
      var nodeItems = flowData.nodeItems
      if (nodeItems.length > 1) {
        for (var i = 0; i < nodeItems.length; i++) {
          if (!nodeItems[i].parentId && !nodeItems[i].headNode) {
            this.$message({
              type: 'error',
              message: '当前画布有未被使用的节点'
            })
            return false
          }
        }
      }

      return this.validateNodeDataWrap(flowData)
    },
    validateNodeDataWrap(marketingContent) {
      var that = this
      var nodeItems = marketingContent.nodeItems
      var linkItems = marketingContent.linkItems
      // 将list[节点对象, 节点对象] 转换成map {节点ID1:节点对象1, 节点ID2:节点对象2}

      var nodeItemMap = generateNodeItemMap(nodeItems)
      var validateOk = true

      function validateNode(nodeItem) {
        var nextChildNodeIds = getNextChildNodeIds(nodeItem, linkItems)
        var j
        var curNode
        var abTestLevel2NodeIds = []
        var metricNode

        if (nextChildNodeIds.length) {
          if (nodeItem.name === 'abTest') {
            if (that.validateNodeComponentData(nodeItem, nodeItemMap)) {
              for (j = 0; j < nextChildNodeIds.length; j++) {
                curNode = nodeItemMap[nextChildNodeIds[j]]
                if (!that.validateNodeComponentData(curNode, nodeItemMap)) {
                  validateOk = false
                  return false
                }
                // 如果是分支多动作，则将第二级动作节点id 保存下来，继续做abTest节点数据有效性校验
                if (nodeItem.nodeConf.branchMulNode === 'Y') {
                  abTestLevel2NodeIds = abTestLevel2NodeIds.concat(getNextChildNodeIds(curNode, linkItems))
                }
              }

              if (nodeItem.nodeConf.branchMulNode !== 'Y') {
                metricNode = nodeItemMap[getNextChildNodeIds(nodeItemMap[nextChildNodeIds[0]], linkItems)[0]]
                if (curNode.component === 'coupon') {
                  metricNode.nodeConf = {
                    couponVerificateWeight: '100',
                    linkClickWeight: ''
                  }
                } else {
                  metricNode.nodeConf = {
                    couponVerificateWeight: '',
                    linkClickWeight: '100'
                  }
                }
                return validateNode(metricNode)
              } else {
                // 校验分支第二级动作节点
                for (var i = 0; i < abTestLevel2NodeIds.length; i++) {
                  if (!that.validateNodeComponentData(nodeItemMap[abTestLevel2NodeIds[i]], nodeItemMap)) {
                    validateOk = false
                    return false
                  }
                }
                metricNode = nodeItemMap[getNextChildNodeIds(nodeItemMap[abTestLevel2NodeIds[0]], linkItems)[0]]
                return validateNode(metricNode)
              }
            } else {
              validateOk = false
              return false
            }
          } else if (nodeItem.name === 'eventSelect') {
            if (that.validateNodeComponentData(nodeItem, nodeItemMap)) {
              if (nextChildNodeIds.length) {
                for (j = 0; j < nextChildNodeIds.length; j++) {
                  curNode = nodeItemMap[nextChildNodeIds[j]]
                  if (!validateNode(curNode)) {
                    return false
                  }
                }
              }

              return true
            } else {
              validateOk = false
              return false
            }
          } else if (nodeItem.name === 'eventJudge') {
            if (that.validateNodeComponentData(nodeItem, nodeItemMap)) {
              // 事件判断是否分支，必须有一个有内容
              if (that.validateEventJudgeWrap(nextChildNodeIds, nodeItemMap)) {
                for (j = 0; j < nextChildNodeIds.length; j++) {
                  curNode = nodeItemMap[nextChildNodeIds[j]]
                  if (curNode.component) {
                    if (!validateNode(curNode)) {
                      return false
                    }
                  }
                }
                return true
              } else {
                that.$message({
                  type: 'error',
                  message: '事件判断须至少有一个分支有内容'
                })
                validateOk = false
                return false
              }
            } else {
              validateOk = false
              return false
            }
          } else {
            if (that.validateNodeComponentData(nodeItem, nodeItemMap)) {
              if (nextChildNodeIds.length) {
                for (j = 0; j < nextChildNodeIds.length; j++) {
                  curNode = nodeItemMap[nextChildNodeIds[j]]
                  if (!validateNode(curNode)) {
                    return false
                  }
                }
              }
              return true
            } else {
              validateOk = false
              return false
            }
          }
        } else {
          if (!that.validateNodeComponentData(nodeItem, nodeItemMap)) {
            validateOk = false
            return false
          } else {
            // ... 检验结束节点的合法性，如只能以动作结束
            if (['coupon', 'crossCoupon', 'wxNews', 'appPush', 'phoneSms', 'wxTemplateMsg', 'metric'].indexOf(nodeItem.component) > -1) {
              return true
            } else {
              that.$message({
                type: 'error',
                message: '营销活动必须以优惠券、异业券、模版消息、短信、图文素材、APP PUSH、AB测试指标节点结束'
              })
              validateOk = false
              return false
            }
          }
        }
      }

      validateNode(nodeItems[0])
      return validateOk
    },
    empytNodeTip(nodeItem, nodeItemMap) {
      var parentNode = nodeItemMap[nodeItem.parentId]
      if (parentNode.component === 'eventSelect') {
        this.$message({
          type: 'error',
          message: '事件选择组件的分支内容未填写'
        })
      } else if (parentNode.component === 'abTest' || (nodeItemMap[parentNode.parentId] && nodeItemMap[parentNode.parentId].component === 'abTest')) {
        this.$message({
          type: 'error',
          message: 'AB测试组件的分支内容未填写'
        })
      }
    },
    validateNodeComponentData(nodeItem, nodeItemMap) {
      if (!nodeItem.component) {
        this.empytNodeTip(nodeItem, nodeItemMap)
        return
      }
      if (nodeItem.component === 'coupon') {
        if (!nodeItem.nodeConf.node_desc) {
          this.$message({
            type: 'error',
            message: '优惠券未填写内容'
          })
          return false
        } else if (!nodeItem.nodeConf.couponRuleCode) {
          this.$message({
            type: 'error',
            message: '优惠券组件未选择优惠券'
          })
          return false
        }
      } else if (nodeItem.component === 'crossCoupon') {
        if (!nodeItem.nodeConf.node_desc) {
          this.$message({
            type: 'error',
            message: '异业券未填写内容'
          })
          return false
        } else if (!nodeItem.nodeConf.ticketRuleCode) {
          this.$message({
            type: 'error',
            message: '异业券组件未选择异业券'
          })
          return false
        }
      } else if (nodeItem.component === 'wxNews') {
        if (!nodeItem.nodeConf.node_desc) {
          this.$message({
            type: 'error',
            message: '图文素材未填写内容'
          })
          return false
        } else if (!nodeItem.nodeConf.node_data || !nodeItem.nodeConf.node_data.data || !nodeItem.nodeConf.node_data.data.materialId) {
          this.$message({
            type: 'error',
            message: '图文素材组件未选择图文'
          })
          return false
        }
      } else if (nodeItem.component === 'appPush') {
        if (!nodeItem.nodeConf.node_desc) {
          this.$message({
            type: 'error',
            message: 'APP PUSH未填写内容'
          })
          return false
        }
        if (!nodeItem.nodeConf.node_data || !nodeItem.nodeConf.node_data.sendTemplateId) {
          this.$message({
            type: 'error',
            message: 'APP PUSH内容填写不完整'
          })
          return false
        }
      } else if (nodeItem.component === 'wxTemplateMsg') {
        if (!nodeItem.nodeConf.node_desc) {
          this.$message({
            type: 'error',
            message: '微信模版消息未填写内容'
          })
          return false
        }
        if (!nodeItem.nodeConf.node_data || !nodeItem.nodeConf.node_data.sendTemplateId) {
          this.$message({
            type: 'error',
            message: '微信模版消息内容填写不完整'
          })
          return false
        }
      } else if (nodeItem.component === 'phoneSms') {
        if (!nodeItem.nodeConf.node_desc) {
          this.$message({
            type: 'error',
            message: '短信未填写内容'
          })
          return false
        }
        if (!nodeItem.nodeConf.node_data || !nodeItem.nodeConf.node_data.sendTemplateId) {
          this.$message({
            type: 'error',
            message: '短信内容缺失'
          })
          return false
        }
      } else if (nodeItem.component === 'peopleFilter') {
        if (!nodeItem.nodeConf.node_desc) {
          this.$message({
            type: 'error',
            message: '人群选择未填写活动流程'
          })
          return false
        }
        if (!nodeItem.nodeConf.filterRule || !nodeItem.nodeConf.filterRule.join || !nodeItem.nodeConf.filterRule.join.data.length) {
          this.$message({
            type: 'error',
            message: '人群选择未填写内容'
          })
          return false
        }
      } else if (nodeItem.component === 'eventSelect') {
        if (!nodeItem.nodeConf.node_desc) {
          this.$message({
            type: 'error',
            message: '事件选择未填写内容'
          })
          return false
        }
      } else if (nodeItem.component === 'abTest') {
        if (!nodeItem.nodeConf.node_desc) {
          this.$message({
            type: 'error',
            message: 'AB测试未填写内容'
          })
          return false
        }

        var percentSum = 0
        for (var i = 0; i < nodeItem.nodeConf.actions_ABtest.length; i++) {
          percentSum += Number(nodeItem.nodeConf.actions_ABtest[i].percent)
        }
        if (percentSum !== 100) {
          this.$message({
            type: 'error',
            message: 'AB测试未填写内容'
          })
          return false
        }
      } else if (nodeItem.component === 'eventJudge') {
        if (!nodeItem.nodeConf.node_desc) {
          this.$message({
            type: 'error',
            message: '事件判断未填写内容'
          })
          return false
        }
        if (!nodeItem.nodeConf.wait_minute && !nodeItem.nodeConf.wait_hour && !nodeItem.nodeConf.wait_days) {
          this.$message({
            type: 'error',
            message: '事件判断内容填写不完整'
          })
          return false
        }
      } else if (nodeItem.component === 'timePicker') {
        if (!nodeItem.nodeConf.node_desc) {
          this.$message({
            type: 'error',
            message: '时间选择未填写内容'
          })
          return false
        }
        if (!nodeItem.nodeConf.run_time) {
          this.$message({
            type: 'error',
            message: '时间选择内容填写不完整'
          })
          return false
        }
      } else if (nodeItem.component === 'delayTime') {
        if (!nodeItem.nodeConf.node_desc) {
          this.$message({
            type: 'error',
            message: '等待时间未填写内容'
          })
          return false
        }
        if (!nodeItem.nodeConf.wait_hour && !nodeItem.nodeConf.wait_minute) {
          this.$message({
            type: 'error',
            message: '等待时间内容填写不完整'
          })
          return false
        }
      } else if (nodeItem.component === 'metric') {
        if ((Number(nodeItem.nodeConf.couponVerificateWeight) + Number(nodeItem.nodeConf.linkClickWeight)) !== 100) {
          this.$message({
            type: 'error',
            message: '指标组件未填写内容'
          })
          return false
        }
      }
      return true
    },
    validateEventJudgeWrap(nextChildNodeIds, nodeItemMap) {
      var matched = false
      for (var i = 0; i < nextChildNodeIds.length; i++) {
        var curNode = nodeItemMap[nextChildNodeIds[i]]
        if (curNode.component) {
          matched = true
        }
      }

      return matched
    },
    changeLimitTimesAndTimeUnit() {
      if (this.limitSwitch === 1) {
        // 营销限制开启
        this.form.limitTimes = this.form.limitTimes || 1
        this.form.limitTimeUnit = this.form.limitTimeUnit || 'activityRange'
      } else {
        // 营销不限制
        this.form.limitTimes = 9999
        this.form.limitTimeUnit = 'activityRange'
      }
    },
    vaidateMarketingNameValueHandler(rule, value, cb) {
      var count = 0;
      (value || '').replace(/[\u4E00-\u9FFF]+/g, function() {
        count += arguments[0].length
      })
      count += value.length

      if (count > 200) {
        cb(new Error(rule.message))
        return
      }

      cb()
    },
    validateLimitTimesHandler(rule, value, cb) {
      if (/^[1-9]\d{0,3}$/.test(value)) {
        cb()
      } else {
        cb(new Error(rule.message))
      }
    },
    disabledDate(date) {
      if ((new Date(date).Format('yyyy-MM-dd HH:mm:ss') > new Date().Format('yyyy-MM-dd'))) {
        return false
      } else {
        return true
      }
    },
    validateMarketingTimeStart(rule, value, cb) {
      if (value && value.length) {
        if (value[0] > new Date().Format('yyyy-MM-dd hh:mm:ss')) {
          cb()
          return
        }
      }
      cb(new Error(rule.message))
    }
  }
}
</script>
<style>
.main-info-wrap {
  position: relative
}
.main-info-close {
  position: absolute;
  width: 50px;
  height: 30px;
  left: 50%;
  transform: translateX(-50%);
  top: 0;
  z-index: 2;
  border-left: 1px solid #EBEEF5;
  border-right: 1px solid #EBEEF5;
  border-bottom: 1px solid #EBEEF5;
  border-radius: 0 0 4px 4px;
  text-align: center;
  line-height: 30px;
}
</style>
