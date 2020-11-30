<template>
  <div>
    <el-form ref="form" :model="nodeConf" label-position="right" label-width="160px" @submit.native.prevent>
      <el-form-item
        :rules="{
          message: '请填写流程简要说明', trigger: 'change', required: true
        }"
        label="流程说明："
        prop="node_desc">
        <el-input v-model="nodeConf.node_desc" :disabled="onlyRead" placeholder="流程说明"/>
      </el-form-item>
      <div class="hor-line"/>
    </el-form>
    <template-message-pro ref="wechatTemplateMessage" :config-params="configParams" :is-new="actionType === 'add'" :only-read="onlyRead"/>
  </div>
</template>
<script>
import TemplateMessagePro from '@/publicComponents/TemplateMessagePro'
import { getToken } from '@/utils/auth'
import { getPreviousEventNodesInfo, getGroupIds } from '../util'

export default {
  name: 'WxTemplateMsg',
  components: { TemplateMessagePro },
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
    var node_data

    var allIds = getPreviousEventNodesInfo(this.curComConfig, this.flowChartMap.flowData.nodeItems).main_idtype_group
    allIds.push(this.flowChartMap.activityInfo.marketingTarget)
    var main_idtype_group = getGroupIds(this.flowChartMap.sceneIdCategoryMap, allIds)

    if (this.curComConfig.nodeConf.node_data && this.curComConfig.nodeConf.node_data.sendTemplateId) {
      node_data = this.curComConfig.nodeConf.node_data
    }

    return {
      nodeConf: {
        node_desc: this.curComConfig.nodeConf.node_desc || '',
        node_data: node_data || {}
      },
      configParams: {
        brandCode: getToken('brandCode'),
        groupId: main_idtype_group,
        sceneId: this.flowChartMap.sceneIdMap['wxTemplateMsg']
      },
      actionDoing: false
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
    if (this.curComConfig.nodeConf.node_data) {
      const node_data = JSON.parse(JSON.stringify(this.curComConfig.nodeConf.node_data))
      if (node_data) {
        this.$refs['wechatTemplateMessage'].setData(node_data)
      }
    }
  },
  methods: {
    getFormPromise(form) {
      return new Promise(resolve => {
        form.validate(res => {
          resolve(res)
        })
      })
    },
    confirmHandler(cb) {
      if (this.actionDoing) return
      Promise.all([this.$refs['wechatTemplateMessage'].validateForm(), this.getFormPromise(this.$refs['form'])]).then(res => {
        if (res.every(x => !!x)) {
          console.log('-------------- validate form -------------------')
          const node_data = this.$refs['wechatTemplateMessage'].getData()

          var i
          var tempObj
          var params = {
            sendTemplateId: '' || this.nodeConf.node_data.sendTemplateId,
            brandCode: this.configParams.brandCode,
            sceneId: this.configParams.sceneId,
            templateId: node_data.wechatTemplateId,
            messageType: 2,
            templateParamList: [],
            templateFieldList: []
          }

          if (node_data.paramList) {
            for (i = 0; i < node_data.paramList.length; i++) {
              tempObj = {}
              tempObj.paramKey = node_data.paramList[i].paramKey
              tempObj.paramValue = node_data.paramList[i].paramValue
              tempObj.sendTemplateId = params.sendTemplateId
              tempObj.paramId = node_data.paramList[i].paramId

              params.templateParamList.push(tempObj)
            }
          }

          // "templateType": 1,    //模版类型  1-公众号 2-小程序 3-短信 4-app推送
          params.templateType = 1
          params.outsideLinkType = node_data.linkType
          if (node_data.linkType === 4) {
            params.outsidePageUrl = node_data.url
            params.miniProgramAppId = ''
            params.miniProgramPagePath = ''
          } else if (node_data.linkType === 1) {
            // 小程序
            params.outsidePageUrl = node_data.url
            params.miniProgramAppId = node_data.miniProgramAppId
            params.miniProgramPagePath = node_data.miniProgramPagePath
          }

          if (node_data.templateEditBeanList) {
            for (i = 0; i < node_data.templateEditBeanList.length; i++) {
              tempObj = {}
              tempObj.sendTemplateId = params.sendTemplateId
              tempObj.fieldKey = node_data.templateEditBeanList[i].valueParamKey
              tempObj.fieldValue = node_data.templateEditBeanList[i].valueParamValue
              params.templateFieldList.push(tempObj)

              if (node_data.templateEditBeanList[i].labelParamKey) {
                tempObj = {}
                tempObj.sendTemplateId = params.sendTemplateId
                tempObj.fieldKey = node_data.templateEditBeanList[i].labelParamKey
                tempObj.fieldValue = node_data.templateEditBeanList[i].labelParamValue
                params.templateFieldList.push(tempObj)
              }
            }
          }
          console.log('---------------submit params ------------------------------', params)
          // this.actionDoing = true

          //   this.$request({
          //     url: '/component/system/editMarketTemplateConfig',
          //     method: 'post',
          //     data: { data: params }
          //   }).then((res) => {
          //     this.actionDoing = false
          //     node_data.sendTemplateId = res.data
          //     this.nodeConf.node_data = node_data
          //     this.curComConfig.nodeConf = this.nodeConf
          //     if (res.data) {
          //       cb(true)
          //     } else {
          //       cb(false)
          //     }
          //   }).catch(() => {
          //     this.actionDoing = false
          //   })
          // } else {
          //   cb(false)
        }
      })
    }
  }
}
</script>
