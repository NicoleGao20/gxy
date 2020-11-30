<template>
  <div class="belle-control" @click="onclick()" :style="bestyle"  :class="beClass" @mousedown="onmousedown($event)">
    {{ name}}
  </div>
</template>
<script>
export default {
  name: 'BelleButton',
  props: {
    id: {
      type: String,
      default: ''
    },
    name: {
      type: String,
      default: ''
    },
    bestyle: {
      type: Object,
      default () {
        return {}
      }
    },
    beClass: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      isShow: true
    }
  },
  mounted () {
    const path = this.$router.options.routes[0].path
    let rule = localStorage.getItem('rule')
    const ruleobj = JSON.parse(rule)
    this.isShow = this.id ? !!ruleobj[path][this.id] : true
  },
  methods: {
    onclick () {
      // const router = this.$router.options.routes[0].path
      // window._hmt.push(['_trackEvent', 'music', 'play', 'Hey Jude'])
      this.$emit('onclick')
      // callback && callback('music', 'play', 'Hey Jude')
    },
    onmousedown (e) {
      // 现代浏览器阻止默认事件
      if (e && e.preventDefault) {
        e.preventDefault()
      } else { window.event.returnValue = false }
      return false
    }
  }
}
</script>
<style>
.belle-control {
  cursor: pointer;
}
</style>
