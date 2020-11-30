<template>
  <el-container class="level-change-log-container">
    <el-main class="level-change-log">
      <header class="searchWrap">
        <el-form ref="searchForm" :model="searchForm" :rules="rules" label-position="right" label-width="80px">
          <el-col :span="6">
            <el-form-item label="手机号:" prop="mobile_bind">
              <el-input
                v-model="searchForm.mobile_bind"
                clearable
                placeholder="请输入手机号"
                @keyup.enter.native="filterData"
              />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="原等级:" prop="level_name_before">
              <el-select v-model="searchForm.level_name_before" placeholder="请选择原等级">
                <el-option
                  v-for="item in levelList"
                  :label="item.level_name"
                  :value="item.level_name"
                  :key="item.id"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="新等级:" prop="level_name">
              <el-select v-model="searchForm.level_name" placeholder="请选择新等级">
                <el-option
                  v-for="item in levelList"
                  :label="item.level_name"
                  :value="item.level_name"
                  :key="item.id"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="类型:" prop="level_alter_type">
              <el-select v-model="searchForm.level_alter_type" placeholder="请选择类型">
                <el-option
                  v-for="item in typeList"
                  :label="item.label"
                  :value="item.value"
                  :key="item.id"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="修改时间:" prop="modify_time">
              <el-date-picker
                v-model="searchForm.modify_time"
                :default-time="['00:00:00', '23:59:59']"
                type="daterange"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                format="yyyy-MM-dd HH:mm:ss"
                value-format="yyyy-MM-dd HH:mm:ss"/>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="变更方式:" label-width="100px" prop="level_alter_method">
              <el-select v-model="searchForm.level_alter_method" placeholder="请选择变更方式">
                <el-option
                  v-for="item in alterModeList"
                  :label="item.label"
                  :value="item.value"
                  :key="item.id"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-button type="primary" @click="filterData">查询</el-button>
            <el-button type="primary" @click="handleReset">重置</el-button>
          </el-col>

        </el-form>
      </header>
      <main class="tableMainContent">
        <el-table
          v-loading="loading"
          ref="table"
          :data="tableData"
          :header-cell-style="{ background: '#F5F7FA', color: '#333333' }"
          border
        >
          <el-table-column prop="level_alter_date" label="修改时间" width="160"/>
          <el-table-column prop="mobile_bind" label="手机号" width="120"/>
          <el-table-column prop="level_name_before" label="原等级"/>
          <el-table-column prop="level_name" label="新等级"/>
          <el-table-column prop="level_alter_type" label="类型"/>
          <el-table-column prop="level_alter_method" label="变更方式"/>
          <el-table-column prop="update_user" label="修改人"/>
          <el-table-column prop="level_alter_desc" label="备注"/>
        </el-table>
        <base-pagination
          v-model="params.page"
          :current-page.sync="params.page"
          :page-size.sync="params.pageSize"
          :page-sizes="pageSizes"
          :total="total"
          @loadData="getLevelChangeLogFun"
        />
      </main>
    </el-main>
  </el-container>
</template>

<script>
import { getLevelAlterLogList, getLevelList } from '@/api/markting/level'
import cacheCondition from '@/utils/cacheCondition'
import { mapGetters } from 'vuex'

export default {
  name: 'LevelChangeLog',
  mixins: [cacheCondition],
  data() {
    return {
      searchForm: {
        mobile_bind: '',
        level_name_before: '不限',
        level_name: '不限',
        level_alter_type: null,
        modify_time: [],
        level_alter_method: null
      },
      params: {
        page: 1,
        pageSize: 10
      },
      total: 0,
      pageSizes: [10, 20, 30, 40],
      loading: false,
      levelList: [],
      typeList: [],
      alterModeList: [],
      tableData: []
    }
  },
  computed: {
    rules() {
      return {
        mobile_bind: [{ min: 11, max: 11, message: '手机号码长度不对', trigger: ['blur', 'change'] },
          { pattern: /^1[3456789]\d{9}$/, message: '目前只支持中国大陆的手机号码', trigger: 'blur' }],
        initial_amount: [{ pattern: /^[+]{0,1}(\d+)$/, message: '起始金额需为正整数' },
          { validator: this.validateInitialAmount, trigger: 'blur' }],
        end_amount: [{ pattern: /^[+]{0,1}(\d+)$/, message: '结束金额需为正整数' },
          { validator: this.validateEndAmount, trigger: 'blur' }]
      }
    },
    ...mapGetters(['brandCode'])
  },
  mounted() {
    this.initData()
    this.getLevelList()
    this.getTypeList()
    this.getAlterModeList()
  },
  methods: {
    clearDeep(obj) {
      if (!obj || !typeof obj === 'object') return
      const keys = Object.keys(obj)
      for (var key of keys) {
        const val = obj[key]
        if (
          typeof val === 'undefined' ||
          ((typeof val === 'object' || typeof val === 'string') && !val)
        ) {
          // 如属性值为null或undefined或''，则将该属性删除
          delete obj[key]
        } else if (typeof val === 'object') {
          // 属性值为对象，递归调用
          this.clearDeep(obj[key])

          if (Object.keys(obj[key]).length === 0) {
            // 如某属性的值为不包含任何属性的独享，则将该属性删除
            delete obj[key]
          }
        }
      }
    },
    initData() {
      this.getLevelChangeLogFun()
    },
    filterData() {
      this.params.page = 1
      this.initData()
    },
    // 重置
    handleReset() {
      this.searchForm = {
        mobile_bind: '',
        level_name_before: '不限',
        level_name: '不限',
        level_alter_type: null,
        modify_time: [],
        level_alter_method: null
      }
      this.$refs.searchForm.resetFields()
      this.filterData()
    },
    getLevelList() {
      getLevelList({ brand_code: this.brandCode || 'durex' }).then(res => {
        if (res && res.data && res.data.list) {
          const _levelList = res.data.list
          _levelList.unshift({ id: 1, level_name: '不限' })
          this.levelList = _levelList
        }
      })
    },
    getTypeList() {
      this.typeList = [
        { id: 1, label: '不限', value: null },
        { id: 2, label: '升级', value: '升级' },
        { id: 3, label: '降级', value: '降级' }
      ]
    },
    getAlterModeList() {
      this.alterModeList = [
        { id: 1, label: '不限', value: null },
        { id: 2, label: '手动变更', value: '手动变更' },
        { id: 3, label: '文件导入', value: '文件导入' },
        { id: 4, label: '系统变更', value: '系统变更' }
      ]
    },
    getLevelChangeLogFun() {
      this.loading = true
      const postData = {
        like: {
          mobile_bind: this.searchForm.mobile_bind
        },
        equals: {
          level_name: this.searchForm.level_name === '不限' ? null : this.searchForm.level_name,
          level_name_before: this.searchForm.level_name_before === '不限' ? null : this.searchForm.level_name_before,
          brand_code: this.brandCode || 'durex',
          level_alter_type: this.searchForm.level_alter_type,
          level_alter_method: this.searchForm.level_alter_method
        },
        between: {
          level_alter_date: {
            start: this.searchForm.modify_time && this.searchForm.modify_time.length && this.searchForm.modify_time[0] ? this.searchForm.modify_time[0] : null,
            end: this.searchForm.modify_time && this.searchForm.modify_time.length && this.searchForm.modify_time[1] ? this.searchForm.modify_time[1] : null
          }
        },
        page: this.params.page,
        size: this.params.pageSize
      }
      this.clearDeep(postData)
      getLevelAlterLogList(postData).then((res) => {
        this.tableData = res.data.list || []
        this.params.page = this.params.page || 1
        this.params.pageSize = this.params.pageSize || 10
        this.total = res.data.total
      }).finally(() => {
        this.loading = false
      })
    }
  }
}
</script>

<style lang="less" scoped>
.level-change-log-container {
  padding: 20px;
  width: 100%;
  min-height: 100%;

  .el-main {
    max-width: 100%;
    min-height: 100%;
    background-color: #fff;

    header,
    main {
      width: 100%;
      height: auto;
      box-sizing: border-box;
      display: block;
      background: #ffffff;
      padding: 10px 0;

      .scopeStyle {
        cursor: pointer;
      }
    }

    header {
      overflow: hidden;

      /deep/ .monetary-form-container.el-form-item {
        margin-bottom: 0;
      }

      .monetary-container {
        /deep/ .el-form-item {
          width: 100px;
          display: inline-block;
        }
      }
      /deep/.el-range-editor--small.el-input__inner {
        width: 100%;
      }
    }

    main {
      /deep/ .el-table__row,
      /deep/ .has-gutter {
        td {
          > div {
            text-align: center;
          }
        }

        th {
          > div {
            text-align: center;
          }
        }
      }
    }

    /deep/ .el-form-item__label {
      color: #666666;
      font-size: 14px;
      font-weight: normal;
      white-space: nowrap;
    }

    /deep/ .el-form-item .el-input {
      width: 100%;
    }

    /deep/ .el-table__fixed-right::before {
      background: transparent !important;
    }

    /deep/ .validity-form-item .el-form-item {
      display: inline-block;
      width: 200px;
    }

    /deep/ .validity-form-item.el-form-item {
      margin-bottom: 0;
    }

    /deep/ .validity-form-item .el-input-group--append .el-input__inner {
      padding-right: 0 !important;
    }
  }
}
</style>
