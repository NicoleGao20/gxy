<template>
  <el-form-item
    :label="formItem.column_name_show"
    :prop="formItem.column_name"
    :rules="formItem.rules">
    <el-switch
      v-model="form[formItem.column_name]"
      active-value="Y"
      inactive-value="N" />
  </el-form-item>
</template>

<script>
export default {
  name: 'ToggleSwitch',
  props: {
    formItem: {
      type: Object,
      default() {
        return {}
      }
    },
    form: {
      type: Object,
      default() {
        return {}
      }
    }
  }
}
</script>
