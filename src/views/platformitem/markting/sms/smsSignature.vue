<template>
  <div class="page-container-gap">
    <el-form :inline="true" :model="form">
      <el-form-item label="签名名称">
        <el-input size="small" v-model="form.name" @keyup.enter.native="getTableData(1,10)"></el-input>
      </el-form-item>
      <el-form-item label="签名来源">
        <el-select  v-model="form.origin">
          <el-option
            v-for="item in originOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="审核状态">
        <el-select  v-model="form.status">
          <el-option
            v-for="item in statusOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getTableData(1,10)">查询</el-button>
      </el-form-item>
    </el-form>
    <main class="tableMainContent">
    <el-button type="primary" class="listAddBtnStyle" @click="$router.push({name:'newSmsSignature'})">新增</el-button>
    <el-table
    :data="tableData"
    stripe
    border
    style="width: 100%"
    v-loading="tableLoading">
    <el-table-column
      prop="sign_name"
      label="签名名称"
      width="180"
      :resizable="false"
      align="center">
    </el-table-column>
    <el-table-column
      label="签名来源"
      width="150"
      :resizable="false"
      align="center">
      <template slot-scope="scope">
        {{templateOrigin(scope.row.sign_source)}}
      </template>
    </el-table-column>
    <el-table-column
      label="审核状态"
      width="150"
      :resizable="false"
      align="center">
      <template slot-scope="scope">
        <span :class="{warn:scope.row.status == 2}">{{templateStatus(scope.row.status)}}</span>
      </template>
    </el-table-column>
    <el-table-column
      prop="remark"
      label="申请说明"
      width="300"
      :resizable="false"
      header-align="center">
    </el-table-column>
    <el-table-column
      label="失败原因"
      width="200"
      :resizable="false"
      header-align="center">
      <template slot-scope="scope">
        {{scope.row.status == 2 ? scope.row.reason : '无审核备注'}}
      </template>
    </el-table-column>
    <el-table-column
      prop="create_time"
      label="创建时间"
      width="200"
      :resizable="false"
      align="center">
    </el-table-column>
    <el-table-column
      prop="create_user"
      label="创建人"
      width="150"
      :resizable="false"
      align="center">
    </el-table-column>
    <el-table-column
      prop="address"
      label="操作"
      width="230"
      fixed="right"
      :resizable="false"
      header-align="center">
      <template slot-scope="scope">
        <el-button type="text" @click="jump('view',scope.row.id)">查看</el-button>
        <el-button type="text" v-if="scope.row.status == 1 && !defaultId" @click="setDefault(scope.row.id,1)">设为默认</el-button>
        <el-button type="text" v-if="defaultId && scope.row.id == defaultId" @click="setDefault(scope.row.id,0)">取消默认</el-button>
        <el-button type="text" @click="jump('edit',scope.row.id)" v-if="scope.row.status == 2">编辑</el-button>
        <el-button type="text" class="deleteFontColor" @click="deleteSign(scope.row.id)" v-if="scope.row.status != 0">删除</el-button>
      </template>
    </el-table-column>
    </el-table>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page.sync="pageNum"
      :page-sizes="[10, 20, 30, 40, 50]"
      :page-size="pageSize"
      background
      layout="prev, pager, next, sizes"
      :total="total">
    </el-pagination>
    </main>
  </div>
</template>


<script>
import { querySMSSign, deleteSMSSign, setDefault } from "@/api/markting/SMSFunction"
export default {
  mounted(){
    this.getTableData(1,10)
  },
  data(){
    return {
      templateStatus(type){
        if(type == 0) return "审核中"
        if(type == 1) return "通过审核"
        if(type == 2) return "未通过审核"
      },
      templateOrigin(type){
        if(type == 0) return "企事业单位的全程或简称"
        if(type == 1) return "工信部备案网站的全称或简称"
        if(type == 2) return "APP应用的全称或简称"
        if(type == 3) return "公众号或小程序的全称或简称"
        if(type == 4) return "电商平台店铺名的全程或简称"
        if(type == 5) return "商标名的全程或简称"
      },

      originOptions:[
        {
          label: "不限",
          value: "",
        },
        {
          label: "企事业单位的全程或简称",
          value: 0,
        },
        {
          label: "工信部备案网站的全称或简称",
          value: 1,
        },
        {
          label: "APP应用的全称或简称",
          value: 2,
        },
        {
          label: "公众号或小程序的全称或简称",
          value: 3,
        },
        {
          label: "电商平台店铺名的全程或简称",
          value: 4,
        },
        {
          label: "商标名的全程或简称",
          value: 5,
        },
      ],
      statusOptions:[
        {
          label: "不限",
          value: "",
        },
        {
          label: "审核中",
          value: 0,
        },
        {
          label: "审核通过",
          value: 1,
        },
        {
          label: "审核失败",
          value: 2,
        }
      ],
      form:{
        name:'',
        origin:'',
        status:''
      },
      tableData:[],
      pageNum:1,
      pageSize:10,
      total:0,
      tableLoading:false,
      defaultId:''
    }
  },
  methods:{
    getTableData(pageNum,pageSize){
      this.tableLoading = true
      let obj = {}
      if(this.form.name) obj.sign_name = this.form.name
      if(this.form.origin) obj.sign_source = this.form.origin
      if(this.form.status || this.form.status === 0) obj.status = this.form.status
      querySMSSign({
        pageNum,
        pageSize,
        ...obj
      }).then(({data})=>{
        this.tableLoading = false
        this.tableData = data.list
        this.pageNum = data.pagination.current
        this.pageSize = data.pagination.page_size
        this.total = data.pagination.total
        this.defaultId = data.is_default
      }).catch(()=>{
        this.tableLoading = false
      })
    },
    handleSizeChange(val){
      this.getTableData(1,val)
    },
    handleCurrentChange(val){
      this.getTableData(val,this.pageSize)
    },
    jump(mode,id){
      this.$router.push({name:'newSmsSignature',query:{mode,id}})
    },
    deleteSign(id) {
      this.$confirm('确定删除签名吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteSMSSign({id}).then(()=>{
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
          this.getTableData(this.pageNum,this.pageSize)
        }).catch(()=>{
          this.getTableData(this.pageNum,this.pageSize)
        })
      })
    },
    setDefault(id,status){
      if(status === 0){
        this.$confirm('是否确认取消默认签名?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(()=>{
          setDefault({id,status})
          this.$message({
            type: 'success',
            message: '取消成功!'
          })
          this.getTableData(this.pageNum,this.pageSize)
        })
      }else if(status === 1){
        this.$confirm('是否设置默认签名?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(()=>{
          setDefault({id,status})
          this.$message({
            type: 'success',
            message: '设置成功!'
          })
          this.getTableData(this.pageNum,this.pageSize)
        })
      }
    }
  }
};
</script>


<style lang="scss" scoped>
.warn{
  color: red;
}
</style>