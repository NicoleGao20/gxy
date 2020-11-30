<template>
  <el-cascader
    ref="cascader"
    :border="false"
    :options="options"
    :props="props"
    :show-all-levels="false"
    style="width: 100%;"
    filterable
    @change="getCascaderValue"
  />
</template>
<script>

export default {
  name: 'CascaderWrap',
  inject: ['filterCombine'],
  props: {
    type: {
      type: String,
      default() {
        return ''
      }
    }
  },
  data() {
    return {
      props: {
        label: 'class_name',
        value: 'class_id',
        expandTrigger: 'hover'
      }
    }
  },
  computed: {
    options() {
      return this.filterCombine.cascaderItems || []
    }
  },
  methods: {
    getCascaderValue() {
      this.$nextTick(()=> {
        var curNodeValue = this.$refs['cascader'].getCheckedNodes()[0].data
        this.$emit('curSelectNode', curNodeValue)
      })
    }
  }
}
</script>
