<template>
  <div>
    <component v-if="conf.component_type" :prefix-prop="prefixProp" :conf="conf" :spec-item="specItem" :is="conf.component_type"/>
    <el-form-item 
      v-if="!conf.component_type"
      label-width="0"
      :prop="prefixProp+'.type'" 
      :rules="{
        required: true, message: '请选择', trigger: 'blur'
      }">
      <cascader-wrap :type="type" @curSelectNode="curSelectNodeHandler"/>
    </el-form-item>
  </div>
</template>
<script>
import CascaderWrap from './cascaderWrap'
import request from '@/utils/request'

export default {
  name: 'FilterComponentWrap',
  inject: ['filterCombine'],
  components: {
    CascaderWrap
  },
  props: {
    /*
      table_id: '',
      table_type: '',
      meta_column_id: '',
      column_value: '',
      column_values: []
    */
    type: {
      type: String,
      default() {
        return ''
      }
    },
    prefixProp: {
      type: String,
      default() {
        return ''
      }
    },
    specItem: {
      type: Object,
      default() {
        return { }
      }
    }
  },
  data() {
    return {
      conf: {}
    }
  },
  mounted() {
    if (this.specItem.column_id || this.specItem.table_id) {
      this.getSelectNodeConf(this.specItem)
    }
  },
  methods: {
    curSelectNodeHandler(specItem) {
      this.getSelectNodeConf(specItem)
    },
    getSelectNodeConf(specItem) {
      // 获取节点详细信息，显示界面
      // 当type为aggregation使用table_id 获取getLabelInfo
      // 当type为attribute_agg使用column_id
      // 当type为其他，使用column_id
      var params = {
        application_type: this.type,
        type: specItem.type,
        column_id: specItem.column_id,
        table_id: specItem.table_id
      }

      if(this.filterCombine.brand_code) {
        params.brand_code = this.filterCombine.brand_code
      }

      request({
        url: '/filterView/getLabelInfo',
        method: 'get',
        params: params
      }).then((res) => {
        var conf = res.data
        // 当type为aggregation时，有columns，组件类型前端构造aggComponent
        // 当type为attribute_agg时，有columns，组件类型前端构造attrAggComponent
        // 当type为其他，取接口component_type字段
        if(specItem.type === "aggregation" || specItem.type === "attribute_agg") {
          var columns = []
          if(conf.columns) {
            for(var i=0;i<conf.columns.length;i++) {
              if(this.specItem.columns && this.specItem.columns[i]) {
                columns.push({
                  table_id: conf.table_id,
                  column_id: this.specItem.columns[i]&&this.specItem.columns[i].column_id,
                  column_value: this.specItem.columns[i]&&this.specItem.columns[i].column_value || '',
                  web_value: this.specItem.columns[i]&&this.specItem.columns[i].web_value || ''
                })
              } else {
                columns.push({
                  table_id: conf.table_id,
                  column_id: conf.columns[i].column_id,
                  column_value: '',
                  web_value: ''
                })
              }
            }
          }
          if(specItem.type === "aggregation") {
            conf.component_type = 'aggComponent'
          } else {
            conf.component_type = 'attrAggComponent'
          }
          this.$emit('update:specItem', {
            type: specItem.type,
            table_id: specItem.table_id,
            column_id: specItem.column_id,
            column_value: '',
            brand_code_list: conf.brand_code_list || [],
            webKey: this.specItem.webKey,
            web_value: this.specItem.web_value || '',
            columns: columns
          })

          this.conf = conf
        } else {
          this.$emit('update:specItem', {
            type: specItem.type,
            table_id: specItem.table_id,
            column_id: specItem.column_id,
            brand_code_list: conf.brand_code_list || [],
            webKey: this.specItem.webKey,
            web_value: this.specItem.web_value || '',
            column_value: specItem.column_value || ''
          })

          this.conf = conf
        }
      })
    }
  }
}
</script>
