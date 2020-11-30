<template>
  <div class="page-container-gap">
    <div v-if="sid">
      <el-button @click="goBack">返回</el-button>
    </div>
    <el-form v-else :inline="true" :model="form">
      <el-form-item label="手机号">
        <el-input size="small" v-model="form.phoneNumber" @keyup.enter.native="getTableData(1,10)"></el-input>
      </el-form-item>
      <el-form-item label="发送来源">
        <el-input size="small" v-model="form.origin" @keyup.enter.native="getTableData(1,10)"></el-input>
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
        <el-button type="primary" @click="getTableData(1,10)">查询</el-button>
      </el-form-item>
    </el-form>
    <main class="tableMainContent">
    <el-table
    :data="tableData"
    stripe
    border
    style="width: 100%"
    v-loading="tableLoading">
    <el-table-column
      prop="mobile"
      label="手机号"
      width="200"
      :resizable="false"
      align="center">
    </el-table-column>
    <el-table-column
      prop="trigger_type"
      label="发送来源"
      width="200"
      :resizable="false"
      align="center">
    </el-table-column>
    <el-table-column
      prop="ads_name"
      label="活动名称"
      width="200"
      :resizable="false"
      align="center">
    </el-table-column>
    <el-table-column
      label="发送状态"
      width="200"
      :resizable="false"
      align="center">
      <template slot-scope="scope">
        {{status(scope.row.msg_send_status)}}
      </template>
    </el-table-column>
    <el-table-column
      prop="send_num"
      label="发送条数"
      width="200"
      :resizable="false"
      align="center">
    </el-table-column>
    <el-table-column
      prop="send_content"
      label="发送内容"
      width="200"
      :resizable="false"
      align="center">
    </el-table-column>
    <el-table-column
      prop="fail_reason"
      label="失败原因"
      width="200"
      :resizable="false"
      align="center">
    </el-table-column>
    <el-table-column
      prop="send_time"
      label="发送时间"
      width="200"
      :resizable="false"
      align="center">
    </el-table-column>
    <el-table-column
      prop="create_user"
      label="创建人"
      width="200"
      :resizable="false"
      align="center">
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
import { querySMSLog } from "@/api/markting/SMSFunction"
export default {
  mounted(){
    this.getTableData(1,10)
  },
  props:{
    sid:{
      
    }
  },
  data(){
    return {
      status(type){
        if(type == 1) return '发送成功'
        if(type == 2) return '发送失败'
      },
      statusOptions:[
        {
          label: "不限",
          value: '',
        },
        {
          label: "发送成功",
          value: 1,
        },
        {
          label: "发送失败",
          value: 2,
        }
      ],
      form:{
        phoneNumber:'',
        origin:'',
        status:''
      },
      tableData:[],
      pageNum:1,
      pageSize:10,
      total:0,
      tableLoading:false
    }
  },
  methods:{
    getTableData(pageNum,pageSize){
      this.tableLoading = true
      let obj = {}
      if(this.sid){
        obj.id = this.sid
      }else{
        if(this.form.phoneNumber) obj.mobile = this.form.phoneNumber
        if(this.form.origin) obj.trigger_type = this.form.origin
        if(this.form.status) obj.msg_send_status = this.form.status
      }
      querySMSLog({
        pageNum,
        pageSize,
        dx_status:'sms',
        ...obj
      }).then(({data})=>{
        this.tableLoading = false
        this.tableData = data.list
        this.pageNum = data.pagination.current
        this.pageSize = data.pagination.page_size
        this.total = data.pagination.total
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
    },
    goBack(){
      this.$emit('back')
    }
  }
};
</script>


<style lang="scss" scoped>

</style>