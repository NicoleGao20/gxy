<template>
  <div>
    <el-form ref="form" :model="form" label-position="right" label-width="80px" @submit.native.prevent>
      <el-form-item
        :rules="{
          message: '请填写流程简要说明', trigger: 'change', required: true
        }"
        prop="node_desc"
        label="流程说明">
        <el-input v-model="form.node_desc" :disabled="onlyRead" placeholder="流程说明"/>
      </el-form-item>
    </el-form>
    <div class="hor-line"/>
    <FilterCombine ref="peopleFilter" :rule-value="form.filterRule" :filter_target="filter_target" :application-type="application_type" :only-read="onlyRead"/>
  </div>
</template>
<script>
import FilterCombine from '@/componentsMarketing/FilterCombine/ruleFilter'
import { getPreviousEventNodesInfo } from '../util'

export default {
  name: 'PeopleFilter',
  components: {
    FilterCombine
  },
  inject: ['flowChartMap'],
  props: {
    curComConfig: {
      type: Object,
      default() {
        return {}
      }
    },
    actionType: {
      type: String,
      default() {
        return 'edit'
      }
    }
  },
  data() {
    var form = {
      node_desc: '',
      filterRule: {}
    }
    if (this.curComConfig.nodeConf.node_desc) {
      form.node_desc = this.curComConfig.nodeConf.node_desc
      form.filterRule = this.curComConfig.nodeConf.filterRule
    }

    /**
     * 筛选器营销对象推导，如果筛选器上游节点存在事件判断或事件选择节点则，filter_target取值为事件主id，否则取传入进来的filter_target
     */
    var filter_target
    var previousEventNodesInfo = getPreviousEventNodesInfo(this.curComConfig, this.flowChartMap.flowData.nodeItems)

    filter_target = this.$route.query.marketing_target
    if (previousEventNodesInfo.previousEventNodes && previousEventNodesInfo.previousEventNodes.length) {
      if (previousEventNodesInfo.previousEventNodes[0].nodeConf.eventid) {
        var mainIdtypeGroup = previousEventNodesInfo.main_idtype_group.concat(this.$route.query.marketing_target)
        if (mainIdtypeGroup.indexOf('member_id') > -1) {
          filter_target = 'member_id'
        } else {
          filter_target = previousEventNodesInfo.previousEventNodes[0].nodeConf.idMap.main_idtype
        }
      } else {
        this.$message({
          type: 'warning',
          message: '人群选择上游事件选择或者事件判断未选择事件，筛选器丢失查询对象'
        })
      }
    }

    // 应用场景
    // 在人群选择组件中member_id对应的application_type为complex_advanced_group
    var application_type
    if (filter_target === 'wx_openid') {
      application_type = 'rule_openid'
    } else if (filter_target === 'member_id') {
      application_type = 'complex_advanced_group'
    }

    return {
      form: form,
      filter_target: filter_target,
      application_type: application_type
    }
  },
  computed: {
    onlyRead() {
      if (this.actionType === 'edit' || this.actionType === 'add') {
        return false
      } else {
        return true
      }
    }
  },
  methods: {
    confirmHandler(cb) {
      this.$refs['form'].validate((valid) => {
        if (!valid) {
          cb(false)
          return
        }
        if (this.$route.query.create_type === 'template') {
          this.curComConfig.nodeConf = this.form
          cb(true)
        } else {
          this.$refs['peopleFilter'].validateRuleValue().then(() => {
            this.form.filterRule = this.$refs['peopleFilter'].getFilterJson()
            this.curComConfig.nodeConf = this.form
            cb(true)
          }, () => {
            cb(false)
          })
        }
      })
    }
  }
}
</script>
