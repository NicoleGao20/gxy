<template>
  <div class="page-container-gap">
    <el-form :inline="true" :model="form">
      <el-form-item label="手机号">
        <el-input size="small" v-model="form.phoneNumber"></el-input>
      </el-form-item>
      <el-form-item label="创建人">
        <el-input size="small" v-model="form.creatUser"></el-input>
      </el-form-item>
      <el-form-item label="创建时间">
        <el-date-picker
          v-model="form.timeArr"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd HH:mm:ss">
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getTableData(1,10)">查询</el-button>
      </el-form-item>
    </el-form>
    <main class="tableMainContent">
    <el-button type="primary" class="listAddBtnStyle" @click="addPhone = true">新增</el-button>
    <el-button type="primary" class="listAddBtnStyle" @click="addManyPhone = true">导入</el-button>
    <el-table
    :data="tableData"
    stripe
    border
    style="width: 100%"
    v-loading="tableLoading">
    <el-table-column
      prop="mobile"
      label="手机号"
      :resizable="false"
      align="center">
    </el-table-column>
    <el-table-column
      prop="create_user"
      label="创建人"
      :resizable="false"
      align="center">
    </el-table-column>
    <el-table-column
      prop="create_time"
      label="创建时间"
      :resizable="false"
      align="center">
    </el-table-column>
    <el-table-column
      prop="address"
      label="操作"
      width="150"
      :resizable="false"
      header-align="center">
      <template slot-scope="scope">
        <el-button type="text" class="deleteFontColor" @click="handleDelete(scope.row.id)">删除</el-button>
      </template>
    </el-table-column>
    </el-table>
    <el-pagination
      class="bottomPagination"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page.sync="pageNum"
      :page-sizes="[10, 20, 30, 40, 50]"
      :page-size="pageSize"
      background
      layout="prev, pager, next, sizes"
      :total="total">
    </el-pagination>
    <el-dialog
      title="新增手机号"
      :visible.sync="addPhone"
      width="30%"
      :before-close="handleClose">
      <el-form ref="add" :model="addMobile">
        <el-form-item label="手机号" prop="mobile" :rules="{ required: true, message: '请输入手机号', trigger: 'blur' }">
          <el-input v-model="addMobile.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addPhone = false">取 消</el-button>
        <el-button type="primary" @click="submitAddMobile">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="导入手机号"
      :visible.sync="addManyPhone"
      width="30%">
      <el-form>
        <el-form-item label="模版下载：">
          <el-button type="text">点击下载引入模版</el-button>
          (表头不可修改)
        </el-form-item>
        <el-form-item label="文件选择：">
          <el-upload
          ref="upload"
          :show-file-list="true"
          :auto-upload="false"
          :limit="1"
          :http-request="uploadFile"
          :on-change="fileChange"
          :before-remove="removeFile"
          accept=".xls, .xlsx"
          action=""
        >
          <el-button size="small" type="primary">选择文件</el-button>
        </el-upload>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleCancel">取 消</el-button>
        <el-button type="primary" @click="handleImport" :loading="btnLoading">确 定</el-button>
      </span>
    </el-dialog>
    </main>
  </div>
</template>


<script>
import { getList, addSmsList, importSmsList, delSmsList } from "@/api/markting/marketingRestriction"
export default {
  props:{
    type:{
      type:String,
      default:'sms_blacklist'
    }
  },
  mounted(){
    this.getTableData(1,10)
  },
  data(){
    return {
      form:{
        phoneNumber:'',
        creatUser:'',
        timeArr:null
      },
      tableData:[],
      pageNum:1,
      pageSize:10,
      total:0,
      tableLoading:false,
      addPhone:false,
      addManyPhone:false,
      addMobile:{
        mobile:''
      },
      isFile:false,
      btnLoading:false
    }
  },
  methods:{
    getTableData(pageNum,pageSize){
      this.tableLoading = true
      let obj = {}
      if(this.form.phoneNumber) obj.mobile = this.form.phoneNumber
      if(this.form.creatUser) obj.create_uesr = this.form.creatUser
      if(this.form.timeArr) {
        obj.create_time_begin = this.form.timeArr[0]
        obj.create_time_end = this.form.timeArr[1]
      }
      getList({
        pageNum,
        pageSize,
        list_type:this.type,
        ...obj
      }).then(({data})=>{
        this.tableLoading = false
        this.tableData = data.list
        this.pageNum = data.pagination.current
        this.pageSize = data.pagination.page_size
        this.total = data.pagination.total
      })
    },
    handleSizeChange(val){
      this.getTableData(1,val)
    },
    handleCurrentChange(val){
      this.getTableData(val,this.pageSize)
    },
    jump(mode){
      this.$router.push({name:'newSMSTemplate',query:{mode}})
    },
    submitAddMobile(){
      this.$refs.add.validate((valid) => {
        if (valid) {
          addSmsList({
            mobile:this.addMobile.mobile,
            list_type:this.type
          }).then(()=>{
            this.addPhone = false
            this.$message.success('添加成功')
            this.getTableData(1,10)
          })
        } else {
          return false;
        }
      })
    },
    handleClose(){
      this.addMobile.mobile = ''
      this.addPhone = false
    },
    uploadFile(file){
      var data = new FormData()
      data.append('file', file.file)
      data.append('list_type', this.type)
      this.btnLoading = true
      importSmsList(data).then(({ data }) => {
        this.$refs.upload.clearFiles()
        this.isFile = false
        this.btnLoading = false
        this.addManyPhone = false
        this.$message.success(data.msg)
        this.getTableData(1,10)
      })
    },
    fileChange(){
      this.isFile = true
    },
    removeFile(){
      this.isFile = false
    },
    handleImport(){
      if (this.isFile) {
        this.$refs.upload.submit()
      } else {
        this.$message('请选择文件')
      }
    },
    handleCancel(){
      this.$refs.upload.clearFiles()
      this.addManyPhone = false
    },
    handleDelete(id){
      this.$confirm('确认删除吗', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(()=>{
        delSmsList({
          id
        }).then(()=>{
          this.getTableData(this.pageNum,this.pageSize)
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        })
      })
    }
  }
};
</script>


<style lang="scss" scoped>

</style>