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
              <el-form-item label="条件属性" prop="label_attribute">
                <el-select v-model="form.label_attribute" disabled style="width: 100%;">
                  <el-option v-for="(labelAttribute, index) in labelAttributes" :key="index" :label="labelAttribute.label" :value="labelAttribute.value"/>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="条件类目" prop="label_class_def_id">
                <el-select v-model="form.label_class_def_id" disabled style="width: 100%;">
                  <el-option v-for="(labelAttribute, index) in label_class_def_id" :key="index" :label="labelAttribute.label" :value="labelAttribute.value"/>
                </el-select>
              </el-form-item>
            </el-col>

          </el-row>
          <el-row :gutter="20">
            <el-col :span="8">
              <el-form-item label="条件名称" prop="label_name">
                <el-input v-model="form.label_name" disabled maxlength="50" clearable/>
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
      <el-button :disabled="actionType == 'add'" size="small" type="primary" @click="cancel">{{ $t('form.save') }}</el-button>
    </div>
  </div>
</template>
<script>
import { getManualBrandLabel, getClassTree } from '@/api/brandLabelPool'
import { mapState } from 'vuex'

export default {
  name: 'ManualBrandLabelView',
  data() {
    return {
      labelTypes: [
        { label: '手工条件', value: 'manual' },
        { label: '规则条件', value: 'rule' },
        { label: '复合条件', value: 'complex' },
        { label: '属性条件', value: 'attribute' },
        { label: '模型条件', value: 'rfm' }
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
      label_class_def_id: [],
      form: {
        label_type: 'manual',
        label_attribute: 'common',
        label_name: '',
        valid_time_begin: '',
        valid_time_end: '',
        label_desc: '',
        label_class_def_id: ''
      },
      pickerOptions: {
        disabledDate: this.disabledDate
      },
      actionType: 'add', // add, edit
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
      getManualBrandLabel({ id: this.$route.query.id, create_type: 'manual' }).then((res) => {
        this.getClassTree()
        var data = res.data
        this.form.label_type = data.label_type
        this.form.label_attribute = data.label_attribute
        this.form.label_name = data.label_name
        this.form.valid_time_begin = data.valid_time_begin
        this.form.valid_time_end = data.valid_time_end
        this.form.label_desc = data.label_desc
        this.form.label_class_def_id = data.label_class_def_id
      })
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
