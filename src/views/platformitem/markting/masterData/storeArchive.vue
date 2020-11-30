<template>
  <div class="page-container-gap">
    <div class="searchWrap">
      <el-form label-position="right" label-width="80px">
        <el-row :gutter="20">
          <el-col :span="6">
           <el-form-item label="平台">
              <el-select v-model="brand" style="width: 100%;" clearable placeholder="请选择">
                <el-option
                  v-for="(labelAttribute, index) in channelAttributes"
                  :key="index"
                  :label="labelAttribute.platform_name"
                  :value="labelAttribute.platform_name"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
           <el-form-item label="店铺名称">
              <el-autocomplete
                clearable
                v-model="storeName"
                :fetch-suggestions="fetchStoreName"
                @keyup.enter.native="filterData"    
                placeholder="请输入登录账号"
                :trigger-on-focus="false"
                @select="handleSelect"
              ></el-autocomplete>
            </el-form-item>
          </el-col>
          <el-col :span="6">
             <el-form-item label="店铺类型">
              <el-select v-model="label_attribute" style="width: 100%;" clearable placeholder="请选择">
                <el-option
                  v-for="(item, index) in labelAttributes"
                  :key="index"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col v-show="isMoreinquiries" :span="6">
            <el-form-item label="店铺主体">
              <el-autocomplete
                clearable
                v-model="storeTheme"
                :fetch-suggestions="filterSubject"
                @keyup.enter.native="filterData"    
                placeholder="请输入店铺主体"
                :trigger-on-focus="false"
                @select="handleSelect"
              ></el-autocomplete>
            </el-form-item>
          </el-col>
          <el-col :span="6" style="text-align:center; padding-bottom:10px;">
            <el-button type="primary" @click="filterData">查询</el-button>
            <el-button v-show="!isMoreinquiries" @click="searchMore">更多筛选</el-button>
             <el-button v-show="isMoreinquiries" type="primary" class="search-collapse" @click="searchMore">收起<i class="el-icon-d-arrow-right"/> </el-button>
          </el-col>
        </el-row>
      </el-form>
    </div>
   <main class="tableMainContent">
      <div style="display:flex;margin-bottom:10px;">
        <el-button type="primary" @click="getType" >新增</el-button>
        <el-button type="primary" @click="dowloadUrl">下载模板</el-button> 
        <el-upload
          :action="JumImport"
          :show-file-list="false"
          :on-error="uploadError"
          :on-success="uploadSuccess"
          :before-upload="beforeAvatarUpload"
          class="ensure ensureButt"
          name="file"
          style="margin-left:10px;"
        >
          <el-button type="primary">导入</el-button>
        </el-upload>
      </div>
      <el-table v-loading="loading" stripe :data="tableList" :max-height="500" >
         <el-table-column label="平台" prop="platform_name" />
        <el-table-column label="店铺名称" prop="store_name"  />
        <el-table-column label="店铺类型" prop="store_type"  />
        <el-table-column label="店铺主体" prop="store_owner" />
        <el-table-column label="OMS店铺编码" prop="oms_code"  />
        <el-table-column label="OMS是否接入" prop="access_to_oms" />
        <el-table-column label="操作" >
          <template slot-scope="scope">
            <el-button type="text" @click="handler(scope.row,'查看')">查看</el-button>
            <el-button type="text" @click="handler(scope.row,'编辑')">编辑</el-button>
            <el-button type="text" class="deleteFontColor" @click="deletaFiles(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <base-pagination
        class="bottomPagination"
        v-model="params.current"
        :page-size.sync="params.page_size"
        :total="total"
        @loadData="getList"
      /> -->
    </main>
     <el-dialog :show-close="false" :visible.sync="dialogVisible" width="30%">
      <span>是否删除此店铺信息</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="deletaComfie()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import {
  queryAllStore,
  delIntegration,
  delStore,
  queryPlatformName,
  storeQuerySto
} from "@/api/markting/security/visit";
// JumImport
import {storeImportant} from '@/config/getUrl.js'
export default {
  data() {
    return {
      params: {
        page_size: 10,
        current: 1,
      },
      total: 10,
      pageSizes: [10, 20, 30, 40],
      loading: false,
      brand: "",
      storeName: "",
      label_attribute: "",
      storeTheme: "",
      tableList: [],
      labelAttributes: [
        { label: "品牌", value: "品牌" },
        { label: "非品牌", value: "非品牌" },
      ],
      channelAttributes: [],
      dialogLeadingIn: false,
      deletaId: "",
      dialogVisible: false,
      arr: [],
      storeNameVisible: false,
      storeThemeVisible: false,
      dialogImageUrl: "",
      dialogVisible: false,
      disabled: false,
      isMoreinquiries: false,
      storeDisappear: false,
      disappear: false,
      jumpShops:
        "https://auth-setting.oss-cn-shanghai.aliyuncs.com/val/bcddb0bd92e049b78bb7470ed5e8dd21.xlsx",
      JumImport:storeImportant.fileUrl,
      arrSubject: [],
      rowFail:'',
      isMoreinquiries:false,
    };
  },
  mounted() {
    this.getList();
    this.platform(); //平台
  },
  methods: {
    searchMore() {
      this.isMoreinquiries = !this.isMoreinquiries
      // 动态计算表格高度
      setTimeout(() => {
        this.getHeight()
      })
    },
     getHeight() {
      const appHeight = document.getElementsByClassName('page-container-gap')[0].offsetHeight
      const otherHeight = document.getElementsByClassName('search-wrap')[0].offsetHeight + 110
      this.tableHeight = appHeight - otherHeight
    },
    getList() {
      let params = {
        pageSize: this.params.page_size,
        pageNum: this.params.current,
      };
      if (this.brand) {
        params.platform_name = this.brand;
      }
      if (this.storeName) {
        params.store_name = this.storeName;
      }
      if (this.label_attribute) {
        params.store_type = this.label_attribute;
      }
      if (this.storeTheme) {
        params.store_owner = this.storeTheme;
      }
      queryAllStore(params).then((res) => {
        if(res.code=='1'){
               this.loading = false;
        this.tableList = res.data.list;
        this.params.current = res.data.pagination.current || 1;
        this.params.page_size = res.data.pagination.page_size;
        this.total = res.data.pagination.total || 0;
        } 
    
      });
    },
    async queryBoxVocabularyFun(queryString, queryType) {
      let param = {};
      if (queryType == "store_name") {
        param[queryType] = queryString;
      } else if (queryType == "store_owner") {
        param[queryType] = queryString;
      }
      console.log(param, "param");
      let data = await storeQuerySto(param);
      if (queryType == "store_name") {
        let storeName = [];
        if (data.data && data.data.length > 0) {
          data.data.forEach((item) => {
            storeName.push({ value: item.store_name });
          });
        }
        return storeName;
      } else if (queryType == "store_owner") {
        let storeOwner = [];
        if (data.data && data.data.length > 0) {
          data.data.forEach((item) => {
            storeOwner.push({ value: item.login_ip });
          });
        }
        return storeOwner;
      }
    },
    createFilter(queryString) {
      return (restaurant) => {
        console.log("sssss", queryString);
        return (
          restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) ===
          0
        );
      };
    },
    //店铺名称
    fetchStoreName(queryString, cb) {
      // 当输入文件名时候，调用接口，await返回 数据，
      this.queryBoxVocabularyFun(queryString, "store_name").then((res) => {
        let storeName = res || [];
        var results = queryString
          ? storeName.filter(this.createFilter(queryString))
          : storeName;
        cb(results);
      });
    },
    //店铺主体
    filterSubject(queryString, cb) {
      // 当输入导入人调用接口，await返回 数据，
      this.queryBoxVocabularyFun(queryString, "store_owner").then((res) => {
        let storeOwner = res || [];
        var resultsImportUserList = queryString
          ? storeOwner.filter(this.createFilter(queryString))
          : storeOwner;
        cb(resultsImportUserList);
      });
    },
    handleSelect(item) {
      console.log(item);
    },
    //新增
    getType() {
      this.$router.push({
        name: "addStore",
      });
    },
    //导入失败
    uploadError(e, file, fileList) {
      this.$message.error("上传失败，请重试");
    },
    //导入成功
    uploadSuccess(response, file, fileList) {
      if (response.code == "0") {
        if (response.data.url !== undefined) {
          this.$confirm("未导入成功，原因请下载文件查看详情", "提示", {
            confirmButtonText: "下载",
            ancelButtonText: "取消",
            type: "",
          })
            .then(() => {
              window.location.href = response.data.url;
            })
            .catch(() => {});
        } else {
          this.$message.error(response.data.message);
        }
      }
      if (response.code == "1") {
        if (response.data.url !== undefined) {
          this.$confirm(
            "成功导入了" +
              response.data.success_count +
              "/" +
              response.data.total +
              "个账户，未导入成功的部分请下载文件查看详情",
            "提示",
            {
              confirmButtonText: "下载",
              ancelButtonText: "取消",
              type: "",
            }
          )
            .then(() => {
              window.location.href = response.data.url;
            })
            .catch(() => {});
        } else {
          if(response.data.row.length==0){
             this.$message({
            message: "成功导入了" + response.data.success_count + "条失败"+response.data.fail_count+'条',
            type: "success",
          })
          }else if(response.data.row.length >=1){
          this.$message({
            message: "成功导入了" + response.data.success_count + "条"+response.data.row[0].message+'失败'+response.data.fail_count+'条',
            type: "success",
          });
          }else{
            this.$message.error(response.data.row.message)
          }
       
        }
      }
    },

    // 导入前对文件的大小的判断
    beforeAvatarUpload(file) {
      const extension = file.name.split(".")[1] === "xls";
      const extension2 = file.name.split(".")[1] === "xlsx";
      const isLt2M = file.size / 1024 / 1024 < 10;
      if (!extension && !extension2) {
        this.$message.error("上传模板只能是 xls、xlsx");
      }
      if (!isLt2M) {
        this.$message.error("上传模板大小不能超过 10MB!");
      }
      return extension || (extension2 && isLt2M);
    },
    //下载文件
    dowloadUrl() {
      this.$confirm("确认下载模板 ?", "提示", {
        confirmButtonText: "下载",
        ancelButtonText: "取消",
        type: "",
      })
        .then(() => {
          window.location.href = this.jumpShops;
        })
        .catch(() => {});
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    // cessf
    getInfo(type){
      if(type==='storeName'){
        this.storeName = ''
        let str = localStorage.getItem("storeName");
        let arr = str ? JSON.parse(str) : [];
        this.arr = arr;
      }else{
        this.storeTheme = ''
        let str = localStorage.getItem("storeTheme");
        let arr = str ? JSON.parse(str) : [];
        this.arrSubject = arr;
      }
    },
    // //模糊查询
    // fetchStoreName(query) {
    //   this.storeName = query;
    //   let str = localStorage.getItem("storeName", this.storeName);
    //   let arr = str ? JSON.parse(str) : [];
    //   if (arr.length) {
    //     let arrs = [];
    //     arr.forEach((item) => {
    //       if (item.includes(this.storeName)) {
    //         arrs.unshift(item);
    //       }
    //     });
    //     this.arr = arrs;
    //   }
    // },
    // filterSubject(query) {
    //   this.storeTheme = query;
    //   let str = localStorage.getItem("storeTheme");
    //   let arr = str ? JSON.parse(str) : [];
    //   if (arr.length) {
    //     let arrs = [];
    //     arr.forEach((item) => {
    //       if (item.includes([this.storeTheme])) {
    //         arrs.unshift(item);
    //       }
    //     });
    //     this.arrSubject = arrs;
    //   }
    // },
    // 查询
    filterData() {
      this.params.current = 1;
      this.getList();
      this.setStorage("storeName");
      this.setStorage("storeTheme");
    },
    //保存存储
    // setStorage(type) {
    //   let str = localStorage.getItem(type);
    //   let arr = str ? JSON.parse(str) : [];
    //   let currentIndex = arr.findIndex((item) => item === this[type]);
    //   if (currentIndex === -1 && this[type]) {
    //     if (arr.length >= 5) {
    //       arr.pop();
    //     }
    //     arr.unshift(this[type]);
    //     localStorage.setItem(type, JSON.stringify(arr));
    //   }
    // },
    //编辑
    handler(row, type) {
      this.$router.push({
        name: "addStore",
        query: {
          id: row.id,
          type: type,
        },
      });
    },
    //删除
    deletaFiles(row) {
      this.dialogVisible = true;
      this.deletaId = row.id;
    },
    //删除弹窗确认按钮
    deletaComfie() {
      let params = {
        id: this.deletaId,
      };
      delStore(params)
        .then((res) => {
          if (res.code == 1) {
            this.dialogVisible = false;
            this.deletOpen();
            this.getList();
          }
        })
        .catch((error) => {
          this.deletFailOpen();
        });
    },
    //平台
    platform() {
      let params = {};
      queryPlatformName(params)
        .then((res) => {
          if (res.code=='1') {
             this.channelAttributes = res.data.list;
          }
        })
        .catch((error) => {
          this.deletFailOpen();
        });
    },
    deletOpen() {
      this.$message({
        message: "删除成功",
        type: "success",
      });
    },
    deletFailOpen() {
      this.$message.error({
        message: "删除失败,请重新操作",
        type: "success",
      });
    },
  },
};
</script>
<style lang="less" scoped>
/deep/ .el-autocomplete,
/deep/ .el-date-editor--date {
  width: 100%;
}
// .el-dialog__wrapper:first-of-type {
//   /deep/ .el-dialog__body {
//     div {
//       display: flex;
//       justify-content: center;
//     }
//     div:first-of-type {
//       > .el-select {
//         .el-input {
//           width: 100%;
//           input {
//             border: 0;
//             border-bottom: 1px solid #000;
//           }
//         }
//       }
//     }
//     div:last-of-type {
//       position: relative;
//       .page-button {
//         position: absolute;
//         right: 4px;
//         top: 8px;
//         border-radius: 4px;
//       }
//       > .el-input {
//         width: 44%;
//         input {
//           border: 0;
//           border-bottom: 1px solid #000;
//         }
//       }
//     }
//   }
// }
// .page-container-gap {
//   height: 100%;
//   /deep/ .el-select {
//     width:100% !important;
//   }
//   .ensureButt {
//     display: inline-block;
//   }

// }
// main {
//   padding: 15px;
//   margin-top: 10px;
//   background: white;
// }
// .label-tip {
//   border: 1px solid #e4e7ed;
//   padding-left: 20px 0 90px 30px;
// }
// .label-item-tip {
//   line-height: 30px;
// }
// .marketing-list-page-name-wrapper {
//   overflow: hidden;
//   text-overflow: ellipsis;
//   white-space: nowrap;
//   max-height: 50px;
// }
// .dialog-title {
//   position: absolute;
//   left: 0;
//   top: 8px;
//   width: 100%;
//   .dialog-nav {
//     display: flex;
//     justify-content: space-around;
//     align-items: center;
//   }
// }
// ul {
//   width: 100%;
//   position: absolute;
//   padding: 5px;
//   background: #fff;
//   z-index: 999;
//   li {
//     width: 100%;
//   }
// }
// .LeadingIn {
//   > span:nth-of-type(2) {
//     color: #55a5ff;
//     > em {
//       font-style: normal;
//       color: #797b7f;
//       margin-left: 5px;
//     }
//   }
// }
</style>




 