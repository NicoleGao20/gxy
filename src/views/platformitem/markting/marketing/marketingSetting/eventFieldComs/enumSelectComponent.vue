<template>
  <div>
    <el-form-item
      :label="conf.column_name_show"
      style="display: inline-block;"
      label-width="90px"
    >
      <el-select :popper-append-to-body="false" :collapse-tags="true" :multiple="conf.is_multiple==='Y'" v-model="column_value" :disabled="onlyRead" :placeholder="'请选择'+conf.column_name_show" clearable @input="changeSpecItem">
        <el-option v-for="(option, index) in enums" :label="option.label" :value="option.value" :key="index"/>
      </el-select>
    </el-form-item>
  </div>
</template>
<script>

export default {
  name: 'EnumSelectCom',
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
    /**
     * column_value 数据模型
     * 区间"@20,500"
     * 符号">=200"
     * 枚举多值  "A,B,C"
     * 单值字符串
    */
    var component_ext
    var column_value
    if (this.specItem.column_value) {
      if (this.conf.is_multiple === 'Y') {
        column_value = this.specItem.column_value.split(',')
      } else {
        column_value = this.specItem.column_value || ''
      }
    } else {
      if (this.conf.is_multiple === 'Y') {
        column_value = []
      } else {
        column_value = ''
      }
    }

    if (this.conf.component_ext) {
      try {
        component_ext = JSON.parse(this.conf.component_ext)
      } catch (err) {
        console.log(err)
      }
    }

    return {
      column_value: column_value,
      enums: this.conf.enums,
      component_ext: component_ext
    }
  },
  methods: {
    changeSpecItem() {
      const column_value_ext = {}
      if (this.conf.is_multiple === 'Y') {
        this.specItem.column_value = this.column_value.join(',')
        if (this.component_ext) {
          this.$set(this.specItem, 'column_value_type', 'enum2Filter')
          this.column_value.map((item) => {
            column_value_ext[item] = this.component_ext[item]
          })
          this.$set(this.specItem, 'column_value_ext', column_value_ext)
        }
      } else {
        this.specItem.column_value = this.column_value
        if (this.component_ext) {
          this.$set(this.specItem, 'column_value_type', 'enum2Filter')
          if (this.column_value) {
            column_value_ext[this.column_value] = this.component_ext[this.column_value]
          }
          this.$set(this.specItem, 'column_value_ext', column_value_ext)
        }
      }
    }
  }
}
</script>
