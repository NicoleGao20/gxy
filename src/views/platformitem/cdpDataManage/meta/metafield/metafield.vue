<template>
  <div class="page-container">
    <div class="searchWrap">
      <el-form label-position="right" label-width="80px">
        <el-row :gutter="24">
          <el-col :span="8">
            <el-form-item label="逻辑表名">
              <el-input v-model="searchForm.tableName" maxlength="50" placeholder="逻辑表名" clearable @keyup.enter.native="filterData"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="字段">
              <el-input v-model="searchForm.columnName" maxlength="50" placeholder="数据库字段" clearable @keyup.enter.native="filterData"/>
            </el-form-item>
          </el-col>
          <el-col :span="8" style="text-align:center;">
            <el-button type="primary" @click="onsearch()">查询</el-button>
           
          </el-col>
        <!-- <div>
          <span>品牌：</span>
          <belle-choose-brand v-model="brandCode" :config="config"/>
        </div> -->
        </el-row>
      </el-form>
    </div>
    <main class="tableMainContent">
    <auto-table :rows="list" :columns="tableColumns" max-height="600px" />
    <div style="text-align: right;padding: 10px 0;">
      <el-pagination
        :current-page.sync="params.current"
        :page-size.sync="params.page_size"
        :page-sizes="pageSizes"
        :total="total"
        background
        layout="total,sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"/>
    </div>
    </main>
  </div>
</template>
<script>
import { getMetafieldData } from '@/api/meta'
import belleChooseBrand from '@/privatemodules/belle-choose-brand'
import cacheCondition from '@/utils/cacheCondition'
export default {
  name: 'Metaform',
  components: {
    belleChooseBrand
  },
  mixins: [cacheCondition],
  data() {
    return {
      options: [{
        value: 'TS',
        label: '杜蕾斯'
      }, {
        value: 'FS',
        label: '滴露'
      }],
      brandCode: '',
      config: {
        multiple: false,
        disabled: false,
        collapseTags: true
      },
      searchForm: {
        tableName: '',
        columnName: ''
      },
      params: {
        current: 1,
        page_size: 10
      },
      total: 100,
      pageSizes: [
        10, 20, 30, 40
      ],
      list: [],
      rows: [
        {
          text1: 'HELLO'
        },
        {
          text1: 'WORLD'
        }
      ],
      tableColumns: [
        {
          'column_name_show': '逻辑表名',
          'column_name_desc': 'name1的描述',
          'column_name': 'table_name',
          'display_type': 'text',
          'is_editable': '',
          'default_value': '',
          'is_allow_null': '',
          'data_format': 'string',
          'width': '220',
          'data_range': '[6-20)',
          'fixed':'left'
        },
        {
          'column_name_show': '数据库字段',
          'column_name_desc': 'name1的描述',
          'column_name': 'column_name',
          'display_type': 'text',
          'is_editable': '',
          'default_value': '',
          'is_allow_null': '',
          'data_format': 'string',
          'width': '120',
          'data_range': '[6-20)',
          'fixed':'left'
        },
        {
          'column_name_show': '字段中文名称',
          'column_name_desc': 'name1的描述',
          'column_name': 'column_name_show',
          'display_type': 'text',
          'is_editable': '',
          'width': '100px',
          'default_value': '',
          'is_allow_null': '',
          'data_format': 'string',
          'width': '220',
          'data_range': '[6-20)'
        },
        {
          'column_name_show': '字段描述',
          'column_name_desc': 'name1的描述',
          'column_name': 'column_name_desc',
          'display_type': 'text',
          'is_editable': '',
          'default_value': '',
          'is_allow_null': '',
          'data_format': 'string',
          'width': '220',
          'data_range': '[6-20)'
        },
        {
          'column_name_show': '字段类型',
          'column_name_desc': 'name1的描述',
          'column_name': 'column_type',
          'display_type': 'text',
          'is_editable': '',
          'default_value': '',
          'is_allow_null': '',
          'data_format': 'string',
          'width': '120',
          'data_range': '[6-20)'
        },
        {
          'column_name_show': '字段长度',
          'column_name_desc': 'name1的描述',
          'column_name': 'column_length',
          'display_type': 'text',
          'is_editable': '',
          'default_value': '',
          'is_allow_null': '',
          'data_format': 'string',
          'width': '120',
          'data_range': '[6-20)'
        },
        {
          'column_name_show': '精度',
          'column_name_desc': 'name1的描述',
          'column_name': 'column_precision',
          'display_type': 'text',
          'is_editable': '',
          'default_value': '',
          'is_allow_null': '',
          'data_format': 'string',
          'width': '120',
          'data_range': '[6-20)'
        },
        {
          'column_name_show': '字段约束',
          'column_name_desc': 'name1的描述',
          'column_name': 'column_constraint',
          'display_type': 'text',
          'is_editable': '',
          'default_value': '',
          'is_allow_null': '',
          'data_format': 'string',
          'width': '120',
          'data_range': '[6-20)'
        },
        {
          'column_name_show': '允许空',
          'column_name_desc': 'name1的描述',
          'column_name': 'is_allow_null',
          'display_type': 'text',
          'is_editable': '',
          'default_value': '',
          'is_allow_null': '',
          'data_format': 'string',
          'width': '120',
          'data_range': '[6-20)'
        },
        {
          'column_name_show': '默认值',
          'column_name_desc': 'name1的描述',
          'column_name': 'default_value',
          'display_type': 'text',
          'is_editable': '',
          'default_value': '',
          'is_allow_null': '',
          'data_format': 'string',
          'width': '120',
          'data_range': '[6-20)'
        },
        {
          'column_name_show': '是否物理主键',
          'column_name_desc': 'name1的描述',
          'column_name': 'is_primary_phy',
          'display_type': 'text',
          'is_editable': '',
          'width': '100px',
          'default_value': '',
          'is_allow_null': '',
          'data_format': 'string',
          'width': '120',
          'data_range': '[6-20)'
        },
        {
          'column_name_show': '是否逻辑主键',
          'column_name_desc': 'name1的描述',
          'column_name': 'isPrimaryLogic',
          'display_type': 'text',
          'is_editable': '',
          'width': '100px',
          'default_value': '',
          'is_allow_null': '',
          'data_format': 'string',
          'width': '120',
          'data_range': '[6-20)'
        },
        {
          'column_name_show': '是否自增',
          'column_name_desc': 'name1的描述',
          'column_name': 'isAutoIncrement',
          'display_type': 'text',
          'is_editable': '',
          'default_value': '',
          'is_allow_null': '',
          'data_format': 'string',
          'width': '120',
          'data_range': '[6-20)'
        },
        {
          'column_name_show': '是否可编辑',
          'column_name_desc': 'name1的描述',
          'column_name': 'isEditable',
          'display_type': 'text',
          'is_editable': '',
          'default_value': '',
          'is_allow_null': '',
          'data_format': 'string',
          'width': '120',
          'data_range': '[6-20)'
        }
      ]
    }
  },
  created() {

  },
  mounted() {
   
    document.onkeydown = (e) => {
      let currKey = 0
      e = event || window.event
      currKey = e.keyCode || e.which || e.charCode
      if (currKey === 13) {
        this.onsearch()
      }
    }
    this.getData()
  },
  methods: {
    onsearch() {
      this.params.page_size =  10;
      this.params.current=1
      this.getData()
    },
    getData() {
      const obj = {
        current: this.params.current,
        page_size: this.params.page_size
      }
      if (this.brandCode) {
        obj.brand_code = this.brandCode
      }
      if (this.searchForm.tableName) {
        obj.table_name = this.searchForm.tableName
      }
      if (this.searchForm.columnName) {
        obj.column_name = this.searchForm.columnName
      }
      getMetafieldData(obj).then(res => {
        console.log(res)
        this.list = res.data.list
        this.total = res.data.pagination.total
      })
    },
    handleSizeChange(val, bv) {
      console.log(`每页 ${val} 条`, this.params.current, this.params.page_size)
      this.getData()
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`, this.params.current, this.params.page_size)
      this.getData()
    }
  }
}
</script>
<style lang="less" scoped>
.page-container {
  background: #fff;
  .header {
    display: flex;
    justify-content: space-between;
    margin: 30px 0 40px;
    color:#666;
    &>section {
      display: flex;
      &>div {
        display: flex;
        align-items: center;
        margin-right: 30px;
        &>span {
          display: block;
          white-space : nowrap;
          text-align: right;
        }
      }
    }
  }
}

</style>
