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
        <el-form-item label="商品条码" prop="product_code" :rules="[
              { required: true, message: `请选择商品条码`, trigger: 'blur' },
              {
                required: true,
                message: '数据唯一，不可重复',
                trigger: 'change',
                validator: this.actuallStoreNameCopy,
              },
            ]"
            :error="msg">
          <el-input 
             v-model="form.product_code" 
             maxlength="100" 
             clearable 
            />
        </el-form-item>
        <el-form-item label="产品名称" prop="product_name_cn" class="fileName">
          <el-autocomplete
            clearable
            v-model="form.product_name_cn"
            :fetch-suggestions="querySearch"
            placeholder="请输入产品名称"
            :trigger-on-focus="false"
          ></el-autocomplete>
        </el-form-item>
        <el-form-item label="产品规格" prop="specification">
          <el-input v-model="form.specification" maxlength="100" clearable disabled/>
        </el-form-item>
        <el-form-item label="有效期" prop="validity">
          <el-input v-model="form.validity" maxlength="100" clearable disabled/>
        </el-form-item>
         <el-form-item label="建议零售价" prop="purchase_price">
          <el-input v-model="form.purchase_price" maxlength="100" clearable disabled/>
        </el-form-item>
      </el-form>
    </div>
    <div
      :style="{ left: sidebar.opened ? '230px' : '50px' }"
      class="action-wrap"
    >
      <el-button class="top-operate-btn ml-20" type="primary" @click="save"
        >保存</el-button
      >
      <el-button @click="$router.push({ name: 'commodityList' })"
        >返回</el-button
      >
    </div>
  </div>
</template>
<script>
import { mapState } from "vuex";
import {
  queryProductInfoByName,
  editBarCodeTableList,
  checkIsOnlyOne,
  getBarCodeTableListById,
} from "@/api/markting/security/visit";

export default {
  name: "commodityTableCodeEdit",
  data() {
    return {
      type: "",
      disabled: false,
      rules: {
        product_name_cn:[
            { required: true, message: '请输入产品名称', trigger: 'blur' },
          ],
          specification:[
            { required: true, message: '请输入产品规格', trigger: 'blur' },
          ],
          validity:[
            { required: true, message: '请输入有效期', trigger: 'blur' },
          ],
          purchase_price:[
            { required: true, message: '请输入建议零售价', trigger: 'blur' },
          ],
      },
      form: {
        product_code:'',
        product_name_cn:'',
        specification:'',
        validity:'',
        purchase_price:''
      },
      dataType: [],
      id: "",
      fileNameList: [],
      msg: "",
      productNameCn: "", //产品名称接口返回回来的
      product_code: "", //商品条码接口返回回来的
      sku: "",
      product_code: "",
    };
  },
  computed: {
    ...mapState({
      sidebar: (state) => state.app.sidebar,
    }),
  },
  mounted() {
    this.type = this.$route.query.type;
    this.id = this.$route.query.id;
    this.product_code = this.$route.query.product_code;
    if (this.id && this.product_code && this.product_code) {
      this.edit();
    }
  },

  methods: {
    //编辑
    edit() {
      let params = {
        product_code: this.product_code,
        product_code: this.product_code,
      };
      getBarCodeTableListById(params).then((res) => {
        if (res.code === "1") {
          Object.keys(res.data).map(item => {
            this.form[item]=res.data[item]
          });
        }
      });
    },
    //商品表唯一
    actuallStoreNameCopy(rule, value, cb) {
      if (value) {
        this.msg = "";
        let params = {
          product_code: value,
        };
        checkIsOnlyOne(params).then((res) => {
          if (res.data.checkFlag) {
            this.msg = "数据唯一，不可重复";
          }
        });
      }
      cb();
    },
    //产品名称
    querySearch(queryString, cb) {
      console.log(queryString, "queryString, cb");
      this.queryBoxVocabularyFun(queryString, "product_name_cn").then((res) => {
        let fileNameList = res || [];
        var results = queryString
          ? fileNameList.filter(this.createFilter(queryString))
          : fileNameList;
        cb(results);
      });
    },
    async queryBoxVocabularyFun(queryString, queryType) {
      let param = {};
      if (queryType == "product_name_cn") {
        param.product_name_cn = queryString;
      }
      let data = await queryProductInfoByName(param);
      if (queryType == "product_name_cn") {
        let fileNameList = [];
        if (data.data.list && data.data.list.length > 0) {
          data.data.list.forEach((item) => {
            this.form.specification = item.specification; //规格
            this.form.validity = item.validity; //有效期
            this.form.purchase_price = item.purchase_price;
            this.productNameCn = item.product_name_cn;
            this.sku = item.sku;
            fileNameList.push({ value: item.product_name_cn });
          });
        }
        return fileNameList;
      }
    },
    createFilter(queryString) {
      return (restaurant) => {
        console.log("sssss", queryString);
        return (
          restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) ===
          0
        );
      };
    },
    //保存
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
    //保存
    submit() {
      if (this.id) {
        let params = {
          product_name_cn: this.productNameCn,
          sku: this.sku,
          ...this.form,
        };
        if (this.id) {
          params.id = this.id;
        }
        if (this.product_code) {
          params.product_code = this.product_code;
        }
        editBarCodeTableList(params).then((res) => {
          if (res.code == 0) {
            this.$message.success("保存成功");
            this.$router.go(-1);
          }
        });
      }
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
  .fileName {
    .el-autocomplete {
      width: 100%;
    }
  }
}
</style>

