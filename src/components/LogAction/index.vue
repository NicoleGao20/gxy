<template>
  <el-select v-model="memberType" v-bind="config" style="width: 100%;" @input="changeValue">
    <el-option v-for="(Item, index) in Items" :key="index" :value="Item.actionName" :label="Item.actionCname"/>
  </el-select>
</template>
<script type="text/javascript">
export default {
  name: 'BelleMemberType',
  props: {
    value: {
      type: [Array, String],
      default() {
        return ''
      }
    },
    config: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      memberType: this.value || '',
      Items: []
    }
  },
  watch: {
    value(newValue) {
      this.memberType = newValue
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      const obj = {}
      if (this.config.moduleCode) {
        obj.moduleCode = this.config.moduleCode
      }
      this.$request({
        url: '/system/log/log_action',
        method: 'get',
        params: obj
      }).then((res) => {
        if (res.code === 1) {
          this.Items = res.data.list
        }
      })
    },
    changeValue() {
      this.$emit('input', this.memberType)
    }
  }
}
</script>
