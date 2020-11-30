<template>
  <el-container class="form-container" v-loading="pageLoading">
    <el-main class="form-main">
      <el-row type="flex">
        <el-form
          ref="elForm"
          :model="formData"
          :rules="rules"
          size="medium"
          label-width="100px"
        >
          <el-col :span="24">
            <el-row>
              <el-col :span="18">
                <el-form-item label="任务名称" prop="field102">
                  <el-input
                    v-model="formData.field102"
                    placeholder="请输入任务名称"
                    clearable
                    :style="{ width: '100%' }"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="目标用户" prop="field112">
                  <el-radio-group v-model="formData.field112" size="medium">
                    <el-radio
                      v-for="(item, index) in field112Options"
                      :key="index"
                      :label="item.value"
                      :disabled="item.disabled"
                      >{{ item.label }}</el-radio
                    >
                  </el-radio-group>
                </el-form-item>
              </el-col>
              <el-col :span="18">
                <el-form-item label="抖音账号" prop="field103">
                  <el-select
                    v-model="formData.field103"
                    placeholder="请选择抖音账号"
                    clearable
                    :style="{ width: '100%' }"
                  >
                    <el-option
                      v-for="(item, index) in field103Options"
                      :key="index"
                      :label="item.label"
                      :value="item.value"
                      :disabled="item.disabled"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="发送内容" prop="field115">
                  <el-radio-group v-model="formData.field115" size="medium">
                    <el-radio
                      v-for="(item, index) in field115Options"
                      :key="index"
                      :label="item.value"
                      :disabled="item.disabled"
                      >{{ item.label }}</el-radio
                    >
                  </el-radio-group>
                </el-form-item>
              </el-col>
              <el-col :span="18">
                <el-form-item label="上传图片" prop="field114" required>
                  <el-upload
                    ref="field114"
                    :file-list="field114fileList"
                    :action="field114Action"
                    :before-upload="field114BeforeUpload"
                    list-type="picture-card"
                  >
                    <i class="el-icon-plus"></i>
                  </el-upload>
                </el-form-item>
              </el-col>
            </el-row>
          </el-col>
          <el-col :span="24">
            <el-form-item>
              <el-button type="primary" @click="submitForm">提交</el-button>
              <el-button @click="resetForm">保存</el-button>
              <el-button @click="resetForm">重置</el-button>
            </el-form-item>
          </el-col>
        </el-form>
        <el-col class="iphone-x-container" :span="14">
          <div class="device iphone-x">
            <!--    外部轮廓    -->
            <div class="frame">
              <div class="content">
                <div class="time">10:19</div>
              </div>
            </div>

            <!--    天线    -->
            <div class="stripe" />

            <!--    听筒孔    -->
            <div class="header">
              <div class="sensors" />
            </div>

            <!--    按键    -->
            <div class="btns" />
            <div class="power" />
          </div>
        </el-col>
      </el-row>
    </el-main>
  </el-container>
</template>
<script>
export default {
  components: {},
  props: [],
  data() {
    return {
      formData: {
        field102: undefined,
        field112: 1,
        field103: 1,
        field115: 1,
        field114: null,
      },
      rules: {
        field102: [
          {
            required: true,
            message: "请输入任务名称",
            trigger: "blur",
          },
        ],
        field112: [
          {
            required: true,
            message: "目标用户不能为空",
            trigger: "change",
          },
        ],
        field103: [
          {
            required: true,
            message: "请选择抖音账号",
            trigger: "change",
          },
        ],
        field115: [
          {
            required: true,
            message: "发送内容不能为空",
            trigger: "change",
          },
        ],
      },
      field114Action: "https://jsonplaceholder.typicode.com/posts/",
      field114fileList: [],
      field112Options: [
        {
          label: "手工输入",
          value: 1,
        },
        {
          label: "批量导入",
          value: 2,
        },
        {
          label: "受众优选",
          value: 3,
        },
      ],
      field103Options: [
        {
          label: "杜蕾斯官方抖音号",
          value: 1,
        },
      ],
      field115Options: [
        {
          label: "图片",
          value: 1,
        },
        {
          label: "视频",
          value: 2,
        },
      ],
    };
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    submitForm() {
      this.$refs["elForm"].validate((valid) => {
        if (!valid) return;
        // TODO 提交表单
      });
    },
    resetForm() {
      this.$refs["elForm"].resetFields();
    },
    field114BeforeUpload(file) {
      let isRightSize = file.size / 1024 / 1024 < 2;
      if (!isRightSize) {
        this.$message.error("文件大小超过 2MB");
      }
      return isRightSize;
    },
  },
};
</script>
<style>
.el-upload__tip {
  line-height: 1.2;
}
</style>


</script>
<style lang="less" scoped>
.form-container {
  padding: 20px;
  width: 100%;
  min-height: 100%;

  .form-main {
    width: 100%;
    min-height: 100%;
    background-color: #fff;
  }
  /deep/.el-form {
    width: 800px;
  }
  .footer {
    margin-left: 100px;
  }
  /deep/ .el-select {
    width: 100% !important;
  }
}
</style>
