<template>
  <div>
    <el-form-item label-width="0" style="display: inline-block;width: 90px;">
      <el-tooltip class="item" effect="light" :content="conf.column_name_show" placement="bottom">
        <el-input v-model="conf.column_name_show" disabled/>
      </el-tooltip>
    </el-form-item>
    <el-form-item 
      :rules="{
        required: true, message: '请填写'+conf.column_name_show, trigger: 'change'
      }"
      :prop="prefixProp+'.column_value'"
      style="display: inline-block;"
      label-width="20px">
      <el-input v-model="specItem.column_value" :disabled="filterCombine.onlyRead" :placeholder="conf.is_multiple==='Y'?'多值请使用英文,分隔':'请填写'+conf.column_name_show" clearable/>
    </el-form-item>
  </div>
</template>
<script>
export default {
  name: 'InputComponent',
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
  }
}
</script>
