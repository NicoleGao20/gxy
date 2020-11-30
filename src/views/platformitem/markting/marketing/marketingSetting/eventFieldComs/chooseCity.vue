<template>
  <div>
    <el-form-item :label="conf.column_name_show" label-width="90px">
      <belle-choose-city :level="level" :only-read="onlyRead" :options="options" @change="changeSpecItemValue"/>
    </el-form-item>
  </div>
</template>
<script>
import 	BelleChooseCity from '@/privatemodules/belle-choose-city'
export default {
  name: 'ChooseCity',
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
    onlyRead: {
      type: Boolean,
      default: false
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
