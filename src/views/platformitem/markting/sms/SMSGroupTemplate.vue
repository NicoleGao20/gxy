<template>
  <el-container v-loading="pageLoading" class="template-msg-container">
    <el-main class="template-msg">
      <el-row type="flex">
        <el-col>
          <el-form label-width="100px" :model="form" ref="form" :disabled="this.mode === 'view'">
            <el-form-item
              label="消息名称"
              prop="name"
              :rules="{
                message: '请输入消息名称',
                trigger: 'change',
                required: true,
              }"
            >
              <el-input
                v-model="form.name"
                placeholder="输入消息名称(用于标识短信，但不会作为内容发送)"
              />
            </el-form-item>
            <el-form-item label="目标用户" :rules="{ required: true }">
              <div>
                <el-radio v-model="form.targetType" :label="0"
                  >手工发送</el-radio
                >
                <el-radio v-model="form.targetType" :label="1"
                  >批量导入</el-radio
                >
                <el-radio v-model="form.targetType" :label="2"
                  >受众选择</el-radio
                >
              </div>
              <div>
                <el-form-item
                  v-if="form.targetType === 0"
                  prop="phoneNumbers"
                  :rules="{
                    message: '请输入手机号',
                    trigger: 'blur',
                    required: true,
                  }"
                >
                  <el-row
                    :gutter="10"
                    class="phoneNumberArea"
                  >
                    <el-col :span="14">
                      <el-input
                        type="textarea"
                        :rows="8"
                        v-model="form.phoneNumbers"
                      ></el-input>
                    </el-col>
                    <el-col :span="8">
                      限制10000行，输入内容格式：手机号，多行回车<br />
                      例：<br />
                      18686666688<br />
                      18688888888<br />
                      18688886668<br />
                      18686666888<br />
                    </el-col>
                  </el-row>
                </el-form-item>
                <el-row :gutter="20" v-if="form.targetType === 1">
                  <el-col :span="5">
                    <el-form-item
                    prop="fileUrl"
                    :rules="{
                      message: '请导入文件',
                      trigger: 'change',
                      required: true,
                    }">
                      <el-upload
                        ref="upload"
                        :show-file-list="true"
                        :auto-upload="true"
                        :limit="1"
                        :action="uploadUrl"
                        :before-upload="beforeUpload"
                        :on-success="uploadSuccess"
                        :on-error="()=>{uploadLoading = false}"
                        :on-change="changeFile"
                        :before-remove="beforeFileRemove"
                        :file-list="fileList"
                      >
                        <el-button size="small" type="primary" :loading="uploadLoading">导入</el-button>
                      </el-upload>
                    </el-form-item>
                  </el-col>
                  <el-col :span="5">
                    <el-button type="text" @click="download">下载模版</el-button>
                  </el-col>
                  <el-col :span="14">
                    限制10000行，导入内容格式：手机号<br />
                    案例：<br />
                    <img
                      src="/static/SMSGroupTemplate/example.png"
                      style="width: 100%"
                    />
                  </el-col>
                </el-row>
                <el-form-item
                  v-if="form.targetType === 2"
                  prop="audience"
                  :rules="{
                    message: '请选择受众',
                    trigger: 'change',
                    required: true,
                  }"
                >
                  <el-row>
                    <el-col>
                      <el-select
                        placeholder="请选择目标用户群"
                        size="medium"
                        v-model="form.audience"
                      >
                        <el-option
                          v-for="item in audienceOptions"
                          :key="item.id"
                          :label="item.group_name"
                          :value="item.id"
                        >
                        </el-option>
                      </el-select>
                    </el-col>
                    <p>受众人群数：{{form.audienceNum}}，有效用户数（有手机号）：{{form.audienceNumValid}}</p>
                  </el-row>
                </el-form-item>
              </div>
            </el-form-item>
            <el-form-item label="短信白名单">
              <el-checkbox :false-label="0" :true-label="1" v-model="form.isWhite"
                >勾选后，消息将同时发送至短信白名单手机号</el-checkbox
              >
            </el-form-item>
            <el-form-item label="扩展手机号" prop="exPhoneNumber" :rules="exPhoneRule">
              <el-input
                v-model="form.exPhoneNumber"
                placeholder="请输入扩展手机号，多个用分号隔开，输入后消息将同时发送至扩展手机号"
              />
            </el-form-item>
            <el-form-item label="触发类型">
              <el-radio v-model="form.triggerType" label="zd"
                >主动触发</el-radio
              >
              <el-radio v-model="form.triggerType" label="sj" disabled
                >事件触发</el-radio
              >
              <div>
                <el-row v-if="form.triggerType === 'zd'">
                  <el-row>
                    <el-col :span="5">
                      <el-radio v-model="form.proactiveType" label="lj"
                        >立即发送</el-radio
                      >
                    </el-col>
                    <el-col :span="5">
                      <el-radio v-model="form.proactiveType" label="ds"
                        >定时发送</el-radio
                      >
                    </el-col>
                  </el-row>
                  <el-row v-if="form.proactiveType === 'ds'">
                    消息将于
                    <el-date-picker
                      v-model="form.time"
                      type="datetime"
                      placeholder="选择日期时间"
                      :picker-options="pickerOptions"
                      value-format="yyyy-MM-dd HH:mm:ss"
                    >
                    </el-date-picker>
                    发送
                  </el-row>
                </el-row>
                <el-row v-if="form.triggerType === 'sj'">
                  <el-form-item label="选择事件">
                    <el-row :gutter="10" type="flex">
                      <el-col>
                        <el-form-item
                          :rules="{
                            message: '请选择事件类型',
                            trigger: 'change',
                            required: true,
                          }"
                          prop="eventType"
                        >
                          <el-select
                            v-model="form.eventType"
                            :disabled="onlyRead"
                            filterable
                            placeholder="请选择事件类型"
                            style="width: 100%"
                            @change="getEventListByType"
                          >
                            <el-option
                              v-for="(eventType, index) in eventTypes"
                              :key="index"
                              :label="eventType.eventTypeName"
                              :value="eventType.eventTypeCode"
                            />
                          </el-select>
                        </el-form-item>
                      </el-col>
                      <el-col>
                        <el-form-item
                          :rules="{
                            message: '请选择事件',
                            trigger: 'change',
                            required: true,
                          }"
                          prop="eventid"
                        >
                          <el-select
                            v-model="form.eventid"
                            :disabled="onlyRead"
                            filterable
                            placeholder="请选择事件"
                            style="width: 100%"
                            @change="changeEventFilterAttributes"
                            ref="eventName"
                          >
                            <el-option
                              v-for="(eventItem, index) in eventItems"
                              :key="index"
                              :label="eventItem.eventName"
                              :value="eventItem.metaTableId"
                              :disabled="eventItem.disabled"
                            />
                          </el-select>
                        </el-form-item>
                      </el-col>
                    </el-row>
                  </el-form-item>
                  <el-form-item
                    v-if="loadedDone && form.branches && form.branches.length"
                    label="事件条件"
                  >
                    <div
                      style="
                        padding-left: 15px;
                        padding-right: 15px;
                        padding-top: 15px;
                        background: #f4f6fa;
                        border: 1px solid #d8dce6;
                      "
                    >
                      <el-form-item
                        v-for="(branchItem, index) in form.branches"
                        :key="index"
                        label-width="0"
                        style="margin-bottom: 0"
                      >
                        <div
                          style="
                            position: relative;
                            padding-right: 30px;
                            margin-bottom: 15px;
                          "
                        >
                          <event-branch
                            :branch-item="branchItem"
                            :branch-conditions="branchConditions"
                            :only-read="onlyRead"
                            :branch-index="index"
                          />
                        </div>
                      </el-form-item>
                    </div>
                  </el-form-item>
                </el-row>
              </div>
            </el-form-item>
            <el-form-item
              label="短信模版"
              prop="smsTemp"
              :rules="{
                message: '请选择模版',
                trigger: 'change',
                required: true,
              }"
            >
              <el-select placeholder="请选择短信模版" v-model="form.smsTemp">
                <el-option
                  v-for="item in smsTemplateOptions"
                  :key="item.id"
                  :label="item.template_name"
                  :value="item.id"
                >
                </el-option>
              </el-select>
              <el-button
                type="primary"
                @click="
                  $router.push({
                    name: 'newSMSTemplate',
                    query: { before: $route.name },
                  })
                "
                >创建模版</el-button
              >
            </el-form-item>
            <el-form-item
              label="短信签名"
              prop="smsSign"
              :rules="{
                message: '请选择签名',
                trigger: 'change',
                required: true,
              }"
            >
              <el-select v-model="form.smsSign">
                <el-option
                  v-for="item in smsSignOptions"
                  :key="item.id"
                  :label="item.sign_name"
                  :value="item.sign_name"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="短信内容">
              <el-col :span="12">
                <el-input
                  ref="textarea"
                  type="textarea"
                  v-model="form.sureContent"
                  placeholder="选择模版后预览短信内容"
                  rows="6"
                  readonly
                ></el-input>
                <!-- <div style="margin-top:15px">
                  <el-select placeholder="请选择H5模板" v-model="form.h5">

                  </el-select>
                  <el-button type="primary">插入H5</el-button>
                </div> -->
                <el-form-item style="margin-top: 15px" v-if="showShortLink" :rules="{message: '请插入淘短链',required: true,}" prop="sureShortLink">
                  <el-row :gutter="5">
                    <el-col :span="12">
                      <el-input
                        placeholder="请输入淘短链"
                        v-model="form.shortLink"
                      ></el-input>
                    </el-col>
                    <el-col :span="5">
                      <el-button type="primary" @click="insertUrl"
                        >插入淘短链</el-button
                      >
                    </el-col>
                  </el-row>
                </el-form-item>
              </el-col>
            </el-form-item>
            <el-form-item label="测试发送" :error="testError">
              <el-row :gutter="10">
                <el-col :span="15">
                  <el-input placeholder="请输入测试手机号" v-model="form.testPhoneNumber"></el-input>
                </el-col>
                <el-col :span="5">
                  <el-button type="primary" @click="sendTest">发送</el-button>
                </el-col>
              </el-row>
            </el-form-item>
            <el-form-item label="短信过滤">
              <el-col :span="1.5">屏蔽</el-col>
              <el-col :span="4.5">
                <double-number-input name="天" :val="form.missDay" @inputValue="missDayValue"/>
              </el-col>
              <el-col :span="2.5">内发送过</el-col>
              <el-col :span="4.5">
                <double-number-input name="次" :val="form.missCount" @inputValue="missCountValue"/>
              </el-col>
              <el-col :span="5">营销短信的号码</el-col>
            </el-form-item>
          </el-form>
        </el-col>
        <el-col class="iphone-x-container" :span="14">
          <div class="device iphone-x">
            <!--    外部轮廓    -->
            <div class="frame">
              <div class="content">
                <div class="time">10:19</div>
              </div>
            </div>

            <!--    天线    -->
            <div class="stripe" />

            <!--    听筒孔    -->
            <div class="header">
              <div class="sensors" />
            </div>

            <!--    按键    -->
            <div class="btns" />
            <div class="power" />
          </div>
        </el-col>
      </el-row>

      <div class="form_footer">
        <el-form>
          <el-form-item label-width="100px">
            <el-button
              type="primary"
              v-if="mode !== 'view'"
              @click="handleSubmit"
              :loading="submitLoading"
              >立即创建</el-button
            >
            <el-button @click="$router.push({ name: 'smsMange' })">{{
              mode === "view" ? "返回" : "取消"
            }}</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-main>
  </el-container>
</template>

<script>
import {
  getEventTypeList,
  getEventListByType,
  getFilterAttributes,
  queryEventDefList,
  queryEventParamList,
} from "@/api/markting/event";
import { getCountsByGroupId } from '@/api/markting/vinpinsightGrouplist'
import { queryTemplateById } from "@/api/markting/SMSFunction"
import { queryAllTemplate, queryAllSign, addSmsTemplateGroup, getOneSmsGroupById, updateSmsById, sendTest } from "@/api/markting/SMSFunction";
import { getGroupListByCon } from "@/api/markting/vinpinsightGrouplist";
import eventBranch from "@/views/platformitem/markting/marketing/marketingSetting/coms/wechatTemplateEventBranch";
import { apiObj } from '@/config/getUrl.js'
import doubleNumberInput from "@/componentsMarketing/doubleNumberInput/doubleNumberInput"
import Cookies from 'js-cookie'

export default {
  components: {
    eventBranch,
    doubleNumberInput
  },
  mounted() {
    if (this.$route.query.mode) {
      this.mode = this.$route.query.mode
      this.id = this.$route.query.id
      getOneSmsGroupById({id:this.id}).then(({data})=>{
        this.form.name = data.sms_name
        this.form.isWhite = data.is_whitelist * 1
        this.form.smsSign = data.message_sign
        this.form.targetType = data.source_type * 1
        this.form.missDay = data.miss_days * 1
        this.form.missCount = data.miss_nums * 1
        if(data.mobile) this.form.phoneNumbers = data.mobile[0].mobile.join('\n')
        if(data.trigger_type !== 'sj'){
          this.form.triggerType = 'zd'
          this.form.proactiveType = data.trigger_type
        }else{
          this.form.triggerType = 'sj'
        }
        this.form.time = data.trigger_time
        if(data.extend_mobile) this.form.exPhoneNumber = data.extend_mobile.join(';')
        if(data.group_id) this.form.audience = data.group_id * 1
        if(data.short_chain){
          this.responseShortUrl = data.short_chain
        }
        this.$nextTick(()=>{
          this.form.smsTemp = data.message_template * 1
        })
      })
    }
    this.getEventTypeList();
    getGroupListByCon({ status: "started" }).then(({ data }) => {
      this.audienceOptions = data.list;
    });
    queryAllTemplate({ status: 1, dx_status:'sms' }).then(({ data }) => {
      this.smsTemplateOptions = data;
    });
    queryAllSign({ status: 1, dx_status:'sms' }).then(({ data }) => {
      this.smsSignOptions = data
      if(!this.mode){
        data.forEach(item=>{
          if(item.is_default === 'Y') this.form.smsSign = item.sign_name
        })
      }
    });
  },
  data() {
    var exPhoneRule = (rule, value, callback) => {
      if(value === "") callback();
      else if (value && /^1[0-9][0-9]{9}(;1[0-9][0-9]{9})*$/.test(value)) {
        callback();
      } else {
        callback(new Error('手机号格式不正确且不应以分号结尾'));
      }
    }
    return {
      mode: "",
      id:"",
      pageLoading: false,
      uploadUrl:`${apiObj.uploadOss}/SMSGroup`,
      showShortLink:false,
      uploadLoading:false,
      submitLoading:false,
      fileList:[],
      exPhoneRule:{ validator: exPhoneRule, trigger: 'blur' },
      comeOnce:true,
      responseShortUrl:'',
      form: {
        name: "",
        audience: "",
        targetType: 0,
        phoneNumbers: "",
        exPhoneNumber: "",
        testPhoneNumber:"",
        triggerType: 'zd',
        proactiveType: 'lj',
        time: null,
        eventType: "",
        smsTemp: "",
        smsSign: "",
        content: "",
        sureContent:"",
        shortLink:"",
        sureShortLink:"",
        missDay:7,
        missCount:1,
        fileUrl:"",
        isWhite:0,
        audienceNum:0,
        audienceNumValid:0,
        // copy from event select
        eventid: "",
        branches: [],
      },
      testError:"",
      audienceOptions: [], //选择用户群选项
      smsTemplateOptions: [],
      smsSignOptions: [],
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7;
        },
      },
      // copy from event select
      loadedDone: true,
      onlyRead: false,
      eventTypes: [],
      eventItems: [],
      branchConditions: [],
    };
  },
  methods: {
    download(){
      window.open('https://auth-setting.oss-cn-shanghai.aliyuncs.com/SMSGroup/ed511fb25c864059b4f2f20dcdb976c7.xlsx','__self')
    },
    getEventListByType() {
      this.eventItems = [];
      this.form.eventid = "";
      if (this.form.eventType) {
        getEventListByType({ eventTypeCode: this.form.eventType }).then(
          (res) => {
            this.eventItems = (res.data && res.data.list) || [];
          }
        );
      }
    },
    changeEventFilterAttributes() {
      this.form.branches = [];
      this.getFilterAttributes(this.addBranch);
    },
    addBranch() {
      if (this.form.branches.length >= 9) {
        this.$message({
          type: "error",
          message: "最大支持9个分支",
        });
        return;
      }

      var tempBranch = {
        branch_name: "",
        event: [],
      };

      for (var i = 0; i < this.branchConditions.length; i++) {
        var temp = {};
        temp.column_name = this.branchConditions[i].column_name;
        temp.column_value = "";
        temp.meta_column_id = this.branchConditions[i].meta_column_id;
        temp.column_value_type = "field";
        // 对于上传门店,需要将column_value 设置为对应的表
        tempBranch.event.push(temp);
      }

      this.form.branches.push(tempBranch);
    },
    getEventTypeList() {
      getEventTypeList().then((res) => {
        if (res && res.data && res.data.list) {
          this.eventTypeList = res.data.list;
          this.eventTypes = (res.data && res.data.list) || [];
        }
      });
    },
    getFilterAttributes(cb) {
      if (this.form.eventid) {
        getFilterAttributes({ metaTableId: this.form.eventid }).then((res) => {
          if (res.data) {
            this.branchConditions = res.data.list || [];
            if (cb) {
              cb();
            }
          }
        });
      }
    },
    getEventNameList(val) {
      console.log("event name list", val);
      const queryObject = {
        current: 1,
        page_size: 9999,
        business_type: val,
      };
      queryEventDefList(queryObject).then((res) => {
        if (res && res.data && res.data.list) {
          this.eventNameList = res.data.list;
        }
      });
    },
    getEventConditionList(val) {
      const queryObject = {
        current: 1,
        page_size: 9999,
        id: val,
      };
      queryEventParamList(queryObject).then((res) => {
        if (res && res.data && res.data.list) {
          this.eventConditionList = res.data.list;
          console.log("event condition list", this.eventConditionList);
        }
      });
    },
    handleSubmit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.submitLoading = true
          let obj = {
            sms_name:this.form.name,
            message_template:this.form.smsTemp,
            message_sign:this.form.smsSign,
            miss_days:this.form.missDay,
            miss_nums:this.form.missCount,
            source_type:this.form.targetType,
            is_whitelist:this.form.isWhite
          }
          if(this.form.targetType === 0){
            obj.mobile = this.form.phoneNumbers.split('\n')
          }else if(this.form.targetType === 1){
            obj.url = this.form.fileUrl
          }else if(this.form.targetType === 2){
            obj.cnt_audience = this.form.audienceNum
            obj.cnt_audience_valid = this.form.audienceNumValid
            obj.group_id = this.form.audience
          }
          if(this.form.exPhoneNumber) obj.extend_mobile = this.form.exPhoneNumber.split(';')
          if(this.form.triggerType === 'zd'){
            obj.trigger_type = this.form.proactiveType
            if(this.form.proactiveType === 'ds') obj.trigger_time = this.form.time
          }else if(this.form.triggerType === 'sj'){
            obj.trigger_type = 'sj'
            obj.event_type = this.form.eventType
            obj.event_name = this.$refs['eventName'].$refs['reference'].nativeInputValue
            obj.event_id = this.form.eventid
            
          }
          if(this.form.sureShortLink) obj.short_chain = this.form.sureShortLink
          if(this.mode === 'edit') {
            obj.id = this.id
            updateSmsById(obj).then(()=>{
              this.submitLoading = false
              this.$message.success('修改成功')
              setTimeout(()=>{
                this.$router.push({ name: 'smsMange' })
              },2000)
            }).catch(()=>{
              this.submitLoading = false
            })
          }else{
            addSmsTemplateGroup(obj).then(()=>{
              this.submitLoading = false
              this.$message.success('添加成功')
              setTimeout(()=>{
                this.$router.push({ name: 'smsMange' })
              },2000)
            }).catch(()=>{
              this.submitLoading = false
            })
          }
          

        } else {
          return false;
        }
      });
    },
    insertUrl() {
      if (this.form.shortLink) {
        if (!/(http|https):\/\/([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?/.test(this.form.shortLink)) {
          this.$message("请输入正确的淘短链")
        }else{
          var reg = /{([^{}]+)}/g
          this.form.sureContent = this.form.content.replace(reg,(match,p1)=>{
            if(p1 === '淘短链'){
              return `{${this.form.shortLink}}`
            }else{
              return `{${p1}}`
            }
          })
          this.form.sureShortLink = this.form.shortLink
        } 
      } else {
        this.$message("请输入淘短链");
      }
    },
    insertUrlOnce(value){
      console.log('只触发一次的插入淘短链')
      var reg = /{([^{}]+)}/g
      this.form.sureContent = this.form.content.replace(reg,(match,p1)=>{
        if(p1 === '淘短链'){
          return `{${value}}`
        }else{
          return `{${p1}}`
        }
      })
      this.form.sureShortLink = value
    },
    sendTest(){
      if(this.form.testPhoneNumber && /^1[0-9][0-9]{9}$/.test(this.form.testPhoneNumber)){
        this.testError = ""
        let flag = true
        this.$refs.form.validateField(['smsTemp','smsSign','sureShortLink'],(error) => {
          if(error) flag = false
        })
        if(flag){
          let obj = {
            message_template:this.form.smsTemp,
            message_sign:this.form.smsSign,
            mobile:this.form.testPhoneNumber
          }
          if(this.form.sureShortLink) obj.short_chain = this.form.sureShortLink
          sendTest(obj).then(()=>{
            this.$message.success('发送成功')
          })
        }
      }else{
        this.testError = "请正确输入手机号"
      }
    },
    missDayValue(val){
      this.$set(this.form,'missDay',val)
    },
    missCountValue(val){
      this.$set(this.form,'missCount',val)
    },
    beforeUpload(){
      this.uploadLoading = true
    },
    uploadSuccess(res){
      if(res.code == 0){
        this.uploadLoading = false
        this.form.fileUrl = res.body.url
        this.$message.success('导入成功')
      }else{
        this.$refs.upload.clearFiles()
        this.fileList = []
      }
    },
    changeFile(file,fileList){
      this.fileList = fileList
    },
    beforeFileRemove(file,fileList){
      this.form.fileUrl = ''
      this.fileList = fileList
    }
  },
  watch: {
    "form.phoneNumbers": {
      handler(val) {
        this.form.phoneNumbers = val.split("\n").slice(0, 10000).join("\n");
      },
    },
    "form.smsTemp": {
      handler(id) {
        queryTemplateById({id}).then(({data})=>{
          this.form.content = data.template_content_cn
          this.form.sureContent = data.template_content_cn
          this.form.sureShortLink = ''
          if(/(?={淘短链})/.test(data.template_content_cn)) this.showShortLink = true
          else this.showShortLink = false
          if(this.mode === 'view' && this.mode === 'edit' && this.comeOnce && this.responseShortUrl) {
            this.insertUrlOnce(this.responseShortUrl)
          }
          this.comeOnce = false
        })
      }
    },
    "form.audience": {
      handler(groupId){
        getCountsByGroupId({
          groupId,
          brand_code: Cookies.get('brandCode'),
          idType: 'phone_bind'
        }).then(({data})=>{
          this.form.audienceNum = data.total
          this.form.audienceNumValid = data.phone_bind_total
        }).catch(()=>{
          this.form.audienceNum = 0
          this.form.audienceNumValid = 0
        })
      }
    }
  }
};
</script>

<style lang="less" scoped>
.template-msg-container {
  padding: 20px;
  width: 100%;
  min-height: 100%;

  .template-msg {
    width: 100%;
    min-height: 100%;
    background-color: #fff;
  }

  .footer {
    margin-left: 100px;
  }

  .phoneNumberArea{
    line-height: 20px; 
    padding-top: 30px
  }
}
</style>
