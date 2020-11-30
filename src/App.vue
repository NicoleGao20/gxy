<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
import { getWebsiteInfo } from '@/api/config'
import { getToken, setToken } from '@/utils/auth'
export default {
  name: 'App',
  mounted() {
    // console.log(window)
    // 检测浏览器路由改变页面不刷新问题,hash模式的工作原理是hashchange事件
    window.addEventListener('hashchange', () => {
      const currentPath = window.location.hash.slice(1)
      if (this.$route.path !== currentPath) {
        this.$router.push(currentPath)
      }
    }, false)
    this.getConfig()

    // console.log(window._hmt, 9999)
  },
  methods: {
    getConfig() {
      getWebsiteInfo().then(res => {
        this.$store.commit('set_config', res.body)
        // icon
        let $favicon = document.querySelector('link[rel="icon"]')
        console.log( $favicon,'; $favicon')
        if ($favicon !== null) {
          $favicon.href = res.body.addressIcon
        } else {
          $favicon = document.createElement('link')
          $favicon.rel = 'icon'
          $favicon.href = res.body.addressIcon
          document.head.appendChild($favicon)
        }
        // title
        if (res.body.websiteName) {
          document.title = res.body.websiteName
        }
        // meta
        if (res.body.websiteKeyWord) {
          let keywords = document.querySelector('meta[name="keywords"]')
          keywords.content = res.body.websiteKeyWord
        }
        if (res.body.websiteDesc) {
          let description = document.querySelector('meta[name="description"]')
          description.content = res.body.websiteDesc
        }
      })
    },
    changeLanguage() {
      if (!getToken('language')) {
        setToken('language', 'zh')
      }
    }
  }
}
</script>
<style type="text/css">
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    list-style-type: none;
    text-decoration: none;
    outline: none;
  }
  html {
    min-width:  1280px;
    overflow: auto;
  }
</style>
