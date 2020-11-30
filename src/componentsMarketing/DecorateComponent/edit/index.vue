<template>
  <div class="decorate-tabs-panel">
    <section v-if="item.editor">
      <editorContent :set-info="item.editor ? item.editor.setInfo : setInfo">
        <template v-if="item.editor && item.editor.base " slot="base">
          <editorChildComponent :item="item" :list="item.editor ? item.editor.base: []"/>
        </template>
        <template v-if="item.editor && item.editor.data " slot="subelement">
          <editorChildComponent :item="item" :list="item.editor ? item.editor.data: []"/>
        </template>
        <template v-if="item.editor && item.editor.style " slot="style">
          <editorChildComponent :item="item" :list="item.editor ? item.editor.style : []"/>
        </template>
        <template v-if="item.editor && item.editor.config " slot="config">
          <editorChildComponent :item="list.content[0]" :list="list.content[0].editor ? list.content[0].editor.config : []"/>
          <configOption />
        </template>
      </editorContent>
    </section>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import editorChildComponent from '@/components/Decorate/DecorateEditor/editorChildComponent'
import editorContent from '@/components/Decorate/DecorateEditor/editorHeader'
import configOption from './configOption'
export default {
  name: 'DecorateComponentEidt',
  components: {
    editorContent,
    editorChildComponent,
    configOption
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
    id: state => state.decorateComponents.childrenId,
    list: state => state.decorateComponents.viewList
  }),
  watch: {
    id(newV, oldV) {
      this.dataChange()
    }
  },
  mounted() {
    setTimeout(() => {
      this.$set(this, 'item', this.list.content[0])
    }, 500)
  },
  methods: {
    dataChange() {
      if (!this.id) {
        this.$set(this, 'item', this.list.content[0])
      } else {
        const data = this.list.content[0].children.find(res => res.id === this.id)
        this.$set(this, 'item', data)
      }
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
