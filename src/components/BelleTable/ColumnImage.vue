<template>
  <el-table-column
    :prop="column.column_name"
    :width="column.width||'auto'"
    :label="column.column_name_show">
    <template slot-scope="scope">
      <div style="width: 50px;height: 50px;">
        <img :src="scope.row[column.column_name]" width="100%">
      </div>
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
