<template>
  <div class="dec-view-content">
    <div
      v-if="list.content"
      :style="{
        'position': 'relative',
        'width': '100%',
        'height': list.content[0].height + 'px',
        'backgroundColor':list.content[0].backgroundColor,
        'backgroundImage':`url(${list.content[0].backgroundImage})`,
        'backgroundPosition': `${list.content[0].backgroundPosition}`,
        'backgroundRepeat': `${list.content[0].backgroundRepeat}`,
        'backgroundSize': `${list.content[0].backgroundSize}`
      }"
      :class="{'wrap': true, 'dashed': true,[list.content[0].elementName]:true} "
      @click="onhadle()"
    >
      <div class="handle" @click="onhadle()"/>
      <vdr
        :w="375"
        :h="list.content[0].height"
        :prevent-deactivation="true"
        :enable-native-drag="true"
        :handles="handles"
        :min-height="1"
        :draggable="false"
        :z="99"
        :active ="true"
        class-name-active="view-set-size"
        @resizing="onResizeBlank" >
        <section
          :style="{
            'overflow-x':list.content[0].istransverse ? 'auto' : 'hidden'
          }"
          class="blankPlate">
          <draggable
            v-model="list.content[0].children"
            v-bind="{
              group:{ name:'decorate', put: ['decorateChildren']},
              sort:true,
              disabled:disabled,
              style:{
                display: 'none',
                height: '100%',
                width:list.content[0].istransverse ? list.content[0].width + 'px' : '375px'
              }
            }"
            :style="{
              position: 'relative',
              width:list.content[0].istransverse ? list.content[0].width + 'px' : '375px'
            }"
            class="board-column-content blank-plate-content"
            @add="onadd"
          >
            <vdr
              v-for="(element, index) in list.content[0].children"
              :id="element.id"
              :key="element.id"
              :x="element.left ? element.left : 0"
              :y="element.top ? element.top : 0"
              :w="element.width"
              :h="element.height"
              :z="list.content[0].children.length - index"
              :active ="childrenId === element.id"
              :snap="true"
              :snap-tolerance="10"
              :prevent-deactivation ="true"
              :enable-native-drag="true"
              class="dragItem"
              @resizestop="onResize"
              @dragging="(left, top)=>onDragging(left, top)"
              @dragstop="(left, top)=>onDragStop( left, top)"
              @activated="onActivated($event,element.id,list.id)">
              <div
                :class="{ 'board': true, 'selected-style':true}"
                @click="stopPropagation($event)">
                <div class="line" />
                <WordText v-if="element.type === 'text'" :item="element" />
                <Btn v-if="element.type === 'btn'" :item="element" />
                <Imgcontent v-if="element.type === 'image'" :item="element" />
            </div></vdr>
          </draggable>
        </section>
      </vdr >
    </div>
  </div>
</template>
<script>
import draggable from 'vuedraggable'
import WordText from './text'
import Imgcontent from './image'
import Btn from './btn'
import RefLine from '@/components/RefLine/ref-line.js'
import UUID from 'uuidjs'
import { mapState } from 'vuex'
import Bdraggable from '@/components/Decorate/Bdraggable'
export default {
  name: 'DecorateComponentView',
  components: {
    draggable,
    WordText,
    Btn,
    Imgcontent,
    Bdraggable
  },
  data() {
    return {
      enable: false,
      pos: {
        top: 0,
        left: 0
      },
      id: '',
      handles: ['bm']
    }
  },
  computed: {
    ...mapState({
      list: state => state.decorateComponents.viewList,
      childrenId: state => state.decorateComponents.childrenId,
      disabled: state => state.decorateComponents.disabled
    })
  },
  async mounted() {
    // setInterval(() => {
    //   this.enable = !this.enable
    //   console.log('start')
    // }, 5000)
    this.refLine = new RefLine()
  },
  methods: {
    onadd(evt) {
      console.log(9999)
      // 检查是否有相同id
      const checkId = (id, arr) => {
        if (arr.find(res => res.id === id)) {
          return true
        } else {
          return false
        }
      }
      const allData = JSON.parse(JSON.stringify(this.list))
      this.newList = allData.content
      if (!this.newList[0].id) {
        this.newList[0].id = UUID.generate()
      }
      const dom = evt.path.find(res => /.*wrap*./.test(res.className)).getBoundingClientRect()
      for (let index = 0; index < this.newList[0].children.length; index++) {
        const element = this.newList[0].children[index]
        if (!element.id) {
          const newElement = JSON.parse(JSON.stringify(element))
          this.newList[0].children.splice(index, 1)
          newElement.id = UUID.generate()
          if (checkId(newElement.id, this.newList[0].children)) {
            newElement.id = UUID.generate()
          }
          newElement.top = evt.originalEvent.y - dom.top
          newElement.left = evt.originalEvent.x - dom.left
          this.newList[0].children.unshift(newElement)
          this.list.content = this.newList
          return
        }
      }
    },
    onhadle() {
      this.$store.dispatch('decorateComponentsId', '')
    },
    onDragging() {
      const partentNodeList = this.$el.querySelectorAll('.dragItem')
      this.refLine.check(document.getElementById(this.id), partentNodeList) // '.dragItem'
    },
    onDragStop(left, top) {
      const result = this.list.content[0].children.find(res => res.id === this.id)
      result.left = left
      result.top = top
      this.save()
      this.refLine.uncheck()
    },
    onResize(left, top, width, height) {
      const result = this.list.content[0].children.find(res => res.id === this.id)
      result.left = left
      result.top = top
      result.width = width
      result.height = height
      this.save()
    },
    onActivated(e, id, listId) {
      this.id = id
      this.$store.dispatch('decorateComponentsId', id)
    },
    onResizeBlank(left, top, width, height) {
      this.list.content[0].height = height
    },
    save(data) {
      if (data) {
        this.$store.dispatch('decorateComponentsSave', data)
      } else {
        this.$store.dispatch('decorateComponentsSave', this.list)
      }
    },
    stopPropagation(e) {
      e.stopPropagation()
      const dome = document.getElementsByClassName('resizer-zoom')
      for (let index = 0; index < dome.length; index++) {
        const element = dome[index]
        element.style.display = 'none'
      }
    }
  }
}
</script>
<style lang="less" scoped>
  .dec-view-content {
      box-sizing: border-box;
      position: relative;
      width: 375px;
      height: 100%;
      overflow:auto;
      max-height: 667px;
      background: #f4f4f4;
      -webkit-user-select: none;
      -moz-user-select: none;
      -ms-user-select: none;
      user-select: none;
      -webkit-box-shadow: 0 0 5px 2px #ddd;
      box-shadow: 0 0 5px 2px #ddd;
      &::-webkit-scrollbar {
        position: absolute;
        right: 0;
        top:0;
        width: 0px;
        height: 5px;
        background-color: #F5F5F5;
      }
      &::-webkit-scrollbar-thumb {
        border-radius: 10px;
        -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,.3);
        background-color:rgba(0,0,0,.1);
      }
      &::-webkit-scrollbar-track {
        border-radius: 10px;
        background-color: transparent;
      }
      .replace-draggable {
        position: absolute;
        top: 0;
        left: 0;
      }
        .wrap {
          box-sizing: border-box;
          position:relative;
          width:100%;
          border: 1px solid #40aceb;
          .handle {
            display: none;
            position: absolute;
            top: 0;
            left: 50%;
            width: 30px;
            height: 20px;
            z-index: 9999999;
            background: #ddd url('/static/decorate/drag-header.png') 0 0 no-repeat;
            transform: translateX(-50%);
            z-index: 100;
            cursor: pointer;
            background-size: 100%;
          }
          &:hover {
            .handle {
              display:block;
            }
          }
          .blankPlate {
            width: 100%;
            height: 100%;
            overflow-x: auto;
            overflow-y: hidden;
            &::-webkit-scrollbar {
              position: absolute;
              right: 0;
              top:0;
              width: 0px;
              height: 5px;
              background-color: #F5F5F5;
            }
            &::-webkit-scrollbar-thumb {
              border-radius: 10px;
              -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,.3);
              background-color:rgba(0,0,0,.1);
            }
            &::-webkit-scrollbar-track {
              border-radius: 10px;
              background-color: transparent;
            }
          }
          .board-column-content {
            position: relative;
            width: 100%;
            height: 100%;
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
  }
</style>
<style lang="less">
.view-set-size {
  z-index: 10000;
  &>.handle-bm {
    z-index: 1;
    width: 16px;
    height: 25px;
    bottom: -12px;
    background: url('/static/decorate/drag-footer.png') 0 0 no-repeat;
    background-size: 100%;
  }
}
.dc-view-page {
  .decorate-show-content {
    .blank-plate-content {
      .draggable-icon {
        width: auto;
        height: auto;
        opacity: 0;
      }
    }
 }
}
</style>

