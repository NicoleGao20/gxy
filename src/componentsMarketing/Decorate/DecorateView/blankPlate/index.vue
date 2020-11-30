<template>
  <div
    :style="{
      'width': '100%',
      'height': list.content[0].height + 'px',
      'backgroundColor':list.content[0].backgroundColor,
      'backgroundImage':`url(${list.content[0].backgroundImage})`,
      'backgroundPosition': `${list.content[0].backgroundPosition}`,
      'backgroundRepeat': `${list.content[0].backgroundRepeat}`,
      'backgroundSize': `${list.content[0].backgroundSize}`
    }"
    :class="{'wrap': true, 'dashed': list.content[0].children}"
  >
    <vdr
      :w="375"
      :h="list.content[0].height"
      :handles="seletedId == list.id && !list.content[0].noChangeHeight ? handles: []"
      :min-height="1"
      :draggable="false"
      :prevent-deactivation="true"
      :enable-native-drag="true"
      :z="99"
      class-name-active="view-set-size"
      @resizing="onResizeBlank" >
      <section
        :style="{
          'overflow-x':list.content[0].istransverse ? 'auto' : 'hidden'
        }"
        class="blankPlate">
        <draggable
          :list="list.content[0].children"
          :options=" {
            group: { name: 'decorateChildren', put: ['decorateChildren'] },
            disabled: disabled,
            sort: true
          }"
          :style="{
            width:list.content[0].istransverse ? list.content[0].width + 'px' : '375px'
          }"
          class="board-column-content blank-plate-content"
          @add="onadd">
          <NoChild v-if="list.content[0].children.length === 0" />
          <div class="temporary-element" />
          <vdr
            v-for="(element, index) in list.content[0].children"
            :id="element.id"
            :key="element.id"
            :x="element.left ? element.left : 0"
            :y="element.top ? element.top : 0"
            :w="element.width"
            :h="element.height"
            :z="list.content[0].children.length - index"
            :active =" seletedId == list.id && element.id === conId && !element.ismove"
            :prevent-deactivation ="!element.ismove"
            :draggable="!element.ismove"
            :resizable="!element.ismove"
            :snap="true"
            :snap-tolerance="10"
            :enable-native-drag="true"
            :disable-user-select="false"
            class="dragItem"
            @resizestop="onResize"
            @dragging="(left, top)=>onDragging(left, top)"
            @dragstop="(left, top)=>onDragStop( left, top)"
            @activated="onActivated($event,element.id,list.id,element.ismove)"
            @deactivated="onDeactivated">
            <div
              :id="element.id"
              :class="{ 'board': true, 'selected-style': element.id == seletedId}"
              @click="stopPropagation($event)">
              <div class="line" />
              <WordText v-if="element.type === 'text'" :item="element" />
              <Btn v-if="element.type === 'btn'" :item="element" />
              <Imgcontent v-if="element.type === 'image'" :item="element" />
            </div>
          </vdr>
        </draggable>
      </section>
    </vdr >
  </div>
</template>
<script type="text/javascript">
import draggable from 'vuedraggable'
import WordText from '../text'
import Imgcontent from '../image'
import Btn from '../btn'
import RefLine from '@/components/RefLine/ref-line.js'
import { mapState } from 'vuex'
import NoChild from './noChild'
import UUID from 'uuidjs'
export default {
  name: 'BlankPlate',
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
          'icon': 'nested',
          'type': 'blank',
          'width': 100,
          'height': 200,
          'content': []
        }
      }
    }
  },
  data() {
    return {
      pos: {
        top: 0,
        left: 0
      },
      id: '',
      handles: ['bm']
    }
  },
  computed: mapState({
    seletedId: state => {
      return state.decorate.seletedId
    },
    conId: state => {
      return state.decorate.conId
    },
    allList: state => {
      return state.decorate.list
    },
    disabled: state => {
      return state.decorate.disabled
    }
  }),
  mounted() {
    this.refLine = new RefLine()
  },
  methods: {
    onadd(evt) {
      // 检查是否有相同id
      const checkId = (id, arr) => {
        if (arr.find(res => res.id === id)) {
          return true
        } else {
          return false
        }
      }
      const dom = evt.path.find(res => /.*wrap*./.test(res.className)).getBoundingClientRect()
      const allData = JSON.parse(JSON.stringify(this.list))
      this.newList = allData.content
      if (!this.newList[0].id) {
        this.newList[0].id = UUID.generate()
      }
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
          this.save(allData)
          return
        }
      }
    },
    onDragging(left, top) {
      const partentNodeList = this.$el.querySelectorAll('.dragItem')
      this.refLine.check(document.getElementById(this.id), partentNodeList) // '.dragItem'
    },
    onDragStop(left, top) {
      this.refLine.uncheck()
      const allData = this.list
      const result = allData.content[0].children.find(res => res.id === this.id)
      result.left = left
      result.top = top
      this.save(allData)
    },
    onResize(left, top, width, height) {
      const allData = this.list
      const result = allData.content[0].children.find(res => res.id === this.id)
      result.left = left
      result.top = top
      result.width = width
      result.height = height
      this.save(allData)
    },
    onActivated(e, id, listId, ismove) {
      if (!ismove) {
        this.id = id
        this.$store.dispatch('setManyId', this.list.content[0].id)
        this.$store.dispatch('setID', listId)
        this.$store.dispatch('setContentId', id)
        this.$store.dispatch('findDataIndex')
      } else {
        const dom = document.getElementById(id)
        dom.style.border = 'none'
        dom.style.background = 'rgba(220,38,38,0)'
      }
    },
    onDeactivated() {
    },
    onResizeBlank(left, top, width, height) {
      this.list.content[0].height = height
    },
    save(data) {
      this.$store.dispatch('changeValue', data)
    },
    stopPropagation(e) {
      e.stopPropagation()
      e.preventDefault()
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
  .wrap {
    position:relative;
    width: 100%;
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
    // overflow-x: auto;
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
