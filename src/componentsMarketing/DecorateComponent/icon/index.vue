<template>
  <div class="dce-icon-content">
    <p>内容组件</p>
    <draggable
      v-model="list"
      :group ="{ name: 'decorateChildren', pull: 'clone', put: false, revertClone: false }"
      :clone="(original)=>original"
      :sort="false"
      tag="div"
      class="board-column-content"
      @start="onstart"
      @end="onend">
      <div v-for="(element, key) in list" :key="key + Math.random()" class="board-item draggable-icon" @mousedown="onclick()">
        <i :class="'iconfont ' + element.icon" />
        <p>{{ element.name }}</p>
      </div>
    </draggable>
  </div>
</template>
<script>
import draggable from 'vuedraggable'
import { getDecorateComponentList } from '@/api/decorate'
export default {
  name: 'DecorateComponentIcon',
  components: {
    draggable
  },
  data() {
    return {
      list: []
    }
  },
  mounted() {
    this.beginGetData()
  },
  methods: {
    onstart() {
      this.$store.dispatch('setDisabled', false)
    },
    onend() {
      this.$store.dispatch('setDisabled', true)
    },
    onclick() {
      console.log(9999)
      this.$store.dispatch('decorateComponentsId', '')
    },
    onOption() {
      return {
        group: { name: 'decorateChildren', pull: 'clone', put: false, revertClone: false },
        sort: false
      }
    },
    beginGetData() {
      getDecorateComponentList('decorateChildren').then(res => {
        const list = []
        res.data.list.forEach(element => {
          list.push(JSON.parse(element.content))
        })
        this.list = list
      })
    }
  }
}
</script>
<style lang="less" scoped>
  .dce-icon-content {
    position: relative;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    width: 300px;
    height: 95%;
    margin-left: 20px;
    background: #fff;
    border-radius: 6px;
    -webkit-box-shadow: 0 0 5px 2px #ddd;
    box-shadow: 0 0 5px 2px #ddd;
    overflow: auto;
    padding-top: 54px;
    &>p {
        position: absolute;
        top: 0;
        left: 0;
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        width: 300px;
        height: 54px;
        -webkit-box-align: center;
        -ms-flex-align: center;
        align-items: center;
        font-weight: 700;
        color: #000;
        border-bottom: 1px solid #ddd;
        padding-left: 20px;
        &:before {
          content: '';
          width: 6px;
          height: 6px;
          margin-right: 5px;
          border-radius: 50%;
          border: 1px solid #6590DD;
        }
    }
    .board-column-content {
      display: flex;
      flex-wrap:wrap;
      border-bottom: 1px solid #ddd;
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
    }
  }
</style>

