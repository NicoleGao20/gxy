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
                  <el-option v-for="(frequencyType, index) in frequencyTypes" :key="index" :label="frequencyType.label" :value="frequencyType.value"/>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="24">
              <el-form-item label="条件说明" prop="label_desc">
                <el-input v-model="form.label_desc" :rows="4" disabled maxlength="400" placeholder="条件说明,最多可以填400字"/>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        <el-form-item label="自定义sql">
          <el-input v-model="form.label_sql" disabled type="textarea" suffix-icon="el-icon-timer"/>
        </el-form-item>
      </el-form>
    </div>
    <div :style="{left: sidebar.opened?'230px': '50px'}" class="action-wrap">
      <el-button size="small" @click="cancel">{{ $t('form.cancel') }}</el-button>
      <el-button :disabled="actionType == 'add'" :loading="actionLoading" size="small" type="primary" @click="confirmHandler">{{ $t('form.save') }}</el-button>
    </div>
  </div>
</template>
<script>
import { getRuleBrandLabel, getClassTree, editRuleBrandLabel } from '@/api/brandLabelPool'
import { mapState } from 'vuex'

export default {
  name: 'RuleLabelAdd',
  data() {
    return {
      labelTypes: [
        { label: '手工标签', value: 'manual' },
        { label: '规则标签', value: 'rule' },
        { label: '复合标签', value: 'complex' }
      ],
      labelAttributes: [
        { label: '通用', value: 'common' },
        { label: '个性', value: 'special' }
      ],
      frequencyTypes: [
        { label: '每天', value: 't_1' },
        { label: '实时', value: 'realtime' }
      ],
      rules: {
        label_type: [
          { required: true, message: '请选择条件类型', trigger: 'change' }
        ],
        label_attribute: [
          { required: true, message: '请选择条件属性', trigger: 'change' }
        ],
        label_name: [
          { required: true, message: '请填写条件名称', trigger: 'change' }
        ],
        update_frequency: [
          { required: true, message: '请选择更新频次', trigger: 'change' }
        ]
      },
      form: {
        id: '',
        label_type: 'rule',
        label_attribute: 'common',
        label_name: '',
        label_class_def_id: '',
        // create_type 枚举数据类型 { manual,sql,filter,attribute,algorithm }
        create_type: 'sql', // 规则标签下只有筛选器和sql,新增时默认为筛选器
        update_frequency: '',
        label_sql: '',
        label_desc: ''
      },
      labelData: [
        {
          content: '第一条'
        }, {
          content: '第二条'
        }
      ],
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
      getRuleBrandLabel({ id: this.$route.query.id, create_type: this.$route.query.create_type })
        .then((res) => {
          this.getClassTree()
          var data = res.data
          if (data) {
            this.form.id = data.id
            this.form.label_type = data.label_type
            this.form.label_attribute = data.label_attribute
            this.form.label_sql = data.label_sql
            this.form.label_name = data.label_name
            this.form.label_class_def_id = data.label_class_def_id
            this.form.label_desc = data.label_desc
            this.form.update_frequency = data.update_frequency
          }
        })
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
          label_name: this.form.label_name,
          label_desc: this.form.label_desc,
          update_frequency: this.form.update_frequency
        }

        this.actionLoading = true
        params.id = this.$route.query.id
        editRuleBrandLabel(params).then((res) => {
          this.actionLoading = false
          this.$router.push({ name: 'brandLabelPool' })
        })
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
