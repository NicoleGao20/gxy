<template>
  <div class="page-container-gap">
    <header style="padding: 10px">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="微信粉丝" name="wechatFanList">
          <wechatFanList v-if="activeName === 'wechatFanList'"/>
        </el-tab-pane>
        <el-tab-pane label="微博粉丝" name="weiboFanList">
          <weiboFanList v-if="activeName === 'weiboFanList'"/>
        </el-tab-pane>
        <el-tab-pane label="抖音粉丝" name="douyinFanList">
          <douyinFanList v-if="activeName === 'douyinFanList'"/>
        </el-tab-pane>
      </el-tabs>
    </header>
  </div>
</template>
<script>
import wechatFanList from './wechat/index'
import weiboFanList from './weiboFanList'
import douyinFanList from './douyinFanList'
export default {
  name: 'FansMange',
  components: { wechatFanList, weiboFanList, douyinFanList },
  data() {
    return {
      activeName: 'wechatFanList'
    }
  },
  created() {
    if (this.$route.query && this.$route.query.activeName) {
      this.activeName = this.$route.query.activeName
    }
  },
  beforeRouteEnter(to, from, next) {
    if (!to.query.activeName) {
      next({ path: to.path, query: { activeName: 'wechatFanList', tabName: 'fan' }})
    } else {
      next()
    }
  },
  methods: {
    handleClick(tab, event) {
      this.activeName = tab.name
      this.$router.push({ path: this.$route.path, query: { activeName: this.activeName }})
    }
  }
}
</script>

<style lang="less">
.crmArchivesList {
  padding: 0 15px;
  header,
  main {
    width: 100%;
    height: auto;
    box-sizing: border-box;
    display: block;
    background: #ffffff;
    .scopeStyle {
      cursor: pointer;
    }
  }
  header {
    margin: 15px 0;
    overflow: hidden;
  }
  main {
    padding: 10px 25px;
  }

  /deep/ .el-form-item__label {
    color: #666666;
    font-size: 14px;
    font-weight: normal;
    white-space: nowrap;
  }
  /deep/ .el-input {
    width: 80%;
  }
  /deep/ .el-date-editor--daterange {
    width: 80%;
  }
  /deep/ .el-textarea {
    width: 91.5%;
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
  .search-collapse {
    border: none;
    background: none;
    color: #435a82;
    .el-icon-d-arrow-right {
      font-size: 14px;
      position: relative;
      left: 4px;
      transform: rotate(-90deg);
    }
  }
  .el-table__row,
  .has-gutter {
    td {
      &:not(:nth-of-type(2)):not(:nth-of-type(3)):not(:nth-last-of-type(1)) {
        > div {
          text-align: center;
        }
      }
    }
    th {
      &:not(:nth-last-of-type(2)) {
        > div {
          text-align: center;
        }
      }
    }
  }
}
.linkArea {
  width: 100%;
  display: flex;
  justify-content: center;
  border: 1px solid rgba(236, 238, 242, 1);
  margin-top: 15px;
  cursor: pointer;
  box-sizing: border-box;
  &:nth-of-type(1) {
    margin-top: 0px;
  }
  > a {
    width: 60%;
  }
  &:hover {
    border: 1px solid rgba(123, 139, 167, 1);
  }
}
.grid-content {
  display: flex;
  align-items: center;
  .icon {
    width: 140px;
    box-sizing: border-box;
    text-align: center;
    img {
      width: 100px;
    }
  }
  .info {
    flex: 1;
    position: relative;
    &::before {
      position: absolute;
      content: "";
      left: -20px;
      top: 25%;
      height: 50%;
      width: 1px;
      transform: scaleY(0.5);
      background: rgba(123, 139, 167, 1);
    }
    > p {
      font-size: 18px;
      color: #000000;
      line-height: 1.8;
    }
    > span {
      font-size: 14px;
      line-height: 1.8;
      color: #666666;
    }
  }
}
.error-info {
  .error-tip {
    display: flex;
    i {
      margin-right: 15px;
      font-size: 25px;
      color: #cf614f;
    }
    .tip {
      p {
        color: #435a82;
        font-weight: 500;
        line-height: 1.6;
      }
      span {
        color: #888888;
        line-height: 1.6;
      }
    }
  }
  .error-content {
    margin: 10px 0;
    .scroll {
      max-height: 40px;
      font-size: 14px;
      line-height: 1.6;
      overflow: auto;
      padding: 10px;
      background: #f9fafb;
    }
    /deep/ .el-checkbox {
      margin-top: 15px;
      display: block;
    }
    /deep/ .el-checkbox__label {
      vertical-align: top;
      display: inline-block;
      white-space: normal;
      word-break: break-all;
    }
  }
}
</style>
