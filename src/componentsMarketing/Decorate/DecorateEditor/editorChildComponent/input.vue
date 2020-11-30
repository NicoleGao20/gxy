<template>
  <div>
    <ComTitle :name="setdata.name" :data="data" :setdata="setdata"/>
    <div class="dc-editor-input">
      <el-input v-model="data[setdata.pop]" :placeholder="''"/>
    </div>
  </div>
</template>
<script type="text/javascript">
import ComTitle from './comTitle'
export default {
  name: 'DecorateInput',
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
    onInput() {
      this.$store.dispatch('updateChildComponent', this.data)
    }
  }

}
</script>
<style lang="less">
  .dc-editor-input {
    .el-input__inner {
      border-radius: 0;
    }
  }
</style>
