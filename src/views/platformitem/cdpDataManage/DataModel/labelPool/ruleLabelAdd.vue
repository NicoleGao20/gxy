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
              <el-form-item label="标签类型" prop="label_type">
                <el-select v-model="form.label_type" disabled style="width: 100%;">
                  <el-option v-for="(labelType, index) in labelTypes" :key="index" :label="labelType.label" :value="labelType.value"/>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="标签属性" prop="label_attribute">
                <el-select v-model="form.label_attribute" :disabled="actionType === 'edit'" style="width: 100%;">
                  <el-option v-for="(labelAttribute, index) in labelAttributes" :key="index" :label="labelAttribute.label" :value="labelAttribute.value"/>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="标签名称" prop="label_name">
                <el-input v-model.trim="form.label_name" :disabled="(actionType === 'edit' && getBrand_info.length > 0) || $route.query.view === 'true'" maxlength="50" clearable/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col v-if="form.create_type !== 'sql'" :span="8">
              <el-form-item label="更新频次" prop="update_frequency">
                <el-select :disabled="$route.query.view === 'true'" v-model="form.update_frequency" style="width: 100%;">
                  <el-option v-for="(frequencyType, index) in frequencyTypes" :key="index" :label="frequencyType.label" :value="frequencyType.value"/>
                </el-select>
              </el-form-item>
            </el-col>
            <!-- <el-col v-if="form.create_type !== 'sql'" :span="8">
              <el-form-item label="更新时间">
                <el-input v-model="form.data_update_time_pre" disabled suffix-icon="el-icon-timer"/>
              </el-form-item>
            </el-col> -->
            <el-col v-if="form.create_type !== 'sql'" :span="8">
              <el-form-item label="有效开始日期" prop="valid_time_begin">
                <el-date-picker
                  :disabled="$route.query.view === 'true'"
                  v-model="form.valid_time_begin"
                  :append-to-body="false"
                  style="width: 100%;"
                  type="date"
                  value-format="yyyy-MM-dd"
                  format="yyyy-MM-dd"
                  placeholder="有效开始日期"
                  clearable
                />
              </el-form-item>
            </el-col>
            <el-col v-if="form.create_type !== 'sql'" :span="8">
              <el-form-item label="有效结束日期" prop="valid_time_end">
                <el-date-picker
                  :disabled="$route.query.view === 'true'"
                  v-model="form.valid_time_end"
                  :append-to-body="false"
                  :picker-options="pickerOptions"
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
              <el-form-item label="标签说明" prop="label_desc">
                <el-input v-model="form.label_desc" :disabled="$route.query.view === 'true'" maxlength="400" placeholder="标签说明,最多可以填400字"/>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        <el-row :gutter="20">
          <el-col :span="16">
            <el-form-item v-if="form.create_type === 'sql'" label="自定义sql">
              <el-input v-model="form.label_sql" :rows="4" disabled type="textarea"/>
            </el-form-item>
          </el-col>
        </el-row>
        <div v-if="form.create_type === 'filter'" class="basic-info">
          <div class="label-title">
            <i class="linev-tip"/><span class="label-desc">标签值定义</span>
          </div>
          <el-row :gutter="20" style="padding-left: 10px;margin-top: 10px;">
            <el-col :span="24">
              <el-button :disabled="$route.query.view === 'true'" type="primary" @click="addLable">新增</el-button>
              <el-table :data="form.rule_list" style="margin-top: 10px;">
                <el-table-column label="序号" type="index"/>
                <el-table-column label="标签内容" prop="label_value"/>
                <el-table-column label="操作">
                  <template slot-scope="scope">
                    <el-button type="text" @click="setGroup(scope.row,scope.$index,true)">查看</el-button>
                    <el-button :disabled="$route.query.view === 'true'" type="text" @click="setGroup(scope.row,scope.$index, false)">编辑</el-button>
                    <el-button :disabled="$route.query.view === 'true' || (scope.row.id && getBrand_info.length > 0) || form.isDependenced" type="text" class="deleteFontColor" @click="del(scope.$index)">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-col>
          </el-row>
        </div>
        <div class="basic-info" style="margin-top: 20px;">
          <div class="label-title">
            <i class="linev-tip"/><span class="label-desc">应用品牌</span>
          </div>
          <div style="margin-top: 10px;padding-left: 10px;">
            <el-button :disabled="(!form.rule_list.length > 0 && form.create_type !== 'sql') || $route.query.view === 'true' || isTimeOut" type="primary" @click="choseBrand">选择品牌</el-button>
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
    <el-dialog :visible.sync="openFilterModal" :close-on-click-modal="false" title="标签值设置" width="900px">
      <el-form ref="curRuleRow" :model="curRow" label-width="100px">
        <el-form-item
          :rules="{
            required: true, message: '请填写标签内容', trigger: 'change'
          }"
          prop="label_value"
          label="标签内容">
          <el-input v-model="curRow.label_value" :disabled="(readOnly || curRow.id) ? true:false"/>
        </el-form-item>
      </el-form>
      <rule-filter v-if="openFilterModal" ref="ruleFilter" :rule-value="curRow.label_rule" :hidden-people-counts="true" :only-read="readOnly" application-type="rule_label"/>
      <span slot="footer" class="dialog-footer">
        <el-button v-if="!readOnly" @click="clearFilterConditions">清空条件</el-button>
        <el-button @click="openFilterModal = false">取消</el-button>
        <el-button v-if="!readOnly" type="primary" @click="confirmRuleFilter">确定</el-button>
      </span>
    </el-dialog>
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
import ruleFilter from '@/components/FilterCombine/ruleFilter'
import issuedLabel from '@/components/issuedLabel'
import { addRuleLabel, editRuleLabel, getRuleLabel } from '@/api/labelPool'
import { queryBrandList } from '@/api/employ'
import { mapState } from 'vuex'

export default {
  name: 'RuleLabelAdd',
  components: {
    ruleFilter,
    issuedLabel
  },
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
          { required: true, message: '请填写标签名称', trigger: ['change', 'blur'] }
        ],
        update_frequency: [
          { required: true, message: '请选择更新频次', trigger: 'change' }
        ]
      },
      form: {
        label_type: 'rule',
        label_attribute: 'common',
        label_name: '',
        // create_type 枚举数据类型 { manual, sql, filter, attribute, algorithm }
        create_type: '',
        label_value_type: '',
        valid_time_begin: '',
        valid_time_end: '',
        label_desc: '',
        update_time: '',
        label_sql: '',
        update_frequency: 't_1', // 更新频次
        rule_list: [],
        brand_info: [] // 品牌
      },
      getBrand_info: [],
      labelData: [],
      dynamicTags: [],
      choseBrandStatus: false,
      pickerOptions: {
        disabledDate: this.disabledDate
      },
      pickerOptionsStart: {
        disabledDate: this.disabledDateStart
      },
      actionType: 'add',
      actionLoading: false,
      openFilterModal: false,
      curRow: {},
      isTimeOut: false,
      editIndex: '',
      readOnly: false
    }
  },
  computed: {
    ...mapState({
      sidebar: state => state.app.sidebar
    })
  },
  watch: {
    'form.valid_time_end'(val) {
      if (val) {
        if (new Date(val).getTime() + 86399000 < new Date().getTime()) {
          this.isTimeOut = true
        } else {
          this.isTimeOut = false
        }
      } else {
        this.isTimeOut = false
      }
    }
  },
  mounted() {
    this.init()
    if (this.$route.query.create_type) {
      if (this.$route.query.create_type === 'sql') {
        this.form.create_type = 'sql'
      } else {
        this.form.create_type = 'filter'
      }
    } else {
      this.form.create_type = 'filter'
    }
    if (!this.$route.query.id) {
      this.actionType = 'add'
    } else {
      this.actionType = 'edit'
    }
  },
  methods: {
    init() {
      if (this.$route.query.id) {
        getRuleLabel({ id: this.$route.query.id, create_type: this.$route.query.create_type })
          .then((res) => {
            var data = res.data
            if (data) {
              this.form.label_type = data.label_type
              this.form.label_attribute = data.label_attribute
              this.form.data_update_time_pre = data.data_update_time_pre
              this.form.label_name = data.label_name
              this.form.isDependenced = data.isDependenced
              this.form.label_value_type = data.label_value_type
              this.form.create_type = data.create_type || this.$route.query.create_type
              this.form.valid_time_begin = data.valid_time_begin
              this.form.valid_time_end = data.valid_time_end
              this.form.label_sql = data.label_sql
              this.form.label_desc = data.label_desc
              this.form.update_time = data.update_time
              this.form.update_frequency = data.update_frequency
              this.form.rule_list = data.slave_tables || []
              if (this.form.rule_list.length) {
                this.form.rule_list.forEach(ele => {
                  ele.label_rule = JSON.parse(ele.label_rule)
                })
              }
              this.form.brand_info = data.brand_info || []
              this.getBrand_info = data.brand_info || []
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
            }
          })
      }
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
    choseBrand() {
      this.choseBrandStatus = true
    },
    changeData(data) {
      this.choseBrandStatus = data
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
    disabledDate(date) {
      if (new Date(date).Format('yyyy-MM-dd') < new Date(new Date().getTime() + 86400000).Format('yyyy-MM-dd')) {
        return true
      } else {
        return false
      }
    },
    disabledDateStart(date) {
      if (new Date(date).getTime() > new Date().getTime()) {
        return true
      } else {
        return false
      }
    },
    confirmHandler() {
      if (this.actionLoading === true) return
      this.$refs['form'].validate((valid) => {
        if (!valid) {
          return
        }
        var params = {
          label_type: this.form.label_type,
          label_attribute: this.form.label_attribute,
          label_name: this.form.label_name,
          label_value_type: this.form.label_value_type,
          create_type: this.form.create_type || this.$route.query.create_type,
          label_desc: this.form.label_desc,
          update_frequency: this.form.update_frequency,
          brand_info: this.form.brand_info
        }
        if (this.form.create_type === 'sql') {
          // params.label_sql = this.form.label_sql
        } else {
          params.rule_list = this.form.rule_list
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
            params.valid_time_begin = new Date().Format('yyyy-MM-dd')
          } else {
            params.valid_time_begin = this.form.valid_time_begin
          }
        }

        this.actionLoading = true
        if (!this.$route.query.id) {
          addRuleLabel(params).then((res) => {
            this.actionLoading = false
            this.$message({
              message: '保存成功!',
              type: 'success',
              duration: 1000
            })
            setTimeout(() => {
              this.$router.push({ name: 'labelPool' })
            }, 500)
          }).catch(fail => {
            this.actionLoading = false
          })
        } else {
          params.id = this.$route.query.id
          editRuleLabel(params).then((res) => {
            this.actionLoading = false
            this.$message({
              message: '编辑成功!',
              type: 'success',
              duration: 1000
            })
            setTimeout(() => {
              this.$router.push({ name: 'labelPool' })
            }, 500)
          }).catch(fail => {
            this.actionLoading = false
          })
        }
      })
    },
    cancel() {
      this.$router.push({ name: 'labelPool' })
    },
    addLable() {
      this.editIndex = ''
      var curRow = {
        label_value: '',
        label_rule: {}
      }
      // this.form.rule_list.push(curRow)
      this.curRow = curRow
      this.openFilterModal = true
      this.readOnly = false
    },
    del(index) {
      this.$confirm('确认删除数据？', '确认提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.form.rule_list.splice(index, 1)
        if (!this.form.rule_list.length && this.form.brand_info.length) {
          this.form.brand_info = []
          this.dynamicTags = []
        }
      })
    },
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
      const arr = []
      this.form.rule_list.forEach((rule, index) => {
        if (this.curRow.id) { // 以保存
          if (this.curRow.id !== rule.id) arr.push(rule)
        } else { // 未保存
          if (this.editIndex >= 0) {
            if (this.editIndex !== index) arr.push(rule)
          } else {
            arr.push(rule)
          }
        }
      })
      var type = ''
      arr.forEach(data => {
        if (data.label_value === this.curRow.label_value) {
          type = 'error'
          this.$message({
            message: '标签内容不可重复!',
            type: 'error',
            duration: 1000
          })
        }
      })
      if (type === 'error') return
      this.$refs['curRuleRow'].validate((valid) => {
        if (!valid) return
        this.$refs['ruleFilter'].validateRuleValue().then(() => {
          this.curRow.label_rule = this.$refs['ruleFilter'].getFilterJson()
          if (this.editIndex !== '') {
            if (this.curRow.id) this.form.rule_list[this.editIndex].id = this.curRow.id
            this.form.rule_list[this.editIndex].label_rule = this.curRow.label_rule
            this.form.rule_list[this.editIndex].label_value = this.curRow.label_value
          } else {
            this.form.rule_list.push(this.curRow)
          }
          this.editIndex = ''
          this.openFilterModal = false
        }, () => {

        })
      })
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
