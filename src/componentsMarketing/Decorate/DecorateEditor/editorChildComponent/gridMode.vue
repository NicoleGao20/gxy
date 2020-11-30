<template>
  <div class="de-grid-content">
    <ComTitle :name="setdata.name" :data="data" :setdata="setdata"/>
    <div class="bg-grid-list">
      <div
        v-for="(item, index) in setdata.options"
        :key="index"
        :class="{active: item.value=== data[setdata.pop]}"
        :title="item.label"
        :style="{ flex: `0 0 ${100/(setdata.colNum || 3) - 2}%` }"
        class="bg-grid-item"
        @click="onChangeMode(item.value)"
      />
    </div>
  </div>
</template>
<script type="text/javascript">
import ComTitle from './comTitle'
export default {
  name: 'DecorateGridMode',
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
    return {
    }
  },
  methods: {
    onChangeMode(value) {
      this.data[this.setdata.pop] = value
    }
  }

}
</script>
<style lang="less" scoped>
  .de-grid-content {
    .bg-grid-list {
      display: flex;
      flex-wrap: wrap;
      width: 150px;

      .bg-grid-item {
        width: 30px;
        height: 35px;
        margin: 0 2% 2% 0;
        border: 1px solid #d3edff;
        border-radius: 6px;
        background-color: #d3edff;
        cursor: pointer;

        &:hover {
          border-color: #307fd0;
        }
        &.active {
          background-color: #409EFF;
          border-color: #307fd0;
        }
      }
    }
  }
</style>

