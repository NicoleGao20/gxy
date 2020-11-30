<template>
  <div class="security-contain">
    <el-row class="security-every">
      <el-col :span="12">
        <el-card shadow="always" class="security-type">
          <ol>
            <li>预测</li>
            <li>
              <span>商品推荐模型</span>
              <span
                >基于用户（User-Based）的协同过滤算法首先要根据用户历史行为信息，寻找与新用户相似的其他用户；同时，根据这些相似用户对其他项的评价信息预测当前新用户可能喜欢的项。给定用户评分数据矩阵R，基于用户的协同过滤算法需要定义相似度函数s:U×U→R，以计算用户之间的相似度，然后根据评分数据和相似矩阵计算推荐结果。</span
              >
            </li>
          </ol>
           <router-link :to="{path:'securitySetting/information'}">设置</router-link>
        </el-card>
      </el-col>
    <el-col :span="12">
        <el-card shadow="always" class="security-type">
          <ol>
            <li>预测</li>
            <li>
              <span>复购周期模型</span>
              <span
                >确定重复购买用户周期。通过瞄准这些潜力忠诚的客户，可以降低促销成本，提高投资回报率（ROI）。</span
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
            <li>预测</li>
            <li>
              <span>用户流失模型</span>
              <span
                >精准预测用户流失，通过有效的运营活动对流失概率较大的用户进行挽留，让用户流失率尽可能地低于用户增长率，这样就能保证用户量的向上增长。</span
              >
            </li>
          </ol>
         <router-link :to="{path:'securitySetting/operation'}">设置</router-link>
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
