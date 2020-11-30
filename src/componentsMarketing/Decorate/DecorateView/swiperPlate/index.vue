<template>
  <div
    :style="{
      'width': list.width + '%',
      'height': list.height + 'px'
    }"
    :class="{'wrap': true, 'dashed': list.children}" >
    <vdr :w="375" :h="list.height" :prevent-deactivation="true" :handles="seletedId == list.id ? ['bm']: []" :min-height="1" :draggable="false" :z="99" class-name-active="view-set-size" @resizing="onResizeSwiper" >
      <NoChild v-if="list.content.length === 0" :data="list" />
      <el-carousel :autoplay="false" :direction="list.direction" :height="`${list.height}px`" :interval="list.interval * 1000" :style="{height:'auto'}" trigger="click" @change="onCarouselChange">
        <el-carousel-item v-for="(child, index) in list.content" :key="child.id">
          <div
            :style="{
              backgroundImage: `url(${child.backgroundImage})`,
              backgroundColor: child.backgroundColor,
              backgroundPosition: `${child.backgroundPosition}`,
              backgroundSize: `${child.backgroundSize}`,
              backgroundRepeat: child.backgroundRepeat
            }"
            class="swiper-item"
            @click="onActivated($event, index)"
          >
            <draggable
              :list="child.children"
              :options="{
                group: { name: 'swiperChildren', put: ['decorateChildren'] },
                disabled: disabled,
                sort: false
              }"
              class="decorate-swiper-content dc-swiper-content"
              @add="onAdd">
              <div class="temporary-element" />
              <vdr
                v-for="(item, key) in child.children"
                :id="item.id"
                :key="item.id"
                :w="item.width"
                :h="item.height"
                :x="item.left ? item.left : 0"
                :y="item.top ? item.top : 0"
                :z="999"
                :snap="true"
                :snap-tolerance="10"
                :active="manyId == child.id && item.id === conId"
                :prevent-deactivation = "true"
                class="dragItem"
                @dragging="onDragging"
                @resizestop="onResize"
                @dragstop="onDragStop"
                @activated="onActivatedChild($event, index, key)">
                <div style="width: 100%; height: 100%;" @click="stopPropagation($event)">
                  <WordText v-if="item.type === 'text'" :item="item" />
                  <Btn v-if="item.type === 'btn'" :item="item" />
                  <Imgcontent v-if="item.type === 'image'" :item="item" />
                </div>
              </vdr>
            </draggable>
          </div>
        </el-carousel-item>
      </el-carousel>
    </vdr>
  </div>
</template>
<script type="text/javascript">
import draggable from 'vuedraggable'
import RefLine from '@/components/RefLine/ref-line.js'
import WordText from '../text'
import Imgcontent from '../image'
import Btn from '../btn'
import { mapState } from 'vuex'
import NoChild from './noChild'
import UUID from 'uuidjs'

export default {
  name: 'SwiperPlate',
  components: {
    draggable,
    WordText,
    Btn,
    NoChild,
    Imgcontent
  },
  props: {
    list: {
      type: Object,
      default() {
        return {
          'icon': 'swiper',
          'type': 'blank',
          'width': 100,
          'height': 200,
          'children': [],
          'dragId': 0,
          'handle': '',
          'childId': ''
        }
      }
    }
  },
  data() {
    return {
      height: 50
    }
  },
  computed: mapState({
    conId: state => state.decorate.conId,
    manyId: state => state.decorate.manyId,
    seletedId: state => state.decorate.seletedId,
    disabled: state => {
      return state.decorate.disabled
    }
  }),
  mounted() {
    this.refLine = new RefLine()
  },
  methods: {
    stopPropagation(e) {
      e.stopPropagation()
    },
    setActivated(index, isContainer) {
      this.dragId = index
      setTimeout(() => {
        this.$store.dispatch('setID', this.list.id)
        this.$store.dispatch('setManyId', this.list.content[index].id)
        if (isContainer) {
          this.$store.dispatch('setContentId', '')
        } else {
          if (this.childId || this.childId === 0) {
            this.$store.dispatch('setContentId', this.list.content[this.dragId].children[this.childId].id)
          }
        }
      }, 50)
    },
    onActivated(e, index) {
      this.setActivated(index, 'container')
    },
    onActivatedChild(e, index, key) {
      this.childId = key
      this.setActivated(index, '')
    },
    onAdd(evt) {
      const list = JSON.parse(JSON.stringify(this.list))
      const data = list.content
      // 获取元素距离屏幕的位置
      const dom = evt.path.find(res => /.*wrap*./.test(res.className)).getBoundingClientRect()
      data.forEach(res => {
        const children = res.children
        for (let index = 0; index < children.length; index++) {
          const item = children[index]
          if (!item.id) {
            children.splice(index, 1)
            item.id = UUID.generate()
            item.top = evt.originalEvent.y - dom.top
            item.left = evt.originalEvent.x - dom.left
            children.push(item)
            return
          }
        }
      })
      this.$store.dispatch('changeValue', list)
    },
    onCarouselChange(index) {
      this.setActivated(index)
    },
    onDragging(left, top) {
      const partentNodeList = this.$el.querySelectorAll('.dragItem')
      const data = this.list.content[this.dragId].children[this.childId]
      this.refLine.check(document.getElementById(data.id), partentNodeList) // '.dragItem'
    },
    onDragStop(left, top) {
      const data = this.list.content[this.dragId].children[this.childId]
      data.left = left
      data.top = top
      this.save()
      this.refLine.uncheck()
    },
    onResize(left, top, width, height) {
      const data = this.list.content[this.dragId].children[this.childId]
      data.left = left
      data.top = top
      data.width = width
      data.height = height
      this.save()
    },
    onResizeSwiper(left, top, width, height) {
      this.list.height = height
    },
    save() {
      this.$store.dispatch('changeValue', this.list)
    }
  }
}
</script>
<style lang="less" scoped>
  .wrap {
    width: 100%;
    width: 100%;
    height: 300px;
    .board-swiper-content {
      position: relative;
      width: 100%;
      height: 100%;
      overflow: hidden;
    }
    .temporary-element {
      width: 100%;
      height: 100%;
    }
    .handle-bm {
      display: none;
    }
    .dashed {
      border: 1px dashed #67b1f0;
    }
    .board {
      width: 100%;
      height: 100%;
      overflow: hidden;
    }
  }
  /deep/ .el-carousel__indicators {
    bottom: 5px;
  }
  /deep/ .el-carousel__button {
    background-color: #fff;
  }
  /deep/ .el-carousel__indicator.is-active button {
    background-color: #000;
  }
  /deep/ .el-carousel--horizontal .el-carousel__button {
    width: 25px;
  }
</style>
<style lang="less">
.view-set-size {
  &>.handle-bm {
    z-index: 100000;
    width: 16px;
    height: 25px;
    bottom: -12px;
    background: url('/static/decorate/drag-footer.png') 0 0 no-repeat;
    background-size: 100%;
  }
}
.dc-view-page {
  .decorate-show-content {
    .swiper-plate-content {
      .draggable-icon {
        width: auto;
        height: auto;
        opacity: 1;
      }
    }
 }
}
.swiper-item, .decorate-swiper-content {
  height: 100%;
}
</style>
