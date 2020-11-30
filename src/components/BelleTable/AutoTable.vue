<template>
  <el-table
    stripe
    :border="border"
    :max-height="maxHeight"
    :data="rows">
    <component v-for="(column, index) in columns" :is="tableColumnMapComponent[column.display_type]" :column="column" :key="index"/>
    <slot />
  </el-table>
</template>

<script>
const TableColumnMapComponent = {
  text: 'ColumnText',
  image: 'ColumnImage',
  datepicker: 'ColumnFormatDate',
  switch: 'ColumnSwitch',
  status: 'ColumnStatus',
  select: 'ColumnSelect',
  radio: 'ColumnRadio'
}

export default {
  props: {
    rows: {
      type: Array,
      default() {
        return []
      }
    },
    maxHeight: {
      type: String,
      default: '1000000px'
    },
    border: {
      type: Boolean,
      default: false
    },
    columns: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      tableColumnMapComponent: TableColumnMapComponent
    }
  }
}
</script>
