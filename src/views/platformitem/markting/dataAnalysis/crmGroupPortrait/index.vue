<template>
  <div class="app-container crmGroupPortraint">
    <div class="crmGroupPortraintBox">
      <!--受众列表进入，不转化josn，二期还要把这个判断改成   v-if="link_resource ！=='all'" -->
      <el-row
        v-if="link_resource === 'label'"
        v-show="link_resource === 'label'"
        class="conditon"
      >
        <el-col :span="14">
          <portait-filter-component-wrap
            ref="portaitFilterComponentWrap"
            :id="labelId"
            :application-type="
              link_resource === 'label' ? 'group' : 'complex_group'
            "
          />
        </el-col>
        <el-col :span="9" class="FilterStyle">
          <el-button type="primary" icon="el-icon-search" @click="getData">
            查 询
          </el-button>
        </el-col>
      </el-row>
      <el-row v-if="link_resource === 'all'" class="conditons">
        <div>
          <el-col :span="12">
            <div class="fontColorStyle">
              * 默认展示（{{
                brandName
              }}品牌）所有注册会员画像近12个月的消费数据
            </div>
          </el-col>
          <el-col :span="12" class="FilterStyle">
            <div>
              <span>选择模版</span>
              <el-select
                v-model="templateId"
                placeholder="请选择模版"
                @change="changTemplateFun"
                @focus="changTemplateFun1"
              >
                <el-option
                  v-for="item in templateList"
                  :key="item.id"
                  :label="item.template_name"
                  :value="item.id"
                />
              </el-select>
              <!-- <el-button type="primary" @click="copyTemplateFun" >
                复制模版
              </el-button> -->
              <el-button
                :disabled="!commonTempleteIsShow"
                type="primary"
                @click="deleteTemplateFun"
              >
                删除模版
              </el-button>
              <span class="delStyle">公共模版不可删除</span>
            </div>
          </el-col>
        </div>
      </el-row>
      <el-row class="conditons">
        <el-col :span="2"> <span class="el-icon-user" /></el-col>
        <el-col :span="5">
          <div class="fontColorStyle">
            <!-- <crmCommon :chart-object="chartIdArr[0]" :is_show="is_show" /> -->
            <chart-Analysis
              v-if="overViewArr && overViewArr.length > 0"
              :request-data="getChartDataById"
              :draggable-diable="!commonTempleteIsShow"
              :link_resource="link_resource"
              :version="version"
              :market-action="marketAction"
              :label-id="labelId"
              :action-id="actionId"
              :marketing-no="marketingNo"
              :create-type="createType"
              :group-data-table="groupDataTable"
              :filter-json="filterJson"
              :crowd-filter="crowdFilter"
              :update-request-data="updateChartDataById"
              :template-id="templateId"
              :chart-arr="overViewArr"
              :is_show="crmCommonBoolean"
              @initData="initChartData"
            />
          </div>
        </el-col>
        <el-col :span="7">
          <div class="fontColorStyle">.</div>
        </el-col>
        <el-col :span="10" class="FilterStyle">
          <el-row>
            <el-col :span="24">
              <el-button
                v-if="
                  link_resource === 'all'
                "
                type="primary"
                @click="copyTemplateFun"
              >
                复制模版
              </el-button>
              <el-button
                :loading="loadingBtnStatus"
                type="primary"
                @click="initHiddenData"
              >
                画像导出
              </el-button>
              <el-button
                v-if="
                  link_resource === 'all'
                "
                :disabled="!commonTempleteIsShow"
                type="primary"
                @click="addChartFun"
              >
                添加图表
              </el-button>
              <el-button
                v-if="
                  link_resource === 'all'
                "
                :disabled="condtionSaveDisable"
                type="primary"
                @click="addFilterJSONFun"
              >
                保存条件至模版
              </el-button>
            </el-col>
            <el-col :span="24" class="conditons">
              <div
                v-if="
                  link_resource !== 'group' && link_resource !== 'marketing'
                "
              >
                <el-button
                  v-if="
                    link_resource === 'label'
                  "
                  type="primary"
                  @click="openPeopleFilterModal"
                  >人群选择</el-button
                >
                <el-button
                  v-else
                  :disabled="!commonTempleteIsShow"
                  type="primary"
                  @click="openPeopleFilterModal"
                  >人群选择</el-button
                >
                查看指定会员群体的画像，通过左侧按钮进行筛选
              </div>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
      <div class="chartsBoxTop">
        <div class="chartTabs" style="position: relative; overflow: hidden">
          <div class="ad-status filter-btns" style="font-size: 13px">
            <ul>
              <li
                v-for="(adStatusItem, index) in adStatusItems"
                :key="index"
                :class="{ on: adStatusItem.enum_value == ISSUE_STATUS }"
                @click="filterFun(adStatusItem.enum_value)"
              >
                {{ adStatusItem.enum_name }}
              </li>
            </ul>
          </div>
          <div>
            <chart-Analysis
              v-if="chartIdArr && chartIdArr.length > 0"
              :request-data="getChartDataById"
              :draggable-diable="!commonTempleteIsShow"
              :link_resource="link_resource"
              :version="version"
              :market-action="marketAction"
              :label-id="labelId"
              :action-id="actionId"
              :marketing-no="marketingNo"
              :create-type="createType"
              :group-data-table="groupDataTable"
              :filter-json="filterJson"
              :crowd-filter="crowdFilter"
              :update-request-data="updateChartDataById"
              :template-id="templateId"
              :chart-arr="chartIdArr"
              :is_show="commonTempleteIsShow"
              @initData="initChartData"
              @changePosition="changePosition"
            />
          </div>
          <div ref="imageTofile" class="hiddenBox">
            <div v-for="(item, index) in hiddenIdsList" :key="index">
              <p v-if="'basicAttribute' === item.type" class="titleStyle">
                基础属性
              </p>
              <p v-if="'customerLevel' === item.type" class="titleStyle">
                会员等级
              </p>
              <p v-if="'consumeContribution' === item.type" class="titleStyle">
                消费贡献
              </p>
              <p v-if="'customerScore' === item.type" class="titleStyle">
                会员积分
              </p>
              <p v-if="'customerValue' === item.type" class="titleStyle">
                会员价值
              </p>
              <p v-if="'accessBehavior' === item.type" class="titleStyle">
                访问/行为
              </p>
              <p v-if="'limitedSale' === item.type" class="titleStyle">
                限量发售
              </p>
              <chart-Analysis
                v-if="item.idlist && item.idlist.length > 0"
                :request-data="hiddenGetChartDataById"
                :update-request-data="updateChartDataById"
                :link_resource="link_resource"
                :version="version"
                :market-action="marketAction"
                :label-id="labelId"
                :action-id="actionId"
                :marketing-no="marketingNo"
                :create-type="createType"
                :group-data-table="groupDataTable"
                :filter-json="filterJson"
                :crowd-filter="crowdFilter"
                :template-id="templateId"
                :is_show="hidden_is_show"
                :chart-arr="item.idlist"
                :is-print="isPrint"
                :xl="24"
                @chartNum="chartNumFun"
                @changePosition="changePosition"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
    <el-dialog
      :visible.sync="dialogVisible"
      :before-close="handleClose"
      title=""
      width="800px"
    >
      <div slot="title" class="header-title">
        <span class="title-name">请选择要展示的图表</span>
      </div>
      <el-row :gutter="10">
        <div class="imgBox">
          <el-col
            v-for="(item, index) in allChartList"
            :key="index"
            :xs="24"
            :sm="12"
            :md="8"
            :lg="8"
            :xl="4"
          >
            <div class="imgIconItem">
              <i
                v-if="
                  modelData[ISSUE_STATUS] &&
                  modelData[ISSUE_STATUS].indexOf(item.id) < 0
                "
                class="el-icon-document-add"
                @click="selectImgFun(item, index)"
              />
              <div class="title">{{ item.title }}</div>
              <img
                :src="item.img_url"
                width="90px"
                alt=""
                style="margin-top: 5px"
              />
              <div
                v-if="
                  modelData[ISSUE_STATUS] &&
                  modelData[ISSUE_STATUS].indexOf(item.id) > -1
                "
                class="maskBox"
              />
              <i
                v-if="
                  modelData[ISSUE_STATUS] &&
                  modelData[ISSUE_STATUS].indexOf(item.id) > -1
                "
                class="el-icon-document-remove"
                @click="delSelectImgFun(item, index)"
              />
            </div>
          </el-col>
        </div>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancalFun">取 消</el-button>
        <el-button type="primary" @click="saveChartFun">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :visible.sync="copyModlalVisible"
      :before-close="closeCopyTemple"
      title=""
      width="50%"
    >
      <div slot="title" class="header-title">
        <span class="title-name">复制模版</span>
      </div>
      <el-row :gutter="10">
        <el-form
          ref="copyForm"
          :model="copyForm"
          :rules="copyRules"
          label-width="80px"
        >
          <el-form-item prop="name" label="复制模版">
            <el-input v-model="copyForm.name" maxlength="20" />
          </el-form-item>
        </el-form>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeCopyTemple">取 消</el-button>
        <el-button type="primary" @click="saveTemplateFun">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :append-to-body="true"
      :visible.sync="peopleFilterModalVisible"
      title="人群选择"
      width="900px"
      top="50px"
    >
      <FilterCombine
        v-if="peopleFilterModalVisible"
        ref="groupFilter"
        :rule-value="group_rule"
        :hidden-people-counts="true"
        application-type="complex_advanced_group"
      />
      <span slot="footer" class="dialog-footer">
        <el-button @click="peopleFilterModalVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmPeopleFilter">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { checkPermission } from "@/utils/permission";
import { getToken } from "@/utils/auth";
import draggable from "vuedraggable";
import html2canvas from "html2canvas";
import crmCommon from "@/componentsMarketing/CrmChart/crmCommon.vue";
import JsPDF from "jspdf";
import {
  initPortraitId,
  getPortraitInfoById,
  getPortraitList,
  updatePortraitIndex,
  getTemplateList,
  addTemplate,
  deleteTemplate,
  getLabelType,
  savePortrait,
  addFilterJSON,
  getFilterJSON,
  checkIsNotOrTrue,
} from "@/api/markting/crmGroupPortrait";
import FilterCombine from "@/componentsMarketing/FilterCombine/ruleFilter";
import portaitFilterComponentWrap from "@/componentsMarketing/FilterCombine/portraitFilterComponentWrap";
// console.log(FilterCombine, 8)
export default {
  name: "CrmGroupPortraint",
  components: {
    draggable,
    JsPDF,
    crmCommon,
    FilterCombine,
    portaitFilterComponentWrap,
  },
  props: {
    version: {
      type: String,
      default: "",
    },
    marketAction: {
      type: String,
      default: "",
    },
    link_resource: {
      type: String,
      default: "all",
    },
    labelId: {
      type: [String, Number],
      default: "",
    },
    actionId: {
      type: String,
      default: "",
    },
    marketingNo: {
      type: String,
      default: "",
    },
    createType: {
      type: String,
      default: "",
    },
    groupDataTable: {
      type: String,
      default: "",
    },
    FilterJson: {
      type: String,
      default: "",
    },
    label_type: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      isPrint: true,
      loadingBtnStatus: false,
      oldTemplateId: "",
      crmCommonBoolean: false,
      copyModlalVisible: false,
      is_show: false,
      commonTempleteIsShow: false,
      crowdFilter: "",
      ruleForm: {
        portait_model: {
          column_id: this.labelId,
        },
      },
      filterJson: "",
      copyRules: {
        name: [{ required: true, message: "请输入活动名称", trigger: "blur" }],
      },
      copyForm: {
        name: "",
      },
      hiddenString: "hidden",
      hiddenIdsList: [],
      adStatusItems: [],
      ISSUE_STATUS: "",
      // draggableDiable: false,
      hidden_is_show: false,
      overViewArr: [{}],
      chartIdArr: [],
      templateId: "",
      template_type: "",
      templateList: [],
      dialogVisible: false,
      allChartList: [],
      brandName: "",
      drowData: {},
      modelData: {},
      group_rule: {},
      peopleFilterModalVisible: false,
      chartHiddenNum: 0,
      condtionSaveDisable: true,
      oldPageJSON: "",
      cookieNewPageJSON: "",
      portraitConditionCache: "",
    };
  },
  computed: {
    hiddenChartAllLength() {
      let hiddenChartAllLength = 0;
      if (this.hiddenIdsList && this.hiddenIdsList.length > 0) {
        this.hiddenIdsList.forEach((item) => {
          hiddenChartAllLength = hiddenChartAllLength + item.idlist.length;
        });
      }
      return hiddenChartAllLength;
    },
  },
  watch: {
    templateId(val, oldTemplateId) {
      this.oldTemplateId = oldTemplateId;
    },
  },
  mounted() {
    // setToken('cookieNewPageJSON', '')
    this.brandName = getToken("brandName");
    this.filterJson = this.FilterJson;
    // if (this.link_resource === 'group' && !this.groupDataTable) {
    //   this.initJson()
    // } else if (this.link_resource === 'label') {
    //   this.initJson()
    // }
    // if (this.link_resource === 'label') {
    //   this.initJson()
    // }
    this.getTemplateAndTabTypeListFun();
    // 刚进入页面，判断保存条件至模版 按钮的禁用
    // this.getFilterJsonFun('judgeBtnDisable')
    document.body.appendChild(this.$refs.imageTofile);
  },
  beforeDestroy() {
    document.body.removeChild(this.$refs.imageTofile);
  },
  methods: {
    checkPermission,
    // 当所有的图表加载完毕，再调用导出画像
    chartNumFun(num) {
      //  隐藏的图表全部成功，之后，让loading隐藏
      this.chartHiddenNum = this.chartHiddenNum + num;
      if (this.chartHiddenNum === this.hiddenChartAllLength) {
        this.loading = false;
        this.generatorImage();
      }
    },
    getData() {
      this.initJson();
    },
    initJson() {
      var portaitFilterComponentWrap = this.$refs.portaitFilterComponentWrap;
      portaitFilterComponentWrap
        .validateRuleValue()
        .then(() => {
          this.filterJson = JSON.stringify(
            portaitFilterComponentWrap.getFilterJson()
          );
          if (this.link_resource === "label") {
            this.initChartData();
          }
          // if (this.label_type === 'complex') {
          //   this.filterJson = ''
          // } else {
          //   this.filterJson = JSON.stringify(portaitFilterComponentWrap.getFilterJson())
          // }
        })
        .catch(() => {});
    },
    // preTemplateIdFun() {
    //   this.oldTemplateId = this.templateId
    //   // console.log(this.oldTemplateId)
    // },
    changTemplateFun() {
      // this.getFilterJsonFun('judgeBtnDisable')
      // 切换模版之前，看上一个模版 吗、，比较上一个模版 sqlJson 和  人群选择里面的json  一致不？一致就不给弹框，不一致，就给弹框

      this.judgeBtnDisableFun("changeTempCondtionDisable");
      this.templateList.map((item) => {
        if (item.id === this.templateId) {
          if (item.template_type === "common") {
            // 公共模版，不可以删除图表
            this.commonTempleteIsShow = false;
          } else {
            this.commonTempleteIsShow = true;
          }
        }
      });
      this.crowdFilter = "";
      this.initChartData();
    },
    changTemplateFun1(event) {
      if (!this.condtionSaveDisable) {
        event.target.blur();
        this.openTipFun();
      }
    },
    openTipFun() {
      this.$confirm("要保存人群选择的条件?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        // closeOnClickModal: false
      })
        .then(() => {
          this.addFilterJSONFun("changeTempCondtionDisable");
        })
        .catch(() => {
          this.cookieNewPageJSON = "";
          this.condtionSaveDisable = true;
        });
    },
    // 查询，隐藏的的图表，为了导出画像所做的
    initChartData() {
      this.chartIdArr = [];
      this.hiddenIdsList = [];
      this.initData();
    },
    initHiddenData() {
      this.loadingBtnStatus = true;
      this.hiddenIdsList = [];
      this.chartHiddenNum = 0;
      initPortraitId({ template: this.templateId }).then((res) => {
        this.hiddenIdsList = res.data.crmAllIdList;
      });
    },
    async getTemplateAndTabTypeListFun() {
      const data = await getTemplateList();
      this.templateList = data.data.templateList || [];
      if (this.templateList.length > 0) {
        // 从标签列表页面和 受众页面 进入此组件时，把默认模版id 赋值给 templatedId
        if (this.link_resource !== "all") {
          this.templateList.map((item) => {
            if (item.template_type === "common") {
              this.templateId = item.id;
            }
          });
        } else {
          // 从左侧导航栏进入此组件时，
          this.templateId = this.templateList[0].id;
          this.judgeBtnDisableFun("judgeBtnDisable");
          if (this.templateList[0].template_type === "common") {
            // 公共模版，不可以删除图表
            this.commonTempleteIsShow = false;
          } else {
            this.commonTempleteIsShow = true;
          }
        }
      }
      const adStatusItems = await getLabelType({
        enum_type: "groupImg",
        enum_type_code: "img_chart_class_type",
      });
      this.adStatusItems = adStatusItems.data.enum_code;
      if (this.adStatusItems && this.adStatusItems[0]) {
        this.ISSUE_STATUS = this.adStatusItems[0].enum_value;
      }
      const drowData = {};
      this.adStatusItems.map((item) => {
        drowData[item.enum_value] = [];
      });
      this.drowData = drowData;
      this.initData();
    },
    /*
    默认取pdf基准参考页的数据作为pdf分页要显示的数据，然后倒着循环进行边缘检测，进而推断实际应该height取值为多少，
    并纪录pdf 已经取了多少内容position,
    如果图表没有边框就尴尬了
    */
    generatorImage() {
      var that = this;
      var imageToFile = this.$refs.imageTofile;
      html2canvas(imageToFile, { x: window.scrollX }).then((canvas) => {
        // 未生成pdf的html页面高度
        var leftHeight = canvas.height;

        var a4Width = 595.28;
        var a4Height = 841.89;
        // 一页pdf显示html页面生成的canvas高度;
        var a4HeightRef = Math.floor((canvas.width / a4Width) * a4Height);
        // pdf页面偏移
        var position = 0;
        var pdf = new JsPDF("x", "pt", "a4");
        var canvas1 = document.createElement("canvas");
        var height;
        pdf.setDisplayMode("fullwidth", "continuous", "FullScreen");

        var pdfName = "图表数据";
        function createImpl(canvas) {
          if (leftHeight > 0) {
            var checkCount = 0;
            if (leftHeight > a4HeightRef) {
              var i = position + a4HeightRef;
              for (i = position + a4HeightRef; i >= position; i--) {
                var isWrite = true;
                for (var j = 0; j < canvas.width; j++) {
                  var c = canvas.getContext("2d").getImageData(j, i, 1, 1).data;

                  if (c[0] !== 0xff || c[1] !== 0xff || c[2] !== 0xff) {
                    isWrite = false;
                    break;
                  }
                }
                if (isWrite) {
                  checkCount++;
                  if (checkCount >= 25) {
                    break;
                  }
                } else {
                  checkCount = 0;
                }
              }
              height =
                Math.round(i - position) || Math.min(leftHeight, a4HeightRef);

              if (height <= 0) {
                height = a4HeightRef;
              }
            } else {
              height = leftHeight;
            }

            canvas1.width = canvas.width;
            canvas1.height = height;
            var ctx = canvas1.getContext("2d");
            ctx.drawImage(
              canvas,
              0,
              position,
              canvas.width,
              height,
              0,
              0,
              canvas.width,
              height
            );

            if (position !== 0) {
              pdf.addPage();
            }
            pdf.addImage(
              canvas1.toDataURL("image/jpeg", 1.0),
              "JPEG",
              0,
              0,
              a4Width,
              (a4Width / canvas1.width) * height
            );
            leftHeight -= height;
            position += height;
            if (leftHeight > 0) {
              createImpl(canvas);
            } else {
              pdf.save(pdfName + ".pdf");
              that.loadingBtnStatus = false;
            }
          }
        }

        // 当内容未超过pdf一页显示的范围，无需分页
        if (leftHeight < a4HeightRef) {
          var pageData = canvas.toDataURL("image/jpeg", 1.0);
          pdf.addImage(
            pageData,
            "JPEG",
            0,
            0,
            a4Width,
            (a4Width / canvas.width) * leftHeight
          );
          pdf.save(pdfName + ".pdf");

          that.loadingBtnStatus = false;
        } else {
          createImpl(canvas);
        }
      });
    },
    copyTemplateFun() {
      this.copyForm.name = "";
      this.copyModlalVisible = true;
    },
    saveTemplateFun() {
      const templateId = this.templateId;
      const name = this.copyForm.name;
      if (!this.copyForm.name) {
        this.$message({
          type: "error",
          message: "请输入模版名称!",
        });
        return;
      }
      addTemplate({ template: templateId, template_name: name }).then((res) => {
        this.copyModlalVisible = false;
        this.$message({
          type: "success",
          message: "保存模版成功!",
        });
        this.getTemplateAndTabTypeListFun();
      });
    },
    closeCopyTemple() {
      this.copyModlalVisible = false;
    },
    addTemplateFun() {
      const chartArr = [];
      this.adStatusItems.map((res) => {
        chartArr.push({
          type: res.enum_value,
          ids: this.drowData[res.enum_value],
        });
      });
      addTemplate(chartArr).then((res) => {
        this.$message({
          type: "success",
          message: "保存模版成功!",
        });
      });
    },
    deleteTemplateFun() {
      this.$confirm(" 确认删除模版吗 ?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          deleteTemplate({ id: this.templateId }).then((res) => {
            this.getTemplateAndTabTypeListFun();
            // this.templateList.forEach((ele, index) => {
            //   if (ele.id === this.templateId) {
            //     this.templateList.splice(index, 1)
            //   }
            // })

            // this.templateId = this.templateList[0].id
            // this.initChartData()
            this.$message({
              type: "success",
              message: "删除成功!",
            });
          });
        })
        .catch(() => {
          // this.$message({
          //   type: 'info',
          //   message: '已取消删除'
          // })
        });
    },
    filterFun(adStatus) {
      this.chartIdArr = [];
      this.ISSUE_STATUS = adStatus;
      this.initData("tab");
    },
    initData(tab) {
      // const ids = this.drowData[this.ISSUE_STATUS]
      if (!tab) {
        this.overViewArr = [{}];
      }

      initPortraitId({
        crmType: this.ISSUE_STATUS,
        template: this.templateId,
      }).then((res) => {
        if (res.data.templateList && res.data.templateList.length > 0) {
          this.templateId = res.data.templateList[0].id;
        }
        if (!tab) {
          this.overViewArr = res.data.overViewList;
        }
        this.chartIdArr = res.data.crmAllIdList;
      });
    },
    getChartDataById(param) {
      return getPortraitInfoById(param);
    },
    hiddenGetChartDataById(param) {
      return getPortraitInfoById(param);
    },
    updateChartDataById(param) {
      return updatePortraitIndex(param);
    },
    changePosition(moveObj) {
      const swapArr = this.swapArr(
        this.chartIdArr,
        moveObj.newIndex,
        moveObj.oldIndex
      );
      const ids = [];
      swapArr.map((item) => {
        ids.push(item.id);
      });
      const param = { ids: ids, template: this.templateId || 1, is_del: "N" };
      updatePortraitIndex(param).then((res) => {
        this.$message({
          type: "success",
          message: "切换位置成功！",
        });
      });
    },
    swapArr(arr, index1, index2) {
      arr[index1] = arr.splice(index2, 1, arr[index1])[0];
      return arr;
    },
    addChartFun() {
      this.modelData = JSON.parse(JSON.stringify(this.drowData));
      this.modelData[this.ISSUE_STATUS] = [];
      this.dialogVisible = true;
      getPortraitList({
        template: this.templateId,
        crmType: this.ISSUE_STATUS,
      }).then((res) => {
        this.allChartList = res.data.portraitList;
      });
    },
    handleClose() {
      this.modelData = {};
      this.dialogVisible = false;
    },
    cancalFun() {
      this.modelData = {};
      this.dialogVisible = false;
    },
    selectImgFun(item, index) {
      this.modelData[this.ISSUE_STATUS].push(item.id);
      // this.modelData = JSON.parse(JSON.stringify(this.drowData))
      // this.drowData[this.ISSUE_STATUS].push(item.id)
    },
    delSelectImgFun(item) {
      const index = this.modelData[this.ISSUE_STATUS].indexOf(item.id);
      this.modelData[this.ISSUE_STATUS].splice(index, 1);
    },
    saveChartFun() {
      // this.drowData = JSON.parse(JSON.stringify(this.modelData))
      if (this.modelData[this.ISSUE_STATUS].length < 1) {
        this.$message({
          message: "请先选择图表",
          type: "error",
        });
        return;
      }
      this.dialogVisible = false;
      const ids = this.modelData[this.ISSUE_STATUS];
      savePortrait({
        ids: ids,
        template: this.templateId,
        crmType: this.ISSUE_STATUS,
      }).then((res) => {
        // this.chartIdArr = res.data.crmAllIdList
        this.initData();
        this.$message({
          message: "已成功添加图表",
          type: "success",
        });
      });
      //   addPortraitInfo({ ids: ids, template: this.templateId, crmType: this.ISSUE_STATUS }).then((res) => {
      //   this.chartIdArr = res.data.crmAllIdList
      //   this.$message({
      //     message: '已成功添加图表',
      //     type: 'success'
      //   })
      // })

      // this.initChartData()
    },
    getLabelTypeFun() {
      getLabelType({
        enum_type: "groupImg",
        enum_type_code: "img_chart_class_type",
      }).then((res) => {
        this.adStatusItems = res.data.enum_code;
        if (this.adStatusItems && this.adStatusItems[0]) {
          this.ISSUE_STATUS = this.adStatusItems[0].enum_value;
        }
      });
    },
    openPeopleFilterModal() {
      this.peopleFilterModalVisible = true;
      this.group_rule = {};
      // 左侧边栏的 进入页面之后。点击人群选择之后，个人模版的筛选条件回显
      if (this.link_resource === "all") {
        if (!this.cookieNewPageJSON) {
          this.getSqlFun();
        } else {
          this.group_rule = JSON.parse(this.cookieNewPageJSON);
        }
      } else if (this.link_resource === "label") {
        // 标签列表跳转时走这个判断
        if (this.portraitConditionCache) {
          this.group_rule = JSON.parse(this.portraitConditionCache);
        }
      }
    },
    // getFilterJsonFun(status) {
    //   // let param = {}
    //   // if (status === 'changeTempCondtionDisable') {
    //   //   param = { template: this.oldTemplateId }
    //   // } else {
    //   //   param = { template: this.templateId }
    //   // }
    //   if (!this.cookieNewPageJSON) {
    //     this.getSqlFun()
    //     // getFilterJSON(param).then((res) => {
    //     //   if (res.data.filterJson) {
    //     //     this.group_rule = JSON.parse(res.data.filterJson)
    //     //   } else {
    //     //     this.group_rule = {}
    //     //   }
    //     //   if (status === 'judgeBtnDisable') {
    //     //     // 从数据库里查询数sqlJson  和  人群选择里面的出来的pageJson 对比
    //     //     this.checkIsNotOrTrueFun(JSON.stringify(this.group_rule), this.crowdFilter)
    //     //   }
    //     //   if (status === 'changeTempCondtionDisable') {
    //     //     console.log(this.crowdFilter)
    //     //     this.checkIsNotOrTrueFun(JSON.stringify(this.group_rule), this.oldPageJSON, status)
    //     //   }
    //     // })
    //   } else {
    //     this.group_rule = this.cookieNewPageJSON
    //   }
    // },
    getSqlFun() {
      // let param = {}
      // if (status === 'changeTempCondtionDisable') {
      //   param = { template: this.oldTemplateId }
      // } else {
      //   param = { template: this.templateId }
      // }
      getFilterJSON({ template: this.templateId }).then((res) => {
        if (res.data.filterJson) {
          this.group_rule = JSON.parse(res.data.filterJson);
        } else {
          this.group_rule = {};
        }
        // if (status === 'judgeBtnDisable') {
        //   // 从数据库里查询数sqlJson  和  人群选择里面的出来的pageJson 对比
        //   this.checkIsNotOrTrueFun(JSON.stringify(this.group_rule), this.crowdFilter)
        // }
        // if (status === 'changeTempCondtionDisable') {
        //   console.log(this.crowdFilter)
        //   this.checkIsNotOrTrueFun(JSON.stringify(this.group_rule), this.oldPageJSON, status)
        // }
      });
    },
    confirmPeopleFilter() {
      this.$refs["groupFilter"].validateJoinAndFork().then(() => {
        this.group_rule = this.$refs["groupFilter"].getFilterJson();
        // todo ...
        // 受众列表进入的时，不会有人群选择按钮，不会进入此方法。 标签列表进入时和  all 当是侧边栏的页面进入时
        this.crowdFilter = JSON.stringify(this.group_rule);
        if (this.link_resource === "all") {
          // 清空会员总览 session
          sessionStorage.clear();
          // 个人模版的时候，把筛选条件保存到模版里面
          // this.addFilterJSONFun()
          // this.oldPageJSON = this.crowdFilter
          // 从数据库里查询数sqlJson  和  人群选择里面的出来的pageJson 对比
          this.cookieNewPageJSON = JSON.stringify(this.group_rule);
          // setToken('cookieNewPageJSON', JSON.stringify(this.group_rule))
          this.judgeBtnDisableFun("judgeBtnDisable");
        } else if (this.link_resource === "label") {
          // 用作 缓存选中的条件
          this.portraitConditionCache = JSON.stringify(this.group_rule);
        }
        // 重新渲染图表
        this.initChartData();
        this.peopleFilterModalVisible = false;
      });
    },
    addFilterJSONFun(status) {
      // 个人模版的时候，把筛选条件保存到模版里面
      let param = {};
      if (this.cookieNewPageJSON) {
        param = { filterJson: this.cookieNewPageJSON };
      }

      // if (status === 'changeTempCondtionDisable') {
      //   param.template = this.oldTemplateId
      // } else {
      //   param.template = this.templateId
      // }
      param.template = this.templateId;
      addFilterJSON(param).then((res) => {
        // this.oladdFilterJSONdPageJSON = ''
        this.cookieNewPageJSON = "";
        this.condtionSaveDisable = true;
        this.$message({
          type: "success",
          message: "保存成功!",
        });
        // setToken('cookieNewPageJSON', '')
      });
    },
    judgeBtnDisableFun(status) {
      let param = {};
      if (status === "changeTempCondtionDisable") {
        param = { template: this.oldTemplateId };
      } else {
        param = { template: this.templateId };
      }
      getFilterJSON(param).then((res) => {
        if (res.data.filterJson) {
          this.group_rule = JSON.parse(res.data.filterJson);
        } else {
          this.group_rule = {};
        }
        // console.log(this.cookieNewPageJSON)
        if (status === "judgeBtnDisable") {
          // console.log(this.cookieNewPageJSON)
          // 从数据库里查询数sqlJson  和  人群选择里面的出来的pageJson 对比
          this.checkIsNotOrTrueFun(
            JSON.stringify(this.group_rule),
            this.cookieNewPageJSON
          );
        }
        if (status === "changeTempCondtionDisable") {
          this.checkIsNotOrTrueFun(
            JSON.stringify(this.group_rule),
            this.cookieNewPageJSON,
            status
          );
        }
      });
    },
    checkIsNotOrTrueFun(sqlJSON, pageJSON, changeTempCondtionDisable) {
      checkIsNotOrTrue({ sqlJSON: sqlJSON, pageJSON: pageJSON }).then((res) => {
        if (res.data.isNotOrTrue === true) {
          this.condtionSaveDisable = true;
          this.cookieNewPageJSON = "";
        } else {
          // this.cookieNewPageJSON = pageJSON
          // setToken('cookieNewPageJSON', pageJSON)
          this.condtionSaveDisable = false;
          //  切换模版之前，比较 两者json ， 不同 就给弹框
          if (changeTempCondtionDisable === "changeTempCondtionDisable") {
            this.openTipFun();
          }
        }
      });
    },

    // 最初逻辑的缓存
    visibleChange() {
      let Boolean = false;
      this.adStatusItems.map((res) => {
        if (this.drowData[res.enum_value].length > 0) {
          Boolean = true;
        }
      });
      if (Boolean) {
        this.$confirm("此操作将会清除刚刚添加的图表, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(() => {
            this.adStatusItems.map((res) => {
              this.drowData[res.enum_value] = [];
            });
          })
          .catch(() => {});
      }
    },
  },
};
</script>
<style lang="less" scoped>
.crmGroupPortraint {
  .crmGroupPortraintBox {
    .el-form-item--small .el-form-item__error {
      width: 150%;
    }
  }
  .el-loading-spinner {
    top: 30%;
  }
  .el-loading-spinner i {
    font-size: 35px;
  }
  .el-icon-loading {
    top: 20%;
    font-weight: 550;
  }
}
.el-dialog__body {
  padding: 10px 20px;
}
.crmGroupPortraint {
  padding: 15px;
  .crmGroupPortraintBox {
    position: relative;
    background: #ffffff;
    padding: 10px;
    .delStyle {
      font-size: 12px;
      color: red;
    }
    .el-icon-user {
      font-size: 50px;
      color: #61acee;
    }
    .chartsBoxTop {
      min-height: 600px;
      position: relative;
    }
    .filter-btns {
      margin: 10px 0 20px 0;
    }
    .filter-btns ul li {
      padding: 0 15px;
    }
    .fontColorStyle {
      color: #97a8be;
    }
    .el-checkbox-group {
      display: inline-block;
    }
    .conditons {
      margin: 10px 0;
    }
    .condtionStyle {
      height: 30px;
      line-height: 30px;
    }
    .FilterStyle {
      display: flex;
      justify-content: flex-end;
    }
    .chartAnalysis {
      margin-top: 20px;
    }
  }
  .imgBox {
    width: 100%;
    height: 300px;
    overflow-y: scroll;
    position: relative;
    .el-col {
      text-align: center;
      .imgIconItem {
        margin-bottom: 10px;
        position: relative;
        display: inline-block;
        height: 130px;
        width: 100%;
        border: 1px solid #97a8be;
        text-align: center;
        .title {
          margin-top: 5px;
        }
        .el-icon-document-add {
          position: absolute;
          top: 0;
          right: 0;
          color: #3c5175;
          font-size: 22px;
          cursor: pointer;
        }
        .maskBox {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.4);
        }
        .el-icon-document-remove {
          position: absolute;
          top: 0;
          right: 0;
          color: red;
          font-size: 22px;
          z-index: 900;
          cursor: pointer;
        }
      }
    }
  }
  .header-title {
    height: 31px;
    border-bottom: 1px solid #c0c0c0;
  }
  .header-title:before {
    content: "";
    width: 4px;
    height: 16px;
    background-color: #3c5175;
    display: inline-block;
    position: absolute;
  }
  .title-name {
    padding-left: 15px;
  }
  .boxss {
    border: 1px solid red;
    height: 100px;
  }
}

.titleStyle {
  position: relative;
  padding-top: 18px;
  padding-bottom: 10px;
  padding-left: 10px;
  font-size: 20px;
  &:before {
    content: "";
    position: absolute;
    top: 24px;
    left: 0;
    width: 2px;
    height: 12px;
    background-color: #3c5175;
  }
}
.hiddenBox {
  padding: 0 10px;
  width: 1000px;
  position: fixed;
  left: 0;
  top: 100000px;
  background: #fff;
  z-index: -1;
}
</style>
