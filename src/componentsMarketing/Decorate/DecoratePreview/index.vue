<template>
  <div :class="$route.query.isFrame ? 'frameContainer' : 'pageContainer'">
    <div id="decoratePreview" :style="{zoom: $route.query.zoom}" class="decorate-preview">

      <div class="pullup">
        <div ref="scroller" class="pullup-bswrapper">
          <div class="pullup-scroller">

            <div v-for="(listItem, listIndex) in list" :key="listIndex">

              <!-- 轮播容器 -->
              <swiper
                v-if="listItem.type==='swiper'"
                :options="{
                  loop: true,
                  direction: `${listItem.direction}`,
                  autoplay: listItem.interval*1000,
                  pagination: {
                    el: '.swiper-pagination',
                    clickable: true,
                  }
                }"
                :style="{ height: `${listItem.height}px` }"
                class="swiper-component"
              >
                <!-- slides -->
                <swiper-slide v-for="(contentItem, contentIndex) in listItem.content" :key="contentIndex">
                  <div
                    :style="{
                      height: `${listItem.height}px`,
                      backgroundImage: `url(${contentItem.backgroundImage})`,
                      backgroundColor: contentItem.backgroundColor,
                      backgroundPosition: `${contentItem.backgroundPosition}`,
                      backgroundSize: `${contentItem.backgroundSize}`,
                      backgroundRepeat: contentItem.backgroundRepeat
                    }"
                  >
                    <ChildComponent v-for="(child, childIndex) in contentItem.children" :container-type="listItem.type" :data="child" :key="childIndex" />
                  </div>
                  {{ contentItem.scriptData && renderScript(contentItem.scriptData) }}
                </swiper-slide>
                <!-- Optional controls -->
                <div slot="pagination" class="swiper-pagination" />
              </swiper>

              <!-- 空白容器 -->
              <section
                v-if="listItem.type==='blank'"
                :data="dellistItem(listItem.content[0])"
                :class="listItem.content[0].className"
                :style="{
                  position: 'relative',
                  height: `${listItem.content[0].height}px`,
                  backgroundImage: `url(${listItem.content[0].backgroundImage})`,
                  backgroundColor: listItem.content[0].backgroundColor,
                  backgroundPosition: `${listItem.content[0].backgroundPosition}`,
                  backgroundSize: `${listItem.content[0].backgroundSize}`,
                  backgroundRepeat: listItem.content[0].backgroundRepeat ? listItem.content[0].backgroundRepeat :'no-repeat',
                  overflowX: listItem.content[0].istransverse ? 'auto' : 'hidden',
                  overflowY: 'hidden'
                }"
              >
                <ChildComponent v-for="(child, childIndex) in listItem.content[0].children" :container-type="listItem.type" :data="child" :length="listItem.content[0].children.length" :key="childIndex" :index="childIndex" />
                {{ listItem.content[0].scriptData && renderScript(listItem.content[0].scriptData) }}
              </section>

              <!-- 分栏容器 -->
              <section
                v-if="listItem.type==='columns'"
                style="display: flex;"
              >
                <div
                  v-for="(contentItem, contentIndex) in listItem.content"
                  :key="contentIndex"
                  :style="{
                    width: `${contentItem.width / 375 * 100}%`,
                    backgroundColor: contentItem.backgroundColor
                  }"
                >
                  <ChildComponent v-for="(child, childIndex) in contentItem.children" :container-type="listItem.type" :data="child" :key="childIndex" />
                  {{ contentItem.scriptData && renderScript(contentItem.scriptData) }}
                </div>
              </section>

              <!-- 图文列表:普通 -->
              <section
                v-if="listItem.type==='imageList' && listItem.content[0].mode!=='h-scroll'"
              >
                <ChildComponent v-for="(contentItem, contentIndex) in getImageListData(listIndex, listItem.content)" :data="contentItem" :list-content="listItem.content[0]" :is-last-component="list.length === listIndex + 1" :key="contentIndex" container-type="imageList" />
              </section>

              <!-- 图文列表:横向滚动 -->
              <section
                v-if="listItem.type==='imageList' && listItem.content[0].mode==='h-scroll'"
              >
                <ChildComponent v-for="(contentItem, contentIndex) in listItem.content" :data="contentItem" :list-content="listItem.content[0]" :key="contentIndex" container-type="imageListScroll" />
              </section>

            </div>

            <div v-if="showBScroll" class="pullup-wrapper">
              <div v-if="!isPullUpLoad" class="before-trigger">
                <span class="pullup-txt">上拉加载更多</span>
              </div>
              <div v-else class="after-trigger">
                <span class="pullup-txt">加载中...</span>
              </div>
            </div>

          </div>
        </div>

      </div>

    </div>
  </div>
</template>

<script>
import 'swiper/dist/css/swiper.min.css'
import { swiper, swiperSlide } from 'vue-awesome-swiper'
import BScroll from '@better-scroll/core'
import Pullup from '@better-scroll/pull-up'

import ChildComponent from './childComponent'
import { getDecorateDetail } from '@/api/decorate'

BScroll.use(Pullup)

export default {
  name: 'DecoratePreview',
  components: {
    swiper,
    swiperSlide,
    ChildComponent
  },
  data() {
    return {
      list: [],
      startX: 0,
      startY: 0,
      imageList: 20,
      bscroll: null,
      showBScroll: false,
      lastImageListData: [],
      isPullUpLoad: false
    }
  },
  watch: {
    listItem(vale, olc) {
      console.log(vale, 999)
    }
  },
  created() {
    this.getData()
  },
  mounted() {
    this.appendScript()
    this.setViewport()
  },
  methods: {
    getData() {
      const id = this.$route.params.id
      getDecorateDetail(id).then(response => {
        const { data } = response
        console.log('data', data)
        const list = JSON.parse(data.compileContent)
        // console.log('list', list)
        this.list = list
        document.title = data.name

        const lastComponent = list[list.length - 1]
        if (lastComponent && lastComponent.type === 'imageList' && lastComponent.content[0].mode !== 'h-scroll') {
          this.lastImageListData = list[list.length - 1].content
          this.showBScroll = true
          this.initBscroll()
        }
      })
    },
    getImageListData(index, contentData) {
      return this.list.length === index + 1 ? this.lastImageListData : contentData
    },
    setViewport() {
      const viewport = document.querySelector('meta[name=viewport]')
      viewport.setAttribute('content', 'width=375')
    },
    appendScript(scriptData) {
      const headScript = document.createElement('script')
      headScript.src = '/static/js/zepto.min.js'
      document.head.appendChild(headScript)
    },
    renderScript(scriptData) {
      const newScript = document.createElement('script')
      newScript.innerHTML = scriptData
      document.body.appendChild(newScript)
    },
    dellistItem(data) {
      const listItemData = JSON.parse(JSON.stringify(data))
      listItemData.children = ''
      listItemData.scriptData = ''
      return JSON.stringify(listItemData)
    },
    initBscroll() {
      this.bscroll = new BScroll(this.$refs.scroller, {
        scrollY: true,
        pullUpLoad: true
      })
      this.bscroll.on('scrollEnd', this.pullingUpHandler)
    },
    async pullingUpHandler() {
      this.isPullUpLoad = true
      await this.requestData()
      this.bscroll.finishPullUp()
      this.bscroll.refresh()
      this.isPullUpLoad = false
    },
    async requestData() {
      try {
        this.lastImageListData = [
          ...this.lastImageListData,
          ...this.lastImageListData
        ]
      } catch (err) {
        // handle err
        console.log(err)
      }
    }
  }
}
</script>
<style lang="less">
html {
  min-width: 0;
}
a {
  -webkit-tap-highlight-color:rgba(255,0,0,0);
}
.frameContainer {
}
.pageContainer {
  // height: 100vh;
  // overflow-y: auto;
  // -webkit-overflow-scrolling: touch;
}
.decorate-preview {
  background: #f4f4f4;
  width: 375px;
}

// 轮播组件
.swiper-component.swiper-container-horizontal .swiper-pagination-bullet {
  width: 20px;
  height: 2px;
  border-radius: 0;
}
.swiper-component.swiper-container-vertical .swiper-pagination-bullet {
  width: 2px;
  height: 20px;
  border-radius: 0;
}

.pullup {
  height: 100%;
}
.pullup-bswrapper {
  height: 100%;
  overflow-x: hidden;
  overflow-y: auto;
}
.pullup-list {
  padding: 0;
}
.pullup-list-item {
  padding: 10px 0;
  list-style: none;
  border-bottom: 1px solid #ccc;
}
.pullup-wrapper {
  padding: 20px;
  text-align: center;
  color: #999;
}

// 滚动条
::-webkit-scrollbar {
  width: 0;
  height: 0;
  background-color: transparent;
}
::-webkit-scrollbar-thumb {
  border-radius: 10px;
  background-color:rgba(0,0,0, .3);
}
::-webkit-scrollbar-track {
  border-radius: 10px;
  background-color: transparent;
}
</style>
