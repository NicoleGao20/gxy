<template>
  <el-dropdown trigger="click" class="lang-dropdown" @command="handleSetLanguage">
    <div>
      <i :class="'iconfont ' + 'icon-language' " />
    </div>
    <el-dropdown-menu slot="dropdown" class="lang-dropdown-menu">
      <el-dropdown-item :class="{'active': language === 'zh'}" command="zh">🇨🇳 中文</el-dropdown-item>
      <el-dropdown-item :class="{'active': language === 'en'}" command="en">🇬🇧 English</el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
import { getToken } from '@/utils/auth'
export default {
  computed: {
    language() {
      return this.$store.getters.language
    }
  },
  mounted() {
    const lang = getToken('language')
    this.$store.dispatch('SetLanguage', lang || 'zh')
  },
  methods: {
    handleSetLanguage(lang) {
      this.$i18n.locale = lang
      this.$store.dispatch('SetLanguage', lang)
      this.$message({
        message: this.$t('navbar.setlanguageSuccess'),
        type: 'success'
      })
    }
  }
}
</script>
<style lang="less" scoped>
.lang-dropdown i {
  font-size: 20px;
}
/deep/.lang-dropdown-menu /deep/ .el-dropdown-menu {
  margin-top: -3px;
}
/deep/ .active {
  background-color: #ecf5ff;
  color: #66b1ff;
}
</style>
