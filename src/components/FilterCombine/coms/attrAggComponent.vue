<template>
  <div>
    <el-input v-model="conf.label_name" type="primary" disabled style="margin-bottom: 15px;"/>
    <div style="padding-left: 20px;">
      <div v-for="(aggItem, index) in conf.columns" :key="index" style="margin-bottom: 15px;">
        <component :conf="conf.columns[index]" :prefix-prop="prefixProp+'.columns.'+index" :spec-item="specItem.columns[index]" :is="aggItem.component_type" />
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'AggComponent',
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
    },
    prefixProp: {
      type: String,
      default() {
        return ''
      }
    }
  }
}
</script>
