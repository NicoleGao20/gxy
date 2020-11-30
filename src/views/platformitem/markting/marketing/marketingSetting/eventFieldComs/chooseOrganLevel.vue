<template>
  <div>
    <el-form-item
      :label="conf.column_name_show"
      label-width="90px">
      <div style="margin-bottom: 5px;">
        <ul class="tab-head-wrap">
          <li :class="[value_source=='field'?'selected':'']" class="tab-head-item" @click="tabSelect('field')">区域选择</li>
          <li :class="[value_source=='table'?'selected':'']" class="tab-head-item" @click="tabSelect('table')">导入门店</li>
        </ul>
      </div>
      <!-- <belle-choose-organ-level v-if="value_source === 'field'" :opt="options" :config="config" :data-config="dataConfig" :brand-code="brandCode" platform="2" @change="changeSpecItemValue"/> -->
      <upload-store v-if="value_source === 'table'" :only-read="onlyRead" v-model="where_value_map['batch_no']" @input="inputHandler"/>
    </el-form-item>
  </div>
</template>
<script>
import belleChooseOrganLevel from '@/privatemodules/belle-choose-organ-level'
import uploadStore from '@/componentsMarketing/FilterCombine/coms/uploadStore'
import { getToken } from '@/utils/auth'

export default {
  name: 'ChooseOrganLevel',
  components: {
    belleChooseOrganLevel,
    uploadStore
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
    var level, component_ext
    var brandCode = getToken('brandCode')

    // column_value_ext sql 逻辑
    var column_value_ext = {}
    // value 来源 控制tab显示
    var value_source
    // where_value map映射
    var where_value_map = {}

    if (this.conf.component_ext) {
      try {
        component_ext = JSON.parse(this.conf.component_ext)
      } catch (e) {
        console.log(e)
      }

      if (component_ext) {
        level = component_ext.target_level
        column_value_ext.table_name = component_ext.table_name
        column_value_ext.column_name_select = component_ext.column_name_select
        column_value_ext.column_name_where = component_ext.column_name_where

        if (this.specItem.column_value === 'λλ') {
          if (this.specItem.column_value_ext && this.specItem.column_value_ext.where_value) {
            column_value_ext.where_value = this.specItem.column_value_ext.where_value
            component_ext.column_name_where.forEach((item, index) => {
              where_value_map[item] = column_value_ext.where_value[index] || ''
            })
          }
          value_source = 'table'
        } else {
          column_value_ext.where_value = component_ext.column_name_where.map((column_name) => {
            if (column_name === 'brand_code') {
              where_value_map[column_name] = brandCode
              return brandCode
            } else {
              where_value_map[column_name] = ''
              return ''
            }
          })
          value_source = 'field'

          this.$set(this.specItem, 'column_value_ext', column_value_ext)
        }
      }
    }
    var options

    try {
      if (this.specItem.web_value) {
        options = JSON.parse(this.specItem.web_value)
      }
    } catch (err) {
      console.log(err)
    }

    return {
      config: {
        multiple: true,
        collapseTags: true,
        disabled: this.onlyRead
      },
      brandCode: brandCode || 'durex',
      value_source: value_source || 'field',
      where_value_map: where_value_map,

      levelMap: {
        1: 'bigAreas',
        2: 'smallAreas',
        3: 'managerAreas',
        4: 'managerCityAreas',
        5: 'operateCities',
        6: 'storeItems'
      },
      dataConfig: {
        targetLevel: level || 6
      },
      options: options || { 'bigAreas': '', 'smallAreas': '', 'managerAreas': '', 'managerCityAreas': '', 'operateCities': '', 'storeItems': '' }
    }
  },
  methods: {
    changeSpecItemValue() {
      var orgCodelongItems = ''
      if (this.options[this.levelMap[1]]) {
        orgCodelongItems = this.options[this.levelMap[1]]
      }
      if (this.options[this.levelMap[2]]) {
        orgCodelongItems = this.options[this.levelMap[2]]
      }
      if (this.options[this.levelMap[3]]) {
        orgCodelongItems = this.options[this.levelMap[3]]
      }
      if (this.options[this.levelMap[4]]) {
        orgCodelongItems = this.options[this.levelMap[4]]
      }
      if (this.options[this.levelMap[5]]) {
        orgCodelongItems = this.options[this.levelMap[5]]
      }
      if (this.options[this.levelMap[6]]) {
        orgCodelongItems = this.options[this.levelMap[6]]
      }

      if (orgCodelongItems) {
        // 目标数据层，sql 强=拼接,需要服务端支持
        if (this.options[this.levelMap[this.dataConfig.targetLevel]]) {
          this.specItem.column_value = orgCodelongItems
        } else {
          // 目标数据层，sql like 拼接
          this.specItem.column_value = 'λ' + orgCodelongItems
        }
      } else {
        this.specItem.column_value = ''
      }

      try {
        this.specItem.web_value = JSON.stringify(this.options)
      } catch (e) {
        console.log(e)
      }
    },
    tabSelect(value_source) {
      if (this.onlyRead) return
      if (this.value_source !== value_source) {
        this.$msgbox({
          title: '操作提示',
          message: '切换选择会导致之前填写数据丢失',
          showClose: true,
          distinguishCancelAndClose: true,
          type: 'warning',
          showCancelButton: true,
          confirmButtonText: '确认',
          cancelButtonText: '取消'
        }).then(() => {
          this.specItem.column_value = ''
          // 重置
          if (value_source === 'table') {
            var column_name_where = this.specItem.column_value_ext.column_name_where
            var where_value = this.specItem.column_value_ext.where_value

            for (var i = 0; i < column_name_where.length; i++) {
              if (column_name_where[i] === 'brand_code') {
                where_value[i] = this.brandCode
                this.where_value_map[column_name_where[i]] = this.brandCode
              } else {
                where_value[i] = ''
                this.where_value_map[column_name_where[i]] = ''
              }
            }
          } else if (value_source === 'field') {
            this.options = { 'bigAreas': '', 'smallAreas': '', 'managerAreas': '', 'managerCityAreas': '', 'operateCities': '', 'storeItems': '' }
            this.specItem.web_value = JSON.stringify(this.options)
          }

          this.value_source = value_source
        }).catch((err) => {
          console.log(err)
        })
      }
    },
    inputHandler() {
      var column_name_where = this.specItem.column_value_ext.column_name_where
      var where_value = this.specItem.column_value_ext.where_value
      for (var i = 0; i < column_name_where.length; i++) {
        where_value[i] = this.where_value_map[column_name_where[i]] || ''
      }
      this.specItem.column_value = 'λλ'
    }
  }
}
</script>
<style scoped>
  .tab-head-wrap {
    height: 31px;
    border-bottom: 1px solid #ccc;
  }
  .tab-head-item {
    display: inline-block;
    height: 30px;
    position: relative;
    top: 1px;
    cursor: pointer;
    margin-left: 6px;
  }
  .tab-head-item.selected {
    border-bottom: 2px solid #435A82;
  }
  .tab-head-item:hover {
    border-bottom: 2px solid #435A82;
  }
</style>
