<template>
  <el-row v-if="isBefore">
    <el-col :span="8">
      <el-form-item
        :prop="beforeInfo.valueParamKey"
        :rules="{ message: `请填写${beforeInfo.labelName}`, trigger: ['change', 'blur'], validator: validateBefore, required: true}"
        class="before-style"
        label-width="20">
        <Editable
          :domref="beforeInfo.valueParamKey"
          :ref="beforeInfo.valueParamKey"
          :value.sync="beforeInfo.valueParamValue"
          :max-num="200"
          :placeholder="beforeInfo.placeholder"
          :only-icon = "true"
          v-bind="$attrs"
          @triggerValidate="triggerBeforeInfoValidate"/>
      </el-form-item>
    </el-col>
    <el-col :span="16">
      <el-form-item
        :label="itemInfo.labelName"
        :prop="itemInfo.valueParamKey"
        :rules="{ message: `请填写${itemInfo.labelName}`, trigger: ['change', 'blur'], validator: validateValue, required: true}">
        <Editable
          :domref="itemInfo.valueParamKey"
          :ref="itemInfo.valueParamKey"
          :value.sync="itemInfo.valueParamValue"
          :max-num="200"
          :placeholder="itemInfo.placeholder"
          :only-icon= "true"
          v-bind="$attrs"
          @triggerValidate="triggerItemInfoValidate"/>
        <div class="append-container">
          <el-color-picker
            v-if="!$attrs['only-read']"
            v-model="itemInfo.color"
            :predefine="['#409EFF', '#1890ff', '#304156','#212121','#11a983', '#13c2c2', '#6959CD', '#f5222d']"
            class="wechat-template-color-picker"/>
        </div>
      </el-form-item>
    </el-col>
  </el-row>
  <el-form-item
    v-else
    :label="itemInfo.labelName"
    :prop="itemInfo.valueParamKey"
    :rules="{ message: `请填写${itemInfo.labelName}`, trigger: ['change', 'blur'], validator: validateValue, required: true}">
    <Editable
      :domref="itemInfo.valueParamKey"
      :ref="itemInfo.valueParamKey"
      :value.sync="itemInfo.valueParamValue"
      :max-num="200"
      :placeholder="itemInfo.placeholder"
      v-bind="$attrs"
      @triggerValidate="triggerItemInfoValidate"/>
    <div class="append-container">
      <el-color-picker
        v-if="!$attrs['only-read']"
        v-model="itemInfo.color"
        :predefine="['#409EFF', '#1890ff', '#304156','#212121','#11a983', '#13c2c2', '#6959CD', '#f5222d']"
        class="wechat-template-color-picker"/>
    </div>
  </el-form-item>
</template>

<script>
import Editable from './Editable'

export default {
  name: 'TemplateItem',
  components: { Editable },
  inject: ['tempIndex'],
  props: {
    isBefore: {
      type: Boolean,
      default: false
    },
    itemInfo: {
      type: Object,
      default: function() {
        return {}
      }
    },
    beforeInfo: {
      type: Object,
      default: function() {
        return {}
      }
    }
  },
  data() {
    return {}
  },
  computed: {
    colorPicker: {
      get: function() {
        return this.itemInfo.color ? this.itemInfo.color : '#606266'
      },
      set: function(val) {
        this.itemInfo.color = val
      }
    }
  },
  watch: {
    'itemInfo.valueParamValue': {
      handler: function(newVal) {
        this.$emit('update:itemInfo', { ...this.itemInfo, valueParamValue: newVal })
      }
    },
    'beforeInfo.valueParamValue': {
      handler: function(newVal) {
        this.$emit('update:beforeInfo', { ...this.beforeInfo, valueParamValue: newVal })
      }
    }
  },
  methods: {
    triggerItemInfoValidate() {
      this.$parent.$parent.$refs.form.validateField([this.itemInfo.valueParamKey])
    },
    triggerBeforeInfoValidate() {
      this.$parent.$parent.$refs.form.validateField([this.beforeInfo.valueParamKey])
    },
    validateValue(rule, value, callback) {
      if (this.itemInfo.valueParamValue) {
        callback()
      } else {
        callback(new Error(rule.message))
      }
    },
    validateBefore(rule, value, callback) {
      if (this.beforeInfo.valueParamValue) {
        callback()
      } else {
        callback(new Error(rule.message))
      }
    }
  }
}
</script>

<style scoped lang="less">
.mb10 {
  margin-bottom: 10px;
}
.before-style{
  margin-left: 50px;
}
.personalized-text {
  color: #01337A;
  cursor: pointer;
}

.append-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/deep/ .el-color-picker__icon {
  display: none;
}

/deep/ .el-color-picker, /deep/ .el-color-picker__trigger, /deep/ .el-color-picker__color, /deep/ .el-color-picker__color-inner {
  border-radius: 50%;
}

/deep/ .el-input-group__append, .el-input-group__prepend {
  background: #fff;
}

/deep/ .el-color-picker--small {
  height: 30px;
}

/deep/ .el-form-item__content {
  display: flex;
  justify-content: space-between;
  align-items: center;

  .editable-container {
    flex: 1;
  }
}
</style>
<style lang="less">
.el-color-dropdown .el-color-dropdown__link-btn {
  display: none !important;
}
</style>
