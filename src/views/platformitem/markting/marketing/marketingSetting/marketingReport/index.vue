<template>
  <flow-area id="canvas" ref="flowArea" :flow-data="flowData" :style="flowAreaStyle" class="jsplumb-container" style="position: relative;" @setUpUpData="setData1"/>
</template>
<script>

import { flowConfig } from '../conf'

// 画布组件
import FlowArea from './flowArea'
import { jsPlumb } from 'jsplumb'

// import { activityInfo, activityTemplateInfo } from '@/api/markting/marketing'
import { queryCrowdFlowDetail } from '@/api/markting/report'

export default {
  name: 'MarketingReport',
  components: {
    FlowArea
  },
  provide() {
    return {
      flowChartMap: this
    }
  },
  props: {
    activityQs: {
      type: Object,
      default() {
        return {
          marketingNo: 'YX1119997',
          marketingId: '12',
          marketingType: 'diy'
        }
      }
    }
  },
  data() {
    return {
      // jsPlumb 实例
      plumb: null,
      count: 1,
      requestNo: '',
      activityInfo: {},
      // 画布数据
      flowData: {
        // 节点数据
        nodeItems: [],
        // 连线数据
        linkItems: []
      }
    }
  },
  computed: {
    flowAreaStyle() {
      var nodeItems = this.flowData.nodeItems
      var maxPosX = 0
      var maxPosY = 0

      if (nodeItems.length) {
        for (var i = 0; i < nodeItems.length; i++) {
          if (nodeItems[i].x > maxPosX) {
            maxPosX = nodeItems[i].x
          }
          if (nodeItems[i].y > maxPosY) {
            maxPosY = nodeItems[i].y
          }
        }
      }

      return {
        'min-width': maxPosX + 250 < 1000 ? '1020px' : (maxPosX + 250) + 'px',
        height: maxPosY + 200 < 600 ? '600px' : (maxPosY + 200) + 'px'
      }
    }
  },
  mounted() {
    this.initJsPlumb()
    // if (this.activityQs.create_type === 'activity') {
    //   // 调用活动数据接口
    //   this.initJsPlumbData()
    // } else {
    //   this.initJsPlumbData()
    // }
    this.initJsPlumbData()
  },
  methods: {
    setData1(val) {
      this.$emit('setData', val)
    },
    initJsPlumb() {
      this.plumb = jsPlumb.getInstance(flowConfig.jsPlumbInsConfig)
      this.plumb.importDefaults({
        ConnectionsDetachable: flowConfig.jsPlumbConfig.conn.isDetachable
      })

      this.plumb.bind('connection', (conn, e) => {
        if (!this.checkLinkItemHasExist(conn)) {
          const o = {}
          o.type = 'link'
          o.id = this.getUuid()
          o.sourceId = conn.sourceId
          o.targetId = conn.targetId
          this.flowData.linkItems.push(o)
        }

        this.setConnLabel(conn.connection)
      })
    },
    setConnLabel(connection) {
      var label = this.getConnLabel(connection)

      if (label) {
        connection.setLabel({
          label: label,
          cssClass: 'transformLabel aLabel',
          location: 1
        })
      }
    },
    getConnLabel(connection) {
      var sourceId = connection.sourceId
      var nodeItems = this.flowData.nodeItems
      var matchedNodeItem, i
      for (i = 0; i < nodeItems.length; i++) {
        if (nodeItems[i].id === sourceId) {
          matchedNodeItem = nodeItems[i]
        }
      }
      if (matchedNodeItem) {
        if (matchedNodeItem.name === 'eventSelect') {
          for (i = 0; i < matchedNodeItem.nodeConf.branches.length; i++) {
            if (matchedNodeItem.nodeConf.branches[i].branchid === connection.targetId) {
              return matchedNodeItem.nodeConf.branches[i].branch_name
            }
          }
        } else if (matchedNodeItem.name === 'eventJudge') {
          if (matchedNodeItem.nodeConf.action_true_nodeId === connection.targetId) {
            return '是'
          }
          if (matchedNodeItem.nodeConf.action_false_nodeId === connection.targetId) {
            return '否'
          }
        } else if (matchedNodeItem.name === 'abTest') {
          for (i = 0; i < matchedNodeItem.nodeConf.actions_ABtest.length; i++) {
            if (matchedNodeItem.nodeConf.actions_ABtest[i].id === connection.targetId) {
              return matchedNodeItem.nodeConf.actions_ABtest[i].desc
            }
          }
        }
      }

      return ''
    },
    checkLinkItemHasExist(conn) {
      var linkItems = this.flowData.linkItems
      for (var i = 0; i < linkItems.length; i++) {
        if (linkItems[i].sourceId === conn.sourceId && linkItems[i].targetId === conn.targetId) {
          return true
        }
      }

      return false
    },
    initJsPlumbData() {
      queryCrowdFlowDetail(this.activityQs).then(res => {
        if (res.data) {
          this.$emit('sendData', res.data)
          this.flowData = res.data
          this.renderJsplumb()
        }
      })
      // if (this.activityQs.create_type === 'activity') {
      //   activityInfo({ id: this.activityQs.id }).then((res) => {
      //     if ((res.code === '1' || res.code === 1) && res.bizCode === 20000) {
      //       this.activityInfo = res.data

      //       if (this.activityInfo.marketingContent && typeof this.activityInfo.marketingContent === 'string') {
      //         this.flowData = JSON.parse(this.activityInfo.marketingContent)
      //       }
      //       // todo... render jsplumb
      //       this.initJsPlumbNodes()
      //     }
      //   })
      // } else {
      //   activityTemplateInfo({ id: this.activityQs.id }).then((res) => {
      //     if ((res.code === '1' || res.code === 1) && res.bizCode === 20000) {
      //       this.activityInfo = res.data

      //       if (this.activityInfo.marketingContent && typeof this.activityInfo.marketingContent === 'string') {
      //         this.flowData = JSON.parse(this.activityInfo.marketingContent)
      //       }
      //       // todo... render jsplumb
      //       this.initJsPlumbNodes()
      //     }
      //   })
      // }
    },
    initJsPlumbNodes() {
      // var marketingContent = {}
      // try {
      //   if (this.activityInfo.marketingContent) {
      //     marketingContent = JSON.parse(this.activityInfo.marketingContent)
      //   }
      // } catch (err) {
      //   console.log(err)
      // }

      // if (marketingContent.nodeItems && marketingContent.nodeItems.length) {
      // // 如果画布当前有节点
      //   if (this.activityQs.create_type === 'activity') {
      //     // 拼装数据
      //     this.flowData = marketingContent
      //     this.renderJsplumb()
      //   } else {
      //     this.flowData = marketingContent
      //     this.renderJsplumb()
      //   }
      // }
    },
    renderJsplumb() {
    // 做渲染逻辑
      this.$nextTick(() => {
        var linkItems = this.flowData.linkItems
        for (var i = 0; i < linkItems.length; i++) {
          this.plumb.connect({ uuids: [linkItems[i].sourceId + 'BottomCenter', linkItems[i].targetId + 'TopCenter'] })
        }
        this.plumb.repaintEverything()
      })
    }
  }
}
</script>
<style>
.jsplumb-container .aLabel {
  background-color: white;
  padding: 2px;
  font: 12px sans-serif;
  color: #444;
  z-index: 21;
  border: 1px dotted gray;
  opacity: 0.8;
  cursor: pointer;
}
.transformLabel.jtk-overlay {
  transform: translate(-50%, -150%) !important;
}
</style>
