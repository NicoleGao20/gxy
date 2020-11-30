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
              <el-form-item label="模型名称" prop="model_type">
                <el-select v-model="form.model_type" disabled style="width: 100%;">
                  <el-option v-for="(labelType, index) in modelTypes" :key="index" :label="labelType.label" :value="labelType.value"/>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="条件名称" prop="label_name">
                <el-input v-model="form.label_name" maxlength="50" disabled clearable/>
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
            <el-col :span="16">
              <el-form-item label="条件说明" prop="label_desc">
                <el-input v-model="form.label_desc" disabled maxlength="400" placeholder="条件说明,最多可以填400字"/>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        <div class="basic-info">
          <div class="label-title">
            <i class="linev-tip"/><span class="label-desc">条件值定义</span>
          </div>
          <div class="table-contain" style="display:flex;">
            <div class="left">
              <el-table
                :data="average"
                border
                style="width: 100%">
                <el-table-column
                  prop="r_value"
                  label="建议平均R"
                  align="center"
                  width="80" >
                  <template slot-scope="scope">
                    <span>{{ scope.row.r_value.toFixed(2) }} </span>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="f_value"
                  label="建议平均F"
                  align="center"
                  width="80" >
                  <template slot-scope="scope">
                    <span>{{ scope.row.f_value.toFixed(2) }} </span>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="m_value"
                  align="center"
                  label="建议平均M" >
                  <template slot-scope="scope">
                    <span>{{ scope.row.m_value.toFixed(2) }} </span>
                  </template>
                </el-table-column>
              </el-table>
              <el-table
                :data="averageVal"
                border
                style="width: 100%;margin-top:20px;">
                <el-table-column
                  prop="input_type"
                  label="平均R"
                  align="center"
                  width="80">
                  <template slot-scope="scope">
                    <span v-if="actionType == 'add'">{{ scope.row.r_value_set.toFixed(2) }} </span>
                    <el-input v-else :readonly="checkbox" v-model="scope.row.r_value_set"/>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="input_type"
                  label="平均F"
                  align="center"
                  width="80">
                  <template slot-scope="scope">
                    <span v-if="actionType == 'add'">{{ scope.row.f_value_set.toFixed(2) }} </span>
                    <el-input v-else :readonly="checkbox" v-model="scope.row.f_value_set"/>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="input_type"
                  align="center"
                  label="平均M">
                  <template slot-scope="scope">
                    <span v-if="actionType == 'add'">{{ scope.row.m_value_set.toFixed(2) }} </span>
                    <el-input v-else :readonly="checkbox" v-model="scope.row.m_value_set"/>
                  </template>
                </el-table-column>
              </el-table>
              <el-checkbox :disabled="actionType == 'add'" v-model="checkbox" style="margin-top:25px;">使用建议值</el-checkbox>
            </div>
            <div class="right">
              <el-table
                :data="tableData"
                border
                style="width: 50%">
                <el-table-column
                  prop="R"
                  label="R平均"
                  align="center"
                  width="100"/>
                <el-table-column
                  prop="F"
                  label="F平均"
                  align="center"
                  width="100"/>
                <el-table-column
                  prop="M"
                  label="M平均"
                  align="center"
                  width="100"/>
                <el-table-column
                  prop="label"
                  align="center"
                  label="标签"/>
              </el-table>
            </div>
          </div>
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
import { getModelBrandLabel, getClassTree, editModelBrandLabel } from '@/api/brandLabelPool'
import { mapState } from 'vuex'

export default {
  name: 'RfmBrandLabelAdd',
  data() {
    return {
      labelTypes: [
        { label: '手工条件', value: 'manual' },
        { label: '规则条件', value: 'rule' },
        { label: '复合条件', value: 'complex' },
        { label: '属性条件', value: 'attribute' },
        { label: '模型条件', value: 'model' }
      ],
      modelTypes: [
        { label: 'rfm模型', value: 'rfm' }
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
        input_type: [
          { required: true, message: '请输入平均值', trigger: 'change' }
        ]
      },
      tableData: [{
        R: '高', F: '高', M: '高',
        label: '重要价值客户'
      }, {
        R: '高', F: '低', M: '高',
        label: '重要发展客户'
      }, {
        R: '高', F: '高', M: '低',
        label: '重要保持客户'
      }, {
        R: '高', F: '低', M: '低',
        label: '重要挽留客户'
      }, {
        R: '低', F: '高', M: '高',
        label: '一般价值客户'
      }, {
        R: '低', F: '低', M: '高',
        label: '一般发展客户'
      }, {
        R: '低', F: '高', M: '低',
        label: '一般保持客户'
      }, {
        R: '低', F: '低', M: '低',
        label: '一般挽留客户'
      }],
      average: [{
        r_value: '0', f_value: '0', m_value: '0'
      }],
      averageVal: [{
        r_value_set: '0', f_value_set: '0', m_value_set: '0'
      }],
      checkbox: false,
      form: {
        id: '',
        label_type: 'manual',
        label_attribute: 'common',
        label_name: '',
        model_type: '',
        label_class_def_id: '',
        // create_type 枚举数据类型 { manual,sql,filter,attribute,algorithm }
        create_type: this.$route.query.create_type, // 规则标签下只有筛选器和sql,新增时默认为筛选器
        label_desc: ''
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
  watch: {
    checkbox(val) {
      if (val) {
        this.averageVal[0].r_value_set = this.average[0].r_value
        this.averageVal[0].f_value_set = this.average[0].f_value
        this.averageVal[0].m_value_set = this.average[0].m_value
      } else {
        this.averageVal[0].r_value_set = ''
        this.averageVal[0].f_value_set = ''
        this.averageVal[0].m_value_set = ''
      }
    }
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
      if (this.$route.query.id) {
        getModelBrandLabel({ id: this.$route.query.id, create_type: this.$route.query.create_type })
          .then((res) => {
            this.getClassTree()

            var data = res.data
            this.form.id = data.id
            this.form.label_type = data.label_type
            this.form.model_type = data.model_type
            this.form.label_class_def_id = data.label_class_def_id
            this.form.label_attribute = data.label_attribute
            this.form.label_name = data.label_name
            this.form.label_desc = data.label_desc
            this.average[0].r_value = data.slave_infos[0].r_value
            this.average[0].f_value = data.slave_infos[0].f_value
            this.average[0].m_value = data.slave_infos[0].m_value
            if (data.slave_infos[0].r_value_set) {
              this.averageVal[0].r_value_set = data.slave_infos[0].r_value_set
              this.averageVal[0].f_value_set = data.slave_infos[0].f_value_set
              this.averageVal[0].m_value_set = data.slave_infos[0].m_value_set
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
          id: this.form.id,
          label_desc: this.form.label_desc,
          create_type: this.form.create_type,
          is_use_suggest: this.checkbox,
          r_value_set: this.averageVal[0].r_value_set,
          f_value_set: this.averageVal[0].f_value_set,
          m_value_set: this.averageVal[0].m_value_set
        }

        if (!this.averageVal[0].r_value_set || !this.averageVal[0].f_value_set || !this.averageVal[0].m_value_set) {
          this.$message({
            type: 'error',
            message: '请填写平均值'
          })
          return
        }
        this.actionLoading = true

        if (this.$route.query.id) {
          editModelBrandLabel(params).then(() => {
            this.actionLoading = false
            this.$router.push({ name: 'brandLabelPool' })
          })
        }
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
.table-contain{
  display: flex;
  margin-top: 25px;
}
.table-contain .right{
  flex: 1;
  /* display: flex; */
  /* justify-content: center; */
}
.table-contain .el-table,.table-contain .el-checkbox{
  margin: 0px 25%;
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
