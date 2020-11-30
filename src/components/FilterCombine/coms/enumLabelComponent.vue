<template>
  <div>
    <el-form-item label-width="0" style="display: inline-block;width: 150px;">
      <el-tooltip class="item" effect="light" :content="conf.label_name" placement="bottom">
        <el-input  v-model="conf.label_name" disabled/>
      </el-tooltip>
    </el-form-item>
    <el-form-item
      v-if="conf.label_values.length"
      :rules="{
        required: true, message: '请选择'+conf.label_name, trigger: 'change'
      }"
      :prop="prefixProp+'.column_value'"
      style="display: inline-block;"
      label-width="20px">
      <el-checkbox-group :disabled="conf.label_values.length === 1 || filterCombine.onlyRead " v-model="column_value" @input="changeSpecItem">
        <el-checkbox v-for="(option, index) in conf.label_values" :label="option.label_value_code" :key="index">{{ option.label_value }}</el-checkbox>
      </el-checkbox-group>
    </el-form-item>
  </div>
</template>
<script>

export default {
  name: 'EnumLabelCom',
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
     * column_value 数据模型
     * 区间"@20,500"
     * 符号">=200"
     * 枚举多值  "A,B,C"
     * 单值字符串
    */
    var column_value
    if (parseInt(this.conf.label_value_cnt) === 1) {
      if (this.conf.label_values.length) {
        column_value = [ this.specItem.column_value || this.conf.label_values[0].label_value_code ]
        // label_value_cnt = 1 时自动赋值
        this.specItem.column_value = column_value.join(",")
      }
    } else if (this.conf.label_value_cnt > 1) {
      if (this.conf.label_values.length) {
        if (this.specItem.column_value) {
          column_value = this.specItem.column_value.split(',')
        } else {
          column_value = []
        }
      }
    }

    return {
      column_value: column_value
    }
  },
  methods: {
    changeSpecItem() {
      this.specItem.column_value = this.column_value.join(',')
    }
  }
}
</script>
