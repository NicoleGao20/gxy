<template>
  <div
    :style="{ position: 'absolute', left: nodeItemData.x+'px', top: nodeItemData.y+'px' }"
    class="plumb-node"
  >
    <img :src="nodeItemData.icon" style="display: block;">
    <div class="com-name">{{ nodeItemData.label }}</div>
    <div class="com-icon-tips">
      <p v-if="nodeItemData.targetNum || nodeItemData.targetNum == '0'" class="tip1" @click="showDataAnalysis(nodeItemData)">{{ nodeItemData.targetNum }}人次</p>
      <p v-if="nodeItemData.sendProgress || nodeItemData.sendProgress == '0'" :title="'已触发：' + nodeItemData.receiptRate + '%'" class="hover-tip">发送进度：{{ nodeItemData.sendProgress }}%</p>
    </div>
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
import { sourceEndpoint, targetEndpoint } from '../conf'

export default {
  name: 'NodeItem',
  componentName: 'NodeItem',
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
  inject: ['flowChartMap'],
  data() {
    return {}
  },
  mounted() {
    this.flowChartMap.plumb.addEndpoint(
      this.nodeItemData.id,
      sourceEndpoint,
      {
        anchor: 'BottomCenter',
        enabled: false,
        uuid: this.nodeItemData.id + 'BottomCenter'
      }
    )
    if (!this.nodeItemData.headNode) {
      this.flowChartMap.plumb.addEndpoint(
        this.nodeItemData.id,
        targetEndpoint,
        {
          anchor: 'TopCenter',
          enabled: false,
          uuid: this.nodeItemData.id + 'TopCenter'
        }
      )
    }
  },
  methods: {
    showDataAnalysis(row) {
      this.$emit('setData2', row)
    }
  }
}
</script>

<style lang="less" scoped>
.node-item {
  display: inline-block;
  width: 54px;
  height: 74px;
  position: relative;
}
.action-btn {
  position: absolute;
  background: rgb(0, 91, 255, 0.7);
  border-radius: 50%;
  color: #fff;
  padding: 2px;
  cursor: pointer;
}
.node-edit {
  right: 0;
  top: 0;
}
.node-remove {
  display: block;
  left: -5px;
  top: 30px;
  transform: translateY(-50%);
}
.node-edit:hover {
  background: rgb(0, 91, 255, 0.9);
}
.next-node-tip {
  transform: rotate(-90deg);
  position: absolute;
  right: 0;
  top: 34px;
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
  top: 10px;
  left: 56px;
  transform: translateY(-50%);
  border: 1px dashed #dadce1;
  background: #f9f9f9;
  padding: 3px 6px;
  line-height: 22px;
  border-radius: 4px;
  width: 126px;
  word-break: break-all;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}
.com-icon-tips {
  position: absolute;
  top: 45px;
  left: 56px;
  width: 126px;
  .tip1 {
    border: 1px dashed #dadce1;
    background: #f9f9f9;
    padding: 2px 10px;
    line-height: 16px;
    cursor: pointer;
  }
  .hover-tip {
    border: 1px dashed #dadce1;
    background: #f9f9f9;
    margin-top: 5px;
    padding: 2px 10px;
    line-height: 16px;
    font-size: 13px;
    white-space: nowrap;
    &:hover{
      text-decoration:underline;
    }
  }
}
</style>
