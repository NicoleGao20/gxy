<template>
  <!-- 条码表 -->
  <div class="page-container-gap">
    <div class="searchWrap">
      <el-form label-position="right" label-width="80px">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="产品名称">
              <el-input
                v-model="product_name_cn"
                placeholder="请输入内容"
                clearable
                @keyup.enter.native="filterData"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6" style="text-align: center">
            <el-button class="search-common" type="primary" @click="filterData"
              >查询</el-button
            >
          </el-col>
        </el-row>
      </el-form>
    </div>
    <main class="tableMainContent">
      <el-col :span="8" style="padding-bottom: 10px; width: 100%">
        <el-button type="primary" @click="handler('条码表')">新增</el-button>
        <el-upload
          :action="JumImport"
          :show-file-list="false"
          :on-error="uploadError"
          :on-success="uploadSuccess"
          class="ensure ensureButt"
          name="file"
        >
          <el-button type="primary">导入</el-button>
        </el-upload>
      </el-col>
      <el-table
        v-loading="loading"
        stripe
        :data="tableList"
        max-height="550"
        border
      >
        <el-table-column label="商品条码" prop="combination_code" />
        <el-table-column label="产品名称" prop="product_name_cn" />
        <el-table-column label="产品规格" prop="specification" />
        <el-table-column label="保质期" prop="validity" />
        <el-table-column label="标零价" prop="purchase_price" />
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="text" @click="handler('条码表', scope.row)"
              >编辑</el-button
            >
            <el-button
              type="text"
              class="deleteFontColor"
              @click="deletaFiles(scope.row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <base-pagination
        class="bottomPagination"
        v-model="params.current"
        :page-size.sync="params.page_size"
        :total="total"
        @loadData="getList"
      />
    </main>
    <el-dialog :show-close="false" :visible.sync="dialogVisible" width="30%">
      <span>是否删除此条数据</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="deletaComfie()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { delIntegration, queryPlatformName } from "@/api/security/visit";
import {
  getBarCodeTableList,
  delBarCodeTableList,
} from "@/api/markting/security/visit";
// JumImport
import { storeImportant } from "@/config/getUrl.js";
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
      product_name_cn: "", //产品名称
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
      storeDisappear: false,
      disappear: false,
      jumpShops:
        "https://auth-setting.oss-cn-shanghai.aliyuncs.com/val/bcddb0bd92e049b78bb7470ed5e8dd21.xlsx",
      JumImport: storeImportant.fileUrl,
      arrSubject: [],
      rowFail: "",
    };
  },
  mounted() {
    this.getList();
    this.platform(); // 平台
    this.product_name_cn = "";
  },
  methods: {
    getList() {
      const params = {
        pageSize: this.params.page_size,
        pageNum: this.params.current,
      };
      //产品名称
      if (this.product_name_cn) {
        params.fuzzy_type = {
          product_name_cn: this.product_name_cn,
        };
      }
      getBarCodeTableList(params).then((res) => {
        if (res.code == "1") {
          this.loading = false;
          this.tableList = res.data.list;
          this.params.current = res.data.pagination.current || 1;
          this.params.page_size = res.data.pagination.page_size;
          this.total = res.data.pagination.total || 0;
        }
      });
    },

    // 导入失败
    uploadError(e, file, fileList) {
      this.$message.error("上传失败，请重试");
    },
    // 导入成功
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
          if (response.data.row.length == 0) {
            this.$message({
              message:
                "成功导入了" +
                response.data.success_count +
                "条失败" +
                response.data.fail_count +
                "条",
              type: "success",
            });
          } else if (response.data.row.length >= 1) {
            this.$message({
              message:
                "成功导入了" +
                response.data.success_count +
                "条" +
                response.data.row[0].message +
                "失败" +
                response.data.fail_count +
                "条",
              type: "success",
            });
          } else {
            this.$message.error(response.data.row.message);
          }
        }
      }
    },

    getInfo(type) {
      if (type === "storeName") {
        this.storeName = "";
        const str = localStorage.getItem("storeName");
        const arr = str ? JSON.parse(str) : [];
        this.arr = arr;
      } else {
        this.storeTheme = "";
        const str = localStorage.getItem("storeTheme");
        const arr = str ? JSON.parse(str) : [];
        this.arrSubject = arr;
      }
    },

    // 查询
    filterData() {
      this.params.current = 1;
      this.getList();
      this.setStorage("storeName");
      this.setStorage("storeTheme");
    },
    // 保存存储
    setStorage(type) {
      const str = localStorage.getItem(type);
      const arr = str ? JSON.parse(str) : [];
      const currentIndex = arr.findIndex((item) => item === this[type]);
      if (currentIndex === -1 && this[type]) {
        if (arr.length >= 5) {
          arr.shift();
        }
        arr.push(this[type]);
        localStorage.setItem(type, JSON.stringify(arr));
      }
    },
    // 编辑
    handler(type, row) {
      this.$router.push({
        name: "commodityTableCodeEdit",
        query: {
          type: type,
          id: row ? row.id : "",
          combination_code: row ? row.combination_code : "",
          product_code: row ? row.product_code : "",
        },
      });
    },
    // 删除
    deletaFiles(row) {
      this.dialogVisible = true;
      this.deletaId = row.id;
    },
    // 删除弹窗确认按钮
    deletaComfie() {
      const params = {
        id: this.deletaId,
      };
      delBarCodeTableList(params)
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
    // 平台
    platform() {
      const params = {};
      queryPlatformName(params)
        .then((res) => {
          if (res.code == "1") {
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
.el-dialog__wrapper:first-of-type {
  /deep/ .el-dialog__body {
    div {
      display: flex;
      justify-content: center;
    }
    div:first-of-type {
      > .el-select {
        .el-input {
          width: 100%;
          input {
            border: 0;
            border-bottom: 1px solid #000;
          }
        }
      }
    }
    div:last-of-type {
      position: relative;
      .page-button {
        position: absolute;
        right: 4px;
        top: 8px;
        border-radius: 4px;
      }
      > .el-input {
        width: 44%;
        input {
          border: 0;
          border-bottom: 1px solid #000;
        }
      }
    }
  }
}
.page-container-gap {
  height: 100%;
  /deep/ .el-date-editor--daterange,
  /deep/ .el-input,
  /deep/ .el-select {
    width: 90% !important;
  }
  .ensureButt {
    display: inline-block;
  }
}
main {
  padding: 15px;
  margin-top: 10px;
  background: white;
}
.label-tip {
  border: 1px solid #e4e7ed;
  padding-left: 20px 0 90px 30px;
}
.label-item-tip {
  line-height: 30px;
}
.marketing-list-page-name-wrapper {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-height: 50px;
}
.dialog-title {
  position: absolute;
  left: 0;
  top: 8px;
  width: 100%;
  .dialog-nav {
    display: flex;
    justify-content: space-around;
    align-items: center;
  }
}
ul {
  width: 100%;
  position: absolute;
  padding: 5px;
  background: #fff;
  z-index: 999;
  li {
    width: 100%;
  }
}
.LeadingIn {
  > span:nth-of-type(2) {
    color: #55a5ff;
    > em {
      font-style: normal;
      color: #797b7f;
      margin-left: 5px;
    }
  }
}
</style>

