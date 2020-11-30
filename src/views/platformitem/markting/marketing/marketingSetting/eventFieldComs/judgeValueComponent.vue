<template>
  <el-form-item :label="conf.column_name_show" label-width="90px" style="margin-bottom: 0;">
    <el-form-item
      :rules="{
        message: '请填写', trigger: 'change', validator: vaidateOperatorValueHandler
      }"
      prop="operator"
      style="display: inline-block;width: 140px;">
      <el-select v-model="operator" :disabled="onlyRead" :popper-append-to-body="false" placeholder="请选择符号" clearable @change="changeSpecItem">
        <el-option v-for="(option, index) in options" :key="index" :label="option.label" :value="option.value"/>
      </el-select>
    </el-form-item>
    <el-form-item
      :rules="{
        trigger: 'change', validator: vaidateStartValueHandler
      }"
      prop="startValue"
      style="display: inline-block;width: 90px;">
      <el-input v-model="startValue" :disabled="onlyRead" :placeholder="operator === '$'?'起始值':'值'" @change="changeSpecItem"/>
    </el-form-item>
    <el-form-item
      v-if="operator === '$'"
      :rules="{
        trigger: 'change', validator: vaidateEndValueHandler
      }"
      prop="endValue"
      label-width="20px"
      style="display: inline-block;width: 90px;">
      <el-input v-model="endValue" :disabled="onlyRead" placeholder="截止值" @change="changeSpecItem"/>
    </el-form-item>
  </el-form-item>
</template>
<script>

export default {
  name: 'JudeValueCom',
  props: {
    specItem: {
      type: Object,
      default() {
        return {}
      }
    },
    conf: {
      type: Object,
      default() {
        return {}
      }
    },
    onlyRead: {
      type: Boolean,
      default: false
    }
  },
  data() {
    var values = /^([\$>=<]+)([^\,]*)(\,([^\,]*))?/.exec(this.specItem.column_value)
    var operator
    var startValue
    var endValue

    if (values) {
      operator = values[1]
      startValue = values[2]
      endValue = values[4]
    }

    return {
      operator: operator || '',
      startValue: startValue || '',
      endValue: endValue || '',
      options: [
        {
          label: '等于',
          value: '='
        },
        {
          label: '不等于',
          value: '!='
        },
        {
          label: '小于',
          value: '<'
        },
        {
          label: '小于等于',
          value: '<='
        },
        {
          label: '大于',
          value: '>'
        },
        {
          label: '大于等于',
          value: '>='
        },
        {
          label: '区间',
          value: '$'
        }
      ]
    }
  },
  methods: {
    changeSpecItem() {
      if (this.operator === '$') {
        this.specItem.column_value = '$' + this.startValue + ',' + this.endValue
      } else {
        this.specItem.column_value = this.operator + this.startValue
      }
    },
    vaidateOperatorValueHandler(rule, value, cb) {
      if (this.startValue) {
        if (!this.operator) {
          this.$emit('validateError')
          return cb(new Error(rule.message))
        }
      }
      cb()
    },
    vaidateStartValueHandler(rule, value, cb) {
      if (this.operator) {
        if (!this.startValue) {
          this.$emit('validateError')
          return cb(new Error('请填写'))
        } else if (!/^(0|[1-9][0-9]*(.[0-9]+)?)$/.test(this.startValue)) {
          this.$emit('validateError')
          return cb(new Error('请填写数值'))
        }
      }
      cb()
    },
    vaidateEndValueHandler(rule, value, cb) {
      if (!this.endValue) {
        this.$emit('validateError')
        return cb(new Error('请填写'))
      } else if (!/^(0|[1-9][0-9]*(.[0-9]+)?)$/.test(this.endValue)) {
        this.$emit('validateError')
        return cb(new Error('请填写数值'))
      } else {
        if (!this.startValue) {
          this.$emit('validateError')
          return cb(new Error('请填写起始值'))
        } else if (!/^(0|[1-9][0-9]*(.[0-9]+)?)$/.test(this.startValue)) {
          this.$emit('validateError')
          return cb(new Error('起始请填写数值'))
        } else {
          if (Number(this.endValue) <= Number(this.startValue)) {
            this.$emit('validateError')
            return cb(new Error('截止值需大于起始值'))
          } else {
            return cb()
          }
        }
      }
    }
  }
}
</script>
