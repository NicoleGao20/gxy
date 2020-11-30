<template>
  <div
    :style="{
      'color': item.color,
      'opacity': item.opacity/100,
      'width': item.width + 'px',
      'height': item.height + 'px',
      'fontSize': item.fontSize + 'px',
      'paddingTop': item.paddingTop + 'px',
      'borderRadius': item.borderRadius + 'px',
      'backgroundColor':item.backgroundColor,
      'textAlign': item.textAlign,
      'lineHeight':item.lineHeight
    }"
    class="word-text">
    {{ item.content }}
  </div>
</template>
<script type="text/javascript">
export default {
  name: 'DecorateShowList',
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
      num: 0,
      isfocus: false
    }
  },
  methods: {
    show(e) {
      e.target.blur()
    },
    onInput(e) {
      this.item.content = e.target.innerText
      if (this.num === 2) {
        this.num = 0
      }
    },
    isdouble(e) {
      if (!this.isfocus && this.num !== 2) {
        this.num += 1
        setTimeout(() => {
          if (this.num !== 2) {
            this.num = 0
          }
        }, 200)
        if (this.num === 2) {
          e.target.focus()
        } else {
          e.target.blur()
        }
      }
    }
  }
}
</script>
<style lang="less" scoped>
.word-text {
  display: block;
  width:auto;
  height: auto;
  overflow: hidden;
}
</style>
