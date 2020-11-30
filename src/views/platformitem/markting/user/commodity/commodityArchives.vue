<template>
  <div class="page-container-gap">
    <div class="conditon">
      <el-form label-position="right" label-width="90px">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="宝贝名称">
              <el-input v-model="searchForm.product_name_cn" @keyup.enter.native="filterData" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="商品编号">
              <el-input v-model="searchForm.product_code" @keyup.enter.native="filterData" clearable/>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="店铺名称">
              <el-input v-model="searchForm.nick" @keyup.enter.native="filterData" clearable/>
            </el-form-item>
          </el-col>
      
        <el-col :span="6" v-if="isMoreinquiries">
            <el-form-item label="平台">
              <el-select v-model="searchForm.platform_name" clearable  placeholder="请选择">
                <el-option
                  v-for="item in platform_list"
                  :key="item.platform_code"
                  :label="item.platform_name"
                  :value="item.platform_code">
                </el-option>
              </el-select>
            </el-form-item>
        </el-col>
         <el-col :span="6" style="text-align:center;">
            <!-- <el-form-item style="white-space:nowrap;"> -->
            <el-button class="search-common" type="primary" @click="filterData">查询</el-button>
            <el-button v-show="!isMoreinquiries" @click="searchMore">更多筛选</el-button>
            <el-button v-show="isMoreinquiries" type="primary" class="search-collapse" @click="searchMore">收起<i class="el-icon-d-arrow-right"/> </el-button>
            <!-- </el-form-item> -->
          </el-col>
          <!-- <el-col :span="8">
            <el-form-item label="菜单名">
              <el-input v-model="searchForm.create_user" @keyup.enter.native="filterData" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="平台名称">
              <el-input v-model="searchForm.update_user" @keyup.enter.native="filterData"/>
            </el-form-item>
          </el-col> -->
        </el-row>
      </el-form>
    </div>
    <div style="padding:10px;background:#fff">
      <!-- <el-button type="primary" style="margin-bottom:10px" @click="mod('add')">添加品牌</el-button> -->
      <el-table
        v-loading="loading"
        stripe
        :data="list"
        max-height="450"
        border>
        <el-table-column
          label="宝贝名称"
          prop="product_name_cn"/>
            <el-table-column
          label="图片"
          prop="logo"  show-overflow-tooltip>
          <template  slot-scope="scope">
            <el-popover
              placement="top-start"
              width="200"
              trigger="hover"
            >
              <img
                :src="scope.row.pic_url==undefined?'':scope.row.pic_url"
                :onerror="default_img"
                style="max-height:500px"
              >
              <img
                slot="reference"
                :src="scope.row.pic_url==undefined?'':scope.row.pic_url"
                :onerror="default_img"
                class="table-cell-img"
              >
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column
          label="商品编号" 
          prop="product_code"/>
        <el-table-column
          label="产品链接" 
          prop="product_link"/>
        <el-table-column
          label="店铺名称" 
          prop="nick"/>
      
        <el-table-column
          label="平台"
          prop="platform_name"/>
        <el-table-column
          label="数量"
          prop="quantity"/>
        <!-- <el-table-column
          label="操作"
          width="140">
          <template slot-scope="scope">
            <div>
              <el-button type="text" @click="mod(scope.row,'view')">查看</el-button>
              <el-button type="text" @click="mod(scope.row,'edit')">编辑</el-button>
              <el-button type="text"  class="deleteFontColor" v-show="false" @click="deleteFun(scope.row)">删除</el-button>
            </div>
          </template>
        </el-table-column> -->
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
import { queryByPage, queryPlatformList ,deleteBrand} from '@/api/interaction/treasureTable'
export default {
  name: 'menulist',
  data() {
    return {
      default_img: 'this.src="' + apiObj.defult_404_avata + '"',
      loading: false,
      typeLoading: false,
      isMoreinquiries: false,
      initDone: false,
      platform_list:[],
      searchForm: {
        product_code: '',
        product_name_cn: '',
        nick:'',
        platform_name:''
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
    this.queryPlatformListFun()
    this.init()
  },
  methods: {
    searchMore() {
      this.isMoreinquiries = !this.isMoreinquiries
    },
    async queryPlatformListFun(queryString, queryType) {
      let data = await queryPlatformList({});
        let platform_list = [];
        if (data.data.platformNameList && data.data.platformNameList.length > 0) {
          this.platform_list= data.data.platformNameList
        }
    },
    deleteFun(item) {
      this.$confirm('是否删除该品牌？', '提示', {
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
          name: 'brandManageDetail',
          query: { type:type}
        })
      }else{
        this.$router.push({
          name: 'brandManageDetail',
          query: { id: row.id ,type:type}
        })
      }
    },
    loadData() {
      this.loading = true
      const sdata = this.searchForm ? JSON.parse(JSON.stringify(this.searchForm)) : {}
      const fuzzy={
        ...sdata
      }
      queryByPage({
        pageNum: this.params.current,
        pageSize: this.params.pageSize,
        fuzzy_type:fuzzy
      }).then(res => {
        this.loading = false
        this.total = parseInt(res.pagination.total)
        this.list = res.list||[]
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
