<template>
  <div>
    <el-form :inline="true" :model="form">
      <el-form-item label="任务名称">
        <el-input size="small" v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="短信签名">
        <el-input size="small" v-model="form.sign"></el-input>
      </el-form-item>
      <el-form-item label="发送状态">
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
        <el-button type="primary">查询</el-button>
      </el-form-item>
    </el-form>
    <main class="tableMainContent">
    <el-button type="primary" class="listAddBtnStyle" @click="$router.push({name:'SMSGroupTemplate'})">新增</el-button>
    <el-table
    :data="tableData"
    stripe
    border
    style="width: 100%"
    v-loading="tableLoading">
    <el-table-column
      prop="date"
      label="消息名称"
      width="150"
      :resizable="false"
      align="center">
    </el-table-column>
    <el-table-column
      prop="name"
      label="触发类型"
      width="150"
      :resizable="false"
      header-align="center">
    </el-table-column>
    <el-table-column
      prop="address"
      label="短信签名"
      width="150"
      :resizable="false"
      align="center">
    </el-table-column>
    <el-table-column
      prop="address"
      label="受众人群数"
      width="150"
      :resizable="false"
      align="center">
    </el-table-column>
    <el-table-column
      prop="address"
      label="有效人群数"
      width="150"
      :resizable="false"
      header-align="center">
    </el-table-column>
    <el-table-column
      prop="address"
      label="成功发送数"
      width="150"
      :resizable="false"
      header-align="center">
    </el-table-column>
    <el-table-column
      prop="address"
      label="发送状态"
      width="150"
      :resizable="false"
      align="center">
    </el-table-column>
    <el-table-column
      prop="address"
      label="创建时间"
      width="150"
      :resizable="false"
      align="center">
    </el-table-column>
    <el-table-column
      prop="address"
      label="创建人"
      width="150"
      :resizable="false"
      align="center">
    </el-table-column>
    <el-table-column
      prop="address"
      label="修改人"
      width="150"
      :resizable="false"
      align="center">
    </el-table-column>
    <el-table-column
      prop="address"
      label="修改时间"
      width="150"
      :resizable="false"
      align="center">
    </el-table-column>
    <el-table-column
      prop="address"
      label="操作"
      width="200"
      fixed="right"
      :resizable="false"
      header-align="center">
      <template slot-scope="scope">
        <el-button type="text">查看</el-button>
        <el-button type="text">编辑</el-button>
        <el-button type="text">停止</el-button>
        <el-button type="text">查看日志</el-button>
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
import { smsGroupPageList } from "@/api/markting/SMSFunction"
export default {
  mounted(){
    this.getTableData(1,10)
  },
  data(){
    return {
      statusOptions:[
        {
          label: "待发送",
          value: "待发送",
        },
        {
          label: "已发送",
          value: "已发送",
        },
        {
          label: "发送中",
          value: "发送中",
        }
      ],
      form:{
        name:'',
        sign:'',
        status:''
      },
      tableData:[{}],
      pageNum:1,
      pageSize:10,
      total:0,
      tableLoading:false
    }
  },
  methods:{
    getTableData(pageNum,pageSize){
      this.tableLoading = true
      smsGroupPageList({
        pageNum,
        pageSize
      }).then(({data})=>{
        this.tableLoading = false
        this.tableData = data.list
        this.pageNum = data.pageNum
        this.pageSize = data.pageSize
        this.total = data.total
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
    jump(mode){
      this.$router.push({name:'SMSGroupTemplate',query:{mode}})
    }
  }
};
</script>


<style lang="scss" scoped>

</style>