<template>
    <el-table
    :data="tableData"
    stripe
    border
    style="width: 100%">
    <el-table-column
      prop="transition_time"
      label="获取时间"
      :resizable="false"
      width="90">
    </el-table-column>
    <el-table-column
      prop="mobile_bind"
      label="手机号"
      :resizable="false"
      width="100">
    </el-table-column>
    <el-table-column
      prop="modify_type"
      label="积分修改类型"
      :resizable="false">
      <template slot-scope="scope">
        {{scope.row.modify_type === 1 ? '清零' : '调整' }}
      </template>
    </el-table-column>
    <el-table-column
      label="积分增减"
      :resizable="false">
      <template slot-scope="scope">
        {{scope.row.adjust_type ? scope.row.adjust_type === 1 ? '增加' : '减少' : '' }}
      </template>
    </el-table-column>
    <el-table-column
      label="积分值"
      :resizable="false">
      <template slot-scope="scope">
        {{scope.row.adjust_type === 1 ? '+' + scope.row.cnt_point : scope.row.cnt_point  }}
      </template>
    </el-table-column>
    <el-table-column
      prop="qty_point"
      label="总积分"
      :resizable="false">
    </el-table-column>
    <el-table-column
      prop="qty_point_order"
      label="交易总积分"
      :resizable="false">
    </el-table-column>
    <el-table-column
      prop="qty_point_intc"
      label="互动总积分"
      :resizable="false">
    </el-table-column>
    <el-table-column
      prop="point_type"
      label="积分类型"
      :resizable="false">
      <template slot-scope="scope">
        {{scope.row.point_type === 3 ? '交易积分、互动积分' : scope.row.point_type === 1 ? '交易积分' : '互动积分' }}
      </template>
    </el-table-column>
    <el-table-column
      prop="point_source_type"
      label="来源方式"
      :resizable="false">
    </el-table-column>
    <el-table-column
      prop="original_order_no"
      label="来源订单(订单编号)"
      :resizable="false"
      width="150">
    </el-table-column>
    <el-table-column
      prop="platform_name"
      label="渠道"
      :resizable="false"
      width="60">
    </el-table-column>
    <el-table-column
      prop="remark"
      label="备注"
      :resizable="false">
    </el-table-column>
  </el-table>
</template>

<script>
export default {
    props:{
        tableData:{
            type:Array,
            default:[]
        }
    }
}
</script>