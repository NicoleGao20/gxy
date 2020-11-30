<template>
  <draggable
    :list="modelData"
    v-bind="bind"
    :class="'bdraggable_content ' +className"
    @add="onadd"
  />

</template>
<script type="text/javascript">
import draggable from 'vuedraggable'
export default {
  name: 'Bdraggable',
  components: {
    draggable
  },
  props: {
    modelData: {
      type: Array,
      default() {
        return []
      }
    },
    className: {
      type: String,
      default: ''
    },
    bind: {
      type: Object,
      default() {
        return {}
      }
    },
    onadd: {
      type: Function,
      default() {
        return () => {}
      }
    }
  }
}
</script>
<style lang="less" scoped>
  .bdraggable_content {
    position: absolute;
    top: 0;
    left: 0;
  }

</style>
