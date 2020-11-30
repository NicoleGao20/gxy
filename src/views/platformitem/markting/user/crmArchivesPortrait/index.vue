<template>
  <div class="crm-portrait-container">
    <div class="crm-portrait">
      <p class="titleStyle">基础信息</p>
      <el-row class="info">
        <el-form
          ref="form"
          :model="form"
          label-width="100px"
          class="crm-portrait-form"
        >
          <el-row>
            <el-col :span="2"
              ><img src="@/assets/img/avatar-120.png" class="avatar"
            /></el-col>
            <el-col :span="4">
              <el-form-item label-width="100px" label="手机号">
                <span>{{ form.mobile ? form.mobile : "无" }}</span>
              </el-form-item>
              <el-form-item label-width="100px" label="开卡日期">
                <span>{{ form.register_date ? form.register_date.substr(0,10) : "无" }}</span>
              </el-form-item>
              <el-form-item label-width="100px" label="会员注册门店">
                <span>{{ form.register_store ? form.register_store : "无" }}</span>
              </el-form-item>
              <el-form-item
                v-if="$route.query.memberId"
                label-width="100px"
                label="会员天数"
              >
                <span>{{ form.cnt_member ? form.cnt_member : "无" }}</span>
              </el-form-item>
              <el-form-item
                v-if="$route.query.buyerId"
                label-width="100px"
                label="潜客天数"
              >
                <span>{{
                  form.cnt_potential ? form.cnt_potential : "无"
                }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label-width="100px" label="年龄">
                <span>{{ form.age ? form.age : "无" }}</span>
              </el-form-item>
              <el-form-item label-width="100px" label="用户身份">
                <span>{{ form.identity ? form.identity : "无" }}</span>
              </el-form-item>
              <el-form-item label-width="100px" label="首次购买手机号">
                <span>{{ form.mobile_first ? form.mobile_first : "无" }}</span>
              </el-form-item>
              <el-form-item label-width="100px" label="回购周期">
                <span>{{ form.avg_oder_time ? form.avg_oder_time : "无" }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label-width="100px" label="性别">
                <span>{{ form.gender ? form.gender : "无" }}</span>
              </el-form-item>
              <el-form-item label-width="100px" label="会员卡号">
                <span>{{ form.member_id ? form.member_id : "无" }}</span>
              </el-form-item>
              <el-form-item label-width="100px" label="绑卡手机号">
                <span>{{ form.mobile_bind ? form.mobile_bind : "无" }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <el-form-item label-width="100px" label="生日">
                <span>{{ form.birthday ? form.birthday.substr(0,10) : "无" }}</span>
              </el-form-item>
              <el-form-item label-width="100px" label="会员等级">
                <span>{{ form.level_name ? form.level_name : "无" }}</span>
              </el-form-item>
              <el-form-item label-width="100px" label="最近下单手机号">
                <span>{{
                  form.mobile_lastest ? form.mobile_lastest : "无"
                }}</span>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-row>
    </div>
    <div class="crm-portrait">
      <p class="titleStyle">渠道信息</p>
      <el-row class="info">
        <el-form
          ref="form"
          :model="form"
          label-width="100px"
          class="crm-portrait-form"
        >
          <el-row>
            <el-col :span="2"
              ><img src="@/assets/img/qudao/jingdong.png" class="avatar"
            /></el-col>
            <el-col :span="4">
              <el-form-item label-width="100px" label="京东昵称">
                <span>{{ form.platform_name === '京东' ? isVip === 'VIP' ? form.nick : form.buyer_nick : '无' }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="2"
              ><img src="@/assets/img/qudao/taobao.png" class="avatar"
            /></el-col>
            <el-col :span="4">
              <el-form-item label-width="100px" label="淘宝昵称">
                <span>{{ form.platform_name === '淘宝' ? isVip === 'VIP' ? form.nick : form.buyer_nick : '无' }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="2"
              ><img src="@/assets/img/qudao/weixin.png" class="avatar"
            /></el-col>
            <el-col :span="4">
              <el-form-item label-width="100px" label="微信昵称">
                <span>{{ form.platform_name === '微信' ? isVip === 'VIP' ? form.nick : form.buyer_nick : '无' }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="2"
              ><img src="@/assets/img/qudao/store.png" class="avatar" 
            /></el-col>
            <el-col :span="4">
              <el-form-item label-width="100px" label="线下卡号">
                <span>无</span>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-row>
    </div>
    <div class="crm-portrait">
      <div
        class="ad-status filter-btns"
        style="font-size: 12px; padding: 20px 10px 0 10px"
      >
        <ul>
          <li
            v-for="(adStatusItem, index) in adStatusItems"
            :key="index"
            :class="{ on: adStatusItem.value == ISSUE_STATUS }"
            @click="filterFun(adStatusItem.value)"
          >
            {{ adStatusItem.label }}
          </li>
        </ul>
      </div>
      <div v-loading="overViewLoading" class="overview">
        <el-row
          v-if="ISSUE_STATUS !== 'userTag' && ISSUE_STATUS !== 'nineThree'"
          :gutter="10"
        >
          <el-col
            v-for="element in memberLabelList"
            :key="element.id"
            :xs="6"
            :sm="4"
            :md="4"
            :lg="4"
            :xl="3"
            class="allChartModuleBox"
          >
            <component
              :is="currentTabComponent[ISSUE_STATUS]"
              :chart-object="element"
            />
          </el-col>
        </el-row>
        <div
          v-for="element in memberLabelList"
          v-else-if="ISSUE_STATUS === 'userTag'"
          :key="element.id"
        >
          <CrmLabelCard :memeber-label-obj="element" />
        </div>
        <div v-else>
          <CrmNineThree :data="memberLabelList" />
        </div>
        <div v-if="memberLabelList.length === 0" class="none">
          暂无数据
        </div>
      </div>
    </div>
    <div v-if="showOrHidden" class="crm-portrait">
      <p class="titleStyle">渠道档案</p>
      <el-table
        v-loading="originLoading"
        :data="originData"
        border
        style="width: 100%"
      >
        <el-table-column
          :resizable="false"
          prop="platform_name"
          label="渠道"
          align="center"
        />
        <el-table-column
          v-if="$route.query.memberId"
          :resizable="false"
          prop="member_nick"
          label="昵称"
          align="center"
        />
        <el-table-column
          v-if="$route.query.buyerId"
          :resizable="false"
          prop="buyer_nick"
          label="昵称"
          align="center"
        />
        <el-table-column
          :resizable="false"
          prop="mobile_bind"
          label="绑卡手机号"
          align="center"
        />
        <el-table-column
          :resizable="false"
          prop="mobile_first"
          label="首次购买手机号"
          align="center"
        />
        <el-table-column
          :resizable="false"
          prop="moblie_lastest"
          label="最近购买手机号"
          align="center"
        />
        <el-table-column
          :resizable="false"
          prop="rule_name"
          label="操作"
          align="center"
        >
          <template slot-scope="scope">
            <el-button
              type="text"
              @click="jump(scope.row.member_id, scope.row.platform_name)"
            >
              查看
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="crm-portrait">
      <p class="titleStyle">行为轨迹</p>
      <div
        class="ad-status filter-btns"
        style="font-size: 12px; padding: 20px 10px 0 10px"
      >
        <ul>
          <li
            v-for="(adStatusItem, index) in adStatusItems2"
            :key="index"
            :class="{ on: adStatusItem.value == ISSUE_STATUS2 }"
            @click="filterFun2(adStatusItem.value)"
          >
            {{ adStatusItem.label }}
          </li>
        </ul>
      </div>
      <div class="overview">
        <component
          v-loading="behaviorLoading"
          :is="currentTabComponent[ISSUE_STATUS2]"
          :table-data="memberTableList"
          @seeEvaluate="seeEvaluate"
          @playVideo="playVideo"
        />
      </div>
      <el-pagination
      class="bottomPagination"
        :current-page="behaviorPageNum"
        :page-sizes="[10, 20, 30, 40, 50]"
        :page-size="behaviorPageSize"
        :total="behaviorTotal"
        layout="total, sizes, prev, pager, next, jumper"
        background
        @size-change="behaviorHandleSizeChange"
        @current-change="behaviorHandleCurrentChange"
      />
    </div>
    <div class="crm-portrait">
      <p class="titleStyle">收货地址</p>
      <el-table
        v-loading="addressLoading"
        :data="tableData"
        :header-cell-style="{ background: '#F5F7FA', color: '#333333' }"
        class="crm-portrait-table"
        border
        style="margin-top: 15px"
      >
        <el-table-column
          :resizable="false"
          prop="receiver_name"
          label="姓名"
          width="180"
        />
        <el-table-column
          :resizable="false"
          prop="receiver_mobile"
          label="手机号"
          width="180"
        />
        <el-table-column
          :resizable="false"
          prop="receiver_address"
          label="地址"
        />
      </el-table>
      <el-pagination
      class="bottomPagination"
        :current-page="addressPageNum"
        :page-sizes="[10, 20, 30, 40, 50]"
        :page-size="addressPageSize"
        :total="addressTotal"
        layout="total, sizes, prev, pager, next, jumper"
        background
        @size-change="addressHandleSizeChange"
        @current-change="addressHandleCurrentChange"
      />
    </div>
    <el-dialog :visible.sync="evaDialogVisible" title="查看全部" width="45%">
      <el-row>
        <el-col :span="3">
          <img
            src="http://cdp.burgeon.cn:7070/api/user/avatar?uid=72"
            style="width: 50px; height: 50px"
          />
        </el-col>
        <el-col :span="15">
          <p>{{ evaDialogData.content }}</p>
          <div>
            <img
              v-for="(item, index) in evaDialogData.content_pic_url"
              :key="index"
              :src="item"
              style="width: 50px; height: 50px"
            />
            <i
              v-for="(item, index) in evaDialogData.content_vpic_url"
              :key="index"
              :style="{ backgroundImage: 'url(' + item + ')' }"
              class="el-icon-video-play videoView"
            />
          </div>
          <p>{{ evaDialogData.evaluate_time }}</p>
        </el-col>
      </el-row>
      <el-row v-if="evaDialogData.seller_reply" type="flex" justify="end">
        <el-col :span="15">
          <p>{{ evaDialogData.seller_reply }}</p>
          <p>{{ evaDialogData.seller_time }}</p>
        </el-col>
        <el-col :span="3">
          <img
            src="http://cdp.burgeon.cn:7070/api/user/avatar?uid=72"
            style="width: 50px; height: 50px"
          />
        </el-col>
      </el-row>
    </el-dialog>
    <el-dialog :visible.sync="videoDialogVisible" title="视频" width="30%">
      <video :src="videoUrl" controls="controls" style="width: 100%">
        您的浏览器不支持 video 标签。
      </video>
    </el-dialog>
  </div>
</template>
<script>
import CrmCard from "@/componentsMarketing/crmPortraitCard/crmCard";
import CrmLabelCard from "@/componentsMarketing/crmPortraitCard/crmLabelCard.vue";
import CrmCommon from "@/componentsMarketing/crmPortraitCard/crmCommon.vue";
import CrmNineThree from "@/componentsMarketing/crmPortraitCard/crmNineThree.vue";
import VIP from "@/api/markting/vipArchives";
import USER from "@/api/markting/memberArchives";
import orderList from "./orderList";
import evaluateList from "./evaluateList";
import pointLog from "@/componentsMarketing/tableLog/pointLog";
import levelLog from "@/componentsMarketing/tableLog/levelLog";
import interLog from "@/componentsMarketing/tableLog/interLog";
let MAP = {
  VIP,
  USER
}
export default {
  name: "MarketingList",
  components: {
    CrmCard,
    CrmCommon,
    CrmLabelCard,
    CrmNineThree,
    orderList,
    pointLog,
    levelLog,
    interLog,
    evaluateList,
  },
  data() {
    return {
      isVip: '',
      params: {},
      currentTabComponent: {
        consumptionOverview: "CrmCommon",
        rightOverview: "CrmCommon",
        purchasePreference: "CrmCommon",
        memberInteraction: "CrmCommon",
        userTag: "CrmCommon",
        nineThree: "CrmNineThree",
        orderRecord: "orderList",
        scoreChangeRecord: "pointLog",
        levelChangeRecord: "levelLog",
        InteractiveRecord: "interLog",
        evaluationRecord: "evaluateList",
      },
      showOrHidden: true,
      memberLabelList: [],
      overViewLoading: false,
      memberTableList: [],
      adStatusItems: [
        {
          label: "消费总览",
          value: "consumptionOverview",
        },
        {
          label: "权益总览",
          value: "rightOverview",
        },
        {
          label: "购买偏好",
          value: "purchasePreference",
        },
        {
          label: "会员互动",
          value: "memberInteraction",
        },
        {
          label: "用户标签",
          value: "userTag",
        },
        {
          label: "九分三类",
          value: "nineThree",
        },
      ],
      adStatusItems2: [
        {
          label: "订单记录",
          value: "orderRecord",
        },
        {
          label: "积分变更记录",
          value: "scoreChangeRecord",
        },
        {
          label: "等级变更记录",
          value: "levelChangeRecord",
        },
        {
          label: "互动记录",
          value: "InteractiveRecord",
        },
        {
          label: "评价记录",
          value: "evaluationRecord",
        },
      ],
      ISSUE_STATUS: "consumptionOverview",
      ISSUE_STATUS2: "orderRecord",
      tableData: [],
      addressLoading: false,
      addressPageNum: 1,
      addressPageSize: 10,
      addressTotal: 0,
      form: {
        name: "",
      },
      CrmCardList: [],
      trajectoryVal: "FOLLOW_STATUS_RECORD",
      behaviorLoading: false,
      originLoading: false,
      originData: [],
      behaviorPageNum: 1,
      behaviorPageSize: 10,
      behaviorTotal: 0,
      evaDialogVisible: false,
      evaDialogData: {},
      videoDialogVisible: false,
      videoUrl: "",
    };
  },
  mounted() {
    if (this.$route.query.memberId) {
      this.params.member_id = this.$route.query.memberId;
      this.isVip = 'VIP';
    } else if (this.$route.query.buyerId) {
      this.params.buyer_id = this.$route.query.buyerId;
      this.isVip = 'USER';
    }
    if (this.$route.query.platformName) this.showOrHidden = false;
    this.$nextTick(() => {
      this.overViewLoading = true;
      this.getBasics("first");
      this.getIndexCardFun2();
      this.getTableData(1, 10);
    });
  },
  methods: {
    getBasics(first) {
      this.overViewLoading = true;
      MAP[this.isVip]['queryParticulars'](this.params).then(({ data }) => {
        this.overViewLoading = false;
        this.form = data;
        this.memberLabelList = [
          { label: "累计消费金额", value: data.amt_payment },
          { label: "累计消费次数", value: data.cnt_payment },
          { label: "累计消费单数", value: data.cnt_order },
          { label: "累计消费件数", value: data.cnt_order_item },
          { label: "平均客单价", value: data.avg_pct },
          { label: "平均货单价", value: data.avg_pit },
          { label: "平均片单价/升单价", value: data.avg_pplt },
          { label: "累计退款金额", value: data.amt_refund },
          { label: "累计退款次数", value: data.cnt_refund },
          { label: "累计退款单数", value: data.cnt_refund_order },
          { label: "累计退款件数", value: data.cnt_refund_item },
          { label: "最近一次购物时间", value: data.last_order_time.substr(0,10) },
          { label: "平均购物周期", value: data.avg_oder_time },
        ];
        if (first === "first") {
          this.originLoading = true;
          MAP[this.isVip]['queryChannel']({
            mobile_bind: data.mobile_bind,
          }).then(({ data }) => {
            this.originData = data.list;
            this.originLoading = false;
          }).catch(()=>{
            this.originLoading = false;
          })
        }
      }).catch(()=>{
        this.overViewLoading = false;
      })
    },
    getIndexCardFun() {
      if (this.ISSUE_STATUS === "consumptionOverview") {
        this.memberLabelList = [];
        this.getBasics();
      } else if (this.ISSUE_STATUS === "rightOverview") {
        this.memberLabelList = [];
        this.overViewLoading = true;
        MAP[this.isVip]['queryEquitiesOverview'](this.params).then(({ data }) => {
          this.overViewLoading = false;
          this.memberLabelList = [
            { label: "累计总积分", value: data.total_point },
            { label: "累计交易积分", value: data.total_point_order },
            { label: "累计互动积分", value: data.total_point_intc },
            { label: "现有互动积分", value: data.qty_point_intc },
            { label: "现有交易积分", value: data.qty_point_order },
            { label: "下一过期日过期积分", value: data.point_will_outdate },
            { label: "累计消耗积分", value: data.total_point_used },
            { label: "累计已过期积分", value: data.total_point_outdate },
            { label: "累计积分消耗次数", value: data.cnt_point_used },
          ];
        }).catch(()=>{
          this.overViewLoading = false;
        })
      } else if (this.ISSUE_STATUS === "purchasePreference") {
        this.memberLabelList = [];
        this.overViewLoading = true;
        MAP[this.isVip]['queryPurchaseHobby'](this.params).then(({ data }) => {
          this.overViewLoading = false;
          this.memberLabelList = [
            { label: "最常购买渠道", value: data.channel_often },
            { label: "最常购买店铺", value: data.store_often },
            { label: "品类偏好", value: data.cate_pref },
            { label: "规格偏好", value: data.spec_pref },
            { label: "气味偏好", value: data.odour_pref },
          ];
        }).catch(()=>{
          this.overViewLoading = false;
        })
      } else if (this.ISSUE_STATUS === "memberInteraction") {
        this.memberLabelList = [];
        this.overViewLoading = true;
        MAP[this.isVip]['queryInteraction'](this.params).then(({ data }) => {
          this.overViewLoading = false;
          this.memberLabelList = [
            { label: "总互动次数", value: data.cnt_intc },
            { label: "总签到次数", value: data.cnt_register },
            { label: "总抽奖次数", value: data.cnt_lottery },
            { label: "总积分兑礼次数", value: data.cnt_ceremony },
          ];
        }).catch(()=>{
          this.overViewLoading = false;
        })
      } else if (this.ISSUE_STATUS === "userTag") {
        this.memberLabelList = [];
        this.overViewLoading = true;
        MAP[this.isVip]['queryUserLabel'](this.params).then(({ data }) => {
          this.overViewLoading = false;
          const obj = {};
          const arr = [];
          data.list.forEach((item) => {
            if (obj[item.label_type]) {
              obj[item.label_type].push(item.label_name);
            } else {
              obj[item.label_type] = [item.label_name];
            }
          });
          for (const i in obj) {
            arr.push({
              name: i,
              labelList: obj[i],
            });
          }
          this.memberLabelList = arr;
        }).catch(()=>{
          this.overViewLoading = false;
        })
      } else if (this.ISSUE_STATUS === "nineThree") {
        this.memberLabelList = {};
        this.overViewLoading = true;
        MAP[this.isVip]['queryNineThree'](this.params).then(({ data }) => {
          this.overViewLoading = false;
          this.memberLabelList = data;
        }).catch(()=>{
          this.overViewLoading = false;
        })
      }
    },
    getIndexCardFun2() {
      if (this.ISSUE_STATUS2 === "orderRecord") {
        this.getOrderList(1, 10);
      } else if (this.ISSUE_STATUS2 === "scoreChangeRecord") {
        this.getPointLog(1, 10);
      } else if (this.ISSUE_STATUS2 === "levelChangeRecord") {
        this.getLevelLog(1, 10);
      } else if (this.ISSUE_STATUS2 === "InteractiveRecord") {
        this.getInterLog(1, 10);
      } else if (this.ISSUE_STATUS2 === "evaluationRecord") {
        this.getEvaluation(1, 10);
      }
    },
    editCrmInfo(name) {
      if (name === "name") {
        this.nameBoolean = true;
      }
    },
    filterFun(adStatus) {
      this.ISSUE_STATUS = adStatus;
      this.getIndexCardFun();
    },
    filterFun2(adStatus) {
      this.ISSUE_STATUS2 = adStatus;
      this.getIndexCardFun2();
    },
    changePagation(data) {
      this.behaviorLoading = false;
      this.memberTableList = data.list;
      this.behaviorPageNum = data.pageNum;
      this.behaviorPageSize = data.pageSize;
      this.behaviorTotal = data.total;
    },
    getOrderList(pageNum, pageSize) {
      this.behaviorLoading = true;
      MAP[this.isVip]['queryOrderRecord']({
        pageNum,
        pageSize,
        ...this.params,
      }).then(({ data }) => {
        this.changePagation(data);
      }).catch(()=>{
        this.behaviorLoading = false;
      })
    },
    getPointLog(pageNum, pageSize) {
      this.behaviorLoading = true;
      MAP[this.isVip]['queryIntegralAlteration']({
        pageNum,
        pageSize,
        ...this.params,
      }).then(({ data }) => {
        this.changePagation(data);
      }).catch(()=>{
        this.behaviorLoading = false;
      })
    },
    getLevelLog(pageNum, pageSize) {
      this.behaviorLoading = true;
      MAP[this.isVip]['queryGradeAlteration']({
        pageNum,
        pageSize,
        ...this.params,
      }).then(({ data }) => {
        this.changePagation(data);
      }).catch(()=>{
        this.behaviorLoading = false;
      })
    },
    getInterLog(pageNum, pageSize) {
      this.behaviorLoading = true;
      MAP[this.isVip]['queryInteractRecord']({
        pageNum,
        pageSize,
        ...this.params,
      }).then(({ data }) => {
        this.changePagation(data);
      }).catch(()=>{
        this.behaviorLoading = false;
      })
    },
    getEvaluation(pageNum, pageSize) {
      this.behaviorLoading = true;
      MAP[this.isVip]['queryEvaluateRecord']({
        pageNum,
        pageSize,
        ...this.params,
      }).then(({ data }) => {
        this.changePagation(data);
      }).catch(()=>{
        this.behaviorLoading = false;
      })
    },
    behaviorHandleSizeChange(val) {
      if (this.ISSUE_STATUS2 === "orderRecord") {
        this.getOrderList(1, val);
      } else if (this.ISSUE_STATUS2 === "scoreChangeRecord") {
        this.getPointLog(1, val);
      } else if (this.ISSUE_STATUS2 === "levelChangeRecord") {
        this.getLevelLog(1, val);
      } else if (this.ISSUE_STATUS2 === "InteractiveRecord") {
        this.getInterLog(1, val);
      } else if (this.ISSUE_STATUS2 === "evaluationRecord") {
        this.getEvaluation(1, val);
      }
    },
    behaviorHandleCurrentChange(val) {
      if (this.ISSUE_STATUS2 === "orderRecord") {
        this.getOrderList(val, this.behaviorPageSize);
      } else if (this.ISSUE_STATUS2 === "scoreChangeRecord") {
        this.getPointLog(val, this.behaviorPageSize);
      } else if (this.ISSUE_STATUS2 === "InteractiveRecord") {
        this.getInterLog(val, this.behaviorPageSize);
      } else if (this.ISSUE_STATUS2 === "evaluationRecord") {
        this.getEvaluation(val, this.behaviorPageSize);
      }
    },
    getTableData(pageNum, pageSize) {
      this.addressLoading = true;
      MAP[this.isVip]['queryDeliveryAddress']({
        pageNum,
        pageSize,
        ...this.params,
      }).then(({ data }) => {
        this.addressLoading = false;
        this.tableData = data.list;
        this.addressPageNum = data.pageNum;
        this.addresspageSize = data.pageSize;
        this.addressTotal = data.total;
      }).catch(()=>{
        this.addressLoading = false;
      })
    },
    addressHandleSizeChange(val) {
      this.getTableData(1, val);
    },
    addressHandleCurrentChange(val) {
      this.getTableData(val, this.addressPageSize);
    },
    jump(id, name) {
      if (this.isVip === 'VIP'){
        this.$router.push({
          name: "crmArchivesPortrait",
          query: { memberId: id, platformName: name },
        });
      }
      else if (this.isVip === 'USER'){
        this.$router.push({
          name: "userArchivesPortrait",
          query: { buyerId: id, platformName: name },
        });
      }
    },
    seeEvaluate(data) {
      this.evaDialogVisible = true;
      this.evaDialogData = data;
    },
    playVideo(data) {
      this.videoDialogVisible = true;
      this.videoUrl = data;
    },
  },
};
</script>
<style lang="less"   >
.crm-portrait-form {
  .el-form-item--small .el-form-item__label {
    font-size: 12px;
    color: #666666;
    line-height: 22px;
    text-align: left;
  }
  .el-form-item--small .el-form-item__content,
  .el-input--small .el-input__inner {
    line-height: 22px;
    height: 22px;
  }
  .el-tabs__item {
    padding: 0 14px;
    font-size: 12px;
  }
  .el-input {
    width: 90%;
  }
}
</style>
<style lang="less"  scoped>
.bind {
  display: inline-block;
  color: #61acee;
  font-size: 12px;
  -webkit-transform: scale(0.8);
  padding: 0 2px;
  border-radius: 3px;
  border: solid 1px #61acee;
  position: absolute;
  left: -30px;
}
.crm-portrait-container {
  background-color: #f1f1f1;
  padding: 15px;
  .crm-portrait {
    background-color: #fff;
    margin-bottom: 15px;
    padding: 15px;
    .info {
      // padding: 0 0 10px 0;
      .crm-portrait-form {
        color: #666666;
        label {
          color: red;
        }
        .avatar {
          display: block;
          height: 70px;
          width: 70px;
          float: left;
        }
        .el-form-item {
          .el-icon-edit {
            position: absolute;
            top: 1px;
            right: 2px;
            color: #435a82;
          }
          span {
            font-size: 12px;
          }
          .infoFont {
            display: inline-block;
          }
          .infoMargin {
            margin-left: 10px;
          }
        }
        .infoRight,
        .infoLeft {
          border: 1px dashed #d8dce6;
          padding-top: 10px;
        }
        .infoRight {
          height: 371px;
          overflow-y: scroll;
          margin-left: 10px;
          padding-left: 10px;
          .filter-btns ul li {
            padding: 0 5px;
          }
        }
        .infoLeft {
          padding-right: 10px;
        }
      }
    }
    .titleStyle {
      position: relative;
      padding-left: 7px;
      // padding-top: 15px;
      padding-bottom: 15px;
      &:before {
        content: "";
        position: absolute;
        top: 2px;
        left: 0px;
        width: 2px;
        height: 12px;
        background-color: #3c5175;
      }
    }
    .crm-portrait-table {
      // padding: 0 15px;
      margin: 0;
    }
    .overview {
      padding: 0 20px;
      min-height: 200px;
      margin-top: 20px;
      .allChartModuleBox {
        margin-bottom: 10px;
      }
    }
  }
  .condition {
    padding: 5px 0 15px 15px;
  }
  .behavior {
    padding: 0 0 0px 15px;
  }
}
.show-pwd {
  position: absolute;
  right: 25%;
  top: calc(50% - 8px);
  font-size: 14px !important;
  color: #889aa4;
  cursor: pointer;
  user-select: none;
}
.videoView {
  width: 50px;
  height: 50px;
  cursor: pointer;
  background-size: 50px 50px;
  background-repeat: no-repeat;
  vertical-align: top;
  font-size: 30px;
  line-height: 50px;
  text-align: center;
}
.none{
  width: 100%;
  text-align: center;
}
</style>
