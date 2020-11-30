<template>
  <div class="employ-content">
    <div class="search-wrap">
      <el-form label-position="right" label-width="80px">
        <el-row>
          <el-col :span="6">
            <el-form-item label="用户名">
              <el-input
                v-model="searchForm.userName"
                maxlength="50"
                clearable
                @keyup.enter.native="getData"
                placeholder="请输入用户名"
              />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="姓名">
              <el-input
                v-model="searchForm.name"
                maxlength="50"
                clearable
                placeholder="请输入姓名"
                @keyup.enter.native="getData"
              />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="手机号">
              <el-input
                v-model="searchForm.phone"
                maxlength="50"
                clearable
                placeholder="请输入手机号"
                @keyup.enter.native="getData"
              />
            </el-form-item>
          </el-col>
          <el-col :span="6" style="text-align:right;">
            <el-button type="primary" @click="getData(searchForm)">查询</el-button>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <main class="tableMainContent">
      <el-button type="primary" @click="toDetails">添加账号</el-button>
      <!-- <el-button type="primary" @click="handleAdd">导入员工</el-button>
      <el-button type="primary" @click="handleAdd">下载模版</el-button> -->
      <el-table
        v-loading="loading"
        stripe
        :data="list"
        :max-height="450"
        style="margin-top: 10px;"
      >
        <el-table-column label="序号" fixed="left">
          <template slot-scope="scope">
            <span>{{ (scope.$index+1) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="用户名" width="120" fixed="left" prop="userName">
          <template slot-scope="scope">{{ scope.row.userName }}</template>
        </el-table-column>
        <el-table-column label="姓名" width="100" fixed="left" prop="name">
          <template slot-scope="scope">{{ scope.row.name }}</template>
        </el-table-column>
        <el-table-column label="手机号" width="150" prop="phone">
          <template slot-scope="scope">{{ scope.row.phone }}</template>
        </el-table-column>
        <el-table-column label="邮箱" width="150" prop="email">
        </el-table-column> 
        <el-table-column label="性别" prop="sex">
          <template slot-scope="scope" >
            <span v-if="scope.row.sex == 1" > 男</span>
            <span v-if="scope.row.sex == 2" > 女</span>
            <span v-if="scope.row.sex == 3" > 保密</span>
          </template>
        </el-table-column> 
        <el-table-column label="创建人" width="120"  prop="creatorName">
        </el-table-column> 
        <el-table-column label="创建时间" width="150"  prop="createdTime">
        </el-table-column> 
        <el-table-column label="修改人" width="120"  prop="modifierName">
        </el-table-column> 
        <el-table-column label="修改时间" width="150"  prop="modifiedTime">
        </el-table-column> 
        <!-- <el-table-column label="职位" prop="position">
          <template slot-scope="scope">{{ scope.row.position }}</template>
        </el-table-column>
        <el-table-column label="状态" prop="status">
          <template slot-scope="scope">
            <span v-if="scope.row.onJob == 1" class="status-span status1">在职</span>
            <span v-else-if="scope.row.onJob == 0" class="status-span status2">离职</span>
          </template>
        </el-table-column> -->
        <el-table-column label="操作" width="220" fixed="right">
          <template slot-scope="scope">
            <el-button type="text" @click="handleClick(scope.row, 'modify')">编辑</el-button>
            <el-button type="text" class="deleteFontColor" @click="handleClick(scope.row, 'del')">删除</el-button>
            <el-button type="text" @click="handleClick(scope.row, 'permission')">设置权限</el-button>
            <el-button v-if="scope.row.locked" type="text" @click="cancelLock(scope.row.id)">解除锁定</el-button>
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
    
    <!-- <el-dialog
      title="删除账号验证"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      @close="dialogVisible = false"
      width="30%"
      class="namePhone"
    >
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm">
        <el-col :span="5">
          <el-form-item prop="value">
            <el-select
              v-model="ruleForm.value"
              placeholder="请选择验证人"
              @change="verifierChange($event)"
            >
              <template v-for="item in verifierName">
                <el-option
                  :key="item.id"
                  :label="item.validate_user_name"
                  :value="item.id"
                ></el-option>
              </template>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-input
            placeholder="请输入验证码"
            v-model="ruleForm.input"
            clearable
          ></el-input>

          <el-button
            class="page-button"
            @click="verification('ruleForm')"
            :disabled="tiemBoole"
            >{{ tiemBoole ? "发送验证码"+time : "发送验证码" }}</el-button
          >
           <el-button
            class="page-button"
            @click="timeFile"
            >确定删除</el-button
          >
        </el-col>
      </el-form>
    </el-dialog> -->
    <operationCheck 
      :requestType='operationCheckObj.requestType'
      v-if="operationCheckObj.dialogVisible"
      :dialogVisible.sync="operationCheckObj.dialogVisible"
      :btnText="operationCheckObj.btnText"
      :title="operationCheckObj.title"
      @submitCheckResult="submitDelete"
    />
  </div>
</template>
<script>
import showAddDialog from '@/components/showAddDialog/index.vue'
import operationCheck from '@/publicComponents/operationCheck/index.vue'
import { queryByPage, setRole, deleteEmploy, getEmployDetail ,querySensitiveOperationSet,queryVerifierName,sendDownloadCheckMsg ,checkVerificationCode} from '@/api/employ'
import { unlockAccount } from '@/api/permissions'
export default {
  name: 'Employeelist',
  components: { // 挂载组件
    'neo-add-dialog': showAddDialog,
    operationCheck:operationCheck
  },
  data() {
    return {
      operationCheckObj:{
        //  requestType:'t2',组件里面，查询删除验证人。
        requestType:'t2',
        dialogVisible:false,
        btnText:'确定删除',
        title:'删除账号验证',
        id:'',

      },
      ruleForm:{
        value:'',
        input:''
      },
      rules:{},
      validateList: [],
      validate_id: "",
      validate_user_mobile: "",
      tiemBoole: false,
      verifierName: [],
      dialogVisible: false,
      keyCode: "",
      list: [],
      loading: false,
      searchForm: {
        userName: '',
        name: '',
        phone: ''
      },
      roleArr: [],
      roleChange: false,
      params: {
        current: 1,
        page_size: 10
      },
      total: 0,
      itemData:{}
    }
  },
  created() {
    // this.checkDelete()
    // this.Verifier()
    this.getData({})
  },
  methods: {
    Verifier(row) {
      this.dataId = row.id;
      let params = {};
      queryVerifierName(params).then((res) => {
        if (res.code === "1") {
          this.verifierName = res.data.list;
        }
      });
    },
    checkDelete(item){
      querySensitiveOperationSet({}).then((res)=>{
        if(res.data.list.is_use_del_verification&&  res.data.list.is_use_del_verification =='Y'){
          this.itemData=item
          // this.operationCheckObj.id=item.id
          this.checkDeleteModel(item)
        }else{
          this.$confirm('是否删除该员工？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            closeOnClickModal: false,
            type: 'warning'
          }).then(() => {
            this.delete(item)
          }).catch(() => {})
        }
      })
    },
    getData(params) {
      this.loading = true
      const sdata = JSON.parse(JSON.stringify(this.searchForm))   
      queryByPage({
        pageNo: this.params.current,
        pageSize: this.params.page_size,
        params: sdata
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
        name: 'employeeListDetailsIndex',
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
      setRole({
        userId: this.userId,
        roleIds: data
      }).then(res => {
        if (res.code == 0) {
          this.$message({
            message: res.msg||'成功',
            type: 'success'
          })
        }
      })
    },
    role(val) {
      getEmployDetail({
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
          this.userId = item.id
          break
        case 'modify':
          this.toDetails(item)
          break
        case 'del':
          this.checkDelete(item)
          break
        default:
          break
      }
    },
    submitDelete(){ 
      if( this.itemData&& this.itemData.id){
        this.delete(this.itemData)
      } 
    },
    checkDeleteModel(row){
      this.operationCheckObj.dialogVisible=true;
      // this.operationCheckObj.dataId=row.id
      // this.dialogVisible=true
      // this.ruleForm.input=''
      // this.Verifier(row);
    },
        //验证手机号
    verifierChange(id) {
      //  this.validateList 选中的联系人信息。
      let validate_list = (this.validateList = this.verifierName.filter(
        (item) => {
          return item.id == id;
        }
      ));
       console.log('validate_list',validate_list)
      validate_list.map((item) => {
        this.validate_id = item.id;
        this.validate_user_mobile = item.validate_user_mobile;
        this.validate_user_name = item.validate_user_name;
      });
    },
    delete(item) {
      deleteEmploy({
        id: item.id
      }).then(res => {
        if (res.code == 0) {
          this.$message({
            message: res.msg || '删除成功',
            type: 'success'
          })
          this.getData()
        }
      })
    },
    cancelLock(id) {
     this.$confirm('确认解除锁定吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(()=>{
        unlockAccount({id}).then(res => {
          console.log(res,98989)
          this.$message({
            message:res.msg||'解锁成功',
            type: 'success'
          })
          this.getData({})
        })
      })
    },
       // 输入返回回来的验证码
   timeFile() {
      let params = {
        verificationCode: this.ruleForm.input,
        verificationKey: this.keyCode,
        id: this.validate_id,
      };
      checkVerificationCode(params)
        .then((res) => {
          if (res.code === "1") {
            this.dialogVisible = false;
            this.submitDelete()
          } else {
            this.dialogVisible = true;
            // this.$message.error("验证失败,请重新操作");
          }
        })
        .catch((err) => {
          this.$message.error(`${err}`);
        });
    },
    //点击发送验证码
    verification(formName) {
      this.time = 10;
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.setTime();
          const params = { validate_user_mobile: this.validate_user_mobile };
          sendDownloadCheckMsg(params).then((res) => {
            if (res.code === "1") {
              this.keyCode = res.data.key;
              this.fileType=true;
            } else if (res.code === "2") {
              this.$message.error(`${res.bizMsg}`);
            }
          });
        } 
      });
    },
    setTime(type) {
      if (type) {
        clearInterval(this.timer);
        this.tiemBoole = false;
      } else {
        this.timer = setInterval(() => {
          this.time--;
          if (this.time > 0 || this.time < 11) {
            this.tiemBoole = true;
          }
          if (this.time < 10) {
            this.time = "0" + this.time;
          }
          if (this.time < 1) {
            console.log(this.time,'this.time')
            this.tiemBoole = false;
            clearInterval(this.timer);
          }
        }, 1000);
      }
    },
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
  .namePhone {
    /deep/ .el-dialog__body {
      display: flex;
      flex-direction: column;
      align-items: center;
       .el-col {
        width: 80%;
         .el-input__inner {
          border: 0;
          border-bottom: 1px solid #eee;
          padding: 23px 0;
        }
         .el-select {
          width: 100% !important;
        }
        button {
          float: right;
          margin-top: 15px;
        }
        button:first-of-type{
            position: absolute;
            bottom: 39%;
            right: 31%;
        }
        button:last-of-type{
            width: 100%;
            background: #005BAA;
            color: #fff;
            border-radius: 23px;
            height: 44px;
            margin-top:27px;
        }
      }
    }
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
