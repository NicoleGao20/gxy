<template>
  <el-table-column
    :width="column.width||'auto'"
    :prop="column.column_name"
    :label="column.column_name_show" >
    <template slot-scope="scope">
      {{ scope.row[column.column_name] == "Y" ? "是" : "否" }}
    </template>
  </el-table-column>
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
