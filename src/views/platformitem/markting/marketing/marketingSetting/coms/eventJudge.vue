<template>
  <div>
    <el-form ref="form" :model="form" label-position="right" label-width="120px">
      <el-form-item
        :rules="{
          message: '请填写流程简要说明', trigger: 'change', required: true
        }"
        label="流程说明"
        prop="node_desc">
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
            <el-select v-model="form.event_type" :disabled="onlyRead || activityCreateIfByTemplate()" filterable placeholder="请选择事件类型" style="width: 100%;" clearable @change="getEventListByType">
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
            <el-select v-model="form.eventid" :disabled="onlyRead || activityCreateIfByTemplate()" filterable placeholder="请选择事件" style="width: 100%;" clearable @change="initFilterAttributes">
              <el-option v-for="(eventItem, index) in eventItems" :key="index" :label="eventItem.eventName" :value="eventItem.metaTableId" :disabled="eventItem.disabled"/>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item v-if="loadedDone && filterConditions.length" label="事件过滤">
        <div style="border: 1px solid #D8DCE6;padding-top: 15px; padding-right: 15px;background: #F4F6FA;">
          <div v-for="(filterItem, index) in filterConditions" :key="index">
            <component v-if="filterItem.component_type && hasRegistComponent(filterItem.component_type)" :is="filterItem.component_type" :conf="filterItem" :spec-item="form.filterConditions[index]" :only-read="onlyRead"/>
          </div>
        </div>
      </el-form-item>
      <el-form-item
        :rules="{
          trigger: 'change', required: true, validator: vaidateValueHandler
        }"
        style="margin-bottom: 0;"
        prop="wait_hour_time"
        label="执行等待时间">
        <el-input v-model="form.wait_days" :disabled="onlyRead" clearable style="width: 150px">
          <template slot="append">天</template>
        </el-input>
        <el-input v-model="form.wait_hour" :disabled="onlyRead" clearable style="width: 150px">
          <template slot="append">小时</template>
        </el-input>
        <el-select v-model="form.wait_minute" :disabled="onlyRead" clearable style="display: inline-block;width: 150px">
          <el-option v-for="(item, index) in minutesOptions" :label="item.label" :value="item.value" :key="index"/>
        </el-select>
        分钟
        <div style="font-size: 12px;">例：系统执行营销动作（给用户发送一张优惠券）后，判断xx天有没有发生动作相关事件（用户有没有去核销优惠券。）</div>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { getEventTypeList, getEventListByType, getFilterAttributes } from '@/api/markting/event'
import dateComponent from '../eventFieldComs/dateComponent'
import judgeValueComponent from '../eventFieldComs/judgeValueComponent'
import enumComponent from '../eventFieldComs/enumComponent'
import wechatMenuComponent from '../eventFieldComs/wechatMenuComponent'
import inputComponent from '../eventFieldComs/inputComponent'
import enumSelectComponent from '../eventFieldComs/enumSelectComponent'
import chooseCity from '../eventFieldComs/chooseCity'
import chooseStore from '../eventFieldComs/chooseStore'
import chooseBrandMemberLevel from '../eventFieldComs/chooseBrandMemberLevel'
import chooseOrganLevel from '../eventFieldComs/chooseOrganLevel'

import { getPreviousEventNodesInfo } from '../util'

export default {
  name: 'EventJudge',
  components: {
    dateComponent,
    judgeValueComponent,
    enumComponent,
    wechatMenuComponent,
    inputComponent,
    enumSelectComponent,
    chooseCity,
    chooseStore,
    chooseBrandMemberLevel,
    chooseOrganLevel
  },
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
  inject: ['flowChartMap'],
  data() {
    var nodeConf = {
      node_desc: '',
      event_type: '',
      eventid: '',
      action_true_nodeId: this.curComConfig.nodeConf.action_true_nodeId,
      action_false_nodeId: this.curComConfig.nodeConf.action_false_nodeId,
      // ... 事件条件
      filterConditions: [
      ],

      // 执行等待时间
      wait_days: '',
      wait_hour: '',
      wait_minute: ''
    }

    if (this.curComConfig.nodeConf && (this.curComConfig.nodeConf.node_desc || this.curComConfig.nodeConf.eventid)) {
      nodeConf = JSON.parse(JSON.stringify(this.curComConfig.nodeConf))
    }

    return {
      eventTypes: [],
      eventItems: [],
      filterConditions: [],
      minutesOptions: [
        { label: '10', value: 10 },
        { label: '20', value: 20 },
        { label: '30', value: 30 },
        { label: '40', value: 40 },
        { label: '50', value: 50 }
      ],
      form: nodeConf,
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
    activityCreateIfByTemplate() {
      if (this.flowChartMap.activityInfo.marketingTemplateDefId) {
        return true
      }
      return false
    },
    hasRegistComponent(componentType) {
      var newComponentType = componentType.replace(/(\w)(\w+)/, function() {
        return arguments[1].toLowerCase() + '' + arguments[2]
      })

      if (this.$options.components[newComponentType] || this.$options.components[componentType]) {
        return true
      } else {
        console.log(`component is not exist ${componentType}`)
        return false
      }
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
        this.getFilterAttributes(this.diffFilterFields)
      } else {
        this.loadedDone = true
      }
    },
    /**
     * 防止事件过滤字段，db添加，或者删字段
     * 画布json中的条件字段同数据库现有条件字段做比对，并动态做删除和加入字段逻辑
     */
    diffFilterFields() {
      this.changeFilterFields(this.form.filterConditions, this.filterConditions)
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
              column_value_type: 'field',
              meta_column_id: filterConditions[i].meta_column_id,
              column_value: ''
            })
          }
        } else {
          formFilterConditions.push({
            column_name: filterConditions[i].column_name,
            meta_column_id: filterConditions[i].meta_column_id,
            column_value_type: 'field',
            column_value: ''
          })
        }
      }
    },
    getEventListByType() {
      if (this.form.event_type) {
        this.form.eventid = ''
        this.eventItems = []
        this.filterConditions = []

        getEventListByType({ eventTypeCode: this.form.event_type }).then((res) => {
          this.eventItems = this.filterEventItems((res.data && res.data.list) || [])
        })
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
    initFilterAttributes() {
      this.getFilterAttributes(() => {
        var temp
        var tempFilterConditions = []
        for (var i = 0; i < this.filterConditions.length; i++) {
          temp = {}
          temp.column_name = this.filterConditions[i].column_name
          temp.meta_column_id = this.filterConditions[i].meta_column_id
          temp.column_value = ''
          temp.column_value_type = 'field'
          tempFilterConditions.push(temp)
        }
        this.form.filterConditions = tempFilterConditions
      })
    },
    getFilterAttributes(cb) {
      if (this.form.eventid) {
        getFilterAttributes({ metaTableId: this.form.eventid }).then((res) => {
          this.filterConditions = res.data.list
          if (typeof cb === 'function') {
            cb()
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
    vaidateValueHandler(rule, value, cb) {
      if (!/^[1-9]\d*$/.test(this.form.wait_days) && !/^[1-9]\d*$/.test(this.form.wait_hour) && !/^[1-9]\d*$/.test(this.form.wait_minute)) {
        cb(new Error('请填写正整数'))
        return
      } else {
        if (this.form.wait_days) {
          if (!/^[1-9]\d*$/.test(this.form.wait_days)) {
            cb(new Error('等待天请填写正整数'))
            return
          }
        }
        if (this.form.wait_hour) {
          if (!/^[1-9]\d*$/.test(this.form.wait_hour)) {
            cb(new Error('等待小时请填写正整数'))
            return
          }
        }
        if (this.form.wait_minute) {
          if (!/^[1-9]\d*$/.test(this.form.wait_minute)) {
            cb(new Error('等待分钟请填写正整数'))
            return
          }
        }
        cb()
      }
    }
  }
}
</script>
