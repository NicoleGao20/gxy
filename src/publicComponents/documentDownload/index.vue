 <template>
  <el-dialog
    :title="exporTresultType"
    :visible.sync="resultSetDialog"
    width="50%"
    class="wrap_export"
  >
    <ol class="export_file">
      <li>
        <i class="el-icon-circle-check"></i>
      </li>
      <li>
        {{exporTresultType}}已提交,请到
        <span @click="platform">管理平台-下载中心</span>
        下载!
      </li>
      <li>如果不需要使用系统生成的文件名,您可以自定义文件名称:</li>
      <li>
        <el-input v-model="file_name" @change="fileChange"></el-input>
      </li>
    </ol>

    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="提交">发送</el-button>
      <el-button @click="resultSetDialog = false">关闭</el-button>
    </span>
  </el-dialog>
</template>
<script>
import { editFileName } from "@/api/markting/security/visit";
export default {
  data() {
    return {
      file_name: "",
    };
  },
  props: ["exporTresultType", "resultSetDialog"],
  mounted() {
    console.log(this.props,'props')
  },
  methods: {
    fileChange() {
      this.$emit(this.file_name);
    },
    exportrEsult() {
      let params = {
        // fileID:this.fileID,
        fileId: "26",
        fileName: this.file_name,
      };
      //修改文件名
      editFileName(params).then((res) => {
        if (res.code === "1") {
          this.open();
        } else if (res.code === "2") {
          this.$message.error(`${res.bizMsg}`);
        }
      });
    },
    //点击管理中心下载
    platform(){
       this.$router.push({
          name: "dataDownload",
          // query: {
          //   id: row.id,
          //   create_type: row.create_type
          // }
        })
    },
    open() {
      this.$message({
        message: "操作成功",
        type: "success",
      });
    },
  },
 
};
</script>
<style lang="scss">
.wrap_export {
  .export_file {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    li:first-of-type {
      display: flex;
      justify-content: center;
      i {
        font-size: 50px;
        color: #435a82;
      }
    }
    li:nth-of-type(2) {
      margin: 20px 0;
      font-size: 16px;
      font-weight: 800;
      span {
        color: #435a82;
      }
    }
    li:nth-of-type(3) {
      margin-bottom: 20px;
    }
    li:last-of-type {
      width: 50%;
      /deep/ .el-input {
        input {
          outline: none; // 去除选中状态边框
          background-color: rgba(0, 0, 0, 0); // 透明背景
        }
      }
    }
  }
}
</style>
