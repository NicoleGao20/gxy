<template>
  <div
    :style="{
      'color': item.color,
      'opacity': item.opacity/100,
      'fontSize': item.fontSize + 'px',
      'paddingTop': item.paddingTop + 'px',
      'borderRadius': item.topLeftborderRadius + 'px ' + item.topRightborderRadius + 'px ' + item.bottomRightborderRadius + 'px ' + item.bottomLeftborderRadius + 'px',
      'backgroundColor':item.backgroundColor,
      'backgroundImage': 'url('+ item.backgroundImage+'})',
      'backgroundPosition': `${item.backgroundPosition}`,
      'backgroundRepeat': `${item.backgroundRepeat}`,
      'backgroundSize': `${item.backgroundSize}`
    }"
    class="btn">
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
.btn {
  display:flex;
  justify-content: center;
  align-items: center;
  width:100%;
  height: 100%;
  overflow: hidden;
  text-align: center;
  border: none;
}
</style>
