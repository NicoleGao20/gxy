<template>
  <div class="decrate-text-align">
    <ComTitle :name="setdata.name" :data="data" :setdata="setdata"/>
    <el-radio v-for="(item, index) in setdata.option" :key="index" v-model="data[setdata.pop]" :label="item.value"> {{ item.name }}</el-radio>
  </div>
</template>
<script>
import ComTitle from './comTitle'
export default {
  name: 'DecorateRadio',
  components: {
    ComTitle
  },
  props: {
    setdata: { // 设置的配置项数据
      type: Object,
      default() {
        return {}
      }
    },
    data: { // 需要改变的数据
      type: Object,
      default() {
        return {}
      }
    }
  }
}
</script>
<style>

</style>

