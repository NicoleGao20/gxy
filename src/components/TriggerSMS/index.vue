<template>
  <el-dialog
    :fullscreen="true"
    :visible.sync="visible"
    class="dialog"
    @close="$emit('close')"
  >
    <div slot="title" class="title">
      触发短信
    </div>
    <main class="mainWrapper">
      <div class="editArea">
        <p>辅助工具:
          <el-input v-if="isGenerateLinkView" v-model="shortLink" clearable size="small" style="width:500px;vertical-align:middle;">
            <el-button slot="append" @click="addShortLink">确定</el-button>
          </el-input>
          <span class="generateLink" @click="isGenerateLinkView=!isGenerateLinkView">生成短信链接</span>
        </p>
        <div class="smsContent">
          <span class="introText">短信内容:</span>
          <div class="textArea">
            <el-input
              ref="textArea"
              :rows="8"
              :maxlength="350"
              v-model="messageContent"
              type="textarea"
            />
            <div class="ruleDescription">
              共{{ messageLength }}字(包含签名和退订回复)，计费{{ billingSMSNum }}条。 0.04元/条
              <el-tooltip placement="top">
                <div slot="content">
                  规则说明：<br>
                  1、 单条70字，超出70字将按照67个字每条计算；<br>
                  2、 一个汉字、数字、字母、空格都算一个字；<br>
                  3、 带参数短信按实际发出的长度计算；<br>
                  4、 短信最长长度不能超过350个字；<br>
                  5、 短信中包含短链接，请用空格将链接和前后文字隔开；<br>
                  6、 没有姓名参数，系统将使用“会员账号”代替具体姓名
                </div>
                <span style="margin-left:22px;color:#366cb3;cursor:pointer;">规则说明</span>
              </el-tooltip>
            </div>
            <div class="InsertParameter">
              <span>插入参数<span class="icon">?</span></span>
              <el-button plain type="primary" size="medium" @click="insert('brand')">品牌</el-button>
              <el-button plain type="primary" size="medium" @click="insert('name')">姓名</el-button>
              <el-button plain type="primary" size="medium" @click="insert('registeredStore')">注册门店</el-button>
              <el-button plain type="primary" size="medium" @click="insert('comsumerStore')">消费门店</el-button>
              <el-button plain type="primary" size="medium" @click="insert('couponCode')">优惠券编码</el-button>
            </div>
          </div>
        </div>
      </div>
      <div class="previewArea">
        <div class="bubble">
          {{ messageContentParse }}
        </div>
      </div>
    </main>
    <div slot="footer" class="footer">
      <el-button @click="handleCancel">取消</el-button>
      <el-button type="primary" @click="handleConfirm">确定</el-button>
    </div>
  </el-dialog>
</template>
<script>
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      shortLink: '',
      isGenerateLinkView: false,
      messageContent: ''
    }
  },
  computed: {
    messageLength() {
      return this.messageContent.length
    },
    billingSMSNum() {
      const length = this.messageContent.length
      if (length === 0) {
        return 0
      }
      if (length <= 70) {
        return 1
      } else if (length > 70) {
        return 1 + Math.ceil((length - 70) / 67)
      }
    },
    messageContentParse() {
      const str = this.messageContent
      // 将插入参数的汉字转化为unicode编码所写的正则匹配表达式
      const reg = /\{(\u54c1\u724c|\u59d3\u540d|\u6ce8\u518c\u95e8\u5e97|\u6d88\u8d39\u95e8\u5e97|\u4f18\u60e0\u5238\u7f16\u7801)\}/g
      return str.replace(reg, '【$1】')
    }
  },
  methods: {
    insert(key) {
      const obj = {
        brand: '{品牌}',
        name: '{姓名}',
        registeredStore: '{注册门店}',
        comsumerStore: '{消费门店}',
        couponCode: '{优惠券编码}'
      }
      const length = this.messageContent.length
      this.$refs.textArea.focus()
      if (length + obj[key].length > 350) {
        return false
      } else {
        this.messageContent += obj[key]
      }
    },
    addShortLink() {
      const length = this.messageContent.length
      if (length + this.shortLink.length > 350) {
        return false
      } else {
        this.messageContent += this.shortLink
        this.shortLink = ''
      }
    },
    handleConfirm() {
      this.$emit('close')
      this.$emit('handleConfirm', this.messageContent)
      this.messageContent = ''
      this.shortLink = ''
    },
    handleCancel() {
      this.$emit('close')
    }
  }
}
</script>
<style lang="less" scoped>
  .dialog {
    .title {
      font-size: 16px;
    }
    .mainWrapper {
      display: flex;
      font-size: 12px;
      padding-top: 26px;
      .editArea {
        flex: 3;
        .generateLink {
          color: #366cb3;
          cursor: pointer;
        }
        .smsContent {
          margin-top: 46px;
          display: flex;
          .introText {
            flex-basis: 60px;
          }
          .textArea {
            // position: relative;
            width: 80%;
            .ruleDescription {
              padding: 15px;
              font-size: 14px;
              border: 1px solid #999;
              color: #999;
              text-align: right;
            }
            .InsertParameter {
              display: flex;
              justify-content: space-between;
              align-items: center;
              margin-top: 18px;
              .icon {
                width: 16px;
                height: 16px;
                border-radius: 50%;
                background-color: #999;
                color: #fff;
                display: inline-block;
                text-align: center;
                line-height: 16px;
              }
            }
          }
        }
      }
      .previewArea {
        flex: 2;
        .bubble {
          margin-top: 59px;
          word-break: break-all;
          line-height: 1.5;
          padding: 22px 14px;
          background-color: rgb(234, 234, 234);
          width: 256px;
          min-height: 230px;
          margin-left: auto;
          margin-right: auto;
          border-radius: 16px;
          position: relative;
          &::after {
            content: '';
            display: inline-block;
            width: 0;
            height: 0;
            border-left: 30px solid rgb(234, 234, 234);
            border-right: 10px solid transparent;
            border-top: 14px solid transparent;
            border-bottom: 14px solid transparent;
            position: absolute;
            bottom: -14px;
            left: 46px;
          }
        }
      }
    }
    .footer {
      text-align: center;
    }
    /deep/ .el-dialog__header{
      border-top: 1px solid rgb(204, 204, 204);
      border-left: rgb(204, 204, 204);
      border-right: rgb(204, 204, 204);
      border-top-left-radius: 8px;
      border-top-right-radius: 8px;
    }
    /deep/ .el-dialog__body {
        border: 1px solid rgb(204, 204, 204);
    }
    /deep/ .el-dialog__footer {
      border-bottom: 1px solid rgb(204, 204, 204);
      border-left: rgb(204, 204, 204);
      border-right: rgb(204, 204, 204);
      border-bottom-left-radius: 8px;
      border-bottom-right-radius: 8px;
    }
  }
</style>
