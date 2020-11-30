<template>
  <div>
    <ComTitle :name="setdata.name" :data="data" :setdata="setdata"/>
    <div class="dc-editor-color">
      <el-switch
        v-model="data[setdata.pop]"
        active-color="#13ce66"
        inactive-color="#dddddd"/>
    </div>
  </div>
</template>
<script type="text/javascript">
import ComTitle from './comTitle'
export default {
  name: 'DecorateSwitch',
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

