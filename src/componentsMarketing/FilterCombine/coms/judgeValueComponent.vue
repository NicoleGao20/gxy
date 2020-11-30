<template>
  <div>
    <el-form-item label-width="0" style="display: inline-block;width: 150px;">
      <el-tooltip :content="conf.column_name_show" class="item" effect="light" placement="bottom">
        <el-input v-model="conf.column_name_show" disabled/>
      </el-tooltip>
    </el-form-item>
    <el-form-item
      :prop="prefixProp+'.column_value'"
      :rules="{
        message: '请填写', trigger: 'change', validator: vaidateOperatorValueHandler
      }"
      label-width="20px"
      style="display: inline-block;width: 140px;">
      <el-select v-model="operator" :disabled="filterCombine.onlyRead" :popper-append-to-body="false" placeholder="请选择符号" clearable @change="changeSpecItem">
        <el-option v-for="(option, index) in options" :key="index" :label="option.label" :value="option.value"/>
      </el-select>
    </el-form-item>
    <el-form-item
      :rules="{
        trigger: 'change', validator: vaidateStartValueHandler
      }"
      :prop="prefixProp+'.column_value'"
      label-width="20px"
      style="display: inline-block;width: 120px;">
      <el-input v-model="startValue" :disabled="filterCombine.onlyRead" :placeholder="operator === '$'?'起始值':'值'" clearable @change="changeSpecItem"/>
    </el-form-item>
    <el-form-item
      v-if="operator === '$'"
      :prop="prefixProp+'.column_value'"
      :rules="{
        trigger: 'change', validator: vaidateEndValueHandler
      }"
      label-width="20px"
      style="display: inline-block;width: 120px;">
      <el-input v-model="endValue" :disabled="filterCombine.onlyRead" placeholder="截止值" clearable @change="changeSpecItem"/>
    </el-form-item>
  </div>
</template>
<script>

// :prop="prefixProp+'.column_value'"
export default {
  name: 'JudeValueCom',
  inject: ['filterCombine'],
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
    prefixProp: {
      type: String,
      default() {
        return ''
      }
    }
  },
  data() {
    /**
     * [
          ">=500",
          ">500",
          "<=500",
          "<500",
          "=500",
          "$500,1000",
          ""
        ]
     */

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
        this.specItem.column_value = '$' + (this.startValue || '') + ',' + (this.endValue || '')
      } else {
        this.specItem.column_value = this.operator + this.startValue
      }
    },
    vaidateOperatorValueHandler(rule, value, cb) {
      if (!this.conf.is_allow_null || this.conf.is_allow_null === 'N') {
        if (!this.operator) {
          return cb(new Error(rule.message))
        }
      } else {
        if (this.startValue) {
          if (!this.operator) {
            return cb(new Error(rule.message))
          }
        }
      }
      cb()
    },
    vaidateStartValueHandler(rule, value, cb) {
      if (!this.conf.is_allow_null || this.conf.is_allow_null === 'N') {
        if (!this.startValue) {
          return cb(new Error('请填写'))
        } else if (!/^(0|[1-9][0-9]*(.[0-9]+)?)$/.test(this.startValue)) {
          return cb(new Error('请填写数值'))
        }
        cb()
      } else {
        if (this.operator) {
          if (!this.startValue) {
            return cb(new Error('请填写数值'))
          }
        }
      }
      cb()
    },
    vaidateEndValueHandler(rule, value, cb) {
      if (!this.endValue) {
        return cb(new Error('请填写'))
      } else if (!/^(0|[1-9][0-9]*(.[0-9]+)?)$/.test(this.endValue)) {
        return cb(new Error('请填写数值'))
      } else {
        if (!this.startValue) {
          return cb(new Error('请填写起始值'))
        } else if (!/^(0|[1-9][0-9]*(.[0-9]+)?)$/.test(this.startValue)) {
          return cb(new Error('起始请填写数值'))
        } else {
          if (Number(this.endValue) <= Number(this.startValue)) {
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
