<template>
  <div class="security-contain">
    <el-row class="security-every">
      <el-col :span="8" v-for="item in list" :key="item.id">
        <el-card shadow="always" class="security-type">
          <div class="container-item">
            <div class="img-container">
              <img :src="item.imgage" alt="" />
            </div>
            <h3>{{ item.title }}</h3>
            <p>{{ item.detail }}</p>
            <router-link :to="{ path: `${item.url}` }" class="link-router">
              <span>设置</span>
            </router-link>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>
<script>
export default {
  name: "Config",
  data() {
    return {
      list: [
        {
          title: "登录策略",
          detail: "可以对登录及账号做进行相关安全验证",
          imgage: require("./img/login.png"),
          id: "0",
          url: "securitySetting/information",
        },
        {
          title: "敏感操作",
          detail: "敏感操作：你可以对数据下载做相对应的设置",
          imgage: require("./img/operation.png"),
          id: "1",
          url: "securitySetting/operation",
        },
        {
          title: "访问控制",
          detail:
            "启动后只有添加可访问IP才可以登录系统",
          imgage: require("./img/access.png"),
          id: "2",
          url: "securitySetting/visit",
        },
      ],
    };
  },
  methods: {},
  mounted(){},
};
</script>
<style lang="less" scoped>
.security-contain {
  .security-every {
    display: flex;
    justify-content: space-between;
    .el-col {
      width: 30%;
    }
    .security-type {
      /deep/ .el-card__body {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 20px 30px;
        ol {
          display: flex;
          justify-content: space-between;
          align-items: center;
          li:first-of-type {
            width: 60px;
            height: 60px;
            border-radius: 100%;
            background: #cccccc;
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 15px;
          }
          li:last-of-type {
            display: flex;
            flex-direction: column;
            flex: 1;
            padding-left: 15px;
            span:first-of-type {
              font-size: 16px;
              display: inline-block;
              margin-bottom: 10px;
              color: #606266;
            }
            span:last-of-type {
              font-size: 12px;
              color: #999999;
            }
          }
        }
      }
      .container-item {
        width: 100%;
        text-align: center;
        .img-container {
          margin-top: 40px;
          margin-bottom: 20px;
          img {
            width: 68px;
            height: 68px;
          }
        }
        h3 {
          height: 16px;
          margin-bottom: 20px;
        }
        p {
          font-size: 13px;
          color: #909399;
          margin-bottom: 26px;
        }
        .link-router {
          display: block;
          height: 30px;
          line-height: 30px;
          width: 100%;
          background: #005baa;
          border-radius: 4px;
          text-align: center;
          margin-bottom: 40px;
          color: #fff;
        }
      }
    }
    /deep/ .el-card__body{
      padding:0 !important;
    }
  }
}
</style>
