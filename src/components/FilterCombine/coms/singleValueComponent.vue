<template>
  <el-form-item style="display: inline-block;width: 150px;">
    <el-tooltip class="item" effect="light" :content="column_name_show" placement="bottom">
      <el-input v-model="column_name_show" disabled/>
    </el-tooltip>
  </el-form-item>
</template>
<script>

export default {
  name: 'SingleValueCom',
  props: {
    specItem: {
      type: Object,
      default() {
        return {}
      }
    },
    conf: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    this.specItem.column_value = this.conf.column_id
    return {
      column_name_show: this.conf.column_name_show || this.conf.label_name
    }
  }
}
</script>
