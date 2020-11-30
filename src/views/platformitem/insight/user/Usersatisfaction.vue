<template>
  <!-- <div class="dashboard-container">
    <div class="dashboard-text">
      <h1>你好，{{ user_info.userName }}</h1>
      <p>欢迎进入 管理平台 </p>
    </div>
  </div>-->
  <div class="dashboard-container">
    <div style="margin: 0;height:100%;" class="iframe">
      <iframe
        id="reportFrame"
        frameborder="no"
        border="0"
        marginwidth="0"
        marginheight="0"
        scrolling="no"
        allowtransparency="yes"
        src="https://bi.aliyuncs.com/token3rd/dashboard/view/pc.htm?pageId=9f2790e6-05e7-48e9-8888-5a201bf0276e&accessToken=22b4fbf6432a4f5bddf315c0359e632c"
        width="100%"
        height="100%"
      ></iframe>
    </div>
  </div>
</template>

<style lang="less" scoped>
.dashboard {
  &-container {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    // margin: 30px;
  }
  &-text {
    font-size: 20px;
    line-height: 36px;
  }
  .iframe {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
  }
}
</style>