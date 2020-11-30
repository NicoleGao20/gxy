<template>
  <div>
    <ComTitle :name="setdata.name" :data="data" :setdata="setdata"/>
    <div class="dc-editor-color">
      <el-input v-model="data[setdata.pop]" :placeholder="'请输入颜色值'"/>
      <el-color-picker v-model="data[setdata.pop]"/>
    </div>
  </div>
</template>
<script type="text/javascript">
import ComTitle from './comTitle'
export default {
  name: 'DecorateColor',
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
  mounted() {
    // console.log(this.setdata, this.data, this.data[this.setdata.pop], 'color')
  }
}
</script>
<style lang="less" scoped>
  .dc-editor-color {
    display: flex;
    justify-content: space-between;
    &>input {
      height: 40px;
    }
  }
</style>
<style lang="less">
  .dc-editor-color {
    .el-input__inner {
      border-radius: 0;
    }
    .el-color-picker__trigger {
      border-left: none;
      border-radius: 0;
    }
  }
</style>

