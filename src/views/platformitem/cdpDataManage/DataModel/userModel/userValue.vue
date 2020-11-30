<template>
  <div class="security-contain">
    <el-row class="security-every">
      <el-col :span="12">
        <el-card shadow="always" class="security-type">
          <ol>
            <li>价值</li>
            <li>
              <span>购买力模型</span>
              <span
                >RFM模型作为一个存在已久的用户价值模型，被广泛应用于传统、销售行业。首先解释一下RFM模型的构成：Recency、Frequency、Monetary，
基于这三个维度，我们将每个维度划分为高、中、低三种情况，并构建出完整的用户价值象限。</span
              >
            </li>
          </ol>
           <router-link :to="{path:'securitySetting/information'}">设置</router-link>
        </el-card>
      </el-col>
    <el-col :span="12">
        <el-card shadow="always" class="security-type">
          <ol>
            <li>价值</li>
            <li>
              <span>社交价值模型</span>
              <span
                >品牌与用户不仅仅是消费购物，推送产品的关系，而更多是互动与彼此认知。单个用户自带的传播属性和影响力，反而收到了越来越多的重视和运用。</span
              >
            </li>
          </ol>
         <router-link :to="{path:'securitySetting/operation'}">设置</router-link>
        </el-card>
      </el-col>
    </el-row>
    <el-row class="security-every">
      <el-col :span="12">
        <el-card shadow="always" class="security-type">
          <ol>
            <li>价值</li>
            <li>
              <span>生命周期价值模型</span>
              <span
                >专注于那些可以带来最大未来利益的客户，就可以实现更好的运营。所以企业必须识别出这些客户，CLV是对客户未来利润的有效预测</span
              >
            </li>
          </ol>
           <router-link :to="{path:'securitySetting/information'}">设置</router-link>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>
<script>
export default {
  name: "Config",
  data() {
    return {};
  },
  methods: {},
};
</script>
<style lang="less" scoped>
.security-contain {
/deep/ .security-every {
    display: flex;
    
    .security-type {
      /deep/ .el-card__body {
        display: flex;
        height: 150px;
        padding-left: 15px;
        padding-right: 20px;
        justify-content: space-between;
        align-items: center;
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
            padding-right: 20px;
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
         a {
          width:40px;
          font-size: 13px;
          color: #005baa;
          display:flex;
          margin-top: 10px;
          margin-left: 10px;
        }
      }
    }
  }
}
</style>
