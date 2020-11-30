<template>
  <div>
    <el-form ref="form" :model="form" label-position="right" label-width="80px">
      <el-form-item
        :rules="{
          message: '请填写流程简要说明', trigger: 'change', required: true
        }"
        prop="node_desc"
        label="流程说明">
        <el-input v-model="form.node_desc" :disabled="onlyRead" placeholder="流程说明"/>
      </el-form-item>
      <div class="hor-line"/>
      <el-row>
        <el-col :span="12" style="padding-right: 5px">
          <el-form-item
            :rules="{
              message: '请选择事件类型', trigger: 'change', required: true
            }"
            label="事件类型"
            prop="event_type">
            <el-select v-model="form.event_type" :disabled="onlyRead||activityCreateIfByTemplate()" filterable placeholder="请选择事件类型" style="width: 100%;" @change="getEventListByType">
              <el-option v-for="(eventType, index) in eventTypes" :key="index" :label="eventType.eventTypeName" :value="eventType.eventTypeCode"/>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            :rules="{
              message: '请选择事件', trigger: 'change', required: true
            }"
            label="事件"
            prop="eventid">
            <el-select v-model="form.eventid" :disabled="onlyRead||activityCreateIfByTemplate()" filterable placeholder="请选择事件" style="width: 100%;" @change="changeEventFilterAttributes">
              <el-option v-for="(eventItem, index) in eventItems" :key="index" :label="eventItem.eventName" :value="eventItem.metaTableId" :disabled="eventItem.disabled"/>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item v-if="loadedDone && form.branches&&form.branches.length" label="事件条件">
        <div style="padding-left: 15px; padding-right: 15px; padding-top: 15px; background: #f4f6fa; border: 1px solid #d8dce6;">
          <el-form-item v-for="(branchItem, index) in form.branches" :key="index" :label="'事件条件'+(index+1)" label-width="90px" style="margin-bottom: 0;">
            <div style="position: relative; padding-right: 30px; margin-bottom: 15px;">
              <event-branch :branch-item="branchItem" :branch-conditions="branchConditions" :only-read="onlyRead" :branch-index="index"/>
              <div v-if="(!onlyRead && !activityCreateIfByTemplate())&& index>=1" class="el-icon-close" style="padding: 9px; cursor: pointer;position: absolute; right: 0;top: 0;" @click="delBranch(index)"/>
              <div v-if="(!onlyRead && !activityCreateIfByTemplate())&& index === 0" class="el-icon-document-copy" style="padding: 9px; cursor: pointer;position: absolute; right: 0;top: 0;" @click="copyBranch(index)"/>
            </div>
          </el-form-item>
          <el-button v-if="!onlyRead && !activityCreateIfByTemplate()" style="margin-left: 90px;" type="text" size="mini" @click="addBranch">
            <span class="el-icon-plus" style="border: 1px dashed rgb(89, 109, 145);border-radius: 50%;font-size: 13px;"/>
            新增分支
          </el-button>
        </div>
        <div style="margin-top: 5px;">(注：增加事件筛选条件，缩小事件范围，从而提高营销精准性)</div>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>

import { getEventTypeList, getEventListByType, getFilterAttributes } from '@/api/markting/event'
import eventBranch from './eventBranch'
import { getPreviousEventNodesInfo } from '../util'

export default {
  name: 'EventSelect',
  components: {
    eventBranch
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
      event_type: '',
      eventid: '',
      branches: [
      ]
      // ... 事件条件
    }
    if (this.curComConfig.nodeConf && (this.curComConfig.nodeConf.node_desc || this.curComConfig.nodeConf.eventid)) {
      form = JSON.parse(JSON.stringify(this.curComConfig.nodeConf))
    }

    return {
      eventTypes: [],
      eventItems: [],

      activeNames: [],
      branchConditions: [],

      form: form,
      loadedDone: false,

      previousEventNodesInfo: getPreviousEventNodesInfo(this.curComConfig, this.flowChartMap.flowData.nodeItems)
    }
  },
  computed: {
    idMap() {
      if (this.form.eventid) {
        for (var i = 0; i < this.eventItems.length; i++) {
          if (this.eventItems[i].metaTableId === this.form.eventid) {
            return {
              main_idtype: this.eventItems[i].main_idtype,
              idtype_group: this.eventItems[i].idtype_group
            }
          }
        }
      }
    },
    onlyRead() {
      if (this.actionType === 'edit' || this.actionType === 'add') {
        return false
      } else {
        return true
      }
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    // 使用模版创建的活动不允许更改事件类型和事件
    activityCreateIfByTemplate() {
      if (this.flowChartMap.activityInfo.marketingTemplateDefId) {
        return true
      }
      return false
    },
    init() {
      getEventTypeList({}).then((res) => {
        this.eventTypes = (res.data && res.data.list) || []
      })

      if (this.form.event_type) {
        getEventListByType({ eventTypeCode: this.form.event_type }).then((res) => {
          this.eventItems = this.filterEventItems(res.data && res.data.list || [])
        })
      }
      if (this.form.eventid) {
        this.getFilterAttributes(this.diffBranchCondtions)
      } else {
        this.loadedDone = true
      }
    },
    getEventListByType() {
      this.eventItems = []
      this.form.eventid = ''
      if (this.form.event_type) {
        getEventListByType({ eventTypeCode: this.form.event_type }).then((res) => {
          this.eventItems = this.filterEventItems((res.data && res.data.list) || [])
        })
      }
    },
    /**
     * 防止事件过滤字段，db添加，或者删字段
     * 画布json中的条件字段同数据库现有条件字段做比对，并动态做删除和加入字段逻辑
     */
    diffBranchCondtions() {
      for (var i = 0; i < this.form.branches.length; i++) {
        this.changeFilterFields(this.form.branches[i].event, this.branchConditions)
      }
      this.loadedDone = true
    },
    changeFilterFields(formFilterConditions, filterConditions) {
      var i
      formFilterConditions.sort((itemA, itemB) => itemA.meta_column_id - itemB.meta_column_id)
      filterConditions.sort((itemA, itemB) => itemA.meta_column_id - itemB.meta_column_id)

      for (i = 0; i < formFilterConditions.length;) {
        if (
          !filterConditions.some((sourceItem) => {
            return formFilterConditions[i].column_name === sourceItem.column_name
          })
        ) {
          formFilterConditions.splice(i, 1)
        } else {
          i++
        }
      }

      for (i = 0; i < filterConditions.length; i++) {
        if (formFilterConditions[i]) {
          if (filterConditions[i].column_name !== formFilterConditions[i].column_name) {
            formFilterConditions.splice(i, 0, {
              column_name: filterConditions[i].column_name,
              meta_column_id: filterConditions[i].meta_column_id,
              column_value: ''
            })
          }
        } else {
          formFilterConditions.push({
            column_name: filterConditions[i].column_name,
            meta_column_id: filterConditions[i].meta_column_id,
            column_value: ''
          })
        }
      }
    },
    filterEventItems(eventItems) {
      var filterEventItems = []
      var i
      var j

      if (!this.previousEventNodesInfo.previousEventNodes.length) {
        // 当画布当前节点的直接父辈组件中不存在事件选择或者事件判断时，事件可选范围推断为以下逻辑
        if (this.flowChartMap.activityInfo.marketingType === 'event') {
          // wx_openid app_openid
          if (this.flowChartMap.activityInfo.marketingTarget !== 'member_id') {
            // 活动类型为实时营销，事件main_idtype 和 活动营销对象marketingTarget必须相等，该事件为可选择事件
            for (i = 0; i < eventItems.length; i++) {
              eventItems[i].disabled = true
              if (eventItems[i].main_idtype === this.flowChartMap.activityInfo.marketingTarget) {
                eventItems[i].disabled = false
              }
              filterEventItems.push(eventItems[i])
            }
          } else {
            for (i = 0; i < eventItems.length; i++) {
              eventItems[i].disabled = true
              if (eventItems[i].idtype_group.indexOf(this.flowChartMap.activityInfo.marketingTarget) > -1) {
                eventItems[i].disabled = false
              }
              filterEventItems.push(eventItems[i])
            }
          }
        } else {
          // 活动类型为diy peroid(周期营销) 当前事件idtype_group 包含活动营销对象，则该事件为可选择事件
          for (i = 0; i < eventItems.length; i++) {
            eventItems[i].disabled = true
            if (eventItems[i].idtype_group.indexOf(this.flowChartMap.activityInfo.marketingTarget) > -1) {
              eventItems[i].disabled = false
            }

            filterEventItems.push(eventItems[i])
          }
        }
      } else {
        // 当画布当前节点的直接父辈组件中存在事件选择或者事件判断时，事件可选范围推断，父辈(事件选择或者事件判断)的idtype_group
        // 集合并集和当前事件idtype_group 存在交集，则可认为该事件为可选择事件
        for (i = 0; i < eventItems.length; i++) {
          for (j = 0; j < eventItems[i].idtype_group.length; j++) {
            if (this.previousEventNodesInfo.idtype_group.indexOf(eventItems[i].idtype_group[j]) > -1) {
              filterEventItems.push(eventItems[i])
              break
            }
          }
        }
      }

      return filterEventItems
    },
    changeEventFilterAttributes() {
      this.form.branches = []
      this.getFilterAttributes(this.addBranch)
    },
    getFilterAttributes(cb) {
      if (this.form.eventid) {
        getFilterAttributes({ metaTableId: this.form.eventid }).then((res) => {
          if (res.data) {
            this.branchConditions = res.data.list || []
            if (cb) {
              cb()
            }
          }
        })
      }
    },
    confirmHandler(cb) {
      this.$refs['form'].validate((valid) => {
        if (!valid) {
          cb(false)
          return
        }
        this.form.idMap = this.idMap
        this.curComConfig.nodeConf = this.form
        cb(valid)
      })
    },
    addBranch() {
      if (this.form.branches.length >= 9) {
        this.$message({
          type: 'error',
          message: '最大支持9个分支'
        })
        return
      }

      var tempBranch = {
        branch_name: '',
        event: []
      }

      for (var i = 0; i < this.branchConditions.length; i++) {
        var temp = {}
        temp.column_name = this.branchConditions[i].column_name
        temp.column_value = ''
        temp.meta_column_id = this.branchConditions[i].meta_column_id
        temp.column_value_type = 'field'
        // 对于上传门店,需要将column_value 设置为对应的表
        tempBranch.event.push(temp)
      }

      this.form.branches.push(tempBranch)
    },
    copyBranch(index) {
      if (this.form.branches.length >= 9) {
        this.$message({
          type: 'error',
          message: '最大支持9个分支'
        })
        return
      }

      var copyBranch = JSON.parse(JSON.stringify(this.form.branches[index]))
      copyBranch.branchid = ''
      copyBranch.id = ''
      this.form.branches.push(copyBranch)
    },
    delBranch(index) {
      this.form.branches.splice(index, 1)
    }
  }
}
</script>
<style>
.event-branch .el-collapse-item__header {
  height: 33px;
  line-height: 32px;
  padding: 1px;
}
.event-branch .el-collapse-item__header .title input{
  border: 0;
}
</style>
