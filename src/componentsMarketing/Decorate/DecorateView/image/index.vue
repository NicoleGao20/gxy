<template>
  <div
    :style="{
      'color': item.color,
      'opacity': item.opacity/100,
      'width': `${item.width}px`,
      'height': `${item.height}px`,
      'backgroundImage': `url(${item.imageUrl})`,
      'backgroundSize': `${item.imageMode}`,
      'borderRadius': `${item.borderRadius}px`}"
    class="image"
  />
</template>
<script type="text/javascript">
export default {
  name: 'DCImageComponent',
  props: {
    item: {
      type: Object,
      default() {
        return {}
      }
    },
    save: {
      type: Function,
      default() {
        return ''
      }
    }
  },
  data() {
    return {
    }
  },
  methods: {
  }
}
</script>
<style lang="less" scoped>
.image {
  background-position: center;
  background-repeat: no-repeat;
}
</style>
