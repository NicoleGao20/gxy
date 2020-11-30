<template>
  <div>
    <el-alert
      :closable="false"
      type="error"
      title="实时营销下事件重复且活动重入次数>1"
      description="营销活动编辑引用了相同时间，请将营销限制次数设置为1或删除相同事件"
      show-icon/>
    <el-table :data="eventGroups" :height="400" :cell-style="cellStyleHandler" style="margin-top: 10px;">
      <el-table-column label="组件名称" prop="label"/>
      <el-table-column label="流程说明" prop="nodeConf.node_desc"/>
    </el-table>
  </div>
</template>
<script>
export default {
  name: 'RtSameEvent',
  props: {
    eventMap: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      colorMap: this.colorMapHandler()
    }
  },
  computed: {
    eventGroups() {
      var eventGroups = []
      for (var attr in this.eventMap) {
        if (this.eventMap[attr].length >= 2) {
          eventGroups = eventGroups.concat(this.eventMap[attr])
        }
      }
      return eventGroups
    }
  },
  methods: {
    colorMapHandler() {
      var colorItems = ['#9999cc', '#ffd996', '#91c5f3', '#6a92cb', '#41c7db', '#006699', '#0099cc']
      var colorMap = {}
      var counter = 0
      for (var attr in this.eventMap) {
        if (this.eventMap[attr].length >= 2) {
          colorMap[this.eventMap[attr][0].nodeConf.eventid] = colorItems[counter]
          counter++
        }
      }
      return colorMap
    },
    rowStyleHandler({ row }) {
      return { backgroundColor: this.colorMap[row.nodeConf.eventid] }
    },
    cellStyleHandler({ row, column }) {
      if (column.property === 'nodeConf.node_desc') {
        return { color: this.colorMap[row.nodeConf.eventid] }
      }
    }
  }
}
</script>
