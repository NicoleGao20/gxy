<template>
  <div>
    <nodeItemData
      v-for="nodeItemData in flowData.nodeItems"
      :key="nodeItemData.id"
      :node-item-data="nodeItemData"
      :id="nodeItemData.id"
      class="node-item"
      @setData2="setIpdata"/>
  </div>
</template>
<script>
import nodeItemData from './nodeItemData'

export default {
  name: 'FlowArea',
  componentName: 'FlowArea',
  components: {
    nodeItemData
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
  methods: {
    setIpdata(val) {
      this.$emit('setUpUpData', val)
    }
  }
}
</script>
