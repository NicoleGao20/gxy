<template>
  <el-form-item
    :label="formItem.column_name_show"
    :prop="formItem.column_name"
    :rules="formItem.rules">
    <el-select v-model="form[formItem.column_name]" :multiple="formItem.data_format=='array'" style="width: 100%;" clearable >
      <el-option v-for="(item, index) in formItem.column_options" :key="index" :value="item.id" :label="item.column_name_show" />
    </el-select>
  </el-form-item>
</template>

<script>
export default {
  name: 'MultipleSelect',
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
