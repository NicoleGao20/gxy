<template>
  <div class="page-brand">
    <div class="page-contain">
      <div class="page-nav">
        <el-form
          width="300px"
          :model="ruleForm"
          ref="ruleForm"
          label-width="100px"
          class="demo-ruleForm"
        >
          <el-form-item
            label="品牌:"
            prop="brand_name"
            :disabled="type == '查看' ? true : false"
            :rules="[
              { required: true, message: `请选择品牌`, trigger: 'change' },
              {
                required: true,
                message: '数据唯一，不可重复',
                trigger: 'change',
                validator: this.actuallStoreNameCopy,
              },
            ]"
            :error="msg"
          >
            <el-select
              v-model="ruleForm.brand_name"
              placeholder="请选择"
              prop="name"
              :disabled="type == '查看' ? true : false"
              @change="productChange"
            >
              <el-option
                v-for="(labelAttribute, index) in labelAttributes"
                :key="index"
                :label="labelAttribute.brandName"
                :value="labelAttribute.brandName"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            v-for="item in keyName"
            :label="item"
            :prop="item"
            style="margin-right:9px;"
            :disabled="type == '查看' ? true : false"
            :rules="[
              {
                required: true,
                message: `请输入${item}`,
                trigger: ['blur', 'change'],
              },
            ]"
            :key="item"
          >
            <el-input
              v-model="ruleForm[item]"
              placeholder="请输入"
              :disabled="type == '查看' ? true : false"
            ></el-input>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div class="form_footer">
      <template>
        <el-button
              type="primary"
              @click="submitForm"
              :disabled="repeatTime"
              v-if="type === '新增' || type === '编辑'"
              >保存</el-button
            >
            <el-button
              v-if="type === '新增'"
              type="primary"
              :disabled="repeatTime"
              @click="comfigStart('ruleForm')"
              >保存并启用</el-button
            >
            <el-button @click="resetForm('ruleForm')" :disabled="repeatTime"
              >返回</el-button
            >
      </template>
    </div>
  </div>
</template>
<script>
import {
  queryIntegration,
  preservationAdd,
  getChls,
  editConfig,
  integraCheckChl,
} from "@/api/security/visit";
import { queryBrandList } from "@/api/employ";
export default {
  name: "integratEdedit",
  data() {
    return {
      ruleForm: {},
      labelAttributes: [],
      type: "",
      id: "",
      on_status: "",
      //新增
      channel_table_name: "",
      add: "",
      integ_channel_name: "",
      substance: "",
      crm_mp_integ_chl_id: "",
      type_id: "",
      keyName: [],
      integTypeId: "",
      crm_mp_integ_conf_id: "",
      type_name: "",
      repeatTime: false, //重复点击
      msg: "",
    };
  },
  mounted() {
    this.id = this.$route.query.id; //id
    this.type = this.$route.query.type; //判断是查看还是编辑
    //新增
    this.add = this.$route.query.add ? this.$route.query.add : "";
    this.channel_table_name = this.$route.query.channel_table_name
      ? this.$route.query.channel_table_name
      : "";
    this.integ_channel_name = this.$route.query.integ_channel_name;
    this.substance = this.$route.query.substance;
    (this.crm_mp_integ_chl_id = this.$route.query.crm_mp_integ_chl_id),
      (this.type_id = this.$route.query.type_id);
    this.type_name = this.$route.query.type_name;
    this.integ_channel_name = this.$route.query.integ_channel_name;
    this.brands();
    if (this.type == "新增") {
      this.addGetChls();
    } else {
      //查看编辑接口
      this.queryConqueryIntegrationtent(this.id, this.crm_mp_integ_chl_id);
    }
  },
  methods: {
    //品牌唯一
    actuallStoreNameCopy(rule, value, cb) {
      if (value) {
        this.msg = "";
        let params = {
          brand_name: value,
        };
        if (this.type === "编辑") {
          params.id = this.id;
          params.channel_table_name = this.ruleForm.channel_table_name;
        } else if (this.type === "新增") {
          params.channel_table_name = this.channel_table_name;
        }
        if (this.type === "编辑" || this.type === "新增") {
          integraCheckChl(params).then((res) => {
            if (res.data.msg) {
              this.msg = res.data.msg;
            }
          });
        }
      }
      cb();
    },
    submitForm() {
      if (this.msg !== "数据唯一，不可重复") {
        this.$refs.ruleForm.validate((valid) => {
          if (valid) {
            if (this.type == "新增") {
              this.preservation(this.ruleForm);
            } else {
              this.preservationEdit(this.ruleForm);
            }
          } else {
            return false;
          }
        });
      }
    },
    brands() {
      let params = {};
      queryBrandList({ params: {} }).then((res) => {
        this.labelAttributes = res.body;
      });
    },
    //保存并启用
    comfigStart() {
      //校验
      if (this.msg !== "数据唯一，不可重复") {
        this.$refs.ruleForm.validate((valid) => {
          if (valid) {
            let comfigBoole = true;
            this.repeatTime = true;
            setTimeout(() => {
              this.repeatTime = false;
            }, 4000);
            this.saveContent(this.ruleForm, comfigBoole);
          } else {
            return false;
          }
        });
      }
    },
    //编辑保存
    preservationEdit(ruleForm) {
      this.setTimeConfig();
      let params = {
        crm_mp_integ_chl_id: this.crm_mp_integ_chl_id,
        ...this.ruleForm,
      };
      if (ruleForm == true) {
        params.on_status = "on";
      }
      editConfig(params).then((res) => {
        if (res.code == "1") {
          this.preservationButton();
        } else {
          this.failPreservation();
        }
      });
    },
    productChange() {
      this.$forceUpdate();
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.$router.go(-1);
    },
    queryConqueryIntegrationtent(id, integTypeId) {
      this.on_status = this.$route.query.on_status; //停用还是开启
      let params = {
        id: id,
        crm_mp_integ_chl_id: integTypeId,
      };
      if (this.integ_channel_name) {
        params.integ_channel_name = this.integ_channel_name;
      }
      //编辑
      queryIntegration(params).then((res) => {
        this.editGetChls(res.data);
      });
    },
    //保存
    preservation(ruleForm) {
      this.setTimeConfig();
      this.saveContent(ruleForm);
    },
    setTimeConfig() {
      this.repeatTime = true;
      setTimeout(() => {
        this.repeatTime = false;
      }, 4000);
    },
    saveContent(ruleForm, comfigBoole) {
      const {
        channel_table_name,
        integ_channel_name,
        crm_mp_integ_chl_id,
        id,
      } = this;
      const { app_id, app_secret, token, url } = ruleForm;
      let params = {
        crm_mp_integ_chl_id,
        type_name: this.substance,
        crm_mp_integ_type_id: this.type_id,
        id,
        channel_table_name,
        integ_channel_name,
        ...ruleForm,
      };
      if (comfigBoole === true) {
        params.on_status = "on";
      } else {
        params.on_status = "off";
      }
      preservationAdd(params).then((res) => {
        if (res.code == "1") {
          this.preservationButton();
        } else {
          this.failPreservation();
        }
      });
    },
    preservationButton() {
      this.$message({
        message: "保存成功",
        type: "success",
      });
      setTimeout(() => {
        this.$router.go(-1);
      }, 4000);
    },
    failPreservation() {
      this.$message.error("操作失败请重新操作");
    },
    //新增
    addGetChls(ruleForm) {
      let params = {};
      if (this.channel_table_name) {
        params.channel_table_name = this.channel_table_name;
      }
      //新增
      getChls(params)
        .then((res) => {
          if (res) {
            Object.keys(res.data).forEach((key) => {
              this.keyName.push(key); //键
            });
          }
        })
        .catch((fail) => {
          this.loading = false;
        });
    },
    editGetChls(ruleForm) {
      this.ruleForm = ruleForm;
      let arr = [
        "channel_table_name",
        "crm_mp_integ_conf_id",
        "brand_name",
        "id",
        "name",
      ];
      Object.keys(ruleForm).forEach((key) => {
        if (arr.findIndex((item) => item === key) == -1) {
          this.keyName.push(key);
        }
      });
    },
  },
};
</script>
<style lang="less" scoped>
.page-brand {
  width: 100%;
  height: 100%;
  .page-contain {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    overflow-y: scroll;
    .page-nav {
      flex: 1;
    }
    .page-footer {
      width: 80%;
      display: flex;
      justify-content: flex-end;
      align-items: center;
      padding-bottom: 40px;
      /deep/ .el-button:last-of-type {
        background: transparent;
        color: #435a82;
      }
    }
  }
}
/deep/ .el-input {
  width: 50%;
}
/deep/ .el-select {
  width: 50%;
  .el-input {
    width: 100%;
  }
}
/deep/ .el-form-item {
  /deep/ .el-form-item__label {
    width: 130px !important;
    display: flex;
    justify-content: flex-end;
  }
}
</style>
