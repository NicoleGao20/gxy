<template>
  <div class="decorate-tabs-panel">
    <section v-if="item.editor">
      <editorContent :set-info="item.editor ? item.editor.setInfo : setInfo">
        <template v-if="item.editor && item.editor.base " slot="base">
          <editorChildComponent :item="item" :list=" item.editor.base"/>
        </template>
        <template v-if="item.editor && item.editor.data " slot="subelement">
          <editorChildComponent :item="item" :list=" item.editor.data"/>
        </template>
        <template v-if="item.editor && item.editor.style " slot="style">
          <editorChildComponent :item="item" :list="item.editor.style "/>
        </template>
        <template v-if="item.editor && item.editor.config " slot="config">
          <editorChildComponent :item="item" :list="item.editor.config"/>
        </template>
      </editorContent>
    </section>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import editorChildComponent from './editorChildComponent'
import editorContent from './editorHeader'
export default {
  name: 'Decorate',
  components: {
    editorContent,
    editorChildComponent
  },
  data() {
    return {
      item: {
        type: {}
      },
      setInfo: {
        icon: 'form',
        name: '按钮',
        dec: '添加按钮样式和按钮文字',
        tab: [
          {
            name: '基础',
            id: '1',
            slot: 'base'
          },
          {
            name: '子元素',
            id: '2',
            slot: 'subelement'
          },
          {
            name: '样式',
            id: '3',
            slot: 'style'
          }
        ]
      }
    }
  },
  computed: mapState({
    id: state => state.decorate.seletedId,
    conId: state => state.decorate.conId,
    list: state => state.decorate.list,
    manyId: state => state.decorate.manyId
  }),
  watch: {
    id(newV, oldV) {
      this.dataChange()
    },
    manyId(newV, oldV) {
      this.dataChange()
    },
    conId(newV, oldV) {
      this.dataChange()
    }
  },
  methods: {
    dataChange() {
      if (this.id && !this.manyId && !this.conId) {
        const result = this.list.find(state => state.id === this.id)
        if (result) {
          this.$set(this, 'item', result)
        } else {
          this.$set(this, 'item', {})
        }
      }
      if (this.id && this.manyId && !this.conId) {
        const result = this.list.find(state => state.id === this.id)
        const content = result.content.find(state => state.id === this.manyId)
        if (content) {
          this.$set(this, 'item', content)
        } else {
          this.$set(this, 'item', {})
        }
      }
      if (this.id && this.manyId && this.conId) {
        const result = this.list.find(state => state.id === this.id)
        const content = result.content.find(state => state.id === this.manyId)
        const newitem = content.children.find(state => state.id === this.conId)
        if (newitem) {
          this.$set(this, 'item', newitem)
        } else {
          this.$set(this, 'item', {})
        }
      }
      // console.log(this.item)
    },
    save() {
      for (var i = 0; i < this.list.length; i++) {
        if (this.list[i].id === this.item.id) {
          this.list[i] = this.item
        }
      }
      this.$store.dispatch('merge', this.list)
    }
  }
}
</script>
<style lang="less" scoped>
.decorate-tabs-panel {
  width: 350px;
  height: 100%;
  & > section {
    height: 100%;
    background: #fff;
  }
}
</style>
