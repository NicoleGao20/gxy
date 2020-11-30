<template>
  <div
    :style="list.content.length === 0 ? {
      width:'100%',
      height: '200px',
    }: ''"
    :id="list.id"
    class="columns-content" >
    <NoChild v-if="list.content.length === 0" :data="list"/>
    <section
      v-for="(res, index) in list.content"
      :key="index"
      :style="{
        width:res.width + 'px',
        height: res.height+'px',
        backgroundColor: res.backgroundColor,
        border: res.children.length === 0 && list.id !== seletedId ? '1px dashed #40aceb' : 'none'
    }">
      <Resizer
        :w="res.width"
        :h="res.height"
        :resizing="onResizing"
        :isline="list.id === seletedId"
        :handles="needSize(list.content.length, index)"
        :index="index"
        :list-id="list.id"
        :activated="onActivated"
      >
        <draggable
          :list="res.children"
          :options="{
            group: { name: 'columns', put: ['decorateChildren'] },
            disabled: false,
            sort: false
          }"
          class="decorate-columns-content"
          @add="onAdd">
          <div class="temporary-element"/>
          <ColumnsEmpty v-if="res.children.length === 0"/>
          <div v-for="(item, key) in res.children" :key="key" :style="{height: item.height + 'px' }" class="dc-columns-content" @click="stopPropagation($event)">
            <vue-draggable-resizable
              :w="res.width"
              :h="item.height"
              :draggable="false"
              :handles="item.type === 'text' ? []:['bm']"
              :z="99"
              :active= " manyId == res.id && item.id === conId "
              :prevent-deactivation = "true"
              class-name-active="many-columns-size"
              @resizing="onResize"
              @activated="onActivatedChild($event,index,key)">
              <WordText v-if="item.type === 'text'" :item="item" />
              <Btn v-if="item.type === 'btn'" :item="item" />
              <Imgcontent v-if="item.type === 'image'" :item="item" />
            </vue-draggable-resizable>
          </div>
        </draggable>
      </Resizer>
    </section>
  </div>
</template>
<script>
import draggable from 'vuedraggable'
import VueDraggableResizable from 'vue-draggable-resizable'
import WordText from '../text'
import Imgcontent from '../image'
import Btn from '../btn'
import NoChild from './noChild'
import Resizer from './resizer'
import ColumnsEmpty from './empty'
import UUID from 'uuidjs'
import { mapState } from 'vuex'
export default {
  name: 'Columns',
  components: {
    draggable,
    VueDraggableResizable,
    WordText,
    Imgcontent,
    Btn,
    NoChild,
    Resizer,
    ColumnsEmpty
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
          'content': [],
          'dragId': '',
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
    conId: state => state.decorate.conId, // 内容组件id
    manyId: state => state.decorate.manyId, // 子容器组件id
    seletedId: state => state.decorate.seletedId
  }),
  methods: {
    stopPropagation(evt) { // 阻止冒泡并选中子容器
      evt.stopPropagation()
      const dome = document.getElementsByClassName('resizer-zoom')
      for (let index = 0; index < dome.length; index++) {
        const element = dome[index]
        element.style.display = 'none'
      }
      for (let index = 0; index < evt.path.length; index++) {
        const element = evt.path[index]
        if (/Resizer-content/.test(element.className)) {
          element.children[0].style.display = 'block'
        }
      }
    },
    onActivatedChild(evt, index, key) { // 子元素Id
      this.dragId = index
      this.childId = key
      const list = this.list
      setTimeout(() => {
        this.$store.dispatch('setID', list.id)
        this.$store.dispatch('setManyId', list.content[index].id)
        if (this.childId || this.childId === 0) {
          this.$store.dispatch('setContentId', list.content[index].children[key].id)
        }
      }, 100)
    },
    onResizing(dis, hadle) { // 鼠标在拉动按钮上方移动时候计算 每个容器的宽度
      const length = this.list.content.length
      const data = this.list.content
      const iszero = (num1, num2) => {
        if (data[num1].width <= 5) {
          return num1
        } else if (data[num2].width <= 5) {
          return num2
        } else {
          return false
        }
      }
      if (length === 2) {
        const result = iszero(0, 1)
        if (result === 0) {
          if (dis > 0) {
            data[0].width += dis
            data[1].width -= dis
          }
        }
        if (result === 1) {
          if (dis < 0) {
            data[0].width += dis
            data[1].width -= dis
          }
        }
        if (!result && result !== 0) {
          data[0].width += dis
          data[1].width -= dis
        }
      }
      if (length === 3) {
        if (this.dragId === 0 || (this.dragId === 1 && hadle === 'ml')) {
          const result = iszero(0, 1)
          if (result === 0) {
            if (dis > 0) {
              data[0].width += dis
              data[1].width -= dis
            }
          }
          if (result === 1) {
            if (dis < 0) {
              data[0].width += dis
              data[1].width -= dis
            }
          }
          if (!result && result !== 0) {
            data[0].width += dis
            data[1].width -= dis
          }
        }
        if (this.dragId === 2 || (this.dragId === 1 && hadle === 'mr')) {
          const result = iszero(1, 2)
          if (result === 1) {
            if (dis > 0) {
              data[1].width += dis
              data[2].width -= dis
            }
          }
          if (result === 2) {
            if (dis < 0) {
              data[1].width += dis
              data[2].width -= dis
            }
          }
          if (!result) {
            data[1].width += dis
            data[2].width -= dis
          }
        }
      }
      this.onAdd()
    },
    onActivated(index, id) { // 选择子容器Id
      this.dragId = index
      setTimeout(() => {
        this.$store.dispatch('setID', id)
        this.$store.dispatch('setManyId', this.list.content[this.dragId].id)
        this.$store.dispatch('setContentId', '')
      }, 100)
    },
    onResize(left, top, width, height) { // 拉动组件拉伸子元素高度，赋值给相应的元素
      const data = this.list.content[this.dragId].children[this.childId]
      data.height = height
      this.onAdd() // 调取添加函数重新计算几个子容器中最大容器高度
    },
    needSize(length, index) { // 判断子元素所需的拉伸边框的按钮
      if (length === 1) {
        return []
      }
      if (length === 2) {
        if (index === 0) {
          return ['mr']
        }
        if (index === 1) {
          return ['ml']
        }
      }
      if (length === 3) {
        if (index === 0) {
          return ['mr']
        }
        if (index === 1) {
          return ['mr', 'ml']
        }
        if (index === 2) {
          return ['ml']
        }
      }
    },
    onAdd(evt) { // 当元素添加到容器中时候，计算所有子元素高度。
      const list = JSON.parse(JSON.stringify(this.list))
      const data = list.content
      const arry = []
      data.forEach(element => {
        const children = element.children
        if (element.children.length <= 0) {
          return false
        }
        var height = 0
        for (let index = 0; index < children.length; index++) {
          const item = children[index]
          height += item.height
          item.width = element.width // 把父模块的大小赋给子模块
        }
        arry.push(height)
      })
      const max = Math.max(...arry)
      data.forEach(element => {
        element.height = max
      })
      data.forEach(res => {
        const children = res.children
        for (let index = 0; index < children.length; index++) {
          const item = children[index]
          if (!item.id) {
            children.splice(index, 1)
            item.id = UUID.generate()
            children.push(item)
            return
          }
        }
      })
      this.$store.dispatch('changeValue', list)
    }
  }
}
</script>
<style lang="less" scoped>
  .columns-content {
    width: 100%;
    display: flex;
    overflow: hidden;
    .temporary-element {
      position:absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 99;
    }
    &>section {
      box-shadow: border-box;
      position: relative;
      display: block;
      .decorate-columns-content {
        width: 100%;
        height: 100%;
        overflow: hidden;
        .dc-columns-content {
          position: relative;
        }
      }
    }
  }
</style>
<style lang="less">
  .many-columns-size {
    box-sizing: border-box;
    border: 1px dashed #40aceb;
    &>.handle-bm {
      bottom: 0px;
      left: 50%;
      height: 6px;
      width: 12px;
      border-radius: 6px 6px 0px 0px;
    }
  }
</style>

