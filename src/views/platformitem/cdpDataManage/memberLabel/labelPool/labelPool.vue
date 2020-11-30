<template>
  <div class="page-container-gap">
    <div class="searchWrap">
      <el-form label-position="right" label-width="80px">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="条件名称">
              <el-input v-model="searchForm.label_name" maxlength="50" clearable @keyup.enter.native="filterData"/>
            </el-form-item>
          </el-col>
          <!-- <el-col :span="6">
            <el-form-item label="条件类型">
              <el-select v-model="searchForm.label_type" style="width: 100%;" clearable >
                <el-option v-for="(labelType, index) in labelTypes" :key="index" :label="labelType.label" :value="labelType.value"/>
              </el-select>
            </el-form-item>
          </el-col> -->
          <el-col :span="6">
            <el-form-item label="条件属性">
              <el-select v-model="searchForm.label_attribute" style="width: 100%;" clearable >
                <el-option v-for="(labelAttribute, index) in labelAttributes" :key="index" :label="labelAttribute.label" :value="labelAttribute.value"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="创建人" width="120" >
              <el-input v-model="searchForm.create_user" clearable @keyup.enter.native="filterData"/>
            </el-form-item>
          </el-col>
          <el-col v-show="isMoreinquiries" :span="6">
            <el-form-item label="修改人" width="120" >
              <el-input v-model="searchForm.update_user" clearable @keyup.enter.native="filterData"/>
            </el-form-item>
          </el-col>
          <!-- <el-col v-show="isMoreinquiries" :span="6">
            <el-form-item label="同步权限系统">
              <el-select v-model="searchForm.is_sync_authorization" style="width: 100%;" clearable >
                <el-option v-for="(labelAttribute, index) in synchronizeMap" :key="index" :label="labelAttribute.label" :value="labelAttribute.value"/>
              </el-select>
            </el-form-item>
          </el-col> -->
          <el-col :span="6" style="text-align:center;">
            <!-- <el-form-item style="white-space:nowrap;"> -->
            <el-button class="search-common" type="primary" @click="filterData">查询</el-button>
            <el-button v-show="!isMoreinquiries" @click="searchMore">更多筛选</el-button>
            <el-button v-show="isMoreinquiries" type="primary" class="search-collapse" @click="searchMore">收起<i class="el-icon-d-arrow-right"/> </el-button>
            <!-- </el-form-item> -->
          </el-col>
        </el-row>
      </el-form>
    </div>
    <main class="tableMainContent">
      <!-- <el-button type="primary" @click="labelModalVisble = true" class="listAddBtnStyle">新增</el-button> -->
      <!-- <el-button type="primary" @click="sycn">重试下发条件</el-button> -->
      <el-table v-loading="loading" stripe :data="list" :max-height="500" >
        <el-table-column label="序号" width="50">
          <template slot-scope="scope"><span>{{ (scope.$index+1) }}</span></template>
        </el-table-column>
        <el-table-column label="条件名称" prop="label_name" >
          <template slot-scope="scope">
            <el-popover trigger="hover" placement="bottom">
              <p style="max-width: 160px;">{{ scope.row.label_name }} </p>
              <div slot="reference" class="marketing-list-page-name-wrapper">
                {{ scope.row.label_name }}
              </div>
            </el-popover>
          </template>
        </el-table-column>
        <!-- <el-table-column label="条件类型" prop="label_type">
          <template slot-scope="scope">
            {{ getLabelByValue(scope.row.label_type, labelTypes) }}
          </template>
        </el-table-column> -->
        <!-- <el-table-column label="创建类型" prop="create_type">
          <template slot-scope="scope">
            {{ getLabelByValue(scope.row.create_type, createTypes) }}
          </template>
        </el-table-column> -->
        <!-- <el-table-column label="条件属性" prop="label_attribute">
          <template slot-scope="scope">
            {{ getLabelByValue(scope.row.label_attribute, labelAttributes) }}
          </template>
        </el-table-column> -->
        <el-table-column label="应用品牌" prop="brand_info" >
          <template slot-scope="scope">
            <el-popover  placement="top-start" min-width="200" trigger="hover">
              <div>{{ scope.row.brandTxt ? scope.row.brandTxt : scope.row.brand_info }}</div>
              <span slot="reference" v-if="scope.row.brand_info&&scope.row.brand_info.length>0">{{ scope.row.brand_info + '...' }}</span>
            </el-popover>
            <!-- <span slot="reference">{{ scope.row.brand_info }}</span> -->
          </template>
        </el-table-column>

        <el-table-column label="更新频次" prop="update_frequency">
          <template slot-scope="scope">
            <el-tag
          :type="scope.row.update_frequency === 'realtime' ? 'success' : 'info'"
          disable-transitions>
            {{ getLabelByValue(scope.row.update_frequency, updateFrequencys) }}
            </el-tag>
          </template>
        </el-table-column>
        <!-- <el-table-column label="预计更新时间" prop="data_update_time_pre" width="140"/> -->
        <!-- <el-table-column label="数据采集时间" prop="data_collection_time" width="140"/> -->
        <!-- <el-table-column label="数据更新时间" prop="data_update_time" width="140"/> -->
        <el-table-column label="创建人" prop="create_user">
          <template slot-scope="scope">
            <human-info :id="scope.row.create_user_code" >{{ scope.row.create_user }}</human-info>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" prop="create_time"  width="200" />
        <el-table-column label="修改人" prop="update_user" >
          <template slot-scope="scope">
            <human-info :id="scope.row.update_user_code">{{ scope.row.update_user }}</human-info>
          </template>
        </el-table-column>
        <el-table-column label="修改时间" width="200" prop="last_modify_time"/>
        <el-table-column label="操作" width="200" fixed="right">
          <template slot-scope="scope">
            <el-button type="text" @click="view(scope.row)">查看</el-button>
            <el-button type="text" @click="edit(scope.row)">编辑</el-button>
            <el-button type="text" class="deleteFontColor" v-if="!scope.row.brand_info" @click="del(scope.row)">删除</el-button>
            <!-- <el-button v-if="showButton(scope.row)" type="text" @click="toggleLabelAttribute(scope.row)">切换条件属性</el-button> -->
          </template>
        </el-table-column>
      </el-table>
      <base-pagination
        class="bottomPagination"
        v-model="params.current"
        :page-size.sync="params.page_size"
        :total="total"
        @loadData="loadData"
      />
    </main>
    <el-dialog :visible.sync="labelModalVisble" title="创建条件">
      <div>
        <el-form :rules="createFormRules" :model="createForm">
          <el-form-item label="条件类型" prop="label_type">
            <el-radio-group v-model="createForm.label_type">
              <el-radio v-for="(labelType, index) in formLabelTypes" :key="index" :label="labelType.value">{{ labelType.label }}</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
        <div class="label-tip">
          <div class="label-item-tip">手工条件：会员手动打标，可用于手动打标、营销活动打标；</div>
          <div class="label-item-tip">规则条件：通过基础属性筛选出的条件；</div>
          <div class="label-item-tip">复合条件：通过手工条件/基础条件/模型条件筛选出的条件；</div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="labelModalVisble = false">{{ $t('form.cancel') }}</el-button>
        <el-button type="primary" @click="confirmHandler">{{ $t('form.confirm') }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { mixinDel } from '@/utils/index'
import { getLabelPoolList, deleteRuleLabel, deleteManualLabel, deleteComplexLabel, deleteModelLabel, deleteAttributeLabel, updateTtransform, retryAuthorization } from '@/api/labelPool'
import { queryBrandList } from '@/api/employ'
// import cacheCondition from '@/utils/cacheCondition'

export default {
  name: 'LabelPool',
  mixins: [mixinDel],
  data() {
    return {
      loading: false,
      isMoreinquiries: false, // 更多查询
      params: {
        current: 1,
        page_size: 10
      },
      total: 0,
      list: [],
      labelModalVisble: false,
      searchForm: {
        label_type: '',
        label_name: '',
        label_attribute: '',
        update_user: '',
        create_user: '',
        is_sync_authorization: ''
      },
      createForm: {
        label_type: 'manual'
      },
      labelTypes: [
        // { label: '手工条件', value: 'manual' },
        // { label: '规则条件', value: 'rule' },
        // { label: '复合条件', value: 'complex' },
        { label: '属性条件', value: 'attribute' },
        // { label: '模型条件', value: 'model' }
      ],
      labelAttributes: [
        { label: '通用', value: 'common' },
        // { label: '个性', value: 'special' }
      ],
      createTypes: [
        { label: '手工', value: 'manual' },
        { label: '自定义SQL', value: 'sql' },
        { label: '筛选器', value: 'filter' },
        { label: '属性', value: 'attribute' },
        { label: '算法', value: 'algorithm' }
      ],
      updateFrequencys: [
        { label: '实时', value: 'realtime' },
        { label: '每天', value: 't_1' }
      ],
      synchronizeMap: [
        { label: '是', value: 'Y' },
        { label: '否', value: 'N' }
      ],
      formLabelTypes: [
        { label: '手工条件', value: 'manual' },
        { label: '规则条件', value: 'rule' },
        { label: '复合条件', value: 'complex' }
      ],
      actionRouteMap: {
        manual_add: 'manualLabelAdd',
        rule_add: 'ruleLabelAdd',
        complex_add: 'complexLabelAdd',
        attribute_add: 'attrLabelAdd',
        model_add: 'rfmLabelAdd',

        manual_edit: 'manualLabelEdit',
        rule_edit: 'ruleLabelEdit',
        complex_edit: 'complexLabelEdit',
        attribute_edit: 'attrLabelEdit',
        model_edit: 'rfmLabelEdit'
      },
      brand_list: [],
      createFormRules: {
        label_type: [
          { required: true, message: '请选择条件类型', trigger: 'change' }
        ]
      }
    }
  },
  mounted() {
    // this.init()
    this.getBrandList()
    window.addEventListener('resize', this.getHeight)
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.getHeight)
  },
  methods: {
    getHeight() {
      const appHeight = document.getElementsByClassName('page-container-gap')[0].offsetHeight
      const otherHeight = document.getElementsByClassName('search-wrap')[0].offsetHeight + 110
      this.tableHeight = appHeight - otherHeight
    },
    sycn() {
      retryAuthorization().then(res => {
        this.$message({
          message: res.data.msg,
          type: res.data.type,
          duration: 1000
        })
        this.loadData()
      })
    },
    getBrandList() {
      queryBrandList({ params: {}}).then(res => {
        sessionStorage.setItem('brand_list', JSON.stringify(res.body))
        this.brand_list = res.body
        this.init()
      })
    },
    init() {
      this.loadData()
    },
    filterData() {
      this.params.current = 1
      this.loadData()
    },
    loadData() {
      var params = {
        current: this.params.current,
        page_size: this.params.page_size,
        ...this.searchForm
      }
      for (var attr in params) {
        if (!params[attr]) delete params[attr]
      }
      this.loading = true

      getLabelPoolList(params).then((res) => {
        this.loading = false
        if (res.data) {
          this.list = res.data.list || []
          this.params.current = res.data.pagination.current || 1
          this.params.page_size = res.data.pagination.page_size
          this.total = res.data.pagination.total || 0
          if (this.params.current > 1) {
            if (!res.data.list || !res.data.list.length) {
              this.params.current -= 1
              this.loadData()
            }
          }
          this.list.forEach((list, index) => { // 每一条数据的brand_info
            if (list.brand_info && list.brand_info.length) {
              console.log(list.brand_info,'list.brand_info')
              this.brand_list.forEach(list1 => { // 匹配
                list.brand_info.forEach((list2, i) => {
                  if (list2 === list1.brandCode) {
                    if (this.$store.getters.language === 'zh') {
                      this.list[index].brand_info[i] = list1.brandName
                    } else {
                      this.list[index].brand_info[i] = list1.brandName
                    }
                  }
                })
              })
            }
            if (list.brand_info.length > 3) {
              this.$set(list, 'brandTxt', list.brand_info.join('/'))
              console.log(list,'list')
            }
            list.brand_info = list.brand_info.slice(0, 3)
            list.brand_info = list.brand_info.join('/')
              console.log(list,'listss')
          })
          this.getHeight()
        }
      })
    },
    searchMore() {
      this.isMoreinquiries = !this.isMoreinquiries
      // 动态计算表格高度
      setTimeout(() => {
        this.getHeight()
      })
    },
    confirmHandler() {
      this.add({ label_type: this.createForm.label_type })
    },
    add(row) {
      this.$router.push({
        name: this.actionRouteMap[row.label_type + '_add']
      })
    },
    view(row) {
      if (row.create_type && row.id) {
        this.$router.push({
          name: this.actionRouteMap[row.label_type + '_edit'],
          query: {
            id: row.id,
            create_type: row.create_type,
            view: 'true'
          }
        })
      } else {
        this.$message({
          type: 'error',
          message: '缺少参数id或create_type'
        })
      }
    },
    edit(row) {
      if (row.create_type && row.id) {
        console.log(row,888,this.actionRouteMap[row.label_type + '_edit'],3)
        this.$router.push({
          name: this.actionRouteMap[row.label_type + '_edit'],
          query: {
            id: row.id,
            create_type: row.create_type
          }
        })
      } else {
        this.$message({
          type: 'error',
          message: '缺少参数id或create_type'
        })
      }
    },
    del(row) {
      console.log(row)
      switch (row.label_type) {
        case 'manual':
          this.openDeleteModal((closeModal) => {
            deleteManualLabel({ id: row.id }).then((res) => {
              closeModal()
              this.$message({
                message: '删除成功',
                type: 'success'
              })
              this.loadData()
            })
          })
          break
        case 'rule':
          this.openDeleteModal((closeModal) => {
            deleteRuleLabel({ id: row.id, create_type: row.create_type }).then((res) => {
              closeModal()
              this.$message({
                message: '删除成功',
                type: 'success'
              })
              this.loadData()
            })
          })
          break
        case 'attribute':
          this.openDeleteModal((closeModal) => {
            deleteAttributeLabel({ id: row.id, create_type: row.create_type }).then((res) => {
              closeModal()
              this.$message({
                message: '删除成功',
                type: 'success'
              })
              this.loadData()
            })
          })
          break
        case 'attribute_agg':
          this.openDeleteModal((closeModal) => {
            deleteAttributeLabel({ id: row.id, create_type: row.create_type }).then((res) => {
              closeModal()
              this.$message({
                message: '删除成功',
                type: 'success'
              })
              this.loadData()
            })
          })
          break
        case 'rfm':
          this.openDeleteModal((closeModal) => {
            deleteModelLabel({ id: row.id }).then((res) => {
              closeModal()
              this.$message({
                message: '删除成功',
                type: 'success'
              })
              this.loadData()
            })
          })
          break
        case 'complex':
          this.openDeleteModal((closeModal) => {
            deleteComplexLabel({ id: row.id }).then((res) => {
              closeModal()
              this.$message({
                message: '删除成功',
                type: 'success'
              })
              this.loadData()
            })
          })
          break
        case 'model':
          this.openDeleteModal((closeModal) => {
            deleteModelLabel({ id: row.id }).then((res) => {
              closeModal()
              this.$message({
                message: '删除成功',
                type: 'success'
              })
              this.loadData()
            })
          })
          break
        case 'sql':
          this.openDeleteModal((closeModal) => {
            deleteRuleLabel({ id: row.id, create_type: row.create_type }).then((res) => {
              closeModal()
              this.$message({
                message: '删除成功',
                type: 'success'
              })
              this.loadData()
            })
          })
          break
      }
    },
    toggleLabelAttribute(row) {
      this.switchType(row)
    },
    showButton(row) {
      return !(['attribute', 'model'].indexOf(row.label_type) > -1)
    },
    getLabelByValue(value, list, opts) {
      if (!list || list.length === 0) return ''

      opts = opts || { valueKey: 'value', labelKey: 'label' }
      for (var i = 0, len = list.length; i < len; i++) {
        if (list[i][opts.valueKey] === value) {
          return list[i][opts.labelKey]
        }
      }

      return ''
    },
    switchType(row) {
      this.$msgbox({
        title: '确认消息',
        message: `确定将此条件转换为${row.label_attribute === 'common' ? '个性' : '通用'}条件`,
        showClose: true,
        distinguishCancelAndClose: true,
        type: 'warning',
        showCancelButton: true,
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            instance.confirmButtonLoading = true
            instance.confirmButtonText = '执行中...'
            setTimeout(() => {
              done()
              setTimeout(() => {
                instance.confirmButtonLoading = false
              }, 300)
            }, 3000)
          } else {
            done()
          }
        }
      }).then(() => {
        updateTtransform({ id: row.id, label_attribute: row.label_attribute === 'common' ? 'special' : 'common' }).then(res => {
          this.$alert(`切换条件属性成功`, '提示', {
            confirmButtonText: '确定',
            type: 'success',
            callback: action => {
              this.loadData()
            }
          })
        })
      }).catch()
    }
  }
}
</script>
<style lang="less" scoped>
.label-tip {
  border: 1px solid #e4e7ed;
  padding-left: 30px;
  padding-top: 20px;
  padding-bottom: 90px;
}
.label-item-tip {
  line-height: 30px;
}
.marketing-list-page-name-wrapper {
  overflow:hidden;
  text-overflow:ellipsis;
  white-space:nowrap;
  max-height: 50px;
}
</style>
