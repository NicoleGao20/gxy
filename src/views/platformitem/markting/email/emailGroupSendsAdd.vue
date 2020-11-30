<template>
  <el-container class="form-container" v-loading="pageLoading">
    <el-main class="form-main">
   <el-row type="flex">
      <el-form ref="elForm" :model="formData" :rules="rules" size="medium" label-width="100px">
        <el-col :span="24">
          <el-row>
            <el-col :span="22">
              <el-form-item label="任务名称" prop="field102">
                <el-input v-model="formData.field102" placeholder="请输入任务名称" clearable
                  :style="{width: '100%'}"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="目标用户" prop="field112">
                <el-radio-group v-model="formData.field112" size="medium">
                  <el-radio v-for="(item, index) in field112Options" :key="index" :label="item.value"
                    :disabled="item.disabled">{{item.label}}</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="22">
              <el-form-item label="" prop="field113">
                <el-input v-model="formData.field113" type="textarea" placeholder="请输入邮件地址"
                  :autosize="{minRows: 4, maxRows: 4}" :style="{width: '100%'}"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="22">
              <el-form-item label="邮件平台" prop="field103">
                <el-select v-model="formData.field103" placeholder="请选择邮件平台" clearable
                  :style="{width: '100%'}">
                  <el-option v-for="(item, index) in field103Options" :key="index" :label="item.label"
                    :value="item.value" :disabled="item.disabled"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="22">
              <el-form-item label="发信地址" prop="field104">
                <el-select v-model="formData.field104" placeholder="请选择发信地址" clearable
                  :style="{width: '100%'}">
                  <el-option v-for="(item, index) in field104Options" :key="index" :label="item.label"
                    :value="item.value" :disabled="item.disabled"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="22">
              <el-form-item label="模板选择" prop="field106">
                <el-select v-model="formData.field106" placeholder="请选择模板选择" clearable
                  :style="{width: '100%'}">
                  <el-option v-for="(item, index) in field106Options" :key="index" :label="item.label"
                    :value="item.value" :disabled="item.disabled"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="22">
              <el-form-item label="地址类型" prop="field105">
                <el-select v-model="formData.field105" placeholder="请选择地址类型" clearable
                  :style="{width: '100%'}">
                  <el-option v-for="(item, index) in field105Options" :key="index" :label="item.label"
                    :value="item.value" :disabled="item.disabled"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="22">
              <el-form-item label="发送人名称" prop="field107">
                <el-input v-model="formData.field107" placeholder="请输入发送人名称" clearable
                  :style="{width: '100%'}"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="22">
              <el-form-item label="邮件标题" prop="field108">
                <el-input v-model="formData.field108" placeholder="请输入邮件标题" clearable
                  :style="{width: '100%'}"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="邮件内容" prop="field113">
                <el-input v-model="formData.field113" type="textarea" placeholder="请输入邮件内容"
                  :autosize="{minRows: 4, maxRows: 4}" :style="{width: '100%'}"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
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
    <div class="form_footer">
      <el-button class="top-operate-btn" @click="$router.back()">
        返回
      </el-button>
      <template>
        <el-button class="top-operate-btn ml-20" type="primary" @click="save">保存</el-button>
      </template>
    </div>
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
        field113: undefined,
        field103: 1,
        field104: undefined,
        field106: undefined,
        field105: undefined,
        field107: "杜杜旗舰店",
        field108: "",
        field110: null,
      },
      rules: {
        field102: [{
          required: true,
          message: '请输入任务名称',
          trigger: 'blur'
        }],
        field112: [{
          required: true,
          message: '目标用户不能为空',
          trigger: 'change'
        }],
        field113: [{
          required: true,
          message: '请输入邮件地址',
          trigger: 'blur'
        }],
        field103: [{
          required: true,
          message: '请选择邮件平台',
          trigger: 'change'
        }],
        field104: [{
          required: true,
          message: '请选择发信地址',
          trigger: 'change'
        }],
        field106: [{
          required: true,
          message: '请选择模板选择',
          trigger: 'change'
        }],
        field105: [{
          required: true,
          message: '请选择地址类型',
          trigger: 'change'
        }],
        field107: [{
          required: true,
          message: '请输入发送人名称',
          trigger: 'blur'
        }],
        field108: [{
          required: true,
          message: '请输入邮件标题',
          trigger: 'blur'
        }],
        field110: [{
          required: true,
          message: '请输入邮件内容',
          trigger: 'blur'
        }],
      },
      field112Options: [{
        "label": "手工输入",
        "value": 1
      }, {
        "label": "批量导入",
        "value": 2
      }, {
        "label": "受众优选",
        "value": 3
      }],
      field103Options: [{
        "label": "阿里云",
        "value": 1
      }],
      field104Options: [{
        "label": "cdp@burgeon.cn",
        "value": 1
      }, {
        "label": "ad@burgeon.cn",
        "value": 2
      }],
      field106Options: [{
        "label": "测试模板",
        "value": 1
      }, {
        "label": "营销模板",
        "value": 2
      }],
      field105Options: [{
        "label": "阿里云地址",
        "value": 1
      }],
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    submitForm() {
      this.$refs['elForm'].validate(valid => {
        if (!valid) return
        // TODO 提交表单
      })
    },
    resetForm() {
      this.$refs['elForm'].resetFields()
    },
  }
}

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
