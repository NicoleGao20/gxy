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
                <el-input v-model="form.label_desc" disabled maxlength="400" placeholder="标签说明,最多可以填400字"/>
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
              <!-- <el-button type="primary" @click="addLable">新增</el-button> -->
              <el-table :data="form.rule_list" style="margin-top: 10px;">
                <el-table-column label="序号" type="index"/>
                <el-table-column prop="label_value" property="content" label="标签内容"/>
                <el-table-column label="操作">
                  <template slot-scope="scope">
                    <!-- <el-button type="text" @click="edit(scope.row)">编辑</el-button>
                    <el-button type="text" @click="edit(scope.row)">保存</el-button>
                    <el-button type="text" @click="del(scope.$index)">删除</el-button> -->
                    <el-button v-if="actionType !== 'add'" type="text" @click="setGroup(scope.row,scope.$index, false)">编辑</el-button>
                    <el-button v-else type="text" @click="setGroup(scope.row,scope.$index, true)">查看</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-col>
          </el-row>
        </div>
        <el-dialog :visible.sync="openFilterModal" title="条件值设置" width="900px">
          <el-form v-if="openFilterModal" ref="curRuleRow" :model="curRow" label-width="100px">
            <el-form-item
              :rules="{
                required: true, message: '请填写标签内容', trigger: 'change'
              }"
              prop="label_value"
              label="条件内容">
              <el-input v-model="curRow.label_value" :disabled="readOnly"/>
            </el-form-item>
          </el-form>
          <rule-filter v-if="openFilterModal" ref="ruleFilter" :rule-value="curRow.label_rule" :brand_code="form.brand_code" :only-read="readOnly" :id="form.id" :label_value="curRow.label_value" application-type="complex_label"/>
          <span slot="footer" class="dialog-footer">
            <el-button @click="caculatorPeople">计算人数</el-button>
            <el-button v-if="!readOnly" @click="clearFilterConditions">清空条件</el-button>
            <el-button @click="openFilterModal = false">取消</el-button>
            <el-button type="primary" @click="confirmRuleFilter">确定</el-button>
          </span>
        </el-dialog>
      </el-form>
    </div>
    <div :style="{left: sidebar.opened?'230px': '50px'}" class="action-wrap">
      <el-button size="small" @click="cancel">{{ $t('form.cancel') }}</el-button>
      <el-button :disabled="actionType == 'add'" :loading="actionLoading" size="small" type="primary" @click="confirmHandler">{{ $t('form.save') }}</el-button>
    </div>
  </div>
</template>
<script>
import { getComplexBrandLabel, getClassTree, editRuleBrandLabel } from '@/api/brandLabelPool'
import ruleFilter from '@/components/FilterCombine/ruleFilter'
import { mapState } from 'vuex'

export default {
  name: 'ComplexLabelAdd',
  components: {
    ruleFilter
  },
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
      frequencyTypes: [
        { label: '每天', value: 't_1' },
        { label: '实时', value: 'realtime' }
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
        id: '',
        label_type: 'complex',
        label_attribute: 'common',
        label_name: '',
        label_class_def_id: '',
        // create_type 枚举数据类型 { manual,sql,filter,attribute,algorithm }
        create_type: 'filter', // 规则标签下只有筛选器和sql,新增时默认为筛选器
        valid_time_begin: '',
        valid_time_end: '',
        label_desc: '',
        rule_list: []
      },
      labelData: [],
      pickerOptions: {
        disabledDate: this.disabledDate
      },
      actionType: 'add',
      actionLoading: false,
      openFilterModal: false,
      curRow: {},
      editIndex: '',
      readOnly: false
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
      getComplexBrandLabel({ id: this.$route.query.id, create_type: this.$route.query.create_type })
        .then((res) => {
          this.getClassTree()
          var data = res.data
          if (data) {
            this.form.id = data.id
            this.form.label_name = data.label_name
            this.form.label_type = data.label_type
            this.form.label_attribute = data.label_attribute
            this.form.label_class_def_id = data.label_class_def_id
            this.form.valid_time_begin = data.valid_time_begin
            this.form.valid_time_end = data.valid_time_end
            this.form.label_desc = data.label_desc
            this.form.rule_list = data.slave_infos || []
            this.form.brand_code = data.brand_code
            if (this.form.rule_list.length) {
              this.form.rule_list.forEach(ele => {
                ele.label_rule = JSON.parse(ele.label_rule)
              })
            }
            if (data.slave_infos.length) {
              data.slave_infos.forEach(element => {
                this.labelData.push({ id: element.id, content: element.label_rule })
              })
            }
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
          id: this.form.id,
          label_type: this.form.label_type,
          create_type: this.form.create_type,
          label_desc: this.form.label_desc,
          rule_list: this.form.rule_list
        }

        if (this.form.valid_time_begin && this.form.valid_time_end) {
          if (!this.form.valid_time_begin) {
            this.$message({
              type: 'error',
              message: '请填写有效开始时间'
            })
            return
          }

          if (!this.form.valid_time_end) {
            this.$message({
              type: 'error',
              message: '请填写有效结束日期'
            })
            return
          }

          if (new Date(this.form.valid_time_begin).Format('yyyy-MM-dd hh:mm:ss') > new Date(this.form.valid_time_end).Format('yyyy-MM-dd hh:mm:ss')) {
            this.$message({
              type: 'error',
              message: '有效开始时间不能小于有效结束日期'
            })
            return
          }

          params.valid_time_begin = this.form.valid_time_begin
          params.valid_time_end = this.form.valid_time_end
        } else {
          if (this.form.valid_time_end) params.valid_time_end = this.form.valid_time_end
          if (!this.form.valid_time_begin) {
            params.valid_time_begin = new Date().Format('yyyy-MM-dd hh:mm:ss')
          } else {
            params.valid_time_begin = this.form.valid_time_begin
          }
        }
        this.actionLoading = true
        editRuleBrandLabel(params).then((res) => {
          this.actionLoading = false
          this.$router.push({ name: 'brandLabelPool' })
        })
      })
    },
    // addLable() {
    //   var curRow = {
    //     label_value: '',
    //     label_rule: {}
    //   }
    //   this.curRow = curRow
    //   this.openFilterModal = true
    // },
    setGroup(curRow, index, readOnly) {
      this.curRow = curRow
      this.editIndex = index
      this.openFilterModal = true
      this.readOnly = readOnly
    },
    clearFilterConditions() {
      this.$refs['ruleFilter'].clearCondtions()
    },
    caculatorPeople() {
      this.$refs['ruleFilter'].runFilterCombineSql()
    },
    confirmRuleFilter() {
      this.$refs['curRuleRow'].validate((valid) => {
        if (!valid) return
        this.$refs['ruleFilter'].validateRuleValue().then(() => {
          this.curRow.label_rule = this.$refs['ruleFilter'].getFilterJson()
          if (this.editIndex !== '') {
            if (this.curRow.id) this.form.rule_list[this.editIndex].id = this.curRow.id
            this.form.rule_list[this.editIndex].label_rule = this.curRow.label_rule
            this.form.rule_list[this.editIndex].label_value = this.curRow.label_value
            this.editIndex = ''
          } else {
            this.form.rule_list.push(this.curRow)
          }
          this.openFilterModal = false
        }, () => {

        })
      })
    },
    cancel() {
      this.$router.push({ name: 'brandLabelPool' })
    },
    addLable() {
      this.labelData.push({ content: '' })
    },
    del(index) {
      this.labelData.splice(index, 1)
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
