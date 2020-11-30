<!-- 触发消息模板组件 -->
<template>
  <div class="wrapper">
    <el-dialog :visible="show" title="选择优惠券" fullscreen @close="closeDialog">
      <span slot="title" class="title">消息模板</span>
      <main>
        <div class="left">
          <div class="select-template">
            <span>选择模板：</span>
            <el-select v-model="selectedTemplate" style="width: 400px;margin-left: 9px;">
              <el-option
                v-for="item in templateOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </div>
          <div class="template-container">
            <span>模板内容：</span>
            <div class="template-content">
              <p class="template-title">{{ selectedTemplate }}</p>
              <p>X月X日</p>
              <el-input
                :rows="3"
                v-model="date"
                type="textarea"
                placeholder="请输入内容"
                @focus="focusTextarea('date')"
              />
              <p>会员编码</p>
              <el-input
                :rows="3"
                v-model="memberId"
                type="textarea"
                placeholder="请输入内容"
                @focus="focusTextarea('memberId')"
              />
              <p>加入时间</p>
              <el-input
                :rows="3"
                v-model="joinTime"
                type="textarea"
                placeholder="请输入内容"
                @focus="focusTextarea('joinTime')"
              />
              <p>详细</p>
              <el-input
                :rows="3"
                v-model="details"
                type="textarea"
                placeholder="请输入内容"
                @focus="focusTextarea('details')"
              />
            </div>
          </div>
        </div>
        <div class="right">
          <el-form ref="form" :model="form" label-width="160px" class="form">
            <el-form-item label="消息模版内容插入参数">
              <el-button plain type="primary" size="medium" @click="insert('brand')">品牌</el-button>
              <el-button plain type="primary" size="medium" @click="insert('name')">姓名</el-button>
              <el-button plain type="primary" size="medium" @click="insert('registeredTime')">注册时间</el-button>
            </el-form-item>
            <el-form-item label="标题" prop="title" class="required">
              <el-input v-model="form.title" placeholder="请输入标题" clearable class="w245"/>
            </el-form-item>
            <el-form-item label="消息模板详情链接" prop="link">
              <el-select v-model="form.link" class="w245">
                <el-option
                  v-for="item in linkOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item v-if="form.link === 'get'">
              <p>链接到微信公众号领券优惠券的页面</p>
            </el-form-item>
            <el-form-item v-if="form.link === 'hasGet'">
              <p>链接到微信公众号"已领优惠"页面</p>
            </el-form-item>
            <el-form-item v-if="form.link === 'material'">
              <!-- <p>这里将会是一个素材弹窗</p> -->
            </el-form-item>
            <el-form-item
              v-if="form.link === 'customLink'"
              prop="customLink"
              label="链接"
              class="required"
            >
              <el-input v-model="form.customLink" clearable class="w245"/>
            </el-form-item>
            <el-form-item
              v-if="form.link === 'miniApp'"
              label="小程序APPID"
              prop="miniAppId"
              class="required"
            >
              <el-input
                v-model="form.miniAppId"
                clearable
                placeholder="请确保填入的小程序已关联到本品牌公众号，未关联则无法链接"
                class="w450"
              />
            </el-form-item>
            <el-form-item
              v-if="form.link === 'miniApp'"
              label="小程序路径"
              prop="miniAppPath"
              class="required"
            >
              <el-input v-model="form.miniAppPath" clearable class="w450"/>
            </el-form-item>
            <el-form-item v-if="form.link === 'miniApp'" label="备用网页">
              <el-input
                v-model="form.sparePage"
                clearable
                placeholder="因设备或其他原因无法支持小程序时，用户点击跳转至此备用网页"
                class="w450"
              />
            </el-form-item>
          </el-form>
        </div>
      </main>
      <span slot="footer" class="footer">
        <el-button @click="closeDialog">取 消</el-button>
        <el-button type="primary" @click="confirm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>

export default {
  name: 'MessageTemplate',
  props: {
    // 组件的显示与否
    show: {
      type: Boolean,
      required: true,
      default: false
    }
  },
  data() {
    return {
      templateOptions: [
        {
          value: '新会员加入通知',
          label: '新会员加入通知'
        }
      ],
      selectedTemplate: '新会员加入通知',
      date: '',
      memberId: '',
      joinTime: '',
      details: '',
      form: {
        title: '',
        link: 'noLink',
        customLink: '',
        miniAppId: '',
        miniAppPath: '',
        sparePage: ''
      },
      linkOptions: [
        {
          value: 'noLink',
          label: '无链接'
        },
        {
          value: 'get',
          label: '马上领优惠'
        },
        {
          value: 'hasGet',
          label: '已领优惠'
        },
        {
          value: 'material',
          label: '素材'
        },
        {
          value: 'customLink',
          label: '自定义链接'
        },
        {
          value: 'miniApp',
          label: '小程序'
        }
      ],
      focusedTextarea: '', // 当前聚焦的文本域的 v-model 值
      notifyPromise: Promise.resolve()
    }
  },
  methods: {
    /**
     * @param {String}
     * @description 获取当前聚焦文本域的 v-model 绑定值
     */
    focusTextarea(model) {
      this.focusedTextarea = model
    },
    // 给文本域插入参数
    insert(key) {
      const obj = {
        'brand': '品牌',
        'name': '姓名',
        'registeredTime': '注册时间'
      }
      // 给当前聚焦的文本域插入参数
      this[this.focusedTextarea] += `{${obj[key]}}`
    },
    // 封装通知消息方法
    notify(msg, title = '错误', position = 'top-left') {
      // 通知，解决element-ui，同时调用notify时，通知重叠的问题
      // this.$nextTick()不传回调函数时返回的是个Promise
      this.notifyPromise = this.notifyPromise.then(this.$nextTick).then(() => {
        this.$notify.error({
          title,
          message: msg,
          position
        })
      })
    },
    verify() {
      let isVerifySuccess = true
      const len = this.date.length + this.memberId.length + this.joinTime.length + this.details.length
      const verifyRules = [
        [len > 180, '模板内容不能超过150个字符'],
        [this.form.title === '', '模板消息标题尚未填写'],
        [this.form.title.length >= 15, '模板消息标题不得超过15个字符'],
        [this.form.link === 'customLink' && this.form.customLink === '', '自定义链接尚未填写'],
        [this.form.link === 'miniApp' && this.form.miniAppId === '', '小程序APPID未填写'],
        [this.form.link === 'miniApp' && this.form.miniAppPath === '', '小程序路径未填写']
      ]
      verifyRules.forEach((value) => {
        if (value[0]) {
          this.notify(value[1])
          isVerifySuccess = false
        }
      })
      return isVerifySuccess
    },
    confirm() {
      if (this.verify()) {
        // 具体确认内容后操作视业务需求而定
        // ...
        // console.log(this.form)
        this.closeDialog()
      }
    },
    closeDialog() {
      this.$emit('hideDialog', false)
    }
  }
}
</script>

<style lang="less" scoped>
.wrapper {
  main {
    display: flex;
    .left {
      flex: 1;
      .select-template {
        margin-bottom: 40px;
      }
      .template-container {
        display: flex;
        .template-content {
          width: 80%;
          padding: 20px;
          margin-left: 10px;
          background-color: rgb(242, 242, 242);
          p {
            margin-left: 2px;
            margin-bottom: 5px;
          }
          .template-title,
          .el-textarea {
            margin-bottom: 20px;
          }
        }
      }
    }
    .right {
      flex: 1;
      margin-top: 90px;
      .insert-parameter,
      .title,
      .link {
        margin-bottom: 40px;
        span {
          display: inline-block;
          width: 160px;
          text-align: right;
          margin-right: 20px;
        }
      }
      .title {
        span {
          &::before {
            content: "*";
            color: red;
          }
        }
        .required {
          /deep/ .el-input__inner {
            border: 1px solid red;
          }
        }
      }
    }
  }

  /deep/ .el-dialog__header {
    padding-bottom: 20px;
    border-bottom: 2px solid #e8e8e8;
  }
  /deep/ .el-dialog__footer {
    text-align: center;
    padding-top: 20px;
    border-top: 2px solid #e8e8e8;
  }
}

/* 公共样式 */
.w245 {
  width: 245px;
}
.w450 {
  width: 450px;
}
.required {
  /deep/ .el-form-item__label {
    &::before {
      content: "*";
      color: red;
    }
  }
}
</style>

