<template>
  <div class="de-image-mode-content">
    <ComTitle :name="setdata.name" :data="data" :setdata="setdata"/>
    <el-row :gutter="10" class="bg-size-list">
      <el-col v-for="(item, index) in getOptions()" :key="index" :span="8">
        <div :class="{active: item.value===data[setdata.pop]}" class="bg-size-item" @click="onChangeImageMode(item.value)">
          <img v-if="item.img" :src="item.img">
          <i v-if="item.icon" :class="`iconfont ${item.icon}`" />
          <p>{{ item.label }}</p>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script type="text/javascript">
import ComTitle from './comTitle'
export default {
  name: 'DecorateImageMode',
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
      defaultOptions: [
        { img: '/static/decorate/image-mode-100.png', value: '100% 100%', label: '拉伸' },
        { img: '/static/decorate/image-mode-contain.png', value: 'contain', label: '长边适配' },
        { img: '/static/decorate/image-mode-cover.png', value: 'cover', label: '短边适配' }
      ]
    }
  },
  methods: {
    onChangeImageMode(value) {
      this.data[this.setdata.pop] = value
    },
    getOptions() {
      return this.setdata.options && this.setdata.options.length > 0 ? this.setdata.options : this.defaultOptions
    }
  }

}
</script>
<style lang="less" scoped>
  .de-image-mode-content {
    .bg-size-list {
      padding-right: 50px;

      .bg-size-item {
        margin-right: 8px;
        padding: 10px 0;
        border: 1px solid #ddd;
        text-align: center;
        cursor: pointer;

        .iconfont {
          font-size: 40px;
        }

        p {
          margin-top: 5px;
          font-size: 14px;
        }

        &.active {
          color: #fff;
          background-color: #409EFF;
          border-color: #307fd0;
        }
        &:last-child {
          margin-right: 0;
        }
      }
    }
  }
</style>

