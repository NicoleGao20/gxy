<template>
  <div>
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
      <belle-app-push ref="belleAppPush" :be-data="nodeConf.node_data"/>
    </el-form>
  </div>
</template>
<script>
import belleAppPush from '@/privatemodules/belle-app-push'
import { getToken } from '@/utils/auth'
import { getPreviousEventNodesInfo, getGroupIds } from '../util'

export default {
  name: 'AppPush',
  components: {
    belleAppPush
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
    var onlyRead
    if (this.actionType === 'edit' || this.actionType === 'add') {
      onlyRead = false
    } else {
      onlyRead = true
    }
    var allIds = getPreviousEventNodesInfo(this.curComConfig, this.flowChartMap.flowData.nodeItems).main_idtype_group
    allIds.push(this.flowChartMap.activityInfo.marketingTarget)
    var main_idtype_group = getGroupIds(this.flowChartMap.sceneIdCategoryMap, allIds)

    var node_data
    if (this.curComConfig.nodeConf.node_data && this.curComConfig.nodeConf.node_data.sendTemplateId) {
      node_data = JSON.parse(JSON.stringify(this.curComConfig.nodeConf.node_data))
      node_data.readOnly = onlyRead
      node_data.groupId = main_idtype_group
    } else {
      node_data = {
        sendTemplateId: '',
        brandCode: getToken('brandCode'),
        sceneId: this.flowChartMap.sceneIdMap['appPush'],
        groupId: main_idtype_group,
        readOnly: false,
        parameter: [], // 插入参数列表数据
        afterOpen: '', // 后续动作
        afterOpenValue: '', // 后续动作URL值
        title: '', // 标题
        textarea: '', // 输入的内容
        templateParamList: [] // 参数列表
      }
    }

    return {
      onlyRead: onlyRead,
      nodeConf: {
        node_desc: this.curComConfig.nodeConf.node_desc || '',
        node_data: node_data
      }
    }
  },
  methods: {
    confirmHandler(cb) {
      this.$refs['form'].validate((valid) => {
        if (!valid) {
          cb(false)
          return
        }
        if (!this.$refs['belleAppPush'].onExamine()) {
          cb(false)
          return
        }

        this.nodeConf.node_data.templateParamList.forEach((item) => {
          item.paramId = item.id
          item.sendTemplateId = this.nodeConf.node_data.sendTemplateId || ''
          delete item.id
        })

        var params = {
          sendTemplateId: '' || this.nodeConf.node_data.sendTemplateId,
          brandCode: this.nodeConf.node_data.brandCode,
          sceneId: this.nodeConf.node_data.sceneId,
          templateId: '-1',
          templateType: 4,
          messageType: 2,
          templateParamList: this.nodeConf.node_data.templateParamList,
          templateContent: this.nodeConf.node_data.textarea || null,
          displayType: this.nodeConf.node_data.displayType || 0,
          displayStyle: this.nodeConf.node_data.displayStyle || 0,
          displayStyleValue: this.nodeConf.node_data.displayStyleValue || 0,
          androidNoticeType: this.nodeConf.node_data.androidNoticeType || 0,
          noticeShake: this.nodeConf.node_data.noticeShake || 0,
          noticeBreathLight: this.nodeConf.node_data.noticeBreathLight || 0,
          iosNoticeType: this.nodeConf.node_data.iosNoticeType || 0,
          limitSpeed: this.nodeConf.node_data.limitSpeed || -1,
          afterOpen: this.nodeConf.node_data.afterOpen,
          afterOpenValue: this.nodeConf.node_data.afterOpenValue,
          iconType: this.nodeConf.node_data.iconType,
          iconTypeValue: this.nodeConf.node_data.iconTypeValue,
          expandImgUrl: this.nodeConf.node_data.expandImgUrl,
          pushName: this.nodeConf.node_data.pushName || null,
          templateTitle: this.nodeConf.node_data.title || null
        }

        this.$request({
          url: '/component/system/editMarketTemplateConfig',
          method: 'post',
          data: { data: params }
        }).then((res) => {
          this.nodeConf.node_data.sendTemplateId = res.data
          this.curComConfig.nodeConf = this.nodeConf

          if (res.data) {
            cb(true)
          } else {
            cb(false)
          }
        })
      })
    }
  }
}
</script>
