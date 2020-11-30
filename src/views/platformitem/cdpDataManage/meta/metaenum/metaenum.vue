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
            枚举类型：
          </span>
          <el-input v-model="searchForm.tableName" clearable :style="{display:'inline-block'}" placeholder="枚举类型"/>
        </div>
        <div>
          <span>
            枚举值：
          </span>
          <el-input v-model="searchForm.enum_value" clearable :style="{display:'inline-block'}" placeholder="枚举值"/>
        </div>
        <!-- enum_value -->
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
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"/>
    </div>
  </div>
</template>
<script>
import { getMetaenumData } from '@/api/meta'
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
        enum_value: ''
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
        // {
        //   'column_name_show': '品牌',
        //   'column_name_desc': 'name1的描述',
        //   'column_name': 'brand_name',
        //   'display_type': 'text',
        //   'is_editable': '',
        //   'default_value': '',
        //   'is_allow_null': '',
        //   'data_format': 'string',
        //   'data_range': '[6-20)'
        // },
        {
          'column_name_show': '枚举类型',
          'column_name_desc': 'name1的描述',
          'column_name': 'enum_type_code',
          'display_type': 'text',
          'is_editable': '',
          'default_value': '',
          'is_allow_null': '',
          'data_format': 'string',
          // 'width': '220',
          'data_range': '[6-20)'
        },
        {
          'column_name_show': '枚举项',
          'column_name_desc': 'name1的描述',
          'column_name': 'enum_code',
          'display_type': 'text',
          'is_editable': '',
          'default_value': '',
          'is_allow_null': '',
          'data_format': 'string',
          // 'width': '120',
          'data_range': '[6-20)'
        },
        {
          'column_name_show': '枚举值',
          'column_name_desc': 'name1的描述',
          'column_name': 'enum_value',
          'display_type': 'text',
          'is_editable': '',
          'default_value': '',
          'is_allow_null': '',
          'data_format': 'string',
          // 'width': '220',
          'data_range': '[6-20)'
        },
        {
          'column_name_show': '显示名称',
          'column_name_desc': 'name1的描述',
          'column_name': 'enum_name',
          'display_type': 'text',
          'is_editable': '',
          'default_value': '',
          'is_allow_null': '',
          'data_format': 'string',
          // 'width': '220',
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
        obj.enum_type_code = this.searchForm.tableName
      }
      if (this.searchForm.enum_value) {
        obj.enum_value = this.searchForm.enum_value
      }
      getMetaenumData(obj).then(res => {
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
