<template>
  <div
    class="image-list"
  >
    <img v-if="!list.content[0] || !list.content[0].data" src="/static/decorate/imageList.png">
    <swiper
      v-if="list.content[0].mode === 'h-scroll'"
      :options="{
        slidesPerView: 2,
        spaceBetween: 10,
        slidesPerGroup: 2,
        loopFillGroupWithBlank: true,
        pagination: {
          el: '.swiper-pagination',
          clickable: true,
        }
      }"
      class="h-scroll"
    >
      <swiper-slide v-for="(item, index) in list.content[0].data" :key="index">
        <ListItem :content="list.content[0]" :item="item" :class-name="`h-scroll-item ${getDataTypeClass(list.content[0].dataType)}`" />
      </swiper-slide>
      <div slot="pagination" class="swiper-pagination" />
    </swiper>
    <div v-else>
      <el-row :gutter="10">
        <el-col v-for="(item, index) in list.content[0].data" :key="index" :span="list.content[0].mode === 'grid' ? 12 : 24">
          <ListItem :content="list.content[0]" :item="item" :data-type="list.content[0].dataType" :class-name="`${list.content[0].mode === 'grid' ? `grid-item` : 'list-item'} ${getDataTypeClass(list.content[0].dataType)}`" />
        </el-col>
      </el-row>
      <div /><!-- 加载更多 -->
    </div>
  </div>
</template>
<script type="text/javascript">
import 'swiper/dist/css/swiper.min.css'
import { swiper, swiperSlide } from 'vue-awesome-swiper'
import ListItem from './item'

export default {
  name: 'DCImageListComponent',
  components: {
    swiper,
    swiperSlide,
    ListItem
  },
  props: {
    list: {
      type: Object,
      default() {
        return {
          'icon': 'imageList',
          'type': 'imageList',
          'height': 200,
          'content': []
        }
      }
    }
  },
  data() {
    return {
      url: '2'
    }
  },
  methods: {
    getDataTypeClass(type) {
      const dataTypeClasses = ['points-mall', 'pre-sale', 'benefits', 'activity']
      return dataTypeClasses[parseInt(type - 1)]
    }
  }
}
</script>
<style lang="less" scoped>
.image-list {
  min-height: 200px;
  padding: 10px;
  overflow-x: hidden;
  overflow-y: auto;
  background-color: #fff;

  .h-scroll {
    padding: 5px 0 20px 2px;
  }
  .swiper-pagination {
    bottom: 0;
  }

}

</style>
