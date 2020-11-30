<template>
  <div v-loading="pageLoading" class="newPointBox">
    <el-form label-width="100px">
      <el-form-item :error="ruleNameErr" label="规则名称:">
        <el-input
          v-model="ruleName"
          placeholder="请输入规则名称"
          class="ruleName"
          @focus="ruleNameErr = ''"
        />
      </el-form-item>
      <el-form-item label="积分奖励:">
        <div class="bonusPoints">
          <el-radio v-model="rewardType" :label="1">
            <point-type-input
              :type="currentMode"
              :val="current"
              title="通用积分"
              style="display: inline-block"
              @inputValue="setCurrent"
              @selectValue="setCurrentMode"
            />
          </el-radio>
          <br >
          <el-radio v-model="rewardType" :label="2">等级积分</el-radio>
          <point-type-input-box
            :form-data="levelPointData"
            class="memberList"
            @boxChange="setLevelPointData"
          />
        </div>
      </el-form-item>
      <el-form-item :error="timeRangeErr" label="规则有效期:">
        <el-date-picker
          v-model="timeRange"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd"
          @focus="timeRangeErr = ''"
        />
      </el-form-item>
      <el-form-item label="适用商品:">
        <el-select
          v-model="fixGoods"
          placeholder="请选择适用商品"
          size="mini"
          class="elSelect"
        >
          <el-option
            v-for="item in fixGoodsList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <el-button
          type="text"
          v-show="fixGoods"
          @click="openSelectList"
        >{{ fixGoods === 1 ? "排除商品" : "选择商品" }}</el-button
        >
        <p class="tip">
          如果商品参加多个积分规则，会重复送积分;发生部分退款时，按照实际支付金额扣除应退积分
        </p>
      </el-form-item>
    </el-form>
    <el-table
      ref="multipleTable"
      :data="tableData"
      tooltip-effect="dark"
      style="width: 100%"
      border
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        :resizable="false"
        type="selection"
        width="55"
      />
      <el-table-column :resizable="false" label="商品信息" width="500">
        <template slot-scope="scope">
          <img
            :src="scope.row.pic ? scope.row.pic : defaultImg"
            class="goodPic"
          >
          <div style="display: inline-block">
            <p class="goodName">{{ scope.row.product_name_cn }}</p>
            <p class="goodPrice">
              {{ scope.row.suggested_retail_price + "¥" }}
            </p>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        :resizable="false"
        prop="stock"
        label="库存"
        width="120"
      />
      <el-table-column
        :resizable="false"
        label="操作"
        show-overflow-tooltip
        align="center"
      >
        <template slot-scope="scope">
          <el-button type="text" @click="cancelOne(scope.row)">取消参加</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div style="margin-top: 10px; padding-left: 10px">
      <el-checkbox
        v-model="buttonCheckBox"
        @click.native="toggleSelection"
      />
      <el-button
        class="cancelAll"
        @click="cancleMany(selectedTableData)"
      >批量取消</el-button
      >
    </div>
    <pagination
      :page-num="out_page_num"
      :page-size="out_page_size"
      :pager-count="5"
      :count="out_counts"
      @handleSizeChange="outHandleSizeChange"
      @handleCurrentChange="outHandleCurrentChange"
    />
    <div class="operation">
      <el-button
        class="operationButton"
        @click="$router.go(-1)"
      >取消</el-button
      >
      <el-button
        class="operationButton"
        type="primary"
        @click="saveForm"
      >保存</el-button
      >
    </div>
    <el-dialog
      :title="fixGoods === 1 ? '排除商品' : '选择商品'"
      :visible.sync="showCheckGoods"
      width="70%"
    >
      <screen
        :screen-list="screenList"
        :screen-value="screenValue"
        :show-select-btn="true"
        class="screen"
        @selected="searchWithFilter"
      />
      <el-row :gutter="10" class="select-content">
        <el-col :span="8">
          <div class="selected-list">
            <h4>已选结果</h4>
            <div class="selected-list-content">
              <div v-for="(item, index) in selectedList" :key="index">
                <el-checkbox v-if="!item.type" v-model="item.checked">{{
                  item.name
                }}</el-checkbox>
              </div>
            </div>
            <div class="footer-btn">
              <el-button
                type="danger"
                plain
                size="small"
                @click="deleteSeleted"
              >删除选中</el-button
              >
              <el-button
                type="danger"
                plain
                size="small"
                @click="clearSelected"
              >清空</el-button
              >
            </div>
          </div>
        </el-col>
        <el-col :span="16">
          <div class="select-list">
            <product
              ref="productRef"
              @getSelected="getSelected"
              @removeSelected="removeSelected"
              @getTableDataFromChild="getTableDataFromChild"
              @getSelectedCount="getSelectedCount"
            />
            <pagination
              :page-num="page_num"
              :page-size="page_size"
              :pager-count="5"
              :count="counts"
              @handleSizeChange="handleSizeChange"
              @handleCurrentChange="handleCurrentChange"
            />
          </div>
        </el-col>
      </el-row>
      <div class="dialog-footer">
        <span class="selected-count">
          已选择
          <span class="bold-currency bold-currency-danger">{{
            selectedCount
          }}</span>
          个商品
        </span>
        <el-button
          type="primary"
          size="small"
          @click="sureSelect"
        >完成</el-button
        >
        <el-button size="small" @click="closeDialog">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import defaultImg from '@/assets/404_images/404_defult.png'
import screen from '@/componentsMarketing/screen/screen'
import product from '@/componentsMarketing/onlyproduct/onlyproduct'
import pagination from '@/componentsMarketing/pagination/pagination'
import pointTypeInputBox from '@/componentsMarketing/pointTypeInputBox/pointTypeInputBox'
import pointTypeInput from '@/componentsMarketing/pointTypeInput/pointTypeInput'
import {
  addRule,
  querySelProduct,
  queryNewIntegral,
  editNewIntegral
} from '@/api/markting/pointType'
export default {
  components: {
    screen,
    product,
    pagination,
    pointTypeInputBox,
    pointTypeInput
  },
  data() {
    return {
      defaultImg: defaultImg,
      // 整个页面loading
      pageLoading: false,
      // 规则名称
      ruleName: '',
      // 积分奖励类型
      rewardType: 1,
      // 通用积分
      currentMode: 1,
      current: 0,
      // 等级积分
      levelPointData: {
        bronzeMode: 1,
        silverMode: 1,
        goldMode: 1,
        bronze: 0,
        silver: 0,
        gold: 0
      },
      // 规则有效期
      timeRange: null,
      // 适用商品
      fixGoods: 1,
      fixGoodsList: [
        {
          value: 1,
          label: '全部商品'
        },
        {
          value: 2,
          label: '部分商品'
        }
      ],
      // 适用商品列表
      tableData: [],
      // 排除选择商品按钮显示隐藏
      buttonCheckBox: false,
      // 排除选择商品窗口显示隐藏
      showCheckGoods: false,
      // 筛选列表
      screenList: [
        {
          label: '商品分类',
          type: 'select',
          key: 'goodsClass',
          option: [
            { label: '不限', val: 1 },
            { label: '一级分类', val: 2 },
            { label: '二级分类', val: 3 }
          ]
        },
        {
          label: '商品类型',
          type: 'select',
          key: 'goodsType',
          option: [
            { label: '不限', val: 1 },
            { label: '一级分类', val: 2 },
            { label: '二级分类', val: 3 }
          ]
        },
        {
          label: '商品标题',
          placeholder: '',
          key: 'goodsName',
          type: 'text'
        },
        {
          label: '商品现价',
          type: 'inputRange',
          key: 'priceRange',
          placeholder: ''
        }
      ],
      // 筛选规则
      screenValue: {
        goodsClass: '',
        goodsType: '',
        goodsName: '',
        goods: '',
        priceRange: []
      },
      // 选择排除商品页选中列表
      selectedList: [], // 列表中显示的，打开列表时赋值给它
      beforeExcludeList: [], // 排除列表
      beforeSelectList: [], // 选择列表
      selectedCount: 0,
      // 选择排除商品页分页
      page_num: 1,
      page_size: 10,
      counts: 0,
      // 适用商品下面列表分页
      out_page_num: 1,
      out_page_size: 10,
      out_counts: 0,

      nowFixGoods: '', // 下面表格的适用商品类型

      selectedTableData: [], // 批量取消的选中商品

      ruleNameErr: '',
      timeRangeErr: ''
    }
  },
  mounted() {
    if (this.$route.query.id) {
      this.pageLoading = true
      queryNewIntegral({
        id: this.$route.query.id
      }).then(({ data }) => {
        if (data.levels.length) {
          this.levelPointData = {
            bronzeMode: data.levels[0].level_fixed_points,
            silverMode: data.levels[1].level_fixed_points,
            goldMode: data.levels[2].level_fixed_points,
            bronze: data.levels[0].level_multi_times,
            silver: data.levels[1].level_multi_times,
            gold: data.levels[2].level_multi_times
          }
        }
        this.ruleName = data.rule_name
        this.rewardType = +data.award_type
        if (data.trand_payment) this.currentMode = +data.trand_payment
        if (data.trand_point) this.current = +data.trand_point
        this.timeRange = [
          data.UDR_validity_start.split(' ')[0],
          data.UDR_validity_end.split(' ')[0]
        ]
        this.fixGoods = +data.contain_prod_type
        this.nowFixGoods = +data.contain_prod_type
        if (+data.contain_prod_type === 1) {
          data.products.forEach((val) => {
            this.beforeExcludeList.push({
              id: val.product_code,
              name: val.product_name,
              brand_code: val.brand_code
            })
          })
        } else if (+data.contain_prod_type === 2) {
          data.products.forEach((val) => {
            this.beforeSelectList.push({
              id: val.product_code,
              name: val.product_name,
              brand_code: val.brand_code
            })
          })
        }
        this.$nextTick(() => {
          if (+data.contain_prod_type === 1) { this.renderTableData(this.beforeExcludeList, 1, 10) } else if (+data.contain_prod_type === 2) { this.renderTableData(this.beforeSelectList, 1, 10) }
        })
        this.pageLoading = false
      })
    }
  },
  methods: {
    searchWithFilter() {
      this.$refs.productRef.productQuery(1, 10, this.screenValue)
    },
    openSelectList() {
      this.selectedList = []
      const beforeExcludeList = JSON.parse(
        JSON.stringify(this.beforeExcludeList)
      )
      const beforeSelectList = JSON.parse(JSON.stringify(this.beforeSelectList))
      if (this.fixGoods === 1) {
        this.selectedList = beforeExcludeList
        this.selectedCount = beforeExcludeList.length
      } else if (this.fixGoods === 2) {
        this.selectedList = beforeSelectList
        this.selectedCount = beforeSelectList.length
      }
      this.screenValue = {
        goodsClass: '',
        goodsType: '',
        goodsName: '',
        goods: '',
        priceRange: []
      }
      this.showCheckGoods = true
      this.$nextTick(() => {
        this.$refs.productRef.productQuery(1, 10)
      })
    },
    setCurrent(val) {
      this.current = val
    },
    setCurrentMode(val) {
      this.currentMode = val
    },
    toggleSelection() {
      this.$refs.multipleTable.toggleAllSelection()
    },
    handleSelectionChange(val) {
      if (val.length === this.tableData.length) this.buttonCheckBox = true
      else this.buttonCheckBox = false
      const newArr = []
      val.forEach((item) => {
        newArr.push({
          id: item.product_code,
          name: item.product_name_cn,
          brand_code: item.brand_code
        })
      })
      this.selectedTableData = newArr
    },
    setLevelPointData(val) {
      this.levelPointData = val
    },
    getSelectedCount() {
      this.selectedCount = this.selectedList.length
    },
    sureSelect() {
      if (this.fixGoods === 2 && this.selectedList.length === 0) {
        this.$message('您还未选择参与商品')
      } else {
        const sList = []
        this.selectedList.forEach((val) => {
          sList.push({
            brand_code: val.brand_code,
            product_code: val.id,
            product_name: val.name
          })
        })
        querySelProduct({
          contain_prod_type: this.fixGoods,
          product_codes: sList,
          pageNum: 1,
          pageSize: 10
        }).then(({ data }) => {
          this.tableData = data.list
          this.out_page_num = data.pagination.current
          this.out_page_size = data.pagination.page_size
          this.out_counts = data.pagination.total
          if (this.fixGoods === 1) {
            this.beforeExcludeList = this.selectedList
            this.beforeSelectList = []
          } else if (this.fixGoods === 2) {
            this.beforeSelectList = this.selectedList
            this.beforeExcludeList = []
          }
          this.showCheckGoods = false
          this.nowFixGoods = this.fixGoods
        })
      }
    },
    deleteSeleted() {
      var list = this.selectedList.filter((item) => {
        return !item.checked
      })
      this.selectedList = list
      this.selectedCount = this.selectedList.length
    },
    clearSelected() {
      this.selectedList = []
      this.selectedCount = 0
    },
    handleSizeChange(data) {
      this.$refs.productRef.productQuery(1, data, this.screenValue)
    },
    handleCurrentChange(data) {
      this.$refs.productRef.productQuery(
        data,
        this.page_size,
        this.screenValue
      )
    },
    renderTableData(selectedList, pageNum, pageSize) {
      const sList = []
      selectedList.forEach((val) => {
        sList.push({
          brand_code: val.brand_code,
          product_code: val.id,
          product_name: val.name
        })
      })
      querySelProduct({
        contain_prod_type: this.nowFixGoods,
        product_codes: sList,
        pageNum,
        pageSize
      }).then(({ data }) => {
        this.tableData = data.list
        this.out_page_num = data.pagination.current
        this.out_page_size = data.pagination.page_size
        this.out_counts = data.pagination.total
      })
    },
    outHandleSizeChange(data) {
      if (this.nowFixGoods) {
        if (this.nowFixGoods === 1) { this.renderTableData(this.beforeExcludeList, 1, data) } else if (this.nowFixGoods === 2) { this.renderTableData(this.beforeSelectList, 1, data) }
      } else {
        this.out_page_size = data
      }
    },
    outHandleCurrentChange(data) {
      if (this.nowFixGoods) {
        if (this.nowFixGoods === 1) {
          this.renderTableData(
            this.beforeExcludeList,
            data,
            this.out_page_size
          )
        } else if (this.nowFixGoods === 2) { this.renderTableData(this.beforeSelectList, data, this.out_page_size) }
      }
    },
    getSelected(data) {
      var has = false
      this.selectedList.forEach((s) => {
        if (s.id == data.id) {
          has = true
          setTimeout(() => {
            this.$message(s.name + '已被选择')
          }, 300)
        }
      })
      if (!has) {
        const datas = JSON.parse(JSON.stringify(data))
        datas.checked = false
        this.selectedList.push(datas)
      }
    },
    removeSelected(data) {
      var list = this.selectedList.filter((item) => {
        return item.id != data.id
      })
      this.selectedList = []
      this.selectedList = list
    },
    getTableDataFromChild(data) {
      this.page_num = data.page_num
      this.page_size = data.page_size
      this.counts = data.count
    },
    closeDialog() {
      this.showCheckGoods = false
    },
    saveForm() {
      if (this.ruleName && this.timeRange) {
        if (!this.nowFixGoods) {
          this.$message('您还未选择参与商品')
        } else {
          const obj = {
            rule_name: this.ruleName,
            award_type: this.rewardType,
            UDR_validity_start: this.timeRange[0],
            UDR_validity_end: this.timeRange[1],
            contain_prod_type: this.nowFixGoods
          }
          if (this.$route.query.id) {
            obj.id = this.$route.query.id
          }
          if (this.rewardType === 1) {
            obj.trand_payment = this.currentMode
            obj.trand_point = this.current
          } else if (this.rewardType === 2) {
            obj.levels = [
              {
                level_fixed_points: this.levelPointData.bronzeMode,
                level_multi_times: this.levelPointData.bronze
              },
              {
                level_fixed_points: this.levelPointData.silverMode,
                level_multi_times: this.levelPointData.silver
              },
              {
                level_fixed_points: this.levelPointData.goldMode,
                level_multi_times: this.levelPointData.gold
              }
            ]
          }
          if (this.nowFixGoods === 1) {
            obj.products = []
            this.beforeExcludeList.forEach((val) => {
              obj.products.push({
                brand_code: val.brand_code,
                product_code: val.id,
                product_name: val.name
              })
            })
          } else if (this.nowFixGoods === 2) {
            obj.products = []
            this.beforeSelectList.forEach((val) => {
              obj.products.push({
                brand_code: val.brand_code,
                product_code: val.id,
                product_name: val.name
              })
            })
          }
          if (!this.$route.query.id) {
            addRule(obj).then((r) => {
              this.$router.push({ name: 'pointType' })
            })
          } else {
            editNewIntegral(obj).then((r) => {
              this.$router.push({ name: 'pointType' })
            })
          }
        }
      } else {
        if (!this.ruleName) this.ruleNameErr = '请输入规则名称'
        if (!this.timeRange) this.timeRangeErr = '请选择规则有效期'
      }
    },
    cancelOne(data) {
      if (this.nowFixGoods === 1) {
        this.beforeExcludeList.push({
          id: data.product_code,
          name: data.product_name_cn,
          brand_code: data.brand_code
        })
        this.renderTableData(this.beforeExcludeList, 1, this.out_page_size)
      }
      if (this.nowFixGoods === 2) {
        this.beforeSelectList = this.beforeSelectList.filter((val) => {
          return +val.id !== +data.id
        })
        this.renderTableData(this.beforeSelectList, 1, this.out_page_size)
      }
    },
    cancleMany(data) {
      if (this.nowFixGoods === 1) {
        data.forEach((val) => {
          this.beforeExcludeList.push({
            id: val.id,
            name: val.name,
            brand_code: val.brand_code
          })
        })
        this.renderTableData(this.beforeExcludeList, 1, this.out_page_size)
      }
      if (this.nowFixGoods === 2) {
        let newList = JSON.parse(JSON.stringify(this.beforeSelectList))
        data.forEach((value) => {
          newList = newList.filter((val) => {
            return +val.id !== +value.id
          })
        })
        this.beforeSelectList = newList
        this.renderTableData(newList, 1, this.out_page_size)
      }
    }
  }
}
</script>

<style scoped lang="scss">
.newPointBox {
  font-size: 12px;
  line-height: 1;
  margin: 15px;
  line-height: 28px;
  background: #fff;
}
.optionBox {
  padding: 10px 0;
}
.ruleName {
  width: 300px;
}
.bonusPoints {
  display: inline-block;
  vertical-align: top;
}
.elInput {
  width: 150px;
}
.memberList {
  font-size: 14px;
}
.elSelect {
  width: 300px;
}
.tip {
  padding-left: 62px;
}
.goodPic {
  width: 46px;
  height: 46px;
  vertical-align: top;
}
.goodName {
  color: #487cdd;
}
.goodPrice {
  color: #ec8e47;
}
.cancelAll {
  margin-left: 10px;
}
.operation {
  text-align: center;
}
.operationButton {
  width: 80px;
  height: 35px;
}
.screen {
  margin-top: -50px;
  margin-left: -20px;
}
.select-content {
  margin-top: 20px;
  .el-col {
    .selected-list,
    .select-list {
      border: 1px solid #dcdfe6;
    }
    .selected-list {
      h4 {
        padding: 0 10px;
        color: #909399;
        margin: 0;
        height: 48px;
        line-height: 48px;
      }
      .selected-list-content {
        overflow: auto;
        height: 230px;
        border-top: 1px solid #dcdfe6;
        padding: 10px;
        & > div {
          // overflow: hidden;
          // text-overflow: ellipsis;
          // white-space: nowrap;
          display: block;
          margin-bottom: 10px;
        }
      }
      .footer-btn {
        border-top: 1px solid #dcdfe6;
        overflow: hidden;
        padding: 10px;
        .el-button {
          float: left;
        }
        .el-button:last-child {
          float: right;
        }
      }
    }
  }
}
.dialog-footer {
  margin-top: -20px;
}
.selected-count {
  float: left;
  color: #444;
}
</style>
