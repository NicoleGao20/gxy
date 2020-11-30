<template>
  <div class="largeScreen" ref="content"  :style="{backgroundImage: 'url(' + bgImg+ ')' }">
    <component :is="screenComponent" mode="out-in"></component>
    <!-- <img src="@/assets/img/loading.gif" alt="" class="loading"> -->
  </div>
</template>
<script>
import bgImg from '@/assets/img/large.gif'
import screen1 from './com/screen1.vue'
import screen2 from './com/screen2.vue'
import screen3 from './com/screen3.vue'
import screen4 from './com/screen4.vue'
import screen5 from './com/screen5.vue'
import screen6 from './com/screen6.vue'
import screen7 from './com/screen7.vue'
import screen8 from './com/screen8.vue'
import screen9 from './com/screen9.vue'
import screen10 from './com/screen10.vue'
export default {
  name: 'largeScreen',
  components: {
    // eslint-disable-next-line vue/no-unused-components
    screen1: screen1,
    // eslint-disable-next-line vue/no-unused-components
    screen2: screen2,
    // eslint-disable-next-line vue/no-unused-components
    screen3: screen3,
    // eslint-disable-next-line vue/no-unused-components
    screen4: screen4,
    // eslint-disable-next-line vue/no-unused-components
    screen5: screen5,
    screen6: screen6,
    screen7: screen7,
    screen8: screen8,
    screen9: screen9,
    screen10: screen10,
  },
  data() {
    return {
      screenComponent: 'screen1',
      time:20,
      timer:null,
      delayTimer:null,
      bgImg:bgImg
    }
  },
  created(){
    this.getLastTime()
  },
  mounted() {
    // 延迟全屏
    // this.delayTimer = setTimeout(this.fullScreen, 1000);
    this.fullScreen();

  },
  beforeDestroy() {
      // if(this.delayTimer) { //如果定时器在运行则关闭
      //   clearTimeout(this.delayTimer);
      // }
      if(this.timer) { //如果定时器在运行则关闭
        clearInterval(this.timer); 
      }
  },
  methods: {
    fullScreen() { 
      let el= this.$refs.content
      var rfs = el.requestFullScreen || el.webkitRequestFullScreen || el.mozRequestFullScreen || el.msRequestFullScreen, 
          wscript; 
      if(typeof rfs != "undefined" && rfs) { 
          rfs.call(el); 
          return; 
      } 
      if(typeof window.ActiveXObject != "undefined") { 
          wscript = new ActiveXObject("WScript.Shell"); 
          if(wscript) { 
              wscript.SendKeys("{F11}"); 
          } 
      } 
  },
    getLastTime(){
      this.timer = setInterval(()=> {
          if(this.time == 200){
            this.time = 0;
          }else {
              this.time = this.time + 20 ;
              console.log(this.time,999)
              let screenIndex =this.time/20
              this.screenComponent=`screen${screenIndex}`
              console.log(this.screenComponent,'9999')
          }
          // 一秒= 1000 ms
      },15000) 
    },
    destroyed(){
    
    }
  },
}
</script>
<style  lang="less" scoped>
.largeScreen {
  position: relative;
  height: 100%;
  width: 100%;
  background-position: center center;
  background-size: cover;
  // background-image: url(../../assets/img/large.gif);
  .loading{
    position: absolute;
    top:50%;
    left: 50%;
    transform: translate(-50%,-50%);
  }
  .el-col {
    text-align: center;
    .el-card {
      height: 280px;
      margin: 20px;
      // background-color: #073c732b;
      width: calc(100% - 40px);
      cursor: pointer;
      text-align: center;
      span {
        font-weight: 700;
        // color: #707575;
      }
      div {
        margin-top: 15px;
      }
    }
  }
  #main{
    background: chartreuse;
  }
}
</style>
