<template>
  <div class="page-container-gap">
    <el-form :inline="true" :model="form">
      <el-form-item label="手机号">
        <el-input size="small" v-model="form.phoneNumber" placeholder="请输入" @keyup.enter.native="getTableData(1,10)"></el-input>
      </el-form-item>
      <el-form-item label="回复时间">
        <el-date-picker
          v-model="form.timeArr"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd HH:mm:ss">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="回复内容">
        <el-input size="small" v-model="form.content" placeholder="请输入" @keyup.enter.native="getTableData(1,10)"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getTableData(1,10)">查询</el-button>
      </el-form-item>
    </el-form>
    <main class="tableMainContent">
    <!-- <el-button type="primary">另存为受众</el-button> -->
    <el-button type="primary" class="listAddBtnStyle" style="width:auto" :disabled="!selectingList.length" @click="addBlackList">加入短信黑名单</el-button>
    <el-button type="primary" class="listAddBtnStyle" :disabled="!selectingList.length" @click="exportExcle">导出选中</el-button>
    <el-button type="primary" class="listAddBtnStyle" @click="exportAll" :disabled="!tableData.length">导出结果集</el-button>
    <el-table
    :data="tableData"
    stripe
    border
    style="width: 100%"
    v-loading="tableLoading"
    ref="multipleTable"
    @selection-change="handleSelectionChange"
    :row-key="getRowKeys">
    <el-table-column
      type="selection"
      width="55"
      :reserve-selection="true">
    </el-table-column>
    <el-table-column
      label="手机号"
      width="300px"
      :resizable="false"
      align="center">
      <template slot-scope="scope">
        <span :style="{color:scope.row.checkFlag ? '' : 'red'}">{{scope.row.mobile}}</span>
      </template>
    </el-table-column>
    <el-table-column
      prop="reply_time"
      label="回复时间"
      :resizable="false"
      width="300px"
      align="center">
    </el-table-column>
    <el-table-column
      prop="reply_content"
      label="回复内容"
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
import { smsFeedBackList, addSmsBlacklist, exportExcel } from "@/api/markting/SMSFunction"
import { checkBlack } from "@/api/markting/SMSFunction"
export default {
  mounted(){
    this.getTableData(1,10)
  },
  data(){
    return {
      typeOptions:[
        {
          label: "验证码",
          value: "验证码",
        },
        {
          label: "通用",
          value: "通用",
        }
      ],
      statusOptions:[
        {
          label: "审核中",
          value: "审核中",
        },
        {
          label: "审核通过",
          value: "审核通过",
        },
        {
          label: "审核失败",
          value: "审核失败",
        }
      ],
      form:{
        phoneNumber:'',
        timeArr:null,
        content:''
      },
      tableData:[],
      pageNum:1,
      pageSize:10,
      total:0,
      tableLoading:false,
      selectingList:[],
      nowFilter:{},
      
    }
  },
  methods:{
    getTableData(pageNum,pageSize){
      this.tableLoading = true
      let obj = {}
      if(this.form.phoneNumber) obj.mobile = this.form.phoneNumber
      if(this.form.timeArr){
        obj.reply_time_begin = this.form.timeArr[0]
        obj.reply_time_end = this.form.timeArr[1]
      }
      if(this.form.content) obj.reply_content = this.form.content
      smsFeedBackList({
        pageNum,
        pageSize,
        ...obj
      }).then(({data})=>{
        let list = data.list.map(item=>{
          return {
            tel:item.mobile
          }
        })
        checkBlack({phoneArray:list}).then(res=>{
          this.nowFilter = obj
          this.tableLoading = false
          this.tableData = data.list.map((item,i)=>{
            return {
              checkFlag:res.data[i].checkFlag,
              ...item
            }
          })
          this.pageNum = data.pagination.current
          this.pageSize = data.pagination.page_size
          this.total = data.pagination.total
        }).catch(()=>{
          this.tableLoading = false
        })
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
    handleSelectionChange(val){
      this.selectingList = val
    },
    addBlackList(){
      this.$confirm('确认加入黑名单吗', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(()=>{
        let mobile = []
        this.selectingList.forEach(item=>{
          mobile.push(item.mobile)
        })
        addSmsBlacklist({mobile}).then(()=>{
          this.$message.success('添加成功')
          this.getTableData(this.pageNum,this.pageSize)
          this.$refs.multipleTable.clearSelection()
        }).catch(()=>{
          this.getTableData(this.pageNum,this.pageSize)
        })
      })
    },
    exportExcle(){
      let id_list = []
      this.selectingList.forEach(item=>{
        id_list.push(item.id)
      })
      exportExcel({
        id_list
      }).then(()=>{
        this.$message.success('导出成功，请移至下载中心下载')
      })
    },
    exportAll(){
      if(Object.keys(this.nowFilter).length){
        exportExcel({...this.nowFilter}).then(()=>{
          this.$message.success('导出成功，请移至下载中心下载')
      })
      }else{
        exportExcel().then(()=>{
          this.$message.success('导出成功，请移至下载中心下载')
      })
      }
    },
    getRowKeys(row) {
      return row.id
    }
  }
};
</script>


<style lang="scss" scoped>

</style>