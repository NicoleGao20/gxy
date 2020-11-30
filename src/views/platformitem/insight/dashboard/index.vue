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
        allowtransparency="yes"
        src="https://bi.aliyuncs.com/token3rd/dashboard/view/pc.htm?pageId=7fd5c02c-2158-4c97-b390-ff21fbb093ae&accessToken=ddd6685833589988e4a628cb1d95d549"
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