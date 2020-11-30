<template>
  <div>
    <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="80px">
      <el-form-item label="平台" prop="platform_name">
        <el-select
          v-model="ruleForm.platform_name"
          style="width: 100%"
          clearable
          placeholder="请选择"
        >
          <el-option
            v-for="(labelAttribute, index) in channelAttributes"
            :key="index"
            :label="labelAttribute.platform_name"
            :value="labelAttribute.platform_name"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="店铺名称" prop="store_name">
        <el-input
          v-model="ruleForm.store_name"
          :disabled="type == '查看' ? true : false"
        />
      </el-form-item>
      <el-form-item label="店铺类型" prop="store_type">
        <el-select
          v-model="ruleForm.store_type"
          :disabled="type == '查看' ? true : false"
          style="width: 100%"
          clearable
          placeholder="请选择"
        >
          <el-option
            v-for="(labelAttribute, index) in label_storeType"
            :key="index"
            :label="labelAttribute.label"
            :value="labelAttribute.value"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="店铺主体" prop="store_owner">
        <el-input
          v-model="ruleForm.store_owner"
          :disabled="type == '查看' ? true : false"
        />
      </el-form-item>

      <el-form-item label="OMS店铺编码" prop="oms_code">
        <el-input
          :hide-required-asterisk="true"
          v-model="ruleForm.oms_code"
          :disabled="type == '查看' ? true : false"
        />
        <span v-if="false" style="color: red">OMS店铺编码是唯一的编码</span>
      </el-form-item>

      <div>
        <span>OMS是否接入</span>
        <template>
          <el-radio
            v-model="ruleForm.access_to_oms"
            :disabled="type == '查看' ? true : false"
            label="1"
          >是</el-radio
          >
          <el-radio
            v-model="ruleForm.access_to_oms"
            :disabled="type == '查看' ? true : false"
            label="0"
          >否</el-radio
          >
        </template>
      </div>
      <el-form-item class="contain_comfig">
        <!-- <span class="dialog-footer"> -->
        <el-button
          v-if="type !== '查看'"
          type="primary"
          @click="comfig('ruleForm')"
        >确定</el-button
        >
        <el-button @click="goBack">返回</el-button>
        <!-- </span> -->
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import {
  addStor,
  updateStore,
  editStore,
  queryPlatformName,
  checkOmsCode
} from '@/api/markting/security/visit'
export default {
  name: 'AddStore',
  data() {
    var actuallStoreCode = (rule, value, callback) => {
      this.verification('oms_code', callback)
    }
    var actuallStoreNameCopy = (rule, value, callback) => {
      this.verification('store_name', callback)
    }
    return {
      ruleForm: {
        platform_name: '',
        store_name: '',
        store_type: '',
        store_owner: '',
        oms_code: '',
        access_to_oms: '1'
      },
      label_storeType: [
        { label: '品牌', value: '品牌' },
        { label: '非品牌', value: '非品牌' }
      ],
      type: '',
      channelAttributes: [], // 平台
      rules: {
        platform_name: [{ required: true, message: '请选择平台', trigger: 'blur' }],
        store_name: [
          { required: true, message: '请输入店铺名称', trigger: 'blur' },
          { pattern: /^[\u0391-\uFFE5A-Za-z]+$/, message: '目前只支持汉字和英文' },
          { validator: actuallStoreNameCopy, trigger: 'blur' }
        ],
        oms_code: [
          { pattern: /^[0-9]*$/g, message: '目前只支持数字', trigger: 'blur' },
          { validator: actuallStoreCode, trigger: 'blur' }
        ],
        store_type: [
          { required: true, message: '请选择店铺类型', trigger: 'blur' }
        ],
        store_owner: [
          { required: true, message: '请输入店铺主体', trigger: 'blur' },
          { pattern: /^[\u0391-\uFFE5A-Za-z]+$/, message: '目前只支持汉字和英文' }
        ]
      }
    }
  },
  mounted() {
    this.ruleForm.platform_name = '';
    (this.store_name = ''),
    (this.ruleForm.store_type = ''),
    (this.ruleForm.store_owner = ''),
    (this.ruleForm.oms_code = ''),
    (this.type = this.$route.query.type)
    this.id = this.$route.query.id
    this.editId()
    this.platform()
  },
  methods: {
    // 新增-保存
    comfig(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          console.log(valid, '的房间号')
          const params = {}
          const keys = Object.keys(this.ruleForm)
          keys.map((item) => {
            if (this.ruleForm[item]) {
              params[item] = this.ruleForm[item]
            }
          })
          if (this.$route.query.id) {
            params.id = this.$route.query.id
          }
          if (!this.ruleForm.oms_code) {
            params.oms_code = null
          }
          if (this.$route.query.id) {
            editStore(params).then((res) => {
              if (res) {
                if (res.code == '1') {
                  this.open()
                } else {
                  this.failOpen()
                }
              }
            })
          } else if (!this.$route.query.id) {
            addStor(params).then((res) => {
              if (res) {
                if (res.code == '1') {
                  this.open()
                } else {
                  this.failOpen()
                }
              }
            })
          }
        } else {
          return false
        }
      })
    },
    verification(type, callback) {
      console.log(this.id, type, 'ddd')
      const params = {}
      if (this.id) {
        params.id = this.id
      }
      if (type == 'store_name') {
        // 店铺名称
        params.store_name = this.ruleForm.store_name
      } else if (type == 'oms_code') {
        params.oms_code = this.ruleForm.oms_code
      }
      if (this.ruleForm.platform_name) {
        params.platform_name = this.ruleForm.platform_name
      }
      checkOmsCode(params).then((res) => {
        if (res.code === '1' && res.data.msg) {
          callback(new Error(`${res.data.msg}`))
        } else {
          callback()
        }
      })
    },
    // 编辑
    editId() {
      const params = {
        id: this.id
      }
      updateStore(params).then((res) => {
        if (res.code == '1') {
          this.ruleForm.platform_name = res.data.platform_name // 平台
          this.ruleForm.store_name = res.data.store_name // 店铺名称
          this.ruleForm.store_owner = res.data.store_owner // 店铺主体
          this.ruleForm.store_type = res.data.store_type // 店铺类型
          this.ruleForm.oms_code = res.data.oms_code
        }
      })
    },
    // 请求数据
    platform() {
      const params = {}
      queryPlatformName(params)
        .then((res) => {
          if (res.code == '1') {
            console.log(res, 'refff')
            this.channelAttributes = res.data.list
          }
        })
        .catch((error) => {
          this.deletFailOpen()
          console.log(error)
        })
    },
    // 返回
    goBack() {
      this.$router.go(-1)
    },
    open() {
      this.$message('操作成功')
      this.$router.go(-1)
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    failOpen() {
      this.$message.error('操作失败,请重新操作')
    }
  }

}
</script>
<style lang="less" scoped>
.dialog-footer {
  display: block;
  text-align: center;
  margin-top: 80px;
}
/deep/ .el-form {
  /deep/ .el-form-item:nth-of-type(5) {
    /deep/ .el-form-item__label {
      width: 115px !important;
      position: relative;
      left: -32px;
    }
    /deep/ .el-form-item__content {
      position: relative;
      top: -32px;
      margin-left: 80px;
    }
  }
  /deep/ .contain_comfig {
      text-align:center;
      margin-top:90px;
  }
}
</style>
