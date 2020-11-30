<template>
  <el-table-column
    :width="column.width||'auto'"
    :prop="column.column_name"
    :label="column.column_name_show" />
</template>

<script>
export default {
  props: {
    column: {
      type: Object,
      default() {
        return {}
      }
    }
  }
}
</script>
