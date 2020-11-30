<template>
  <div>
    <el-form-item label-width="0" style="display: inline-block;width: 150px;">
      <el-tooltip class="item" effect="light" :content="conf.column_name_show" placement="bottom">
        <el-input v-model="conf.column_name_show" disabled/>
      </el-tooltip>
    </el-form-item>
    <el-form-item
      v-if="conf.is_multiple==='N'"
      :rules="{
        required: true, message: '请选择'+conf.column_name_show, trigger: 'change'
      }"
      :prop="prefixProp+'.column_value'"
      style="display: inline-block;"
      label-width="20px">
      <el-radio-group v-model="column_value" :disabled="filterCombine.onlyRead" @input="changeSpecItem">
        <el-radio v-for="(option, index) in enums" :label="option.enum_value" :key="index">{{ option.enum_name }}</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item
      v-if="conf.is_multiple==='Y'"
      :rules="{
        required: true, message: '请选择'+conf.column_name_show, trigger: 'change'
      }"
      :prop="prefixProp+'.column_value'"
      style="display: inline-block;"
      label-width="20px">
      <el-checkbox-group v-model="column_value" :disabled="filterCombine.onlyRead" @input="changeSpecItem">
        <el-checkbox v-for="(option, index) in enums" :label="option.enum_value" :key="index">{{ option.enum_name }}</el-checkbox>
      </el-checkbox-group>
    </el-form-item>
  </div>
</template>
<script>

export default {
  name: 'EnumCom',
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
    if (this.specItem.column_value) {
      if (this.conf.is_multiple === 'Y') {
        column_value = this.specItem.column_value.split(',')
      } else {
        column_value = this.specItem.column_value || ''
      }
    } else {
      if (this.conf.is_multiple === 'Y') {
        column_value = []
      } else {
        column_value = ''
      }
    }

    return {
      column_value: column_value,
      enums: this.conf.enums
    }
  },
  methods: {
    changeSpecItem() {
      if (this.conf.is_multiple === 'Y') {
        this.specItem.column_value = this.column_value.join(',')
      } else {
        this.specItem.column_value = this.column_value
      }
    }
  }
}
</script>
