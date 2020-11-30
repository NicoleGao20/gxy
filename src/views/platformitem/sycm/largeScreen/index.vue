<template>
  <div class="largeScreenIndex">
    <div  >
      <el-row type="flex" class="row-bg" justify="center">
        <el-col :span="6">
          <el-card shadow="hover" >
            <div>
              <el-button type="primary" round plain @click="loginLargeScreen()">登陆大屏</el-button>
            </div>
            
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card shadow="hover" >
            <div>
              <el-button type="primary" round plain @click="intoLargeScreen()">进入产品</el-button>
            </div>
          </el-card>
        </el-col> 
      </el-row>
    </div>
    <!-- <component :is="screenComponent" mode="out-in"></component> -->
  </div>
</template>
<script>
import screen1 from './com/screen1.vue'
import screen2 from './com/screen2.vue'
import screen3 from './com/screen3.vue'
import screen4 from './com/screen4.vue'
import screen5 from './com/screen5.vue'
export default {
  name: 'largeScreenIndex',
  // components: {
  //   // eslint-disable-next-line vue/no-unused-components
  //   screen1: screen1,
  //   // eslint-disable-next-line vue/no-unused-components
  //   screen2: screen2,
  //   // eslint-disable-next-line vue/no-unused-components
  //   screen3: screen3,
  //   // eslint-disable-next-line vue/no-unused-components
  //   screen4: screen4,
  //   // eslint-disable-next-line vue/no-unused-components
  //   screen5: screen5,
  // },
  data() {
    return {
      screenComponent: 'screen1',
    }
  },
  methods: {
    loginLargeScreen(){
        window.open("https://sycm.taobao.com/qy/home");
    },
    intoLargeScreen(){
      this.$router.push({
        name: "largeScreen",
      });
    }
  },
}
</script>
<style  lang="less" scoped>
.largeScreenIndex {
  position: relative;
  height: 100%;
  width: 100%;
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
}
</style>
