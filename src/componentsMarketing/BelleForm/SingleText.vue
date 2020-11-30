<template>
  <el-form-item
    :label="formItem.column_name_show"
    :prop="formItem.column_name"
    :rules="formItem.rules">
    <el-input v-model="form[formItem.column_name]" clearable />
  </el-form-item>
</template>

<script>
export default {
  name: 'SingleText',
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
