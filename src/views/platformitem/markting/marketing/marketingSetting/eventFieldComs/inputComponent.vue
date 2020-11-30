<template>
  <div>
    <el-form-item :label="conf.column_name_show" label-width="90px">
      <el-input v-model="specItem.column_value" :disabled="onlyRead" placeholder="多值请使用英文,分隔"/>
    </el-form-item>
  </div>
</template>
<script>
export default {
  name: 'InputComponent',
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
  }
}
</script>
