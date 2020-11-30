<template>
  <div class="content">
    <el-form ref="form" :model="info" :rules="rules" label-width="130px" class="demo-ruleForm">
      <el-row class="mt-10">
        <el-col :span="12" :offset="6" class="pr-20">
          <el-form-item label="角色名称" prop="sequenceName">
            <el-input v-model="info.sequenceName" size="small" placeholder="请输入角色名称" maxlength="100"/>
          </el-form-item>
          <el-form-item label="角色备注" prop="address">
            <el-input
              v-model="info.address"
              type="textarea"
              maxlength="200"
              show-word-limit 
              placeholder="请输入角色备注"
              @input="descInput"
            />
            <!-- <span
              style="float:right;color:#999;position:absolute;bottom:0;right:20px;"
            >{{ remnant }}</span> -->
          </el-form-item>
        </el-col>
      </el-row>
      <div class="btns">
        <el-button class="top-operate-btn" @click="$router.back()">
          <i class="el-icon-arrow-left"/> 返回
        </el-button>
        <el-button class="top-operate-btn ml-20" type="primary" @click="save">保存</el-button>
      </div>
    </el-form>
  </div>
</template>
<script>
import { postRole, getRole, putRole } from '@/api/permissions'
export default {
  name: 'NewRole',
  data() {
    return {
      remnant: 100,
      id: '',
      storeList: [],
      breadcrumbText: '',
      info: {
        address: '', // 备注
        sequenceName: '' // 角色名称
      },
      rules: {
        sequenceName: [
          { required: true, message: '请输入名称', trigger: 'blur' }
        ],
        address: [
          { required: true, message: '请输入备注', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.id = this.$route.query.id
    if (this.id) {
      this.getData()
      this.breadcrumbText = '编辑角色'
    } else {
      this.breadcrumbText = '创建角色'
    }
  },
  methods: {
    descInput() {
      var txtVal = this.info.address.length
      this.remnant = 100 - txtVal
    },
    getData() {
      getRole({ id: this.id }).then((res) => {
        if (res.code === '0') {
          this.info.address = res.body.description
          this.info.sequenceName = res.body.name
          this.descInput()
        }
      })
    },
    save() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.submit()
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    submit(){
      if (this.info.sequenceName === '' || this.info.address === '') {
        return false
      }
      const subParam = {
        name: this.info.sequenceName,
        description: this.info.address
      }
      if (this.id !== '' && this.id !== undefined) {
        // 编辑保存
        subParam.id = this.id
        putRole(subParam).then((res) => {
          if (res.code === '0') {
            this.$router.go(-1)
          }
        })
      } else {
        // 新建保存
        postRole(subParam).then((res) => {
          if (res.code === '0') {
            this.$router.go(-1)
          }
        })
      }
    }
  }
}
</script>
<style lang="less" scoped>
    .btns {
        display: flex;
        justify-content: center;
    }
</style>
