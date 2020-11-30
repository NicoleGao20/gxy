<template>
  <div class="security-center">
    <div class="security-information">
      <div class="security-flag">
        <span>启动限制IP地址访问</span>
        <el-switch
          v-model="value"
          active-color="#13ce66"
          inactive-color="#DCDFE6"
          @change="ValueRadio"
        ></el-switch>
        <span>启动后只有添加的可访问IP才可以登录数据营销平台</span>
      </div>

      <el-button type="primary" @click="adjunction('form')">+添加可访问IP</el-button>
      <el-table :data="list"  border style="width: 100%">
        <el-table-column prop="ip_address" label="IP地址"></el-table-column>
        <el-table-column prop="remark" label="描述" style="text-align:center"></el-table-column>
        <el-table-column label="操作" width="160" fixed="right">
          <template slot-scope="scope">
            <el-button type="text" class="deleteFontColor" @click="handler(scope.row, 'view')">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- <auto-table :rows="list" max-height="600px" /> -->
      <div style="text-align: right;padding: 10px 0;">
        <el-pagination
          :current-page.sync="params.currentPage"
          :page-size.sync="params.pageSize"
          :page-sizes="pageSizes"
          :total="total"
          layout="total,sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>

    <el-dialog title="添加可访问IP" :visible.sync="dialogFormVisible" :show-close="false">
      <el-form :model="form" ref="form">
        <el-form-item label="IP地址" :label-width="formLabelWidth" prop="IP" :rules="[
      { required: true, message: '请输入IP地址'},
      { pattern: /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/, message: '请输入正确的IP地址' }
    ]">
          <el-input type="text" v-model="form.IP" autocomplete="off" height="200"></el-input>
        </el-form-item>
        <el-form-item label="描述" :label-width="formLabelWidth">
          <el-input type="textarea" v-model="form.region"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirm('form')">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="删除IP地址" :visible.sync="dialogVisible" width="30%" :show-close="false">
      <span>确定删除{{address.ip_address}}的IP地址吗?</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="ipAddress">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
  <script>
import {
  modifyAccessibleIP, //添加
  queryAccessibleIP, //查询
  editAccessControlSet, //开关
  deleteTemplate, //删除
  queryAccessControlSet
} from "@/api/security/visit";
export default {
  data() {
    return {
      value: true,
      params: {
        pageSize: 10,
        currentPage: 1,
      },
      total: 100,
      key: "",
      pageSizes: [10, 20, 30, 40],
      brandCode: "",
      loading: false,
      dialogFormVisible: false,
      loading: false,
      dialogVisible: false,
      is_use_whitelist: "Y", //开关
      list: [],
      address:{
        ip_address: "", //ip地址
        IPid: 0,
      },
     
      searchForm: {
        table_name_show: "",
        tableName: "",
      },
      form: {
        IP: "",
        region: "",
      },
      formLabelWidth: "80px",
    };
  },
  methods: {
    switch(){
      let params={}
      queryAccessControlSet(params).then((res)=>{
        if(res.code==='1'){
          if(res.data.is_use_whitelist=='Y'){
            this.value=true
          }else{
             this.value=false
          }
        }
      })
    },
    //删除
    handler(row, type) {
      this.dialogVisible = true;
      this.address.ip_address = row.ip_address;
      this.address.IPid = row.id;
    },
    ipAddress() {
      this.dialogVisible = false;
      let params = {
        id: this.address.IPid,
      };
      deleteTemplate(params)
        .then((res) => {
          this.loading = false;
          if (res.code == "1") {
            this.open('删除成功');
            this.getData();
          }
        })
        .catch((fail) => {
          this.loading = false;
        });
    },
    //添加ip按钮
    adjunction(form) {
      this.dialogFormVisible = true;
      this.form.IP = "";
      this.form.region = "";
      if (this.$refs[form]!==undefined) {
          this.$refs[form].resetFields();
      }
    },
    //点击弹框确认按钮
    confirm(from) {
        this.$refs.form.validate((valid) => {
        if (valid) {
        let params = {
          ip_address: this.form.IP,
          remark: this.form.region,
        };
        modifyAccessibleIP(params)
          .then((res) => {
            this.loading = false;
           if(res.code === "1"){
              this.dialogFormVisible = false;
              this.open('添加成功');
              this.getData();
            }else if(res.code === "2"){
              this.dialogFormVisible=true
            }
          })
          .catch((fail) => {
            this.loading = false;
          });
        } else {
          return false;
        }
      });

    },
    //开关
    ValueRadio() {
      if (this.value == true) {
        this.is_use_whitelist = "Y";
      } else if (this.value == false) {
        this.is_use_whitelist = "N";
      }
      let params = {
        is_use_whitelist: this.is_use_whitelist,
      };
      editAccessControlSet(params)
        .then((res) => {
          this.loading = false;
        })
        .catch((fail) => {
          this.loading = false;
        });
    },
    // 回车键搜索内容
    onsearch() {
      this.getData();
    },
    // 每页条数切换
    handleSizeChange(val, bv) {
      this.params.currentPage = 1
      this.params.pageSize = val
      this.getData();
    },
    // 页码切换
    handleCurrentChange(val) {
      this.params.currentPage = val
      this.getData();
    },
    // 数据请求
    getData() {
      if (this.key) {
        this.params.pageNum = this.key;
      }
      const obj = {
        pageNum: this.params.currentPage, //当前页数
        pageSize: this.params.pageSize, //一页显示多少条
      };
      if (this.brandCode) {
        obj.brand_code = this.brandCode;
      }
      if (this.searchForm.tableName) {
        obj.table_name = this.searchForm.tableName;
      }
      if (this.searchForm.table_name_show) {
        obj.table_name_show = this.searchForm.table_name_show;
      }
      queryAccessibleIP(obj).then((res) => {
        this.list = res.data.list;
        this.total = res.data.totalRecord;
      });
    },
     open(type) {
        this.$message({
          message: (`${type}`),
          type: 'success'
        });
    },
  },
  mounted() {
    //查询可访问IP
    this.getData();
    document.onkeydown = (e) => {
      if (e.key !== "Enter") {
        this.key = e.key;
      }
    };
    this.switch()
  },
};
</script>
<style lang="less" scoped>
.security-center {
  height: 100%;
  overflow-y: scroll;
  padding-top: 25px;
  background: #fff;
  padding-left: 30px;
  .security-information {
    display: flex;
    flex-direction: column;
    .security-flag {
      font-size: 13px;
      margin-bottom: 20px;
      color: #606266;
    }
    /deep/ .el-button--small {
      margin-bottom: 20px;
    }
  }
}
/deep/ .el-table .cell {
  text-align: center;
}
/deep/ .el-input__inner {
  height: 35px;
  line-height: 35px;
  border-radius: 4px;
}
/deep/ .el-textarea__inner {
  height: 100px;
  border-radius: 4px;
}
/deep/ .security-header li:last-of-type button {
  background: 0;
  border: 0;
  color: #c6c6c6;
  border-bottom: 4px solid #c6c6c6;
}
</style>