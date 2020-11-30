<template>
  <!-- <div class="dashboard-container">
    <div class="dashboard-text">
      <h1>你好，{{ user_info.userName }}</h1>
      <p>欢迎进入 管理平台 </p>
    </div>
  </div>-->
  <div class="dashboard-container">
    <header>
      <div class="head-info">
        <div class="stripe" />
        <div class="introData">
          <el-row>
            <el-col :span="19">
              <div class="label-title">
                <i class="linev-tip" /><span class="label-desc"
                  >营销活动报告</span
                >
              </div></el-col
            >
            <el-col :span="5" style="text-align: right">
              <el-button type="primary" @click="$router.back()"
                >返回列表</el-button
              >
            </el-col>
          </el-row>
        </div>
      </div>
    </header>
    <div style="margin: 0; height: 100%" class="iframe">
      <iframe
        id="reportFrame"
        frameborder="no"
        border="0"
        marginwidth="0"
        marginheight="0"
        allowtransparency="yes"
        src="https://bi.aliyuncs.com/token3rd/dashboard/view/pc.htm?pageId=71f55762-23c5-4daa-a94a-f29e50a57657&accessToken=78b56b1b6c012094f51e98ba79cff359"
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
<style lang="less" scoped>
/deep/ .el-drawer__body {
  overflow: auto;
}
/deep/ .el-drawer__header {
  margin-bottom: 0;
}
.pdfTitle {
  position: relative;
  padding-top: 15px;
  padding-bottom: 15px;
  padding-left: 10px;
  font-size: 20px;
  &:before {
    content: "";
    position: absolute;
    top: 21px;
    left: 0;
    width: 2px;
    height: 12px;
    background-color: #3c5175;
  }
}
.pdfContain {
  background: white;
  padding: 15px;
  width: 100%;
  position: fixed;
  left: 3000px;
  .row {
    position: relative;
  }
}
.marketing-report {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 100%;
  height: 100%;
  background: #f6f6f6;
}
.report-contain {
  & > header,
  & > main {
    background: white;
    padding: 20px;
    margin-bottom: 15px;
  }
  & > header {
    .head-info {
      color: #666666;
      background: #f9f9f9;
      .stripe {
        width: 100%;
        height: 10px;
        background: linear-gradient(
          -45deg,
          rgba(67, 90, 130) 0,
          rgba(67, 90, 130) 14%,
          transparent 14%,
          transparent 50%,
          rgba(67, 90, 130) 50%,
          rgba(67, 90, 130) 64%,
          transparent 64%,
          transparent
        );
        background-size: 40px 40px;
        background-color: #e6e9ed;
      }
      .introData {
        padding: 15px;
        /deep/ .el-row {
          line-height: 40px;
          &:not(:nth-of-type(1)) {
            padding-left: 30px;
          }
        }
      }
    }
  }
  & > main {
    .search {
      padding: 15px;
      background: #f9f9f9;
      margin-bottom: 30px;
    }
    .grid {
      padding-bottom: 20px;
      margin-bottom: 20px;
      display: grid;
      grid-template-columns: repeat(5, 20%);
      border-bottom: solid 1px #e5e7ef;
      .item {
        display: flex;
        margin-bottom: 20px;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        width: 150px;
        height: 60px;
        color: #57a7ed;
        font-weight: 500;
        color: #61acee;
        background-color: #eef6fd;
        box-sizing: border-box;
        border: 1px dashed #61acee;
        p {
          font-weight: bold;
          margin-bottom: 10px;
        }
      }
    }
    /deep/ .el-tabs {
      /deep/ .el-tabs__item {
        font-size: 13px;
        padding: 0;
        padding: 0 15px;
        height: 28px;
        line-height: 28px;
        // width: 120px;
        color: #435a82;
        text-align: center;
      }
      /deep/ .is-active {
        background: #435a82;
        color: white;
      }
      /deep/ .el-tabs__active-bar {
        background: transparent;
      }
    }
  }
}
/deep/ .el-tabs__content {
  // height: 400px;
  padding: 25px;
}
.label-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 16px;
  position: relative;
  line-height: 16px;
  padding-left: 10px;
  margin-bottom: 20px;
  .linev-tip {
    display: inline-block;
    width: 4px;
    height: 16px;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    position: absolute;
    background: #435a82;
  }
}
.search-more {
  border: 1px solid rgba(67, 90, 130, 1);
  background: none;
  color: #435a82;
  &:hover {
    color: #ffffff;
    background-color: #435a82;
    border-color: #435a82;
  }
}
.card {
  padding: 20px;
  border: solid 1px rgb(228, 228, 228, 1);
}
.Cycle-card {
  padding: 0 20px 20px;
  border: solid 1px rgb(228, 228, 228, 1);
  margin-bottom: 10px;
  .nav {
    margin-top: 20px;
    margin-bottom: 0;
  }
  .title {
    color: #666666;
    margin-top: 20px;
    // line-height: 60px;
  }
  .oneNode {
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: auto;
  }
  .twoNode {
    display: grid;
    grid-column-gap: 20px;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: auto;
  }
  .threeNode {
    display: grid;
    grid-column-gap: 20px;
    grid-template-columns: 1fr 1fr 1fr;
    grid-template-rows: auto;
  }
  .unevenNode-left {
    display: grid;
    grid-column-gap: 20px;
    grid-template-columns: 1fr 2fr;
    grid-template-rows: auto;
  }
  .unevenNode-right {
    display: grid;
    grid-column-gap: 20px;
    grid-template-columns: 2fr 1fr;
    grid-template-rows: auto;
  }
}
.nav {
  color: #888888;
  margin-bottom: 10px;
  .row {
    display: flex;
    > p:nth-of-type(1) {
      margin-right: 100px;
    }
  }
  p {
    line-height: 26px;
    font-size: 16px;
  }
}
.third-contain,
.two-contain {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  .contain {
    margin-bottom: 20px;
  }
}
.two-contain > .card {
  width: 49%;
  margin-bottom: 15px;
}
</style>
