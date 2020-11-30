<template>
  <div class="neo-index-index">
    <el-container style="height:100%" >
      <!-- <el-container style="height:100%"> -->
      <el-aside width="200px" class="pannel-left bg-color-primary">
        <div class="aside-top">
          <router-link to="/" class="logo">
            <img src="/static/logo.png" style="width:40px;margin-left:10px;">
            <span class="system-name">{{ platFormCode | platFormFilter }}</span>
          </router-link>
        </div>
        <div class="aside-center mb-10"/>
        <el-scrollbar class="aside-nav">
          <el-menu
            :default-openeds="menuOpenIndex"
            :default-active="curIndex"
            :unique-opened="true"
            @select="handleSelect"
          >
            <div v-for="(pItem, pIndex) in left_navs" :key="pIndex">
              <el-menu-item
                v-if="!pItem.functionList || pItem.functionList.length == 0"
                :index="pItem.name"
              >
                <!-- <i :class="['fs-20 mr-20', pItem.showIcon]"></i> -->
                <img :src="pItem.showIcon" class="iconImg" alt="">
                <span slot="title">{{ pItem.showName }}</span>
              </el-menu-item>
              <el-submenu v-else :index="pItem.uri">
                <template slot="title">
                  <!-- <i :class="['fs-20 mr-20', pItem.showIcon]"></i> -->
                  <img :src="pItem.showIcon" class="iconImg" alt="">
                  <span>{{ pItem.showName }}</span>
                </template>
                <el-menu-item-group>
                  <el-menu-item
                    v-for="(cItem, cIndex) in pItem.functionList"
                    :index="cItem.uri"
                    :key="cIndex"
                  >
                    <span class="ml-15">{{ cItem.showName }}</span>
                  </el-menu-item>
                </el-menu-item-group>
              </el-submenu>
            </div>
          </el-menu>
        </el-scrollbar>
      </el-aside>
      <el-container>
        <el-header class="neo-header">
          <span class="color-text-regular">{{ platFormCode | platFormFilter }}</span>
          <div class="neo-header-right">
            <el-select v-if="isShowBrand" v-model="brand_code" @change="handleBrandChange">
              <el-option
                v-for="item in brandList"
                :key="item.id"
                :label="item.brandName"
                :value="item.brandCode"
              />
            </el-select>
            <div class="backBtn" @click="into">
              <img src="@/assets/img/header/home.png" alt="">
              首页
            </div>
            <router-link :to="{name:'dataDownload'}">
              <div class="backBtn" @click="into">
                <img src="@/assets/img/header/download.png" alt="下载中心">
                下载中心
              </div>
            </router-link>
            <div class="backBtn" @click="help()">
            <img src="@/assets/img/header/help.png" alt="使用指南">
            使用指南
          </div>
            <el-dropdown>
              <div class="user-txt color-text-primary">
                你好，{{ user_info.name }}
              </div>
              <el-dropdown-menu slot="dropdown" class="width120 text-center">
                <el-dropdown-item @click.native="openModifyPasswordModal">
                  修改密码
                </el-dropdown-item>
                <el-dropdown-item @click.native="logout">
                  退出登录
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </el-header>
        <el-main v-if="show" class="neo-main">
          <keep-alive :max="2">
            <router-view v-if="$route.meta.keepAlive" :key="this.$route.fullPath"/>
          </keep-alive>
          <router-view v-if="!$route.meta.keepAlive" :key="this.$route.fullPath"/>
        </el-main>

        <el-footer height="12px" style="text-align:right">
          {{ $store.getters.getConfig.versionInfo }}
        </el-footer>
      </el-container>
    </el-container>
    <!-- 修改密码 -->
    <modify-password v-if="passwordModal" :info="user_info" :password-modal.sync="passwordModal"/>
  </div>
</template>

<script src="./index.js">

</script>

<style lang="scss" scoped>
@import "./index.scss";
</style>

<style lang="scss" scoped>
.pannel-left {
  overflow: hidden;
}
.logo {
  display: flex;
  // justify-content: center;
  align-items: center;
  padding: 5px 0 5px 3px;
  color: #ddd;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  &:hover {
    color: #fff;
  }

  .system-name {
    font-size: 20px;
    display: block;
    flex: 1;
    text-align: center;
    font-weight: 700;
    letter-spacing: 2px;
  }
}
/deep/.el-menu-item-group__title {
  display: none;
}
.width120 {
  width: 120px;
}
/deep/.aside-nav .el-submenu__title {
  height: 46px;
  line-height: 46px;
  font-size: 13px;
  color: white;
  i {
    // color: getColor(white);
    color: white;
  }
  &:hover {
    // color: getColor(white);
    color: white;
    i {
      // color: getColor(white);
      color: white;
    }
  }
}
/deep/.el-drawer {
  outline: none;
}
// .neo-index-index /deep/.el-drawer__wrapper {
//   top: 60px;
// }
.neo-index-index .aside-nav .iconImg {
  display: inline-block;
  width: 20px;
  height: 20px;
  margin-right:20px ;
}
.aside-nav /deep/.el-scrollbar__thumb {
  background-color: rgba(64, 64, 65, 0.5);
}
.aside-nav /deep/.el-scrollbar__wrap {
  overflow-x: hidden;
}

/deep/.aside-nav.el-scrollbar >  .el-scrollbar__bar {
  opacity: 1;
}
.backBtn{
  cursor: pointer;
  margin-right:10px;
  line-height: 16px;
  font-size: 14px;
  color:#606266;
  img{
    font-size: 24px;
    display: inline-block;
    width: 16px;
  }
}
</style>
