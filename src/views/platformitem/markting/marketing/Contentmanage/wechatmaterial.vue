<template>
  <el-container class="material-manage-container">
    <el-main class="material-manage">
      <el-tabs v-model="activeName" type="card" tab-position="top" @tab-click="handleTabClick">
        <el-tab-pane label="微信图文素材" name="wgm">
          <wechat-gra-materials v-if="activeName === 'wgm'"/>
        </el-tab-pane>
        <el-tab-pane label="微信模板消息" name="bOrder">
          <material-wechat-template v-if="activeName === 'bOrder'"/>
        </el-tab-pane>
      </el-tabs>
    </el-main>
  </el-container>
</template>

<script>
import wechatGraMaterials from '@/views/platformitem/markting/marketing/Contentmanage/wechatMaterial/wechatGraMaterials'
import materialWechatTemplate from '@/views/platformitem/markting/marketing/Contentmanage/wechatMaterial/materialWechatTemplate'

export default {
  name: 'Wechatmaterial',
  components: { wechatGraMaterials, materialWechatTemplate },
  data() {
    return {
      activeName: 'wgm'
    }
  },
  created() {
    if (this.$route.query && this.$route.query.activeName) {
      this.activeName = this.$route.query.activeName
    }
  },
  beforeRouteEnter(to, from, next) {
    if (!to.query.activeName) {
      next({ path: to.path, query: { activeName: 'wgm' }})
    } else {
      next()
    }
  },
  methods: {
    handleTabClick(tab) {
      this.activeName = tab.name
      this.$router.push({
        path: this.$route.path,
        query: { activeName: this.activeName }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.material-manage-container {
  padding: 20px;
  width: 100%;
  min-height: 100%;
  /deep/ .el-tabs--card > .el-tabs__header {
    border-bottom: transparent !important;
  }
  /deep/ .el-tabs__item {
    background-color: #f4f7fa;
    border-bottom: 1px solid #E4E7ED;
    &.is-active {
      background-color: #fff;
    }
  }
  .material-manage {
    max-width: 100%;
    min-height: 100%;
    background-color: #fff;
  }
}
</style>
