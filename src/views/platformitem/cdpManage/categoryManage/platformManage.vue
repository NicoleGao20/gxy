<template>
  <div class="employ-content">
    <div class="search-wrap">
      <el-form label-position="right" label-width="80px">
        <el-row>
          <el-col :span="6">
            <el-form-item label="平台名称">
              <el-input
                v-model="searchForm.platformName"
                maxlength="50"
                clearable
                placeholder="请输入姓名"
                @keyup.enter.native="getData"
              />
            </el-form-item>
          </el-col>
          <!-- <el-col :span="6">
            <el-form-item label="联系方式">
              <el-input
                v-model="searchForm.phone"
                maxlength="50"
                clearable
                placeholder="请输入联系方式"
              />
            </el-form-item>
          </el-col> -->
          <el-col :span="6" style="text-align:right;">
            <el-button type="primary" @click="getData(searchForm)">查询</el-button>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <main class="tableMainContent">
      <!-- <el-button type="primary" @click="toDetails">添加平台</el-button> -->
      <el-table
        v-loading="loading"
        stripe
        :data="list"
        :max-height="450"
        style="margin-top: 10px;"
      >
        <el-table-column label="序号">
          <template slot-scope="scope">
            <span>{{ (scope.$index+1) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="平台iCon" prop="empNo">
          <template  slot-scope="scope">
            <el-popover
              placement="top-start"
              width="200"
              trigger="hover"
            >
              <img
                :src="scope.row.uri==undefined?'':scope.row.uri"
                :onerror="default_img"
                style="max-height:500px"
              >
              <img
                slot="reference"
                :src="scope.row.uri==undefined?'':scope.row.uri"
                :onerror="default_img"
                class="table-cell-img"
              >
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column label="平台名称" prop="platformName">
          <template slot-scope="scope">{{ scope.row.platformName }}</template>
        </el-table-column>
        <el-table-column label="平台链接" prop="platformLink">
        </el-table-column>
        <el-table-column label="平台描述" prop="description">
        </el-table-column>
        <el-table-column label="操作" width="220" fixed="right">
          <template slot-scope="scope">
            <!-- <el-button type="text" @click="handleClick(scope.row, 'modify')">编辑</el-button>
            <el-button type="text" class="deleteFontColor" @click="handleClick(scope.row, 'del')">删除</el-button> -->
            <el-button type="text" @click="handleClick(scope.row, 'permission')">设置权限</el-button>
          </template>
        </el-table-column>
      </el-table>
      <base-pagination
        class="bottomPagination"
        v-model="params.current"
        :page-size.sync="params.page_size"
        :total="total"
        @loadData="getData"
      />
    </main>
    <neo-add-dialog
      :show-type="13"
      :dialog-type="1"
      :source="roleArr"
      :dialog-show.sync="roleChange"
      @save="saveIsSelectChoice"
    />
  </div>
</template>
<script>
import {apiObj} from '@/config/getUrl.js'
import showAddDialog from '@/components/showAddDialog/index.vue'
import { queryByPage, setPlatforms, deletePlatform, getPlatformsDetail } from '@/api/platform'
export default {
  name: 'Employeelist',
  components: { // 挂载组件
    'neo-add-dialog': showAddDialog
  },
  data() {
    return {
      default_img: 'this.src="' + apiObj.defult_404_avata + '"',
      list: [],
      platformId:'',
      loading: false,
      searchForm: {
        platformName: '',
        platformCode:''
      },
      roleArr: [],
      roleChange: false,
      params: {
        current: 1,
        page_size: 10
      },
      total: 0
    }
  },
  computed: {
    brandCode () {
      return this.$store.state.Menu.brandCode　　//需要监听的数据
    }
  },
  watch: {
    brandCode (newVal, oldVal) {
      this.getData()
    }
  },
  created() {
    this.getData()
  },
  methods: {
    getData() {
      this.loading = true
      const curParams = this.searchForm
      queryByPage({
        pageNo: this.params.current,
        pageSize: this.params.page_size,
        params: curParams
      }).then(res => {
        this.loading = false
        this.total = parseInt(res.body.total)
        this.list = res.body.records
      }).catch(() => {
        this.loading = false
      })
    },
    toDetails(info) {
      this.$router.push({
        name: 'platformManageDetailsIndex',
        query: {
          id: info && info.id || ''
        }
      })
    },
    // 选择角色
    saveIsSelectChoice(products) {
      const data = []
      products.forEach(element => {
        data.push(element.id)
      })
      setPlatforms({
        platformId: this.platformId,
        roleIds: data
      }).then(res => {
        if (res.code == 0) {
          this.$message({
            message: '成功',
            type: 'success'
          })
        }
      })
    },
    role(val) {
      getPlatformsDetail({
        id: val
      }).then((res) => {
        this.roleChange = true
        if (res.body.hasOwnProperty('roles')) {
          this.roleArr = res.body.roles
        }
      })
    },
    handleClick(item, type) {
      switch (type) {
        case 'permission':
          this.role(item.id)
          this.platformId = item.id
          break
        case 'modify':
          this.toDetails(item)
          break
        case 'del':
          this.$confirm('是否删除该平台？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            closeOnClickModal: false,
            type: 'warning'
          }).then(() => {
            this.delete(item)
          }).catch(() => {})
          break
        default:
          break
      }
    },
    delete(item) {
      deletePlatform({
        id: item.id
      }).then(res => {
        if (res.code == 0) {
          this.$message({
            message: res.msg,
            type: 'success'
          })
          this.getData({})
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
  .search-wrap{
    background: white;
    padding: 15px 15px 0;
  }
  main {
    margin-top: 10px;
    padding: 15px;
    background: white;
  }
  // status
  .status-span {
    display: inline-block;
    padding: 0 10px;
    height: 20px;
    line-height: 20px;
    text-align: center;
    font-size: 13px;
    border-radius: 4px;
    &.status0 {
      color: getColor(primary);
      border: 1px solid getColor(primary);
      background-color: rgba(255, 125, 0, 0.15);
    }
    &.status1 {
      color: getColor(success);
      border: 1px solid getColor(success);
      background-color: rgba(0, 178, 169, 0.15);
    }
    &.status2 {
      color: getColor(text-regular);
      border: 1px solid getColor(text-regular);
      background-color: rgba(144, 147, 153, 0.15);
    }
    &.danger {
      color: getColor(danger);
      border: 1px solid getColor(danger);
      background-color: rgba(217, 15, 6, 0.15);
    }
  }
</style>
