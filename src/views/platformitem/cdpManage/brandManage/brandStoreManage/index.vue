<template>
  <div class="page-container-gap">
    <div class="conditon">
      <el-form label-position="right" label-width="90px">
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="品牌名称">
              <el-input v-model="searchForm.brandName" clearable @keyup.enter.native="filterData" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="品牌code">
              <el-input v-model="searchForm.brandCode" clearable  @keyup.enter.native="filterData"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-button type="primary" @click="filterData">查询</el-button>
            <el-button type="primary" @click="isMoreinquiries = !isMoreinquiries" >更多筛选</el-button>
          </el-col>
        </el-row>
        <el-row v-show="isMoreinquiries" :gutter="20">
          <el-col :span="8">
            <el-form-item label="店铺名称">
              <el-input v-model="searchForm.storeName" @keyup.enter.native="filterData"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="店铺code">
              <el-input v-model="searchForm.storeCode" @keyup.enter.native="filterData" />
            </el-form-item>
          </el-col>
         
        </el-row>
      </el-form>
    </div>
    <div style="padding:10px;background:#fff">
      <el-button type="primary" style="margin-bottom:10px" @click="mod('add')">添加品牌店铺</el-button>
      <el-table
        v-loading="loading"
        stripe
        :data="list"
        max-height="450"
        border>
        <el-table-column
          label="品牌名称"
          prop="brandName"/>
        <el-table-column
          label="品牌code" 
          prop="brandCode"/>
        <el-table-column
          label="品牌logo"
          prop="brandLogoUrl"  show-overflow-tooltip>
          <template  slot-scope="scope">
            <el-popover
              placement="top-start"
              width="200"
              trigger="hover"
            >
              <img
                :src="scope.row.brandLogoUrl==undefined?'':scope.row.brandLogoUrl"
                :onerror="default_img"
                style="max-height:500px"
              >
              <img
                slot="reference"
                :src="scope.row.brandLogoUrl==undefined?'':scope.row.brandLogoUrl"
                :onerror="default_img"
                class="table-cell-img"
              >
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column
          label="店铺编号"
          prop="storeCode"/>
        <el-table-column
          label="店铺名称"
          prop="storeName"/>
        <el-table-column
          label="操作"
          width="140">
          <template slot-scope="scope">
            <div>
              <el-button type="text" @click="mod(scope.row,'view')">查看</el-button>
              <el-button type="text" @click="mod(scope.row,'edit')">编辑</el-button>
              <el-button type="text" @click="deleteFun(scope.row)" class="deleteFontColor">删除</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <base-pagination
      class="bottomPagination"
        v-model="params.current"
        :page-size.sync="params.pageSize"
        :total="total"
        @loadData="loadData"
      />
    </div>

  </div>
</template>
<script>
import {apiObj} from '@/config/getUrl.js'
import { queryByPage, listTableNameShow ,deleteBrand} from '@/api/brandStoreManage'
export default {
  name: 'menulist',
  data() {
    return {
      default_img: 'this.src="' + apiObj.defult_404_avata + '"',
      loading: false,
      typeLoading: false,
      isMoreinquiries: false,
      initDone: false,
      searchForm: {
        brandName: '',
        brandCode: '',
        storeCode:'',
        storeName:''
      },
      params: {
        pageSize: 10,
        current: 1
      },
      total: 0,
      list: [],
      tableColumns: [],
      filterColumns: [],
      labelTypes: [
        { label: '基础属性', value: 'normal' },
        { label: '聚合属性', value: 'aggregation' }
      ],
      listTableNameShow: []
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    deleteFun(item) {
      console.log('888')
      this.$confirm('是否删除该品牌店铺？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          closeOnClickModal: false,
          type: 'warning'
      }).then(() => {
        deleteBrand({
          id: item.id
        }).then(res => {
          if (res.code == 0) {
            this.$message({
              message: res.msg,
              type: 'success'
            })
          this.filterData()
          }
        })
      }).catch(() => {})
    },
    init() {
      this.loadData()
    },
    mod(row, type) {
      if(type =='add'){
        this.$router.push({
          name: 'brandStoreManageDetail',
          query: { type:type}
        })
      }else{
        this.$router.push({
          name: 'brandStoreManageDetail',
          query: { id: row.id ,type:type}
        })
      }
    },
    loadData() {
      this.loading = true
      const sdata = this.searchForm ? JSON.parse(JSON.stringify(this.searchForm)) : {}
      queryByPage({
        pageNo: this.params.current,
        pageSize: this.params.pageSize,
        params: sdata
      }).then(res => {
        this.loading = false
        this.total = parseInt(res.body.total)
        this.list = res.body.records
      }).catch(() => {
        this.loading = false
      })
    },
    filterData() {
      this.params.current = 1
      this.loadData()
    }
  }
}
</script>
<style lang="less" scoped>
.page-container-gap{
  // background: white;
  height: 100%;
  .conditon{
    margin-bottom: 10px;
    padding: 15px 15px 0;
     background: white;
  }
}

</style>
