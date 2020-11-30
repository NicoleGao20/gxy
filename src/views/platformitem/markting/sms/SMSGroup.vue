<template>
  <div>
    <el-form :inline="true" :model="form">
      <el-form-item label="任务名称">
        <el-input size="small" v-model="form.name" @keyup.enter.native="getTableData(1,10)"></el-input>
      </el-form-item>
      <el-form-item label="短信签名">
        <el-input size="small" v-model="form.sign" @keyup.enter.native="getTableData(1,10)"></el-input>
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
    <el-button type="primary" class="listAddBtnStyle" @click="$router.push({name:'SMSGroupTemplate'})">新增</el-button>
    <el-table
    :data="tableData"
    stripe
    border
    style="width: 100%"
    v-loading="tableLoading">
    <el-table-column
      prop="sms_name"
      label="消息名称"
      width="150"
      :resizable="false"
      align="center">
    </el-table-column>
    <el-table-column
      prop="trigger_type"
      label="触发类型"
      width="150"
      :resizable="false"
      header-align="center">
    </el-table-column>
    <el-table-column
      prop="message_sign"
      label="短信签名"
      width="150"
      :resizable="false"
      align="center">
    </el-table-column>
    <el-table-column
      prop="cnt_audience"
      label="受众人群数"
      width="150"
      :resizable="false"
      align="center">
    </el-table-column>
    <el-table-column
      prop="cnt_audience_valid"
      label="有效人群数"
      width="150"
      :resizable="false"
      align="center">
    </el-table-column>
    <el-table-column
      prop="send_audience"
      label="成功发送数"
      width="150"
      :resizable="false"
      header-align="center">
    </el-table-column>
    <el-table-column
      prop="sms_send_status"
      label="发送状态"
      width="150"
      :resizable="false"
      align="center">
    </el-table-column>
    <el-table-column
      prop="create_time"
      label="创建时间"
      width="150"
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
      prop="update_user"
      label="修改人"
      width="150"
      :resizable="false"
      align="center">
    </el-table-column>
    <el-table-column
      prop="update_time"
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
        <el-button type="text" @click="jump('view',scope.row.id)">查看</el-button>
        <el-button type="text" @click="jump('edit',scope.row.id)" v-if="scope.row.sms_send_status == 0">编辑</el-button>
        <el-button type="text" v-if="scope.row.sms_send_status == 0" @click="stopSms(scope.row.id)">停止</el-button>
        <el-button type="text" v-if="scope.row.sms_send_status != 0" @click="watchLog(scope.row.id)">查看日志</el-button>
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
import { smsGroupPageList, stopSmsMassByXxlId } from "@/api/markting/SMSFunction"
export default {
  mounted(){
    this.getTableData(1,10)
  },
  data(){
    return {
      statusOptions:[
        {
          label: "不限",
          value: '',
        },
        {
          label: "待发送",
          value: 0,
        },
        {
          label: "已发送",
          value: 1,
        },
        {
          label: "发送中",
          value: 2,
        }
      ],
      form:{
        name:'',
        sign:'',
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
      if(this.form.name) obj.sms_name = this.form.name
      if(this.form.sign) obj.message_sign = this.form.sign
      if(this.form.status || this.form.status === 0) obj.sms_send_status = this.form.status
      smsGroupPageList({
        pageNum,
        pageSize,
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
    jump(mode,id){
      this.$router.push({name:'SMSGroupTemplate',query:{mode,id}})
    },
    stopSms(id){
      this.$confirm('确定停止发送吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        stopSmsMassByXxlId({id}).then(()=>{
          this.$message({
            type: 'success',
            message: '停止成功!'
          });
          this.getTableData(this.pageNum,this.pageSize)
        }).catch(()=>{
          this.getTableData(this.pageNum,this.pageSize)
        })
      })
    },
    watchLog(id){
      this.$emit('changeId',id)
    }
  }
};
</script>


<style lang="scss" scoped>

</style>