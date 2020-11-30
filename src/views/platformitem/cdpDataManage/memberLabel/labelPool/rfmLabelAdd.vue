<template>
  <div class="page-container">
    <div class="action-container">
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <div class="basic-info">
          <div class="label-title">
            <i class="linev-tip"/><span class="label-desc">基本信息</span>
          </div>
          <el-row :gutter="20" style="margin-top: 35px;">
            <el-col :span="8">
              <el-form-item label="条件类型" prop="label_type">
                <el-select v-model="form.label_type" disabled style="width: 100%;">
                  <el-option v-for="(labelType, index) in labelTypes" :key="index" :label="labelType.label" :value="labelType.value"/>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="模型名称" prop="label_attribute">
                <el-select v-model="form.model_type" disabled style="width: 100%;">
                  <el-option v-for="(labelType, index) in modelTypes" :key="index" :label="labelType.label" :value="labelType.value"/>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="条件名称" prop="label_name">
                <el-input v-model.trim="form.label_name" :disabled="actionType === 'edit'" maxlength="50" clearable/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="8">
              <el-form-item label="更新频次" prop="update_frequency">
                <el-select v-model="form.update_frequency" :disabled="actionType === 'edit'" style="width: 100%;">
                  <el-option v-for="(frequencyType, index) in frequencyTypes" :key="index" :label="frequencyType.label" :value="frequencyType.value"/>
                </el-select>
              </el-form-item>
            </el-col>
            <!-- <el-col :span="8">
              <el-form-item label="更新时间">
                <el-input v-model="form.update_time" disabled suffix-icon="el-icon-timer"/>
              </el-form-item>
            </el-col> -->
          </el-row>
          <el-row :gutter="20">
            <el-col :span="24">
              <el-form-item label="条件说明" prop="label_desc">
                <el-input v-model="form.label_desc" :disabled="$route.query.view === 'true'" maxlength="400" placeholder="条件说明,最多可以填400字"/>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        <div class="basic-info">
          <div class="label-title">
            <i class="linev-tip"/><span class="label-desc">条件值定义</span>
          </div>
          <el-row :gutter="20" style="padding-left: 10px;margin-top: 10px;">
            <el-col :span="24">
              <!-- <el-button :disabled="$route.query.view" type="primary">新增</el-button> -->
              <el-table :data="form.rule_list" style="margin-top: 10px;">
                <!-- <el-table-column label="序号"/> -->
                <el-table-column prop="enum_name" label="标签内容"/>
              </el-table>
            </el-col>
          </el-row>
        </div>
        <div class="basic-info" style="margin-top: 20px;">
          <div class="label-title">
            <i class="linev-tip"/><span class="label-desc">应用品牌</span>
          </div>
          <div style="margin-top: 20px;padding-left: 10px;">
            <el-button :disabled="!form.rule_list.length || $route.query.view === 'true'" type="primary" @click="choseBrand">选择品牌</el-button>
            <div class="label-content">
              <el-tag
                v-for="(tag, index) in dynamicTags"
                :key="index"
                :disable-transitions="false"
                :closable="!$route.query.view"
                @close="handleClose(tag)">
                {{ $store.getters.language === 'zh' ? tag.brandName:tag.brandName }}
              </el-tag>
            </div>
            <issuedLabel v-if="choseBrandStatus" :dynamic-tags="dynamicTags" @sendVisible="changeData" @transferData="getTransferData"/>
          </div>
        </div>
      </el-form>
    </div>
    <div :style="{left: sidebar.opened?'230px': '50px'}" class="action-wrap">
      <el-button size="small" @click="cancel">{{ $t('form.cancel') }}</el-button>
      <el-button :disabled="$route.query.view === 'true'" :loading="actionLoading" size="small" type="primary" @click="confirmHandler">{{ $t('form.save') }}</el-button>
    </div>
  </div>
</template>
<script>
/*
标签属性 新增时可以选择，编辑时禁用
属性标签 编辑时创建类型（自定义SQL，属性）//对前端没有意义
规则标签 编辑时创建类型（自定义SQL，筛选器）
规则标签 新增时只有筛选器
*/
import issuedLabel from '@/components/issuedLabel'
import { editModelLable, getModelLabel } from '@/api/labelPool'
import { queryBrandList } from '@/api/employ'
import { mapState } from 'vuex'

export default {
  name: 'RfmLabelAdd',
  components: {
    issuedLabel
  },
  data() {
    return {
      labelTypes: [
        { label: '手工标签', value: 'manual' },
        { label: '规则标签', value: 'rule' },
        { label: '复合标签', value: 'complex' },
        { label: '属性标签', value: 'attribute' },
        { label: '模型标签', value: 'model' }
      ],
      labelAttributes: [
        { label: '通用', value: 'common' },
        { label: '个性', value: 'special' }
      ],
      frequencyTypes: [
        { label: '每天', value: 't_1' },
        { label: '实时', value: 'realtime' }
      ],
      modelTypes: [
        { label: 'rfm模型', value: 'rfm' }
      ],
      rules: {
        label_type: [
          { required: true, message: '请选择标签类型', trigger: 'change' }
        ],
        label_attribute: [
          { required: true, message: '请选择标签属性', trigger: 'change' }
        ],
        label_name: [
          { required: true, message: '请填写标签名称', trigger: 'change' }
        ],
        update_frequency: [
          { required: true, message: '请选择更新频次', trigger: 'change' }
        ]
      },
      form: {
        label_type: 'manual',
        label_attribute: 'common',
        label_name: '',
        model_type: '',
        // create_type 枚举数据类型 { manual,sql,filter,attribute,algorithm }
        create_type: 'algorithm', // 规则标签下只有筛选器和sql,新增时默认为筛选器
        // valid_time_begin: '',
        // valid_time_end: '',
        label_value_type: '',
        label_desc: '',
        update_time: '',
        update_frequency: '', // 更新频次
        brand_info: [], // 品牌
        rule_list: []
      },
      choseBrandStatus: false,
      dynamicTags: [],
      pickerOptions: {
        disabledDate: this.disabledDate
      },
      actionType: 'edit',
      actionLoading: false
    }
  },
  computed: {
    ...mapState({
      sidebar: state => state.app.sidebar
    })
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      if (this.$route.query.id) {
        this.actionType = 'edit'
        getModelLabel({ id: this.$route.query.id, create_type: this.$route.query.create_type })
          .then((res) => {
            var data = res.data
            this.form.label_type = data.label_type
            this.form.label_attribute = data.label_attribute
            this.form.label_name = data.label_name
            this.form.model_type = data.model_type
            this.form.label_value_type = data.label_value_type
            this.form.create_type = data.create_type
            // this.form.valid_time_begin = data.valid_time_begin
            this.form.update_frequency = data.update_frequency
            this.form.label_desc = data.label_desc
            this.form.rule_list = data.slave_tables || []
            this.form.brand_info = data.brand_info || []
            if (this.form.brand_info.length) {
              queryBrandList({ params: {}}).then(res => {
                // dynamicTags
                this.form.brand_info.forEach(brand => {
                  res.body.forEach(ele => {
                    if (brand === ele.brandCode) {
                      this.dynamicTags.push(ele)
                    }
                  })
                })
              })
            }
          })
      }
    },
    disabledDate(date) {
      if (new Date(date).Format('yyyy-MM-dd') < new Date(new Date().getTime() + 86400000).Format('yyyy-MM-dd')) {
        return true
      } else {
        return false
      }
    },
    confirmHandler() {
      if (this.actionLoading === true) return
      this.$refs['form'].validate((valid) => {
        if (!valid) return
        var params = {
          label_type: this.form.label_type,
          label_attribute: this.form.label_attribute,
          model_type: this.form.model_type,
          label_value_type: this.form.label_value_type,
          create_type: this.form.create_type || this.$route.query.create_type,
          label_name: this.form.label_name,
          label_desc: this.form.label_desc,
          brand_info: this.form.brand_info,
          update_frequency: this.form.update_frequency
        }
        if (this.$route.query.id) params.id = this.$route.query.id

        // if (this.form.valid_time_begin && this.form.valid_time_end) {
        //   if (!this.form.valid_time_begin) {
        //     this.$message({
        //       type: 'error',
        //       message: '请填写有效开始时间'
        //     })
        //     return
        //   }

        //   if (!this.form.valid_time_end) {
        //     this.$message({
        //       type: 'error',
        //       message: '请填写有效结束日期'
        //     })
        //     return
        //   }

        //   if (new Date(this.form.valid_time_begin).Format('yyyy-MM-dd hh:mm:ss') > new Date(this.form.valid_time_end).Format('yyyy-MM-dd hh:mm:ss')) {
        //     this.$message({
        //       type: 'error',
        //       message: '有效开始时间不能小于有效结束日期'
        //     })
        //     return
        //   }

        //   params.valid_time_begin = this.form.valid_time_begin
        //   params.valid_time_end = this.form.valid_time_end
        // } else {
        //   if(this.form.valid_time_end) params.valid_time_end = this.form.valid_time_end
        //   if(!this.form.valid_time_begin) {
        //     params.valid_time_begin = new Date().Format('yyyy-MM-dd hh:mm:ss')
        //   }else{
        //     params.valid_time_begin = this.form.valid_time_begin
        //   }
        // }
        this.actionLoading = true

        if (this.$route.query.id) {
          editModelLable(params).then(() => {
            this.actionLoading = false
            if (this.actionType === 'add') {
              this.$message({
                message: '保存成功!',
                type: 'success',
                duration: 1000
              })
            } else {
              this.$message({
                message: '编辑成功!',
                type: 'success',
                duration: 1000
              })
            }
            setTimeout(() => {
              this.$router.push({ name: 'conditionlPool' })
            }, 400)
          }).catch(fail => {
            this.actionLoading = false
          })
        }
      })
    },
    choseBrand() {
      this.choseBrandStatus = true
    },
    changeData(data) {
      this.choseBrandStatus = data
    },
    handleClose(tag) {
      this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1)
      if (this.dynamicTags.length) {
        this.form.brand_info = []
        this.dynamicTags.forEach(ele => {
          this.form.brand_info.push(ele.brandCode)
        })
      } else {
        this.form.brand_info = []
      }
    },
    getTransferData(data) {
      this.dynamicTags = data
      if (this.dynamicTags.length) {
        this.form.brand_info = []
        this.dynamicTags.forEach(ele => {
          this.form.brand_info.push(ele.brandCode)
        })
      }
    },
    cancel() {
      this.$router.push({ name: 'conditionlPool' })
    }
  }
}
</script>
<style lang="less">
.page-container{
  background: white;
  min-height: 100%;
}
.label-title {
  height: 16px;
  position: relative;
  line-height: 16px;
  padding-left: 10px;
}
.linev-tip {
  display: inline-block;
  width: 4px;
  height: 16px;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  position: absolute;
  background: #435a82;
}
.label-content{
  margin: 15px 0;
  padding: 10px;
  border:1px solid rgba(220,223,230,1);
  min-height: 80px;
  /deep/ .el-tag--light{
    margin-right: 10px;
    margin-bottom: 10px;
    color: #434960;
  }
}
</style>
