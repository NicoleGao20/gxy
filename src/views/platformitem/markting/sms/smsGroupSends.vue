<template>
  <div class="page-container-gap">
    <header class="searchWrap">
      <el-form label-position="right" label-width="100px">
        <el-col :span="8">
          <el-form-item label="任务名称">
            <el-input
              v-model="searchForm.memberid"
              clearable
              placeholder="请输入"
              @keyup.enter.native="getTableData(1,10)"
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="短信签名">
            <el-input
              v-model="searchForm.memberid"
              clearable
              placeholder="请输入"
              @keyup.enter.native="getTableData(1,10)"
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="发送状态">
            <el-input
              v-model="searchForm.memberid"
              clearable
              placeholder="请输入"
              @keyup.enter.native="getTableData(1,10)"
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="成功发送数">
            <el-input
              v-model="searchForm.memberid"
              clearable
              placeholder="请输入"
              @keyup.enter.native="getTableData(1,10)"
            />
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-button type="primary" @click="getTableData(1,10)">查询</el-button>
        </el-col>
      </el-form>
    </header>
    <main class="tableMainContent">
      <router-link :to="{name:'smsGroupSendsAdd'}"><el-button type="primary" class="listAddBtnStyle">新增</el-button></router-link>
      <el-table
        v-loading="loading"
        stripe
        :data="tableData"
        :header-cell-style="{ background: '#F5F7FA', color: '#333333' }"
        border
      >
        <el-table-column prop="logonname" label="消息名称" width="110" />
        <el-table-column prop="shop_name" label="触发类型" width="110" />
        <el-table-column prop="shop_name" label="短信签名" width="200" />
        <el-table-column prop="shop_name" label="受众人群数" width="110" />
        <el-table-column prop="level_name" label="有效人群数" width="110" />
        <el-table-column prop="member_type" label="成功发送数" width="110" />
        <el-table-column prop="register_date" label="创建时间" width="200" />
        <el-table-column prop="is_premium" label="创建人" width="110" />
        <el-table-column prop="register_date" label="修改时间" width="200" />
        <el-table-column prop="is_premium" label="修改人" width="110" />
        <el-table-column label="操作" fixed="right" border width="200px">
          <template slot-scope="scope">
            <el-button
              type="text"
              size="small"
              class="scopeStyle"
              @click="edit(scope.row)"
            >
              查看
            </el-button>
            <el-button
              type="text"
              size="small"
              class="scopeStyle"
              @click="edit(scope.row)"
            >
              停止
            </el-button>
            <el-button
              type="text"
              size="small"
              class="scopeStyle"
              @click="edit(scope.row)"
            >
              查看日志
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <base-pagination
        class="bottomPagination"
        v-model="params.page"
        :current-page.sync="params.page"
        :page-size.sync="params.pageSize"
        :page-sizes="pageSizes"
        :total="total"
        @loadData="getMemberListFun"
      />
    </main>
  </div>
</template>

<script>
import { queryAdjustList } from "@/api/markting/rePoint"
export default {
  data(){
    return {
      tableData:[
        {id:1}
      ],
      pageNum:1,
      pageSize:10,
      total:0
    }
  },
  methods:{
    getTableData(pageNum,pageSize){
      queryAdjustList({
        pageNum,
        pageSize
      }).then(({data})=>{
        this.tableData = data.list
        this.pageNum = data.pageNum
        this.pageSize = data.pageSize
        this.total = data.total
      })
    },
    handleSizeChange(val){
      this.getTableData(1,val)
    },
    handleCurrentChange(val){
      this.getTableData(val,this.pageSize)
    },
    stopSms(){

    },
    readSmsLog(){

    },
    newShortMessage(id,type){
      if(id&&type) this.$router.push({path:`/Privatemarketing/shortMessageTemplate?id=${id}&type=${type}`})
      else this.$router.push({path:'/Privatemarketing/shortMessageTemplate'})
    }
  }
}
</script>

<style lang="scss" scoped>
.smsGroupSends{
  margin: 20px;
  padding: 20px;
  background: #fff;
}
.textButton{
  color: #0079FE;
  cursor: pointer;
}
</style>
