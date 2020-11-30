<template>
  <div class="page-container">
    <div class="header">
      <section>
        <!-- <div>
          <span>品牌：</span>
          <belle-choose-brand v-model="brandCode" :config="config"/>
        </div> -->
        <div>
          <span>
            逻辑表名：
          </span>
          <el-input v-model="searchForm.tableName" clearable :style="{display:'inline-block'}" placeholder="逻辑表名"/>
        </div>
        <div>
          <span>
            表中文名称：
          </span>
          <el-input v-model="searchForm.table_name_show" clearable :style="{display:'inline-block'}" placeholder="表中文名称"/>
        </div>
      </section>
      <el-button type="primary" @click="onsearch()">查询</el-button>
    </div>
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
  </div>
</template>
<script>
import { getMetaformData } from '@/api/meta'
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
        table_name_show: ''
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
          'column_name_show': '表类型',
          'column_name_desc': 'name1的描述',
          'column_name': 'table_type',
          'display_type': 'text',
          'is_editable': '',
          'default_value': '',
          'is_allow_null': '',
          'data_format': 'string',
          'width': '120',
          'data_range': '[6-20)'
        },
        {
          'column_name_show': '数据库类型',
          'column_name_desc': 'name1的描述',
          'column_name': 'db_type',
          'display_type': 'text',
          'is_editable': '',
          'default_value': '',
          'is_allow_null': '',
          'data_format': 'string',
          'width': '120',
          'data_range': '[6-20)'
        },{
          'column_name_show': '表组',
          'column_name_desc': 'name1的描述',
          'column_name': 'table_group',
          'display_type': 'text',
          'is_editable': '',
          'default_value': '',
          'is_allow_null': '',
          'data_format': 'string',
          'width': '120',
          'data_range': '[6-20)'
        },
        {
          'column_name_show': '数据库名',
          'column_name_desc': 'name1的描述',
          'column_name': 'db_name',
          'display_type': 'text',
          'is_editable': '',
          'default_value': '',
          'is_allow_null': '',
          'data_format': 'string',
          'width': '120',
          'data_range': '[6-20)'
        },
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
          'data_range': '[6-20)'
        },
        {
          'column_name_show': '表中文名称',
          'column_name_desc': 'name1的描述',
          'column_name': 'table_name_show',
          'display_type': 'text',
          'is_editable': '',
          'default_value': '',
          'is_allow_null': '',
          'data_format': 'string',
          'width': '220',
          'data_range': '[6-40)'
        },
        {
          'column_name_show': '表描述',
          'column_name_desc': 'name1的描述',
          'column_name': 'table_name_desc',
          'display_type': 'text',
          'is_editable': '',
          'default_value': '',
          'is_allow_null': '',
          'data_format': 'string',
          'width': '220',
          'data_range': '[6-20)'
        },
        {
          'column_name_show': '是否维度表',
          'column_name_desc': 'name1的描述',
          'column_name': 'is_dimension',
          'display_type': 'text',
          'is_editable': '',
          'default_value': '',
          'is_allow_null': '',
          'data_format': 'string',
          'width': '120',
          'data_range': '[6-20)'
        },
        {
          'column_name_show': '聚集列',
          'column_name_desc': 'name1的描述',
          'column_name': 'cluster_column',
          'display_type': 'text',
          'is_editable': '',
          'default_value': '',
          'is_allow_null': '',
          'data_format': 'string',
          'width': '120',
          'data_range': '[6-20)'
        },
        {
          'column_name_show': '一级分区列',
          'column_name_desc': 'name1的描述',
          'column_name': 'partition_level_1',
          'display_type': 'text',
          'is_editable': '',
          'default_value': '',
          'is_allow_null': '',
          'data_format': 'string',
          'width': '120',
          'data_range': '[6-20)'
        },
        {
          'column_name_show': '二级分区列',
          'column_name_desc': 'name1的描述',
          'column_name': 'partition_level_2',
          'display_type': 'text',
          'is_editable': '',
          'default_value': '',
          'is_allow_null': '',
          'data_format': 'string',
          'width': '120',
          'data_range': '[6-20)'
        },
        {
          'column_name_show': '表类型',
          'column_name_desc': 'name1的描述',
          'column_name': 'table_type',
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
    this.getData()
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
      if (this.searchForm.table_name_show) {
        obj.table_name_show = this.searchForm.table_name_show
      }
      getMetaformData(obj).then(res => {
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
    // margin: 30px 0 40px;
    margin-bottom: 30px;
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
