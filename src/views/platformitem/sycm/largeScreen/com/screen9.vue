<template>
  <div class="srceen5" :style="{backgroundImage: 'url(' + bgImg+ ')' }">
      <iframe
       v-show="showBoolean"
        src="https://sycm.taobao.com/ipoll/datawar.htm#/item-showcase"
        id="mobsf"
        scrolling="no"
        frameborder="0"
        style="width: 100%; height: 100%"
      ></iframe>
  </div>
</template>
<script>
import bgImg from '@/assets/img/large.gif'
export default {
  data() {
    return {
      showBoolean:false,
      delayTimer:null,
      bgImg:bgImg
    }
  },
  created() {},
  mounted() {
    this.delayTimer = setTimeout(this.delayShow, 1000);
  },
  beforeDestroy() {
    if(this.delayTimer) { //如果定时器在运行则关闭
      clearTimeout(this.delayTimer);
    }
  },
  methods: {
    delayShow(){
      this.showBoolean=true
    }
  },
}
</script>
<style lang="less" scoped>
.srceen5 {
  height: 100%;
  background-position: center center;
  background-size: cover;
  // background-image: url(../../../assets/img/large.gif);
}
</style>