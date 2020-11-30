<template>
  <el-container v-loading="pageLoading" class="wechat-group-msg-container">
    <el-main class="wechat-group-msg">
      <el-row type="flex">
        <el-col>
          <el-form ref="form" :model="form" :rules="rules" :validate-on-rule-change="false" label-width="100px">
            <el-form-item label="任务名称" prop="msg_name">
              <el-input
                v-model="form.msg_name"
                :maxlength="30"
                :disabled="onlyRead"
                placeholder="请输入任务名称"
                clearable
              />
            </el-form-item>
            <el-row type="flex">
              <el-col>
                <el-form-item label="目标用户" prop="group_no">
                  <el-select
                    v-model="form.group_no"
                    :disabled="onlyRead"
                    @change="handleGroupChange"
                  >
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
            <el-form-item label="图文素材" prop="media_id">
              <el-select
                v-model="form.media_id"
                :disabled="onlyRead"
                @change="handleGMChange"
              >
                <el-option
                  v-for="item in graphicMaterialList"
                  :key="item.id"
                  :label="item.title"
                  :value="item.media_id"
                />
              </el-select>
              <div
                v-if="gmSelected && gmSelected.media_id"
                class="material-item-container"
              >
                <material-item
                  :item="gmSelected"
                  :read-only="onlyRead"
                  :choosed-id="choosedId"
                  :language="language"
                  :show-choose="showChoose"
                  @handleChoose="handleChoose"
                />
              </div>
            </el-form-item>
            <el-form-item label="推送时间" prop="proactive_type">
              <el-radio-group
                v-model="form.proactive_type"
                :disabled="onlyRead"
              >
                <el-radio label="立即发送">立即发送</el-radio>
                <el-radio label="定时发送">定时发送</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item
              v-if="form.proactive_type === '定时发送'"
              prop="send_time"
            >
              <span>消息将于 </span>
              <el-date-picker
                :disabled="onlyRead"
                v-model="form.send_time"
                :default-time="defaultTime"
                :picker-options="pickerOptions"
                type="datetime"
                format="yyyy-MM-dd HH:mm:ss"
                value-format="yyyy-MM-dd HH:mm:ss"
              />
              <span> 发送</span>
            </el-form-item>
          </el-form>
        </el-col>
        <el-col class="iphone-x-container">
          <div class="device iphone-x">
            <!--    外部轮廓    -->
            <div class="frame">
              <div class="content">
                <div class="time">{{ currentTime }}</div>
                <div
                  v-if="form.media_id && gmSelected && gmSelected.media_id"
                  class="phone-template-container"
                >
                  <material-item
                    :item="gmSelected"
                    :read-only="onlyRead"
                    :choosed-id="choosedId"
                    :language="language"
                    :show-choose="showChoose"
                    @handleChoose="handleChoose"
                  />
                </div>
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
      <el-row class="form_footer">
        <el-button v-if="mode !== 'view'" type="primary" @click="handleSubmit">
          {{ mode === 'new' ? '立即创建' : '立即保存' }}
        </el-button>
        <el-button @click="handleCancel">{{
          onlyRead ? '返回' : '取消'
        }}
        </el-button>
      </el-row>
    </el-main>
  </el-container>
</template>

<script>
import {
  queryImageTextMaterialList,
  sendMassTexting,
  updateMassTexting,
  wxMassTextingDetails,
  queryMsgName
} from '@/api/markting/wechat'
import { getGroupListByCon, getCountsByGroupId } from '@/api/markting/vinpinsightGrouplist'
import materialItem from '@/componentsMarketing/ChooseMaterial/src/materialItem'
import moment from 'moment'
import Cookies from 'js-cookie'

const SUBMIT_MAP = { new: sendMassTexting, edit: updateMassTexting }
const SUCCESS_MESSAGE_MAP = { new: '创建成功', edit: '保存成功' }
const CONFIRM_MESSAGE = { 'new': '确认立即创建微信群发消息吗?', 'edit': '确认立即保存微信群发消息吗?' }
export default {
  name: 'WechatGroupMsgForm',
  components: { materialItem },
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
        proactive_type: '立即发送',
        send_time: '',
        picmsg_id: '',
        media_id: '',
        content_source_url: '',
        msg_send_status: '待发送'
      },
      origin_msg_name: '',
      mode: 'new',
      groupList: [],
      eventNameList: [],
      accountList: [],
      graphicMaterialList: [],
      gmSelected: {},
      language: 'zh',
      choosedId: null,
      showChoose: false,
      currentTime: ''
    }
  },
  computed: {
    rules() {
      return {
        msg_name: [{
          required: true,
          trigger: ['blur', 'change'],
          message: '任务名称不能为空'
        }, { validator: this.validateMsgName, trigger: 'blur' }],
        cnt_audience: {
          required: true,
          trigger: ['blur', 'change'],
          message: '受众选择不能为空'
        },
        group_no: {
          required: true,
          trigger: ['blur', 'change'],
          message: '目标用户不能为空'
        },
        media_id: {
          required: true,
          trigger: ['blur', 'change'],
          message: '图文素材不能为空'
        },
        send_time: [{ required: true, trigger: ['blur', 'change'], message: '发送时间不能为空' }, { validator: this.validateSendTime, trigger: 'blur' }]
      }
    },
    onlyRead() {
      return this.mode === 'view'
    },
    successMsg() {
      if (this.mode === 'new') {
        return '创建成功'
      } else {
        return '保存成功'
      }
    }
  },
  watch: {
    'form.proactive_type': {
      handler: function(newVal) {
        if (newVal === '立即发送') {
          this.form.send_time = ''
        }
      }
    },
    '$i18n.locale': {
      handler: function(newVal) {
        this.language = newVal
      },
      immediate: true
    }
  },
  created() {
    if (this.$route.name === 'newWechatGroupMessage') this.mode = 'new'
    if (this.$route.name === 'editWechatGroupMessage') this.mode = 'edit'
    if (this.$route.name === 'viewWechatGroupMessage') this.mode = 'view'
    // if (this.mode !== 'new') {
    if (this.mode !== 'new' && this.$route.query.formData) {
      wxMassTextingDetails({ id: this.$route.query.id }).then((res) => {
        if (res && res.data) {
          const form = res.data
          if (form.msg_name) this.origin_msg_name = form.msg_name
          this.form = { ...this.form, ...form }
        }
      })
    }
  },
  mounted() {
    this.getGroupList()
    this.getImageTextMaterialList()
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
        flag: 'crm_mk_wx_gmsg'
      }
      queryMsgName(queryObject).then(res => {
        if (res && res.data) {
          callback(new Error('任务名称不能重复'))
          return
        }
        callback()
      })
    },
    handleSubmit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.$confirm(CONFIRM_MESSAGE[this.mode], '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.pageLoading = true
            if (this.form.proactive_type === '立即发送') {
              this.form.send_time = null
              this.form.msg_send_status = '发送中'
            } else {
              this.form.msg_send_status = '待发送'
            }
            SUBMIT_MAP[this.mode](this.form)
              .then((res) => {
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
              })
              .finally(() => {
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
    handleBack() {
      this.$router.push({
        name: 'wechatMange',
        query: { activeName: 'wechatGroupMessage' }
      })
    },
    getImageTextMaterialList() {
      queryImageTextMaterialList().then((res) => {
        if (res && res.data) {
          this.graphicMaterialList = res.data
          if (this.mode !== 'new' && this.form.media_id) {
            this.handleGMChange(this.form.media_id)
          }
        }
      })
    },
    handleGMChange(val) {
      this.gmSelected = this.graphicMaterialList.find(
        (x) => x.media_id === val
      )
      if (this.gmSelected && this.gmSelected.id) {
        this.form.picmsg_id = this.gmSelected.id
        this.form.content_source_url = this.gmSelected.url
        this.choosedId = this.gmSelected.id
      }
    },
    handleChoose(val) {
      console.log('choose -----------------------', val)
    },
    getGroupList() {
      getGroupListByCon({ status: 'started' }).then((res) => {
        if (res && res.data && res.data.list) {
          this.groupList = res.data.list.filter(x => x.brand_code === Cookies.get('brandCode'))
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.wechat-group-msg-container {
  padding: 20px;
  width: 100%;
  min-height: 100%;

  .wechat-group-msg {
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
    color: #606266;
  }

  .footer {
    margin-left: 100px;
  }

  /deep/ .el-select {
    width: 100% !important;
  }

  .material-item-container {
    max-width: 500px;
    margin-top: 10px;
  }

  .phone-template-container {
    background-color: #fff;
    font-size: 10px;
    font-weight: 500;
    margin: 20px 10px 0;
    border: 1px solid #ccc;
    border-radius: 5px;

    .card-item {
      &.active {
        border-color: transparent;
        margin-bottom: 0;
      }
    }
  }
}
</style>
<style lang="less">
.wechat-group-msg-container {
  .phone-template-container .card-item a.cover {
    height: 100px;
  }
}
</style>
