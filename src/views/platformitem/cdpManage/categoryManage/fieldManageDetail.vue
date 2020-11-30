<template>
  <div class="page-container">
    <div style="padding-bottom: 50px; width: 60%">
      <el-form
        ref="form"
        :model="form"
        :rules="rules"
        label-position="right"
        label-width="120px"
      >
        <el-form-item label="显示名称" prop="showName">
          <el-input
            v-model="form.showName"
            maxlength="100"
            :disabled="disabled"
            clearable
          />
          
        </el-form-item>
        <el-form-item label="字段名" prop="name">
          <el-input
            v-model="form.name"
            maxlength="100"
            :disabled="disabled"
            clearable
            @input="setUri"
          />
        </el-form-item>
        <el-form-item label="字段类型" prop="fieldType">
          <el-input
            v-model="form.fieldType"
            maxlength="100"
            :disabled="disabled"
            clearable
          />
        </el-form-item>
        <el-form-item label="字段属性" prop="attribute">
          <el-input v-model="form.attribute" :rows="5"  maxlength="200"  show-word-limit :disabled="disabled" type="textarea" clearable/>
        </el-form-item>

        <el-form-item label="是否为空" prop="nullable">
          <el-input
            v-model="form.nullable"
            maxlength="100"
            :disabled="disabled"
            clearable
            @input="setUri"
          />
        </el-form-item>
        <el-form-item label="字段权限规则串" prop="rules">
          <el-input
            v-model="form.rules"
            maxlength="100"
            :disabled="disabled"
            clearable
            @input="setUri"
          />
        </el-form-item>
        <el-form-item label="显示排序" prop="position">
          <el-input
            v-model="form.position"
            :rows="2"
            oninput="value=value.replace(/[^\d]/g,'')"
            maxlength="100"
            :disabled="disabled"
            type="text"
            clearable
          />
        </el-form-item>
        <el-form-item label="所属功能">
          <el-select
            v-model="form.parentId"
            :disabled="disabled || form.functionType == 2"
            filterable
            style="width: 100%"
            clearable
          >
            <el-option
              v-for="(parentItem, index) in parentList"
              :key="index"
              :label="parentItem.showName"
              :value="parentItem.functionId"
              :disabled="disabled"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="备注" prop="description">
          <el-input
            v-model="form.description"
            :rows="5"
            maxlength="200"
            show-word-limit
            :disabled="disabled"
            type="textarea"
            clearable
          />
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
      <el-button @click="$router.push({ name: 'fieldManage' })">返回</el-button>
    </div>
  </div>
</template>
<script>
// eslint-disable-next-line
import { mapState } from "vuex";
import { apiObj } from "@/config/getUrl.js";
import {
  getMenuList,
  getMenuDetail,
  platforms,
  updataMenu,
  addMenu,
} from "@/api/fieldManage";
export default {
  name: "FieldManageDetail",
  data() {
    var checkData = (rule, value, callback) => {
      // if (/[^\w\.\/]/ig.test(value)) {
      //     callback(new Error('不能输入汉字或者空格！'));
      //   }
      if (value) {
        if (/[^a-zA-Z]/g.test(value)) {
          callback(new Error("只能输入英文字符！"));
        } else {
          callback();
        }
      }
      callback();
    };
    var checkEncode = (rule, value, callback) => {
      // if (/[^\w\.\/]/ig.test(value)) {
      //     callback(new Error('不能输入汉字或者空格！'));
      //   }
      if (value) {
        if (/[^\u4E00-\u9FA5]/g.test(value)) {
          callback(new Error("只能输入中文字符！"));
        } else {
          callback();
        }
      }
      callback();
    };
    var valiIcon = (rule, value, callback) => {
      // 图片验证
      if (!this.form.showIcon) {
        callback(new Error("请上传icon图片"));
      } else {
        callback();
      }
    };
    return {
      uploadOss: `${apiObj.uploadOss}/val`,
      parentList: [],
      disabled: false,
      platforms: [],
      rules: {
        platformCode: [
          { required: true, message: "请选择平台名称", trigger: "change" },
        ],
        showName: [
          { required: true, message: "请输入菜单中文名称", trigger: "blur" },
          { validator: checkEncode, trigger: "blur" },
        ],
        name: [
          { required: true, message: "请输入菜单英文名称", trigger: "blur" },
          { validator: checkData, trigger: "blur" },
        ],
        uri: [{ required: true, message: "请输入跳转路由", trigger: "blur" }],
        functionType: [
          { required: true, message: "请选择菜单级别", trigger: "change" },
        ],
        showIcon: [{ required: true, validator: valiIcon }],
      },
      form: {
        id: "",
        showName: "",
        name: "",
        uri: "",
        functionType: "",
        platformCode: "",
        platformName: "",
        showIcon: "",
      },
      param: {},
      functionType: [
        { label: "一级菜单", value: "2" },
        { label: "二级菜单", value: "3" },
        { label: "三级菜单", value: "4" },
      ],
      id: "",
      isEdit: false,
    };
  },
  computed: {
    ...mapState({
      sidebar: (state) => state.app.sidebar,
    }),
  },
  mounted() {
    this.getPlatforms();
    this.id = this.$route.query.id;
    if (this.$route.query.type && this.$route.query.type === "view") {
      this.disabled = true;
    } else {
      this.disabled = false;
    }
    if (this.id) {
      this.getDetail();
    }
  },
  methods: {
    handleAvatarSuccess(response, file) {
      // console.log(res,file,9)
      this.form.showIcon = response.body.url;
      this.$refs.iconImg.clearValidate();
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === "png";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error("上传icon图片只能是 png格式!");
        return false;
      }
      // if (!isLt2M) {
      //   this.$message.error('上传头像图片大小不能超过 2MB!');
      // }
      // return isJPG && isLt2M;
    },
    setUri(val) {
      console.log(val, "val");
      this.form.uri = this.form.name;
    },
    getPlatforms(params) {
      this.loading = true;
      const sdata = this.filterForm
        ? JSON.parse(JSON.stringify(this.filterForm))
        : {};
      const curParams = params || sdata;
      platforms({})
        .then((res) => {
          this.platforms = res.body || [];
        })
        .catch(() => {
          this.loading = false;
        });
    },
    getMenuListFun() {
      let functionType = "";
      if (this.form.functionType != "") {
        functionType = this.form.functionType - 1;
      }
      getMenuList({
        functionTypeId: functionType,
        platformCode: this.form.platformCode,
      }).then((res) => {
        this.parentList = [];
        for (let i = 0; i < res.body.length; i++) {
          this.parentList.push({
            showName: res.body[i].showName,
            id: res.body[i].id.toString(),
          });
        }
      });
    },
    getDetail() {
      getMenuDetail({ id: this.id }).then((res) => {
        this.form = res.body;
        this.form.platformCode = this.form.platformCode.toString();
        this.form.functionType = this.form.functionType.toString();
        this.form.parentId = this.form.parentId.toString();
        // 根据菜单级别id查询菜单
        this.getMenuListFun();
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
      this.platforms.forEach((res) => {
        if (res.platformCode == this.form.platformCode) {
          this.form.platformName = res.platformName;
        }
      });
      if (this.id) {
        updataMenu(this.form).then((res) => {
          if (res.code == 0) {
            this.$message.success("更新成功");
            this.$router.go(-1);
          }
        });
      } else {
        addMenu(this.form).then((res) => {
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
.zZindex {
  z-index: 500;
}
.tips {
  //  color: #435A82;
  color: #c0c4cc;
  margin-left: 100px;
  line-height: 1.4;
}
.page-container {
  height: 90%;
  background: #fff;
}
</style>

