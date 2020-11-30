<template>
  <el-form-item :label="conf.column_name_show" label-width="90px">
    <el-cascader
      ref="cascader"
      v-model="cascaderValue"
      :disabled="onlyRead"
      :props="cascaderProps"
      :show-all-levels="false"
      :options="cascaderOptions"
      style="width: 100%;"
      @change="changeHandler"/>
  </el-form-item>
</template>
<script>
export default {
  name: 'WechatMenuComponent',
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
    onlyRead: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      cascaderValue: this.specItem.column_web_value || '',
      cascaderOptions: [],
      cascaderProps: {
        children: 'children',
        label: 'menuName',
        value: 'menuName'
      }
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      var options = this.conf.interface || []

      for (var i = 0; i < options.length; i++) {
        if (options[i].subList && options[i].subList.length) {
          options[i].children = options[i].subList
          delete options[i].subList
        }
      }
      this.cascaderOptions = options
    },
    changeHandler() {
      this.$nextTick(() => {
        var curNodeValue = this.$refs['cascader'].getCheckedNodes()[0].data
        this.specItem.column_value = curNodeValue.menuName
        this.specItem.column_web_value = this.cascaderValue
      })
    }
  }
}
</script>
