<template>
  <el-container class="form-container" v-loading="pageLoading">
    <el-main class="form-main">
    <el-row :gutter="6">
      <el-form ref="elForm" :model="formData" :rules="rules" size="medium" label-width="100px">
        <el-col :span="17">
          <el-row>
            <el-col :span="23">
              <el-form-item label="消息名称" prop="field103">
                <el-input v-model="formData.field103" placeholder="请输入消息名称" clearable
                  :style="{width: '100%'}"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="23">
              <el-form-item label="目标用户" prop="field104">
                <el-radio-group v-model="formData.field104" size="medium">
                  <el-radio v-for="(item, index) in field104Options" :key="index" :label="item.value"
                    :disabled="item.disabled">{{item.label}}</el-radio>
                </el-radio-group>
                <el-row style="color: #606266">
            受众人群数: 12311 人, 有效人群数: 2211 人
          </el-row>
              </el-form-item>
            </el-col>
            <el-col :span="23">
              <el-form-item label="" prop="field105">
                <el-input v-model="formData.field105" type="textarea" placeholder="请输入手机号"
                  :autosize="{minRows: 4, maxRows: 4}" :style="{width: '100%'}"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="23">
              <el-form-item label="短信白名单" prop="field107">
                <el-checkbox-group v-model="formData.field107" size="medium">
                  <el-checkbox v-for="(item, index) in field107Options" :key="index" :label="item.value"
                    :disabled="item.disabled">{{item.label}}</el-checkbox>
                </el-checkbox-group>
              </el-form-item>
            </el-col>
            <el-col :span="23">
              <el-form-item label="触发类型" prop="field108">
                <el-radio-group v-model="formData.field108" size="medium">
                  <el-radio v-for="(item, index) in field108Options" :key="index" :label="item.value"
                    :disabled="item.disabled">{{item.label}}</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="23">
              <el-form-item label="" prop="field109">
                <el-radio-group v-model="formData.field109" size="medium">
                  <el-radio v-for="(item, index) in field109Options" :key="index" :label="item.value"
                    :disabled="item.disabled">{{item.label}}</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="23">
              <el-form-item label="短信签名" prop="field111">
                <el-select v-model="formData.field111" placeholder="短信签名" clearable :style="{width: '100%'}">
                  <el-option v-for="(item, index) in field111Options" :key="index" :label="item.label"
                    :value="item.value" :disabled="item.disabled"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="23">
              <el-form-item label="短信模板" prop="field118">
                <el-select v-model="formData.field118" placeholder="短信模板" clearable :style="{width: '100%'}">
                  <el-option v-for="(item, index) in field118Options" :key="index" :label="item.label"
                    :value="item.value" :disabled="item.disabled"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="23">
              <el-form-item label="短信内容" prop="field112">
                <el-input v-model="formData.field112" type="textarea" placeholder="请输入短信内容"
                  :autosize="{minRows: 4, maxRows: 4}" :style="{width: '100%'}"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="14">
              <el-form-item label="" prop="field120">
                <el-select v-model="formData.field120" clearable :style="{width: '100%'}">
                  <el-option v-for="(item, index) in field120Options" :key="index" :label="item.label"
                    :value="item.value" :disabled="item.disabled"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item label="" prop="field121">
                <el-button type="primary" size="small"> 插入H5 </el-button>
              </el-form-item>
            </el-col>
            <el-col :span="14">
              <el-form-item label="" prop="field125">
                <el-input v-model="formData.field125" placeholder="请输入" clearable :style="{width: '100%'}">
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="" prop="field123">
                <el-button type="primary" size="small"> 插入淘短链 </el-button>
              </el-form-item>
            </el-col>
            <el-col :span="14">
              <el-form-item label="测试发送" prop="field128">
                <el-input v-model="formData.field128" placeholder="请输入测试发送" clearable
                  :style="{width: '100%'}"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="" prop="field129">
                <el-button type="primary" size="small"> 发送 </el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-col>
        <el-col :span="7">
            <div>
              <img
                src="/static/images/android.png"
                alt=""
              />
            </div>
          </el-col>
        <el-col :span="24">
          <el-form-item size="large">
            <el-button type="primary" @click="submitForm">提交</el-button>
            <el-button @click="resetForm">重置</el-button>
          </el-form-item>
        </el-col>
      </el-form>
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
        field103: undefined,
        field104: undefined,
        field105: undefined,
        field107: [],
        field108: 1,
        field109: 1,
        field111: undefined,
        field118: undefined,
        field112: undefined,
        field120: undefined,
        field121: undefined,
        field125: undefined,
        field123: undefined,
        field128: undefined,
        field129: undefined,
      },
      rules: {
        field103: [{
          required: true,
          message: '请输入消息名称',
          trigger: 'blur'
        }],
        field104: [{
          required: true,
          message: '目标用户不能为空',
          trigger: 'change'
        }],
        field105: [{
          required: true,
          message: '请输入手机号',
          trigger: 'blur'
        }],
        field107: [],
        field108: [{
          required: true,
          message: '触发类型不能为空',
          trigger: 'change'
        }],
        field109: [{
          required: true,
          message: '不能为空',
          trigger: 'change'
        }],
        field111: [{
          required: true,
          message: '短信签名',
          trigger: 'change'
        }],
        field118: [{
          required: true,
          message: '短信模板',
          trigger: 'change'
        }],
        field112: [{
          required: true,
          message: '请输入短信内容',
          trigger: 'blur'
        }],
        field120: [{
          required: true,
          message: '',
          trigger: 'change'
        }],
        field125: [{
          required: true,
          message: '请输入',
          trigger: 'blur'
        }],
        field128: [{
          required: true,
          message: '请输入测试发送',
          trigger: 'blur'
        }],
      },
      field104Options: [{
        "label": "手工发送",
        "value": 1
      }, {
        "label": "批量导入",
        "value": 2
      }, {
        "label": "受众选择",
        "value": ""
      }],
      field107Options: [{
        "label": "勾选后，消息将同步发送至短信白名单手机号",
        "value": 1
      }],
      field108Options: [{
        "label": "主动触发",
        "value": 1
      }, {
        "label": "事件触发",
        "value": 2
      }],
      field109Options: [{
        "label": "立即发送",
        "value": 1
      }, {
        "label": "定时发送",
        "value": 2
      }],
      field111Options: [{
        "label": "选项一",
        "value": 1
      }, {
        "label": "选项二",
        "value": 2
      }],
      field118Options: [{
        "label": "选项一",
        "value": 1
      }, {
        "label": "选项二",
        "value": 2
      }],
      field120Options: [{
        "label": "选项一",
        "value": 1
      }, {
        "label": "选项二",
        "value": 2
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
