<template>
  <el-container v-loading="pageLoading" class="jing-dong-shu-fang-form-container">
    <el-main class="jing-dong-shu-fang">
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="任务名称" prop="ads_name">
          <el-input v-model="form.ads_name" :maxlength="30" :disabled="mode === 'view'" placeholder="请输入任务名称" clearable/>
        </el-form-item>
        <el-form-item label="受众选择" prop="group_no">
          <el-select v-model="form.group_no" :disabled="mode === 'view'" @change="handleGroupChange">
            <el-option
              v-for="item in groupList"
              :key="item.id"
              :label="item.group_name"
              :value="item.group_no"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="ID类型" prop="ID_type" >
          <el-row>
            <el-radio-group v-model="form.ID_type" :disabled="mode === 'view'">
              <el-radio label="mobile">手机号</el-radio>
              <el-radio label="pin">PIN</el-radio>
              <el-radio label="imei">IMEI</el-radio>
              <el-radio label="MAC">MAC</el-radio>
              <el-radio label="IDFA">IDFA</el-radio>
              <el-radio label="IMSI">IMSI</el-radio>
              <el-radio label="email">电子邮箱</el-radio>
            </el-radio-group>
          </el-row>
          <el-row style="color: #606266">
            受众人群数: 12311 人, 有效人群数: 12311 人
          </el-row>
        </el-form-item>
        <el-form-item label="账号选择" prop="admin">
          <el-select v-model="form.admin" :disabled="mode === 'view'">
            <el-option
              v-for="item in accountList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="推送后名称" prop="ads_name_later">
          <el-input
            v-model="form.ads_name_later"
            :disabled="mode === 'view'"
            placeholder="请输入名称"/>
        </el-form-item>
        <el-form-item label="备注" prop="ads_push_remake">
          <el-input
            v-model="form.ads_push_remake"
            :disabled="mode === 'view'"
            type="textarea"
            placeholder="请输入内容"/>
        </el-form-item>
        
      </el-form>
      <el-row class="form_footer">
          <el-button v-if="mode !== 'view'" type="primary" @click="handleSubmit">{{ mode === 'new'? '立即创建':'立即保存' }}</el-button>
          <el-button @click="handleCancel">{{ mode === 'view'? '返回':'取消' }}</el-button>
        </el-row>
    </el-main>
  </el-container>
</template>

<script>
import { insertAdvertising, updateAdvertising } from '@/api/markting/advertising'
import { queryIdAndNoAndName } from '@/api/markting/vinpinsightGrouplist'
import { mapGetters } from 'vuex'
export default {
  name: 'JingDongShuFangForm',
  data() {
    return {
      pageLoading: false,
      form: {
        ads_name: '',
        cnt_audience: '',
        ID_type: 'mobile',
        group_no: '',
        group_name: '',
        ads_name_later: '',
        ads_push_remake: ''
      },
      mode: 'new',
      groupList: [],
      accountList: [],
      crowdType:'',//受众唯一标识
      crowdName:'',//受众选择
    }
  },
  computed: {
    rules() {
      return {
        ads_name: { required: true, trigger: ['blur', 'change'], message: '任务名称不能为空' },
        cnt_audience: { required: true, trigger: ['blur', 'change'], message: '受众选择不能为空' },
        ID_type: { required: true, trigger: ['blur', 'change'], message: 'ID类型不能为空' },
        group_no: { required: true, trigger: ['blur', 'change'], message: '受众选择不能为空' },
        admin: { required: true, trigger: ['blur', 'change'], message: '账号选择不能为空' },
        ads_name_later: { required: true, trigger: ['blur', 'change'], message: '推送后名称不能为空' },
        ads_push_remake: { required: true, trigger: ['blur', 'change'], message: '备注不能为空' }
      }
    },
    ...mapGetters(['brandCode'])
  },
  created() {
    if (this.$route.name === 'newJingdongShufang') this.mode = 'new'
    if (this.$route.name === 'editJingdongShufang') this.mode = 'edit'
    if (this.$route.name === 'viewJingdongShufang') this.mode = 'view'
    if (this.mode !== 'new') {
      this.form = JSON.parse(decodeURIComponent(this.$route.query.formData))
    }
    this.crowdType=this.$route.query.type
    this.form.group_no=this.$route.query.integ_channel_name
    this.getGroupList()
  },
  methods: {
    handleSubmit() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.pageLoading = true
          const postData = {
            ...this.form
            // ads_name: this.form.ads_name,
            // cnt_audience: this.form.cnt_audience,
            // ID_type: this.form.ID_type,
            // group_no: this.form.group_no,
            // group_name: this.form.group_name,
            // ads_name_later: this.form.ads_name_later,
            // ads_push_remake: this.form.ads_push_remake
          }
          insertAdvertising(postData).then(res => {
            if (res && res.data) {
              this.$message.success('提交成功！')
            }
          }).finally(() => {
            this.pageLoading = false
          })
        }
      })
    },
    handleCancel() {
      this.handleBack()
    },
    handleGroupChange(val) {
      console.log('group no change', val)
    },
    handleBack() {
      this.$router.push({ name: 'jingdongShufang' })
    },
    getGroupList() {
      queryIdAndNoAndName({ brandCode: this.brandCode || 'durex' }).then(res => {
        if (res && res.data && res.data.list) {
          this.groupList = res.data.list
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.jing-dong-shu-fang-form-container {
  padding: 20px;
  width: 100%;
  min-height: 100%;

  .jing-dong-shu-fang {
    width: 100%;
    min-height: 100%;
    background-color: #fff;
  }
  /deep/.el-form {
    width: 700px;
  }
  /deep/.el-input, /deep/.el-textarea{
    width: 80%;
  }
  .footer {
    margin-left: 100px;
  }
  /deep/ .el-select {
    width: 100% !important;
  }
}
</style>
