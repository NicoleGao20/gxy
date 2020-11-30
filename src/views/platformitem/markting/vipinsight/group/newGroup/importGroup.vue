/* eslint-disable handle-callback-err */
<template>
  <div class="page-container-gap">
    <section>
      <header>
        <el-form ref="form" :model="searchForm" :rules="rules" size="medium" label-position="right" label-width="80px">
          <div class="label-title">
            <i class="linev-tip" /><span class="label-desc">基本信息</span>
            <span class="info_tip">* 为必填</span>
          </div>
          <el-row :gutter="20">
            <el-col :span="8">
              <!-- 受众名称--导入 -->
              <el-form-item label="受众名称" prop="group_name">
                <el-input
                  :disabled="readOnly"
                  v-model.trim="searchForm.group_name"
                  maxlength="50"
                  clearable
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="创建方式">
                <el-select
                  v-model="searchForm.create_type"
                  style="width: 100%"
                  clearable
                  placeholder="请选择"
                  disabled
                >
                  <el-option
                    v-for="(labelType, index) in create_type_list"
                    :key="index"
                    :label="labelType.label"
                    :value="labelType.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="受众目的" prop="group_purpose">
                <el-select
                  :disabled="readOnly"
                  v-model="searchForm.group_purpose"
                  style="width: 100%"
                  clearable
                  placeholder="请选择"
                >
                  <el-option
                    v-for="(labelType, index) in group_purpose"
                    :key="index"
                    :label="labelType.label"
                    :value="labelType.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="24">
              <el-form-item label="受众说明">
                <el-input
                  :disabled="readOnly"
                  v-model="searchForm.group_desc"
                  type="textarea"
                  autosize
                  maxlength="400"
                  placeholder="根据导入的数据说明受众人群，最多可以填400字"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-if="!readOnly" :gutter="20">
            <el-col :span="24">
              <el-form-item label="导入方式" prop="import_method">
                <el-radio-group
                  v-model="searchForm.import_method"
                  size="medium"
                >
                  <el-radio
                    v-for="(item, index) in import_mode"
                    :key="index"
                    :label="item.value"
                    :disabled="item.disabled"
                    >{{ item.label }}</el-radio
                  >
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row
            v-if="searchForm.import_method == 1 && !readOnly"
            :gutter="20"
            class="star-mark"
          >
            <el-col :span="24">
              <el-form-item label="ID类型" prop="import_type">
                <el-radio
                  v-for="item in radio_phone"
                  v-model="searchForm.import_type"
                  :key="item.value"
                  :label="item.key"
                  :disabled="
                    item.key === '2' ||
                    item.key === '3' ||
                    item.key === '4' ||
                    item.key === '5'
                  "
                  @change="radioChange"
                  >{{ item.label }}{{ item.id }}</el-radio
                >
              </el-form-item>
            </el-col>
          </el-row>
          <el-row  v-if="searchForm.import_method == 2" >
             <el-col :span="13">
              <el-form label-width="150px">
                <el-form-item label="QuickAudience受众" prop="group_purpose">
                  <el-select
                    :disabled="readOnly"
                    v-model="searchForm.group_purpose"
                    style="width: 100%"
                    clearable
                    placeholder="请选择"
                  >
                    <el-option
                      v-for="(labelType, index) in group_purpose"
                      :key="index"
                      :label="labelType.label"
                      :value="labelType.value"
                    />
                  </el-select>
                </el-form-item>
              </el-form>
            </el-col>
          </el-row>
        </el-form>
      </header>
      <main class="tableMainContent">
        <div v-if="searchForm.import_method == 1" class="upLoad-contain">
          <div :class="upLoading ? 'relativeBtn' : 'btns'">
            <el-upload
              v-if="
                searchForm.group_name && searchForm.group_purpose && !readOnly
              "
              ref="upload"
              :on-success="handleSuccess"
              :on-error="handleError"
              :headers="{ Authorization: 'Bearer ' + $store.getters.token }"
              :before-upload="beforeUpload"
              :data="uploadFileData"
              :show-file-list="false"
              :file-list="fileList"
              :multiple="false"
              :action="JumImport"
              accept=".xls,.xlsx"
              name="file"
            >
              <el-button
                v-if="
                  searchForm.group_name &&
                  searchForm.group_purpose &&
                  !upLoading
                "
                size="small"
                type="primary"
              >
                <i class="el-icon-upload2" />上传文件</el-button
              >
            </el-upload>
            <div
              v-if="
                !searchForm.group_name ||
                !searchForm.group_purpose ||
                readOnly ||
                upLoading
              "
              class="disabledBtn"
            >
              <i class="el-icon-upload2" /> 上传文件
            </div>
            <el-button
              style="margin-top: 15px"
              size="small"
              type="primary"
              @click="exportNullExcel"
            >
              <i class="el-icon-download" /> 下载模版</el-button
            >
          </div>
          <div class="information">
            <!-- 上传状态  成功提示  失败提示  失败详情 -->
            <div v-if="uploadStatus == 'defult'" class="defult-info">
              <h4 class="defult-title">用户信息表</h4>
              <p>重复导入用户信息时，会直接覆盖已导入的用户信息.</p>
              <p>文件后缀名必须为xlsx,文件大小不得大于5M.</p>
              <p
                v-if="
                  memberInfo && uploadStatus == 'defult' && loadFile.name === ''
                "
                style="color: #435a82"
              >
                成功上传条数：{{ memberInfo }}条
              </p>
              <!-- 正上传列表 -->
              <div v-if="loadFile.name" class="uploadFile">
                <span
                  >{{ loadFile.name }} ({{ loadFile.size | sizeFormat }})</span
                >
                <i
                  class="el-icon-loading"
                  style="margin-left: 20px; color: #4d6ca1"
                />
              </div>
            </div>
            <div v-if="uploadStatus == 'success'" class="suc-info">
              <h4 class="suc-title">批量导入成功</h4>
              <p>成功导入数量：{{ failTip.success_total }}</p>
              <p>失败导入数量：0</p>
            </div>
            <div v-if="uploadStatus == 'failure'" class="fail-info">
              <div>
                <h4 class="suc-title">
                  {{
                    failTip.total === failTip.fail_total
                      ? "全部导入失败"
                      : "部分导入成功"
                  }}
                </h4>
                <p>
                  导入总条数：{{ failTip.success_total + failTip.fail_total }}
                </p>
                <p>失败条数：{{ failTip.fail_total }}</p>
                <el-button
                  style="margin-top: 15px"
                  size="small"
                  type="primary"
                  @click="resultSetDialog = true"
                  >导出明细</el-button
                >
              </div>
              <div class="fail-details">
                <!-- ${res.data.msg},失败:${res.data.fail_total}条,成功:${res.data.success_total}条,总条数:${res.data.total}条 -->
                <p v-for="(item, i) in failTip.fail_list" :key="i">
                  第{{ item.number }}行，{{ item.member_id}}
                  {{ item.error_reason }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </section>
    <footer
      :style="{ left: sidebar.opened ? '230px' : '50px' }"
      class="action-wrap"
    >
      <el-button
        v-if="!readOnly"
        :loading="isLoading"
        type="primary"
        size="small"
        class="search-more"
        @click="drawerTo"
        >查看画像</el-button
      >
      <el-button
        :loading="isLoading"
        :disabled="readOnly"
        type="primary"
        size="small"
        class="search-more"
        @click="cancel('stopped')"
        >保存草稿</el-button
      >
      <el-button
        :loading="isLoading"
        :disabled="readOnly"
        type="primary"
        size="small"
        class="search-more"
        @click="save('started')"
        >保存并启用</el-button
      >
      <el-button
        :loading="isLoading"
        type="primary"
        size="small"
        class="search-more"
        @click="cancel"
        >取消</el-button
      >
      <el-button
        v-if="!readOnly"
        :loading="isLoading"
        type="primary"
        size="small"
        class="search-more"
        @click="crowdMultitude"
        :before-close="handleClose"
        >人群推送</el-button
      >
    </footer>
    <el-drawer
      :visible.sync="drawer"
      :with-header="false"
      title="群像分析"
      size="90%"
    >
      <span>
        <crm-group-portraint
          v-if="drawer"
          :label-id="failTip.id"
          :group-data-table="failTip.group_data_table"
          :create-type="searchForm.create_type"
          link_resource="group"
        />
      </span>
    </el-drawer>
    <!-- <elDialog :exporTresultType="exporTresultType" :resultSetDialog="resultSetDialog"/> -->
    <el-dialog :visible.sync="dialogCrowd" title="创建推送功能" width="700px">
      <ul class="page-tool">
        <li
          v-for="item in dateAddedList"
          :key="item.id"
          @click="createPush(item)"
        >
          <div class="page-img">
            <img :src="item.icon_url" alt />
          </div>
          <div class="page-signal">
            <span>{{ item.integ_channel_name }}</span>
            <span>{{ item.chl_desc }}</span>
          </div>
        </li>
      </ul>
    </el-dialog>
    <el-dialog
      title="导出明细"
      :visible.sync="resultSetDialog"
      width="50%"
      class="wrap_export"
    >
      <ol class="export_file">
        <li>
          <i class="el-icon-circle-check"></i>
        </li>
        <li>
          导出明细已提交,请到
          <span>
            <router-link :to="{ name: 'dataDownload' }"
              >管理平台-下载中心</router-link
            ></span
          >
          下载!
        </li>
        <li>如果不需要使用系统生成的文件名,您可以自定义文件名称:</li>
        <li>
          <el-input v-model="file_name" clearable></el-input>
        </li>
      </ol>

      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="comfig">保存</el-button>
        <el-button @click="resultSetDialog = false">关闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { mapState } from "vuex";
import { apiObj } from "@/config/getUrl.js";
import {
  importGroup,
  setStatus,
  getMemberInfo,
  getGroupDetails,
  editGroup,
  deleteGroup,
} from "@/api/markting/vinpinsightGrouplist";
import { editFileName } from "@/api/markting/security/visit";
import { getType } from "@/api/security/visit";
import crmGroupPortraint from "@/views/platformitem/markting/dataAnalysis/crmGroupPortrait/index";
// json -> excel
import ExportJsonExcel from "js-export-excel";
import "./scss/components.scss";
import Cookies from "js-cookie";
// import elDialog from '@/publicComponents/documentDownload/index'
export default {
  filters: {
    sizeFormat(size) {
      if (size / 1024 / 1024 < 1) {
        return (size / 1024).toFixed(2) + "KB";
      } else {
        return (size / 1024 / 1024).toFixed(2) + "MB";
      }
    },
  },
  components: {
    crmGroupPortraint,
    // elDialog
  },
  data() {
    return {
      drawer: false,
      upLoading: false,
      isLoading: false,
      searchForm: {
        id: "",
        group_name: "",
        create_type: "file_import",
        create_region: "华北",
        brand_code: Cookies.get("brandCode"),
        group_purpose: "",
        group_desc: "",
        import_method: "1",
        import_type: "1",
      },
      JumImport: `${apiObj.uploadOss}/groupExcel`,
      readOnly: false,
      jumpShops: "", // 下载文件
      rules: {
        group_name: [
          { required: true, message: "请输入受众名称", trigger: "blur" },
        ],
        create_type: [
          { required: true, message: "请选择创建方式", trigger: "blur" },
        ],
        group_purpose: [
          { required: true, message: "请选择受众目的", trigger: "blur" },
        ],
        // 导入方式
        import_method: [
          {
            required: true,
            message: "请选择导入方式",
            trigger: "change",
          },
        ],
        // 类型
        import_type: [
          { required: true, message: "请选择ID地址", trigger: "change" },
        ],
      },
      create_type_list: [
        { label: "导入受众", value: "file_import" },
        { label: "普通受众", value: "normal" },
        { label: "高级受众", value: "advanced" },
      ],
      group_purpose: [
        { label: "常规营销", value: "regular_marketing" },
        { label: "休眠唤醒", value: "sleep_wake " },
        { label: "流失召回", value: "loss_recall" },
        { label: "店铺引流", value: "shop_drainage" },
        { label: "活动宣传", value: "event_promotion" },
        { label: "会员关怀", value: "member_care" },
        { label: "系统通知", value: "system_notification" },
      ],
      import_mode: [
        {
          label: "手动上传",
          value: "1",
        },
        {
          label: "从QuickAudience导入",
          value: "2",
        },
      ],
      radio_phone: [
        { label: "手机号码", value: "手机号码", key: "1" },
        { label: "邮箱", value: "邮箱", key: "2" },
        { label: "MAC地址", value: "MAC地址", key: "3" },
        { label: "手机IDFA", value: "手机IDFA", key: "4" },
        { label: "手机IMEA", value: "手机IMEA", key: "5" },
        { label: "淘宝NICK", value: "淘宝NICK", key: "6" },
        { label: "京东PIN", value: "京东PIN", key: "7" },
      ],
      fileList: [],
      loadFile: {
        name: "",
        size: "",
      },
      uploadFileData: {},
      saveId: "",
      filename: "",
      uploadStatus: "defult", // defult success failure
      memberInfo: false,
      successTip: {},
      failTip: {},
      dialogCrowd: false,
      dateAddedList: [], // 人群推送
      draftUrl: "",
      draftData: "",
      codeType: "",
      throng: "",
      remark: "",
      exporTresultType: "",
      exporTresultType: "",
      readOnlyDisbale: false,
      fileName: "",
      resultSetDialog: false,
      resultId: 0,
      file_name: "",
      fileId: "",
      failTotal:'',
      successTotal:'',
    };
  },
  computed: {
    ...mapState({
      sidebar: (state) => state.app.sidebar,
    }),
  },
  mounted() {
    if (this.$route.query.view) {
      this.readOnly = true;
      this.getDetails();
      this.getMemberNum(this.$route.query.group_data_table);
    }
    this.multitude();
  },
  methods: {
    drawerTo() {
      // 表单校验 + 上传成功条数
      this.$refs["form"].validate((vaild) => {
        if (!vaild) return;
        if (this.memberInfo) {
          this.drawer = true;
        } else {
          this.$message.error("请先导入受众数据！");
        }
      });
    },
    // id类型切换
    radioChange(e) {
      console.log(e, 222);
      if(e){
       this.searchForm.memberKey = e;
      }else if(!e){
         this.searchForm.memberKey = this.searchForm.import_type;
      }
    },
    // 人群推送--创建推送接口
    multitude() {
      const params = {};
      getType(params).then((res) => {
        if (res) {
          this.dateAddedList = res.data[3].list;
        }
      });
    },
    //人群推送按钮
    crowdMultitude() {
      this.$refs["form"].validate((vaild) => {
        if (!vaild) {
          return;
        } else {
          this.saveStart(
            this.memberInfo,
            this.codeType,
            this.uploadFileData.id,
            "人群推送"
          );
        }
      });
    },
    handleClose() {
      this.dialogCrowd = false;
      if (this.dialogCrowd === false) {
        this.isLoading = false;
      }
    },
    createPush(item) {
      if (item) {
        this.saveStart(this.memberInfo, this.codeType, this.uploadFileData.id);
        if (this.throng) {
          this.$router.push({
            name: "newJingdongShufang",
            query: {
              id: this.fileId,
              integ_channel_name: item.integ_channel_name,
            },
          });
        }
      }
    },
    getDetails() {
      getGroupDetails({
        id: this.$route.query.id,
        group_type: this.$route.query.group_type,
      }).then((res) => {
        this.searchForm.id = res.data.id;
        this.searchForm.group_name = res.data.group_name;
        this.searchForm.group_purpose = res.data.group_purpose;
        this.searchForm.group_attribute = res.data.group_attribute;
        this.searchForm.group_desc = res.data.group_desc;
        this.searchForm.update_frequency = res.data.update_frequency;
        this.searchForm.brand_code = res.data.brand_code;
      });
    },
    getMemberNum(group_data) {
      getMemberInfo({
        id: this.$route.query.id,
        group_data_table: group_data,
      }).then((res) => {
        this.memberInfo = res.data.total;
      });
    },
    beforeUpload(file) {
      this.upLoading = true;
      this.uploadStatus = "defult";
      this.loadFile.name = file.name;
      this.loadFile.size = file.size;
      const splitArr = file.name.split(".");
      const isXLSX =
        splitArr[splitArr.length - 1] === "xlsx" ||
        splitArr[splitArr.length - 1] === "xls";
      const isLt100M = file.size / 1024 / 1024 < 5;
      console.log(isXLSX);
      if (!isXLSX) {
        this.$message.error("上传文件只能是Excel格式!");
        this.upLoading = false;
        this.loadFile.name = "";
      }
      if (!isLt100M) {
        this.$message.error("上传文件大小不能超过 5MB!");
        this.upLoading = false;
        this.loadFile.name = "";
      }
      return isXLSX && isLt100M;
    },
    handleSuccess(response, file, fileList) {
      this.upLoading = false;
      this.draftUrl = response.body.url;
      this.draftData = response.data;
      this.fileName = file.name;
      this.readOnlyDisbale = false;
      console.log(response, "response");
      this.updata(response.body.url);
    },
    updata(url, type) {
      const params = {
        status: "stop",
        create_region: "华东",
        brand_code: Cookies.get("brandCode"),
        group_rule: "aaa",
        filePath: url,
        fileName: this.fileName,
        ...this.searchForm,
      };
      if (this.uploadFileData.id) {
        params.id = this.uploadFileData.id;
        params.group_data_table = this.uploadFileData.group_data_table;
      }
      console.log(url, "url2");
      importGroup(params)
        .then((res) => {
          this.upLoading = false;
          this.isLoading = false;
          this.memberInfo = true;
          this.codeType = res.code;
          this.resultId = res.data.fail_list[0].id;

          if (url) {
            this.uploadFileData.id = res.data.id;
            this.uploadFileData.group_data_table = res.data.group_data_table;
            this.saveId = res.data.id;
            if (res.code == "1") {
              this.fileId = res.data.file_id;
              this.failTotal=res.data.fail_total
              this.successTotal=res.data.success_total
              // this.$message.success(
              //   `${res.data.msg},失败:${res.data.fail_total}条,成功:${res.data.success_total}条,总条数:${res.data.total}条`
              // );
              this.readOnlyDisbale = false;
            } else {
              this.readOnlyDisbale = true;
            }
            res.data.fail_total
              ? (this.uploadStatus = "failure")
              : (this.uploadStatus = "success");
            this.failTip = res.data;
            this.memberInfo = res.data.success_total;
          } else {
            this.$message.success(
              `${res.data.msg},失败:${res.data.fail_total}条,成功:${res.data.success_total}条,总条数:${res.data.total}条`
            );
            this.isLoading = false;
            // this.$router.push({ name: 'groupList' })
          }
        })
        .catch((err) => {
          this.upLoading = false;
          this.isLoading = false;
          this.memberInfo = false;
          this.loadFile = {
            name: "",
            size: "",
          };
        });
    },
    saveStart(memberInfo, code, id, codeType) {
      console.log(codeType, "memberInfo, code, id");
      if (!memberInfo) {
        this.$message.error("请上传文件");
        return;
      } else {
        if (code !== "1") {
          this.$message.error("导入失败，请重新导入");
        } else {
          this.isLoading = true;
          const params = {
            create_region: "华东",
            brand_code: Cookies.get("brandCode"),
            group_rule: "aaa",
            filePath: this.draftUrl,
            ...this.searchForm,
          };
          params.id = id;
          params.group_data_table = this.uploadFileData.group_data_table;
          editGroup(params).then((res) => {
            setStatus({ id: id, stop_or_start: "start" }).then((res) => {
              if (codeType === "人群推送") {
                this.throng = true;
                this.multitudeTyoe(this.throng);
              } else {
                this.$message.success("保存成功!");
                this.dialogCrowd = true;
                this.isLoading = false;
                this.$router.push({ name: "groupList" });
              }
            });
          });
        }
      }
    },
    multitudeTyoe(throng) {
      if (throng) {
        this.dialogCrowd = true;
      } else {
        this.dialogCrowd = false;
      }
    },
    handleError(err, file, fileList) {
      // this.uploadStatus = 'failure'
      this.upLoading = false;
      this.$message.error(err.bizMsg);
    },
    //导出明细保存
    comfig() {
      let params = {
        fileId: this.fileId,
        fileName: this.file_name,
      };
      editFileName(params).then((res) => {
        if (res.code === "1") {
          this.resultSetDialog = false;
        }
      });
      this.file_name = "";
    },
    // 下载文件
    exportNullExcel() {
      if(!this.searchForm.memberKey){
        this.searchForm.memberKey=this.searchForm.import_type
      }
      console.log(this.searchForm.memberKey, "this.searchForm.memberKey");
      if (this.searchForm.memberKey === "1") {
        this.jumpShops =
          "https://auth-setting.oss-cn-shanghai.aliyuncs.com/excel-model/%E5%AF%BC%E5%85%A5%E5%8F%97%E4%BC%97%E6%A8%A1%E7%89%88-%E6%89%8B%E6%9C%BA%E5%8F%B7.xlsx";
      } else if (this.searchForm.memberKey === "7") {
        this.jumpShops =
          "https://auth-setting.oss-cn-shanghai.aliyuncs.com/excel-model/%E5%AF%BC%E5%85%A5%E5%8F%97%E4%BC%97%E6%A8%A1%E7%89%88-%E4%BA%AC%E4%B8%9CPIN.xlsx";
      } else if (this.searchForm.memberKey === "6") {
        this.jumpShops =
          "https://auth-setting.oss-cn-shanghai.aliyuncs.com/excel-model/%E5%AF%BC%E5%85%A5%E5%8F%97%E4%BC%97%E6%A8%A1%E7%89%88-%E6%B7%98%E5%AE%9DNICK.xlsx";
      } else {
        this.jumpShops = "";
      }
      window.location.href = this.jumpShops;
    },
    // 保存并启用
    save(type) {
      console.log(this.memberInfo,'保存并启用')
      console.log(this.upLoading,'保存并启用查看是否上传')
      if (this.upLoading) {
        this.$message({
          message: "文件正在上传中，上传成功之后请继续操作",
          type: "warning",
        });
        return;
      }

      this.$refs["form"].validate((vaild) => {
        if (!vaild) {
          return;
        } else {
          this.saveStart(
            this.memberInfo,
            this.codeType,
            this.uploadFileData.id
          );
        }
      });
    },
    cancel(type) {
      console.log(this.memberInfo,'草稿')
      console.log(this.upLoading,'草稿是否上传')
      if (this.upLoading) {
        this.$message({
          message: "文件正在上传中，上传成功之后请继续操作",
          type: "warning",
        });
        return;
      }
      if (!this.memberInfo && type === "stopped") {
        this.$message.error("请上传文件");
        return;
      }
      if(type !== "stopped"){
        this.$router.go(-1)
      }
      if (type === "stopped") {
        if (this.failTip.group_data_table) {
          const params = {
            create_region: "华东",
            brand_code: Cookies.get("brandCode"),
            group_rule: "aaa",
            filePath: "",
            ...this.searchForm,
          };

          params.id = this.uploadFileData.id;
          console.log(this.uploadFileData.id, "this.uploadFileData.id");
          params.group_data_table = this.uploadFileData.group_data_table;
          editGroup(params).then((res) => {
            console.log(res, "res2");
            this.$message.success("保存成功!");
            this.$router.push({ name: "groupList" });
          });
        } else {
          this.$refs["form"].validate((vaild) => {
            if (!vaild) return;
            this.isLoading = true;
            this.updata(this.draftData, this.draftUrl);
          });
        }
      } else {
        //  点击取消
        if (this.uploadFileData.group_data_table) {
          // 文件已经导入，受众已经存在
          // 调用删除
          deleteGroup({
            id: this.uploadFileData.id,
            create_type: "file_import",
          }).then((res) => {
            this.$router.push({ name: "groupList" });
          });
        } else {
          this.$router.push({ name: "groupList" });
        }
      }
    },
  },
};
</script>
<style lang="less" scoped>
/deep/ .el-drawer__body {
  overflow: auto !important;
}
.el-drawer__body {
  overflow: auto !important;
}
/deep/ .el-drawer__header {
  margin-bottom: 0 !important;
}
.el-drawer__header {
  margin-bottom: 0 !important;
}
.upLoad-contain {
  margin-top: 20px;
  display: flex;
  .btns,
  .relativeBtn {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 120px;
  }
  .relativeBtn {
    position: relative;
    top: -8px;
  }
  .information {
    flex: 1;
    min-height: 120px;
    margin-left: 10px;
    background: #f6f8fa;
    padding: 10px;
    .defult-info,
    .suc-info,
    .fail-info > div:nth-of-type(1) {
      h4 {
        font-size: 18px;
        font-weight: 500;

        line-height: 28px;
      }
      .defult-title {
        color: rgba(67, 90, 130, 1);
      }
      .suc-title {
        color: #000;
      }
      p {
        font-size: 14px;
        font-weight: 500;
        color: rgba(158, 157, 157, 1);
        line-height: 28px;
      }
      .uploadFile {
        line-height: 28px;
      }
    }
    .fail-info {
      display: flex;
      .fail-details {
        flex: 1;
        max-height: 130px;
        margin-left: 20px;
        background: white;
        padding: 10px;
        overflow: auto;
        p {
          display: inline-block;
          width: 50%;
          padding-left: 15px;
          font-size: 12px;
          line-height: 1.8;
          text-align: left;
          &:nth-of-type(odd) {
            position: relative;
            &::before {
              position: absolute;
              content: "";
              top: 0;
              right: 0;
              height: 100%;
              width: 1px;
              background: #dde1e9;
            }
          }
        }
      }
    }
  }
}
.vipinsight-taglist-page {
  height: 100%;
  width: 100%;
  background: #f3f3f3;
  & > section {
    position: relative;
    padding: 20px 20px 60px;
    height: 100%;
    background: white;
    // header {
    //   padding-bottom: 60px;
    // }
  }
  /deep/ .el-form-item__label {
    color: #606266;
    font-size: 14px;
    font-weight: normal;
  }
  /deep/ .el-input {
    width: 100%;
  }
  /deep/ .el-textarea {
    width: 100%;
  }
  /deep/ .el-upload-dragger {
    width: 160px;
  }

  /deep/ .quickAudience {
    display: flex;
    justify-content: center;
    width: 100%;
    margin-top: 40px;
    /deep/ .el-form {
      /deep/ .el-form-item {
        display: flex;
        /deep/.el-form-item__label {
          width: 142px !important;
        }
        /deep/ .el-form-item__content {
          margin-left: 0 !important;
        }
      }
    }
  }
}
.star-mark {
  position: relative;
  // &::before{
  //   content: '*';
  //   position: absolute;
  //   top: 10px;
  //   left: 14px;
  //   color: #F56C6C;
  // }
}
.id-star-mark {
  // &::before{
  //   left: 28px;
  // }
}
.search-more {
  border: 1px solid rgba(67, 90, 130, 1);
  background: none;
  color: #435a82;
  &:hover {
    background: #435a82;
    color: white;
  }
  &:disabled {
    border-color: #e4e7ed;
    background: #e4e7ed;
    color: #c0c4cc;
  }
}
.disabledBtn {
  cursor: pointer;
  height: 32px;
  padding: 9px 15px;
  font-size: 12px;
  border: 1px solid rgba(67, 90, 130, 1);
  border-color: #e4e7ed;
  background: #e4e7ed;
  color: #c0c4cc;
}
.label-title {
  height: 16px;
  position: relative;
  line-height: 16px;
  padding-left: 10px;
  margin-bottom: 20px;
  .info_tip {
    color: red;
    font-size: 12px;
    margin-left: 15px;
  }
}
.linev-tip {
  display: inline-block;
  width: 4px;
  height: 16px;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  position: absolute;
  background: #435a82;
}
footer {
  .el-button--primary,
  .el-button--default {
    display: inline-block;
    width: 100px;
  }
}
/deep/ .wrap_export {
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
        color: #435a82 !important;
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
