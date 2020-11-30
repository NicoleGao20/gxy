<template>
  <div class="belle-sms-container">
    <div class="content">
      <header>
        {{ lanuage.title }}
        <i class="el-icon-close"/>
      </header>
      <section v-if="iseditor">
        <div class="sel-line">
          {{ lanuage.line.name }}
          <i class="el-icon-question">
            <span class="tip">
              {{ lanuage.line.tip }}
            </span>
          </i>
          <ul>
            <li>
              <AddParamBtn :onadd="onaddData" btn-name="品牌"/>
            </li>
            <li>
              <AddParamBtn :onadd="onaddData" btn-name="姓名"/>
            </li>
          </ul>
        </div>
        <div class="sms-content">
          {{ lanuage.smsContent.name }}：
          <div class="sms-input">
            <div class="el-textarea__inner">
              <Editable ref="smsInput" :placeholder="lanuage.smsContent.placeholder" :max-num="20"/>
            </div>
            <p>
              共122字(包含签名和退订回复)，计费2条。 0.04元/条
              <span>
                {{ lanuage.smsContent.ruleName }}
                <div class="des">
                  {{ lanuage.smsContent.ruleName }}
                  <ul>
                    <li v-for="(item, index) in lanuage.smsContent.ruleContent" :key="index">{{ item }}</li>
                  </ul>
                </div>
              </span>
            </p>
          </div>
        </div>
        <div class="generate">
          {{ lanuage.shortLinks.name }}：
          <el-input v-model="shortLink" :placeholder="lanuage.shortLinks.placeholder" @focus="onlinkFocus"/>
          <button @click="onGenerate()">{{ lanuage.shortLinks.button }}</button>
        </div>
        <p v-show="errorShow" class="error">{{ lanuage.shortLinks.errorTip }}</p>
        <div class="generate">
          {{ lanuage.preview.name }}：
          <el-input v-model="inphone" :placeholder="lanuage.preview.placeholder" @focus="()=>{inphoneError = false}"/>
          <Control>
            <template slot="button">
              <button @click="tryInphoneSms">{{ lanuage.preview.button }}</button>
            </template>
          </Control>
        </div>
        <p v-show="inphoneError" class="error">{{ lanuage.preview.errorTip }}</p>
      </section>
      <div v-if="iseditor" class="footer">
        <el-button size="medium" @click="closeDialog()">{{ lanuage.cancelBtn }}</el-button>
        <el-button type="primary" size="medium" @click="getData()">{{ lanuage.confirmBtn }}</el-button>
      </div>
      <div v-if="!iseditor" class="read-only">
        <p>
          {{ lanuage.noeditor.name }}：
          <span>
            尊贵的金卡会员，5与伦比，会员抢先1步！东莞汇一城添柏岚五一期间，金卡会员独家尊享8.8折，等你来参与。退订回复TD
          </span>
        </p>
        <div class="compute-num">共64字（包含签名和退订回复）计费1条，0.04元/条</div>
      </div>
    </div>
  </div>
</template>
<script type="text/javascript">
import Control from '../TriggerSMS/ControlAndData'
import AddParamBtn from '../TriggerSMS/AddParamBtn.vue'
import Zh from '../../utils/zh.json'
import getcursorpos from '../../utils/getcursorpos.js'
import Editable from '../TriggerSMS/Editable.vue'

export default {
  name: 'Belle',
  components: {
    Control,
    Editable,
    AddParamBtn
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    language: {
      type: String,
      default: 'zh'
    },
    onresult: {
      type: Function,
      default() {
        return () => {
        }
      }
    },
    iseditor: {
      type: Boolean,
      default() {
        return true
      }
    }
  },
  data() {
    return {
      shortLink: '',
      inphone: '',
      textarea: '',
      lanuage: Zh,
      errorShow: false,
      inphoneError: false
    }
  },
  methods: {
    onlinkFocus() {
      this.errorShow = false
    },
    onmousedown(e) {
      // 现代浏览器阻止默认事件
      if (e && e.preventDefault) {
        e.preventDefault()
      } else {
        window.event.returnValue = false
      }
      return false
    },
    tryInphoneSms() {
      if (!(/^1[34578]\d{9}$/.test(this.inphone))) {
        this.inphoneError = true
        return
      }
      this.$emit('tryInphoneSms', this.inphone)
    },
    onGenerate() {
      if (/.*[\u4e00-\u9fa5]+.*$/.test(this.shortLink)) {
        this.errorShow = true
      } else {
        this.onaddData(this.shortLink, 1)
      }
    },
    onaddData(data, islink) {
      const traget = this.$refs.smsInput.innerHTML
      if (traget === this.lanuage.smsContent.placeholder) {
        this.$refs.smsInput.innerHTML = ''
      }
      const width = islink ? data.length * 9 : data.length * 18
      const word = islink ? data : `{${data}}`
      const dom = `<input type="text" style="display:inline-block;border:none;color:#0a8ddf;width:${width}px;text-align:center"  class="sms-add-value" value="${word}" readonly/>`
      getcursorpos(dom)
    },
    getData() {
      const dom = this.$refs.smsInput.childNodes
      let result = ''
      dom.forEach(element => {
        if (element.tagName) {
          result += element.value
        } else {
          result += element.textContent
        }
      })
      this.onresult(result)
    },
    closeDialog() {
      this.visible = false
    }
  }
}

</script>
<style lang="less" scoped>
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  list-style-type: none;
  text-decoration: none;
  outline: none;
  text-align: left;
  font-size: 14px;
}

.belle-sms-container {
  display: flex;
  align-items: center;
  justify-content: center;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, .1);

  .read-only {
    padding: 50px 30px 0px;

    & > p {
      display: flex;

      span {
        flex: 1;
      }
    }

    & > div {
      margin-top: 50px;
      color: #ddd;
      font-size: 14px;
    }
  }

  .content {
    width: 857px;
    max-height: 722px;
    background: #fff;
    border-radius: 4px;
    padding-bottom: 30px;

    .error {
      padding-left: 80px;
      margin-top: 5px;
      color: #f40435;
      font-size: 14px;
    }

    & > header {
      box-sizing: border-box;
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
      padding: 10px;
      border-bottom: 1px solid #ccc;
      font-size: 18px;
    }

    & > section {
      box-sizing: border-box;
      width: 100%;
      padding: 50px 30px;

      .sel-line {
        position: relative;
        display: flex;
        // align-items: center;
        text-align: left;

        i {
          position: relative;
          margin: 0 15px 0 5px;
          line-height: 23px;

          &:hover {
            & > .tip {
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
            height: 43px;
            background: #eee;
            font-size: 14px;
          }
        }

        & > ul {
          display: flex;
          flex: 1;
          flex-wrap: wrap;

          & > li {
            margin-right: 10px;
          }
        }

      }

      .sms-content {
        display: flex;
        margin-top: 50px;

        .sms-input {
          width: 519px;

          .sms-add-value {
            display: inline-block;
            border: none;
          }

          .el-textarea__inner {
            display: block;
            width: 100%;
            height: 219px;
            border-radius: 0;
            border: 1px solid #999;
            resize: none;
            font-size: 14px;
          }

          p {
            box-sizing: border-box;
            width: 100%;
            height: 44px;
            padding-right: 30px;
            font-size: 12px;
            color: #bbb;
            text-align: right;
            border: 1px solid #999;
            border-top: 0;
            line-height: 44px;

            span {
              position: relative;
              margin-left: 15px;
              color: #366CB3;

              &:hover {
                & > .des {
                  display: block;
                }
              }

              .des {
                display: none;
                position: absolute;
                bottom: 20px;
                right: 0px;
                width: 413px;
                height: 186px;
                padding-left: 10px;
                border: 1px solid #999;
                font-size: 14px;
                color: #333;
                background: #fff;

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

      .generate {
        display: flex;
        margin-top: 20px;
        align-items: center;

        .el-input {
          width: 252px;
          height: 100%;
        }

        button {
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
      }
    }

    .footer {
      display: flex;
      justify-content: center;
      margin-top: 30px;

      .el-button {
        width: 97px;
        height: 41px;
        margin-right: 30px;
        text-align: center;
        line-height: 41px;
      }
    }
  }
}
</style>

