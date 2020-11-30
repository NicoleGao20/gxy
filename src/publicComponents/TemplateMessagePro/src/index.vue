<template>
  <div class="template-message">
    <section v-if="!onlyRead">
      <el-form ref="form" :model="form" :rules="rules" :validate-on-rule-change="false" label-width="120px">
        <el-form-item label="选择模板" prop="templateId">
          <el-select :disabled="onlyRead" v-model="form.templateId" class="full-width" @change="handleTemplateChange($event,'change')">
            <el-option
              v-for="item in templateList"
              :key="item.id"
              :label="item.title"
              :value="item.template_id"
            />
          </el-select>
        </el-form-item>
        <el-form-item v-show="templateEditBeanList.length" label="模板详情">
          <template-info
            ref="info"
            :only-read="onlyRead"
            :list.sync="templateEditBeanList"
            :template="selectedTemplate"
            :is-new="mode === 'new'"
            :father-form="form"/>
        </el-form-item>
        <el-form-item label="模板详情链接" prop="linkType">
          <el-select v-model="form.linkType" placeholder="请选择" class="full-width">
            <el-option
              v-for="item in linkTypes"
              :key="item.value"
              :label="item.label"
              :value="item.value"/>
          </el-select>
        </el-form-item>
        <el-form-item v-if="form.linkType === 1" label="小程序APPID" prop="weappId">
          <el-input
            key="weappId"
            v-model="form.weappId"
            :maxlength="30"
            :disabled="onlyRead"
            placeholder="请输入ID"
            clearable/>
        </el-form-item>
        <el-form-item v-if="form.linkType === 1" label="小程序路径" prop="weappPath">
          <el-input
            v-model="form.weappPath"
            :maxlength="30"
            :disabled="onlyRead"
            placeholder="请输入小程序路径"
            clearable/>
        </el-form-item>
        <el-form-item v-if="form.linkType === 1" label="备用网页链接" prop="weappLink">
          <el-input
            v-model="form.weappLink"
            :maxlength="30"
            :disabled="onlyRead"
            placeholder="请输入备用网页链接"
            clearable/>
        </el-form-item>
        <el-form-item v-if="form.linkType === 4" label="自定义链接" prop="customLink">
          <el-input
            key="url"
            v-model="form.customLink"
            :disabled="onlyRead"
            placeholder="请输入自定义链接"
            clearable/>
        </el-form-item>
        <el-form-item label="测试发送" prop="openidList">
          <el-row type="flex">
            <el-col>
              <el-select
                v-model="form.openidList"
                multiple
                filterable
                allow-create
                default-first-option
                placeholder="多个appid请按回车键进行分隔"
                class="phone-select full-width"
                popper-class="phone-dropdown"
              >
                <el-option
                  v-for="item in phoneOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"/>
              </el-select>
            </el-col>
            <el-col style="width: 100px">
              <el-button type="primary" class="ml" @click="handleSendSMS($event)">发送</el-button>
            </el-col>
          </el-row>

        </el-form-item>
      </el-form>
      <!--      <div class="term">-->
      <!--        <p><span>*</span>选择模版：</p>-->
      <!--        <el-select v-model="templateId" filterable placeholder="请选择" class="input" @change="handleChangeTemplate">-->
      <!--          <el-option-->
      <!--            v-for="item in templateOptions"-->
      <!--            :key="item.value"-->
      <!--            :label="item.label"-->
      <!--            :value="item.value"/>-->
      <!--        </el-select>-->
      <!--      </div>-->
      <!--      <div class="term top">-->
      <!--        <p><span>*</span>模版内容：</p>-->
      <!--        <div class="new-member-notice">-->
      <!--          <div class="title">{{ currentTemplate && currentTemplate.id ? `模板ID ${currentTemplate.id}` : '' }}</div>-->
      <!--          &lt;!&ndash; <div class="title mb-l">{{currentTemplate && currentTemplate.templateContent ? `别名：${currentTemplate.templateContent}` : ''}}</div> &ndash;&gt;-->
      <!--          <section v-for="(templateEditor, templateEditorIndex) in templateEditBeanList" :key="templateEditor.templateId + templateEditorIndex">-->
      <!--            <div >{{ templateEditor.labelName ?templateEditor.labelName :templateEditor.valueParamKey }}</div>-->
      <!--            &lt;!&ndash; <div v-if="templateEditor.labelParamKey">{{templateEditor.labelParamKey}}</div>-->
      <!--            <div v-if="templateEditor.labelParamKey" class="wrap">-->
      <!--                <el-input v-model="templateEditBeanList[templateEditorIndex].labelParamValue" style="width: 80%" maxlength="100" />-->
      <!--            </div> &ndash;&gt;-->
      <!--            <div class="wrap">-->
      <!--              <Editable :domref="templateEditor.valueParamKey" :ref="templateEditor.valueParamKey" :value="templateEditor.valueParamValue" :max-num="200" />-->
      <!--            </div>-->
      <!--          </section>-->
      <!--        </div>-->
      <!--      </div>-->
      <!--      <div class="term">-->
      <!--        <p><span>*</span>模板详情链接：</p>-->
      <!--              <el-select v-model="linkType" placeholder="请选择" class="input">-->
      <!--                <el-option-->
      <!--                  v-for="item in linkTypes"-->
      <!--                  :key="item.value"-->
      <!--                  :label="item.label"-->
      <!--                  :value="item.value"/>-->
      <!--              </el-select>-->
      <!--      </div>-->
      <!--      <div v-show="linkType === 1" class="term">-->
      <!--        <p><span>*</span>小程序APPID：</p>-->
      <!--        <el-input v-model="weappId" type="text" class="input" />-->
      <!--      </div>-->
      <!--      <div v-show="linkType === 1" class="term">-->
      <!--        <p><span>*</span>小程序路径：</p>-->
      <!--        <el-input v-model="weappPath" type="text" class="input" />-->
      <!--      </div>-->
      <!--      <div v-show="linkType === 1" class="term" style="margin-bottom:0px">-->
      <!--        <p><span/>备用网页链接：</p>-->
      <!--        <el-input v-model="weappLink" type="text" class="input" />-->
      <!--      </div>-->
      <!--      <div v-show="linkType === 1" class="term" style="padding-left:131px">小程序链接跳转失败可以跳转到备用的H5链接</div>-->
      <!--      <div v-show="linkType === 4" class="term">-->
      <!--        <p><span>*</span>自定义链接：</p>-->
      <!--        <el-input v-model="customLink" type="text" placeholder="请输入链接" class="input"/>-->
      <!--      </div>-->
      <!--      <div class="term">-->
      <!--        <p>测试发送123123124：</p>-->
      <!--        <el-select-->
      <!--          v-model="phoneList"-->
      <!--          multiple-->
      <!--          filterable-->
      <!--          allow-create-->
      <!--          default-first-option-->
      <!--          placeholder="请输入测试手机号，多个手机号请按回车键进行分隔"-->
      <!--          class="phone-select"-->
      <!--          popper-class="phone-dropdown"-->
      <!--        >-->
      <!--          <el-option-->
      <!--            v-for="item in phoneOptions"-->
      <!--            :key="item.value"-->
      <!--            :label="item.label"-->
      <!--            :value="item.value"/>-->
      <!--        </el-select>-->
      <!--        <el-button type="primary" class="ml" @click="handleSendSMS($event)">发送</el-button>-->
      <!--      </div>-->
      <!--      <div :class="`${phoneError ? 'text-red' : 'text-grey'} indent phone-tip`">{{ phoneTip }}</div>-->
      <!-- <div class="term indent">
        <el-button type="primary" @click="handleSubmit">确定</el-button>
        <el-button @click="handleToggleDrawer(false)">取消</el-button>
      </div> -->
    </section>
    <div v-if="onlyRead" class="read-only">
      <!--      <div class="term">-->
      <!--        <p>模板ID：</p>-->
      <!--        <el-input :disabled="true" :value="templateId" />-->
      <!--      </div>-->
      <!--      <div class="term">-->
      <!--        <p>模板名称：</p>-->
      <!--        <el-input :disabled="true" :value="currentTemplate.templateName" />-->
      <!--      </div>-->
      <!--      <div class="term top">-->
      <!--        <p>模板内容：</p>-->
      <!--        <div style="width: 100%">-->
      <!--          <div class="title">{{ currentTemplate ? `模板ID ${currentTemplate.id}` : '' }}</div>-->
      <!--          <div class="title mb">{{ currentTemplate ? `别名：${currentTemplate.templateContent}` : '' }}</div>-->
      <!--          <section v-for="(templateEditor) in templateEditBeanList" :key="templateEditor.templateId" class="mb-l">-->
      <!--            <div v-if="templateEditor.labelName" class="mb">{{ templateEditor.labelName }}</div>-->
      <!--            <div v-if="templateEditor.labelParamKey">{{ templateEditor.labelParamKey }}</div>-->
      <!--            <div v-if="templateEditor.labelParamKey" class="mb">-->
      <!--              <el-input :disabled="true" :value="templateEditor.labelParamValue" />-->
      <!--            </div>-->
      <!--            <div>{{ templateEditor.valueParamKey }}</div>-->
      <!--            <div class="mb">-->
      <!--              <el-input :disabled="true" :value="templateEditor.valueParamValue" autosize type="textarea" />-->
      <!--            </div>-->
      <!--          </section>-->
      <!--        </div>-->
      <!--      </div>-->
      <!--      <div class="term">-->
      <!--        <p>模板详情链接：</p>-->
      <!--        <el-input :disabled="true" :value="getName()" />-->
      <!--      </div>-->
      <!--      <div v-if="linkType===1" class="term">-->
      <!--        <p>小程序APPID：</p>-->
      <!--        <el-input :disabled="true" :value="weappId" />-->
      <!--      </div>-->
      <!--      <div v-if="linkType===1" class="term">-->
      <!--        <p>小程序路径：</p>-->
      <!--        <el-input :disabled="true" :value="weappPath" />-->
      <!--      </div>-->
      <!--      <div v-if="linkType===1" class="term">-->
      <!--        <p>备用网页链接：</p>-->
      <!--        <el-input :disabled="true" :value="weappLink" />-->
      <!--      </div>-->
      <!--      <div v-if="linkType===4" class="term">-->
      <!--        <p>自定义链接：</p>-->
      <!--        <el-input :disabled="true" :value="customLink" />-->
      <!--      </div>-->
    </div>
  </div>
</template>
<script type="text/javascript">
import { queryWeChatMaterialTemplate } from '@/api/markting/wechat'
import templateInfo from '@/componentsMarketing/WechatTemplateInfo'

export default {
  name: 'TemplateMessagePro',
  components: {
    templateInfo
  },
  props: {
    configParams: {
      type: Object,
      default() {
        return {}
      }
    },
    onlyRead: {
      type: Boolean,
      default() {
        return true
      }
    },
    isNew: {
      type: Boolean,
      default() {
        return true
      }
    }
  },
  data() {
    return {
      sceneId: '',
      brandCode: '',
      // allParams: [],
      // smsParams: [], // ['品牌', '姓名', '注册门店', '消费编码', '优惠券编码'],
      // paramList: [],
      templateEditBeanList: [],
      linkTypes: [
        { value: 0, label: '无链接' }, // 无链接
        { value: 4, label: '自定义链接' }, // 自定义链接
        { value: 1, label: '小程序' } // 微信小程序
      ],
      // templateContentError: false,
      // templateLabelList: {},
      // customLink: '',
      // weappId: '',
      // weappPath: '',
      // weappLink: '',
      openidList: [], // ['13011112222', '13022223333']
      phoneOptions: [],
      // phoneError: false,
      phoneTip: '多个手机号请按 回车键 进行分隔',
      wechatOpenIdList: [],
      // move from wechat template message
      mode: 'new',
      form: {
        openidList: [],
        templateId: '',
        linkType: 0,
        tplmsg_source_id: '',
        weappId: '',
        weappLink: '',
        weappPath: ''
      },
      templateList: [],
      selectedTemplate: {}
    }
  },
  computed: {
    rules() {
      return {
        templateId: { required: true, trigger: ['blur', 'change'], message: '触发类型不能为空' },
        linkType: { required: true, trigger: ['blur', 'change'], message: '跳转项不能为空' },
        weappId: { required: true, trigger: ['blur', 'change'], message: '小程序APPID不能为空' },
        weappPath: { required: true, trigger: ['blur', 'change'], message: '小程序路径不能为空' },
        weappLink: {
          required: this.form.linkType === '自定义链接',
          trigger: ['blur', 'change'],
          message: this.form.linkType === '自定义链接' ? '自定义链接不能为空' : ''
        }
      }
    }
  },
  watch: {
    'form.templateId': {
      handler: function(newVal) {
        if (!newVal) {
          this.templateEditBeanList = []
        }
      }
    },
    'form.linkType': {
      handler: function(newVal) {
        this.form.weappLink = ''
        if (newVal === '自定义链接') {
          this.$nextTick(() => {
            this.$refs.form.clearValidate(['weappId', 'weappPath', 'weappLink'])
          })
        } else if (newVal === '小程序') {
          this.$nextTick(() => {
            this.$refs.form.clearValidate(['customLink'])
          })
        }
      }
    }
  },
  created() {
    console.log('is new', this.isNew)
    if (this.$route.query && this.$route.query.actionTyoe === 'add') this.mode = 'new'
    if (this.$route.query && this.$route.query.actionTyoe === 'edit') this.mode = 'edit'
    if (this.$route.query && this.$route.query.actionTyoe === 'view') this.mode = 'view'
    const { brandCode, sceneId } = this.configParams
    this.brandCode = brandCode
    this.sceneId = sceneId
    this.fetchTemplateList()
    if (!this.iseditor) {
      this.templateId = this.wechatTemplateId || ''
      this.weappId = this.miniProgramAppId || ''
      this.weappPath = this.miniProgramPageId || ''
      if (this.linkType === 1) {
        this.weappLink = this.url
      }
      if (this.linkType === 4) {
        this.customLink = this.url
      }
    }
    // move from wechat template list
  },
  methods: {
    fetchTemplateList() {
      queryWeChatMaterialTemplate().then((res) => {
        console.log('res', res)
        if (res && res.data) {
          this.templateList = res.data || []
          if (this.mode !== 'new' && this.form.templateId) {
            this.handleTemplateChange(this.form.templateId)
          }
        }
      })
    },
    // 设置底部模版详情链接
    getName() {
      if (!this.linkType && this.linkType !== 0) {
        return ''
      }
      const item = this.linkTypes.find(item => item.value === this.linkType)
      return item.label
    },
    async handleSendSMS(e) {
      e.preventDefault()
      this.validateopenidList()
      const openIdRes = await this.$request({
        url: '/component/system/getOpenId',
        params: {
          brandCode: this.brandCode,
          mobileList: this.openidList.join(',')
        }
      })
      const { data } = openIdRes
      const list = data && data.list ? data.list : []
      this.wechatOpenIdList = list.map(item => item.openId)
      const params = this.getData()
      await this.$request({
        url: '/component/system/sendTestWechatPublicMessage',
        method: 'POST',
        data: { data: params }
      })
      // this.$emit('onSendSMS', params, res)
    },
    getDom(data, islink) {
      const width = islink ? data.length * 6 : data.length * 18
      const dom = `<input type="text" title="${data.length}" style="display:inline;border:none;color:#0a8ddf;width:${width}px;text-align:center" class="sms-add-value" value="{${data}}" readonly/>`
      return dom
    },
    // onaddData(data, islink) {
    //   const dom = this.getDom(data, islink)
    //   insertHtmlAtCaret(dom)
    //   if (!islink) {
    //     const paramItem = this.allParams.find(item => item.paramKey === data)
    //     const isInParamList = this.paramList.find(item => item.paramKey === data)
    //     if (paramItem && !isInParamList) {
    //       this.paramList.push({
    //         paramId: paramItem.id,
    //         paramKey: paramItem.paramKey,
    //         paramValue: paramItem.paramValue
    //       })
    //     }
    //   }
    // },
    validateopenidList() {
      if (this.openidList.length === 0) {
        this.phoneError = true
        this.phoneTip = '请输入手机号，并按下回车键'
        return false
      }
      this.phoneError = false
      this.openidList.forEach(phone => {
        if (!/^1[34578]\d{9}$/.test(phone)) {
          this.phoneError = true
        }
      })
      if (this.phoneError) {
        this.phoneTip = '手机号格式不正确'
        return false
      }
      this.phoneError = false
      this.phoneTip = ''
      return true
    },
    validateForm() {
      const validateArr = [this.$refs.form]
      if (this.$refs.info) {
        validateArr.push(this.$refs.info.$refs.form)
      }
      return new Promise(resolve => {
        Promise.all(validateArr.map(this.getFormPromise)).then(res => {
          if (res.every(x => !!x)) {
            resolve(true)
          } else {
            resolve(false)
          }
        })
      })
    },
    getData() {
      console.log('template edit bean list', this.templateEditBeanList)
      const templateEditBeanList = this.$refs.info.generateTemplateEditBeanValueList()
      console.log('template edit bean value list', templateEditBeanList)
      const fieldList = []
      templateEditBeanList.forEach(x => {
        fieldList.push({
          fieldKey: x.valueParamKey,
          fieldValue: x.valueParamValue,
          fieldColor: x.color
        })
      })
      return {
        ...this.configParams,
        wechatTemplateId: this.templateId,
        paramList: this.paramList,
        openidList: this.openidList,
        templateEditBeanList: this.templateEditBeanList,
        wechatOpenIdList: this.wechatOpenIdList,
        miniProgramAppId: this.weappId,
        miniProgramPageId: this.weappPath,
        url: this.customLink || this.weappLink,
        linkType: this.linkType,
        fieldList
      }
    },
    async setData(data) {
      console.log('setData', data)
      const that = this
      if (data && typeof data === 'object') {
        this.templateId = data.wechatTemplateId || ''
        this.weappId = data.miniProgramAppId || ''
        this.weappPath = data.miniProgramPageId || ''
        this.linkType = data.linkType ? data.linkType : data.linkType === 0 ? 0 : ''
        if (data.linkType === 1) {
          this.weappLink = data.url || ''
        }
        if (data.linkType === 4) {
          this.customLink = data.url || ''
        }
        if (data.paramList) {
          this.paramList = data.paramList
        }
        if (data.openidList) {
          this.openidList = data.openidList
        }
        if (data.wechatOpenIdList) {
          this.wechatOpenIdList = data.wechatOpenIdList
        }
        if (data.templateEditBeanList) {
          this.templateEditBeanList = data.templateEditBeanList
        }
        if (data.wechatTemplateId) {
          await this.fetchTemplateList()
          if (this.templateEditBeanList.length > 0 && this.iseditor) {
            this.templateLabelList = {}
            await this.templateEditBeanList.forEach(item => {
              const contentHtml = item.valueParamValue.replace(/\{([^}]+)\}/g, function() {
                return that.getDom(arguments[1])
              })
              this.$refs[item.valueParamKey][0].$el.innerHTML = contentHtml
            })
            console.log('templateEditBeanList', this.templateEditBeanList)
          }
        }
      }
    },

    // move from wechat template form
    handleTemplateChange(val, trigger) {
      const selectedTemplate = this.templateList.find(x => x.template_id === val)
      if (selectedTemplate && selectedTemplate.content) {
        this.form.tplmsg_source_id = selectedTemplate.id
        this.selectedTemplate = selectedTemplate
        if (trigger === 'change') {
          this.form.content = ''
        }
        this.$nextTick(() => {
          this.$refs.info.$refs.form.resetFields()
        })
      }
    },

    getFormPromise(form) {
      return new Promise(resolve => {
        form.validate(res => {
          resolve(res)
        })
      })
    }
  }

}
</script>
<style lang="less" scoped>
.template-message {
  // width: 750px;
  background: #fff;
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;

  .ml {
    margin-left: 10px;
  }

  .mb {
    margin-bottom: 10px;
  }

  .mb-l {
    margin-bottom: 20px;
  }

  .indent {
    padding-left: 130px;
  }

  .text-red {
    color: #f00;
  }

  .text-grey {
    color: #999;
  }

  .params-list {
    display: flex;
    flex-wrap: wrap;
    width: 433px;
  }

  .read-only {
    padding: 50px 30px 0px;

    & > p {
      display: flex;

      span {
        flex: 1;
      }
    }

    .term {
      display: flex;
      align-items: center;
      margin-bottom: 20px;

      &.top {
        align-items: flex-start;
      }

      p {
        margin-right: 10px;
        width: 120px;
        text-align: right;
      }
    }
  }

  ul {
    margin: 0;
    padding: 0;
    list-style: none;
  }

  p, div {
    box-sizing: border-box;
    list-style: none;
    text-decoration: none;
    outline: none;
    text-align: left;
    font-size: 14px;
  }

  & > section {
    padding: 10px 30px;
    flex: 1;
    overflow-x: hidden;
    overflow-y: auto;

    .term {
      display: flex;
      align-items: center;
      margin-bottom: 20px;

      &.top {
        align-items: flex-start;
      }

      & > ul {
        display: flex;
        flex: 1;
        flex-wrap: wrap;

        & > li {
          margin-right: 10px;
        }
      }

      p {
        margin-right: 10px;
        width: 120px;
        text-align: right;

        span {
          color: #FF0000;
        }
      }

      .new-member-notice {
        box-sizing: border-box;
        padding: 15px 20px;
        width: 433px;
        background: rgba(242, 242, 242, 1);

        .title {
          font-size: 12px;
          margin-bottom: 10px;
        }

        & > section {
          margin-bottom: 20px;

          .name {
            width: 100%;
            margin-bottom: 5px;
          }

          .wrap {
            box-sizing: border-box;
            padding: 2px;
            width: 100%;
            height: 72px;
            margin-bottom: 20px;
            background: #fff;
            border: 1px solid #ddd;
          }
        }
      }
    }

    .input {
      width: 50%;
    }

    .phone-tip {
      margin-top: -16px;
    }
  }

  & > .footer {
    display: flex;
    align-items: center;
    justify-content: center;
    // position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 50px;
    box-shadow: 0 -1px 5px 0 #ddd;
    background: #fff;

    button {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 97px;
      height: 36px;
      background: #fff;
      font-size: 12px;
      color: #999;
      margin-right: 15px;
      border: 1px solid #ddd;
      border-radius: 5px;

      &:nth-child(2) {
        background: #409eff;
        color: #fff;
        border: none;
      }
    }
  }

  .template-content {
    box-sizing: border-box;
    width: 50%;
    padding: 16px;
    background-color: #f6f6f6;

    & > p {
      margin: 0;
      line-height: 2;

      &.detail-link {
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
    }
  }

  .replyText {
    resize: none;
    color: #000;
    padding-left: 10px;
    width: 100%;
    height: 54px;
    background-color: #fff;
    -webkit-border-radius: 3px 3px;
    -moz-border-radius: 3px 3px;
    border-radius: 3px 3px;
    box-shadow: inset 0px 1px 2px #eee;
    border: 1px solid #eee;
    overflow-y: auto;
    padding-top: 8px;
    overflow-x: hidden;
    word-wrap: break-word;
    outline: none;

    input {
      outline: none;
      border: none;
      padding: 0;
      margin: 0 2px;
      outline: 0;
      color: inherit;
      line-height: 16px;
      font-family: inherit;
      text-align: center;
    }
  }

  .template-content {
    line-height: initial;

    p {
      margin: 0;
    }

    &.readonly {
      margin-bottom: 30px;

      .pickColor {
        display: none !important;
      }

      .replyText {
        height: auto !important;
        padding-left: 0 !important;
        box-shadow: none !important;
        border: none !important;
        background-color: transparent !important;
      }

      input {
        background-color: transparent !important;
      }

      p.pull-left,
      p.detail {
        margin-top: 20px;
      }
    }
  }

}
</style>
<style>
.el-input input {
  padding: 0 5px;
}

.phone-select .el-input__suffix {
  display: none;
}

.phone-dropdown {
  display: none;
}
</style>
