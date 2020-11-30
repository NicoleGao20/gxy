<template>
  <el-form ref="form" :model="form" :rules="rules" :label-position="labelPostion" :label-width="labelWidth">
    <el-row :gutter="20">
      <el-col v-for="(formItem, index) in formItems" :key="index" :span="span">
        <component :is="formMapComponent[formItem.display_type]" :form-item="formItem" :form="form" />
      </el-col>
    </el-row>
  </el-form>
</template>

<script>
const formMapComponent = {
  text: 'SingleText',
  select: 'MultipleSelect',
  radio: 'SingleRadio',
  checkbox: 'MultipleCheckbox',
  multipleText: 'MultipleText',
  switch: 'ToggleSwitch'
}

export default {
  name: 'BelleForm',
  props: {
    labelPostion: {
      type: String,
      default: 'left'
    },
    gutter: {
      type: Number,
      default: 20
    },
    span: {
      type: Number,
      default: 24
    },
    labelWidth: {
      type: String,
      default: '100px'
    },
    form: {
      type: Object,
      default() {
        return {}
      }
    },
    formItems: {
      type: Array,
      default() {
        return []
      }
    },
    rules: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      formMapComponent: formMapComponent
    }
  }
}
</script>
