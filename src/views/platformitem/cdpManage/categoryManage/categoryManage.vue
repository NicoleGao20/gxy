<template>
  <div class="page-container-gap">
    <div class="conditon">
      <el-form label-position="right" label-width="90px">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="菜单级别">
              <el-select v-model="searchForm.functionType" placeholder="请选择菜单级别" clearable @keyup.enter.native="filterData" >
                <el-option v-for="(functionType, index) in functionType" :key="index" :label="functionType.label" :value="functionType.value"  />
              </el-select>
              <!-- <el-input v-model="searchForm.functionType"/> -->
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="菜单名称">
              <el-input v-model="searchForm.showName" clearable @keyup.enter.native="filterData" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="平台名称">
              <el-input v-model="searchForm.platformName" clearable @keyup.enter.native="filterData"/>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-button type="primary" @click="filterData">查询</el-button>
            <!-- <el-button type="primary" @click="isMoreinquiries = !isMoreinquiries" >更多筛选</el-button> -->
          </el-col>
        </el-row>
        <el-row v-show="isMoreinquiries" :gutter="20">
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
      <el-button type="primary" style="margin-bottom:10px" @click="mod('add')">添加菜单</el-button>
      <el-table
        v-loading="loading"
        stripe
        :data="list"
        max-height="450"
        border>
        <el-table-column label="序号" width="100">
          <template slot-scope="scope">
            <span>{{ (scope.$index+1) }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="菜单级别"
          width="140">
          <template slot-scope="scope">
            <div v-if="scope.row.functionType ==2">
              一级菜单
            </div>
            <div v-else-if="scope.row.functionType ==3">
              二级菜单
            </div>
            <div v-else-if="scope.row.functionType ==4">
              三级菜单
            </div>
          </template>
        </el-table-column>
        <el-table-column
          label="菜单名称"
          prop="showName"/>
        <el-table-column
          label="一级菜单icon"
          prop="showIcon"  show-overflow-tooltip>
          <template  slot-scope="scope">
            <el-popover
              placement="top-start"
              width="200"
              trigger="hover"
            >
              <img
                :src="scope.row.showIcon==undefined?'':scope.row.showIcon"
                :onerror="default_img"
                style="max-height:500px"
              >
              <img
                slot="reference"
                :src="scope.row.showIcon==undefined?'':scope.row.showIcon"
                :onerror="default_img"
                class="table-cell-img"
              >
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column
          label="菜单英文名称"
          prop="name">
        </el-table-column>
        <el-table-column
          label="显示排序"
          prop="position">
        </el-table-column>
        <el-table-column
          label="所属平台名称"
          prop="platformName"/>
        <el-table-column
          label="操作"
          width="140">
          <template slot-scope="scope">
            <div>
              <el-button type="text" @click="mod(scope.row,'view')">查看</el-button>
              <el-button type="text" @click="mod(scope.row,'edit')">编辑</el-button>
              <el-button type="text"  class="deleteFontColor" @click="deleteFun(scope.row)">删除</el-button>
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
import { queryByPage, listTableNameShow ,deleteMenu} from '@/api/categoryManage'
export default {
  name: 'menulist',
  data() {
    return {
      functionType: [
        { label: '一级菜单', value: '2' },
        { label: '二级菜单', value: '3' },
        // { label: '三级菜单', value: '4' }
      ],
      default_img: 'this.src="' + apiObj.defult_404_avata + '"',
      loading: false,
      typeLoading: false,
      isMoreinquiries: false,
      initDone: false,
      searchForm: {
        platformName: '',
        functionType:'',
        showName: '',
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
      this.$confirm('是否删除该菜单？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          closeOnClickModal: false,
          type: 'warning'
      }).then(() => {
        deleteMenu({
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
          name: 'categoryManageDetail',
          query: { type:type}
        })
      }else{
        this.$router.push({
          name: 'categoryManageDetail',
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
