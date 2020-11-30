<template>
  <div class="vipCardFormWrapper">
    <div id="preview" ref="preview" class="preview">
      <div class="cardWrapper">
        <div
          :style="form.couponCoverType === '1' ? {backgroundColor: form.couponColor} : {backgroundImage: `url(${couponImagePreview})`}"
          class="card">
          <span class="logo">
            <img v-if="businessLogoPreview.length" :src="businessLogoPreview" alt="">
          </span>
          <div class="logoArea">
            <span>{{ form.businessName }}</span>
            <p class="cardTitle">{{ form.cardTitle }}</p>
            <span class="qrcode"/>
          </div>
          <div class="msgArea">
            <span class="memberNumber">0123 4567 8901</span>
            <span class="iconInfo" />
          </div>
        </div>
      </div>
      <div class="infoCategoryWrapper">
        <el-row
          v-if="form.infoCategory.length"
          class="borderBottom"
        >
          <el-col
            v-for="(item, index) in form.infoCategory"
            :span="24/form.infoCategory.length"
            :key="index"
            class="borderRight"
          >
            <el-col :span="24" class="title">
              {{ formatInfoCategory(item) }}
            </el-col>
            <el-col :span="24" class="link">
              {{ formatInfoLink(item) }}
            </el-col>
          </el-col>
        </el-row>
      </div>
      <div class="listWrapper">
        <ul class="list">
          <li>
            <div class="panel">
              <div>
                <p>{{ $t('vipcard.applicableStores') }}</p>
              </div>
              <span class="icon"/>
            </div>
          </li>
          <li>
            <div class="panel">
              <div>
                <p>{{ $t('vipcard.publicNumber') }}</p>
              </div>
              <span class="icon"/>
            </div>
          </li>
        </ul>
      </div>
      <div class="customEntryWrapper">
        <ul class="list">
          <li v-if="!form.customEntry.length">
            <div class="panel">
              <div>
                <p>{{ $t('vipcard.customEntryOptional') }}</p>
              </div>
              <span class="icon"/>
            </div>
          </li>
          <li v-for="(item,index) in form.customEntry" :key="index">
            <div class="panel">
              <div>
                <p>{{ item.entryName === '' ?$t('vipcard.customEntryOptional') :item.entryName }}<span class="guideLang">{{ item.guideLang }}</span></p>
              </div>
              <span class="icon"/>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <el-form id="form" ref="form" :model="form" :rules="rules" label-width="150px" label-position="left" size="small" class="form">
      <p class="title">{{ $t('vipcard.basicInfo') }}</p>
      <el-form-item :required="true" :label="$t('vipcard.businessName')" prop="businessName">
        <el-input v-model="form.businessName" style="width:200px;margin-right:16px;" @input="handleChangeMaxlengthInput($event, form, 'businessName', 12)"/>
        <span><span :style="{color: businessNameLength === 12 ? 'red' : '#000'}">{{ businessNameLength }}</span>/ 12</span>
      </el-form-item>
      <el-form-item :label="$t('vipcard.logo')" :required="true" prop="businessLogo" class="merchantLogoFormItem">
        <label class="merchantLogo">
          <input type="file" @change="handleChangeLogo">
          <div :style="{opacity: businessLogoPreview ? '0' :'1'}" class="text">
            <!-- {{ $t('vipcard.uploadLogo') }} -->
          </div>
          <img :src="businessLogoPreview" alt="">
        </label>
        <span class="explain">{{ $t('vipcard.businessLogoExplain') }}</span>
      </el-form-item>
      <el-form-item :label="$t('vipcard.couponCover')" :required="true" class="couponCover">
        <el-radio-group v-model="form.couponCoverType">
          <span class="couponColor">
            <el-radio label="1">{{ $t('vipcard.color') }}</el-radio>
            <span v-if="form.couponCoverType === '1'">
              <el-color-picker
                v-model="form.couponColor"
                :predefine="predefineColors"
              />
            </span>
          </span>
          <span class="couponImage">
            <el-radio label="2">{{ $t('vipcard.image') }}</el-radio>
            <label v-if="form.couponCoverType === '2'" for="couponImage">
              <input name="couponImage" type="file" @change="handleChangeCoverImage">
              <span>{{ $t('vipcard.pleaseRefer') }}<a href="https://mp.weixin.qq.com/cgi-bin/readtemplate?t=cardticket/card_cover_tmpl&type=info&lang=zh_CN&token=865333814">{{ $t('vipcard.imageSpe') }}</a>{{ $t('vipcard.upload') }}</span>
              <span class="button">{{ $t('vipcard.choseImg') }}</span>
            </label>
          </span>
        </el-radio-group>
      </el-form-item>
      <el-form-item :label="$t('vipcard.vipcardTitle')" :required="true" prop="cardTitle">
        <el-input v-model="form.cardTitle" style="width:200px;margin-right:16px;" @input="handleChangeMaxlengthInput($event, form, 'cardTitle', 9)"/>
        <span><span :style="{color: cardTitleLength === 9 ? 'red' :'#000'}">{{ cardTitleLength }}</span>/9</span>
        <p class="explain">{{ $t('vipcard.vipcardTitleExplain') }}</p>
      </el-form-item>
      <el-form-item :label="$t('vipcard.infoCategory')">
        <el-checkbox-group v-model="form.infoCategory">
          <el-checkbox label="integration">{{ $t('vipcard.integration') }}</el-checkbox>
          <el-checkbox label="level">{{ $t('vipcard.level') }}</el-checkbox>
          <el-checkbox label="coupon">{{ $t('vipcard.coupon') }}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item :required="true" :label="$t('vipcard.validityPeriod')">
        <div><el-radio v-model="form.effectTime" label="1">{{ $t('vipcard.permanent') }}</el-radio></div>
        <div>
          <el-radio v-model="form.effectTime" label="2">{{ $t('vipcard.fixedDate') }}</el-radio>
          <el-date-picker
            v-if="form.effectTime === '2'"
            v-model="form.fixedDate"
            :default-time="['00:00:00', '23:59:59']"
            :value-format="'timestamp'"
            :start-placeholder="$t('vipcard.startDate')"
            :end-placeholder="$t('vipcard.endDate')"
            type="daterange"
            @change="handleChangeFixedDate"
          />
        </div>
      </el-form-item>
      <p class="title">{{ $t('vipcard.vipcardDetails') }}</p>
      <el-form-item :label="$t('vipcard.privilegeDes')" :required="true" prop="privelegeDes">
        <el-input v-model="form.privelegeDes" :autosize="{minRows: 4}" type="textarea" @input="handleChangeMaxlengthInput($event, form, 'privelegeDes', 1600)"/>
        <span><span :style="{color: privelegeDesLength === 1600 ? 'red' : '#000'}">{{ privelegeDesLength }}</span> / 1600</span>
      </el-form-item>
      <el-form-item :label="$t('vipcard.usageNotice')">
        <el-input v-model="form.usageNotice" :autosize="{minRows: 4}" type="textarea" @input="handleChangeMaxlengthInput($event, form, 'usageNotice', 1600)"/>
        <span><span :style="{color: usageNoticeLength === 1600 ? 'red' : '#000'}">{{ usageNoticeLength }}</span> / 1600</span>
      </el-form-item>
      <p class="title">{{ $t('vipcard.merchantIntro') }}</p>
      <el-form-item :label="$t('vipcard.phone')" prop="telephone">
        <el-input v-model="form.telephone" style="width:300px;"/>
        <p class="explain">{{ $t('vipcard.phoneExplain') }}</p>
      </el-form-item>
      <div v-for="(item, index) in form.customEntry" :key="index">
        <p class="title">{{ $t('vipcard.customEntry') }}{{ $t(`vipcard.${index}`) }} <span class="deleteBtn" @click="deleteCustomEntry(index)">{{ $t('vipcard.delete') }}</span></p>
        <el-form-item :label="$t('vipcard.entryName')">
          <el-input v-model="item.entryName" style="width:200px;marign-right:16px;" @input="handleChangeMaxlengthInput($event, item, 'entryName', 5)"/>
          <span><span :style="{color: formatCustomEntryInputLengthMethod(item.entryName) === 5 ? 'red' :'#000'}">{{ item.entryName | formatCustomEntryInputLength }}</span> / 5</span>
        </el-form-item>
        <el-form-item :label="$t('vipcard.guideWords')">
          <el-input v-model="item.guideLang" style="width:200px;margin-right:16px" @input="handleChangeMaxlengthInput($event, item, 'guideLang', 6)"/>
          <span><span :style="{color: formatCustomEntryInputLengthMethod(item.guideLang) === 6 ? 'red' :'#000'}">{{ item.guideLang | formatCustomEntryInputLength }}</span> / 6</span>
        </el-form-item>
        <el-form-item :label="$t('vipcard.jumpType')">
          <el-radio v-model="item.jumpType" :label="1">{{ $t('vipcard.webLinks') }}</el-radio>
          <el-radio v-model="item.jumpType" :label="2">{{ $t('vipcard.miniApp') }}</el-radio>
        </el-form-item>
        <el-form-item v-if="item.jumpType === 1" :label="$t('vipcard.webLinks')">
          <el-input v-model="item.pageLink" placeholder="http://" style="width:400px;"/>
        </el-form-item>
        <el-form-item v-if="item.jumpType === 2" :label="$t('vipcard.miniAppId')">
          <el-input v-model="item.miniAppId" style="width:400px;"/>
          <p class="explain">{{ $t('vipcard.miniAppIdExplain') }}</p>
        </el-form-item>
        <el-form-item v-if="item.jumpType === 2" :label="$t('vipcard.miniAppPath')">
          <el-input v-model="item.miniAppPath" style="width:400px;"/>
        </el-form-item>
      </div>
      <el-button :disabled="form.customEntry.length === 3" type="primary" @click="addCustomEntry">
        {{ $t('vipcard.addCustomEntry') }}
      </el-button>
      <p class="title">{{ $t('vipcard.otherSettings') }}</p>
      <el-form-item :label="$t('vipcard.actInfo')">
        <el-checkbox-group v-model="selectedActInfo" style="font-size: 14px;">
          <div><span style="font-size:12px;">{{ $t('vipcard.phoneNumber') }}</span> <el-checkbox :disabled="true" label="phoneNumber">{{ $t('vipcard.required') }}</el-checkbox></div>
          <div v-for="(item, index) in form.actInfo" v-if="item.name !== 'phoneNumber'" :key="index">
            <span style="font-size:12px;">{{ $t(`vipcard.${item.name}`) }}</span>
            <el-checkbox :label="item.name" @change="handleChangeActInfoItem($event, item)">{{ $t('vipcard.required') }}</el-checkbox>
          </div>
        </el-checkbox-group>
        <el-button
          style="margin-top:20px;"
          type="primary"
          @click="actInfoDialogVisible = true"
        >{{ $t('vipcard.setting') }}</el-button>
        <p class="explain" >{{ $t('vipcard.actInfoExplain') }}</p>
        <el-dialog
          :visible.sync="actInfoDialogVisible"
          :title="$t('vipcard.setActInfo')"
          @open="handleOpenDialog"
        >
          <el-checkbox-group v-model="setActInfo">
            <el-checkbox label="name">{{ $t('vipcard.name') }}</el-checkbox>
            <el-checkbox label="gender">{{ $t('vipcard.gender') }}</el-checkbox>
            <el-checkbox label="birthday">{{ $t('vipcard.birthday') }}</el-checkbox>
            <el-checkbox label="email">{{ $t('vipcard.email') }}</el-checkbox>
            <el-checkbox label="address">{{ $t('vipcard.address') }}</el-checkbox>
          </el-checkbox-group>
          <span slot="footer">
            <el-button @click="actInfoDialogVisible = false">{{ $t('vipcard.cancel') }}</el-button>
            <el-button type="primary" @click="handleClickDialogComfim">{{ $t('vipcard.confirm') }}</el-button>
          </span>
        </el-dialog>
      </el-form-item>
      <el-form-item :label="$t('vipcard.operationTips')">
        <el-input v-model="form.operationTip" style="width:300px;margin-right:16px;" @input="handleChangeMaxlengthInput($event, form, 'operationTip', 16)"/>
        <span><span :style="{color: operationTipLength === 16 ? 'red' :'#000'}">{{ operationTipLength }}</span>/16</span>
        <p class="explain">{{ $t('vipcard.operationExplain') }}</p>
      </el-form-item>
      <footer class="footer">
        <el-button :loading="submitLoading" type="primary" @click="submit">{{ $t('vipcard.submit') }}</el-button>
        <el-button @click="goback">{{ $t('vipcard.goBack') }}</el-button>
      </footer>
    </el-form>
  </div>
</template>

<script>
const cnReg = /([\u4e00-\u9fa5]|[\u3000-\u303F]|[\uFF00-\uFF60])/g

/**
 * @param {string} value 字符串的值
 * @returns {number} length 字符串计算长度
*/
function calStrLength(value) {
  const match = value.match(cnReg)
  if (match) {
    return match.length + (value.length - match.length) * 0.5
  }
  return value.length * 0.5
}

export default {
  filters: {
    /**
     * @param {string} value - 以下过滤器入参类型均为string
     * @returns {string|number} - 返回新的字符串或长度
    */
    formatIndex(value) {
      const indexArr = ['一', '二', '三']
      return indexArr[value]
    },
    formatActInfo(value) {
      const infoObj = {
        'phoneNumber': '手机号',
        'name': '姓名',
        'gender': '性别',
        'birthday': '生日',
        'email': '邮箱',
        'address': '详细地址'
      }
      return infoObj[value]
    },
    formatEntryName(value) {
      if (value === '') {
        return '自定义入口(选填)'
      }
      return value
    },
    formatInfoCategory(value) {
      const infoObj = {
        'integration': '积分',
        'level': '等级',
        'coupon': '优惠券'
      }
      return infoObj[value]
    },
    formatInfoLink(value) {
      const infoObj = {
        'integration': '100',
        'level': '钻石会员',
        'coupon': '查看'
      }
      return infoObj[value]
    },
    formatCustomEntryInputLength(value) {
      return calStrLength(value)
    }
  },
  data() {
    return {
      form: {
        businessName: '',
        businessLogo: '',
        couponCoverType: '1',
        couponColor: '#63b359',
        couponImage: '',
        cardTitle: '',
        infoCategory: [],
        effectTime: '1',
        fixedDate: '',
        privelegeDes: '',
        usageNotice: '',
        telephone: '',
        customEntry: [],
        actInfo: [{
          name: 'phoneNumber',
          required: true
        }],
        operationTip: ''
      },
      businessLogoPreview: '',
      couponImagePreview: '',
      couponImageName: '',
      actInfoDialogVisible: false,
      setActInfo: [], // 选取的弹框集合
      loopActInfo: [], // 缓存选取的弹框集合用于回显
      selectedActInfo: ['phoneNumber'],
      predefineColors: [
        '#63b359', '#2c9f67', '#509fc9', '#5885cf', '#9062c0',
        '#d09a45', '#e4b138', '#ee903c', '#dd6549', '#cc463d'
      ],
      submitLoading: false,
      rules: {
        businessName: [
          { required: true, message: this.$t('vipcard.businessNameCheck'), trigger: 'blur' },
          { required: true, message: this.$t('vipcard.businessNameCheck'), trigger: 'change' }
        ],
        businessLogo: [
          { required: true, message: this.$t('vipcard.logoCheck'), trigger: 'change' }
        ],
        cardTitle: [
          { required: true, message: this.$t('vipcard.cardTitleCheck'), trigger: 'blur' },
          { required: true, message: this.$t('vipcard.cardTitleCheck'), trigger: 'change' }
        ],
        telephone: [
          { pattern: /^\d{3}-\d{7,8}$|\d{4}-\d{7,8}$/, message: this.$t('vipcard.phoneNumberCheck'), trigger: 'blur' }
        ],
        privelegeDes: [
          { required: true, message: this.$t('vipcard.privilegeDesCheck'), trigger: 'blur' },
          { required: true, message: this.$t('vipcard.privilegeDesCheck'), trigger: 'change' }
        ]
      }
    }
  },
  computed: {
    cardTitleLength: function() {
      return calStrLength(this.form.cardTitle)
    },
    privelegeDesLength: function() {
      return calStrLength(this.form.privelegeDes)
    },
    usageNoticeLength: function() {
      return calStrLength(this.form.usageNotice)
    },
    operationTipLength: function() {
      return calStrLength(this.form.operationTip)
    },
    businessNameLength: function() {
      return calStrLength(this.form.businessName)
    }
  },
  watch: {
  },
  mounted() {
    this.handleScroll()
    window.addEventListener('scroll', this.handleScroll, true)
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.handleScroll, true)
  },
  methods: {
    /**
     * @param  value 字符串
     * @returns number 返回字符串长度
    */
    formatCustomEntryInputLengthMethod(value) {
      return calStrLength(value)
    },
    formatInfoCategory(value) {
      const infoObj = {
        'integration': 'vipcard.integration',
        'level': 'vipcard.level',
        'coupon': 'vipcard.coupon'
      }
      return this.$t(infoObj[value])
    },
    formatInfoLink(value) {
      const infoObj = {
        'integration': 'vipcard.integrationNum',
        'level': 'vipcard.diamondMember',
        'coupon': 'vipcard.check'
      }
      return this.$t(infoObj[value])
    },
    /**
     * @param {string} value 字符串
     * @param {object} item 要修改的值所在的对象
     * @param {string} key 需要修改的key
     * @param {number} length 限制的字符串长度
    */
    handleChangeMaxlengthInput(value, item, key, length) {
      while (calStrLength(value) > length) {
        value = value.substr(0, value.length - 1)
        this.$nextTick(() => {
          item[key] = value
        })
      }
    },
    handleChangeFixedDate(value) {
      console.log(value)
    },
    /**
     * 在mounted执行后挂载在window.onscroll上的方法，
     * 用于设置预览块的sticky效果
    */
    handleScroll() {
      const preview = document.getElementById('preview')
      const form = document.getElementById('form')
      const { top } = form.getBoundingClientRect()
      if (top < 50) {
        preview.style.position = 'fixed'
        preview.style.width = '320px'
        preview.style.top = '80px'
        form.style.marginLeft = '360px'
      } else if (top > 50) {
        preview.style.position = 'static'
        preview.style.width = ''
        form.style.marginLeft = '40px'
      }
    },
    handleChangeLogo(e) {
      const file = e.target.files[0]
      const fileReader = new FileReader()
      if (!file) {
        return
      }
      if (file) {
        if (/\.(jpe?g|png|jpg)$/i.test(file.name)) {
          fileReader.readAsDataURL(file)
        } else {
          this.$message.error(this.$t('vipcard.imageCheck'))
          return
        }
      }
      const that = this
      this.form.businessLogo = file
      fileReader.onload = function() {
        const { result } = fileReader
        that.businessLogoPreview = result
      }
    },
    handleChangeCoverImage(e) {
      const file = e.target.files[0]
      const fileReader = new FileReader()
      if (!file) {
        return
      }
      if (file) {
        if (/\.(jpe?g|png|gif|jpg)$/i.test(file.name)) {
          fileReader.readAsDataURL(file)
        } else {
          this.$message.error(this.$t('vipcard.imageCheck'))
          return
        }
      }
      const that = this
      this.form.couponImage = file
      fileReader.onload = function() {
        const { result } = fileReader
        that.couponImagePreview = result
      }
    },
    addCustomEntry() {
      this.form.customEntry.push({
        entryName: '',
        guideLang: '',
        jumpType: 1,
        pageLink: '',
        miniAppId: '',
        miniAppPath: ''
      })
    },
    /**
     * 用于动态删除自定义入口项
     * @param {number} index
     * @returns {undefined}
    */
    deleteCustomEntry(index) {
      this.form.customEntry.splice(index, 1)
    },
    /**
     * @param {boolean} value - 复选框选中的当前布尔值
     * @param {object} item - 要修改的对象
    */
    handleChangeActInfoItem(value, item) {
      item.required = value
    },
    handleClickDialogComfim() {
      this.loopActInfo = [...this.setActInfo]
      this.selectedActInfo = ['phoneNumber']
      const obj = this.setActInfo.map((item) => ({ name: item, required: false }))
      this.form.actInfo = [{ name: 'phoneNumber', required: true }, ...obj]
      this.actInfoDialogVisible = false
    },
    handleOpenDialog() { // 打开对话框回显选择的选项
      this.setActInfo = [...this.loopActInfo]
    },
    submit() {
      // 替换换行符
      const str = this.form.privelegeDes.replace(/\n/g, '<br/>')
      console.log(str)
      this.$refs.form.validate((valid, obj) => {
        if (this.form.couponCoverType === '2' && !this.form.couponImage) { // 图片封面
          this.$message.error(this.$t('vipcard.coverCheck'))
          return
        }
        if (this.form.effectTime === '2' && !this.form.fixedDate) { // 固定日期
          this.$message.error(this.$t('vipcard.fixedDateCheck'))
          return
        }
        if (this.form.customEntry.length) {
          const length = this.form.customEntry.length
          for (let i = 0; i < length; i++) {
            const item = this.form.customEntry[i]
            const { entryName, guideLang, jumpType, pageLink, miniAppId, miniAppPath } = item
            if (!entryName || !guideLang) {
              this.$message.error(this.$t('vipcard.customEntryCheck'))
              return false
            }
            if (jumpType === 1 && !pageLink) {
              this.$message.error(this.$t('vipcard.customEntryCheck'))
              return false
            }
            if (jumpType === 2 && !miniAppId || jumpType === 2 && !miniAppPath) {
              this.$message.error(this.$t('vipcard.customEntryCheck'))
              return false
            }
          }
        }
        if (valid) {
          this.submitLoading = true
          setTimeout(() => {
            this.submitLoading = false
            console.log(this.form)
            this.$router.push('/vipcard/vipcardpreview')
          }, 2000)
        } else {
          return false
        }
      })
    },
    goback() {
      console.log('goback')
      this.$confirm(this.$t('vipcard.goBackConfirm'), this.$t('vipcard.tip'), {
        confirmButtonText: this.$t('vipcard.confirmButtonText'),
        cancelButtonText: this.$t('vipcard.cancelButtonText'),
        type: 'warning'
      }).then(() => {
        this.$router.push('/vipcard/vipcardpreview')
      }).catch(() => {
      })
    }
  }
}
</script>

<style lang="less" scoped>
  .vipCardFormWrapper {
    display: flex;
    padding: 50px 20px;
    position: relative;
    .preview {
      // width: 320px;
      height: 570px;
      flex-basis: 320px;
      flex-shrink: 0;
      background-color: #f6f6f8;
      border: 1px solid #e7e7eb;
      .cardWrapper {
        padding: 80px 26px 10px;
        background-image: url('/static/WechatVipCard/topBackground.png');
        background-repeat: no-repeat;
        background-color: #fff;
        .card {
          border: 1px solid #ccc;
          position: relative;
          background-size: cover;
          background-position: top center;
          height: 137px;
          border-radius: 12px;
          .logo {
            position: absolute;
            display: block;
            width: 38px;
            height: 38px;
            top: 24px;
            left: 20px;
            background-color: #fff;
            border:1px solid #e7e7eb;
            border-radius: 22px;
            font-size: 24px;
            img {
              width:100%;
              height: 100%;
              display: block;
              border-radius: 50%;
            }
          }
          .logoArea {
            padding: 24px 20px 12px 66px;
            line-height: 20px;
            color: #fff;
            font-size: 14px;
            font-weight: bolder;
            text-shadow: 1px 1px 3px #666;
            .cardTitle {
              font-size: 14px;
              font-weight: bold;
            }
            .qrcode {
              width: 36px;
              height: 36px;
              background: url('/static/WechatVipCard/vipCardQrcode.png') 0 -147px no-repeat;
              position: absolute;
              top: 26px;
              right: 20px;
            }
          }
          .msgArea {
            padding: 2px 20px 10px;
            position: absolute;
            bottom: 0;
            width: 100%;
            .memberNumber {
              font-size: 17px;
              font-family: menlo,tahoma;
              text-shadow: 1px 1px 2px #666;
              line-height: 18px;
              color: #fff;
            }
            .iconInfo {
              display: block;
              width: 18px;
              height: 18px;
              float: right;
              background: url('/static/WechatVipCard/vipCardQrcode.png') 0 -187px no-repeat;
            }
          }
        }
      }
      .infoCategoryWrapper {
        background-color: #fff;
        .borderBottom {
          padding-bottom: 20px;
          border-bottom: 1px solid #e7e7eb;
          .borderRight {
            border-right: 1px solid #e7e7eb;
          }
          .borderRight:last-of-type{
            border-right: none;
          }
          .title {
            font-size: 12px;
            text-align: center;
            margin-bottom: 10px;
          }
          .link {
            color: rgb(219, 152, 86);
            text-align: center;
          }
        }
      }
      .listWrapper {
        background-color: #fff;
        ul.list {
          margin: 0 10px;
          // border-bottom: 1px solid #e7e7eb;
          li {
            position: relative;
            .panel {
              font-size: 14px;
              padding: 11px 30px 11px 0;
              border-bottom: 1px solid #e7e7eb;
              .icon {
                position: absolute;
                top: 36%;
                right: 5px;
                width: 16px;
                height: 15px;
                background: url('/static/WechatVipCard/vipCardQrcode.png') 0 -128px no-repeat;
              }
            }
            &:last-of-type {
              .panel {
                border-bottom: none;
              }
            }
          }
        }
      }
      .customEntryWrapper {
        margin-top: 14px;
        background-color: #fff;
        ul.list {
          margin: 0 10px;
          li {
            position: relative;
            .panel {
              font-size: 14px;
              padding: 11px 30px 11px 0;
              border-bottom: 1px solid #e7e7eb;
              .guideLang {
                color: #8d8d8d;
                float: right;
              }
              .icon {
                position: absolute;
                top: 36%;
                right: 5px;
                width: 16px;
                height: 15px;
                background: url('/static/WechatVipCard/vipCardQrcode.png') 0 -128px no-repeat;
              }
            }
            &:last-of-type {
              .panel {
                border-bottom: none;
              }
            }
          }
        }
      }
    }
    .form {
      margin-left: 40px;
      padding: 10px 30px 50px;
      flex-grow: 1;
      background-color: rgb(244, 245, 249);
      font-size: 12px;
      /deep/ .el-form-item__label {
        font-size: 12px;
        font-weight: normal;
      }
      /deep/ .el-radio__label {
        font-size: 12px;
      }
      /deep/ .el-checkbox__label {
        font-size: 12px;
      }
      .title {
        font-size: 14px;
        color: #333;
        position: relative;
        margin-top: 40px;
        margin-bottom: 36px;
        &::after {
          content: '';
          display: block;
          background-color: #ccc;
          height: 2px;
          margin-top: 14px;
        }
        &::before {
          content: '';
          display: inline-block;
          background-color: #428bca;
          width: 3px;
          height: 20px;
          margin-right: 10px;
          vertical-align: middle;
        }
        .deleteBtn {
          cursor: pointer;
          color: blue;
          float: right;
        }
      }
      .couponCover {
        .couponColor {
          label {
            display: inline-block;
            vertical-align: middle;
          }
          span {
            display: inline-block;
            vertical-align: middle;
            margin-left: 8px;
          }
        }
        .couponImage {
          label {
            vertical-align: middle;
            display: inline-block;
            position: relative;
            margin-left: 10px;
            input[type=file] {
              width: 90px;
              font-size: 14px;
              opacity: 0;
              cursor: pointer;
              position: relative;
              z-index: 99;
            }
            .button {
              z-index: 9;
              display: flex;
              justify-content: center;
              align-items: center;
              position: absolute;
              left: 0;
              top: 0;
              bottom: 0;
              width: 90px;
              height: 100%;
              background-color: #ccc;
              border-radius: 4px;
              cursor: pointer;
            }
            span {
              font-weight: normal;
              font-size: 14px;
              a {
                color: blue;
              }
            }
          }
        }
      }
      .merchantLogoFormItem {
        display: flex;
        align-items: center;
        span {
          margin-left: 16px;
        }
        /deep/ .el-form-item__content {
          margin-left: 0 !important;
          display: flex;
          align-items: center;
        }
        .merchantLogo {
          display: inline-block;
          position: relative;
          input[type="file"] {
            width: 70px;
            height: 70px;
            border-radius: 50%;
            border: 1px solid #000;
            cursor: pointer;
            opacity: 0.5;
            &::-webkit-file-upload-button{
              display: none;
            }
          }
          img {
            position: absolute;
            width: 70px;
            height: 70px;
            top:0;
            border-radius: 50%;
            cursor:pointer;
          }
          .text {
            position:absolute;
            top: 50%;
            left: 50%;
            text-align: center;
            width: 100%;
            transform: translate(-50%, -50%);
            font-size: 12px;
            font-weight: normal;
            cursor: pointer;
            &::before {
              content: '+';
              display: block;
              height: 35px;
            }
          }
        }
      }
      .explain {
        font-size: 12px;
        color: #999999;
      }
      footer {
        text-align: center;
        margin-top: 40px;
      }
    }
  }
</style>
