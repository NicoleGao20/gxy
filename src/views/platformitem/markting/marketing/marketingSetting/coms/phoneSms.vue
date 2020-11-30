<template>
  <div>
    <el-form ref="form" :model="nodeConf" :rules="rules" label-position="right" label-width="95px" @submit.native.prevent>
      <el-form-item
        label="节点描述"
        >
        <el-input v-model="nodeConf.node_desc" :disabled="onlyRead" placeholder="流程说明"/>
      </el-form-item>
      <div class="hor-line"/>
      <!-- <belle-sending-sms
        ref="belleSms"
        :be-data="beData"
      /> -->
      <sendingSms
        ref="belleSms"
        :be-data="beData"
      />
      <el-form-item
        :rules="{
          trigger: 'change', required: true
        }"
        style="margin: 20px 0 0 0;"
        label="短信过滤:"
      >
        屏蔽
        <el-form-item prop="filterDayCnt" style="display: inline-block;width: 100px;margin: 0 4px;">
          <el-select v-model="nodeConf.filterDayCnt" :disabled="onlyRead" :popper-append-to-body="false">
            <el-option v-for="item in 30" :key="item" :label="item" :value="item"/>
          </el-select>
        </el-form-item>
        天内发送过
        <el-form-item prop="filterLimitTimes" style="display: inline-block;width: 100px;margin: 0 4px;">
          <el-input v-model="nodeConf.filterLimitTimes" :disabled="onlyRead"/>
        </el-form-item>
        次营销短信的号码
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
// import sendingSms from '@/privatemodules/belle-sending-sms'
import sendingSms from '@/publicComponents/sendingSms'
import { getToken } from '@/utils/auth'
import { getPreviousEventNodesInfo, getGroupIds } from '../util'

export default {
  name: 'PhoneSms',
  components: {
    sendingSms
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
    var sendTemplateId

    var allIds = getPreviousEventNodesInfo(this.curComConfig, this.flowChartMap.flowData.nodeItems).main_idtype_group
    allIds.push(this.flowChartMap.activityInfo.marketingTarget)
    var main_idtype_group = getGroupIds(this.flowChartMap.sceneIdCategoryMap, allIds)

    if (this.curComConfig.nodeConf.node_data && this.curComConfig.nodeConf.node_data.sendTemplateId) {
      sendTemplateId = this.curComConfig.nodeConf.node_data.sendTemplateId
    }
    var node_data = this.curComConfig.nodeConf.node_data

    return {
      sendTemplateId: sendTemplateId || '',
      rules: {
        node_desc: [
          {
            message: '请填写流程简要说明', trigger: 'change', required: true
          }
        ],
        filterDayCnt: [
          {
            required: true, message: '请选择屏蔽天数', trigger: 'change'
          }
        ],
        filterLimitTimes: [
          {
            trigger: 'change', validator: this.vaidateValueHandler
          }
        ]
      },
      beData: {
        signCode: node_data && node_data.brandCode ? node_data.brandCode : '', // 短信签名的key
        smsSign: node_data && node_data.smsSign ? node_data.smsSign : '', // 短信签名
        sceneId: this.flowChartMap.sceneIdMap['phoneSms'], // 场景id
        groupId: main_idtype_group,
        brandCode: getToken('brandCode'),
        zIndex: 100,
        readOnly: this.actionType !== 'edit' && this.actionType !== 'add', // 是否只读
        textarea: node_data && node_data.textarea ? node_data.textarea : '', // 输入的内容
        templateParamList: node_data && node_data.templateParamList ? node_data.templateParamList : [], // 参数列表
        useUrlList: node_data && node_data.useUrlList ? node_data.useUrlList : [], // 使用短信链接参数列表
        context: node_data && node_data.contextText ? node_data.contextText : '' // 最终传给后台得短信内容
      },
      nodeConf: {
        filterLimitTimes: (this.curComConfig.nodeConf.node_data && this.curComConfig.nodeConf.node_data.filterLimitTimes) || 1,
        filterDayCnt: (this.curComConfig.nodeConf.node_data && this.curComConfig.nodeConf.node_data.filterDayCnt) || 7,
        node_desc: this.curComConfig.nodeConf.node_desc || '',
        node_data: this.curComConfig.nodeConf.node_data || {}
      },
      actionDoing: false
    }
  },
  computed: {
    onlyRead() {
      return this.actionType !== 'edit' && this.actionType !== 'add'
    }
  },
  methods: {
    vaidateValueHandler(rule, value, cb) {
      if (!/^[1-9]\d*$/.test(value)) {
        cb(new Error('请填写1~100的正整数'))
        return
      } else {
        if (Number(value) > 100) {
          cb(new Error('请填写1~100的正整数'))
        } else {
          cb()
        }
      }
    },
    confirmHandler(cb) {
      if (this.actionDoing) {
        return
      }

      this.$refs['form'].validate((valid) => {
        if (!valid) {
          cb(false)
          return
        }
        // 待办检测数据是否合法
        if (this.$refs['belleSms'].onExamine()) {
          if (this.beData.templateParamList) {
            for (var i = 0; i < this.beData.templateParamList.length; i++) {
              var tempObj = this.beData.templateParamList[i]
              tempObj.paramId = tempObj.id
              tempObj.sendTemplateId = this.sendTemplateId
              tempObj.id = null
            }
          }
          var params = {
            sendTemplateId: this.sendTemplateId,
            brandCode: this.beData.brandCode,
            sceneId: this.beData.sceneId,
            templateId: '-1',
            templateType: 3, // 模版类型  1-公众号 2-小程序 3-短信 4-app推送
            messageType: 2, // 消息类型  2-营销（固定）
            templateParamList: this.beData.templateParamList,
            smsSign: this.beData.smsSign,
            contextText: this.beData.context,
            textarea: this.beData.textarea,
            phoneList: [],
            templateContent: this.beData.context
          }

          this.actionDoing = true
          this.$request({
            url: '/component/system/editMarketTemplateConfig',
            method: 'post',
            data: { data: params }
          }).then((res) => {
            this.actionDoing = false
            if (res.data) {
              params.sendTemplateId = res.data
              this.sendTemplateId = res.data

              this.nodeConf.node_data = params
              this.nodeConf.node_data.filterDayCnt = parseInt(this.nodeConf.filterDayCnt)
              this.nodeConf.node_data.filterLimitTimes = parseInt(this.nodeConf.filterLimitTimes)
              delete this.nodeConf.filterDayCnt
              delete this.nodeConf.filterLimitTimes

              this.curComConfig.nodeConf = this.nodeConf
              cb(true)
            } else {
              this.sendTemplateId = ''
              cb(false)
            }
          })
        } else {
          cb(false)
        }
      })
    }
  }
}
</script>
