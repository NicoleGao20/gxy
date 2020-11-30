<template>
  <el-container style="height:100%;">
    <el-container>
      <el-header class="neo-header" style="height:8%;">
        <div class="aside-top">
          <router-link to="/" class="logo">
            <img :src="$store.getters.getConfig.websiteLogo || logo" style="width:80px" alt >
            <span style="font-size: 20px;color: white;">{{ websiteName }}</span>
          </router-link>
        </div>
        <div class="neo-header-right">
          <div class="backBtn" @click="manage()">
            <img src="@/assets/img/header/setting.png" alt="管理平台">
            管理平台
          </div>
          <router-link :to="{name:'dataDownload'}">
            <div class="backBtn" @click="manage()">
              <img src="@/assets/img/header/download.png" alt="下载中心">
              下载中心
            </div>
          </router-link>
          <div class="backBtn" @click="help()">
            <img src="@/assets/img/header/help.png" alt="使用指南">
            使用指南
          </div>
          <el-dropdown>
            <div class="backBtn">
              你好，{{ user_info.name }}
              <i class="el-icon-caret-bottom"/>
            </div>
            <el-dropdown-menu slot="dropdown" class="width120 text-center">
              <el-dropdown-item @click.native="openModifyPasswordModal">修改密码</el-dropdown-item>
              <el-dropdown-item @click.native="logout">退出登录</el-dropdown-item>
            </el-dropdown-menu>
            <modify-password v-if="passwordModal" :info="user_info" :password-modal.sync="passwordModal"/>
          </el-dropdown>
        </div>
      </el-header>
      <el-main class="neo-main" style="height:60%;">
        <homePage/>
      </el-main>
      <el-footer style="background-color:#01337A;height: 30%;">
        <el-row style="text-align:center">
          <el-col :span="6">
            <el-button class="memuenter" @click="insight()">洞察平台</el-button>
          </el-col>
          <el-col :span="6">
            <el-button class="memuenter" @click="markting()">营销平台</el-button>
          </el-col>
          <el-col :span="6">
            <el-button class="memuenter" @click="interact()">互动平台</el-button>
          </el-col>
          <el-col :span="6">
            <el-button class="memuenter" @click="datamanage()">数据平台</el-button>
          </el-col>
        <!-- <el-col :span="6">
          <el-card shadow="hover" class="homePageCard">
            <span style="font-size: 22px">管理平台</span>
            <div style="bottom: 0;">
              <el-button type="primary" round plain @click="manage()">进入产品</el-button>
            </div>
            <div>
              <span
                style="font-family:'PingFang SC'"
              >平台基础设置管理，进行渠道集成、权限、安全配置、下载等系统设置。</span>
            </div>
          </el-card>
        </el-col> -->
        <!-- <el-col :span="6">
          <el-card shadow="hover" class="homePageCard">
            <span style="font-size: 22px">生意参谋</span>
            <div style="bottom: 0;">
              <el-button type="primary" round plain @click="largeScreen()">进入产品</el-button>
            </div>
            <div>
              <span
                style="font-family:'PingFang SC'"
              >平台基础设置管理，进行渠道集成、权限、安全配置、下载等系统设置。</span>
            </div>
          </el-card>
        </el-col> -->
        <!-- <el-col :span="6">
          <el-card shadow="hover" class="homePageCard">
            <span style="font-size: 22px">QuickAudience</span>
            <div>
              <el-button type="primary" round plain @click="qaview()">进入产品</el-button>
            </div>
            <div>
              <span
                style="font-family:'PingFang SC'"
              >基于标签形成受众群组，进行数据银行、腾讯广告等外部广告营销投放。</span>
            </div>
          </el-card>
        </el-col> -->
        <!-- <el-col :span="6">
          <el-card shadow="hover" class="homePageCard">
            <span style="font-size: 22px">DataPhin</span>
            <div>
              <el-button type="primary" round plain @click="dataphinview()">进入产品</el-button>
            </div>
            <div>
              <span
                style="font-family:'PingFang SC'"
              >Dataphin（智能数据构建与管理）是一款用于大数据平台建设的智能引擎，旨在满足各行各业大数据建设、管理及应用需求。</span>
            </div>
          </el-card>
        </el-col> -->
        </el-row>
      </el-footer>
    </el-container>
  </el-container>

</template>

<script>
var logo = require('@/assets/img/logo.png') // 表格默认图片
import Cookies from 'js-cookie'
import modifyPassword from '@/components/modifyPassword/modifyPassword.vue'
import homePage from '@/views/home/homePage'
import { getPlatformList } from '@/api/homePage'
import { V2, userLogout } from '@/api/login'
export default {
  name: 'Dashboard',
  components: {
    homePage,
    'modify-password': modifyPassword
  },
  data() {
    return {
      websiteName: '',
      desc: '',
      logo: logo,
      passwordModal: false, // 修改密码弹框
      user_info: '',
      platformList: []
    }
  },
  created() {
    this.user_info = this.$store.state.userinfo.user_info
    this.getPlatform()
    this.websiteName = this.$store.getters.getConfig.websiteName || '数据营销平台'
  },
  methods: {
    getPlatform() {
      getPlatformList().then((res) => {
        if (res.code == 0) {
          this.platformList = res.body || []
        }
      })
    },
    removeBrand() {
      if (Number(Cookies.get('platformCode')) === 4) return
      Cookies.remove('brandCode')
      Cookies.remove('brandName')
    },
    biview() {
      this.removeBrand()
      window.open('http://bi.mdmc.rbmanon.cn/')
    },
    insight() {
      Cookies.set('platformCode', this.platformList[2].platformCode)
      this.removeBrand()
      this.$router.push({
        name: 'manage',
        query: { platformCode: this.platformList[2].platformCode }
      })
    },
    markting() {
      Cookies.set('platformCode', this.platformList[3].platformCode)
      Cookies.set('brandCode', this.brandCode)
      this.$router.push({
        name: 'manage',
        query: { platformCode: this.platformList[3].platformCode }
      })
    },
    qaview() {
      this.removeBrand()
      window.open('http://qa.mdmc.rbmanon.cn/')
    },
    dataphinview() {
      this.removeBrand()
      window.open('http://dp.mdmc.rbmanon.cn/')
    },
    interact() {
      Cookies.set('platformCode', this.platformList[4].platformCode)
      this.removeBrand()
      this.$router.push({
        name: 'manage',
        query: { platformCode: this.platformList[4].platformCode }
      })
    },
    datamanage() {
      Cookies.set('platformCode', this.platformList[1].platformCode)
      this.removeBrand()
      this.$router.push({
        name: 'manage',
        query: { platformCode: this.platformList[1].platformCode }
      })
    },
    manage() {
      Cookies.set('platformCode', this.platformList[0].platformCode)
      this.removeBrand()
      this.$router.push({
        name: 'manage',
        query: { platformCode: this.platformList[0].platformCode }
      })
    },
    largeScreen() {
      // Cookies.set("platformCode", this.platformList[0].platformCode);
      // window.open("https://sycm.taobao.com/qy/home");
      const newHref = this.$router.resolve({ name: 'largeScreen' })
      window.open(newHref.href, '_blank')
    },
    help() {
      const newHref = this.$router.resolve({ name: 'help' })
      window.open(newHref.href, '_blank')
    },
    manage() {
      Cookies.set('platformCode', this.platformList[0].platformCode)
      this.$router.push({
        name: 'manage',
        query: { platformCode: this.platformList[0].platformCode }
      })
    },
    // 修改密码
    openModifyPasswordModal() {
      this.passwordModal = true
    },
    async logout(e) {
      const res = await userLogout({})
      console.log(res)
      if (res.code == '0') {
        // this.$utils.selSession("token");
        // this.$utils.selSession("userInfo");
        // this.delAllCookie();
        this.$store.commit('setToken', '')
        this.$store.commit('setUserInfo', {})
        Cookies.remove('brandCode')
        Cookies.remove('brandName')
        this.$router.push({
          name: 'login'
        })
      }
    }
  }
}
</script>
<style lang="less" scoped>
.homeIndex {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 20px;
    line-height: 36px;
  }
  /deep/.el-dropdown{
    color: #fff;
  }
}
.backBtn{
  cursor: pointer;
  margin-right:10px;
  line-height: 16px;
  font-size: 14px;
  color: #ffffff;
  img{
    font-size: 20px;
    display: inline-block;
    width: 16px;
  }
}
.memuenter{
  border-radius: 50%;
  width: 8rem;
  height: 8rem;
  font-size: 25px;
  text-align:centerl;
  color: #01337A;
  background-color:#d8dce2;
  margin-top: 50px;
  box-shadow: 0 2px 4px #a1a4a8, 0 0 10px rgba(0, 0, 0, .04)
}
.neo-header{
        padding-left: 29px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        border-bottom: 1px solid #EBEBEB;
        background-color:#01337A;
        &-right{
            text-align: right;
            display: flex;
            align-items: center;
        }
        .ling{
            position: relative;
            margin-right: 30px;
            i{
                font-size: 30px;
                color: getColor(primary);
            }
            em{
                position: absolute;
                top: 4px;
                right: 4px;
                display: inline-block;
                width: 6px;
                height: 6px;
                border-radius: 3px;
                background: getColor(danger);
            }
        }
        .user-txt{
            i{
                margin-left: 13px;
            }
        }
        .export-icon i{
            font-size: 24px;
            margin-right: 30px;
            color: getColor(primary);
            padding: 4px;
            border-radius: 50%;
            &.active {
                background-color: rgba(255, 125, 0, 0.16);
            }
        }
    }
</style>
<style lang="less" scoped>
.homePage-container {
  /deep/.el-col {
    text-align: center;
    /deep/.el-card {
      height: 230px;
      margin: 20px;
      background-color: #073c732b;
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
/deep/.el-carousel__item h3 {
  color: #475669;
  font-size: 14px;
  opacity: 0.75;
  line-height: 200px;
  margin: 0;
}

/deep/.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

/deep/.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}
</style>
