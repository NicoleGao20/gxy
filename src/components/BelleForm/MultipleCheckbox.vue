<template>
  <el-form-item
    :label="formItem.column_name_show"
    :prop="formItem.column_name"
    :rules="formItem.rules">
    <el-checkbox-group
      v-model="form[formItem.prop]" >
      <el-checkbox v-for="(item, index) in formItem.column_options" :key="index" :label="item.id">{{ item.column_name_show }}</el-checkbox>
    </el-checkbox-group>
  </el-form-item>
</template>

<script>
export default {
  name: 'MultipleCheckbox',
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
