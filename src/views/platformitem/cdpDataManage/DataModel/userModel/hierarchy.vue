<template>
  <div class="security-contain">
    <el-row class="security-every">
      <el-col :span="12">
        <el-card shadow="always" class="security-type">
          <ol>
            <li>分层</li>
            <li>
              <span>生命周期模型</span>
              <span
                >用户生命周期是为了定位每个用户在哪个阶段，对于某个阶段的用户进行不同的营销策略。比如初期用户：还没有养成使用习惯，需要外在力量进行推动养成习惯。</span
              >
            </li>
          </ol>
           <router-link :to="{path:'securitySetting/information'}">设置</router-link>
        </el-card>
      </el-col>
    <el-col :span="12">
        <el-card shadow="always" class="security-type">
          <ol>
            <li>分层</li>
            <li>
              <span>活跃度模型</span>
              <span>RFE模型基于用户的普通行为（非转化或交易行为）产生，它跟RFM类似都是使用三个维度做价值评估。 RFE 模型是根据会员最近一次访问时间R（ Recency）、访问频率 F（Frequency）和页面互动度 E（Engagements）计算得出的RFE得分。</span
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
