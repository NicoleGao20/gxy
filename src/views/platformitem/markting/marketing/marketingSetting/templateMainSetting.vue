<template>
  <div class="main-info-wrap">
    <el-collapse-transition>
      <div v-show="showMainInfo">
        <div class="actvity-main-setting" style="padding-top: 15px; border: 1px solid #EBEEF5; background: #fff">
          <div style="padding: 5px 0 15px 20px;">
            <div class="label-title">
              <i class="linev-tip"/><span class="label-desc">模版主体信息</span>
            </div>
          </div>
          <el-form ref="form" :model="form" :rules="rules" label-position="right" label-width="100px" style="padding: 0 20px;">
            <el-row :gutter="60">
              <el-col :span="12">
                <el-form-item label="营销目的" prop="marketingPurpose">
                  <el-select :disabled="inputDisabled" v-model="form.marketingPurpose" placeholder="请选择营销目的" style="width: 100%;">
                    <el-option v-for="(activityPurposeItem, index) in marketingPurposes" :key="index" :label="activityPurposeItem.name" :value="activityPurposeItem.value"/>
                  </el-select>
                </el-form-item>
                <el-form-item label="模版名称" prop="templateName">
                  <el-input :disabled="inputDisabled" v-model="form.templateName" placeholder="请填写模版名称"/>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="模版说明" prop="remark">
                  <el-input
                    v-model="form.remark"
                    :disabled="inputDisabled"
                    :rows="3"
                    type="textarea"
                    placeholder="请填写模版说明"/>
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
// 从模版复制活动
import processMarketingContent from '../processMarketingContent'

import { activityTemplateCreate, activityTemplateUpdate, activityTemplateInfo, getmarketingListParameter, createActivityByTemplate } from '@/api/markting/marketing'
export default {
  name: 'TemplateMainSetting',
  mixins: [processMarketingContent],
  inject: ['flowChartMap'],
  data() {
    return {
      inputDisabled: !!(this.flowChartMap.actionType === 'view' || this.flowChartMap.actionType === 'audit'),
      showMainInfo: false,
      form: {
        templateName: '',
        marketingPurpose: '',
        marketingType: this.$route.query.marketing_type,
        marketingTarget: this.$route.query.marketing_target,
        remark: '',
        id: ''
      },
      marketingPurposes: [],
      limitOpts: [
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
      ],
      rules: {
        marketingPurpose: [
          { required: true, message: '请选择营销目的', trigger: 'change' }
        ],
        templateName: [
          { required: true, message: '请填写模版名称', trigger: 'change' }
        ],
        remark: [
          { required: true, message: '请填写模版说明', trigger: 'change' }
        ]
      },
      actionDoing: false
    }
  },
  mounted() {
    getmarketingListParameter().then((res) => {
      if (res.code === 1 && res.bizCode === 20000) {
        this.marketingPurposes = res.data.marketingPurpose
      }
    })
    if (this.$route.query.id) {
      activityTemplateInfo({ id: this.$route.query.id }).then((res) => {
        if ((res.code === '1' || res.code === 1) && res.bizCode === 20000) {
          this.showMainInfo = false
          this.$emit('activityInfoDataLoaded', res.data)
          var data = res.data
          this.form.id = data.id
          this.form.marketingPurpose = data.marketingPurpose
          this.form.templateName = data.templateName
          this.form.remark = data.remark
          this.form.marketingTarget = data.marketingTarget
          this.form.marketingType = data.marketingType
          this.form.marketingContent = data.marketingContent
        }
      })
    } else {
      this.showMainInfo = true
    }
  },
  methods: {
    saveActivityInfo() {
      if (this.actionDoing) return
      this.actionDoing = true
      this.$refs['form'].validate((valid) => {
        if (!valid) {
          this.showMainInfo = true
          this.actionDoing = false
          return
        }

        var params = {
          templateName: this.form.templateName,
          marketingPurpose: this.form.marketingPurpose,
          marketingTarget: this.form.marketingTarget,
          marketingType: this.form.marketingType,
          remark: this.form.remark
        }

        if (this.form.id || this.$route.query.id) {
          params.id = this.form.id || this.$route.query.id
          params.templateIsValid = 'N'
          params.marketingContent = JSON.stringify(this.flowChartMap.flowData)

          activityTemplateUpdate(params).then(() => {
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
          params.marketingContent = JSON.stringify(this.flowChartMap.flowData)
          activityTemplateCreate(params).then((res) => {
            var data = {
              templateName: this.form.templateName,
              marketingPurpose: this.form.marketingPurpose,
              marketingType: this.form.marketingType,
              remark: this.form.remark,
              marketingTarget: this.form.marketingTarget,
              id: res.data.id,
              marketingContent: JSON.parse(params.marketingContent)
            }
            this.form.id = res.data.id

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
    createActivityByTemplate() {
      if (this.actionDoing) return
      this.actionDoing = true

      var marketingContentStr = this.processMarketingContent(JSON.parse(this.form.marketingContent))
      createActivityByTemplate({ id: this.form.id, marketingIsValid: 'N', marketingContent: marketingContentStr })
        .then((res) => {
          this.actionDoing = false
          if (res.code === 1 && res.bizCode === 20000) {
            this.$router.push({
              name: 'marketingSetting',
              query: {
                id: res.data.id,
                marketing_type: this.form.marketingType,
                marketing_target: this.form.marketingTarget,
                create_type: 'activity',
                action_type: 'edit'
              }
            })
          } else {
            this.$message({
              type: 'error',
              message: '创建失败'
            })
          }
        })
        .catch(() => {
          this.actionDoing = false
        })
    },
    checkAndSaveTemplateInfo() {
      this.$refs['form'].validate((valid) => {
        if (!valid) {
          this.showMainInfo = true
          return
        }
        if (!this.validateFlowData()) return

        var params = {
          templateName: this.form.templateName,
          marketingPurpose: this.form.marketingPurpose,
          marketingTarget: this.form.marketingTarget,
          marketingType: this.form.marketingType,
          remark: this.form.remark
        }

        if (this.form.id || this.$route.query.id) {
          params.id = this.form.id || this.$route.query.id
          params.templateIsValid = 'Y'
          params.marketingContent = JSON.stringify(this.flowChartMap.flowData)

          activityTemplateUpdate(params).then(() => {
            this.showMainInfo = false
            this.$message({
              message: '模版启用成功',
              type: 'success'
            })
            this.$router.push({ name: 'marketingModule' })
          })
        }
      })
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

      var nodeItemMap = this.generateNodeItemMap(nodeItems)
      var validateOk = true

      function validateNode(nodeItem) {
        var nextChildNodeIds = that.getNextChildNodeIds(nodeItem, linkItems)
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
                  abTestLevel2NodeIds = abTestLevel2NodeIds.concat(that.getNextChildNodeIds(curNode, linkItems))
                }
              }

              if (nodeItem.nodeConf.branchMulNode !== 'Y') {
                metricNode = nodeItemMap[that.getNextChildNodeIds(nodeItemMap[nextChildNodeIds[0]], linkItems)[0]]

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
                metricNode = nodeItemMap[that.getNextChildNodeIds(nodeItemMap[abTestLevel2NodeIds[0]], linkItems)[0]]
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

      for (var i = 0; i < nodeItems.length; i++) {
        if (!nodeItems[i].parentId && !nodeItems[i].headNode) {
          this.$message({
            type: 'error',
            message: '当前画布有未被使用的节点'
          })
          return false
        }
      }

      return this.validateNodeDataWrap(flowData)
    },
    validateNodeDataWrap(marketingContent) {
      var that = this
      var nodeItems = marketingContent.nodeItems
      var linkItems = marketingContent.linkItems
      // 将list[节点对象, 节点对象] 转换成map {节点ID1:节点对象1, 节点ID2:节点对象2}

      var nodeItemMap = this.generateNodeItemMap(nodeItems)
      var validateOk = true

      function validateNode(nodeItem) {
        var nextChildNodeIds = that.getNextChildNodeIds(nodeItem, linkItems)
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
                  abTestLevel2NodeIds = abTestLevel2NodeIds.concat(that.getNextChildNodeIds(curNode, linkItems))
                }
              }

              if (nodeItem.nodeConf.branchMulNode !== 'Y') {
                metricNode = nodeItemMap[that.getNextChildNodeIds(nodeItemMap[nextChildNodeIds[0]], linkItems)[0]]
                return validateNode(metricNode)
              } else {
                // 校验分支第二级动作节点
                for (var i = 0; i < abTestLevel2NodeIds.length; i++) {
                  if (!that.validateNodeComponentData(nodeItemMap[abTestLevel2NodeIds[i]], nodeItemMap)) {
                    validateOk = false
                    return false
                  }
                }
                metricNode = nodeItemMap[that.getNextChildNodeIds(nodeItemMap[abTestLevel2NodeIds[0]], linkItems)[0]]
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
    getNextChildNodeIds(nodeItem, linkItems) {
      var nextChildNodeIds = []
      for (var i = 0; i < linkItems.length; i++) {
        if (linkItems[i].sourceId === nodeItem.id) {
          nextChildNodeIds.push(linkItems[i].targetId)
        }
      }

      return nextChildNodeIds
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
            message: '优惠券未填写流程说明'
          })
          return false
        }
      } else if (nodeItem.component === 'crossCoupon') {
        if (!nodeItem.nodeConf.node_desc) {
          this.$message({
            type: 'error',
            message: '异业券未填写流程说明'
          })
          return false
        }
      } else if (nodeItem.component === 'wxNews') {
        if (!nodeItem.nodeConf.node_desc) {
          this.$message({
            type: 'error',
            message: '图文素材未填写流程说明'
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
      } else if (nodeItem.component === 'wxTemplateMsg') {
        if (!nodeItem.nodeConf.node_desc) {
          this.$message({
            type: 'error',
            message: '微信模版消息未填写内容'
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
      } else if (nodeItem.component === 'eventJudge') {
        if (!nodeItem.nodeConf.node_desc) {
          this.$message({
            type: 'error',
            message: '事件判断未填写内容'
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
      } else if (nodeItem.component === 'delayTime') {
        if (!nodeItem.nodeConf.node_desc) {
          this.$message({
            type: 'error',
            message: '等待时间未填写内容'
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
    generateNodeItemMap(nodeItems) {
      var nodeItemMap = {}

      for (var i = 0; i < nodeItems.length; i++) {
        nodeItemMap[nodeItems[i].id] = nodeItems[i]
      }
      return nodeItemMap
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
