<template>
  <div class="de-opacity-content">
    <ComTitle :name="setdata.name" :data="data" :setdata="setdata"/>
    <div class="de-editor-slider">
      <el-slider v-model="data[setdata.pop]"/>
    </div>
  </div>
</template>
<script type="text/javascript">
import ComTitle from './comTitle'
export default {
  name: 'DecorateSilder',
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
  }

}
</script>
<style lang="less" scoped>
  .de-opacity-content {
    .de-editor-slider {
      padding-right: 10px;
    }
  }
</style>

