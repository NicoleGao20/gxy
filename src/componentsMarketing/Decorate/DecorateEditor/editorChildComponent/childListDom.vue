<template>
  <div>
    <section v-if="data.children">
      <draggable
        :list="data.children"
        :group="{ name: 'childListDom'}"
        :sort="true"
        :animation="200"
        class="child-list-component"
      >
        <div v-for="(item, index) in data.children" :key="index">
          <div>
            <i :class="'iconfont icon-currency comicon'" />
            <p @click="changeContId(item.id)">
              <i :class="'iconfont ' + item.icon" />
              {{ item.name }}
            </p>
            <div @click="changeContId(item.id)">{{ item.elementName }}</div>
          </div>
          <i :class="'iconfont icon-delete comicondelet'" @click="delet(index,true)"/>
        </div>
      </draggable>
    </section>
    <section v-if="data.children">
      <draggable
        :list="data.children"
        :group="{ name: 'childListDom'}"
        :sort="true"
        :animation="200"
        class="child-list-component"
      >
        <div v-for="(item, index) in data.content" :key="index">
          <div>
            <i :class="'iconfont icon-currency comicon'" />
            <p @click="changeContId(item.id)">
              <i :class="'iconfont ' + item.icon" />
              子容器
            </p>
          </div>
          <i :class="'iconfont icon-delete comicondelet'" @click="delet(index,false)"/>
        </div>
      </draggable>
    </section>
  </div>
</template>
<script type="text/javascript">
import ComTitle from './comTitle'
import draggable from 'vuedraggable'
export default {
  name: 'DecorateChildListDom',
  components: {
    ComTitle,
    draggable
  },
  props: {
    setdata: { // 编辑参数数据
      type: Object,
      default() {
        return {}
      }
    },
    data: { // 要修改的数据
      type: Object,
      default() {
        return {}
      }
    }
  },
  mounted() {},
  methods: {
    delet(key, ischildren) {
      if (ischildren) {
        this.data.children.splice(key, 1)
      } else {
        this.data.content.splice(key, 1)
      }
    },
    changeContId(id) {
      this.$store.dispatch('setManyId', this.data.id)
      this.$store.dispatch('setContentId', id)
    }
  }
}
</script>
<style lang="less" scoped>
  .child-list-component {
      &> div {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 34px;
      padding: 0 10px;
      background: #f7f7f7;
      & > div {
        flex:1;
        display: flex;
        // justify-content: space-between;
        align-items: center;
        p {
          display: flex;
          align-items: center;
          color: #666;
          font-size: 15px;
          cursor: pointer;
          i {
            font-size: 18px;
            margin-right: 5px;
          }
        }
        div {
          width: 150px;
          margin-left: 5px;
          font-size: 15px;
          color: #ddd;
          overflow: hidden;
          text-overflow:ellipsis;
          white-space: nowrap;
          overflow: hidden;
          cursor: pointer;
        }
      }
      .comicon {
        width: 34px;
        height: 34px;
        font-size: 15px;
        line-height: 34px;
      }
    }
  }
</style>

