<template>
  <div class="clearfix">
    <el-form-item label-width="0" style="display: inline-block;width: 150px;float: left;">
      <el-tooltip class="item" effect="light" :content="conf.column_name_show" placement="bottom">
        <el-input v-model="conf.column_name_show" type="primary" disabled/>
      </el-tooltip>
    </el-form-item>
    <el-form-item  
      :rules="{
        required: true, message: '请选择'+conf.column_name_show, trigger: 'change'
      }" 
      label-width="0"
      :prop="prefixProp+'.column_value'" style="display: inline-block;margin-left: 10px;float:left;">
      <belle-choose-city :level="level" :only-read="filterCombine.onlyRead" :options="options" @change="changeSpecItemValue"/>
    </el-form-item>
  </div>
</template>
<script>
import 	BelleChooseCity from '@/privatemodules/belle-choose-city'
export default {
  name: 'chooseCity',
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
    if(this.specItem.web_value) {
      options = JSON.parse(this.specItem.web_value)
    } else {
      options = {
        province: [],
        city: [],
        region: []
      }
    }
    var level, component_ext
    if(this.conf.component_ext) {
      try {
        component_ext = JSON.parse(this.conf.component_ext)
      } catch(e) {
        console.log(e)
      }
      if(component_ext) {
        level = component_ext.target_level
      }
      
    } else {
      if(this.conf.column_name_show.indexOf("省")>-1) {
        level = 1
      } else if(this.conf.column_name_show.indexOf("市")>-1) {
        level = 2
      } else {
        level = 3
      }
    }
    console.log(this.specItem.column_value)
    return {
      level: level,
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
      this.specItem.column_value = this.options[this.levelMap[this.level]].join(",")
      try {
        this.specItem.web_value = JSON.stringify(this.options)
      } catch(e) {
        console.log(e)
      }
    }
  }
}
</script>