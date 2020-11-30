<template>
  <div class="login-container">
    <!-- <h3 class="title">{{ $t('login.title') }}</h3> -->
  </div>
</template>

<script>
// import Cookies from 'js-cookie'
// import { ssoServer } from '@/utils/params'

export default {
  name: 'Login',
  mounted() {
    // const token = Cookies.get('token')
    // if (!token) {
    //   location.href = `${ssoServer}/index?returnUrl=${encodeURIComponent(location.href)}`
    // }
    // console.log(token)
  }
}
</script>

<style  lang="less">
@bg:#2d3a4b;
@light_gray:#eee;

/* reset element-ui css */
.login-container {

}

</style>
