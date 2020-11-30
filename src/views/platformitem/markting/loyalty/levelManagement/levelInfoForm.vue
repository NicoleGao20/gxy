<template>
  <el-main v-loading="pageLoading" class="edit-level-container">
    <el-row class="notice-container">
      根据等级规则设置在客户交易成功时进行等级计算，显示相应的等级，但如果客户未绑卡，等级无法回传给淘宝/京东，其在淘宝/京东对应的等级仍为0
    </el-row>
    <el-row class="basic-info">
      基本信息
    </el-row>
    <el-divider/>
    <el-form ref="form" :model="form" :rules="rules" :validate-on-rule-change="false" label-width="160px" class="form">
      <el-row :gutter="20" type="flex">
        <el-col>
          <el-form-item label="会员等级">
            <div class="level-code w245">{{ form.level_code }}</div>
          </el-form-item>
          <el-form-item label="会员名称" prop="level_name">
            <el-input v-model="form.level_name" :maxlength="10" placeholder="请输入会员名称" clearable class="w245"/>
          </el-form-item>
          <el-form-item label="等级背景" required>
            <el-radio-group v-model="backgroundType">
              <el-row type="flex">
                <el-col style="width: 200px">
                  <el-radio label="color">
                    背景色
                  </el-radio>
                </el-col>
                <el-col>
                  <el-color-picker
                    v-model="form.bg_color"
                    :predefine="['#409EFF', '#1890ff', '#304156','#212121','#11a983', '#13c2c2', '#6959CD', '#f5222d']"/>
                </el-col>
              </el-row>
              <el-row>
                <el-radio label="image">
                  背景图
                </el-radio>
              </el-row>
              <el-row>
                <image-upload
                  ref="imageUpload"
                  :image-url="form.bg_picture_url"
                  :post-url="postUrl"
                  :loading.sync="pageLoading"
                  @imageChange="handleImageChange"
                  @submitFormData="submitFormData"/>
                <div class="tips-info mt10">尺寸：1000*600像素，小于1M，支持jpg、png、jpeg格式</div>
              </el-row>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col>
          <div class="card-container">
            <div :style="cardStyle" class="card">
              <p class="level-name">{{ form.level_name }}</p>
              <p class="cost-amount"><span class="cost-num">{{ condAmt }}</span>消费金额</p>
              <hr :style="{backgroundColor: cardColor}" class="divider">
              <p v-if="nextShowMoney" class="upgrade-level">再消费 <span>{{ reConsumption }}</span>元成为
                {{ !!nextLevel ? nextLevel.level_code : form.level_code }}</p>
              <p v-else class="upgrade-level">
                累计消费 <span> {{ reConsumptionTime }} </span>次成为 {{ !!nextLevel ? nextLevel.level_code : form.level_code }}
              </p>
            </div>
            <div class="tips-info">仅为预览，实际以用户查看时为准</div>
          </div>
        </el-col>
      </el-row>
      <el-form-item label="获得条件" required>
        <el-row>
          <span>
            在
          </span>
          <span class="require-condition-form">
            <el-form-item label-width="0" prop="cond_period">
              <el-input
                v-model="form.cond_period"
                class="cond-period-input"
                type="number"
                placeholder="请输入">
                <template slot="append">
                  <el-select slot="append" v-model="form.cond_period_type" @change="handleSelectChange">
                    <el-option label="年" value="year"/>
                    <el-option label="月" value="month"/>
                    <el-option label="日" value="day"/>
                  </el-select>
                </template>
              </el-input>
            </el-form-item>
          </span>
          <span>
            内，累计消费满
          </span>
          <span class="require-condition-form">
            <el-form-item label-width="0" prop="cond_amt">
              <el-input
                v-model="form.cond_amt"
                type="number"
                placeholder="请输入金额">
                <template slot="append">元</template>
              </el-input>
            </el-form-item>
          </span>
          <span>
            <span class="or">或</span> 累计消费满
          </span>
          <span class="require-condition-form">
            <el-form-item label-width="0" prop="cond_cnt">
              <el-input
                v-model="form.cond_cnt"
                type="number"
                placeholder="请输入次数">
                <template slot="append">次</template>
              </el-input>
            </el-form-item>
          </span>
        </el-row>
        <el-row class="tips-info">修改等级获得条件后，部分客户会因无法达到该条件要求而发生会员等级的变化</el-row>
      </el-form-item>
      <el-row :gutter="20" type="flex">
        <el-col style="width: 700px">
          <el-form-item label="发布时间" prop="release_time">
            <el-row>
              <span>请选择</span>
              <el-date-picker
                v-model="form.release_time"
                :picker-options="pickerOptions"
                :class="{'release-immediately-style': isImmediately}"
                :placeholder="releaseTimePlaceHolder"
                class="date-picker-width"
                type="datetime"
                style="width: 100%;"
                format="yyyy-MM-dd HH:mm:ss"
                value-format="yyyy-MM-dd HH:mm:ss"
                @focus="handleFocus"
                @blur="handleBlur"/>
              <span class="publish-immediately" @click="handleImmediately">立刻发布</span>
            </el-row>
          </el-form-item>
          <el-row class="tips-info set-margin">修改等级获得条件后，部分客户会因无法达到该条件要求而发生会员等级的变化</el-row>
        </el-col>
      </el-row>
      <el-row class="form_footer">
        <el-button @click="handleCancel">取消</el-button>
        <el-button type="primary" @click="handleSubmit">提交</el-button>
      </el-row>
    </el-form>
  </el-main>
</template>

<script>
import { getMemberLevel, saveMemberLevel, checkLevelName } from '@/api/markting/level'
import ImageUpload from '@/componentsMarketing/ImageUpload'
import { apiObj } from '@/config/getUrl.js'

export default {
  name: 'LevelInfoForm',
  components: { ImageUpload },
  data() {
    return {
      pickerOptions: {
        disabledDate: (time) => {
          let nowData = new Date()
          nowData = new Date(nowData.setDate(nowData.getDate() - 1))
          return time < nowData
        }
      },
      pageLoading: false,
      backgroundType: 'color',
      pictureList: [],
      fileList: [],
      form: {
        id: '',
        level_code: '',
        level_name: '',
        cond_period: null,
        cond_period_type: 'year',
        cond_amt: null,
        cond_cnt: null,
        bg_picture_url: '',
        bg_color: '#ffffff',
        release_time: '',
        level_status: ''
      },
      nextLevel: {},
      origin_bg_picture_url: '',
      postUrl: `${apiObj.uploadOss}/levelImages`,
      headers: {},
      releaseTimePlaceHolder: '规则发布日期',
      immediately: false
    }
  },
  computed: {
    rules() {
      return {
        level_name: [{ required: true, trigger: ['blur', 'change'], message: '会员名称不能为空' }, { validator: this.validateLevelName, trigger: 'blur' }],
        bg_color: { required: true, trigger: ['blur', 'change'], message: '等级背景不能为空' },
        release_time: { required: this.releaseTimePlaceHolder === '规则发布日期', trigger: ['blur', 'change'], message: '发布时间不能为空' },
        cond_period: [{ required: true, trigger: ['blur', 'change'], message: '年/月/日不能为空' },
          { pattern: /^\+?[1-9]\d*$/, message: '年/月/日必须为正整数' }],
        cond_amt: [{ required: !this.form.cond_cnt, trigger: ['blur', 'change'], message: '金额不能为空' },
          { pattern: /^\+?[1-9]\d*$/, message: '金额必须为正整数' }],
        cond_cnt: [{ required: !this.form.cond_amt, trigger: ['blur', 'change'], message: '次数不能为空' },
          { pattern: /^\+?[1-9]\d*$/, message: '次数必须为正整数' }]
      }
    },
    cardColor() {
      if (this.backgroundType === 'color') {
        if (this.isWhite) return '#fff'
        return '#000'
      } else {
        return '#000'
      }
    },
    isWhite() {
      return this.brightnessOfColor(this.form.bg_color) < 128
    },
    cardStyle() {
      let styleConfig = {
        color: this.cardColor,
        borderColor: this.cardColor
      }
      if (this.backgroundType === 'color') {
        styleConfig = { ...styleConfig, backgroundColor: this.form.bg_color }
      } else {
        styleConfig = { ...styleConfig, background: `url(${this.form.bg_picture_url}) no-repeat` }
      }
      return styleConfig
    },
    nextShowMoney() {
      if (!this.nextLevel) return false
      if (this.nextLevel && this.nextLevel.cond_amt) return true
    },
    condAmt() {
      if (this.form.cond_amt) return this.form.cond_amt
      else return 0
    },
    reConsumption() {
      if (this.nextShowMoney) {
        const formCondAmt = !!this.form.cond_amt && typeof Number(this.form.cond_amt) === 'number' ? Number(this.form.cond_amt) : 0
        if (this.nextLevel) {
          const nextLevelCondAmt = !!this.nextLevel && !!this.nextLevel.cond_amt && typeof Number(this.nextLevel.cond_amt) === 'number' ? Number(this.nextLevel.cond_amt) : 0
          return nextLevelCondAmt - formCondAmt
        } else {
          return formCondAmt
        }
      } else {
        return 0
      }
    },
    reConsumptionTime() {
      if (!this.nextShowMoney) {
        const formCondCnt = !!this.form.cond_cnt && typeof Number(this.form.cond_cnt) === 'number' ? Number(this.form.cond_cnt) : 0
        if (this.nextLevel) {
          const nextLevelCondCnt = !!this.nextLevel && !!this.nextLevel.cond_cnt && typeof Number(this.nextLevel.cond_cnt) === 'number' ? Number(this.nextLevel.cond_cnt) : 0
          return nextLevelCondCnt - formCondCnt
        } else {
          return formCondCnt
        }
      } else {
        return 0
      }
    },
    isImmediately() {
      return this.releaseTimePlaceHolder === '立即发布' && this.immediately
    }
  },
  created() {
    this.getMemberLevel()
  },
  methods: {

    handleFocus() {
      this.releaseTimePlaceHolder = '规则发布日期'
      this.$nextTick(() => {
        this.$refs.form.clearValidate(['release_time'])
      })
    },

    handleBlur() {
      if (this.immediately) {
        if (this.form.release_time) {
          this.immediately = false
        } else {
          this.releaseTimePlaceHolder = '立即发布'
          this.$nextTick(() => {
            this.$refs.form.validateField(['release_time'])
          })
        }
      }
    },

    /**
     *  图片改变事件
     *  @param imageUrl
     */
    handleImageChange(imageUrl) {
      this.form.bg_picture_url = imageUrl
    },

    /**
     * 立刻发布
     */
    handleImmediately() {
      this.immediately = true
      this.releaseTimePlaceHolder = '立即发布'
      this.form.release_time = ''
    },

    /**
     *  取消提交表单
     */
    handleCancel() {
      console.log('cancel')
      this.handleBack()
    },

    /**
     *  提交按钮事件
     */
    handleSubmit() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.pageLoading = true
          if (this.form.bg_picture_url && !(this.form.bg_picture_url === this.origin_bg_picture_url)) {
            this.$refs.imageUpload.submitUpload()
            return
          }
          this.submitFormData()
        }
      })
    },

    /**
     *  提交表单
     */
    submitFormData() {
      let postData = {
        id: this.form.id,
        level_name: this.form.level_name,
        cond_amt: this.form.cond_amt ? this.form.cond_amt : 0,
        cond_cnt: this.form.cond_cnt ? this.form.cond_cnt : 0,
        release_time: this.isImmediately ? this.getNowFormatDate() : this.form.release_time,
        level_status: this.form.level_status,
        cond_period_type: this.form.cond_period_type,
        cond_period: this.form.cond_period
      }
      if (this.backgroundType === 'color') {
        postData = { ...postData, bg_color: this.form.bg_color, bg_picture_url: '' }
      } else {
        if (!this.form.bg_picture_url) {
          this.$message.error('请上传卡片背景图片！')
          this.pageLoading = false
          return
        }
        postData = { ...postData, bg_picture_url: this.form.bg_picture_url, bg_color: '' }
      }
      this.pageLoading = true
      saveMemberLevel(postData).then(res => {
        if (res && res.data) {
          this.$message({
            message: '提交成功！',
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
    },

    /**
     * 返回等级列表页
     */
    handleBack() {
      this.$router.push({ path: this.$route.path })
    },

    /**
     *  获取表单详细信息
     */
    getMemberLevel() {
      getMemberLevel({ id: this.$route.query.id }).then(res => {
        if (res && res.data) {
          const _form = res.data
          if (_form && _form.bg_picture_url && !this.isImg(_form.bg_picture_url)) {
            delete _form.bg_picture_url
          }
          if (!_form.cond_amt) _form.cond_amt = null
          if (!_form.cond_cnt) _form.cond_cnt = null
          this.form = { ...this.form, ..._form }
          if (this.form.bg_picture_url) {
            this.backgroundType = 'image'
            this.origin_bg_picture_url = this.form.bg_picture_url
          }
          this.nextLevel = res.data.nextLevel
        }
      })
    },

    handleSelectChange(val) {
      console.log('val', val)
    },

    /**
     *  hex转为rgb
     *  @params hexColor 例如: #5d5d5d
     */
    hexToRgb(hexColor) {
      return parseInt(hexColor, 16).toString()
    },

    brightnessOfColor(colorHexadecimalValue) {
      if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(colorHexadecimalValue)) {
        let c = colorHexadecimalValue.substring(1).split('')
        if (c.length === 3) {
          c = [c[0], c[0], c[1], c[1], c[2], c[2]]
        }
        const useColorValue = c.join('')
        const rColorValue = this.hexToRgb(useColorValue.slice(0, 2))
        const gColorValue = this.hexToRgb(useColorValue.slice(2, 4))
        const bColorValue = this.hexToRgb(useColorValue.slice(4))
        return rColorValue * 0.299 + gColorValue * 0.587 + bColorValue * 0.114
      }
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
      return date.getFullYear() + '-' + this.timeAdd0(date.getMonth() + 1) + '-' + this.timeAdd0(date.getDate()) +
        ' ' + this.timeAdd0(date.getHours()) + ':' + this.timeAdd0(date.getMinutes()) +
        ':' + this.timeAdd0(date.getSeconds())
    },

    isImg(url) {
      const strFilter = '.jpeg|.jpg|.png|'
      if (url.indexOf('.') > -1) {
        const p = url.lastIndexOf('.')
        let strPostfix = url.substring(p, url.length) + '|'
        strPostfix = strPostfix.toLowerCase()
        if (strFilter.indexOf(strPostfix) > -1) {
          return true
        }
      }
      return false
    },

    validateLevelName(rule, value, callback) {
      const queryObject = {
        brand_code: this.form.brand_code,
        level_name: value,
        level_code: this.form.level_code
      }
      checkLevelName(queryObject).then(res => {
        console.log('res', res)
        if (res && res.data && res.data.flag) {
          callback(new Error('等级名称不能重复'))
        } else {
          callback()
        }
      }).catch(err => {
        console.log('err', err)
      })
    }
  }
}
</script>

<style lang="less" scoped>
.edit-level-container {
  width: 100%;
  min-height: 100%;
  background-color: #fff;
  .set-margin {
    margin-left:160px;
  }
  .notice-container {
    line-height: 20px;
    background-color: #fff6cb;
    padding: 10px;
    color: #8e5b37;
    font-size: 12px;

    .update-level {
      color: #0035fe;
      cursor: pointer;
    }
  }

  .basic-info {
    margin-top: 20px;
    font-weight: bold;
    padding-left: 10px;
  }

  .tips-info {
    line-height: 18px;
    font-size: 12px;
    color: #aeaeae;
  }

  .mt10 {
    margin-top: 10px;
  }

  .level-code {
    color: #e30000;
    border: 1px solid rgb(220, 223, 230);
    padding: 0 30px 0 15px;
    font-size: 12px;
    border-radius: 2px;
    min-height: 32px;
    line-height: 32px;
    opacity: 0.8;
    box-sizing: border-box
  }

  .footer {
    width: 80%;
    text-align: right;
  }

  .require-condition {
    .require-condition-form {
      .el-form-item {

      }
    }

    .or {
      padding: 0 20px;
      color: #005dd2;
    }
  }

  .divider {
    margin: 18px 0;
    border: 1px solid;
  }

  /deep/ .require-condition-form .el-form-item {
    width: 20%;
    display: inline-block;
  }

  /deep/ .require-condition .cond-period-input.el-input .el-input-group__append {
    width: 60px;
  }

  /deep/ .require-condition .cond-period-input.el-input .el-input-group__append .el-input {
    width: 100%;
  }

  /deep/ .require-condition-form .el-form-item .el-input-group--append .el-input__inner {
    padding-right: 0 !important;
  }

  /deep/ .date-picker-width {
    width: 200px !important;
    margin-left: 10px;
  }

  /deep/ .el-radio {
    line-height: 36px;
  }

  /deep/ .el-color-picker--small .el-color-picker__trigger {
    width: 61px;
  }

  /deep/ .el-color-picker__icon {
    display: none;
  }

  @upload-size: 60px;
  @upload-line-height: 60px;

  .upload--picture-card {
    margin-bottom: 10px;

    .el-upload-list--picture-card {
      .el-upload-list__item {
        width: @upload-size;
        height: @upload-size;
      }
    }

    .el-upload--picture-card {
      width: @upload-size;
      height: @upload-size;
      line-height: @upload-line-height;
    }
  }

  .card-container {
    width: 100%;
    height: 100%;

    .card {
      width: 320px;
      height: 170px;
      margin: 80px auto 0;
      border: 1px solid;
      border-radius: 10px;
      padding: 20px;
      font-weight: bold;
      background-size: 320px 170px !important;

      .level-name {
        height: 20px;
        margin-bottom: 20px;
        font-size: 18px;
      }

      .cost-amount {
        margin-bottom: 10px;

        .cost-num {
          font-size: 30px;
          margin-right: 10px;
        }
      }

      .upgrade-level {
        span {
          margin: 0 10px;
        }
      }
    }

    .tips-info {
      margin-top: 10px;
      text-align: center;
    }
  }

  .publish-immediately {
    color: #e20000;
    font-size: 12px;
    margin-left: 10px;
    cursor: pointer;
  }
}
</style>
<style lang="less">
.el-color-dropdown .el-color-dropdown__link-btn {
  display: none !important;
}

.release-immediately-style > input {
  &::-webkit-input-placeholder {
    color: #606266
  }

  &:-moz-placeholder {
    color: #606266
  }

  &::-moz-placeholder {
    color: #606266
  }

  &:-ms-input-placeholder {
    color: #606266
  }
}
</style>
