<template>
  <div class="jsplumb-activity-content">
    <!-- activity 主体信息 -->
    <activity-main-setting
      v-if="$route.query.create_type === 'activity'"
      ref="activityMainSetting"
      @activityInfoDataLoaded="activityInfoDataLoadedHandler"
      @toggleMainInfo="toggleMainInfo"
    />

    <!-- 模版主体信息 -->
    <templateMainSetting
      v-if="$route.query.create_type === 'template'"
      ref="templateMainSetting"
      @activityInfoDataLoaded="activityInfoDataLoadedHandler"
      @toggleMainInfo="toggleMainInfo"
    />
    <div ref="flowAreaPageContainer" class="page-container">
     <el-scrollbar
        ref="elScrollbar"
        class="el-scrollbar-page"
        style="width: 100%; height: 100%"
      >
      <!-- 侧边栏组件 -->
      <div
        v-show="
          ($route.query.id || activityInfo.id) &&
          (actionType === 'add' || actionType === 'edit')
        "
        :class="[sideMarketStatus === 'open' ? 'open-menu' : 'close-menu']"
        class="side-market-menu"
      >
        <sidebar-market
          :side-market-menus="sideMarketMenus"
          class="side-wrap"
        />
        <div
          :class="[
            sideMarketStatus === 'open'
              ? 'el-icon-arrow-left'
              : 'el-icon-arrow-right',
          ]"
          class="side-close-wrap"
          @click="toggleSideMarketMenu"
        />
      </div>
      <div>
        <!-- 查看模版页面，模版提示信息 -->
        <template-info-tip
          v-if="
            $route.query.create_type === 'template' && actionType === 'view'
          "
        />
        <!-- 画布区域 -->
        <flow-area
          id="canvas"
          ref="flowArea"
          :flow-data="flowData"
          :style="flowAreaStyle"
          class="jsplumb-container"
          style="position: relative"
        />
      </div>
      <!-- 活动操作按钮 -->
      <div
        v-if="$route.query.create_type === 'activity'"
        :style="{ left: sidebar.opened ? '230px' : '50px' }"
        class="action-bottom-wrap"
      >
        <el-button
          v-if="
            (actionType === 'add' || actionType === 'edit') &&
            ($route.query.id || activityInfo.id)
          "
          size="mini"
          type="primary"
          @click="saveAndSubmitActivityInfo"
          >保存并提交</el-button
        >
        <el-button
          v-if="actionType === 'add' || actionType === 'edit'"
          size="mini"
          @click="saveActivityInfo"
          >保存</el-button
        >
        <el-button
          v-if="actionType === 'audit' && ($route.query.id || activityInfo.id)"
          size="mini"
          type="primary"
          @click="openAuditModal"
          >审核</el-button
        >
        <el-button size="mini" @click="goBackActivityList">返回列表</el-button>
      </div>

      <!-- 模版操作按钮 -->
      <div
        v-if="$route.query.create_type === 'template'"
        :style="{ left: sidebar.opened ? '230px' : '50px' }"
        class="action-bottom-wrap"
      >
        <el-button
          v-if="actionType === 'add' || actionType === 'edit'"
          :disabled="!$route.query.id && !activityInfo.id"
          size="mini"
          type="primary"
          @click="checkAndSaveTemplateInfo"
          >启用模版</el-button
        >
        <el-button
          v-if="actionType === 'add' || actionType === 'edit'"
          size="mini"
          @click="saveTemplateInfo"
          >保存</el-button
        >
        <el-button
          v-if="actionType === 'view'"
          :disabled="activityInfo.templateIsValid === 'N'"
          size="mini"
          type="primary"
          @click="createActivityByTemplate"
          >使用模版</el-button
        >
        <el-button size="mini" @click="goBackTemplateList">返回列表</el-button>
      </div>
    </el-scrollbar>
    </div>

    <!-- 查看活动审核提示信息 -->
    <div
      v-if="
        $route.query.create_type === 'activity' &&
        actionType === 'view' &&
        activityInfo.auditMsg &&
        activityInfo.auditMsg.auditUser
      "
      :style="{ left: sidebar.opened ? '246px' : '50px' }"
      class="message-wrap"
    >
      <div class="message-info">
        <span>审核结果：{{ activityInfo.auditMsg.auditStatus }}</span>
        <span>审核意见：{{ activityInfo.auditMsg.auditContent }}</span>
        <span>审核人：{{ activityInfo.auditMsg.auditUser }}</span>
        <span>审核时间：{{ activityInfo.auditMsg.auditTime }}</span>
      </div>
    </div>

    <!-- 节点组件弹窗统一modal -->
    <el-dialog
      :visible.sync="openComModal"
      :close-on-click-modal="false"
      width="1000px"
      top="50px"
    >
      <div slot="title" class="label-title">
        <i class="linev-tip" /><span class="label-desc">{{
          curComConfig && curComConfig.label
        }}</span>
      </div>
      <component
        v-if="openComModal"
        ref="comSetting"
        :is="curComConfig.name"
        :cur-com-config="curComConfig"
        :action-type="actionType"
      />
      <div slot="footer" class="dialog-footer">
        <el-button
          v-if="curComConfig.name === 'peopleFilter'"
          @click="caculatorPeople"
          >计算人数</el-button
        >
        <el-button @click="closeComponentModal">取 消</el-button>
        <el-button
          v-if="actionType == 'add' || actionType == 'edit'"
          :loading="componentActionDoing"
          type="primary"
          @click="confirmComHandler"
          >确 定</el-button
        >
      </div>
    </el-dialog>

    <el-dialog
      :visible.sync="auditModalVisible"
      :close-on-click-modal="false"
      title="营销审核"
      width="500px"
      top="50px"
    >
      <el-form
        ref="auditForm"
        :model="auditModalForm"
        :rules="auditModalRule"
        label-width="80px"
        width="500"
      >
        <el-form-item label="审核状态" prop="auditStatus">
          <el-radio-group v-model="auditModalForm.auditStatus">
            <el-radio label="agree">审核通过</el-radio>
            <el-radio label="reject">审核不通过</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="审核意见" prop="auditContent">
          <el-input
            v-model="auditModalForm.auditContent"
            :rows="3"
            type="textarea"
            maxlength="200"
            placeholder="请简要填写审核意见或修改建议"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeAuditMarketing">取 消</el-button>
        <el-button type="primary" @click="auditMarketingActivity"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { debounce } from "@/utils/index";
import { mapState } from "vuex";
// 侧边栏按钮控制
// import sideMenuMap, { flowConfig } from './conf'
import { flowConfig } from "./conf";
// 获取侧边栏组件资源
import { listAssemblyResourceByUser } from "@/api/markting/marketing";
import {
  auditMarketingActivity,
  confirmUse,
  thirdConfirmUse,
} from "@/api/markting/marketing";

// 侧边栏组件
import sidebarMarket from "./sidebarMarket";
// 主体信息组件
import activityMainSetting from "./activityMainSetting";
// 模版主体信息
import templateMainSetting from "./templateMainSetting";
// 画布组件
import FlowArea from "./flowArea";

// import { jsPlumb, jsPlumbUtil, jsBezier, Mottle, Katavorio, Biltong } from 'jsplumb'
import { jsPlumb } from "jsplumb";
import Draggable from "@shopify/draggable/lib/draggable";

import {
  getPosition,
  getNodeData,
  removePlumbNode,
  getNodeChildrenData,
  nodeGap,
  getCurNodeNextNodes,
  hideComponentsMap,
  getNodeInfoByNodeId,
  getPreviousEventNodesInfo,
  getNextChildNodeIds,
  generateNodeItemMap,
} from "./util";

import emitter from "element-ui/src/mixins/emitter";
// 画布组件
import eventSelect from "./coms/eventSelect";
import peopleFilter from "./coms/peopleFilter";
import wxTemplateMsg from "./coms/wxTemplateMsg";
import appPush from "./coms/appPush";
import phoneSms from "./coms/phoneSms";
import phoneMms from "./coms/phoneMms";
import email from "./coms/email";
import wxNews from "./coms/wxNews";
import eventJudge from "./coms/eventJudge";
import crossCoupon from "./coms/crossCoupon";
import coupon from "./coms/coupon";
import abTest from "./coms/abTest";
import timePicker from "./coms/timePicker";
import delayTime from "./coms/delayTime";
import metric from "./coms/metric";

import templateInfoTip from "./templateInfoTip";
// 事件id  事件判断&事件选择这里会产生id
// 筛选器添加针对对象id
// 周期营销活动  没有abTest组件 周期的时间可能小于abTest等待时间

export default {
  name: "MarketingSetting",
  componentName: "MarketingSetting",
  components: {
    sidebarMarket,
    activityMainSetting,
    templateMainSetting,
    FlowArea,
    eventSelect,
    peopleFilter,
    wxTemplateMsg,
    eventJudge,
    crossCoupon,
    coupon,
    abTest,
    timePicker,
    delayTime,
    appPush,
    phoneSms,
    phoneMms,
    email,
    wxNews,
    metric,
    templateInfoTip,
  },
  mixins: [emitter],
  provide() {
    return {
      flowChartMap: this,
    };
  },
  data() {
    return {
      sideMarketMenus: [],
      type: "sideMarketMenus",

      // 组件侧边栏展开收起状态
      sideMarketStatus: "open",

      // jsPlumb 实例
      plumb: null,

      // 画布数据
      flowData: {
        // 节点数据
        nodeItems: [],
        // 连线数据
        linkItems: [],
      },
      nodeDataTemplate: {
        icon: "", // 节点图标
        component: "", // 节点组件名称
        name: "", // 节点名称同节点组件名称
        label: "", // 节点描述
        id: "", // 节点ID
        x: "", // 节点x坐标
        y: "", // 节点y坐标
        parentId: "",
        initDefaultNode: false,
      },
      openComModal: false,
      curComConfig: {},
      curActivedNode: {},
      // 侧边栏高亮组件表示，下一个可以跟随的节点
      mapNodeTypeChildren: {},
      //
      activityInfo: {},

      queryParams: this.$route.query,
      // 审核营销活动弹窗
      auditModalVisible: false,
      auditModalRule: {
        auditContent: [
          {
            message: "请简要填写审核意见或修改建议",
            trigger: "change",
            required: true,
          },
        ],
        auditStatus: [
          {
            message: "请选择审核状态",
            trigger: "change",
            required: true,
          },
        ],
      },
      auditModalForm: {
        auditContent: "",
        auditStatus: "agree",
      },
      sceneIdMap: {},
      loadedMenu: false,
      fiveMinAutoSaveTimer: null,

      actionType: this.$route.query.action_type,
      componentActionDoing: false,
      // 构造营销活动对象动作MAP集合
      marketTargetActions: {
        member_id: [],
        wx_openid: ["wxNews", "wxTemplateMsg"],
        app_openid: [],
      },
      sceneIdCategoryMap: {},
    };
  },
  computed: {
    ...mapState({
      sidebar: (state) => state.app.sidebar,
    }),
    flowAreaStyle() {
      var nodeItems = this.flowData.nodeItems;
      var maxPosX = 0;
      var maxPosY = 0;

      if (nodeItems.length) {
        for (var i = 0; i < nodeItems.length; i++) {
          if (nodeItems[i].x > maxPosX) {
            maxPosX = nodeItems[i].x;
          }
          if (nodeItems[i].y > maxPosY) {
            maxPosY = nodeItems[i].y;
          }
        }
      }

      return {
        "min-width": maxPosX + 180 < 1020 ? "1020px" : maxPosX + 200 + "px",
        height: maxPosY + 200 < 900 ? "900px" : maxPosY + 200 + "px",
      };
    },
    plumbEndNodes() {
      var nodeItems = this.flowData.nodeItems;
      var linkItems = this.flowData.linkItems;
      // 将list[节点对象, 节点对象] 转换成map {节点ID1:节点对象1, 节点ID2:节点对象2}

      var nodeItemMap = generateNodeItemMap(nodeItems);
      var plumbEndNodes = [];

      function validateNode(nodeItem) {
        var nextChildNodeIds = getNextChildNodeIds(nodeItem, linkItems);
        var j;
        var curNode;
        var abTestLevel2NodeIds = [];
        var metricNode;

        if (nextChildNodeIds.length) {
          if (nodeItem.name === "abTest") {
            for (j = 0; j < nextChildNodeIds.length; j++) {
              curNode = nodeItemMap[nextChildNodeIds[j]];
              // 如果是分支多动作，则将第二级动作节点id 保存下来，继续做abTest节点数据有效性校验
              if (nodeItem.nodeConf.branchMulNode === "Y") {
                abTestLevel2NodeIds = abTestLevel2NodeIds.concat(
                  getNextChildNodeIds(curNode, linkItems)
                );
              }
            }

            if (nodeItem.nodeConf.branchMulNode !== "Y") {
              metricNode =
                nodeItemMap[
                  getNextChildNodeIds(
                    nodeItemMap[nextChildNodeIds[0]],
                    linkItems
                  )[0]
                ];
              return validateNode(metricNode);
            } else {
              metricNode =
                nodeItemMap[
                  getNextChildNodeIds(
                    nodeItemMap[abTestLevel2NodeIds[0]],
                    linkItems
                  )[0]
                ];
              return validateNode(metricNode);
            }
          } else if (nodeItem.name === "eventSelect") {
            if (nextChildNodeIds.length) {
              for (j = 0; j < nextChildNodeIds.length; j++) {
                curNode = nodeItemMap[nextChildNodeIds[j]];
                validateNode(curNode);
              }
            }
          } else if (nodeItem.name === "eventJudge") {
            for (j = 0; j < nextChildNodeIds.length; j++) {
              curNode = nodeItemMap[nextChildNodeIds[j]];
              validateNode(curNode);
            }
          } else {
            for (j = 0; j < nextChildNodeIds.length; j++) {
              curNode = nodeItemMap[nextChildNodeIds[j]];
              validateNode(curNode);
            }
          }
        } else {
          plumbEndNodes.push(nodeItem);
        }
      }

      validateNode(nodeItems[0]);

      return plumbEndNodes;
    },
  },
  created() {
    this.auditMarketingActivity = debounce(this.auditMarketingActivity, 300, {
      trailing: false,
    });
    // this.sideMarketMenus = sideMenuMap[this.type]

    // 接口暂无数据
    listAssemblyResourceByUser().then((res) => {
      this.sceneIdCategoryMap = res.data.sceneIdCategoryMap;
      var sideMarketMenus = res.data.list;
      var i;
      var j;
      var menuComponents;

      // 获取动作场景id
      for (i = 0; i < sideMarketMenus.length; i++) {
        if (sideMarketMenus[i].type === "conditionDetermine") {
          if (this.$route.query.marketing_type === "period") {
            menuComponents = sideMarketMenus[i].children;
            for (j = 0; j < menuComponents.length; j++) {
              if (menuComponents[j].component === "abTest") {
                menuComponents.splice(j, 1);
                break;
              }
            }
          }
        } else if (sideMarketMenus[i].type === "marketAction") {
          // 动作时获取场景id
          menuComponents = sideMarketMenus[i].children;
          for (j = 0; j < menuComponents.length; j++) {
            if (
              menuComponents[j].component === "phoneSms" ||
              menuComponents[j].component === "phoneMms" ||
              menuComponents[j].component === "email" ||
              menuComponents[j].component === "wxTemplateMsg" ||
              menuComponents[j].component === "appPush"
            ) {
              this.sceneIdMap[menuComponents[j].component] =
                menuComponents[j].sceneId;
            }

            if (menuComponents[j].personid_type) {
              if (this.marketTargetActions[menuComponents[j].personid_type]) {
                this.marketTargetActions[menuComponents[j].personidType].push(
                  menuComponents[j].component
                );
              }

              // member_id 加入所有动作
              this.marketTargetActions.member_id.push(
                menuComponents[j].component
              );
            }
          }
        }
      }

      this.sideMarketMenus = sideMarketMenus;
      this.loadedMenu = true;
    });
  },
  mounted() {
    // 临时优化，scrollBehavior 不OK（后面看看那能不能更好的解决）
    // 解决报错问题
    // document.getElementsByClassName('app-main')[0].scrollTop = 0
    this.initJsPlumb();

    this.initNodeItemHandler();
    // 每5min中做一次自动保存
    if (this.actionType === "edit") {
      this.init5MinsSaveActivityInfo();
    }
  },
  destroyed() {
    window.clearTimeout(this.fiveMinAutoSaveTimer);
  },
  methods: {
    toggleMainInfo() {
      this.autoJsplumbScrollbar();
      this.$refs.sideWrap.update();
    },
    autoJsplumbScrollbar() {
      if (this.$el && this.$refs && this.$refs.flowAreaPageContainer) {
        var jsplumbActivityContent = this.$el.parentNode.getBoundingClientRect();
        var flowAreaPageContainer = this.$refs.flowAreaPageContainer.getBoundingClientRect();

        this.flowAreaPageContainer = {
          width: jsplumbActivityContent.width - 30,
          height: document.body.clientHeight - flowAreaPageContainer.top - 50,
        };

        this.$refs["flowAreaPageContainer"].style.width =
          this.flowAreaPageContainer.width + "px";
        this.$refs["flowAreaPageContainer"].style.height =
          this.flowAreaPageContainer.height + "px";

        // 更新滚动条
        this.$refs["elScrollbar"].update();
      }
    },
    init5MinsSaveActivityInfo() {
      var that = this;
      window.clearTimeout(that.fiveMinAutoSaveTimer);
      that.fiveMinAutoSaveTimer = setTimeout(function () {
        if (that.queryParams.create_type === "activity") {
          that.saveActivityInfo();
        } else {
          that.saveTemplateInfo();
        }
        that.init5MinsSaveActivityInfo();
      }, 5 * 60 * 1000);
    },
    activityInfoDataLoadedHandler(activityInfoData) {
      console.log(activityInfoData, "activityInfoData");
      this.activityInfo = activityInfoData;
      if (
        this.activityInfo.marketingContent &&
        typeof this.activityInfo.marketingContent === "string"
      ) {
        var flowData, tempFlowData;

        try {
          flowData = JSON.parse(this.activityInfo.marketingContent);
        } catch (err) {
          console.log(err);
        }

        if (flowData) {
          if (
            {}.toString.call(flowData.nodeItems) === "[object Array]" &&
            {}.toString.call(flowData.linkItems) === "[object Array]"
          ) {
            this.flowData = flowData;
          } else {
            tempFlowData = {
              nodeItems: flowData.nodeItems || [],
              linkItems: flowData.linkItems || [],
            };
            this.flowData = tempFlowData;
          }
        }
      }
      // todo... render jsplumb
      this.initJsPlumbNodes();
    },
    toggleSideMarketMenu() {
      this.sideMarketStatus =
        this.sideMarketStatus === "open" ? "close" : "open";
    },
    canDoNext(componentName) {
      var mapNodeTypeChildren = this.mapNodeTypeChildren;
      for (var attr in mapNodeTypeChildren) {
        for (var i = 0; i < mapNodeTypeChildren[attr].length; i++) {
          if (mapNodeTypeChildren[attr][i].component === componentName) {
            return true;
          }
        }
      }

      return false;
    },
    initSidebarComItemDrag() {
      const draggable = new Draggable(document.querySelectorAll(".side-wrap"), {
        draggable: ".com-icon-item",
      });

      let dragTarget = false;
      var canvas = document.getElementById("canvas");
      var dragTargetPos = {
        screenX: null,
        screenY: null,
      };

      var dragStartPos = {
        screenX: null,
        screenY: null,
      };

      draggable.on("drag:start", (e) => {
        if (this.curActivedNode && this.curActivedNode.name) {
          const comName = e.data.originalSource.getAttribute("com-name");

          if (!this.canDoNext(comName)) {
            e.cancel();
            this.$message({
              type: "error",
              message: "请选择正确的组件",
            });
            return;
          }

          if (this.queryParams.create_type === "activity") {
            // ... 活动侧边组件拖动之前检测节点合法性
            if (!this.$refs["activityMainSetting"].sideDragValidate()) {
              e.cancel();
              return;
            }
          } else {
            // ... 活动侧边组件拖动之前检测节点合法性
            if (!this.$refs["templateMainSetting"].sideDragValidate()) {
              e.cancel();
              return;
            }
          }

          var pos = getPosition(e.data.source);
          // 鼠标点击位置相对元素左上角偏移位置
          dragStartPos.screenX =
            e.data.sensorEvent.data.originalEvent.clientX - pos.left;
          dragStartPos.screenY =
            e.data.sensorEvent.data.originalEvent.clientY - pos.top;
        } else {
          e.cancel();
          this.$message({
            type: "error",
            message: "请选中画布分支结束节点",
          });
        }
      });

      draggable.on("drag:move", (e) => {
        if (e.data.sensorEvent.data.target === canvas) {
          dragTarget = true;
          dragTargetPos.screenX = e.data.sensorEvent.data.originalEvent.clientX;
          dragTargetPos.screenY = e.data.sensorEvent.data.originalEvent.clientY;
        } else {
          dragTarget = false;
          dragTargetPos.screenX = e.data.sensorEvent.data.originalEvent.clientX;
          dragTargetPos.screenY = e.data.sensorEvent.data.originalEvent.clientY;
        }
      });

      draggable.on("drag:stop", (e) => {
        if (e.data.originalSource && dragTarget) {
          const comName = e.data.originalSource.getAttribute("com-name");

          var pos = getPosition(canvas);
          var remainderX =
            (dragTargetPos.screenX - pos.left - dragStartPos.screenX) % 10;
          var remainderY =
            (dragTargetPos.screenY - pos.top - dragStartPos.screenY) % 10;
          var merchantX = Math.floor(
            (dragTargetPos.screenX - pos.left - dragStartPos.screenX) / 10
          );
          var merchantY = Math.floor(
            (dragTargetPos.screenY - pos.top - dragStartPos.screenY) / 10
          );
          var x, y;

          if (remainderX > 5) {
            x = (merchantX + 1) * 10;
          } else {
            x = merchantX * 10;
          }
          if (remainderY > 5) {
            y = (merchantY + 1) * 10;
          } else {
            y = merchantY * 10;
          }

          // 将节点数据合并到模版数据，模版数据
          var copyTempNodeData = {
            ...this.nodeDataTemplate,
            id: this.getUuid(),
            x: x, // 节点x坐标
            y: y, // 节点y坐标
            nodeConf: {},
          };

          var nodeData = Object.assign(copyTempNodeData, getNodeData(comName));

          this.flowData.nodeItems.push(nodeData);
          if (nodeData.name === "eventJudge") {
            this.createEventJudeNodes(nodeData);
            this.setActiveNodeHandler({});
          } else {
            this.setActiveNodeHandler(nodeData);
          }
        }
      });
    },
    initJsPlumb() {
      this.plumb = jsPlumb.getInstance(flowConfig.jsPlumbInsConfig);

      // target point 不允许拖动target point 释放连线
      this.plumb.importDefaults({
        ConnectionsDetachable: flowConfig.jsPlumbConfig.conn.isDetachable,
      });

      this.plumb.bind("connection", (conn, e) => {
        // 检测flowData.linkItems 是否含了conn
        if (!this.checkLinkItemHasExist(conn)) {
          const o = {};
          o.type = "link";
          o.id = this.getUuid();
          o.sourceId = conn.sourceId;
          o.targetId = conn.targetId;
          this.flowData.linkItems.push(o);
        }

        this.setConnLabel(conn.connection);

        /**
         * 如果存在链接之后就将端点disabled
         */
        this.plumb
          .getEndpoint(conn.sourceId + "BottomCenter")
          .setEnabled(false);
        this.plumb.getEndpoint(conn.targetId + "TopCenter").setEnabled(false);

        if (this.actionType !== "add" && this.actionType !== "edit") {
          this.plumb
            .getEndpoint(conn.targetId + "BottomCenter")
            .setEnabled(false);
        }
      });

      this.plumb.bind("connectionDetached", (conn) => {
        this.plumb.getEndpoint(conn.sourceId + "BottomCenter").setEnabled(true);
      });

      this.plumb.bind("beforeDrop", (conn) => {
        var nodeItems = this.flowData.nodeItems;
        var nodeItemMap = generateNodeItemMap(nodeItems);
        var childrenTypeMapNodes = getNodeChildrenData(
          nodeItemMap[conn.sourceId].name
        );
        for (var i = 0; i < childrenTypeMapNodes.length; i++) {
          for (var j = 0; j < childrenTypeMapNodes[i].children.length; j++) {
            if (
              childrenTypeMapNodes[i].children[j].name ===
              nodeItemMap[conn.targetId].name
            ) {
              this.dropSuccessDoNext(conn.sourceId);
              return true;
            }
          }
        }
        return false;
      });
    },
    dropSuccessDoNext(sourceNodeId) {
      // nextTick 等待computed执行之后在做处理
      this.$nextTick(() => {
        if (!this.plumbEndNodes.some((item) => item.id === sourceNodeId)) {
          this.setActiveNodeHandler({});
        }
      });
    },
    /**
     * 设置连线label
     */
    setConnLabel(connection) {
      var label = this.getConnLabel(connection);

      if (label) {
        connection.setLabel({
          label: label,
          cssClass: "transformLabel aLabel",
          location: 1,
        });
      }
    },
    /**
     * 获取连线label
     */
    getConnLabel(connection) {
      var sourceId = connection.sourceId;
      var targetId = connection.targetId;
      var nodeItems = this.flowData.nodeItems;
      var matchedNodeItem, i;
      // 获取匹配的节点
      for (i = 0; i < nodeItems.length; i++) {
        if (nodeItems[i].id === sourceId) {
          matchedNodeItem = nodeItems[i];
        }
        if (nodeItems[i].id === targetId) {
          if (!nodeItems[i].parentId) {
            nodeItems[i].parentId = sourceId;
          }
        }
      }
      // 根据节点推断，连线上内容
      if (matchedNodeItem) {
        if (matchedNodeItem.name === "eventSelect") {
          for (i = 0; i < matchedNodeItem.nodeConf.branches.length; i++) {
            if (
              matchedNodeItem.nodeConf.branches[i].branchid ===
              connection.targetId
            ) {
              return matchedNodeItem.nodeConf.branches[i].branch_name;
            }
          }
        } else if (matchedNodeItem.name === "eventJudge") {
          if (
            matchedNodeItem.nodeConf.action_true_nodeId === connection.targetId
          ) {
            return "是";
          }
          if (
            matchedNodeItem.nodeConf.action_false_nodeId === connection.targetId
          ) {
            return "否";
          }
        } else if (matchedNodeItem.name === "abTest") {
          for (i = 0; i < matchedNodeItem.nodeConf.actions_ABtest.length; i++) {
            if (
              matchedNodeItem.nodeConf.actions_ABtest[i].id ===
              connection.targetId
            ) {
              return matchedNodeItem.nodeConf.actions_ABtest[i].desc;
            }
          }
        }
      }

      return "";
    },
    /**
     * 检测flowData.linkItems 是否已经包含conn
     */
    checkLinkItemHasExist(conn) {
      var linkItems = this.flowData.linkItems;
      for (var i = 0; i < linkItems.length; i++) {
        if (
          linkItems[i].sourceId === conn.sourceId &&
          linkItems[i].targetId === conn.targetId
        ) {
          return true;
        }
      }

      return false;
    },
    /**
     * 打开组件弹框
     */
    openModalHandler(nodeItemData) {
      console.log('nodeItemData',nodeItemData)
      this.curComConfig = nodeItemData;
      this.openComModal = true;
    },
    setActiveNodeHandler(nodeItemData, $event) {
      // ..todo
      var i;
      var j;
      var mapNodeTypeChildren = {};
      if (!this.activityInfo.marketingTemplateDefId) {
        if (
          !this.curActivedNode.name ||
          this.curActivedNode.id !== nodeItemData.id
        ) {
          this.curActivedNode = nodeItemData;
          if (this.curActivedNode && this.curActivedNode.name) {
            var nodeChildren = getNodeChildrenData(this.curActivedNode.name);
            var marketing_type = this.$route.query.marketing_type;

            /**
             * 周期性营销不允许有abTest
             */
            if (marketing_type === "period") {
              for (i = 0; i < nodeChildren.length; i++) {
                for (j = 0; j < nodeChildren[i].children.length; ) {
                  if (nodeChildren[i].children[j].component === "abTest") {
                    nodeChildren[i].children.splice(j, 1);
                  } else {
                    j++;
                  }
                }
              }
            }

            var previousEventNodesInfo = getPreviousEventNodesInfo(
              this.curActivedNode,
              this.flowData.nodeItems
            );

            /**
             * 有事件选择，事件分支时，不允许有图文素材
             */
            if (previousEventNodesInfo.previousEventNodes.length) {
              for (i = 0; i < nodeChildren.length; i++) {
                for (j = 0; j < nodeChildren[i].children.length; ) {
                  if (nodeChildren[i].children[j].component === "wxNews") {
                    nodeChildren[i].children.splice(j, 1);
                  } else {
                    j++;
                  }
                }
              }
            }

            /** 继续过滤
             * 营销对象是关注者时，目前动作微信模版，图文素材
             */

            var marketing_target = this.$route.query.marketing_target;

            if (
              previousEventNodesInfo.previousEventNodes &&
              previousEventNodesInfo.previousEventNodes.length
            ) {
              if (
                previousEventNodesInfo.idtype_group.indexOf("member_id") > -1
              ) {
                marketing_target = "member_id";
              }
            }

            /**
             * 营销对象为wx_openid || app_openid时，需要过滤动作组件
             */
            for (i = 0; i < nodeChildren.length; i++) {
              if (
                marketing_target === "wx_openid" ||
                marketing_target === "app_openid"
              ) {
                if (nodeChildren[i].type === "marketAction") {
                  for (j = 0; j < nodeChildren[i].children.length; ) {
                    if (
                      this.marketTargetActions[marketing_target].indexOf(
                        nodeChildren[i].children[j].component
                      ) === -1
                    ) {
                      nodeChildren[i].children.splice(j, 1);
                    } else {
                      j++;
                    }
                  }
                }
              }
            }

            /**
             * 继续过滤
             * 根据组件资源菜单过滤权限
             */
            for (i = 0; i < nodeChildren.length; i++) {
              var sideMarketMenus = this.getSideMarketMenusByType(
                nodeChildren[i].type
              );
              for (j = 0; j < nodeChildren[i].children.length; ) {
                if (
                  !this.checkNextNodeIsExistSideMenu(
                    nodeChildren[i].children[j].component,
                    sideMarketMenus
                  )
                ) {
                  nodeChildren[i].children.splice(j, 1);
                } else {
                  j++;
                }
              }

              if (nodeChildren[i].children.length) {
                mapNodeTypeChildren[nodeChildren[i].type] =
                  nodeChildren[i].children;
              }
            }

            this.mapNodeTypeChildren = mapNodeTypeChildren;
          } else {
            this.mapNodeTypeChildren = mapNodeTypeChildren;
          }
        } else {
          this.curActivedNode = {};
          this.mapNodeTypeChildren = mapNodeTypeChildren;
        }
      } else {
        this.mapNodeTypeChildren = mapNodeTypeChildren;
      }
    },
    /**
     * todo ...
     */
    getSideMarketMenusByType(type) {
      var sideMarketMenus = this.sideMarketMenus;
      for (var i = 0; i < sideMarketMenus.length; i++) {
        if (type === sideMarketMenus[i].type) {
          return sideMarketMenus[i].children;
        }
      }
    },
    /**
     * 检测节点是否在侧边栏
     */
    checkNextNodeIsExistSideMenu(curNode, sideMarketMenus) {
      for (var i = 0; i < sideMarketMenus.length; i++) {
        if (sideMarketMenus[i].component === curNode) {
          return true;
        }
      }
      return false;
    },
    // 下一步按钮，仅处理单分支逻辑
    addNextNodeHandler(curNodeItem, prevNodeItem) {
      var nextNodes = getCurNodeNextNodes(
        prevNodeItem.id,
        this.flowData.nodeItems
      );
      var nodeData;

      if (nextNodes.length === 0) {
        // 将节点数据合并到模版数据，模版数据
        var copyTempNodeData = {
          ...this.nodeDataTemplate,
          id: this.getUuid(),
          parentId: prevNodeItem.id,
          x: prevNodeItem.x, // 节点x坐标
          y: prevNodeItem.y + nodeGap.y, // 节点y坐标
          nodeConf: {},
        };
        nodeData = Object.assign(
          copyTempNodeData,
          getNodeData(curNodeItem.name)
        );
        // 单分支节点逻辑
        this.singleBranchNode(prevNodeItem, nodeData);
      } else {
        // 节点不一致时
        if (nextNodes[0].name !== curNodeItem.name) {
          this.userConfirmIsDoNextAction().then(
            (actionType) => {
              // 尝试释放券
              this.setFreeCouponOrCrossCoupon(nextNodes[0]);

              nodeData = Object.assign(
                nextNodes[0],
                getNodeData(curNodeItem.name)
              );
              nodeData.nodeConf = {};

              var nextNextNodes = getCurNodeNextNodes(
                nodeData.id,
                this.flowData.nodeItems
              );
              if (nextNextNodes.length) {
                // 更新子节点数据
                for (var i = 0; i < nextNextNodes.length; i++) {
                  this.removeCurrentNodeHandler(nextNextNodes[i]);
                }
              }

              // 如果是事件判断，则创建分支
              if (nodeData.name === "eventJudge") {
                this.createEventJudeNodes(nodeData);
              }
            },
            (actionType) => {
              console.log("操作取消操作");
            }
          );
        }
      }
    },
    userConfirmIsDoNextAction() {
      return this.$msgbox({
        title: "活动组件替换提醒",
        message: "当前操作会导致子组件更改且子组件依赖组件被删除。",
        showClose: true,
        distinguishCancelAndClose: true,
        type: "warning",
        showCancelButton: true,
        confirmButtonText: "确认",
        cancelButtonText: "取消",
      });
    },
    singleBranchNode(prevNodeItem, nodeData) {
      // 节点长度为0新增
      this.flowData.nodeItems.push(nodeData);
      // 添加连线
      this.$nextTick(() => {
        this.plumb.connect({
          uuids: [prevNodeItem.id + "BottomCenter", nodeData.id + "TopCenter"],
        });
        if (nodeData.name === "eventJudge") {
          this.createEventJudeNodes(nodeData);
        } else {
          if (nodeData.name === "abTest" || nodeData.name === "eventSelect") {
            this.setActiveNodeHandler({});
          } else {
            this.setActiveNodeHandler(nodeData);
          }
        }
      });
    },
    createEventJudeNodes(prevNodeItem) {
      var count = 2;
      var copyTempNodeData = {
        ...this.nodeDataTemplate,
        id: "",
        parentId: prevNodeItem.id,
        x: prevNodeItem.x, // 节点x坐标
        y: prevNodeItem.y + nodeGap.y, // 节点y坐标
        nodeConf: {},
      };
      var emptyNode = {
        icon: "/static/market_icons/empty.png",
        component: "",
        name: "",
        label: "",
        mulBranch: false,
      };
      var nodeData, i;

      for (i = 0; i < count; i++) {
        copyTempNodeData.id = this.getUuid();
        if (i === 0) {
          prevNodeItem.nodeConf.action_true_nodeId = copyTempNodeData.id;
        } else {
          prevNodeItem.nodeConf.action_false_nodeId = copyTempNodeData.id;
        }
        nodeData = Object.assign({}, copyTempNodeData, emptyNode);
        this.flowData.nodeItems.push(nodeData);
      }

      var nextNodes = getCurNodeNextNodes(
        prevNodeItem.id,
        this.flowData.nodeItems
      );
      this.updateNextNodesPos(prevNodeItem, nextNodes);
      this.setActiveNodeHandler({});

      this.$nextTick(() => {
        for (i = 0; i < nextNodes.length; i++) {
          var connections = this.plumb.getConnections({
            source: prevNodeItem.id,
            target: nextNodes[i].id,
          });
          if (connections.length) {
            this.setConnLabel(connections[0]);
          } else {
            this.plumb.connect({
              uuids: [
                prevNodeItem.id + "BottomCenter",
                nextNodes[i].id + "TopCenter",
              ],
            });
          }
        }
        this.plumb.repaintEverything();
      });
    },
    createAbTestNodes(prevNodeItem) {
      var metricNode;

      var nextNodes = getCurNodeNextNodes(
        prevNodeItem.id,
        this.flowData.nodeItems
      );
      var actions = prevNodeItem.nodeConf.actions_ABtest;
      this.caculatorActionsNode(nextNodes, actions, prevNodeItem, true);

      nextNodes = getCurNodeNextNodes(prevNodeItem.id, this.flowData.nodeItems);
      this.updateNextNodesPos(prevNodeItem, nextNodes);
      metricNode = this.getMetricNode(prevNodeItem, nextNodes);

      if (prevNodeItem.nodeConf.branchMulNode === "Y") {
        // 分支多动作节点连线处理 todo ... 递归处理连线，条件是 metric节点终结递归
        this.$nextTick(() => {
          this.lineParentToChildren(prevNodeItem);
          if (
            this.curActivedNode.id === prevNodeItem.id ||
            !this.curActivedNode.id
          ) {
            this.setActiveNodeHandler({});
          }
          this.plumb.repaintEverything();
        });
      } else {
        this.$nextTick(() => {
          for (var i = 0; i < nextNodes.length; i++) {
            var connections = this.plumb.getConnections({
              source: prevNodeItem.id,
              target: nextNodes[i].id,
            });

            if (connections.length) {
              this.setConnLabel(connections[0]);
            } else {
              this.plumb.connect({
                uuids: [
                  prevNodeItem.id + "BottomCenter",
                  nextNodes[i].id + "TopCenter",
                ],
              });
              this.plumb.connect({
                uuids: [
                  nextNodes[i].id + "BottomCenter",
                  metricNode.id + "TopCenter",
                ],
              });
            }
          }

          if (
            this.curActivedNode.id === prevNodeItem.id ||
            !this.curActivedNode.id
          ) {
            this.setActiveNodeHandler({});
          }

          this.plumb.repaintEverything();
        });
      }
    },
    lineParentToChildren(prevNodeItem) {
      var nextNodes;
      var i;
      var connections;
      if (prevNodeItem.component !== "metric") {
        nextNodes = getCurNodeNextNodes(
          prevNodeItem.id,
          this.flowData.nodeItems
        );
        for (i = 0; i < nextNodes.length; i++) {
          connections = this.plumb.getConnections({
            source: prevNodeItem.id,
            target: nextNodes[i].id,
          });
          if (connections.length) {
            this.setConnLabel(connections[0]);
          } else {
            this.plumb.connect({
              uuids: [
                prevNodeItem.id + "BottomCenter",
                nextNodes[i].id + "TopCenter",
              ],
            });
          }
          this.lineParentToChildren(nextNodes[i]);
        }
      }
    },
    /**
     * 更新节点位置
     */
    updateNextNodesPos(prevNodeItem, nextNodes) {
      var left;
      var nodeStartPosX;
      var i;

      if (nextNodes.length % 2 === 0) {
        left = nextNodes.length / 2;
        nodeStartPosX = prevNodeItem.x - (left - 1) * nodeGap.x - nodeGap.x / 2;
        // 边缘检测
        if (nodeStartPosX < 250) {
          nodeStartPosX = 250;
        }

        for (i = 0; i < nextNodes.length; i++) {
          nextNodes[i].x = nodeStartPosX + i * nodeGap.x;
          nextNodes[i].y = prevNodeItem.y + nodeGap.y;

          // todo ... 同步下一动作节点位置
          if (
            prevNodeItem.component === "abTest" &&
            prevNodeItem.nodeConf.branchMulNode === "Y"
          ) {
            this.updateNextNodesPos(
              nextNodes[i],
              getCurNodeNextNodes(nextNodes[i].id, this.flowData.nodeItems)
            );
          }
        }
      } else {
        left = Math.ceil(nextNodes.length / 2);
        nodeStartPosX = prevNodeItem.x - (left - 1) * nodeGap.x;
        // 边缘检测
        if (nodeStartPosX < 250) {
          nodeStartPosX = 250;
        }

        for (i = 0; i < nextNodes.length; i++) {
          nextNodes[i].x = nodeStartPosX + i * nodeGap.x;
          nextNodes[i].y = prevNodeItem.y + nodeGap.y;

          // todo ... 同步下一动作节点位置
          if (
            prevNodeItem.component === "abTest" &&
            prevNodeItem.nodeConf.branchMulNode === "Y"
          ) {
            this.updateNextNodesPos(
              nextNodes[i],
              getCurNodeNextNodes(nextNodes[i].id, this.flowData.nodeItems)
            );
          }
        }
      }
    },
    caculatorActionsNode(nextNodes, actions, prevNodeItem, judgeRemove) {
      var matched;
      var i;
      var j;

      // 对比nextNodes 和 actions 的差异，删除nextNodes和actions 中不匹配的节点
      for (i = 0; i < nextNodes.length; i++) {
        matched = false;
        for (j = 0; j < actions.length; j++) {
          if (nextNodes[i].id === actions[j].id) {
            matched = true;
            break;
          }
        }
        if (!matched) {
          // 删除该节点, 递归删除子节点
          this.removeCurrentNodeHandler(nextNodes[i], judgeRemove);
        }
      }

      this.createNewActionNode(nextNodes, actions, prevNodeItem);
    },
    copyTempNodeData() {
      return {
        ...this.nodeDataTemplate,
        id: "",
        parentId: null,
        x: 0, // 节点x坐标 prevNodeItem.x
        y: 0, // 节点y坐标 prevNodeItem.y + nodeGap.y
        nodeConf: {},
      };
    },
    createNewActionNode(nextNodes, actions, prevNodeItem) {
      // actions 中如果是新增的分支，则向画布添加节点
      var j;
      var nodeData;

      var emptyNode = {
        icon: "/static/market_icons/empty.png",
        component: "",
        name: "",
        label: "",
        mulBranch: false,
      };
      var copyTempNodeData;

      for (j = 0; j < actions.length; j++) {
        if (!actions[j].id) {
          copyTempNodeData = this.copyTempNodeData();
          copyTempNodeData.id = this.getUuid();
          copyTempNodeData.parentId = prevNodeItem.id;
          actions[j].id = copyTempNodeData.id;
          // 事件选择现在使用的是branchid
          if (prevNodeItem.component === "eventSelect") {
            actions[j].branchid = copyTempNodeData.id;
            nodeData = Object.assign({}, copyTempNodeData, emptyNode);
            this.flowData.nodeItems.push(nodeData);
          } else if (prevNodeItem.component === "abTest") {
            if (prevNodeItem.nodeConf.branchMulNode === "Y") {
              // 节点层级
              copyTempNodeData.level = 1;
              // 新增节点时，分支多动做默认节点为券
              nodeData = Object.assign(
                {},
                copyTempNodeData,
                getNodeData("coupon")
              );
              this.flowData.nodeItems.push(nodeData);
            } else {
              if (nextNodes.length && nextNodes[0].component === "coupon") {
                nodeData = Object.assign(
                  {},
                  copyTempNodeData,
                  getNodeData(nextNodes[0].component)
                );
              } else {
                nodeData = Object.assign({}, copyTempNodeData, emptyNode);
              }
              this.flowData.nodeItems.push(nodeData);
            }
          }

          // ABTest分支多动作节点新增
          if (
            prevNodeItem.component === "abTest" &&
            prevNodeItem.nodeConf.branchMulNode === "Y"
          ) {
            copyTempNodeData = this.copyTempNodeData();
            copyTempNodeData.id = this.getUuid();
            copyTempNodeData.parentId = nodeData.id;
            // 节点层级
            copyTempNodeData.level = 2;
            nodeData = Object.assign({}, copyTempNodeData, emptyNode);
            this.flowData.nodeItems.push(nodeData);
          }
        }
      }
    },
    /**
     * 获取获取子级metricNode节点，如果没有则创建一个,有则返回
     */
    getMetricNode(prevNodeItem, nextNodes) {
      var metricNode;
      var copyTempNodeData;
      var i;

      if (prevNodeItem.nodeConf.branchMulNode === "Y") {
        // ... 分支多动做节点逻辑处理

        var metricParentIds = [];
        for (i = 0; i < nextNodes.length; i++) {
          metricParentIds.push(
            getCurNodeNextNodes(nextNodes[i].id, this.flowData.nodeItems)[0].id
          );
        }

        nextNodes = getCurNodeNextNodes(
          nextNodes[0].id,
          this.flowData.nodeItems
        );
        metricNode = getCurNodeNextNodes(
          nextNodes[0].id,
          this.flowData.nodeItems
        )[0];

        if (!metricNode) {
          metricNode = Object.assign({}, hideComponentsMap["metric"]);

          copyTempNodeData = {
            ...metricNode,
            id: this.getUuid(),
            x: prevNodeItem.x, // 节点x坐标
            y: nextNodes[0].y + nodeGap.y, // 节点y坐标
            parentId: metricParentIds.join(","),
            nodeConf: {},
          };

          this.flowData.nodeItems.push(copyTempNodeData);
          return copyTempNodeData;
        } else {
          metricNode.parentId = metricParentIds.join(",");
          return metricNode;
        }
      } else {
        // ... 对过节点逻辑处理
        metricNode = getCurNodeNextNodes(
          nextNodes[0].id,
          this.flowData.nodeItems
        )[0];
        if (!metricNode) {
          metricNode = Object.assign({}, hideComponentsMap["metric"]);
          copyTempNodeData = {
            ...metricNode,
            id: this.getUuid(),
            x: prevNodeItem.x, // 节点x坐标
            y: nextNodes[0].y + nodeGap.y, // 节点y坐标
            parentId: nextNodes.map((item) => item.id).join(","),
            nodeConf: {},
          };

          this.flowData.nodeItems.push(copyTempNodeData);
          return copyTempNodeData;
        } else {
          return metricNode;
        }
      }
    },
    /**
     * 移除画布当前节点且移除节点的依赖子节点（递归调用）
     * todo ... 释放券
     */
    removeCurrentNodeHandler(curNodeItem, judgeRemove) {
      const nodeList = this.flowData.nodeItems;
      const linkList = this.flowData.linkItems;

      this.plumb.clearDragSelection();
      this.$refs["flowArea"].currentSelectGroup = [];
      if (curNodeItem.id === this.curActivedNode.id) {
        this.curActivedNode = {};
        this.mapNodeTypeChildren = {};
      }

      // 端点&连线
      this.plumb.removeAllEndpoints(curNodeItem.id);
      // 移除节点
      removePlumbNode(curNodeItem.id, nodeList);

      this.setFreeCouponOrCrossCoupon(curNodeItem);

      // 同步vue flowData.linkList 数据
      for (let i = 0; i < linkList.length; ) {
        if (
          linkList[i].sourceId === curNodeItem.id ||
          linkList[i].targetId === curNodeItem.id
        ) {
          linkList.splice(i, 1);
        } else {
          i++;
        }
      }
      var nextNodes = getCurNodeNextNodes(
        curNodeItem.id,
        nodeList,
        judgeRemove
      );
      for (var j = 0; j < nextNodes.length; j++) {
        this.removeCurrentNodeHandler(nextNodes[j], judgeRemove);
      }
    },
    /**
     * 券节点被删除时释放券
     */
    setFreeCouponOrCrossCoupon(curNodeItem) {
      if (
        curNodeItem.nodeConf.ticketRuleCode ||
        curNodeItem.nodeConf.couponRuleCode
      ) {
        let params = {};
        if (curNodeItem.name === "crossCoupon") {
          params = {
            couponRuleCode: curNodeItem.nodeConf.ticketRuleCode,
            operationType: 2,
          };
          thirdConfirmUse(params).then((res) => {
            params = null;
          });
        } else if (curNodeItem.name === "coupon") {
          params = {
            couponType: curNodeItem.nodeConf.couponType,
            couponRuleCode: curNodeItem.nodeConf.couponRuleCode,
            operationType: 2,
          };
          confirmUse(params).then((res) => {
            params = null;
          });
        }
      }
    },
    /**
     * 多分支子节点更新操作，仅针对abTest, 不需要删除子孙节点
     * nodeItem 切换后的节点
     * nodeItemData 切换之前的节点
     * ab测试单动作节点nodeItemData.level 为undefined
     * ab测试多动作节点nodeItemData.level 为1或者2
     */
    /**
     * 这段代码可以优化出一个通用逻辑，待办
      nodeItemData.component = nodeTemplateData.component
      nodeItemData.name = nodeTemplateData.name
      nodeItemData.label = nodeTemplateData.label
      nodeItemData.icon = nodeTemplateData.icon
      nodeItemData.mulBranch = nodeTemplateData.mulBranch
      nodeItemData.nodeConf = {}
     */
    updateCurNodeHandler(nodeItem, nodeItemData) {
      var nodeTemplateData = getNodeData(nodeItem.name);
      var i;
      if (nodeItem.component !== nodeItemData.component) {
        // 需要批量设置abTest组件子节点，同时需要尝试释放券
        if (nodeItemData.level !== 2) {
          var abTestNode = getNodeInfoByNodeId(
            nodeItemData.parentId,
            this.flowData.nodeItems
          );
          var abTestNodeChildren = getCurNodeNextNodes(
            abTestNode.id,
            this.flowData.nodeItems
          );
          if (nodeItemData.level === 1) {
            for (i = 0; i < abTestNodeChildren.length; i++) {
              if (abTestNodeChildren[i].component) continue;
              // 仅覆盖这些数据
              abTestNodeChildren[i].component = nodeTemplateData.component;
              abTestNodeChildren[i].name = nodeTemplateData.name;
              abTestNodeChildren[i].label = nodeTemplateData.label;
              abTestNodeChildren[i].icon = nodeTemplateData.icon;
              abTestNodeChildren[i].mulBranch = nodeTemplateData.mulBranch;
            }
          } else {
            // 如果之前是券或者之后是券都需要批量修改
            // 如果之前是券的话，会被强制批量修改为现在组件类型，（不存在一半是券，一半是其他组件）
            if (
              nodeItem.component === "coupon" ||
              abTestNodeChildren[0].component === "coupon"
            ) {
              if (abTestNodeChildren[0].component) {
                this.$msgbox({
                  title: "活动组件替换",
                  message: "此操作会导致同级组件被更改。",
                  showClose: true,
                  distinguishCancelAndClose: true,
                  type: "warning",
                  showCancelButton: true,
                  confirmButtonText: "确认",
                  cancelButtonText: "取消",
                }).then(
                  () => {
                    for (i = 0; i < abTestNodeChildren.length; i++) {
                      this.setFreeCouponOrCrossCoupon(abTestNodeChildren[i]);

                      // 仅覆盖这些数据
                      abTestNodeChildren[i].component =
                        nodeTemplateData.component;
                      abTestNodeChildren[i].name = nodeTemplateData.name;
                      abTestNodeChildren[i].label = nodeTemplateData.label;
                      abTestNodeChildren[i].icon = nodeTemplateData.icon;
                      abTestNodeChildren[i].mulBranch =
                        nodeTemplateData.mulBranch;
                      abTestNodeChildren[i].nodeConf = {};
                    }
                    this.updateMetricNodeConf(nodeItemData);
                  },
                  (action) => {
                    console.log(action);
                  }
                );
              } else {
                for (i = 0; i < abTestNodeChildren.length; i++) {
                  abTestNodeChildren[i].component = nodeTemplateData.component;
                  abTestNodeChildren[i].name = nodeTemplateData.name;
                  abTestNodeChildren[i].label = nodeTemplateData.label;
                  abTestNodeChildren[i].icon = nodeTemplateData.icon;
                  abTestNodeChildren[i].mulBranch = nodeTemplateData.mulBranch;
                  abTestNodeChildren[i].nodeConf = {};
                }
                this.updateMetricNodeConf(nodeItemData);
              }
            } else {
              // 如果component 存在的话，提示组件切换
              if (nodeItemData.component) {
                this.$msgbox({
                  title: "活动组件替换",
                  message: "此操作会导致当前组件被更改。",
                  showClose: true,
                  distinguishCancelAndClose: true,
                  type: "warning",
                  showCancelButton: true,
                  confirmButtonText: "确认",
                  cancelButtonText: "取消",
                }).then(
                  () => {
                    nodeItemData.component = nodeTemplateData.component;
                    nodeItemData.name = nodeTemplateData.name;
                    nodeItemData.label = nodeTemplateData.label;
                    nodeItemData.icon = nodeTemplateData.icon;
                    nodeItemData.mulBranch = nodeTemplateData.mulBranch;
                    nodeItemData.nodeConf = {};

                    this.updateMetricNodeConf(nodeItemData);
                  },
                  (action) => {
                    console.log(action);
                  }
                );
              } else {
                // component 不存在的话直接替换
                nodeItemData.component = nodeTemplateData.component;
                nodeItemData.name = nodeTemplateData.name;
                nodeItemData.label = nodeTemplateData.label;
                nodeItemData.icon = nodeTemplateData.icon;
                nodeItemData.mulBranch = nodeTemplateData.mulBranch;
                nodeItemData.nodeConf = {};

                this.updateMetricNodeConf(nodeItemData);
              }
            }
          }
        } else {
          // abTest 组件等级为2的情况下这里没有券， 不需要考虑释放券
          // 如果component存在的话则提示组件替换操作
          // 否则直接替换
          if (nodeItemData.component) {
            this.$msgbox({
              title: "活动组件替换",
              message: "此操作会导致当前组件被更改。",
              showClose: true,
              distinguishCancelAndClose: true,
              type: "warning",
              showCancelButton: true,
              confirmButtonText: "确认",
              cancelButtonText: "取消",
            }).then(
              () => {
                nodeItemData.component = nodeTemplateData.component;
                nodeItemData.name = nodeTemplateData.name;
                nodeItemData.label = nodeTemplateData.label;
                nodeItemData.icon = nodeTemplateData.icon;
                nodeItemData.mulBranch = nodeTemplateData.mulBranch;
                nodeItemData.nodeConf = {};
              },
              (action) => {
                console.log(action);
              }
            );
          } else {
            nodeItemData.component = nodeTemplateData.component;
            nodeItemData.name = nodeTemplateData.name;
            nodeItemData.label = nodeTemplateData.label;
            nodeItemData.icon = nodeTemplateData.icon;
            nodeItemData.mulBranch = nodeTemplateData.mulBranch;
            nodeItemData.nodeConf = {};
          }
        }
      }
    },
    updateMetricNodeConf(metricParentNode) {
      var metricNode = getCurNodeNextNodes(
        metricParentNode.id,
        this.flowData.nodeItems
      )[0];
      if (metricParentNode.component === "coupon") {
        metricNode.nodeConf = {
          couponVerificateWeight: "100",
          linkClickWeight: "",
        };
      } else {
        metricNode.nodeConf = {
          couponVerificateWeight: "",
          linkClickWeight: "100",
        };
      }
    },
    /**
     * 更新当前节点，删除子孙节点
     */
    updateCurNodeAndRemoveDescendantNode(nodeItem, nodeItemData) {
      var nodeTemplateData;
      if (!nodeItemData.name || nodeItem.name === nodeItemData.name) {
        if (!nodeItemData.name) {
          nodeTemplateData = getNodeData(nodeItem.name);

          nodeItemData.component = nodeTemplateData.component;
          nodeItemData.name = nodeTemplateData.name;
          nodeItemData.label = nodeTemplateData.label;
          nodeItemData.icon = nodeTemplateData.icon;
          nodeItemData.mulBranch = nodeTemplateData.mulBranch;
        }
      } else {
        const nodeList = this.flowData.nodeItems;
        var nextNodes = getCurNodeNextNodes(nodeItemData.id, nodeList);
        // 存在子孙节点则提示删除操作
        if (nextNodes.length) {
          this.$msgbox({
            title: "活动组件删除提醒",
            message: "当前操作会导致当前组件更改且当前组件依赖组件被删除。",
            showClose: true,
            distinguishCancelAndClose: true,
            type: "warning",
            showCancelButton: true,
            confirmButtonText: "确认",
            cancelButtonText: "取消",
          }).then(() => {
            // 节点改变内容时，尝试释放券
            this.setFreeCouponOrCrossCoupon(nodeItemData);

            nodeTemplateData = getNodeData(nodeItem.name);

            nodeItemData.component = nodeTemplateData.component;
            nodeItemData.name = nodeTemplateData.name;
            nodeItemData.label = nodeTemplateData.label;
            nodeItemData.icon = nodeTemplateData.icon;
            nodeItemData.mulBranch = nodeTemplateData.mulBranch;
            nodeItemData.nodeConf = {};

            const nodeList = this.flowData.nodeItems;
            var nextNodes = getCurNodeNextNodes(nodeItemData.id, nodeList);
            for (var j = 0; j < nextNodes.length; j++) {
              this.removeCurrentNodeHandler(nextNodes[j]);
            }
          });
        } else {
          // 存在子节点则提示替换操作
          this.$msgbox({
            title: "活动组件切换提醒",
            message: "当前操作会导致该组件切换，该组件内容会丢失。",
            showClose: true,
            distinguishCancelAndClose: true,
            type: "warning",
            showCancelButton: true,
            confirmButtonText: "确认",
            cancelButtonText: "取消",
          }).then(() => {
            // 节点改变内容时，尝试释放券
            this.setFreeCouponOrCrossCoupon(nodeItemData);

            nodeTemplateData = getNodeData(nodeItem.name);
            nodeItemData.component = nodeTemplateData.component;
            nodeItemData.name = nodeTemplateData.name;
            nodeItemData.label = nodeTemplateData.label;
            nodeItemData.icon = nodeTemplateData.icon;
            nodeItemData.mulBranch = nodeTemplateData.mulBranch;
            nodeItemData.nodeConf = {};
          });
        }
      }
    },
    /**
     * 事件判断重置节点
     */
    resetCurNodeHandler(nodeItemData) {
      var nextNodes = getCurNodeNextNodes(
        nodeItemData.id,
        this.flowData.nodeItems
      );
      if (nextNodes.length) {
        this.$msgbox({
          title: "活动节点删除提醒",
          // eslint-disable-next-line
          message: "当前操作会导致当前组件更改且当前组件依赖组件被删除。",
          showClose: true,
          distinguishCancelAndClose: true,
          type: "warning",
          showCancelButton: true,
          confirmButtonText: "确认",
          cancelButtonText: "取消",
        }).then(() => {
          // 节点改变内容时，尝试释放券
          this.setFreeCouponOrCrossCoupon(nodeItemData);

          nodeItemData.component = "";
          nodeItemData.icon = "/static/market_icons/empty.png";
          nodeItemData.name = "";
          nodeItemData.label = "";
          nodeItemData.mulBranch = "";
          nodeItemData.nodeConf = {};
          var nextNodes = getCurNodeNextNodes(
            nodeItemData.id,
            this.flowData.nodeItems
          );
          for (var j = 0; j < nextNodes.length; j++) {
            this.removeCurrentNodeHandler(nextNodes[j]);
          }
        });
      } else {
        this.$msgbox({
          title: "活动节点替换",
          // eslint-disable-next-line
          message: "当前操作会导致当前组件被替换。",
          showClose: true,
          distinguishCancelAndClose: true,
          type: "warning",
          showCancelButton: true,
          confirmButtonText: "确认",
          cancelButtonText: "取消",
        }).then(() => {
          // 节点改变内容时，尝试释放券
          this.setFreeCouponOrCrossCoupon(nodeItemData);

          nodeItemData.component = "";
          nodeItemData.icon = "/static/market_icons/empty.png";
          nodeItemData.name = "";
          nodeItemData.label = "";
          nodeItemData.mulBranch = "";
          nodeItemData.nodeConf = {};
        });
      }
    },
    /**
     * 初始化节点事件监听
     */
    initNodeItemHandler() {
      this.$on("openModal", this.openModalHandler);
      this.$on("setActiveNode", this.setActiveNodeHandler);
      this.$on("addNextNode", this.addNextNodeHandler);
      this.$on("removeCurrenttNode", this.removeCurrentNodeHandler);
      this.$on("updateCurNode", this.updateCurNodeHandler);
      this.$on(
        "updateCurNodeAndRemoveDescendantNode",
        this.updateCurNodeAndRemoveDescendantNode
      );
      this.$on("resetCurNode", this.resetCurNodeHandler);
    },
    /**
     * 事件选择，创建节点
     * 没有子节点时直接新增
     * 拥有子节点，updateNextNodesPos方法，使用分支diff子节点数据，做去除和新增节点
     */
    eventSelectCreateNodes(prevNodeItem) {
      var prevNodeBranches = prevNodeItem.nodeConf.branches;
      if (prevNodeBranches.length > 1) {
        prevNodeBranches.mulBranch = true;
      } else {
        prevNodeBranches.mulBranch = false;
      }

      var nextNodes = getCurNodeNextNodes(
        prevNodeItem.id,
        this.flowData.nodeItems
      );
      this.caculatorActionsNode(nextNodes, prevNodeBranches, prevNodeItem);
      nextNodes = getCurNodeNextNodes(prevNodeItem.id, this.flowData.nodeItems);
      this.updateNextNodesPos(prevNodeItem, nextNodes);

      this.setActiveNodeHandler({});

      this.$nextTick(() => {
        for (var i = 0; i < nextNodes.length; i++) {
          var connections = this.plumb.getConnections({
            source: prevNodeItem.id,
            target: nextNodes[i].id,
          });
          if (connections.length) {
            this.setConnLabel(connections[0]);
          } else {
            this.plumb.connect({
              uuids: [
                prevNodeItem.id + "BottomCenter",
                nextNodes[i].id + "TopCenter",
              ],
            });
          }
        }
        this.plumb.repaintEverything();
      });
    },
    /**
     * 弹窗组件内容校验成功之后，继续创建节点
     */
    validCallback(valid) {
      this.componentActionDoing = false;
      if (!valid) {
        return;
      }

      this.openComModal = false;
      this.$nextTick(() => {
        if (this.curComConfig.name === "eventSelect") {
          this.eventSelectCreateNodes(this.curComConfig);
        } else if (this.curComConfig.name === "abTest") {
          this.createAbTestNodes(this.curComConfig);
        }
      });
    },
    /**
     * 弹窗确认按钮
     */
    confirmComHandler() {
      if (this.componentActionDoing) return;
      // this.componentActionDoing = true;
      this.$refs["comSetting"].confirmHandler(this.validCallback);
    },
    getUuid: function () {
      return Math.random().toString(36).substr(3, 8);
    },
    /**
     * 1.marketingContent有实质性内容时，使用营销marketingContent内容初始化画布
     * 2.通过url marketing_type （新增编辑查看）初始化画布节点
     */
    initJsPlumbNodes() {
      if (this.queryParams.id) {
        var marketingContent = {};
        try {
          if (this.activityInfo.marketingContent) {
            marketingContent = JSON.parse(this.activityInfo.marketingContent);
          }
        } catch (err) {
          console.log(err);
        }

        if (marketingContent.nodeItems && marketingContent.nodeItems.length) {
          // 如果画布当前有节点
          this.flowData = marketingContent;
          this.renderJsplumb();
          // 如果是通过模版创建的活动，则不允许侧边栏拖动，因为节点删除
          if (!this.activityInfo.marketingTemplateDefId) {
            // 初始化左边侧边栏按钮可拖动
            this.initSidebarComItemDrag();
          }
        } else {
          // 如果画布当前没有节点
          this.initJsPlumbNodesByMarketingType();

          // 初始化左边侧边栏按钮可拖动
          this.initSidebarComItemDrag();
        }
      } else {
        // 新增画布
        // 如果画布当前没有节点
        this.initJsPlumbNodesByMarketingType();

        // 初始化左边侧边栏按钮可拖动
        this.initSidebarComItemDrag();
      }
    },
    /**
     * 渲染画布内容
     */
    renderJsplumb() {
      // 做渲染逻辑
      this.$nextTick(() => {
        var linkItems = this.flowData.linkItems;
        for (var i = 0; i < linkItems.length; i++) {
          this.plumb.connect({
            uuids: [
              linkItems[i].sourceId + "BottomCenter",
              linkItems[i].targetId + "TopCenter",
            ],
          });
        }
        this.plumb.repaintEverything();
      });
    },
    // 通过营销类型初始化画布节点
    initJsPlumbNodesByMarketingType() {
      var flowAreaClientRect = this.$refs[
        "flowArea"
      ].$el.getBoundingClientRect();
      var nodeData, copyTempNodeData;
      var x = flowAreaClientRect.width / 2 + 110;
      var remainderX = x % 10;
      var merchantX = Math.floor(x / 10);
      var y = 20;

      if (remainderX > 5) {
        x = (merchantX + 1) * 10;
      } else {
        x = merchantX * 10;
      }

      if (this.queryParams.marketing_type === "event") {
        // 实时营销
        // 事件选择
        copyTempNodeData = {
          ...this.nodeDataTemplate,
          id: this.getUuid(),
          x: x, // 节点x坐标
          y: y, // 节点y坐标
          nodeConf: {},
        };

        copyTempNodeData.initDefaultNode = true;
        copyTempNodeData.headNode = true;

        nodeData = Object.assign(copyTempNodeData, getNodeData("eventSelect"));

        this.flowData.nodeItems.push(nodeData);
      } else if (this.queryParams.marketing_type === "period") {
        // 周期营销
        // 人群选择+时间选择
        // 将节点数据合并到模版数据，模版数据
        var prevNodeItem = {
          ...this.nodeDataTemplate,
          id: this.getUuid(),
          x: x, // 节点x坐标
          y: y, // 节点y坐标
          nodeConf: {},
          parentId: "",
          hiddenNextNodeTip: true,
        };

        nodeData = Object.assign(prevNodeItem, getNodeData("timePicker"));
        nodeData.initDefaultNode = true;
        nodeData.headNode = true;

        this.flowData.nodeItems.push(nodeData);

        copyTempNodeData = {
          ...this.nodeDataTemplate,
          id: this.getUuid(),
          x: x, // 节点x坐标
          y: y + nodeGap.y, // 节点y坐标
          parentId: prevNodeItem.id,
          nodeConf: {},
        };

        nodeData = Object.assign(copyTempNodeData, getNodeData("peopleFilter"));
        nodeData.initDefaultNode = true;

        this.flowData.nodeItems.push(nodeData);

        this.$nextTick(() => {
          this.plumb.connect({
            uuids: [
              prevNodeItem.id + "BottomCenter",
              copyTempNodeData.id + "TopCenter",
            ],
          });
          this.plumb.repaintEverything();
        });
      } else if (this.queryParams.marketing_type === "diy") {
        // 主动 营销
        // 人群选择

        // 将节点数据合并到模版数据，模版数据
        copyTempNodeData = {
          ...this.nodeDataTemplate,
          id: this.getUuid(),
          x: x, // 节点x坐标
          y: y, // 节点y坐标
          nodeConf: {},
        };

        copyTempNodeData.initDefaultNode = true;
        copyTempNodeData.headNode = true;

        nodeData = Object.assign(copyTempNodeData, getNodeData("peopleFilter"));

        this.flowData.nodeItems.push(nodeData);
      }
    },
    /**
     * 保存营销活动主体信息
     */
    saveActivityInfo() {
      this.$refs["activityMainSetting"].saveActivityInfo();
    },
    /**
     * 提交营销活动主体信息
     */
    saveAndSubmitActivityInfo() {
      this.$refs["activityMainSetting"].submitMarketingActivity();
    },
    goBackActivityList() {
      this.$router.push({
        name: "marketingList",
      });
    },
    checkAndSaveTemplateInfo() {
      this.$refs["templateMainSetting"].checkAndSaveTemplateInfo();
    },
    saveTemplateInfo() {
      this.$refs["templateMainSetting"].saveActivityInfo();
    },
    goBackTemplateList() {
      this.$router.push({
        name: "marketingModule",
      });
    },
    openAuditModal() {
      this.auditModalVisible = true;
    },
    closeAuditMarketing() {
      this.auditModalVisible = false;
      this.$refs["auditForm"].clearValidate();
    },
    auditMarketingActivity() {
      this.$refs["auditForm"].validate((valid) => {
        if (valid) {
          var data = {
            id: this.activityInfo.id,
            auditContent: this.auditModalForm.auditContent,
            auditStatus: this.auditModalForm.auditStatus,
            marketingTimeBegin: this.activityInfo.marketingTimeBegin,
          };

          auditMarketingActivity(data).then((res) => {
            if (res.bizCode === 20000 || res.bizCode === "20000") {
              this.auditModalVisible = false;
              this.$refs["auditForm"].clearValidate();
              this.$message({
                type: "success",
                message: "执行成功",
              });
              this.$router.push({
                name: "marketingList",
              });
            }
          });
        }
      });
    },
    caculatorPeople() {
      this.$refs["comSetting"].$refs["peopleFilter"].runFilterCombineSql();
    },
    createActivityByTemplate() {
      this.$refs["templateMainSetting"].createActivityByTemplate();
    },
    closeComponentModal() {
      this.componentActionDoing = false;
      this.openComModal = false;
    },
  },
};
</script>

<style scope>
.jsplumb-activity-content {
  background: #f6f6f6;
  padding: 15px 15px 0;
}
.jsplumb-activity-content .el-dialog__body {
  max-height: 400px;
  overflow: auto;
}
.page-container {
  border-top: 1px solid #EBEEF5;
  background: #fff;
  position: relative;
}
.side-market-menu {
  width: 220px;
  background: #fff;
  border-right: 1px solid #EBEEF5;
  border-left: 1px solid #EBEEF5;
  z-index: 490;
  transition: left 0.5s;
  position: absolute;
  top: 0;
  bottom: 0;
}
.side-market-menu.open-menu {
  left: 0;
}
.side-market-menu.close-menu {
  left: -219px;
  background: #f6f6f6;
}
.jsplumb-container.open-menu {
  left: 220px;
}

.jsplumb-container.close-menu {
  left: 0;
}
.side-close-wrap {
  position: absolute;
  right: -20px;
  top: 50%;
  transform: translateY(-50%);
  background: #fff;
  height: 50px;
  width: 20px;
  border: 1px solid #EBEEF5;
  border-top-right-radius: 3px;
  border-bottom-right-radius: 3px;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2;
}
.jsplumb-container {
  background: #fff;
  user-select: none;
}
.message-wrap {
  position: fixed;
  right: 16px;
  bottom: 50px;
  padding: 10px 0;
  z-index: 1000;
}
.message-info {
  height: 40px;
  line-height: 40px;
  background-color: #fdeeed;
  border: 1px solid #f5dcda;
  color: #e66b5f;
}
.index-chose {
  text-align: right;
  position: relative;
  top: -15px;
}
.action-bottom-wrap {
  text-align: center;
  position: fixed;
  left: 150px;
  right: 0;
  bottom: 0;
  background: #fff;
  padding: 10px 0;
  box-shadow: 0 -3px 5px rgba(212, 212, 212, 0.5);
  z-index: 1000;
}
.jsplumb-container .aLabel {
  max-width: 170px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  background-color: white;
  padding: 2px;
  font: 12px sans-serif;
  color: #444;
  z-index: 21;
  border: 1px dotted gray;
  opacity: 0.8;
  cursor: pointer;
}
.next-node-group-items-wrap li:last-child .next-node-group-item-wrap::after {
  border-bottom: 0;
}
.label-title {
  height: 16px;
  position: relative;
  line-height: 16px;
  padding-left: 10px;
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
.hor-line {
  border-bottom: 1px dashed #e4e7ed;
  height: 0;
  overflow: hidden;
  margin: 0 -20px 15px;
}
.transformLabel.jtk-overlay {
  transform: translate(-50%, -150%) !important;
}
.main-info-wrap {
  position: relative;
}
.main-info-close {
  position: absolute;
  width: 50px;
  height: 20px;
  left: 50%;
  transform: translateX(-50%);
  background: #fff;
  top: 1px;
  z-index: 2;
  border-left: 1px solid #EBEEF5;
  border-right: 1px solid #EBEEF5;
  border-bottom: 1px solid #EBEEF5;
  border-radius: 0 0 4px 4px;
  text-align: center;
  line-height: 20px;
}
.actvity-main-setting {
  padding-top: 15px;
  border-top: 1px solid #EBEEF5;
  border-left: 1px solid #EBEEF5;
  border-right: 1px solid #EBEEF5;
  background: #fff;
}
</style>
