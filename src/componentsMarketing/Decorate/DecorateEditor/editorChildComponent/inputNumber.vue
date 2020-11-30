<template>
  <div>
    <ComTitle :name="setdata.name" :data="data" :setdata="setdata"/>
    <div class="dc-editor-input-number">
      <el-input-number v-model="data[setdata.pop]" controls-position="right" @change="handleChange"/>
    </div>
  </div>
</template>
<script type="text/javascript">
import ComTitle from './comTitle'
export default {
  name: 'DecorateInputNumber',
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
  methods: {
    handleChange(d) {
      // console.log(d)
    }
  }

}
</script>
<style lang="less">
  .dc-editor-input-number {
    .el-input-number {
      width: 100%;
    }
    .el-input__inner {
      border-radius: 0;
      text-align: left;
    }
  }
</style>
