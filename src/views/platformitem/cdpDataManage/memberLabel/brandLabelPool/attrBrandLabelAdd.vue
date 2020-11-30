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
              <el-form-item label="条件名称" prop="label_name">
                <el-input v-model="form.label_name" maxlength="50" disabled clearable/>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="条件类型" prop="label_type">
                <el-select v-model="form.label_type" disabled style="width: 100%;">
                  <el-option v-for="(labelType, index) in labelTypes" :key="index" :label="labelType.label" :value="labelType.value"/>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="条件属性" prop="label_attribute">
                <el-select v-model="form.label_attribute" disabled style="width: 100%;">
                  <el-option v-for="(labelAttribute, index) in labelAttributes" :key="index" :label="labelAttribute.label" :value="labelAttribute.value"/>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="8">
              <el-form-item label="条件类目" prop="label_class_def_id">
                <el-select v-model="form.label_class_def_id" disabled style="width: 100%;">
                  <el-option v-for="(labelAttribute, index) in labelAttributes" :key="index" :label="labelAttribute.label" :value="labelAttribute.value"/>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="有效开始日期" prop="valid_time_begin">
                <el-date-picker
                  v-model="form.valid_time_begin"
                  :append-to-body="false"
                  :picker-options="pickerOptions"
                  disabled
                  style="width: 100%;"
                  type="date"
                  value-format="yyyy-MM-dd"
                  format="yyyy-MM-dd"
                  placeholder="有效开始日期"
                  clearable
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="有效结束日期" prop="valid_time_end">
                <el-date-picker
                  v-model="form.valid_time_end"
                  :append-to-body="false"
                  :picker-options="pickerOptions"
                  disabled
                  style="width: 100%;"
                  type="date"
                  value-format="yyyy-MM-dd"
                  format="yyyy-MM-dd"
                  placeholder="有效结束日期"
                  clearable
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="24">
              <el-form-item label="条件说明" prop="label_desc">
                <el-input v-model="form.label_desc" disabled maxlength="400" placeholder="条件说明,最多可以填400字"/>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
      </el-form>
    </div>
    <div :style="{left: sidebar.opened?'230px': '50px'}" class="action-wrap">
      <el-button size="small" @click="cancel">{{ $t('form.cancel') }}</el-button>
      <el-button :disabled="actionType == 'add'" :loading="actionLoading" size="small" type="primary" @click="confirmHandler">{{ $t('form.save') }}</el-button>
    </div>
  </div>
</template>
<script>
import { getAttrBrandLabel, getClassTree } from '@/api/brandLabelPool'
import { mapState } from 'vuex'

export default {
  name: 'AttrBrandLabelView',
  data() {
    return {
      labelTypes: [
        { label: '手工标签', value: 'manual' },
        { label: '规则标签', value: 'rule' },
        { label: '复合标签', value: 'complex' },
        { label: '属性标签', value: 'attribute' },
        { label: '模型标签', value: 'rfm' }
      ],
      labelAttributes: [
        { label: '通用', value: 'common' },
        { label: '个性', value: 'special' }
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
        ]
      },
      form: {
        label_type: 'manual',
        label_attribute: 'common',
        create_type: '', // 对前端来说没有意义，编辑时会有值
        label_name: '',
        valid_time_begin: '',
        valid_time_end: '',
        label_desc: '',
        label_class_def_id: ''
      },
      pickerOptions: {
        disabledDate: this.disabledDate
      },
      actionType: 'add',
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
    if (!this.$route.query.view) this.actionType = 'edit'
  },
  methods: {
    getClassTree() {
      getClassTree({ brand_code: this.brand_code }).then(res => {
        if (res.data.length) {
          res.data.forEach(ele => {
            if (ele.id === this.form.label_class_def_id) {
              this.form.label_class_def_id = ele.class_name
            } else {
              if (ele.children.length) {
                ele.children = ele.children.filter(x => !!x)
                ele.children.forEach(child => {
                  if (child.id === this.form.label_class_def_id) {
                    this.form.label_class_def_id = child.class_name
                  } else {
                    if (child.children.length) {
                      child.children = child.children.filter(x => !!x)
                      child.children.forEach(last => {
                        if (last.id === this.form.label_class_def_id) this.form.label_class_def_id = last.class_name
                      })
                    }
                  }
                })
              }
            }
          })
        }
      })
    },
    init() {
      getAttrBrandLabel({ id: this.$route.query.id, create_type: this.$route.query.create_type }).then((res) => {
        var data = res.data
        this.getClassTree()
        if (data) {
          this.form.label_type = data.label_type
          this.form.label_attribute = data.label_attribute
          this.form.valid_time_begin = data.valid_time_begin
          this.form.valid_time_end = data.valid_time_end
          this.form.create_type = data.create_type
          this.form.label_name = data.label_name
          this.form.label_desc = data.label_desc
          this.form.label_class_def_id = data.label_class_def_id
        }
      })
    },
    confirmHandler() {
      this.$router.push({ name: 'brandLabelPool' })
      if (this.actionLoading === true) return
      // this.$refs['form'].validate((valid) => {
      //   if (!valid) return
      //   var params = {
      //     id: this.form.id,
      //     create_type: this.form.create_type,
      //     label_desc: this.form.label_desc,
      //     rule_list: this.form.rule_list
      //   }

      //   if (this.form.valid_time_begin || this.form.valid_time_end) {
      //     if (!this.form.valid_time_begin) {
      //       this.$message({
      //         type: 'error',
      //         message: '请填写有效开始时间'
      //       })
      //       return
      //     }

      //     if (!this.form.valid_time_end) {
      //       this.$message({
      //         type: 'error',
      //         message: '请填写有效结束日期'
      //       })
      //       return
      //     }

      //     if (new Date(this.form.valid_time_begin).Format('yyyy-MM-dd hh:mm:ss') > new Date(this.form.valid_time_end).Format('yyyy-MM-dd hh:mm:ss')) {
      //       this.$message({
      //         type: 'error',
      //         message: '有效开始时间不能小于有效结束日期'
      //       })
      //       return
      //     }

      //     params.valid_time_begin = this.form.valid_time_begin
      //     params.valid_time_end = this.form.valid_time_end
      //   }
      //   this.actionLoading = true
      //   editComplexBrandLabel(params).then((res) => {
      //     this.actionLoading = false
      //     this.$router.push({ name: 'brandLabelPool' })
      //   })
      // })
    },
    cancel() {
      this.$router.push({ name: 'brandLabelPool' })
    }
  }
}
</script>
<style>
.page-container{
  height: 100%;
  background: white;
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
</style>
