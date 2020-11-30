<template>
  <div>
    <el-form ref="portraitFilterForm" :model="portraitFilterForm">
      <component v-if="conf.component_type" :conf="conf" :spec-item="portraitFilterForm.specItem" :is="conf.component_type" prefix-prop="specItem"/>
    </el-form>
  </div>
</template>
<script>
import request from '@/utils/request'

export default {
  name: 'PortraitFilterComponentWrap',
  props: {
    applicationType: {
      type: String,
      default() {
        return 'group' // complex_label  complex_group
      }
    },
    id: {
      type: [String, Number],
      default() {
        return ''
      }
    },
    onlyRead: {
      type: Boolean,
      default: false
    }
  },
  provide() {
    return {
      filterCombine: this
    }
  },
  data() {
    return {
      conf: {},
      portraitFilterForm: {
        specItem: {
          column_id: this.id
        }
      },
      ruleObjMap: {
        group: {
          //       application_type: 'complex_label' 标签列表的点进来时,
          application_type: 'group',
          filter_target: 'member_id'
        },
        complex_group: {
          application_type: 'complex_group',
          filter_target: 'member_id'
        }
      }
    }
  },
  mounted() {
    if (this.id) {
      console.log(this.id + '333')
      this.getSelectNodeConf()
    }
  },
  methods: {
    getSelectNodeConf() {
      // 获取节点详细信息，显示界面
      // 当type为attribute_agg使用column_id
      // 当type为其他，使用column_id

      request({
        url: '/group/filter/getLabelInfo',
        method: 'get',
        params: {
          application_type: this.applicationType,
          //  group_type: this.applicationType === 'complex_label' ? 'category' : 'group', 昭昭让改的
          group_type: this.applicationType === 'group' ? 'category' : 'group',
          column_id: this.id
        }
      }).then((res) => {
        var conf = res.data
        console.log('conf', conf)
        // 当type为aggregation时，有columns，组件类型前端构造aggComponent
        // 当type为attribute_agg时，有columns，组件类型前端构造attrAggComponent
        // 当type为其他，取接口component_type字段
        if (conf.type === 'aggregation' || conf.type === 'attribute_agg') {
          var columns = []
          if (conf.columns) {
            for (var i = 0; i < conf.columns.length; i++) {
              columns.push({
                table_id: conf.table_id,
                column_id: conf.columns[i].column_id,
                column_value: '',
                web_value: conf.columns[i].web_value || '',
                column_value_ext: '',
                column_value_type: 'field'
              })
            }
          }
          if (conf.type === 'aggregation') {
            conf.component_type = 'aggComponent'
          } else {
            conf.component_type = 'attrAggComponent'
          }

          this.portraitFilterForm.specItem = {
            type: conf.type,
            group_type: this.applicationType === 'group' ? 'category' : 'group',
            column_id: conf.column_id,
            column_value: '',
            web_value: '',
            columns: columns,
            column_value_ext: '',
            column_value_type: 'field'
          }

          this.conf = conf
        } else {
          if (this.type === 'complex_group') {
            this.portraitFilterForm.specItem = {
              type: conf.type,
              group_type: this.applicationType === 'group' ? 'category' : 'group',
              column_id: conf.column_id,
              web_value: '',
              column_value: '',
              column_value_ext: '',
              column_value_type: 'field'
            }
          } else {
            this.portraitFilterForm.specItem = {
              type: conf.type,
              group_type: this.applicationType === 'group' ? 'category' : 'group',
              column_id: conf.column_id,
              web_value: '',
              column_value: '',
              column_value_ext: '',
              column_value_type: 'field'
            }
          }

          this.conf = conf
          console.log(this.portraitFilterForm)
        }
      })
    },
    getFilterJson() {
      // ... 表单校验
      var ruleObj = Object.assign({}, this.ruleObjMap[this.applicationType])

      var filterJson = {
        type: 'intersect',
        level: 1,
        data: [
          {
            type: 'intersect', // 且
            level: 2,
            data: [
              this.portraitFilterForm.specItem
            ]
          }
        ]
      }

      ruleObj.join = filterJson
      ruleObj.fork = {
        type: 'intersect',
        level: 1,
        data: []
      }

      return ruleObj
    },
    validateRuleValue() {
      return new Promise((resolve, reject) => {
        this.$refs['portraitFilterForm'].validate((valid) => {
          if (!valid) {
            reject()
          } else {
            resolve()
          }
        })
      })
    }
  }
}
</script>
