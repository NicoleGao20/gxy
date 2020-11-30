<template>
  <el-container v-loading="pageLoading" class="wechat-template-msg-container">
    <el-main class="wechat-template-msg">
      <el-row type="flex">
        <el-col>
          <el-form ref="form" :model="form" :rules="rules" :validate-on-rule-change="false" label-width="110px">
            <el-form-item label="任务名称" prop="msg_name">
              <el-input
                v-model="form.msg_name"
                :maxlength="30"
                :disabled="onlyRead"
                placeholder="请输入任务名称"
                clearable/>
            </el-form-item>
            <el-row type="flex">
              <el-col>
                <el-form-item label="目标用户" prop="group_no">
                  <el-select v-model="form.group_no" :disabled="onlyRead" @change="handleGroupChange">
                    <el-option
                      v-for="item in groupList"
                      :key="item.id"
                      :label="item.group_name"
                      :value="item.group_no"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col v-if="form.group_no" class="audience-number">
                {{ `受众人数 ${form.cnt_audience}, 有效用户数（有OpenID）: ${form.cnt_audience_valid}` }}
              </el-col>
            </el-row>

            <el-form-item label="触发类型" prop="trigger_type">
              <el-row>
                <el-radio-group :disabled="onlyRead" v-model="form.trigger_type" @change="triggerTypeChange">
                  <el-radio label="主动触发">主动触发</el-radio>
                  <el-radio label="事件触发" disabled>事件触发</el-radio>
                </el-radio-group>
              </el-row>
            </el-form-item>
            <el-row v-if="form.trigger_type === '主动触发'">
              <el-form-item prop="proactive_type">
                <el-radio-group :disabled="onlyRead" v-model="form.proactive_type">
                  <el-radio label="立即发送">立即发送</el-radio>
                  <el-radio label="定时发送">定时发送</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item v-if="form.proactive_type === '定时发送'" prop="send_time">
                <span>消息将于 </span>
                <el-date-picker
                  :disabled="onlyRead"
                  v-model="form.send_time"
                  :default-time="defaultTime"
                  :picker-options="pickerOptions"
                  type="datetime"
                  format="yyyy-MM-dd HH:mm:ss"
                  value-format="yyyy-MM-dd HH:mm:ss"/>
                <span> 发送</span>
              </el-form-item>
            </el-row>
            <el-row v-else>
              <el-form-item label="选择事件" class="choose-event">
                <el-row :gutter="10" type="flex">
                  <el-col>
                    <el-form-item
                      :rules="{
                        message: '请选择事件类型', trigger: 'change', required: true
                      }"
                      prop="event_type">
                      <el-select
                        v-model="form.event_type"
                        :disabled="onlyRead"
                        filterable
                        placeholder="请选择事件类型"
                        style="width: 100%;"
                        @change="getEventListByType">
                        <el-option
                          v-for="(eventType, index) in eventTypes"
                          :key="index"
                          :label="eventType.eventTypeName"
                          :value="eventType.eventTypeCode"/>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col>
                    <el-form-item
                      :rules="{
                        message: '请选择事件', trigger: 'change', required: true
                      }"
                      prop="eventid">
                      <el-select
                        v-model="form.eventid"
                        :disabled="onlyRead"
                        filterable
                        placeholder="请选择事件"
                        style="width: 100%;"
                        @change="changeEventFilterAttributes">
                        <el-option
                          v-for="(eventItem, index) in eventItems"
                          :key="index"
                          :label="eventItem.eventName"
                          :value="eventItem.metaTableId"
                          :disabled="eventItem.disabled"/>
                      </el-select>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form-item>
            </el-row>
            <el-form-item v-if="loadedDone && form.branches&&form.branches.length" :disabled="onlyRead" label="事件条件">
              <div
                style="padding-left: 15px; padding-right: 15px; padding-top: 15px; background: #f4f6fa; border: 1px solid #d8dce6;">
                <el-form-item
                  v-for="(branchItem, index) in form.branches"
                  :key="index"
                  label-width="0"
                  style="margin-bottom: 0;">
                  <div style="position: relative; padding-right: 30px; margin-bottom: 15px;">
                    <event-branch
                      :branch-item="branchItem"
                      :branch-conditions="branchConditions"
                      :only-read="onlyRead"
                      :branch-index="index"/>
                  </div>
                </el-form-item>
              </div>
            </el-form-item>
            <el-form-item label="模板消息" prop="template_id">
              <el-select
                :disabled="onlyRead"
                v-model="form.template_id"
                @change="handleTemplateChange($event,'change')">
                <el-option
                  v-for="item in templateList"
                  :key="item.id"
                  :label="item.title"
                  :value="item.template_id"
                />
              </el-select>
            </el-form-item>
            <el-row v-show="templateFieldsList.length" class="template-detail">
              <template-info
                ref="info"
                :only-read="onlyRead"
                :list.sync="templateFieldsList"
                :template="selectedTemplate"
                :is-new="mode === 'new'"
                :father-form="form"/>
            </el-row>
            <el-form-item label="跳转到" prop="post_type">
              <el-radio-group :disabled="onlyRead" v-model="form.post_type">
                <el-radio label="无链接">无链接</el-radio>
                <el-radio label="自定义链接">自定义链接</el-radio>
                <el-radio label="小程序">小程序</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item v-if="form.post_type === '小程序'" label="小程序APPID" prop="appid">
              <el-input
                key="appid"
                v-model="form.appid"
                :maxlength="30"
                :disabled="onlyRead"
                placeholder="请输入ID"
                clearable/>
            </el-form-item>
            <el-form-item v-if="form.post_type === '小程序'" label="小程序路径" prop="pagepath">
              <el-input
                v-model="form.pagepath"
                :maxlength="30"
                :disabled="onlyRead"
                placeholder="请输入小程序路径"
                clearable/>
            </el-form-item>
            <el-form-item v-if="form.post_type === '小程序'" label="备用网页链接" prop="url">
              <el-input
                v-model="form.url"
                :maxlength="30"
                :disabled="onlyRead"
                placeholder="请输入备用网页链接"
                clearable/>
            </el-form-item>
            <el-form-item v-if="form.post_type === '自定义链接'" label="自定义链接" prop="url">
              <el-input
                key="url"
                v-model="form.url"
                :disabled="onlyRead"
                placeholder="请输入Url"
                clearable/>
            </el-form-item>
            <el-row class="form_footer">
              <el-button v-if="mode !== 'view'" type="primary" @click="handleSubmit">
                {{ mode === 'new' ? '立即创建' : '立即保存' }}
              </el-button>
              <el-button @click="handleCancel">{{ onlyRead ? '返回' : '取消' }}</el-button>
            </el-row>
          </el-form>
        </el-col>
        <el-col class="iphone-x-container">
          <div class="device iphone-x">
            <!--    外部轮廓    -->
            <div class="frame">
              <div class="content">
                <div class="time">{{ currentTime }}</div>
                <template-info
                  v-if="form.template_id"
                  ref="mobileInfo"
                  :only-read="onlyRead"
                  :list.sync="templateFieldsList"
                  :template="selectedTemplate"
                  :is-new="mode === 'new'"
                  :father-form="form"
                  template-mode="mobile"/>
              </div>
            </div>

            <!--    天线    -->
            <div class="stripe"/>

            <!--    听筒孔    -->
            <div class="header">
              <div class="sensors"/>
            </div>

            <!--    按键    -->
            <div class="btns"/>
            <div class="power"/>
          </div>
        </el-col>
      </el-row>

    </el-main>
  </el-container>
</template>

<script>
import { getEventTypeList, getEventListByType, getFilterAttributes } from '@/api/markting/event'
import {
  queryWeChatMaterialTemplate,
  insertWeChatTplMsg,
  updateWeChatTplMsg,
  wxTplmsgDetails,
  queryMsgName
} from '@/api/markting/wechat'
import { getGroupListByCon, getCountsByGroupId } from '@/api/markting/vinpinsightGrouplist'
import eventBranch from '@/views/platformitem/markting/marketing/marketingSetting/coms/wechatTemplateEventBranch'
import templateInfo from '@/componentsMarketing/WechatTemplateInfo'
import { mapGetters } from 'vuex'
import moment from 'moment'
import Cookies from 'js-cookie'

const SUBMIT_MAP = { 'new': insertWeChatTplMsg, 'edit': updateWeChatTplMsg }
const SUCCESS_MESSAGE_MAP = { 'new': '创建成功', 'edit': '保存成功' }
const CONFIRM_MESSAGE = { 'new': '确认立即创建微信模板消息吗?', 'edit': '确认立即保存微信模板消息吗?' }
export default {
  name: 'WechatTemplateMsgForm',
  components: { eventBranch, templateInfo },
  data() {
    return {
      defaultTime: moment().add(5, 'minutes').format('HH:mm:ss'),
      pickerOptions: {
        disabledDate: (time) => {
          let nowData = new Date()
          nowData = new Date(nowData.setDate(nowData.getDate() - 1))
          return time < nowData
        }
      },
      pageLoading: false,
      form: {
        msg_name: '',
        group_no: '',
        group_name: '',
        cnt_audience: 0,
        cnt_audience_valid: 0,
        trigger_type: '主动触发',
        proactive_type: '立即发送',
        send_time: '',
        event_type: '',
        event_name: '',
        tplmsg_source_id: '',
        template_id: '',
        msg_send_status: '',
        post_type: '无链接',
        appid: '',
        url: '',
        pagepath: '',
        // copy from event select
        eventid: '',
        branches: []
      },
      origin_msg_name: '',
      selectedTemplate: {},
      mode: 'new',
      groupList: [],
      templateList: [],
      eventConditionList: [],
      eventConditionForm: {},
      templateFieldsList: [],
      // copy from event select
      loadedDone: true,
      eventTypes: [],
      eventItems: [],
      branchConditions: [],
      currentTime: ''
    }
  },
  computed: {
    rules() {
      return {
        msg_name: [{ required: true, trigger: ['blur', 'change'], message: '任务名称不能为空' }, { validator: this.validateMsgName, trigger: 'blur' }],
        cnt_audience: { required: true, trigger: ['blur', 'change'], message: '受众选择不能为空' },
        trigger_type: { required: true, trigger: ['blur', 'change'], message: '触发类型不能为空' },
        template_id: { required: true, trigger: ['blur', 'change'], message: '微信模板不能为空' },
        group_no: { required: true, trigger: ['blur', 'change'], message: '目标用户不能为空' },
        post_type: { required: true, trigger: ['blur', 'change'], message: '跳转项不能为空' },
        appid: { required: true, trigger: ['blur', 'change'], message: 'appid不能为空' },
        pagepath: { required: true, trigger: ['blur', 'change'], message: '小程序路径不能为空' },
        url: {
          required: this.form.post_type === '自定义链接',
          trigger: ['blur', 'change'],
          message: this.form.post_type === '自定义链接' ? '自定义链接不能为空' : ''
        },
        send_time: [{ required: true, trigger: ['blur', 'change'], message: '发送时间不能为空' }, { validator: this.validateSendTime, trigger: 'blur' }]
      }
    },
    onlyRead() {
      return this.mode === 'view'
    },
    ...mapGetters(['brandCode'])
  },
  watch: {
    'form.trigger_type': {
      handler: function(newVal) {
        console.log('trigger type', newVal)
        if (newVal === '事件触发') {
          this.form.proactive_type = '立即发送'
        }
        if (newVal === '主动触发') {
          this.form.event_type = ''
        }
      }
    },
    'form.proactive_type': {
      handler: function(newVal) {
        if (newVal === '立即发送') {
          this.form.send_time = ''
        }
      }
    },
    'form.event_type': {
      handler: function(newVal) {
        if (!newVal) {
          this.form.eventid = ''
        }
      }
    },
    branchConditions: {
      handler: function(newVal) {
        if (!newVal.length) {
          this.$set(this.form, 'branches', [])
        }
        if (newVal && newVal.length) {
          newVal.forEach(x => {
            this.$set(this.eventConditionForm, x.column_name, '')
          })
        }
      },
      deep: true,
      immediate: true
    },
    'form.template_id': {
      handler: function(newVal) {
        if (!newVal) {
          this.templateFieldsList = []
        }
      }
    },
    'form.post_type': {
      handler: function(newVal) {
        this.form.url = ''
        if (newVal === '自定义链接') {
          this.$nextTick(() => {
            this.$refs.form.clearValidate(['appid', 'pagepath'])
          })
        } else if (newVal === '小程序') {
          this.$nextTick(() => {
            this.$refs.form.clearValidate(['url'])
          })
        }
      }
    }
  },
  created() {
    if (this.$route.name === 'newWechatTemplateMessage') this.mode = 'new'
    if (this.$route.name === 'editWechatTemplateMessage') this.mode = 'edit'
    if (this.$route.name === 'viewWechatTemplateMessage') this.mode = 'view'
    if (this.mode !== 'new') {
      // if (this.mode !== 'new' && this.$route.query.formData) {
      // this.form = JSON.parse(decodeURIComponent(this.$route.query.formData))
      wxTplmsgDetails({ id: this.$route.query.id }).then(res => {
        if (res && res.data) {
          const form = res.data
          if (form.msg_name) this.origin_msg_name = form.msg_name
          // form.send_content = '{"result":{"color":"#606266","value":"{{buyer_nick}}"},"issueInfo":{"color":"#606266","value":"{{buyer_nick}}"},"betTime":{"color":"#606266","value":"{{buyer_nick}}"},"fee":{"color":"#606266","value":"{{buyer_nick}}"},"drawTime":{"color":"#606266","value":"{{buyer_nick}}"},"remark":{"color":"#606266","value":"{{buyer_nick}}"}}'
          // form.template_id = '-lFrhXyqrU14IvKW6X6JPEF7BxoSOYQ9kfcbcJybAks'
          this.form = { ...this.form, ...form }
          this.convertFormData()
        }
      })
    }
  },
  mounted() {
    this.getGroupList()
    this.getTemplateList()
    this.currentTime = moment().format('HH:mm')
    const timer = setInterval(() => {
      this.currentTime = moment().format('HH:mm')
    }, 1000 * 60)
    this.$once('hook:beforeDestroy', () => clearInterval(timer))
  },
  methods: {
    validateSendTime(rule, value, callback) {
      const sendTime = new Date(value) * 1000 / 1000
      if (sendTime < Date.now()) {
        callback(new Error('发送时间不能早于当前时间'))
        return
      }
      callback()
    },
    validateMsgName(rule, value, callback) {
      if (this.mode === 'edit' && value === this.origin_msg_name) {
        callback()
        return
      }
      const queryObject = {
        msg_name: value,
        flag: 'crm_mk_wx_tplmsg'
      }
      queryMsgName(queryObject).then(res => {
        if (res && res.data) {
          callback(new Error('任务名称不能重复'))
          return
        }
        callback()
      })
    },
    triggerTypeChange(val) {
      if (val === '事件触发') {
        this.getEventTypeList()
      } else {
        this.eventTypes = []
        this.eventItems = []
        this.branchConditions = []
      }
    },
    getFormPromise(form) {
      return new Promise(resolve => {
        form.validate(res => {
          resolve(res)
        })
      })
    },
    generateEventStr() {
      if (this.form.branches && this.form.branches.length) {
        return JSON.stringify(this.form.branches).replace(/"/g, '\\"')
      } else {
        return ''
      }
    },
    handleSubmit() {
      const validateArr = [this.$refs.form]
      if (this.$refs.info) {
        validateArr.push(this.$refs.info.$refs.form)
      }
      Promise.all(validateArr.map(this.getFormPromise)).then(res => {
        const valid = res.every(x => !!x)
        if (valid) {
          this.$confirm(CONFIRM_MESSAGE[this.mode], '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.pageLoading = true
            let postData = {
              msg_name: this.form.msg_name,
              group_no: this.form.group_no,
              group_name: this.form.group_name,
              cnt_audience: this.form.cnt_audience,
              cnt_audience_valid: this.form.cnt_audience_valid,
              trigger_type: this.form.trigger_type,
              tplmsg_source_id: this.form.tplmsg_source_id,
              template_id: this.form.template_id,
              send_content: this.$refs.info.generateTemplateStr(),
              msg_send_status: this.form.msg_send_status || '待发送',
              post_type: this.form.post_type
            }
            // 主动触发
            if (this.form.trigger_type === '主动触发') {
              postData.proactive_type = this.form.proactive_type
              if (this.form.proactive_type === '定时发送') {
                postData.send_time = this.form.send_time
                postData.msg_send_status = '待发送'
              } else {
                postData.send_time = null
                postData.msg_send_status = '发送中'
              }
            } else {
              // 事件触发
              const _postData = {
                event_type: this.form.event_type,
                event_name: this.form.event_name,
                event_cond_jason: this.generateEventStr()
              }
              postData = { ..._postData, ...postData }
            }
            // 小程序
            if (this.form.post_type === '小程序') {
              const _postData = {
                appid: this.form.appid,
                pagepath: this.form.pagepath,
                url: this.form.url
              }
              postData = { ..._postData, ...postData }
              // 自定义链接
            } else if (this.form.post_type === '自定义链接') {
              postData.url = this.form.url
            }
            if (this.mode === 'edit') {
              postData.id = this.form.id
              postData.xxl_id = this.form.xxl_id
            }
            console.log('post data', postData)
            SUBMIT_MAP[this.mode](postData).then(res => {
              if (res && res.data) {
                this.$message({
                  message: SUCCESS_MESSAGE_MAP[this.mode],
                  type: 'success',
                  center: true,
                  duration: 1000,
                  onClose: () => {
                    this.handleBack()
                  }
                })
              }
            }).finally(() => {
              this.pageLoading = false
            })
          })
        }
      })
    },
    timeAdd0(num) {
      let str = String(num)
      if (str.length <= 1) {
        str = '0' + str
      }
      return str
    },
    getNowFormatDate() {
      const date = new Date()
      return (
        date.getFullYear() +
        '-' +
        this.timeAdd0(date.getMonth() + 1) +
        '-' +
        this.timeAdd0(date.getDate()) +
        ' ' +
        this.timeAdd0(date.getHours()) +
        ':' +
        this.timeAdd0(date.getMinutes()) +
        ':' +
        this.timeAdd0(date.getSeconds())
      )
    },
    handleCancel() {
      this.handleBack()
    },
    handleGroupChange(val) {
      this.form.cnt_audience_valid = 0
      this.form.cnt_audience = 0
      const selectedGroup = this.groupList.find(x => x.group_no === val)
      if (selectedGroup) {
        this.form.group_name = selectedGroup.group_name
        this.pageLoading = true
        getCountsByGroupId({
          groupId: selectedGroup.id,
          brand_code: Cookies.get('brandCode'),
          idType: 'wx_openid'
        }).then(res => {
          if (res && res.data) {
            this.form.cnt_audience = res.data.total || 0
            this.form.cnt_audience_valid = res.data.wx_openid_total || 0
          }
        }).finally(() => {
          this.pageLoading = false
        })
      }
    },
    getEventTypeList() {
      getEventTypeList().then(res => {
        if (res && res.data && res.data.list) {
          this.eventTypes = (res.data && res.data.list) || []
        }
      })
    },
    getTemplateList() {
      queryWeChatMaterialTemplate().then((res) => {
        console.log('res', res)
        if (res && res.data) {
          this.templateList = res.data || []
          if (this.mode !== 'new' && this.form.template_id) {
            this.handleTemplateChange(this.form.template_id)
          }
        }
      })
    },

    handleTemplateChange(val, trigger) {
      const selectedTemplate = this.templateList.find(x => x.template_id === val)
      if (selectedTemplate && selectedTemplate.content) {
        this.form.tplmsg_source_id = selectedTemplate.id
        this.selectedTemplate = selectedTemplate
        if (trigger === 'change') {
          this.form.send_content = ''
        }
        this.$nextTick(() => {
          this.$refs.info.$refs.form.resetFields()
        })
      }
    },

    handleBack() {
      this.$router.push({ name: 'wechatMange', query: { activeName: 'wechatTempMessage' }})
    },
    getGroupList() {
      getGroupListByCon({ status: 'started', brandCode: this.brandCode }).then(res => {
        if (res && res.data && res.data.list) {
          this.groupList = res.data.list.filter(x => x.brand_code === Cookies.get('brandCode'))
        }
      })
    },
    getEventListByType() {
      this.eventItems = []
      this.form.eventid = ''
      if (this.form.event_type) {
        getEventListByType({ eventTypeCode: this.form.event_type }).then((res) => {
          this.eventItems = (res.data && res.data.list) || []
        })
      }
    },
    getFilterAttributes(cb) {
      if (this.form.eventid) {
        getFilterAttributes({ metaTableId: this.form.eventid }).then((res) => {
          if (res.data) {
            this.branchConditions = res.data.list || []
            if (cb) {
              cb()
            }
          }
        })
      }
    },
    changeEventFilterAttributes(val) {
      if (!val) {
        this.form.event_name = ''
        this.branchConditions = []
      }
      this.form.event_name = this.eventItems.find(x => x.metaTableId === val).eventName
      this.form.branches = []
      this.getFilterAttributes(this.addBranch)
    },
    addBranch() {
      if (this.form.branches.length >= 9) {
        this.$message({
          type: 'error',
          message: '最大支持9个分支'
        })
        return
      }

      var tempBranch = {
        branch_name: '',
        event: []
      }

      for (var i = 0; i < this.branchConditions.length; i++) {
        var temp = {}
        temp.column_name = this.branchConditions[i].column_name
        temp.column_value = ''
        temp.meta_column_id = this.branchConditions[i].meta_column_id
        temp.column_value_type = 'field'
        // 对于上传门店,需要将column_value 设置为对应的表
        tempBranch.event.push(temp)
      }

      this.form.branches.push(tempBranch)
    },
    convertFormData() {
      if (this.form.trigger_type === '事件触发') {
        this.getEventTypeList()
        if (this.form.event_type) {
          getEventListByType({ eventTypeCode: this.form.event_type }).then((res) => {
            this.eventItems = (res.data && res.data.list) || []
            if (this.form.event_name) {
              const selectedRow = this.eventItems.find(x => x.eventName === this.form.event_name)
              if (selectedRow) {
                this.form.eventid = selectedRow.metaTableId
                if (this.form.eventid) {
                  this.getFilterAttributes()
                  if (this.form.event_cond_jason) {
                    this.form.branches = JSON.parse(this.form.event_cond_jason.replace(/\\"/g, '"'))
                  }
                }
              }
            }
          })
        }
      }
    }
  }
}
</script>

<style lang="less" scoped>
.wechat-template-msg-container {
  padding: 20px;
  width: 100%;
  min-height: 100%;

  .wechat-template-msg {
    width: 100%;
    min-height: 100%;
    background-color: #fff;

    .condition-form {
      width: 500px;
      padding: 10px;
      border-radius: 5px;
      background-color: #e4e4e4;

      /deep/ .el-form-item__label {
        padding-bottom: 0;
      }

      /deep/ .el-form-item {
        margin-bottom: 0;
      }
    }
  }

  .audience-number {
    padding: 0 0 0 10px;
    line-height: 30px;
    color: #606266
  }

  .footer {
    margin-left: 100px;
  }

  /deep/ .el-select {
    width: 100% !important;
  }

  /deep/ .choose-event.el-form-item {
    & > .el-form-item__label {
      &:before {
        content: '*';
        color: #F56C6C;
        margin-right: 4px;
      }
    }
  }

  .iphone-x-container {
    user-select: none;
  }
}
</style>
