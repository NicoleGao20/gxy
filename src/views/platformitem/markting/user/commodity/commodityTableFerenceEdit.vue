<template>
  <div class="product-container">
    <div style="padding-bottom: 50px; width: 550px">
      <el-form
        ref="form"
        :model="form"
        :rules="rules"
        label-position="right"
        label-width="120px"
      >
        <el-form-item label="商品条码" prop="manon_code">
          <el-input v-model="form.manon_code" maxlength="100" clearable />
        </el-form-item>
        <el-form-item label="经销商条码" prop="spu_code">
          <el-input v-model="form.spu_code" maxlength="100" clearable />
        </el-form-item>
        <el-form-item label="原厂名称" prop="manon_name">
          <el-select v-model="form.manon_name" clearable placeholder="请选择">
            <el-option
              v-for="item in product_type_list"
              :key="item.product_type_code"
              :label="item.product_type"
              :value="item.product_type_code"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="现产品名称" prop="spu_name">
          <el-select v-model="form.spu_name" clearable placeholder="请选择">
            <el-option
              v-for="item in product_series_list"
              :key="item.product_series_code"
              :label="item.product_series"
              :value="item.product_series_code"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </div>
    <div
      :style="{ left: sidebar.opened ? '230px' : '50px' }"
      class="action-wrap"
    >
      <el-button
        v-if="!disabled"
        class="top-operate-btn ml-20"
        type="primary"
        @click="save"
        >保存</el-button
      >
      <el-button @click="$router.push({ name: 'commodityList' })"
        >返回</el-button
      >
    </div>
  </div>
</template>
<script>
import {
  getCommodityQueryBox,
  getDetail,
  addCommodity,
  updataCommodity,
} from "@/api/interaction/commodityList";
import {
  updateBarCodeEdit,
  updateBarCode,
} from "@/api/markting/security/visit";
import { apiObj } from "@/config/getUrl.js";
// eslint-disable-next-line
import { mapState } from "vuex";
// import { getDetail,updataBrand,addBrand} from '@/api/brandManage'
export default {
  name: "ConditionLibraryMod",
  data() {
    var checkData = (rule, value, callback) => {
      // if (/[^\w\.\/]/ig.test(value)) {
      //     callback(new Error('不能输入汉字或者空格！'));
      //   }
      if (value) {
        if (/[^\w\.\/]/gi.test(value)) {
          callback(new Error("只能输入数字或者英文字符！"));
        } else {
          callback();
        }
      }
      callback();
    };
    return {
      product_type_list: [],
      product_series_list: [],
      uploadOss: `${apiObj.uploadOss}/val`,
      parentList: [],
      disabled: false,
      rules: {
        manon_code: [
          { required: true, message: "请输入商品名称", trigger: "blur" },
        ],
        spu_code: [
          { required: true, message: "请输入商品code", trigger: "blur" },
          { validator: checkData, trigger: "blur" },
        ],
        manon_name: [
          { required: true, message: "请选择产品分类", trigger: "blur" },
        ],
        spu_name: [
          { required: true, message: "请选择产品系列", trigger: "blur" },
        ],
      },
      form: {
        id: "",
        manon_code: "",
        spu_code: "",
        manon_name: "",
        spu_name: "",
      },
      param: {},
      id: "",
    };
  },
  computed: {
    ...mapState({
      sidebar: (state) => state.app.sidebar,
    }),
  },
  mounted() {
    this.id = this.$route.query.id;
    this.getCommodityQueryBoxFun();
  },
  methods: {
    getCommodityQueryBoxFun() {
       if (this.id) {
        let params = {
          id: this.id,
        };
        updateBarCodeEdit(params).then((res) => {
          Object.keys(this.form).map((item) => {
            this.form[item] = res.data[item];
          });
        });
      } else if (!this.id) {
        Object.keys(this.form).map((item) => {
          this.form[item] = "";
        });
      }
    },
    getDetail() {
      getDetail({ id: this.id }).then((res) => {
        this.form = res.body;
      });
    },
    save() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          this.submit();
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    submit() {
      let params = {
        ...this.form,
      };
      if (this.id) {
        params.id = this.id;
      }
      updateBarCode(params).then((res) => {
        if (res.code == 1) {
          this.$message.success("保存成功");
          this.$router.go(-1);
        }
      });
      //   else {
      //     addCommodity(this.form).then((res) => {
      //       if (res.code == 0) {
      //         this.$message.success("保存成功");
      //         this.$router.go(-1);
      //       }
      //     });
      //   }
    },
  },
};
</script>
<style lang="less" scoped>
.product-container {
  height: 90%;
  background: #fff;
  .el-select {
    width: 100%;
  }
}
</style>

