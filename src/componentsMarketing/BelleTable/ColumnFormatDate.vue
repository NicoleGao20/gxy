<template>
  <el-table-column :width="column.width||'auto'" :prop="column.column_name" :label="column.column_name_show">
    <template slot-scope="scope">{{ formatDate(new Date(scope.row[column.column_name]), 'yyyy-MM-dd hh:mm:ss') }}</template>
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
  },
  methods: {
    formatDate(date, fmt) {
      var o = {
        'M+': date.getMonth() + 1,
        'd+': date.getDate(),
        'h+': date.getHours(),
        'm+': date.getMinutes(),
        's+': date.getSeconds(),
        'q+': Math.floor((date.getMonth() + 3) / 3),
        'S': date.getMilliseconds()
      }
      if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(
          RegExp.$1,
          (date.getFullYear() + '').substr(4 - RegExp.$1.length)
        )
      }
      for (var k in o) {
        if (new RegExp('(' + k + ')').test(fmt)) {
          fmt = fmt.replace(
            RegExp.$1,
            RegExp.$1.length === 1
              ? o[k]
              : ('00' + o[k]).substr(('' + o[k]).length)
          )
        }
      }
      return fmt
    }
  }
}
</script>
