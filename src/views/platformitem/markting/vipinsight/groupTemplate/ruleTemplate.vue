<template>
  <div class="page-container-gap">
    <section>
      <header>
        <el-form ref="form" :model="searchForm" :rules="rules" label-position="right" label-width="80px">
          <div class="label-title">
            <i class="linev-tip"/><span class="label-desc">基本信息</span>
            <span class="info_tip">* 为必填</span>
          </div>
          <el-row :gutter="20">
            <el-col :span="8">
              <el-form-item label="模版名称" prop="group_name">
                <el-input :disabled="readOnly" v-model.trim="searchForm.group_name" maxlength="49" clearable placeholder="请输入模版名称"/>
              </el-form-item>
            </el-col>
            <!-- <el-col :span="8">
              <el-form-item label="创建方式">
                <el-select v-model="searchForm.create_type" style="width: 100%;" clearable placeholder="请选择" disabled>
                  <el-option
                    v-for="(labelType, index) in create_type_list"
                    :key="index"
                    :label="labelType.label"
                    :value="labelType.value"
                  />
                </el-select>
              </el-form-item>
            </el-col> -->
            <el-col :span="8">
              <el-form-item label="受众属性" prop="group_attribute">
                <el-select :disabled="readOnly" v-model="searchForm.group_attribute" style="width: 100%;" clearable placeholder="请选择">
                  <el-option
                    v-for="(labelType, index) in group_type_list"
                    :key="index"
                    :label="labelType.label"
                    :value="labelType.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="受众目的" prop="group_purpose">
                <el-select :disabled="readOnly" v-model="searchForm.group_purpose" style="width: 100%;" clearable placeholder="请选择">
                  <el-option
                    v-for="(labelType, index) in group_purpose"
                    :key="index"
                    :label="labelType.label"
                    :value="labelType.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          <!-- </el-row>
          <el-row :gutter="20"> -->
            <!-- <el-col v-show="searchForm.group_attribute !== 'static'" :span="8">
              <el-form-item label="更新频次">
                <el-select v-model="searchForm.update_frequency" disabled style="width: 100%;" clearable placeholder="请选择">
                  <el-option
                    v-for="(labelType, index) in update_frequency_list"
                    :key="index"
                    :label="labelType.label"
                    :value="labelType.value"
                  />
                </el-select>
              </el-form-item>
            </el-col> -->
          </el-row>
          <el-row :gutter="20">
            <el-col :span="16">
              <el-form-item label="受众说明">
                <el-input
                  v-model="searchForm.group_desc"
                  :disabled="readOnly"
                  type="textarea"
                  autosize
                  maxlength="400"
                  placeholder="根据具体筛选条件说明受众人群，最多可以填400字"/>
              </el-form-item>
            </el-col>
          </el-row>
          <div class="label-title">
            <i class="linev-tip"/><span class="label-desc">详细规则</span>
          </div>
          <FilterCombine v-if="loaded" ref="groupFilter" :rule-value="searchForm.group_rule" :only-read="readOnly" :hidden-people-counts="true" application-type="complex_group"/>
        </el-form>
      </header>
      <footer :style="{left: sidebar.opened?'230px': '50px'}" class="action-wrap">
        <el-button v-if="!readOnly" :loading="isLoading" type="primary" size="small" class="search-more" @click="save">保 存</el-button>
        <el-button type="primary" size="small" class="search-more" @click="cancel">取 消</el-button>
      </footer>
    </section>
  </div>
</template>
<script>
import { getGroupTemplateDetail, addGroupTemplate, editGroupTemplate } from '@/api/markting/template'
import FilterCombine from '@/componentsMarketing/FilterCombine/ruleFilter'
import { mapState } from 'vuex'

export default {
  components: {
    FilterCombine
  },
  data() {
    return {
      searchForm: {
        group_name: '',
        create_type: 'normal',
        group_purpose: '',
        group_attribute: 'dynamic',
        group_desc: '',
        update_frequency: '',
        group_rule: {}
      },
      isLoading: false,
      routeId: '',
      readOnly: false,
      loaded: false,
      create_type_list: [
        { label: '导入受众', value: 'file_import' },
        { label: '普通受众', value: 'normal' },
        { label: '高级受众', value: 'advanced' }
      ],
      update_frequency_list: [
        { label: '实时', value: 'realtime' },
        { label: '每天', value: 't_1' }
      ],
      rules: {
        group_name: [
          { required: true, message: '请输入受众名称', trigger: 'blur' }
        ],
        create_type: [
          { required: true, message: '请选择创建方式', trigger: 'blur' }
        ],
        group_attribute: [
          { required: true, message: '请选择受众属性', trigger: 'blur' }
        ],
        group_purpose: [
          { required: true, message: '请选择受众目的', trigger: 'blur' }
        ]
      },
      group_type_list: [
        { label: '静态受众', value: 'static' },
        { label: '动态受众', value: 'dynamic' }
      ],
      group_purpose: [
        { label: '常规营销', value: 'regular_marketing' },
        { label: '休眠唤醒', value: 'sleep_wake ' },
        { label: '流失召回', value: 'loss_recall' },
        { label: '店铺引流', value: 'shop_drainage' },
        { label: '活动宣传', value: 'event_promotion' },
        { label: '会员关怀', value: 'member_care' },
        { label: '系统通知', value: 'system_notification' }
      ]
    }
  },
  computed: {
    ...mapState({
      sidebar: state => state.app.sidebar
    })
  },
  mounted() {
    if (this.$route.query.id) {
      if (this.$route.query.view) this.readOnly = true
      this.init()
    } else {
      this.loaded = true
    }
  },
  methods: {
    init() {
      getGroupTemplateDetail({ id: this.$route.query.id }).then(res => {
        // 等量赋值
        if (res.data.id) {
          this.routeId = res.data.id
        } else {
          this.routeId = this.$route.query.id
        }
        this.searchForm.group_name = res.data.group_name
        this.searchForm.group_purpose = res.data.group_purpose
        this.searchForm.group_attribute = res.data.group_attribute
        this.searchForm.group_desc = res.data.group_desc
        this.searchForm.update_frequency = res.data.update_frequency
        this.searchForm.brand_code = res.data.brand_code
        console.log(res.data.group_rule,'res.data.group_rule')
        try {
          this.searchForm.group_rule = JSON.parse(res.data.group_rule)
        } catch (e) {
          this.searchForm.group_rule = {}
        }
        this.loaded = true
      })
    },
    save() {
      this.$refs['form'].validate(vaild => {
        if (!vaild) return
        this.$refs['groupFilter'].validateRuleValue().then(() => {
          this.isLoading = true
          this.searchForm.group_rule = this.$refs['groupFilter'].getFilterJson()
          console.log(this.searchForm.group_rule,'this.searchForm.group_rule')
          if (this.$route.query.id) {
            const params = {
              id: Number(this.routeId),
              ...this.searchForm
            }
            editGroupTemplate(params).then(res => {
              this.$message.success('保存成功!')
              this.isLoading = false
              this.$router.push({ name: 'groupTemplate' })
            }).catch(() => {
              this.isLoading = false
            })
          } else {
            const params = {
              create_region: '华东',
              brand_code: 'belle',
              ...this.searchForm
            }
            addGroupTemplate(params).then(res => {
              this.$message.success('保存成功!')
              this.isLoading = false
              this.$router.push({ name: 'groupTemplate' })
            }).catch(() => {
              this.isLoading = false
            })
          }
        })
      })
    },
    cancel() {
      this.$router.push({ name: 'groupTemplate' })
    },
    caculatorPeople() {
      this.$refs['groupFilter'].runFilterCombineSql()
    }
  }
}
</script>
<style lang="less" scoped>
  .vipinsight-taglist-page {
    width: 100%;
    height: 100%;
    background: #f3f3f3;
    & > section{
      position: relative;
      // padding: 20px;
      height: 100%;
      background: white;
    }
    header,main{
      width: 100%;
      height: auto;
      box-sizing: border-box;
      display: block;
      padding: 20px;
      background: #ffffff;
    }
    header{
      padding-bottom: 60px;
    }
  }
  .search-more{
    border: 1px solid rgba(67,90,130,1);
    background: none;
    color: #435A82;
    // width: 50px;
    &:hover{
      background: #435A82;
      color: white;
    }
    &:disabled{
      border-color: #E4E7ED;
      background: #E4E7ED;
      color: #C0C4CC;
    }
  }
  .label-title {
    height: 16px;
    position: relative;
    line-height: 16px;
    padding-left: 10px;
    margin-bottom: 20px;
    .info_tip{
      color: red;
      font-size: 12px;
      margin-left: 15px;
    }
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
  /deep/ .el-form-item__label {
    color: #666666;
    font-size: 14px;
    font-weight: normal;
    white-space: nowrap;
  }
  footer{
    .el-button--primary, .el-button--default {
      display: inline-block;
      width: 100px;
    }
  }
</style>
