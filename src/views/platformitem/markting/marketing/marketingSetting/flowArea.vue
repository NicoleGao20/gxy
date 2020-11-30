<template>
  <div
  >
    <nodeItem
      v-for="nodeItemData in flowData.nodeItems"
      :key="nodeItemData.id"
      :node-item-data="nodeItemData"
      :id="nodeItemData.id"
      :class="[isSelectedNode(nodeItemData) > -1 ? 'selected' : '', flowChartMap.curActivedNode.id === nodeItemData.id ? 'actived' : '']"
      class="node-item plumb-node"
      @updateNodePos="updateNodePos"/>
    <div
      v-show="shiftKey"
      :style="{ top: rect.position.top + 'px', left: rect.position.left + 'px', width: rect.width + 'px', height: rect.height + 'px' }"
      class="rectangle"/>
  </div>
</template>
<script>
import nodeItem from './nodeItem'

export default {
  name: 'FlowArea',
  componentName: 'FlowArea',
  inject: ['flowChartMap'],
  components: {
    nodeItem
  },
  props: {
    flowData: {
      type: Object,
      default() {
        return {
          nodeItems: [],
          linkItems: []
        }
      }
    }
  },
  data() {
    return {
      shiftKey: false,
      currentSelectGroup: [],

      mouse: {
        position: {
          x: 0, y: 0
        },
        tempPos: {
          x: 0, y: 0
        }
      },

      rect: {
        width: 0,
        height: 0,
        position: {
          top: 0,
          left: 0
        }
      }
    }
  },
  mounted() {
    if (this.flowChartMap.actionType === 'edit' || this.flowChartMap.actionType === 'add') {
      window.addEventListener('mousedown', this.mousedownHandler, false)
    }

    this.$on('joinSelectGroupNode', this.joinSelectGroup)
    this.$on('clearSelectGroupNode', this.clearSelectGroup)
  },
  destroyed() {
    if (this.flowChartMap.actionType === 'edit' || this.flowChartMap.actionType === 'add') {
      window.removeEventListener('mousedown', this.mousedownHandler)
    }
  },
  methods: {
    clearSelectGroup() {
      this.currentSelectGroup = []
      this.flowChartMap.plumb.clearDragSelection()
    },
    joinSelectGroup(curSelectNode) {
      var index = this.isSelectedNode(curSelectNode)
      // 清空当前选中 actived
      this.flowChartMap.curActivedNode = {}
      this.flowChartMap.mapNodeTypeChildren = {}

      if (index > -1) {
        this.currentSelectGroup.splice(index, 1)
        this.flowChartMap.plumb.removeFromDragSelection(curSelectNode.id)
      } else {
        this.flowChartMap.plumb.addToDragSelection(curSelectNode.id)
        this.currentSelectGroup.push(curSelectNode)
      }
    },
    isSelectedNode(nodeItem) {
      for (var i = 0; i < this.currentSelectGroup.length; i++) {
        if (this.currentSelectGroup[i].id === nodeItem.id) {
          return i
        }
      }
      return -1
    },
    mousedownHandler(e) {
      const that = this
      const event = e
      if (event.shiftKey) {
        that.shiftKey = event.shiftKey
      }

      if (that.shiftKey) {
        // 清空当前选中 actived, 黄色
        this.flowChartMap.curActivedNode = {}
        this.flowChartMap.mapNodeTypeChildren = {}

        window.addEventListener('mousemove', that.mousemoveHandler, false)
        window.addEventListener('mouseup', that.mouseupHandler, false)
        that.mouse.tempPos.x = e.clientX
        that.mouse.tempPos.y = e.clientY
      } else {
        that.currentSelectGroup = []
        that.mouse.tempPos.x = e.clientX
        that.mouse.tempPos.y = e.clientY
      }
    },
    mousemoveHandler(e) {
      const that = this
      const event = e

      event.preventDefault()
      if (that.shiftKey) {
        that.mouse.position = {
          x: event.clientX,
          y: event.clientY
        }

        let h = that.mouse.position.y - that.mouse.tempPos.y
        let w = that.mouse.position.x - that.mouse.tempPos.x

        let t = that.mouse.tempPos.y
        let l = that.mouse.tempPos.x

        if (h >= 0 && w < 0) {
          w = -w
          l -= w
        } else if (h < 0 && w >= 0) {
          h = -h
          t -= h
        } else if (h < 0 && w < 0) {
          h = -h
          w = -w
          t -= h
          l -= w
        }

        var jsPlumbContainerRect = this.$el.getBoundingClientRect()

        that.rect.height = h
        that.rect.width = w
        that.rect.position.top = t - jsPlumbContainerRect.top
        that.rect.position.left = l - jsPlumbContainerRect.left
      }
    },
    mouseupHandler(e) {
      const that = this
      that.judgeSelectedNode()
      that.rect = {
        width: 0,
        height: 0,
        position: {
          top: 0,
          left: 0
        }
      }

      that.shiftKey = false
      window.removeEventListener('mousemove', that.mousemoveHandler)
      window.removeEventListener('mouseup', that.mouseupHandler)
    },
    judgeSelectedNode() {
      const that = this

      const ay = that.rect.position.top
      const ax = that.rect.position.left
      const by = ay + that.rect.height
      const bx = ax + that.rect.width

      const nodeItems = that.flowData.nodeItems
      nodeItems.forEach(function(node, index) {
        if (node.y >= ay && node.x >= ax && node.y <= by && node.x <= bx) {
          that.flowChartMap.plumb.addToDragSelection(node.id)
          that.currentSelectGroup.push(node)
        }
      })
    },
    updateNodePos(diffPos, currNode, e) {
      const that = this
      if (that.currentSelectGroup.length) {
        const nodeList = that.flowData.nodeItems
        var matchCurNode = false
        that.currentSelectGroup.forEach(function(node, index) {
          if (node.id === currNode.id) matchCurNode = true
          const f = nodeList.filter(n => n.id === node.id)[0]
          f.x += diffPos.x
          f.y += diffPos.y
        })

        if (!matchCurNode) {
          currNode.x += diffPos.x
          currNode.y += diffPos.y
        }

        if (!e.shiftKey) {
          that.currentSelectGroup = []
          that.flowChartMap.plumb.clearDragSelection()
        }
        that.flowChartMap.plumb.repaintEverything()
      } else {
        currNode.x += diffPos.x
        currNode.y += diffPos.y
      }
    }
  }
}
</script>
<style scoped>
.rectangle {
  position: absolute;
  border: 1px dashed #31676f;
  background-color: #0cceea29;
}
</style>
