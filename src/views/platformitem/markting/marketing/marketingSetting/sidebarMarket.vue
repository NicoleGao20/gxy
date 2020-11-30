<template>
  <el-scrollbar ref="sidebarScrollbar" style="width: 100%;height: 100%;">
   <div class="market-sidebar">
    <el-collapse v-model="activeCollapseItems">
      <el-collapse-item v-for="(sideMarketMenuItem, index) in sideMarketMenus" :key="index" :name="sideMarketMenuItem.type">
        <template slot="title">
          {{ sideMarketMenuItem.label }}
        </template>
        <div class="side-coms-wrap clearfix">
          <div v-for="(com, index) in sideMarketMenuItem.children" :key="index" class="side-com-item-wrap">
            <div class="com-icon">
              <span v-if="activeNextNode(sideMarketMenuItem.type, com)" class="active-node el-icon-rank"/>
              <img :src="com.icon||componentIconMap[com.name]" :com-name="com.name" :com-type="sideMarketMenuItem.type" class="com-icon-item">
            </div>
            <div class="com-label">
              {{ com.label }}
            </div>
          </div>
        </div>
      </el-collapse-item>
    </el-collapse>
    </div>
  </el-scrollbar>
</template>
<script>
import { componentIconMap } from './conf'
export default {
  name: 'SidebarMaket',
  inject: ['flowChartMap'],
  props: {
    sideMarketMenus: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      componentIconMap: componentIconMap,
      activeCollapseItems: ['peopleSetting', 'conditionDetermine', 'marketAction', 'guideControl']
    }
  },
  methods: {
    activeNextNode(type, com) {
      if (!this.flowChartMap.mapNodeTypeChildren[type]) {
        return false
      }
      var nextNodes = this.flowChartMap.mapNodeTypeChildren[type]
      for (var i = 0; i < nextNodes.length; i++) {
        if (nextNodes[i].name === com.name) {
          return true
        }
      }
      return false
    }
  }
}
</script>

<style scope>
.market-sidebar .el-collapse-item__header{
  background: #edf0f5;
  padding-left: 18px;
}
.el-collapse-item__content {
  padding-bottom: 0;
}
.side-com-item-wrap {
  width: 50%;
  height: 116px;
  padding: 20px 0;
  float: left;
  text-align: center;
  user-select: none;
}
.com-label {
  color: #666;
}
.com-icon {
  width: 48px;
  height: 48px;
  margin: 0 auto 5px;
  position: relative;
}
.com-icon-item {
  cursor: move;
  position: relative;
}
.active-node {
  position: absolute;
  right: -5px;
  top: -5px;
  color: #558dff;
  border: 1px solid #558dff;
  border-radius: 50%;
}
</style>
