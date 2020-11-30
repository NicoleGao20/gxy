<template>
  <el-form-item style="display: inline-block;width: 150px;">
    <el-tooltip :content="column_name_show" class="item" effect="light" placement="bottom">
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
    this.specItem.column_value = this.conf.column_id || this.conf.id
    return {
      column_name_show: this.conf.column_name_show || this.conf.label_name
    }
  }
}
</script>
