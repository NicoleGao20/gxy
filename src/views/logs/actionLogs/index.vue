<template>
  <div>
    <customTable v-if="jsonData" :json-data="jsonData"/>
  </div>
</template>

<script>
import customTable from '@/components/customTable'
import jsonData from '../json'
import { getJsonData } from '@/api/logs.js'
export default {
  name: 'CustomTable',
  components: {
    customTable
  },
  data() {
    return {
      jsonData: '',
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
    getJsonData().then(res => {
      this.jsonData = res.data
    })
  },
  mounted() {

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
