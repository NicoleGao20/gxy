<template>
  <div class="panel">
    <p>组件</p>
    <section>
      <el-collapse v-if="list" v-model="activeNames">
        <div v-for="(item, index) in list " :key="index" class="content">
          <el-collapse-item :title="item.name" :name="index">
            <draggable
              :list="item.list"
              :options="{
                group: { name: item.type, pull: 'clone', put: false, revertClone: false },
                sort: false,
                ghostClass: 'move-component'
              }"
              :move="onUpdate"
              class="board-column-content"
              @start="start"
              @end="end">
              <div v-for="(element, key) in item.list" :key="key + Math.random()" class="board-item draggable-icon">
                <i :class="'iconfont ' + element.icon " />
                <p>{{ element.name }}</p>
              </div>
            </draggable>
          </el-collapse-item>
        </div>
      </el-collapse>
    </section>
  </div>
</template>
<script type="text/javascript">
import draggable from 'vuedraggable'
import iconSvg from '@/components/SvgIcon'
export default {
  name: 'DecorateIcon',
  components: {
    draggable,
    iconSvg
  },
  props: {
    list: {
      type: Array,
      default() {
        return []
      }
    },
    type: {
      type: String,
      default: 'try'
    }
  },
  data() {
    return {
      activeNames: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]
    }
  },
  methods: {
    start() {
      this.$store.dispatch('setDisabled', false)
      const dom = document.getElementsByClassName('ignore-element')
      for (let index = 0; index < dom.length; index++) {
        dom[index].style.display = 'block'
      }
      document.getElementById('decorate-arrow-up').style.display = 'block'
      document.getElementById('decorate-arrow-down').style.display = 'block'
    },
    end() {
      this.$store.dispatch('setDisabled', true)
      const dom = document.getElementsByClassName('ignore-element')
      for (let index = 0; index < dom.length; index++) {
        dom[index].style.display = 'none'
      }
      document.getElementById('decorate-arrow-up').style.display = 'none'
      document.getElementById('decorate-arrow-down').style.display = 'none'
      this.temporary()
    },
    onUpdate(evt) {
      // 添加显示容器中的 加号模块
      const dom = document.getElementsByClassName('ignore-element')
      for (let index = 0; index < dom.length; index++) {
        dom[index].style.background = '#72b6f0'
      }
      if (dom.length && evt.originalEvent.path.length > 0 && evt.originalEvent.path[0].className === 'header ignore-element') {
        evt.originalEvent.path[0].style.background = '#087abc'
      }
      this.temporary('', 1)
      const temporaryDOm = document.getElementsByClassName('temporary-element')
      if (evt.draggedContext.element.parentType === 'decorateChildren' && temporaryDOm.length && evt.originalEvent.path[0].className === 'temporary-element') {
        this.temporary(evt.originalEvent.path[0], 2)
      }
    },
    temporary(dom, isdeal) {
      if (isdeal === 2) {
        dom.style.position = 'absolute'
        dom.style.top = 0
        dom.style.left = 0
        dom.style.background = 'rgba(64,172,235,0.1)'
        dom.style.opacity = 1
        dom.style.zIndex = 9999
        dom.style.display = 'block'
      } else if (isdeal === 1) {
        const temporaryDOm = document.getElementsByClassName('temporary-element')
        for (let index = 0; index < temporaryDOm.length; index++) {
          const element = temporaryDOm[index]
          element.style.position = 'absolute'
          element.style.top = 0
          element.style.left = 0
          element.style.background = ''
          element.style.opacity = 0
          element.style.zIndex = 9999
          element.style.display = 'block'
        }
      } else {
        const temporaryDOm = document.getElementsByClassName('temporary-element')
        for (let index = 0; index < temporaryDOm.length; index++) {
          const element = temporaryDOm[index]
          element.style.display = 'none'
        }
      }
    }
  }
}
</script>
<style lang="less" scoped>
    .panel {
        position: relative;
        box-sizing: border-box;
        width: 300px;
        height: 95%;
        margin-left: 20px;
        background: #fff;
        border-radius: 6px;
        box-shadow: 0 0 5px 2px #ddd;
        overflow: auto;
        padding-top: 54px;
        // .move-component {
        //   opacity: 0;
        //   background: red;
        // }
        .board-column-content {
          display: flex;
          flex-wrap: wrap;
        }
        &>section {
          width: 100%;
          height: 100%;
          overflow: auto;
          &::-webkit-scrollbar {
            position: absolute;
            right: 0;
            top:0;
            width: 0px;
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
        &>p {
          position: absolute;
          top: 0;
          left: 0;
          display: flex;
          width: 300px;
          height: 54px;
          align-items: center;
          font-weight:700;
          color: #000;
          border-bottom: 1px solid #ddd;
          padding-left: 20px;
          &:before {
            content:'';
            width: 6px;
            height: 6px;
            margin-right: 5px;
            border-radius: 50%;
            border: 1px solid #6590DD;
          }
        }
        .name {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 30px;
            color: #fff;
            background: #333;
        }
        .board-item {
          display: flex;
          justify-content: center;
          align-items: center;
          flex-direction: column;
          width: 100px;
          height: 100px;
          padding-bottom: 10px;
          cursor: move;
          font-size: 12px;
          border-right: 1px dashed #ddd;

          &:not(:only-child):last-child {
            border-right-width: 0;
          }

          .iconfont {
            font-size: 32px;
          }
          .icon-svg {
            width: 30px;
            height: 30px;
          }
          &:hover {
            color: #409EFF;
          }
        }
        .el-collapse {
          border: none;
        }
        .el-collapse-item:last-child {
          margin:0;
        }
    }
</style>
<style lang="less">
  .el-collapse-item__header {
    padding-left: 20px;
    border-bottom: 1px solid #eee;
    font-size: 16px;
    color: #555;

    &.is-active {
      border-bottom-color: #eee;
    }
  }
  .el-collapse-item__content {
    padding-bottom: 0;
  }
</style>
