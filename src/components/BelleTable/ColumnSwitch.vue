<template>
  <el-table-column
    :width="column.width||'auto'"
    :prop="column.column_name"
    :label="column.column_name_show" >
    <template slot-scope="scope">
      <el-switch
        v-model="scope.row[column.prop]"
        disabled
        active-value="Y"
        inactive-value="N" />
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
