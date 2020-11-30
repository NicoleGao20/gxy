<template>
  <el-table
    :data="tableData"
    stripe
    :span-method="arraySpanMethod"
    border
    style="width: 100%"
  >
    <el-table-column label="订单商品" width="700" :resizable="false">
      <template slot-scope="scope">
        <div>
          <div class="orderDetail">
            <el-col :span="5"> 订单编号：{{ scope.row.order_no }} </el-col>
            <el-col :span="3"> 来源：{{ scope.row.platform_name }} </el-col>
            <el-col :span="3">
              <el-tooltip
                effect="dark"
                content="发送短信"
                placement="bottom-start"
              >
                <i class="el-icon-chat-dot-square message"></i>
              </el-tooltip>
              <el-tooltip effect="dark" placement="bottom-start">
                <div slot="content">
                  地址信息<br />
                  姓名：{{ scope.row.receiver_name }}<br />
                  手机：{{ scope.row.receiver_mobile }}<br />
                  城市：{{ scope.row.province_name + scope.row.city_name
                  }}<br />
                  区：{{ scope.row.county_name }}<br />
                  地址：{{ scope.row.receiver_address }}<br />
                  邮编：{{ scope.row.county_code }}
                </div>
                <i class="el-icon-location"></i>
              </el-tooltip>
            </el-col>
            <el-col :span="5"> 下单时间：{{ scope.row.order_time }} </el-col>
            <el-col :span="5"> 付款时间：{{ scope.row.pay_time }} </el-col>
          </div>
          <el-table
            :data="packingItemList(scope.row.order_item)"
            border
            style="width: 100%"
            :span-method="objectSpanMethod"
            :show-header="false"
          >
            <el-table-column label="订单商品" width="690">
              <template slot-scope="data">
                <el-col :span="4">
                  <img :src="data.row.product_url" style="width: 100px; height: 100px" />
                </el-col>
                <el-col :span="20" style="height: 100%">
                  <p>{{ data.row.product_title }}</p>
                  <p>商家编码：{{data.row.product_code}}</p>
                </el-col>
              </template>
            </el-table-column>
            <el-table-column prop="price" label="单价"> </el-table-column>
            <el-table-column prop="qty" label="数量"> </el-table-column>
            <el-table-column label="实付款">
              <template slot-scope="data">
                ￥{{ scope.row.amt_payment }}
              </template>
            </el-table-column>
          </el-table>
        </div>
      </template>
    </el-table-column>
    <el-table-column label="单价（元）" :resizable="false" prop="order_status"> </el-table-column>
    <el-table-column label="数量" :resizable="false"> </el-table-column>
    <el-table-column label="实付款" :resizable="false"> </el-table-column>
    <el-table-column label="状态" :resizable="false"> </el-table-column>
  </el-table>
</template>

<script>
export default {
  props: {
    tableData: {
      type: Array,
      default: [],
    },
  },
  methods: {
    arraySpanMethod() {
      return [1, 4];
    },
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 3) {
        if (rowIndex === 0) {
          return {
            rowspan: row.count,
            colspan: 1,
          };
        } else {
          return {
            rowspan: 0,
            colspan: 0,
          };
        }
      }
    },
    packingItemList(list) {
      if(list) {return list.map((item) => {
          return {
            ...item,
            count: list.length,
          };
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.message {
  cursor: pointer;
}
.orderDetail {
  padding: 10px 0;
  overflow: hidden;
}
</style>