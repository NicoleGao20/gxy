<template>
  <div
    :style="{
      width: w + 'px',
      height: h + 'px'
    }"
    :class="{'Resizer-content': true, 'active': false }"
    resize="true"
    @click="onClick($event)"
  >
    <div class="resizer-zoom">
      <i v-for="(item, index) in handles" :key="index" :class="item" @mousedown="onMouseDown($event,item)" @mouseup="onMouseUp()"/>
    </div>
    <div v-if="isline" class="linehandles">
      <div v-for="(item, index) in handles" :key="index" :class="'line'+item"/>
    </div>
    <slot/>
  </div>
</template>
<script>
export default {
  name: 'Resizer',
  props: {
    w: {
      type: Number,
      default: 0
    },
    h: {
      type: Number,
      default: 0
    },
    resizing: {
      type: Function,
      default() {
        return () => {
        }
      }
    },
    isline: {
      type: Boolean,
      default: false
    },
    handles: {
      type: Array,
      default() {
        return []
      }
    },
    index: {
      type: Number,
      default: 0
    },
    activated: {
      type: Function,
      default() {
        return () => {

        }
      }
    },
    listId: {
      type: String,
      default: '1'
    }
  },
  data() {
    return {
      headle: ['mr', 'ml'],
      beginPoint: 0, // 开始得X 轴位置
      ismove: false
    }
  },
  mounted() {
    document.onclick = (evt) => {
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
    }
  },
  methods: {
    onClick() {
      this.activated(this.index, this.listId)
    },
    onMouseDown(e, item) {
      this.beginPoint = e.x // 鼠标按下时候的坐标
      this.ismove = true // 是否可以移动
      const that = this
      document.onmousemove = function(evt) {
        if (that.ismove) {
          const dis = evt.x - that.beginPoint
          that.beginPoint = evt.x // 每次移动后把移动位置的X 坐标赋值
          that.resizing(dis, item)
        }
      }
      document.onmouseup = () => {
        this.onMouseUp()
      }
    },
    onMouseUp(evt, item) {
      this.beginPoint = 0
      this.ismove = false
      document.onmousemove = ''
    }
  }
}
</script>
<style lang="less" scoped>
.Resizer-content {
  position: relative;
  // background: #000;
  &.active {
    // border: 1px dashed #40aceb;
  }
  .linemr{
    position: absolute;
    top: 0;
    right: -1px;
    width: 0px;
    height: 100%;
    border-left: 2px dashed #40aceb;
    z-index: 100;
  }
  .lineml{
    position: absolute;
    top: 0;
    left: -1px;
    width: 0px;
    height: 100%;
    border-left: 2px dashed #40aceb;
    z-index: 100;
  }
  .resizer-zoom {
    display: none;
    i {
    display: block;
    position: absolute;
    width: 4px;
    height: 50px;
    border: 1px solid #40aceb;
    background: #fff;
    z-index: 1000;
    cursor: e-resize;
  }
  .mr {
    top: 50%;
    right: -2px;
    transform: translateY(-50%);
  }
  .ml {
    top: 50%;
    left: -2px;
    transform: translateY(-50%);
  }

  }
}
</style>

