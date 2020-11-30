<template>
  <div
    :style="{ position: 'absolute', left: nodeItemData.x+'px', top: nodeItemData.y+'px' }"
  >
    <div class="select-outline">
      <img :src="nodeItemData.icon" style="display: block;" @click.stop="activeNextNodeTop($event)">
    </div>
    <span v-if="showEditBtn()" :class="[($route.query.action_type === 'audit'||$route.query.action_type === 'view') ? 'el-icon-view':'el-icon-edit']" class="action-btn node-edit" @click.stop="editHandler"/>
    <span v-if="showResetBtn()" class="el-icon-remove-outline action-btn node-reset" @click.stop="resetNodeHandler"/>

    <el-popover
      v-model="removeNodePoperVisible"
      :append-to-body="true"
      width="160"
      placement="left"
    >
      <div>删除节点会导致该节点数据被删除</div>
      <div style="text-align: right; margin: 0">
        <el-button size="mini" type="text" @click="removeNodePoperVisible = false">取消</el-button>
        <el-tag size="mini" type="danger" style="cursor: pointer;" @click="removeHandler">确定</el-tag>
      </div>
      <span v-show="showDelBtn()" slot="reference" class="el-icon-delete action-btn node-remove"/>
    </el-popover>

    <el-popover
      v-model="curNodePoperVisible"
      :append-to-body="false"
      width="160"
      placement="left"
    >
      <span v-show="showCurNodeSettingComponentBtn()" slot="reference" class="el-icon-setting action-btn node-remove" @click="openCurNodePoper"/>
      <ul class="next-node-group-items-wrap">
        <li v-for="(nodeItem, index) in currentNodes" :key="index">
          <span class="node-type node-list-item">{{ nodeItem.label }}</span>
          <ul class="next-node-group-item-wrap">
            <li v-for="(nodeItem, index) in nodeItem.children" :key="index" @click="updateCurNode(nodeItem)">
              <span class="node-list-item node-item-com">{{ nodeItem.label }}</span>
            </li>
          </ul>
        </li>
      </ul>
    </el-popover>

    <el-popover
      v-model="nextNodePoperVisible"
      :append-to-body="false"
      width="160"
      placement="right"
    >
      <span v-show="showNextNodeBtn()" slot="reference" class="el-icon-back next-node-tip" @click="openNextNodePoper"/>
      <ul class="next-node-group-items-wrap">
        <li v-for="(nodeChildrenItem, index) in nodeChildrenItems" :key="index">
          <span class="node-type node-list-item">{{ nodeChildrenItem.label }}</span>
          <ul class="next-node-group-item-wrap">
            <li v-for="(nodeItem, index) in nodeChildrenItem.children" :key="index" @click="addNextNode(nodeItem)">
              <span class="node-list-item node-item-com">{{ nodeItem.label }}</span>
            </li>
          </ul>
        </li>
      </ul>
    </el-popover>
    <div class="com-name">{{ nodeItemData.label }}</div>
    <div v-if="nodeItemData.nodeConf&&nodeItemData.nodeConf.node_desc" class="com-icon-desc">
      <el-tooltip v-if="nodeItemData.nodeConf.node_desc.length >= 21" effect="light" placement="bottom">
        <div slot="content" style="width: 200px;">
          {{ nodeItemData.nodeConf.node_desc }}
        </div>
        <div>
          {{ nodeItemData.nodeConf.node_desc }}
        </div>
      </el-tooltip>
      <div v-if="nodeItemData.nodeConf.node_desc.length < 21">{{ nodeItemData.nodeConf.node_desc }}</div>
    </div>
  </div>
</template>
<script>
import { sourceEndpoint, targetEndpoint } from './conf'
import emitter from 'element-ui/src/mixins/emitter'
import { getNodeChildrenData, getParentNodeData, getPreviousEventNodesInfo } from './util'

export default {
  name: 'NodeItem',
  componentName: 'NodeItem',
  mixins: [emitter],
  inject: ['flowChartMap'],
  props: {
    nodeItemData: {
      type: Object,
      default() {
        return {}
      }
    },
    plumb: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      nextNodePoperVisible: false,
      removeNodePoperVisible: false,
      curNodePoperVisible: false,
      startPoint: null,
      stopPoint: null
    }
  },
  computed: {
    parentNode() {
      return getParentNodeData(this.nodeItemData, this.flowChartMap.flowData.nodeItems)
    },
    previousEventNodesInfo() {
      return getPreviousEventNodesInfo(this.nodeItemData, this.flowChartMap.flowData.nodeItems)
    },
    currentNodes() {
      if (this.parentNode) {
        return this.getTipNodeList(this.parentNode)
      } else {
        return []
      }
    },
    nodeChildrenItems() {
      if (this.nodeItemData.name) {
        return this.getTipNodeList(this.nodeItemData)
      } else {
        return []
      }
    }
  },
  mounted() {
    this.flowChartMap.plumb.draggable(
      this.nodeItemData.id,
      {
        containment: 'parent',
        grid: [10, 10],
        stop: this.stopHandler
      }
    )
    this.startPoint = this.flowChartMap.plumb.addEndpoint(
      this.nodeItemData.id,
      sourceEndpoint,
      {
        anchor: 'BottomCenter',
        // 端点不允许拖动
        // enabled: false,
        uuid: this.nodeItemData.id + 'BottomCenter'
      }
    )

    if (!this.nodeItemData.headNode) {
      this.stopPoint = this.flowChartMap.plumb.addEndpoint(
        this.nodeItemData.id,
        targetEndpoint,
        {
          anchor: 'TopCenter',
          // 端点不允许拖动
          // enabled: false,
          uuid: this.nodeItemData.id + 'TopCenter'
          // scope: this.nodeData.scope
        }
      )
    }
  },
  methods: {
    openCurNodePoper() {
      var parentEventNode
      if (this.previousEventNodesInfo.previousEventNodes && this.previousEventNodesInfo.previousEventNodes.length) {
        parentEventNode = this.previousEventNodesInfo.previousEventNodes[0]
        if (!parentEventNode.nodeConf.eventid) {
          this.$message({
            type: 'error',
            offset: 60,
            message: `当前节点上游${parentEventNode.name === 'eventJudge' ? '事件判断' : '事件选择'}节点未填写内容`
          })
          setTimeout(() => {
            this.curNodePoperVisible = false
          })
        }
      }
    },
    openNextNodePoper() {
      var parentEventNode
      if (this.previousEventNodesInfo.previousEventNodes && this.previousEventNodesInfo.previousEventNodes.length) {
        parentEventNode = this.previousEventNodesInfo.previousEventNodes[0]
        if (!parentEventNode.nodeConf.eventid) {
          this.$message({
            type: 'error',
            offset: 60,
            message: `当前节点上游${parentEventNode.name === 'eventJudge' ? '事件判断' : '事件选择'}节点未填写内容`
          })
          setTimeout(() => {
            this.nextNodePoperVisible = false
          })
        }
      }
    },
    getTipNodeList(nodeItem) {
      var nextStepNodeItems = []
      var nodeChildrenItems
      // abTest 分支节点并且存在level， 对比多动作效果
      if (this.nodeItemData.level) {
        if (this.nodeItemData.level === 1) {
          nodeChildrenItems = [
            {
              type: 'marketAction',
              label: '营销动作',
              children: [
                { label: '优惠券', name: 'coupon', component: 'coupon' }
              ]
            }
          ]
          this.commonFilteNodeChildrenItems(nextStepNodeItems, nodeChildrenItems)
          return nextStepNodeItems
        } else if (this.nodeItemData.level === 2) {
          nodeChildrenItems = [
            {
              type: 'marketAction',
              label: '营销动作',
              children: [
                { label: '微信模版消息', name: 'wxTemplateMsg', component: 'wxTemplateMsg' },
                { label: '图文素材', name: 'wxNews', component: 'wxNews' } ,
                
              ]
            }
          ]
          this.commonFilteNodeChildrenItems(nextStepNodeItems, nodeChildrenItems)
          return nextStepNodeItems
        }
      } else {
        nodeChildrenItems = getNodeChildrenData(nodeItem.name)
        this.commonFilteNodeChildrenItems(nextStepNodeItems, nodeChildrenItems)
        return nextStepNodeItems
      }
    },
    commonFilteNodeChildrenItems(nextStepNodeItems, nodeChildrenItems) {
      var i
      var j

      /**
         * 周期性营销不允许有abTest
         */
      var marketing_type = this.$route.query.marketing_type
      if (marketing_type === 'period') {
        for (i = 0; i < nodeChildrenItems.length; i++) {
          for (j = 0; j < nodeChildrenItems[i].children.length;) {
            if (nodeChildrenItems[i].children[j].component === 'abTest') {
              nodeChildrenItems[i].children.splice(j, 1)
            } else {
              j++
            }
          }
        }
      }

      /**
         * 有事件选择，事件分支时，不允许有图文素材
         */
      if (this.previousEventNodesInfo.previousEventNodes.length) {
        for (i = 0; i < nodeChildrenItems.length; i++) {
          if (nodeChildrenItems[i].type !== 'marketAction') continue
          for (j = 0; j < nodeChildrenItems[i].children.length;) {
            if (nodeChildrenItems[i].children[j].component === 'wxNews') {
              nodeChildrenItems[i].children.splice(j, 1)
              break
            } else {
              j++
            }
          }
          break
        }
      }

      /** 继续过滤
         * 营销对象是关注者时，目前动作微信模版，图文素材
         */

      // marketing_target 默认为营销活动对象，如果事件组中有产生member_id 则认为marketing_target为member_id，
      // 否则当前节点对象则为事件main_idtype
      var marketing_target = this.$route.query.marketing_target
      var previousEventNodesInfo = this.previousEventNodesInfo

      if (previousEventNodesInfo.previousEventNodes && previousEventNodesInfo.previousEventNodes.length) {
        if (this.previousEventNodesInfo.main_idtype_group.indexOf('member_id') > -1 || marketing_target === 'member_id') {
          marketing_target = 'member_id'
        } else {
          if (previousEventNodesInfo.previousEventNodes[0].nodeConf.idMap) {
            marketing_target = previousEventNodesInfo.previousEventNodes[0].nodeConf.idMap.main_idtype
          }
        }
      }

      /**
         * 营销对象为wx_openid || app_openid时，需要过滤动作组件
         */

      for (i = 0; i < nodeChildrenItems.length; i++) {
        if (marketing_target === 'wx_openid' || marketing_target === 'app_openid') {
          if (nodeChildrenItems[i].type === 'marketAction') {
            for (j = 0; j < nodeChildrenItems[i].children.length;) {
              // nodeChildrenItems[i].children[j].component 不在对应marketingTarget的动作组里面，则删除
              if (this.flowChartMap.marketTargetActions[marketing_target].indexOf(nodeChildrenItems[i].children[j].component) === -1) {
                nodeChildrenItems[i].children.splice(j, 1)
              } else {
                j++
              }
            }
          }
        }
      }

      /**
         * 继续过滤
         * 根据组件资源菜单过滤权限
         */
      for (i = 0; i < nodeChildrenItems.length; i++) {
        // var sideMarketMenus = this.getSideMarketMenusByType(nodeChildrenItems[i].type)
        // for (j = 0; j < nodeChildrenItems[i].children.length;) {
        //   if (!this.checkNextNodeIsExistSideMenu(nodeChildrenItems[i].children[j].component, sideMarketMenus)) {
        //     nodeChildrenItems[i].children.splice(j, 1)
        //   } else {
        //     j++
        //   }
        // }

        if (nodeChildrenItems[i].children.length) {
          nextStepNodeItems.push(nodeChildrenItems[i])
        }
      }
    },
    showResetBtn() {
      if (this.flowChartMap.activityInfo.marketingTemplateDefId) {
        return false
      }
      if (this.flowChartMap.actionType === 'audit') {
        return false
      }

      if (this.flowChartMap.actionType === 'view') {
        return false
      }

      // 其他判断控制逻辑...
      if (this.parentNode && this.parentNode.component === 'eventJudge' && this.nodeItemData.component) {
        return true
      }
      return false
    },
    checkNextNodeIsExistSideMenu(componentName, sideMarketMenus) {
      for (var i = 0; i < sideMarketMenus.length; i++) {
        if (sideMarketMenus[i].component === componentName) {
          return true
        }
      }
      return false
    },
    getSideMarketMenusByType(type) {
      var sideMarketMenus = this.flowChartMap.sideMarketMenus
      for (var i = 0; i < sideMarketMenus.length; i++) {
        if (type === sideMarketMenus[i].type) {
          return sideMarketMenus[i].children
        }
      }
    },
    stopHandler(e) {
      // 真的产生了实质性的拖动时才去做更新节点位置的操作
      if (Math.abs(e.pos[0] - this.nodeItemData.x) >= 10 || Math.abs(e.pos[1] - this.nodeItemData.y) >= 10) {
        this.$emit('updateNodePos', { x: e.pos[0] - this.nodeItemData.x, y: e.pos[1] - this.nodeItemData.y }, this.nodeItemData, e.e)
      }
    },
    showEditBtn() {
      if (!this.nodeItemData.initDefaultNode) {
        if (this.parentNode && this.nodeItemData.name) {
          return true
        } else {
          return false
        }
      } else {
        return true
      }
    },
    showCurNodeSettingComponentBtn() {
      if (this.flowChartMap.activityInfo.marketingTemplateDefId) {
        return false
      }

      if (this.flowChartMap.actionType === 'audit') {
        return false
      }

      if (this.flowChartMap.actionType === 'view') {
        return false
      }

      if (this.parentNode && this.parentNode.mulBranch) {
        return true
      }
      if (this.nodeItemData.level) {
        return true
      }

      return false
    },
    showDelBtn() {
      if (this.flowChartMap.activityInfo.marketingTemplateDefId) {
        return false
      }

      if (this.flowChartMap.actionType === 'audit') {
        return false
      }

      if (this.flowChartMap.actionType === 'view') {
        return false
      }
      // 画布初始节点，当前节点不允许删除
      if (this.nodeItemData.initDefaultNode) {
        return false
      }
      // 父节点为多分支状态，或者为ab测试，当前节点不允许删除
      if (this.parentNode && (this.parentNode.mulBranch || this.parentNode.name === 'abTest') || this.nodeItemData.name === 'metric' || this.nodeItemData.level) {
        return false
      } else {
        return true
      }
    },
    showNextNodeBtn() {
      // 模版时不现实该按钮
      if (this.flowChartMap.activityInfo.marketingTemplateDefId) {
        return false
      }
      // 审核时不显示该按钮
      if (this.flowChartMap.actionType === 'audit') {
        return false
      }
      // 查看时不显示该按钮
      if (this.flowChartMap.actionType === 'view') {
        return false
      }
      // 当前节点hiddenNextNodeTip为true时不显示该按钮
      if (this.nodeItemData.hiddenNextNodeTip) {
        return false
      }
      // ab 测试时不显示该按钮
      if (this.parentNode && this.parentNode.name === 'abTest') {
        return false
      }
      // 不存在name时，不显示该按钮
      if (this.nodeItemData.name) {
        // 是多分支组件时，不显示该按钮
        if (!this.nodeItemData.mulBranch) {
          return true
        } else {
          return false
        }
      } else {
        return false
      }
    },
    activeNextNodeTop($event) {
      if ($event.shiftKey) {
        this.dispatch('FlowArea', 'joinSelectGroupNode', [this.nodeItemData, $event])
      } else {
        this.dispatch('FlowArea', 'clearSelectGroupNode')
        if (this.flowChartMap.actionType === 'add' || this.flowChartMap.actionType === 'edit') {
          // 匹配到高亮节点
          if (this.nodeItemData.name) {
            var plumbEndNodes = this.flowChartMap.plumbEndNodes
            for (var i = 0; i < plumbEndNodes.length; i++) {
              if (this.nodeItemData.id === plumbEndNodes[i].id) {
                this.dispatch('MarketingSetting', 'setActiveNode', [this.nodeItemData, $event])
                return
              }
            }
          }
        }
      }
    },
    editHandler() {
      var parentEventNode
      if (this.previousEventNodesInfo.previousEventNodes.length > 0) {
        parentEventNode = this.previousEventNodesInfo.previousEventNodes[0]
        if (parentEventNode.nodeConf.eventid) {
          this.dispatch('MarketingSetting', 'openModal', [this.nodeItemData])
        } else {
          this.$message({
            type: 'warning',
            message: `当前节点上游${parentEventNode.name === 'eventJudge' ? '事件判断' : '事件选择'}节点未填写内容`
          })
        }
      } else {
        this.dispatch('MarketingSetting', 'openModal', [this.nodeItemData])
      }
    },
    addNextNode(nodeItem) {
      this.dispatch('MarketingSetting', 'addNextNode', [nodeItem, this.nodeItemData])
      this.nextNodePoperVisible = false
    },
    removeHandler() {
      this.dispatch('MarketingSetting', 'removeCurrenttNode', [this.nodeItemData])
    },
    updateCurNode(nodeItem) {
      if (this.parentNode.name === 'eventSelect' || this.parentNode.name === 'eventJudge') {
        // 修改当前节点，且删除子孙节点
        this.dispatch('MarketingSetting', 'updateCurNodeAndRemoveDescendantNode', [nodeItem, this.nodeItemData])
      } else {
        // 默认为abTest
        this.dispatch('MarketingSetting', 'updateCurNode', [nodeItem, this.nodeItemData])
      }
    },
    resetNodeHandler() {
      this.dispatch('MarketingSetting', 'resetCurNode', [this.nodeItemData])
    }
  }
}
</script>

<style scoped>
.node-item {
  display: inline-block;
  width: 54px;
  height: 74px;
  position: relative;
}
.action-btn {
  position: absolute;
  background: rgb(0, 91, 255, 0.6);
  border-radius: 50%;
  color: #fff;
  padding: 2px;
  cursor: pointer;
}
.node-edit {
  right: 0;
  top: -4px;
}
.node-reset {
  right: 0;
  top: 18px;
}
.node-remove {
  display: block;
  left: -5px;
  top: 30px;
  transform: translateY(-50%);
}
.action-btn:hover {
  background: rgb(0, 91, 255, 0.9);
}
.next-node-tip {
  transform: rotate(-90deg);
  position: absolute;
  right: 0;
  top: 40px;
  background: rgb(0, 91, 255, 0.7);
  border-radius: 50%;
  color: #fff;
  padding: 2px;
  cursor: pointer;
}
.next-node-tip:hover {
  background: rgb(0, 91, 255, 0.9);
}
.next-node-group-items-wrap {
  margin: -12px;
  text-indent: 20px;
}
.next-node-group-items-wrap ul{
  padding-bottom: 10px;
}
.next-node-group-item-wrap {
  position: relative;
}
.next-node-group-item-wrap::after{
  content: '';
  border-bottom: 1px solid #edf0f5;
  bottom: 5px;
  width: 100%;
  position: absolute;
  left: 0;
}
.node-list-item {
  display: block;
  height: 30px;
  line-height: 30px;
  width: 100%;
}
.node-type {
  font-size: 12px;
  color: #909399;
}
.node-item-com:hover {
  background: #f5f7fa;
  cursor: pointer;
}
.com-name {
  color: #666;
  font-size: 12px;
  text-align: center;
}
.com-icon-wrap {
  position: relative;
}
.com-icon-desc {
  position: absolute;
  top: 50%;
  left: 60px;
  color: #444;
  transform: translateY(-50%);
  border: 1px dashed #dadce1;
  background: #f9f9f9;
  padding: 3px 6px;
  line-height: 22px;
  border-radius: 4px;
  width: 120px;
  word-break: break-all;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
}
.select-outline {
  border: 2px dashed #fff;
  border-radius: 50%;
  padding: 2px;
}
.plumb-node.selected .select-outline {
  border: 2px dashed #558dff;
}

.plumb-node.actived .select-outline {
  border: 2px dashed #e3a96b;
}

</style>
