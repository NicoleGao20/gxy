<template>
  <div class="clearfix">
    <el-form-item label-width="0" style="display: inline-block;width: 150px;float: left;">
      <el-tooltip :content="conf.column_name_show" class="item" effect="light" placement="bottom">
        <el-input v-model="conf.column_name_show" type="primary" disabled/>
      </el-tooltip>
    </el-form-item>
    <el-form-item
      :rules="{
        required: (!conf.is_allow_null||conf.is_allow_null === 'N')? true: false, message: '请选择'+conf.column_name_show, trigger: 'change'
      }"
      :prop="prefixProp+'.column_value'"
      label-width="0"
      style="display: inline-block;margin-left: 10px;float:left;">
      <belle-choose-city :level="level" :only-read="filterCombine.onlyRead" :options="options" @change="changeSpecItemValue"/>
    </el-form-item>
  </div>
</template>
<script>
import 	BelleChooseCity from '@/privatemodules/belle-choose-city'
export default {
  name: 'ChooseCity',
  inject: ['filterCombine'],
  components: {
    BelleChooseCity
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
    var options
    if (this.specItem.web_value) {
      options = JSON.parse(this.specItem.web_value)
    } else {
      options = {
        province: [],
        city: [],
        region: []
      }
    }
    var level, component_ext
    if (this.conf.component_ext) {
      try {
        component_ext = JSON.parse(this.conf.component_ext)
      } catch (e) {
        console.log(e)
      }
      if (component_ext) {
        level = component_ext.target_level
      }
    }

    return {
      level: level || 2,
      levelMap: {
        1: 'province',
        2: 'city',
        3: 'region'
      },
      options: options
    }
  },
  methods: {
    changeSpecItemValue() {
      var organNoItems
      if (this.options[this.levelMap[1]].join(',')) {
        organNoItems = this.options[this.levelMap[1]].join(',')
      }
      if (this.level >= 2) {
        if (this.options[this.levelMap[2]].join(',')) {
          organNoItems = this.options[this.levelMap[2]].join(',')
        }
      }
      if (this.level >= 3) {
        if (this.options[this.levelMap[3]].join(',')) {
          organNoItems = this.options[this.levelMap[3]].join(',')
        }
      }
      if (organNoItems) {
        if (this.options[this.levelMap[this.level]].join(',')) {
          this.specItem.column_value = organNoItems
        } else {
          // 目标数据层，sql like 拼接
          this.specItem.column_value = 'λ' + organNoItems
        }
      } else {
        this.specItem.column_value = ''
      }
      try {
        this.specItem.web_value = JSON.stringify(this.options)
      } catch (e) {
        console.log(e)
      }
    }
  }
}
</script>
