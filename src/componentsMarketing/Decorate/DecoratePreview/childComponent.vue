<template>
  <div style="position: relative">
    <a
      v-if="data.type==='text'"
      :href="data.link || 'javascript:void(0)'"
      :class="data.className"
      :style="{
        display: 'block',
        position: containerType ==='blank' ? 'absolute' : 'inherit',
        left: `${data.left}px`,
        top: `${data.top}px`,
        zIndex: length ? length - index : 'inherit',
        width: `${data.width}px`,
        height: `${data.height}px`,
        paddingTop: `${data.paddingTop}px`,
        backgroundColor: `${data.backgroundColor}`,
        borderRadius: `${data.borderRadius}px`,
        color: `${data.color}`,
        fontSize: `${data.fontSize}px`,
        textAlign: `${data.textAlign}`,
        lineHeight: `${data.lineHeight ? data.lineHeight: 1.15}`
      }"
      rel="noopener noreferrer"
      target="_blank"
    >
      {{ data.content }}
    </a>
    <a
      v-if="data.type==='btn'"
      :href="data.link || 'javascript:void(0)'"
      :class="data.className"
      :style="{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        position: containerType ==='blank' ? 'absolute' : 'inherit',
        left: `${data.left}px`,
        top: `${data.top}px`,
        zIndex: length ? length - index : 'inherit',
        width: `${data.width}px`,
        height: `${data.height}px`,
        paddingTop: `${data.paddingTop}px`,
        backgroundColor: `${data.backgroundColor}`,
        backgroundImage: 'url('+ data.backgroundImage+'})',
        backgroundPosition: `${data.backgroundPosition}`,
        backgroundRepeat: `${data.backgroundRepeat}`,
        backgroundSize: `${data.backgroundSize}`,
        borderRadius: `${data.topLeftborderRadius}px ${data.topRightborderRadius}px ${data.bottomRightborderRadius}px ${data.bottomLeftborderRadius}px`,
        color: `${data.color}`,
        fontSize: `${data.fontSize}px`,
        textAlign: `${data.textAlign}`
      }"
      rel="noopener noreferrer"
      target="_blank"
    >
      {{ data.content }}
    </a>
    <a
      v-if="data.type==='image'"
      :href="data.link || 'javascript:void(0)'"
      :class="data.className"
      :style="{
        display: 'block',
        position: containerType ==='blank' ? 'absolute' : 'inherit',
        left: `${data.left}px`,
        top: `${data.top}px`,
        zIndex: length ? length - index : 'inherit',
        width: `${data.width}px`,
        height: `${data.height}px`,
        paddingTop: `${data.paddingTop}px`,
        backgroundColor: `${data.backgroundColor}`,
        backgroundImage: `url(${data.imageUrl})`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: `${data.imageMode}`,
        borderRadius: `${data.borderRadius}px`,
        color: `${data.color}`,
        fontSize: `${data.fontSize}px`,
        textAlign: `${data.textAlign}`
      }"
      rel="noopener noreferrer"
      target="_blank"
    />

    <div
      v-if="containerType==='imageList'"
      class="image-list"
    >
      <el-row :gutter="10">
        <el-col v-for="(item, index) in listContent.data" :key="index" :span="listContent.mode === 'grid' ? 12 : 24">
          <div :class="listContent.mode === 'grid' ? 'image-grid-item' : 'image-list-item'">
            <img v-if="listContent.displayImage" :src="item.indexPicUrl" alt="" class="card-img">
            <div class="card-content">
              <div v-if="listContent.displayName" class="item-name">{{ item.productName }}</div>
              <div v-if="listContent.displayPrice" class="item-price">{{ item.exchangePoint > 0 ? `${item.exchangePoint}积分` : '' }}{{ item.exchangePoint > 0 && item.exchangeMoney > 0 ? '+' : '' }}{{ item.exchangeMoney > 0 ? `${item.exchangeMoney}元` : '' }}</div>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>

    <div
      v-if="containerType==='imageListScroll'"
      class="image-list"
    >
      <swiper
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
        <swiper-slide v-for="(item, index) in listContent.data" :key="index">
          <div class="h-scroll-item">
            <img v-if="listContent.displayImage" :src="item.indexPicUrl" alt="" class="card-img">
            <div class="card-content">
              <div v-if="listContent.displayName" class="item-name">{{ item.productName }}</div>
              <div v-if="listContent.displayPrice" class="item-price">{{ item.exchangePoint > 0 ? `${item.exchangePoint}积分` : '' }}{{ item.exchangePoint > 0 && item.exchangeMoney > 0 ? '+' : '' }}{{ item.exchangeMoney > 0 ? `${item.exchangeMoney}元` : '' }}</div>
            </div>
          </div>
        </swiper-slide>
        <div slot="pagination" class="swiper-pagination" />
      </swiper>
    </div>

  </div>
</template>
<script>
import 'swiper/dist/css/swiper.min.css'
import { swiper, swiperSlide } from 'vue-awesome-swiper'

export default {
  name: 'ChildComponent',
  components: {
    swiper,
    swiperSlide
  },
  props: {
    containerType: {
      type: String,
      default() {
        return {}
      }
    },
    data: {
      type: Object,
      default() {
        return {}
      }
    },
    listContent: {
      type: Object,
      default() {
        return {}
      }
    },
    length: {
      type: Number,
      default() {
        return 0
      }
    },
    index: {
      type: Number,
      default() {
        return 0
      }
    },
    isLastComponent: {
      type: Boolean,
      default() {
        return false
      }
    }
  },
  methods: {
    getWidth(width) {
      return width / 375 * 100
    }
  }
}
</script>
<style lang="less">

// 图文列表
.image-list {
  min-height: 200px;
  padding: 10px;
  overflow-x: hidden;
  overflow-y: auto;

  .text-ellipsis {
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }

  .card-content {
    padding: 5px 8px;
    line-height: 1.5;
  }

  .item-name {
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    overflow : hidden;
    text-overflow: ellipsis;
  }
  .item-price {
    padding: 10px 0;
    color: #e6a23c;
  }

  .image-grid-item {
    margin-bottom: 10px;
    box-shadow: 0 0 2px rgba(0,0,0, .08);
  }

  .image-list-item {
    display: flex;
    width: 100%;
    padding: 10px;
    .card-img {
      width: 120px;
    }
    .item-name {
      -webkit-line-clamp: 2;
    }
    .card-content {
      padding: 10px;
    }
  }

  .h-scroll {
    padding: 5px 0 20px 2px;

    .swiper-pagination {
      bottom: 0;
    }
  }
  .h-scroll-item {
    width: 170px;
    box-shadow: 0 0 2px rgba(0,0,0, .08);
  }
}

</style>
