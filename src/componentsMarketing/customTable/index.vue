<template>
  <div class="dashboard-container">
    <header>
      <el-form
        label-width="80px"
        style="display: flex;
      flex-wrap:wrap;background: #fff;padding: 16px 16px 0 16px; margin-bottom: 16px;">
        <div
          v-for="(item,index) in jsonData.head"
          :key="index"
          :style="{width:item.type ==='time' ? '500px':auto}"
          class="serach-item"
        >
          <el-form-item v-if="item.type ==='input'" :label="item.name" >
            <el-input :placeholder="'请输入' + item.name" v-model="searchForm[index]" />
          </el-form-item>
          <el-form-item v-if="item.type ==='time'" :label="item.name" >
            <el-date-picker
              v-model="searchForm[index]"

              format="yyyy-MM-dd HH:mm:ss"
              value-format="yyyy-MM-dd HH:mm:ss"
              type="datetimerange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"/>
          </el-form-item>
          <el-form-item v-if="item.type ==='select'" :label="item.name" >
            <component
              :is="item.componentName"
              v-model="searchForm[index]"
              :config="{
                multiple: false,
                disabled: false,
                collapseTags: false
              }"
            />
          </el-form-item>
        </div>
        <el-button style="height:32px;margin-left:10px;" @click="search()">查询</el-button>
      </el-form>
    </header>
    <section>
      <el-table
        v-loading="loading"
        stripe
        :data="tableData"
        header-cell-class-name="tableHight"
        style="width: 100%"
      >
        <el-table-column
          v-for="(item,index) in jsonData.tableDataHeader"
          :key="index"
          :prop="item.prop"
          :label="item.label"
          :width="item.width ? item.width: 'auto'"
          :formatter="item.formatter ? item.formatter : (row, column, cellValue, index)=>cellValue"
        />
      </el-table>
    </section>
    <div style="text-align: right;padding: 10px 0;">
      <el-pagination
       class="bottomPagination"
        :current-page.sync="params.currentPage"
        :page-size.sync="params.pageSize"
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
import belleChooseBrandMemberLevel from '@/privatemodules/belle-choose-brand-member-level'
export default {
  name: 'CustomTable',
  components: {
    belleChooseBrandMemberLevel
  },
  props: {
    jsonData: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      loading: false,
      tableData: [],
      searchForm: [],
      params: {
        pageSize: 10,
        currentPage: 1
      },
      total: 10,
      pageSizes: [
        10, 20, 30, 40
      ]
    }
  },
  computed: {
  },
  created() {
    // this.jsonData.head.forEach(element => {
    //   this.searchForm[element.uploadField] = ''
    // })
    // console.log(this.searchForm, 88)
  },
  mounted() {
    this.getDataTable()
    // const that = this
    // // setTimeout(() => {
    // window.addEventListener('message', function(messageEvent) {
    //   var data = messageEvent.data
    //   console.log('收到vue的数据：', data)
    //   that.jsonData = data
    //   that.getDataTable()
    // }, false)
    // }, 2000)

    // localStorage.setItem('orgCode', 'test')
  },
  methods: {
    handleChange($event) {
      console.log($event.target.value)
    },
    search() {
      this.params.currentPage = 1
      this.getDataTable()
    },
    getDataTable() {
      this.loading = true
      const obj = {
        current: this.params.currentPage,
        pageSize: this.params.pageSize
      }
      for (let index = 0; index < this.jsonData.head.length; index++) {
        const element = this.jsonData.head[index]
        obj[element.uploadField] = this.searchForm[index]
        console.log(obj[element.uploadField], this.searchForm[index])
      }
      this.$request({
        url: this.jsonData.dataLink,
        method: 'get',
        params: obj
      }).then(res => {
        this.loading = false
        this.tableData = res.data.list
        this.total = res.data.pagination.total
      })
    },
    handleSizeChange(val, bv) { // 选择每页显示条数
      this.getDataTable()
    },
    handleCurrentChange(val) { // 选择当前页数
      this.getDataTable()
    }
  }
}
</script>

<style lang="less" scoped>
.dashboard {
  &-container {
    margin: 30px;
    .serach-item {
      width: 328px;
    }
  }
  &-text {
    font-size: 20px;
    line-height: 36px;
  }
}
</style>
