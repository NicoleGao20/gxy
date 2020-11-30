<template>
  <div class="interactive-component">
    <ComTitle :name="setdata.name" :data="data" :setdata="setdata"/>
    <el-input
      :rows="2"
      v-model="data[setdata.pop]"
      type="textarea"
      placeholder="请输入内容"
      controls-position="right"
      @change="handleChange" />
  </div>
</template>
<script>
import ComTitle from './comTitle'
export default {
  name: 'InteractiveComponent',
  components: {
    ComTitle
  },
  props: {
    setdata: {
      type: Object,
      default() {
        return {}
      }
    },
    data: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {}
  },
  methods: {
    handleChange(data) {
      const dom = document.createElement('script')
      dom.type = 'text/javascript'
      dom.innerHTML = data
      document.body.append(dom)
    }
  }
}
</script>
<style lang="less" scpoed>
</style>
