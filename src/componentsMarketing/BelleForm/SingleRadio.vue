<template>
  <el-form-item
    :label="formItem.column_name_show"
    :prop="formItem.column_name"
    :rules="formItem.rules">
    <el-radio-group v-model="form[formItem.column_name]">
      <el-radio v-for="(item, index) in formItem.column_options" :key="index" :label="item.id">{{ item.column_name_show }}</el-radio>
    </el-radio-group>
  </el-form-item>
</template>

<script>
export default {
  name: 'SingleRadio',
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
