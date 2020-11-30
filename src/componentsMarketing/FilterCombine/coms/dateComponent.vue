<template>
  <div>
    <el-form-item label-width="0" style="display: inline-block;width: 150px;">
      <el-tooltip :content="conf.column_name_show" class="item" effect="light" placement="bottom">
        <el-input v-model="conf.column_name_show" disabled/>
      </el-tooltip>
    </el-form-item>
    <el-form-item
      v-if="conf.is_multiple === 'N'"
      :rules="{
        required: (!conf.is_allow_null||conf.is_allow_null === 'N')? true: false, message: '请选择'+conf.column_name_show, trigger: 'change'
      }"
      :prop="prefixProp+'.column_value'"
      style="display: inline-block;"
      label-width="20px">
      <el-date-picker
        v-model="column_value"
        :disabled="filterCombine.onlyRead"
        :append-to-body="false"
        placeholder="请选择日期"
        @change="changeSpecItem"/>
    </el-form-item>
    <el-form-item
      v-if="conf.is_multiple === 'Y'"
      :rules="{
        required: (!conf.is_allow_null||conf.is_allow_null === 'N')? true: false, message: '请选择'+conf.column_name_show, trigger: 'change'
      }"
      :prop="prefixProp+'.column_value'"
      style="display: inline-block;"
      label-width="20px">
      <el-date-picker
        v-model="column_value"
        :disabled="filterCombine.onlyRead"
        :append-to-body="false"
        format="yyyy-MM-dd HH:mm:ss"
        value-format="yyyy-MM-dd HH:mm:ss"
        type="datetimerange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        @change="changeSpecItem"/>
    </el-form-item>
  </div>
</template>
<script>

export default {
  name: 'DateComponent',
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

    var value = /^@([^,]+),(.+)/.exec(this.specItem.column_value)

    if (this.conf.is_multiple === 'Y') {
      if (value) {
        column_value = value.slice(1, 3)
      } else {
        column_value = ['', '']
      }
    } else {
      if (this.specItem.column_value) {
        column_value = this.specItem.column_value.slice(1)
      } else {
        column_value = ''
      }
    }

    return {
      column_value: column_value,
      is_multiple: this.conf.is_multiple
    }
  },
  methods: {
    changeSpecItem() {
      if (this.is_multiple === 'Y') {
        if (this.column_value) {
          if (this.column_value[1] && this.column_value[0]) {
            this.specItem.column_value = '@' + this.column_value.join(',')
          } else if (this.column_value[0]) {
            this.specItem.column_value = '@' + this.column_value.join(',')
          } else if (this.column_value[1]) {
            this.specItem.column_value = '@,' + this.column_value.join(',')
          } else {
            this.specItem.column_value = ''
          }
        } else {
          this.specItem.column_value = ''
        }
      } else {
        if (this.column_value) {
          this.specItem.column_value = '@' + new Date(this.column_value).Format('yyyy-MM-dd hh:mm:ss')
        } else {
          this.specItem.column_value = ''
        }
      }
    }
  }
}
</script>
