<!-- 选择优惠券组件 -->
<template>
  <div class="wrapper">
    <el-dialog :visible="show" title="选择优惠券" fullscreen @close="closeDialog">
      <span slot="title" class="title">选择优惠券</span>
      <el-data-table
        :url="url"
        :search-form="searchForm"
        :columns="columns"
        :has-delete="false"
        :has-new="false"
        :has-operation="false"
        @selection-change="selected"
      />
      <span slot="footer" class="footer">
        <el-button @click="closeDialog">取 消</el-button>
        <el-button type="primary" @click="confirm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>

export default {
  name: 'SelectCoupon',
  props: {
    // 组件的显示与否
    show: {
      type: Boolean,
      required: true,
      default: false
    }
  },
  data() {
    return {
      url: 'http://10.0.30.96/mock/142/selectCoupon', // crud 接口地址
      searchForm: [
        {
          $id: 'couponType',
          $type: 'select',
          $el: {
            class: 'coupon-type'
          },
          $options: [
            {
              label: '零售优惠券',
              value: '零售优惠券'
            },
            {
              label: '运动城优惠券',
              value: '运动城优惠券'
            }
          ]
        },
        {
          $id: 'searchMode',
          $type: 'input',
          label: '规则编号：',
          $el: {
            placeholder: '请输入规则，多个请用";"隔开',
            class: 'rule-id'
          }
        }
      ],
      // full attributes of columns see: http://element.eleme.io/#/zh-CN/component/table#table-column-attributes
      columns: [
        // see http://element.eleme.io/#/zh-CN/component/table#table-column-attributes
        { type: 'selection' },
        { prop: 'couponRuleId', label: '券规则编码', width: '200px', align: 'center' },
        { prop: 'couponType', label: '类型', align: 'center' },
        { prop: 'publisher', label: '发行机构', align: 'center' },
        { prop: 'couponName', label: '优惠券名称', width: '600px', align: 'center' },
        { prop: 'discount', label: '面额/折扣', align: 'center' }
      ],
      sels: [] // 选中的优惠券
    }
  },
  methods: {
    // 选中优惠券
    selected(val) {
      this.sels = val
    },
    confirm() {
      // 业务操作
      // ...
      console.log(this.sels)
      this.closeDialog()
    },
    closeDialog() {
      this.$emit('hideDialog', false)
    }
  }
}
</script>

<style lang="less" scoped>
.wrapper {
  /deep/ .coupon-type {
    margin-right: 30px;
  }
  /deep/ .rule-id {
    width: 250px;
  }
  /deep/ .el-dialog__header {
    padding-bottom: 20px;
    border-bottom: 2px solid #e8e8e8;
  }
  /deep/ .el-dialog__footer {
    text-align: center;
    padding-top: 20px;
    border-top: 2px solid #e8e8e8;
  }
}
</style>

