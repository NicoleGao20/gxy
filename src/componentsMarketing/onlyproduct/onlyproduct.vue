<template>
  <el-table
    :data="tabaleData"
    :cell-class-name="setCellClassname"
    height="300"
    @select="select"
    @select-all="selectAll"
  >
    <el-table-column type="selection" width="55" />
    <el-table-column label="商品信息" width="200" show-overflow-tooltip>
      <template slot-scope="scope">
        <el-popover placement="right" trigger="hover">
          <img
            :src="
              scope.row.first_image_url == undefined
                ? ''
                : scope.row.first_image_url
            "
            :onerror="default_img"
            style="max-height: 200px"
          />
          <img
            slot="reference"
            :src="
              scope.row.first_image_url == undefined
                ? ''
                : scope.row.first_image_url
            "
            :onerror="default_img"
            class="table-cell-img"
            style="max-height: 50px"
          />
        </el-popover>
        <!-- <img :src="scope.row.product_image_url[0].image_url | ossImg" alt="" :onerror="default_img" class="table-cell-img"> -->
        <span style="vertical-align: top">{{ scope.row.product_name_cn }}</span>
      </template>
    </el-table-column>
    <el-table-column prop="product_no" label="产品类型" />
    <el-table-column prop="original_price" label="原价">
      <template slot-scope="scope">
        <span class="bold-currency bold-currency-danger">{{
          scope.row.original_price
        }}</span>
      </template>
    </el-table-column>
    <el-table-column prop="product_price" label="现价">
      <template slot-scope="scope">
        <span class="bold-currency bold-currency-danger">{{
          scope.row.product_price
        }}</span>
      </template>
    </el-table-column>
    <el-table-column prop="category_name" label="产品分类" />
  </el-table>
</template>
<script>
import logo from "@/assets/404_images/404_defult.png";
import { queryAllProduct } from "@/api/markting/pointType";
export default {
  data() {
    return {
      tabaleData: [],
      loading: false,
      default_img: 'this.src="' + logo + '"',
    };
  },
  methods: {
    setCellClassname({ row, column, rowIndex, columnIndex }) {
      if (
        column.property == "num_sales" ||
        column.property == "amount_trade" ||
        column.property == "product_price"
      ) {
        return "table-txt-specific";
      }
      if (column.property == "product_name") {
        return "products-avata-img";
      }
    },
    select(selection, row) {
      let obj = {};
      obj.name = row.product_name_cn;
      obj.id = row.product_code;
      obj.brand_code = row.brand_code;
      if (selection.indexOf(row) != -1) {
        this.$emit("getSelected", obj);
      } else {
        this.$emit("removeSelected", obj);
      }
      this.$emit("getSelectedCount");
    },
    selectAll(selection) {
      let obj = {};
      if (selection.length > 0) {
        selection.forEach((element) => {
          obj.name = element.product_name_cn;
          obj.id = element.product_code;
          obj.brand_code = element.brand_code;
          this.$emit("getSelected", obj);
        });
      } else {
        this.tabaleData.forEach((element) => {
          obj.name = element.product_name_cn;
          obj.id = element.product_code;
          obj.brand_code = element.brand_code;
          this.$emit("removeSelected", obj);
        });
      }
      this.$emit("getSelectedCount");
    },
    productQuery(pageNum, pageSize, filter) {
      this.tabaleData = [];
      queryAllProduct({
        pageNum,
        pageSize,
      }).then(({ data }) => {
        this.tabaleData = data.list;
        this.$emit("getTableDataFromChild", {
          count: data.pagination.total,
          page_num: data.pagination.current,
          page_size: data.pagination.page_size,
        });
      });
    },
  },
};
</script>
