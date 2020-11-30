<template>
  <div class="page-container-gap">
    <div class="conditon">
      <el-form label-position="right" label-width="90px">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="产品分类">
              <el-select v-model="searchForm.product_type" placeholder="请选择">
                <el-option
                  v-for="item in product_type_list"
                  :key="item.product_type_code"
                  :label="item.product_type"
                  :value="item.product_type_code">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="产品系列">
               <el-select v-model="searchForm.product_series" placeholder="请选择">
                <el-option
                  v-for="item in product_series_list"
                  :key="item.product_series_code"
                  :label="item.product_series"
                  :value="item.product_series_code">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="产品名称">
              <el-input v-model="searchForm.product_name_cn" @keyup.enter.native="filterData" clearable/>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-button type="primary" @click="filterData">查询</el-button>
            <!-- <el-button type="primary" @click="isMoreinquiries = !isMoreinquiries" >更多筛选</el-button> -->
          </el-col>
        </el-row>
        <el-row v-show="isMoreinquiries" :gutter="20">
      
        </el-row>
      </el-form>
    </div>
    <div style="padding:10px;background:#fff">
      <el-button type="primary" style="margin-bottom:10px" @click="mod('add')">添加商品</el-button>
      <el-table
        v-loading="loading"
        stripe
        :data="list"
        max-height="450"
        border>
        <el-table-column
          label="商品编号"
          prop="product_code"/>
        <el-table-column
          label="商品名称"
          prop="product_name_cn"/>
        <el-table-column
          label="产品分类" 
          prop="product_category"/>
        <el-table-column
          label="产品系列" 
          prop="product_series"/>
        <el-table-column
          label="操作"
          width="140">
          <template slot-scope="scope">
            <div>
              <el-button type="text" @click="mod(scope.row,'view')">查看</el-button>
              <el-button type="text" @click="mod(scope.row,'edit')">编辑</el-button>
              <el-button type="text"  class="deleteFontColor" v-show="false" @click="deleteFun(scope.row)">删除</el-button>
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
import { queryByPage, getCommodityQueryBox ,delCommodity} from '@/api/interaction/commodityList'
export default {
  name: 'menulist',
  data() {
    return {
      product_type_list:[],
      product_series_list:[],
      default_img: 'this.src="' + apiObj.defult_404_avata + '"',
      loading: false,
      typeLoading: false,
      isMoreinquiries: false,
      initDone: false,
      searchForm: {
        product_type: '',
        product_name_cn:'',
        product_series: '',
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
    getCommodityQueryBoxFun(){
      getCommodityQueryBox().then((res)=>{
        this.product_series_list=res.data.productSeriesList||[]
        this.product_type_list=res.data.productSeriesList||[]
      })
    },
    deleteFun(item) {
      this.$confirm('是否删除该商品？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          closeOnClickModal: false,
          type: 'warning'
      }).then(() => {
        delCommodity({
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
          name: 'commodityEdit',
          query: { type:type}
        })
      }else{
        this.$router.push({
          name: 'commodityEdit',
          query: { id: row.id ,type:type}
        })
      }
    },
    loadData() {
      this.loading = true
      const sdata = this.searchForm ? JSON.parse(JSON.stringify(this.searchForm)) : {}
      queryByPage({
        pageNum: this.params.current,
        pageSize: this.params.pageSize,
        fuzzy_type: sdata
      }).then(res => {
        console.log(res,'res')
        this.loading = false
        this.total = parseInt(res.data.pagination.total)
        this.list = res.data.list||[]
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
