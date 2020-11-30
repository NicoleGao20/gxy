<template>
  <el-table
    :data="tableData"
    stripe
    :span-method="arraySpanMethod"
    border
    style="width: 100%"
  >
    <el-table-column :resizable="false" label="评论内容" width="500">
      <template slot-scope="scope">
        <div>
          <div class="orderDetail">
            <el-col :span="5"> 订单编号：{{ scope.row.order_no }} </el-col>
            <el-col :span="3"> 来源：{{ scope.row.platform_name }} </el-col>

            <el-col :span="5"> 付款时间：{{ scope.row.pay_time }} </el-col>
          </div>
          <el-table
            :data="[{}]"
            :show-header="false"
            border
            style="width: 100%"
          >
            <el-table-column label="评论内容" width="490">
              <template slot-scope="data">
                <el-col :span="20">
                  <p>商品评价：{{ scope.row.evaluation_type }}</p>
                  <div>
                    <p>{{ scope.row.content }}</p>
                    <p>【{{ scope.row.evaluate_time }}】</p>
                    <img v-for="(item,i) in scope.row.content_pic_url" :src="item" :key="(i+1)*1.1" style="width:50px;height:50px">
                    <i
                      v-for="(item,i) in scope.row.content_vpic_url"
                      :key="i"
                      :style="{backgroundImage:'url(' + item + ')'}"
                      class="el-icon-video-play videoView"
                      @click="showVideo(scope.row.content_video_url[i])"/>
                  </div>
                </el-col>
                <el-col :span="4">
                  <p style="position:absolute;bottom:20px;right:20px;cursor:pointer" @click="showTotalEvaluate(scope.row)">查看全部</p>
                </el-col>
              </template>
            </el-table-column>
            <el-table-column label="评论人" width="200">
              <template slot-scope="data">
                <p>姓名：{{ scope.row.receiver_name }}</p>
                <p>昵称：{{ scope.row.buyer_nick }}</p>
                <p>电话：{{ scope.row.receiver_mobile }}</p>
              </template>
            </el-table-column>
            <el-table-column label="商品信息">
              <template slot-scope="data">
                <el-col :span="6">
                  <img :src="scope.row.product_url" style="width:100px;height:100px">
                </el-col>
                <el-col :span="15">
                  <p>{{ scope.row.product_name }}</p>
                  <p>商家编码：{{ scope.row.product_code }}</p>
                  <p>实付：{{ scope.row.amt_payment }}</p>
                </el-col>
              </template>
            </el-table-column>
            <el-table-column label="状态操作" width="173">
              <template slot-scope="data">
                <span class="pointer">解释</span> |
                <span class="pointer">发短信</span>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </template>
    </el-table-column>
    <el-table-column :resizable="false" label="评论人" width="200"/>
    <el-table-column :resizable="false" label="商品信息" width="437"/>
    <el-table-column :resizable="false" label="状态&操作"/>
  </el-table>
</template>

<script>
export default {
  props: {
    tableData: {
      type: Array,
      default: []
    }
  },
  methods: {
    arraySpanMethod() {
      return [1, 4]
    },
    showTotalEvaluate(data) {
      this.$emit('seeEvaluate', data)
    },
    showVideo(data) {
      this.$emit('playVideo', data)
    }
  }
}
</script>

<style lang="scss" scoped>
.message {
  cursor: pointer;
}
.orderDetail {
  padding: 10px 0;
  overflow: hidden;
}
.pointer{
  cursor: pointer;
  color: #2395f1;
}
.videoView{
  width: 50px;
  height: 50px;
  cursor: pointer;
  background-size: 50px 50px;
  background-repeat:no-repeat;
  vertical-align: top;
  font-size: 30px;
  line-height: 50px;
  text-align: center;
}
</style>
