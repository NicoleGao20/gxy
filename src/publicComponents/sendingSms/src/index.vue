<template>
  <div class="sms-container">
    <div class="content">
      <section>
        <div class="generate">
          <span class="m-r">
            <em>*</em>
            {{language.smsTemplate}}
          </span>
          <el-select :disabled="beData.readOnly"   v-model="beData.signCode" placeholder="请选择">
            <el-option
              v-for="item in smsTemplate"
              :key="item.id"
              :label="item.template_name"
              :value="item.id">
            </el-option>
          </el-select>
        </div>
        <header >
          <div class="generate">
            <span class="m-r">
              <em>*</em>
              {{language.smsTitle}}
            </span>
            <el-select :disabled="beData.readOnly" @change="changeSmsSign" v-model="beData.signCode" placeholder="请选择">
              <el-option
                v-for="item in signOptions"
                :key="item.id"
                :label="item.sign_name"
                :value="item.id">
              </el-option>
            </el-select>
          </div>
        </header>
        <!-- <div class="sel-line" v-if="!beData.readOnly">
          <span class="m-r">{{language.line.name}}</span>
          <ul>
            <li v-for="(item,index) in parameter" :key="index" :style="{'pointer-events': beData.readOnly ? 'none' : ''}">
              <AddParamBtn :btnName="item.paramKey" :onadd="onaddData"/>
            </li>
          </ul>
        </div> -->
        <div class="sms-content">
          <span class="m-r"> <em>*</em>{{language.smsContent.name}}</span>
          <div class="sms-input">
            <div class="el-textarea__inner">
               <Editable :contenteditable="!beData.readOnly" :editable-textarea.sync="beData.textarea" :placeholder="language.smsContent.placeholder" :maxNum="350"/>
            </div>
            <p>
              {{language.billingPrompt[0]}}<span class="number">{{beData.textarea.length}}</span>{{language.billingPrompt[1]}}<span class="number">{{ smsCount }}</span>{{language.billingPrompt[2]}}
              <span class="rule">
                {{language.smsContent.ruleName}}
                <div class="des">
                  {{language.smsContent.ruleName}}
                  <ul>
                    <li v-for="(item, index) in language.smsContent.ruleContent" :key="index">{{item}}</li>
                  </ul>
                </div>
              </span>
            </p>
          </div>
        </div>
        <div v-if="!beData.readOnly" class="sms-content ">
          <span class="m-r m-t">{{language.shortLinks.name}}</span>
          <el-input class="input" v-model="url" placeholder="" />
          <Control  :name="language.shortLinks.button"  beClass="be-button" @onclick="handleGenerateLink" title=""/>
        </div>
        <div class="generate" v-if="!beData.readOnly">
          <span class="m-r">{{language.preview.name}}</span>
          <el-select
              v-model="phoneList"
              multiple
              filterable
              allow-create
              default-first-option
              placeholder="多个手机号请按 回车键 进行分隔"
              class="phone-select"
              style="width: 70%;"
              popper-class="phone-dropdown"
            >
              <el-option
                v-for="item in phoneOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
          </el-select>
          <Control  :name="language.preview.button"  beClass="be-button" @onclick="tryInphoneSms" title=""/>
        </div>
        <div v-if="!beData.readOnly" class="padding-left m-t">{{ language.preview.tip }}</div>
      </section>
    </div>
  </div>
</template>
<script type="text/javascript">
import Control from '../components/ControlAndData.vue'
import AddParamBtn from '../components/AddParamBtn.vue'
import Zh from '../zh.json'
import getcursorpos from '../utils/getcursorpos.js'
// import extractText from '../utils/extractText.js'
import Editable from '../components/Editable'
export default {
  name: 'Belle',
  components: {
    Control,
    Editable,
    AddParamBtn
  },
  props: {
    languageWhat: { // 中英文字段
      type: String,
      default: 'zh'
    },
    beData: {
      type: Object,
      default () {
        return {
          signCode: 'TS',
          smsSign: '',
          groupId: '', // 场景id
          brandCode: 'TS',
          zIndex: 100,
          readOnly: false,
          textarea: '', // 输入的内容
          templateParamList: [], // 参数列表
          useUrlList: [],
          context: ''// 最终传给后台得短信内容
        }
      }
    }
  },
  mounted () {
    this.fetchSmsTemplate()
    // this.getparameter()
    // this.getLinkList()
    this.fetchSignList()
  },
  watch: {
    // 监听手机号变化进行正则判断
    phoneList (newV, oldV) {
      if (oldV.length !== newV.length) {
        if (!(/^1[34578]\d{9}$/.test(newV[newV.length - 1])) && newV.length !== 0) {
          this.inphoneError = true
          this.$message({
            message: `手机号不正确`,
            type: 'warning'
          })
        } else {
          this.inphoneError = false
        }
      }
    },
    'beData.textarea' (newV, oldV) {
      var reg = /{([^{}]+)}/g
      var tempArr = []
      var matched
      this.dynamicItems = []
      this.beData.templateParamList = []
      while ((matched = reg.exec(newV))) {
        this.dynamicItems.push(matched[1])
      }
      console.log(this.dynamicItems, this.parameter, 999)
      // 添加插入参数列表
      // for (var i = 0; i < this.parameter.length; i++) {
      //   if (this.dynamicItems.indexOf(this.parameter[i].paramKey) > -1) {
      //     if (!tempArr.find(res => res.paramKey === this.parameter[i].paramKey)) {
      //       tempArr.push(this.parameter[i])
      //     }
      //   }
      // }
      // 移除删除的链接数据
      if (this.dynamicItems.length !== 0) {
        const arr = []
        this.beData.useUrlList.forEach(element => {
          if (!this.dynamicItems.find(res => res === element.displayName)) {
            for (let index = 0; index < this.beData.useUrlList.length; index++) {
              const nv = this.beData.useUrlList[index]
              if (nv.displayName === element.displayName) {
                arr.push(index)
                break
              }
            }
          }
        })
        for (let index = 0; index < arr.length; index++) {
          const element = arr[index]
          this.urlList.push(this.beData.useUrlList[element])
          this.beData.useUrlList.splice(element, 1)
        }

        this.dynamicItems.forEach(element => {
          if (!this.beData.useUrlList.find(res => res.displayName === element)) {
            for (let index = 0; index < this.beData.useUrlList.length; index++) {
              const nv = this.beData.useUrlList[index]
              if (nv.displayName === element) {
                this.urlList.push(nv)
                this.beData.useUrlList.split(index, 1)
                break
              }
            }
          }
        })
      } else {
        this.urlList = this.urlList.concat(this.beData.useUrlList)
        this.beData.useUrlList = []
      }

      this.beData.templateParamList = tempArr.concat(this.beData.useUrlList)
      console.log(this.beData.templateParamList, 990)
      // 计算短信数量
      this.smsCount = this.beData.textarea.length > 70 ? Math.ceil((this.beData.textarea.length - 70) / 67) + 1 : Math.ceil(this.beData.textarea.length / 70)
      // 把插入的短链处理成传给后端的key
      this.beData.context = this.beData.textarea
      if (this.beData.useUrlList.length > 0) {
        this.beData.useUrlList.forEach(element => {
          this.beData.context = this.beData.context.replace(element.displayName, element.paramKey)
        })
      }
    }
  },
  data () {
    return {
      smsTemplate:[],
      signOptions: [],
      phoneList: [],
      deviceList: [],
      phoneOptions: [],
      language: Zh,
      inphoneError: true,
      parameter: [],
      urlList: [], // 预先获取可插入链接列表
      url: '', // 用户输入的链接
      smsCount: 1 // 多少条短信
    }
  },
  methods: {
    // 短信模版
    async fetchSmsTemplate () {
      const { data } = await this.$request2({
        url: '/smsTemplate/list',
          // url: '/component/system/smsSigns',
        params: {
          dx_status: 'sms'
        }
      })
      console.log(data,'data')
      this.smsTemplate = data ? data : []
    },
    // 获取签名
    async fetchSignList () {
      const { data } = await this.$request2({
        url: '/smsSign/list',
          // url: '/component/system/smsSigns',
        params: {
          dx_status: 'sms'
        }
      })
      this.signOptions = data ? data : []
    },
    // 获取短链集合
    async getLinkList () {
      const { data } = await this.$request({
        url: '/message/params/getUrlParam'
      })
      this.urlList = data.list
    },
    // 短信签名
    changeSmsSign () {
      const data = this.signOptions.find(res => res.brand_code === this.beData.signCode)
      this.beData.smsSign = data.smsSign
    },
    // 生成短链
    async handleGenerateLink () {
      if (!this.url || this.url === '') {
        this.$message({
          message: '请输入链接',
          type: 'warning'
        })
        return
      }
      // if (!/(http|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?/.test(this.url)) {
      if (!/(http|https):\/\/([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?/.test(this.url)) {
        this.$message({
          message: '链接格式不正确',
          type: 'warning'
        })
        return
      }
      const se = window.getSelection()
      if (!se.focusNode.isContentEditable && !se.focusNode.parentNode.isContentEditable) {
        this.$message({
          message: '请先点击“短信内容”输入框，然后再点击短链进行插入',
          type: 'warning'
        })
        return
      }
      // if (this.urlList.length === 0) {
      //   this.$message({
      //     message: '没有更多链接资源可用，请联系管理人员',
      //     type: 'warning'
      //   })
      //   return
      // }
      this.urlList[0].longUrlValue = this.url
      this.beData.useUrlList.push(this.urlList[0])
      this.shortUrl = this.urlList[0].displayName
      this.urlList.splice(0, 1)
      this.onaddData(this.shortUrl, 1)
    },
    // 外部点击确认按钮时候调用 检查内容是否有值
    onExamine () {
      if (!this.beData.signCode) {
        this.$message({
          message: `选择短信签名`,
          type: 'warning'
        })
        return
      }
      if (this.beData.textarea === '请输入内容' || !this.beData.textarea) {
        this.$message({
          message: `请输入内容`,
          type: 'warning'
        })
        return false
      }
      return true
    },
    // 获取插入参数
    getparameter () {
      this.$request2({
        url: `/component/system/scenes?sceneId=${this.beData.sceneId}`,
        method: 'get'
      }).then(res => {
        this.parameter = res.data.list
      })
    },
    // 测试发送
    async tryInphoneSms () {
      if (this.phoneList.length === 0) {
        this.$message({
          message: `请输入手机号`,
          type: 'warning'
        })
        return
      }
      if (this.inphoneError) {
        this.$message({
          message: `手机号不正确`,
          type: 'warning'
        })
        return
      }
      if (!this.onExamine()) {
        return
      }
      let str = []
      let context = this.beData.textarea
      if (this.beData.useUrlList.length > 0) {
        // 获取真实短链
        this.dynamicItems.forEach(element => {
          const reslute = this.beData.useUrlList.find(res => res.displayName === element)
          if (reslute) {
            str.push(reslute.longUrlValue)
          }
        })

        await this.$request({
          url: '/U/batchShort',
          method: 'post',
          data: {
            'eventId': Date.parse(new Date()),
            'urlList': str
          }
        }).then(res => {
          res.data.list.forEach(element => {
            const obj = this.beData.useUrlList.find(res => res.longUrlValue === element.longUrl)
            if (obj) {
              obj.shortUrl = element.shortUrl
            }
          })
        })
        // 替换短信内容上的短链
        this.beData.useUrlList.forEach(element => {
          context = context.replace('{' + element.displayName + '}', element.shortUrl)
        })
      }

      // const signItem = this.signOptions.find(item => item.brandCode === this.signCode)
      this.$request2({
        url: '/component/system/sendTestShortMessage',
        method: 'POST',
        data: { data: JSON.stringify({
          smsSign: this.beData.smsSign,
          smsType: '1',
          contextText: context,
          paramList: this.beData.templateParamList ? this.beData.templateParamList : [],
          phoneList: this.phoneList
        })
        }
      })
    },
    // 插入参数按钮
    onaddData (data, islink) {
      const width = this.createDom(data)
      const word = islink ? `( {${data}} )` : `{${data}}`
      const dom = `<input type="text" style="display:inline-block;border:none;color:#0a8ddf;width:${width}px;text-align:center"  class="sms-add-value" value="${word}" readonly/>`
      getcursorpos(dom)
    },
    createDom (data) {
      // 创建节点
      var sbox = document.createElement('span')

      // 设置节点id
      sbox.id = 'lswtColse'

      // 设置节点属性
      sbox.style.top = '-100000px'
      sbox.style.right = '0px'
      sbox.style.fontSize = '12px'
      sbox.style.position = 'absolute'
      sbox.innerHTML = `{ ${data} }`
      document.body.appendChild(sbox)
      return sbox.offsetWidth + 20
    }
  }
}

</script>
<style  lang="less" scoped>
* {
    box-sizing: border-box;
    margin: 0;
    list-style-type: none;
    text-decoration: none;
    outline: none;
    text-align: left;
    font-size: 14px;
  }
.sms-container {
  padding-bottom: 15px;
  .m-t {
    margin-top: 10px;
  }
  .m-r {
    display: inline-block;
    margin-right: 10px;
    width: 90px;
    text-align: right;
  }
  .padding-left {
    margin-left: 102px;
  }
  em {
    color:#f40435;
    margin-right:3px;
  }
  .read-only {
    &>div {
      display: flex;
      justify-content: flex-start;
      margin-bottom: 25px;
      span {
        width: 100px;
        text-align: right;
        margin-right:  10px;
      }
      p {
        flex: 1;
      }
    }
  }
  .go-on-title {
    display: inline-block;
    width: 70px;
    text-align: right;
    font-size: 12px;
    margin-right: 20px;
  }
  .content {
    width: 100%;
    height:100%;
    background: #fff;
    border-radius: 4px;
    .error {
      padding-left: 80px;
      margin-top: 5px;
      color: #f40435;
      font-size: 14px;
    }
    &> section {
      box-sizing: border-box;
      width: 100%;
      &>header {
        box-sizing: border-box;
        display: flex;
        // justify-content: space-between;
        align-items: center;
        width: 100%;
        font-size: 14px;
        margin-bottom: 20px;
      }
      .sel-line {
        position: relative;
        display: flex;
        // align-items: center;
        text-align: left;
        &>span {
          margin-right: 10px;
        }
        i {
          position: relative;
          margin:0 15px 0 5px;
          line-height: 23px;
          &:hover {
            &>.tip {
              display: flex;
            }
          }
          .tip {
            display: none;
            position: absolute;
            top: 31px;
            left: 0;
            align-items: center;
            justify-content: center;
            width: 370px;
            height:43px;
            background: #eee;
            font-size: 14px;
          }
        }
        & > ul {
          display: flex;
          flex: 1;
          flex-wrap: wrap;
          padding:0;
          &>li {
            margin-right:10px;
            margin-bottom: 10px;
          }
        }

      }
     .sms-content {
        display: flex;
        margin-top: 20px;
        flex-wrap: wrap;
        &.v-center {
          align-items: center;
        }
        &.block {
          display: block;
        }
        .sms-input {
          width: 519px;
          .sms-add-value {
            display: inline-block;
            border: none;
          }
          .el-textarea__inner {
            display: block;
            width:100%;
            height: 219px;
            padding: 6px 10px;
            border: 1px solid #ddd;
            border-radius: 4px 4px 0 0;
            box-sizing: border-box;
            resize: none;
            font-size: 14px;
          }
          p {
            box-sizing: border-box;
            width: 100%;
            height: 44px;
            margin: 0;
            padding-right: 30px;
            font-size: 12px;
            color: #aaa;
            text-align: right;
            border: 1px solid #ddd;
            border-top: 0;
            border-radius: 0 0 4px 4px;
            line-height: 44px;
            .rule {
              position: relative;
              margin-left: 15px;
              color:#366CB3;
              &:hover {
                &> .des {
                  display: block;
                }
              }
              .des {
                display: none;
                position: absolute;
                bottom: 20px;
                right: 0px;
                width: 413px;
                height: 200px;
                padding-left: 10px;
                border: 1px solid #ddd;
                font-size: 14px;
                color: #333;
                background: #fff;
                ul {
                  padding: 0;
                  li {
                    margin-bottom: 5px;
                    font-size: 12px;
                    line-height: 14px;
                  }
                }
              }
            }
          }
        }
        .input {
          width: 300px;
          margin-right: 10px;
        }
        .btn-sm {
          padding: 5px 10px;
        }
        .shortUrl {
          margin: 5px 0 0 70px;
          width: 400px;
        }
     }
      .generate {
        display: flex;
        margin-top: 20px;
        align-items: center;
        \deep\ .el-select-dropdown__item {
          padding: 0 10px;
        }
        .el-input {
          width: 252px;
          height: 100%;
        }
      }
    }
    .be-button {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 87px;
      height: 36px;
      padding: 5px 15px;
      border-width: 1px;
      border-style: solid;
      border-color: rgba(179, 216, 255, 1);
      border-radius: 4px;
      font-family: '微软雅黑';
      font-weight: 400;
      font-style: normal;
      font-size: 12px;
      color: #366CB3;
      margin-left: 20px;
      background-color: rgba(236, 245, 255, 1);
    }
    .footer {
      display: flex;
      justify-content: center;
      margin-top: 30px;
      .button {
        cursor: pointer;
        display: flex;
        justify-content: center;
        align-items: center;
        width: 97px;
        height: 41px;
        margin-right: 30px;
        text-align: center;
        border-radius: 5px;
      }
      .cancel-btn {
        border: 1px solid #ddd;
      }
      .ok {
        border-width: 1px;
        border-style: solid;
        border-color: rgba(179, 216, 255, 1);
        border-radius: 4px;
        font-family: '微软雅黑';
        font-weight: 400;
        font-style: normal;
        font-size: 12px;
        color: #366CB3;
        margin-left: 20px;
        background-color: rgba(236, 245, 255, 1);
      }
    }
  }
}
</style>
