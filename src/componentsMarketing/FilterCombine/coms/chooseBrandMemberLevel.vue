<template>
  <div>
    <el-form-item label-width="0" style="display: inline-block;width: 150px;">
      <el-tooltip :content="conf.column_name_show" class="item" effect="light" placement="bottom">
        <el-input v-model="conf.column_name_show" disabled/>
      </el-tooltip>
    </el-form-item>
    <el-form-item
      :rules="{
        required: (!conf.is_allow_null||conf.is_allow_null === 'N')? true: false, message: '请填写'+conf.column_name_show, trigger: 'change'
      }"
      :prop="prefixProp+'.column_value'"
      style="display: inline-block;"
      label-width="20px">
      <belle-choose-brand-member-level v-model="column_value" :component_ext="component_ext" :config="config" :brand-code="brandCode" @input="changeSpecItemColumnValue"/>
    </el-form-item>
  </div>
</template>
<script>
import belleChooseBrandMemberLevel from '@/privatemodules/belle-choose-brand-member-level'
import { getToken } from '@/utils/auth'

export default {
  name: 'ChooseBrandMemberLevel',
  inject: ['filterCombine'],
  components: {
    belleChooseBrandMemberLevel
  },
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
  },
  data() {
    var column_value
    if (this.conf.is_multiple === 'Y') {
      if (this.specItem.column_value) {
        column_value = this.specItem.column_value.split(',').map((item) => {
          return Number(item)
        })
      } else {
        column_value = []
      }
    } else {
      if (this.specItem.column_value) {
        column_value = this.specItem.column_value
      } else {
        column_value = ''
      }
    }

    var component_ext
    if (this.conf.component_ext) {
      try {
        component_ext = JSON.parse(this.conf.component_ext)
      } catch (err) {
        console.log('ChooseBrandMemberLevel', err)
      }
    }

    component_ext = component_ext || {}

    return {
      brandCode: this.filterCombine.brand_code || getToken('brandCode'),
      column_value: column_value,
      component_ext: component_ext,
      config: {
        multiple: this.conf.is_multiple === 'Y',
        disabled: this.filterCombine.onlyRead,
        collapseTags: this.conf.is_multiple === 'Y'
      }
    }
  },
  methods: {
    changeSpecItemColumnValue() {
      if (this.conf.is_multiple === 'Y') {
        this.specItem.column_value = this.column_value.join(',')
      } else {
        this.specItem.column_value = this.column_value
      }
    }
  }
}
</script>
