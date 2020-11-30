<template>
  <div class="page-ordinary">
    <section>
      <header>
        <el-form ref="form" :model="searchForm" :rules="rules" label-position="right" label-width="80px">
          <div class="label-title">
            <i class="linev-tip"/><span class="label-desc">基本信息</span>
          </div>
          <el-row :gutter="20">
            <el-col :span="8">
              <!-- 受众名称--普通受众 -->
              <el-form-item label="受众名称" prop="group_name">
                <el-input :disabled="readOnly" v-model.trim="searchForm.group_name" maxlength="50" clearable />
              </el-form-item>
            </el-col>
            <el-col :span="8">
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
            </el-col>
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
          </el-row>
          <el-row :gutter="20">
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
            <el-col v-show="searchForm.group_attribute !== 'static' && $route.query.id" :span="8">
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
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="24">
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
          <FilterCombine v-if="loaded" ref="groupFilter" :rule-value="searchForm.group_rule" :only-read="readOnly" :id="searchForm.id" application-type="group"/>
        </el-form>
      </header>
    </section>
    <footer :style="{left: sidebar.opened?'230px': '50px'}" class="form_footer">
      <el-button :loading="isLoading" type="primary" size="small" class="search-more" @click="caculatorPeople">计算人数</el-button>
      <el-button v-if="!readOnly" :loading="isLoading" type="primary" size="small" class="search-more" @click="drawerTo">查看画像</el-button>
      <el-button :loading="isLoading" :disabled="readOnly" type="primary" size="small" class="search-more" @click="save('stopped')">保存草稿</el-button>
      <el-button :loading="isLoading" :disabled="readOnly" type="primary" size="small" class="search-more" @click="save('started')">保存并启用</el-button>
      <el-button :loading="isLoading" type="primary" size="small" class="search-more" @click="cancel">取消</el-button>
      <el-button v-if="!readOnly" :loading="isLoading" type="primary" size="small" class="search-more" @click="crowdMultitude">人群推送</el-button>
    </footer>
    <!-- <el-drawer
      :visible.sync="drawer"
      :with-header="false"
      title="群像分析"
      size="90%">
      <span>
        <crm-group-portraint v-if="drawer" :filter-json="filterJson" link_resource="group"/>
      </span>
    </el-drawer> -->
    <el-drawer :visible.sync="drawer" :with-header="false" size="90%">
        <div slot="title" class="drawerTitle">群像分析</div>
        <user-portrait/>
      </el-drawer>
    <el-dialog :visible.sync="dialogCrowd" title="创建推送功能" width="700px" :before-close="handleClose">
      <ul class="page-tool">
        <router-link v-for="item in dateAddedList" :to="{name:'newJingdongShufang'}" :key="item.id">
          <li>
            <div class="page-img">
              <img :src="item.icon_url" alt >
            </div>
            <div class="page-signal">
              <span>{{ item.integ_channel_name }}</span>
              <span>{{ item.chl_desc }}</span>
            </div>
          </li>
        </router-link>
      </ul>
    </el-dialog>
  </div>
</template>
<script>
import { insertGroupByFilter, getGroupDetails, editFilterGroup } from '@/api/markting/vinpinsightGrouplist'
import FilterCombine from '@/componentsMarketing/FilterCombine/ruleFilter'
import crmGroupPortraint from '@/views/platformitem/markting/dataAnalysis/crmGroupPortrait/index'
import userPortrait from "@/views/platformitem/insight/user/Userface.vue";
import { mapState } from 'vuex'
import { getType } from '@/api/security/visit'
import './scss/components.scss'
import Cookies from 'js-cookie'
export default {
  components: {
    FilterCombine,
    crmGroupPortraint,
    userPortrait
  },
  data() {
    return {
      drawer: false,
      filterJson: '',
      searchForm: {
        group_name: '',
        create_type: 'normal',
        group_purpose: '',
        group_attribute: 'static',
        group_desc: '',
        update_frequency: '',
        group_rule: null
      },
      loaded: false,
      isLoading: false,
      readOnly: false,
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
      ],
      dialogCrowd: false,
      dateAddedList: [] // 人群推送
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
    this.multitude()
  },
  methods: {
    init() {
      getGroupDetails({ id: this.$route.query.id, group_type: this.$route.query.group_type }).then(res => {
        // 等量赋值
        this.searchForm.id = res.data.id
        this.searchForm.group_name = res.data.group_name
        this.searchForm.group_purpose = res.data.group_purpose
        this.searchForm.group_attribute = res.data.group_attribute
        this.searchForm.group_desc = res.data.group_desc
        this.searchForm.update_frequency = res.data.update_frequency
        this.searchForm.brand_code = res.data.brand_code

        try {
          this.searchForm.group_rule = JSON.parse(res.data.slave_info.group_rule)
        } catch (e) {
          this.searchForm.group_rule = {}
        }
        this.loaded = true
      })
    },
    // 人群推送
    multitude() {
      const params = {}
      getType(params).then((res) => {
        if (res) {
          this.dateAddedList = res.data[3].list
        }
      })
    },
    drawerTo() {
      this.$refs['form'].validate(vaild => {
        if (!vaild) return
        this.$refs['groupFilter'].validateRuleValue().then(() => {
          this.filterJson = JSON.stringify(this.$refs['groupFilter'].getFilterJson())
          this.drawer = true
        })
      })
    },
    save(type) {
      this.$refs['form'].validate(vaild => {
        if (!vaild) return
        this.$refs['groupFilter'].validateRuleValue().then(() => {
          this.isLoading = true
          this.searchForm.group_rule = this.$refs['groupFilter'].getFilterJson()
          if (this.$route.query.view) {
            this.$router.push({ name: 'groupList' })
          } else {
            if (this.$route.query.id) {
              const params = {
                status: type,
                ...this.searchForm
              }
              editFilterGroup(params).then(res => {
                this.$message.success('保存成功!')
                this.isLoading = false
                this.$router.push({ name: 'groupList' })
              }).catch(() => {
                this.isLoading = false
              })
            } else {
              const params = {
                status: type,
                create_region: '华东',
                brand_code: Cookies.get('brandCode'),
                ...this.searchForm
              }

              insertGroupByFilter(params).then(res => {
                this.$message.success('保存成功!')
                this.isLoading = false
                this.$router.push({ name: 'groupList' })
              }).catch(() => {
                this.isLoading = false
              })
            }
          }
        })
      })
    },
    //人群推送
    crowdMultitude(){
      this.$refs['form'].validate((vaild) => {
         console.log(this.readOnly,'this.readOnly333')
        if (!vaild) {
          return
        } else {
         this.$refs['groupFilter'].validateRuleValue().then(() => {
          this.isLoading = true
//        this.searchForm.group_rule = this.$refs['groupFilter'].getFilterJson()
          this.dialogCrowd = true
         })
        }
      })
    },
    handleClose(){
      this.dialogCrowd = false
      if(this.dialogCrowd===false){
        this.isLoading =false
      }
    },
    cancel() {
      this.$router.push({ name: 'groupList' })
    },
    caculatorPeople() {
      this.$refs['groupFilter'].runFilterCombineSql()
    }
  }
}
</script>
<style lang="less" scoped>
.page-ordinary{
    display: flex;
    flex-direction: column;
}
 /deep/ .el-drawer__body{
    overflow: auto !important;
  }
  .el-drawer__body {
    overflow: auto !important;
  }
  /deep/ .el-drawer__header{
    margin-bottom: 0 !important;
  }
  .el-drawer__header{
    margin-bottom: 0 !important;
  }
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
