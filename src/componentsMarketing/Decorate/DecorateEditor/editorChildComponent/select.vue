<template>
  <div>
    <ComTitle :name="setdata.name" :data="data" :setdata="setdata"/>
    <div class="dc-editor-select">
      <el-select v-model="data[setdata.pop]" :placeholder="'请选择'">
        <el-option
          v-for="item in setdata.options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
    </div>
  </div>
</template>
<script type="text/javascript">
import ComTitle from './comTitle'
export default {
  name: 'DecorateSelect',
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
<style lang="less">
  .dc-editor-select {
    .el-select {
      display: block;
    }
    .el-input__inner {
      border-radius: 0;
    }
  }
</style>
