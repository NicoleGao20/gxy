<template>
  <div page-container-gap>
    <div class="searchWrap">
      <el-form
        ref="form"
        :model="form"
        :rules="filterRules"
        size="mini"
        label-position="left"
        label-width="80px"
      >
        <!-- <el-form
        ref="form"
        :model="form"
        :rules="filterRules"
        size="mini"
        label-position="right"
        label-width="120px"
        style="background: #fff; padding: 15px 15px 0; margin-bottom: 15px;margin-left:40px;"
      > -->
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="订单编号:" prop="order_no">
              <el-input
                v-model="form.order_no"
                clearable
                @keyup.enter.native="searchSubmit('form')"
              />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item ref="form" label="手机号码:" prop="receiver_mobile">
              <el-input
                v-model="form.receiver_mobile"
                max-length="11"
                clearable
                @keyup.enter.native="searchSubmit('form')"
              />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="订单状态:">
              <el-select
                v-model="form.order_status"
                multiple
                placeholder="请选择"
                clearable
              >
                <el-option
                  v-for="item in orderStatus"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="会员等级:">
              <el-select
                v-model="form.level_name"
                multiple
                placeholder="请选择"
              >
                <el-option
                  v-for="item in leve"
                  :key="item"
                  :label="item"
                  :value="item"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="下单时间">
              <el-date-picker
                v-model="form.order_time"
                :picker-options="pickerOptions"
                type="datetimerange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                align="right"
                value-format="yyyy-MM-dd HH:mm:ss"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="付款时间:">
              <el-date-picker
                v-model="form.pay_time"
                type="datetimerange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                value-format="yyyy-MM-dd HH:mm:ss"
              />
            </el-form-item>
          </el-col>
          <el-col v-show="isMoreinquiries" :span="6" class="contain-brand">
            <el-col :span="12">
              <el-select
                v-model="form.platform_name"
                placeholder="请选择"
                prop="platform_name"
                clearable
              >
                <el-option
                  v-for="item in orderSource"
                  :key="item.id"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-col>
            <el-form-item>
              <el-input
                v-model="form.buyer_nick"
                prop="buyer_nick"
                clearable
                @keyup.enter.native="searchSubmit('form')"
              />
            </el-form-item>
          </el-col>

          <el-col v-show="isMoreinquiries" :span="6" class="contain-brand">
            <el-col :span="12">
              <el-select
                v-model="form.product_name1"
                placeholder="请选择"
                clearable
              >
                <el-option
                  v-for="item in nickName"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-col>
            <el-form-item>
              <el-input v-model="form.product_nickName1" clearable />
            </el-form-item>
          </el-col>
          <el-col v-show="isMoreinquiries" :span="6">
            <el-form-item label="订单来源:">
              <el-select
                v-model="form.source"
                multiple
                placeholder="请选择"
                clearable
              >
                <el-option
                  v-for="item in orderSource"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col v-show="isMoreinquiries" :span="6">
            <el-form-item label="实付金额:" class="contain_number">
              <div class="contain_clearance">
                <span class="monetary-container">
                  <el-form-item label-width="0">
                    <el-input
                      v-model="form.actuallyPaid_start"
                      @change="actuallyChange($event, 'start', '实付金额')"
                      @keyup.enter.native="searchSubmit('form')"
                    />
                  </el-form-item>
                </span>
                <span>-</span>
                <span class="monetary-container">
                  <el-form-item label-width="0">
                    <el-input
                      v-model="form.actuallyPaid_end"
                      @change="actuallyChange($event, 'end', '实付金额')"
                      @keyup.enter.native="searchSubmit('form')"
                    />
                  </el-form-item>
                </span>
              </div>
            </el-form-item>
          </el-col>
          <el-col v-show="isMoreinquiries" :span="12" class="shippingAddress">
            <el-form-item label="收货地址:">
              <el-col :span="8">
                <el-select
                  v-model="form.address_province"
                  placeholder="请选择"
                  clearable
                  @change="cityChange($event, provinceName, '2')"
                >
                  <el-option
                    v-for="item in provinceName"
                    :key="item.region_code"
                    :label="item.region_name"
                    :value="item.region_name"
                  />
                </el-select>
              </el-col>
              <el-col :span="8">
                <el-select
                  v-model="form.address_city"
                  placeholder="请选择"
                  clearable
                  @change="cityChange($event, cityName, '3')"
                >
                  <el-option
                    v-for="item in cityName"
                    :key="item.region_code"
                    :label="item.region_name"
                    :value="item.region_name"
                  />
                </el-select>
              </el-col>
              <el-col :span="8">
                <el-select
                  v-model="form.county_code"
                  placeholder="请选择"
                  clearable
                  @change="cityChange($event, areaName)"
                >
                  <el-option
                    v-for="item in areaName"
                    :key="item.region_code"
                    :label="item.region_name"
                    :value="item.region_code"
                  />
                </el-select>
              </el-col>
            </el-form-item>
          </el-col>

          <el-col :span="6">
            <el-form-item style="white-space: nowrap">
              <el-button type="primary" @click="searchSubmit('form')"
                >查询</el-button
              >
              <el-button type="primary" @click="reset(form)">重置</el-button>
              <el-button
                v-show="isMoreinquiries"
                type="primary"
                class="search-collapse"
                @click="isMoreinquiries = !isMoreinquiries"
                >收起<i class="el-icon-d-arrow-right" />
              </el-button>
              <el-button
                v-show="!isMoreinquiries"
                @click="isMoreinquiries = !isMoreinquiries"
                >更多筛选</el-button
              >
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <main class="tableMainContent">
      <div class="contain-evaluate">
        <div class="contain_detail">
          <ul class="contain_header">
            <!-- <li>
              <el-checkbox
                v-model="checkAll"
                @change="handleCheckAllChange"
              />
            </li> -->
            <li>
              <el-button
                :disabled="disableButton"
                type="primary"
                @click="batchShort"
                >批量发送短信</el-button
              >
            </li>
            <li>
              <el-button
                :disabled="disableButton"
                type="primary"
                @click="exporTresult('导出结果集')"
                >导出结果集</el-button
              >
            </li>
            <li>
              <el-button
                :disabled="disableButton"
                type="primary"
                @click="exporTresult('导出选中')"
                >导出选中</el-button
              >
            </li>
          </ul>
          <ol class="contain_nav">
            <li>
              <el-checkbox v-model="checkAll" @change="handleCheckAllChange" />
              <span>订单商品</span>
            </li>
            <li>单元(元)</li>
            <li>数量</li>
            <li>实付金额</li>
            <li>状态&操作</li>
          </ol>
          <div class="contain_detailedInformation">
            <div class="contain_information">
              <div
                v-for="(item, index) in list"
                :key="index"
                class="contain_informationHeader"
              >
                <div class="contain_title">
                  <ul>
                    <li>
                      <div style="margin: 15px 0" />
                      <el-checkbox
                        v-model="item.status"
                        @change="
                          handleListChange(
                            $event,
                            index,
                            item.status,
                            item.order_no,
                            item
                          )
                        "
                      />
                    </li>
                    <li>订单编号:{{ item.order_no }}</li>
                    <li class="platform_name">来源:{{ item.platform_name }}</li>
                    <li>
                      <el-tooltip
                        class="item"
                        effect="dark"
                        content="Bottom Left 提示文字"
                        placement="bottom-start"
                      >
                        <el-button>
                          <div class="Image">
                            <img src="./img/ico-member@2x.png" alt="" />
                          </div>
                        </el-button>
                      </el-tooltip>
                      <el-tooltip
                        effect="dark"
                        placement="bottom"
                        class="el-name"
                      >
                        <div slot="content">
                          查看{{ item.buyer_nick }}的所有订单
                        </div>
                        <div class="nickname">
                          客户昵称:<span>{{ item.buyer_nick }}</span>
                        </div>
                      </el-tooltip>
                      <span class="el-icon"
                        >({{ item.receiver_name }} : {{ item.receiver_mobile }}
                        <el-tooltip
                          effect="dark"
                          placement="bottom"
                          class="sendSmsContent"
                        >
                          <div slot="content" class="sendSms">发送短信</div>
                          <img src="./img/message.png" alt="" />
                        </el-tooltip>
                        )
                      </span>
                    </li>
                    <li class="contain_icon"></li>
                    <li>
                      下单时间:
                      <span class="contain_timer">{{ item.order_time }}</span>
                    </li>
                    <li class="payment_time">
                      付款时间:
                      <span class="contain_timer">{{ item.order_time }}</span>
                    </li>
                  </ul>

                  <div class="iconType">
                    <el-tooltip effect="dark" placement="bottom">
                      <div slot="content">地址信息</div>
                      <div slot="content">姓名:{{ item.receiver_name }}</div>
                      <div slot="content">手机:{{ item.receiver_mobile }}</div>
                      <div slot="content">城市:{{ item.city_name }}</div>
                      <div slot="content">区域:{{ item.county_name }}</div>
                      <div slot="content">地址:{{ item.receiver_address }}</div>
                      <div slot="content">邮编:{{ item.county_code }}</div>
                      <img src="./img/address.png" alt="" />
                    </el-tooltip>
                    <el-tooltip effect="dark" placement="bottom">
                      <div slot="content">发送短信</div>
                      <img src="./img/ico-remarks.png" />
                    </el-tooltip>
                    <el-tooltip effect="dark" placement="bottom">
                      <div slot="content">
                        <p>优惠方式</p>
                        <p v-for="item in item.discount_desc" :key="item">
                          {{ item }}
                        </p>
                      </div>
                      <img src="./img/icon-preferential.png" />
                    </el-tooltip>
                    <img
                      src="./img/information@2.png"
                      @click="logisticsInformationButton(item)"
                    />
                  </div>
                </div>
                <div class="contain_introduce">
                  <div style="width: 80%">
                    <div
                      v-for="(ite, index) in item.order_item"
                      :key="index"
                      class="contain_introduceLeft"
                    >
                      <div>
                        <img :src="ite.product_url" alt="" />
                      </div>
                      <div>
                        <ul>
                          <li>
                            {{ ite.product_title }}
                          </li>
                          <li>{{ ite.product_sku }}</li>
                          <li>商家编码:{{ ite.product_code }}</li>
                        </ul>
                      </div>
                      <div>{{ ite.price }}</div>
                      <div>{{ ite.amount }}</div>
                    </div>
                  </div>
                  <div class="contain_introduceRight">
                    <ul>
                      <li>￥{{ item.amt_payment }}</li>
                      <li>(含运费:77)</li>
                    </ul>
                  </div>
                  <div class="operationButton">
                    <!-- v-if="item.order_status == 4"  -->
                    <!-- <div class="buyerPaid">
                      买家已付款
                    </div> -->
                    <!--  -->
                    <!-- v-if="item.order_status == 5"  已发货 -->
                    <!-- <span v-if="item.order_status == 5">已发货</span>
                  <span v-if="item.order_status == 9">部分已发货</span> -->
                    <!-- <div
                       
                      class="delivered"
                    >
                      商品待发货
                    </div> -->
                    <!-- <div
                       
                      class="delivered"
                    >
                      订单已完成
                    </div> -->
                    <div class="received">商品待收货</div>
                    <div v-if="item.order_status == 3" class="buyerPaidColor">
                      买家未付款
                    </div>

                    <div
                      v-if="item.order_status == 5 || item.order_status == 9"
                      class="logistics"
                    >
                      查看物流
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <base-pagination
          v-model="params.current"
          :page-sizes="pageSizes"
          :page-size.sync="params.page_size"
          :total="total"
          class="bottomPagination"
          @loadData="evaluation"
        />
      </div>
    </main>
    <el-dialog
      :visible.sync="messageDialog"
      title="批量发送短信"
      width="50%"
      @opened="dialogOpened"
    >
      <el-form
        ref="ruleForm"
        :model="ruleForm"
        :rules="rules"
        :hide-required-asterisk="true"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item
          :rules="[
            { required: true, message: `请输入接收人`, trigger: 'blur' },
            { validator: this.checkName, trigger: 'blur' },
          ]"
          label="接收人"
          prop="name"
        >
          <!-- <el-input v-model="ruleForm.name" :disabled="true">{{
            checkFlag
          }}</el-input> -->
          <div class="evaluate-receiver">
            <span v-for="(item, index) in checkedArr" :class="{'err-status': item.errStatus===false}" :key="index">
              {{item.receiver_name + ':' + item.receiver_mobile}}
            </span>
          </div>
        </el-form-item>
        <el-form-item label="短信模板：" prop="message">
          <el-select
            v-model="ruleForm.message"
            placeholder="请选择模板"
            @change="messageChange"
          >
            <el-option
              v-for="item in options"
              :key="item.id"
              :label="item.template_name"
              :value="item.id"
            />
          </el-select>
          <span
            class="delete-btn"
            @click="
              ruleForm.message = '';
              ruleForm.brand_content = '';
            "
            >删除</span
          >
        </el-form-item>
        <el-form-item label="短信内容：" prop="brand_content">
          <el-input
            :rows="5"
            v-model="ruleForm.brand_content"
            type="textarea"
          />
        </el-form-item>
        <el-form-item class="autograph">
          <span>短信签名:</span>
          <el-select v-model="ruleForm.brand_code" @change="handleBrandChange">
            <el-option
              v-for="item in brandList"
              :key="item.id"
              :label="item.brandName"
              :value="item.brandCode"
            />
          </el-select>
          <span>系统默认加上</span>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="configDialog">发送</el-button>
        <el-button @click="messageDialog = false">关闭</el-button>
      </span>
    </el-dialog>
    <!-- <elDialog
      :exporTresultType="exporTresultType"
      :resultSetDialog="resultSetDialog"
      @file_name="file_name"
    /> -->
    <el-dialog
      :title="dialogType"
      :visible.sync="resultSetDialog"
      width="50%"
      class="wrap_export"
    >
      <ol class="export_file">
        <li>
          <i class="el-icon-circle-check" />
        </li>
        <li>
          {{ dialogType }}已提交,请到
          <span>
            <router-link :to="{ name: 'dataDownload' }"
              >管理平台-下载中心</router-link
            ></span
          >
          下载!
        </li>
        <li>如果不需要使用系统生成的文件名,您可以自定义文件名称:</li>
        <li>
          <el-input v-model="file_name" clearable />
        </li>
      </ol>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="comfig">保存</el-button>
        <el-button @click="resultSetDialog = false">关闭</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="查看物流"
      :visible.sync="logisticsInformation"
      width="50%"
      class="logistics"
    >
      <div class="logisticsDialog">
        <ol>
          <li>
            <span>物流信息:</span>
            <span>(来源于淘宝)</span>
          </li>
          <li>
            <span>物流方式</span>
            <span>来源于快递</span>
          </li>
          <li>
            <span>快递公司</span>
            <span>顺丰速递</span>
          </li>
        </ol>
        <div class="oddNumbers">
          <span>快递单号</span>
          <span>SF1234566778</span>
        </div>
        <ol>
          <li>
            <span>下单信息:</span>
            <span>2020.08.23</span>
            <span>13:12:12</span>
            <span>订单创建</span>
          </li>
          <li>
            <span>下单信息:</span>
            <span>2020.08.23</span>
            <span>13:12:12</span>
            <span>订单创建</span>
          </li>
        </ol>
      </div>
        <el-timeline :reverse="reverse">
     <el-timeline-item
      v-for="(activity, index) in activities"
      :key="index"
      :timestamp="activity.timestamp">
      {{activity.content}}
    </el-timeline-item>
  </el-timeline>
      <span slot="footer" class="dialog-footer">
        <el-button @click="logisticsInformation = false">取 消</el-button>
        <el-button type="primary" @click="logisticsInformation = false"
          >确 定</el-button
        >
      </span>
    </el-dialog>
   
  </div>
</template>
<script>
import {
  queryOrderArchives,
  queryProvinceAndCity,
  levelList,
  importResultSet,
  batchSendMsg,
  checkBlacklist,
  smsTemplate,
  editFileName,
} from "@/api/markting/security/visit";
import { navBrands } from "@/api/login";
// import elDialog from "@/publicComponents/documentDownload";
export default {
  components: {
    // elDialog,
  },
  data() {
    return {
      params: {
        current: 1,
        page_size: 10,
      },
      pageSizes: [10, 20, 30, 40],
      total: 100,
      options: [],
      disableButton: true,
      form: {
        order_no: "", // 订单编号
        platform_name: "", // 昵称
        buyer_nick: "", // 手动输入昵称
        order_status: "", // 订单状态
        product_name: "", // 商品昵称
        product_nickName: "",
        product_name1: "商品名称",
        product_nickName1: "",
        order_time: "", // 下单时间
        pay_time: "", // 付款时间
        payment_end: "", // 付款结束时间
        level_name: "", // 会员等级
        receiver_mobile: "", // 会员号码
        address_province: "", // 收货地址--省
        address_city: "", // 收货地址--省
        county_code: "", // 收货地址--省
        platform_name: "京东", // 订单来源
        actuallyPaid_start: "", // 实付金额--开始
        actuallyPaid_end: "", // 实付金额--结束
      },
      filterRules: {
        actuallyPaid_start: [],
        actuallyPaid_end: [],
        receiver_mobile: [
          { required: false, message: "请输入手机号码", trigger: "blur" },
          {
            min: 11,
            max: 11,
            message: "手机号码长度为11位请重新输入",
            trigger: "blur",
          },
          {
            pattern: /^1[3456789]\d{9}$/,
            message: "目前只支持中国大陆的手机号码",
          },
        ],
      },
      rules: {},
      orderStatus: [
        {
          value: "3",
          label: "等待买家付款",
        },
        {
          value: "4",
          label: "已付款",
        },
        {
          value: "9",
          label: "部分已发货",
        },
        {
          value: "6",
          label: "已签收",
        },
        {
          value: "1",
          label: "交易成功",
        },
        {
          value: "8",
          label: "交易自动关闭",
        },
        {
          value: "13",
          label: "待评价",
        },
        {
          value: "11",
          label: "退款中订单",
        },
        {
          value: "12",
          label: "退款已完成订单",
        },
      ],
      orderSource: [
        {
          value: "淘宝",
          label: "淘宝",
        },
        {
          value: "京东",
          label: "京东",
        },
        {
          value: "微信",
          label: "微信",
        },
      ],
      nickName: [
        {
          value: "product_name",
          label: "商品名称",
        },
        {
          value: "cm_mp_product_id",
          label: "商品ID",
        },
      ],
      reverse: true,
      activities: [{
        content: '活动按期开始',
        timestamp: '2018-04-15'
      }, {
        content: '通过审核',
        timestamp: '2018-04-13'
      }, {
        content: '创建成功',
        timestamp: '2018-04-11'
      }],
      checkAll: false, // 全选
      list: [], // 请求数据
      cityName: [],
      provinceName: [],
      areaName: [],
      region_type: "", // 城市编号
      region_code: "", // 二级城市
      leve: [], // 会员等级
      brand_name: "", // 京东类型昵称
      city_name: "", // 区
      ruleForm: {
        name: "", // 接收人
        message: "", // 短信模板
        brand_content: "", // 短信内容
        brand_code: "", //批量发送短信品牌
      },
      messageDialog: false, // 批量发送短信
      resultSetDialog: false, // 导出结果集
      file_name: "", // 导出结果
      exportType: "", // 导出状态
      isMoreinquiries: false,
      popupFail: false,
      fileID: "",
      exporTresultType: "",
      checkedArr: [], // 选中项
      member_id: "",
      dialogType: "",
      check_name: "",
      templateType: "",
      resultId: "",
      checkFlag: false,
      arrBoolean: false,
      brandList: [],
      logisticsInformation: false,
      // 下单时间
      pickerOptions: {
        shortcuts: [
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 92 * 24 * 3600 * 1000);
              picker.$emit("pick", [start, end]);
            },
          },
        ],
      },
    };
  },
  mounted() {
    this.evaluation();
    this.city(); // 省市区
    this.level(); // 会员等级
  },
  methods: {
    dialogOpened() {
      this.$refs.ruleForm.validate((valid) => {
        console.log(valid);
      });
    },
    // 全选
    handleCheckAllChange(val) {
      this.checkAll = val;
      this.list.forEach((item) => {
        item.status = val;
        this.disableButton = false;
      });
      this.$forceUpdate();
    },
    // 点击列表中的复选框
    handleListChange(e, index, status, order_no, item) {
      this.order_no = order_no;
      this.list[index].status = e;
      if (!e) {
        this.checkAll = false;
        const position = this.checkedArr.findIndex(
          (item) => item.order_no === order_no
        );
        if (position !== -1) {
          this.checkedArr.splice(position, 1);
        }
      }
      if (e) {
        const position = this.checkedArr.findIndex(
          (item) => item.order_no === order_no
        );
        if (position === -1) {
          this.checkedArr.push(item);
        }
      }
      if (this.list.every((item) => item.status === true)) {
        this.checkAll = true;
        this.disableButton = false;
      }
      if (this.checkedArr.length) {
        this.disableButton = false;
      } else {
        this.disableButton = true;
      }
      this.$forceUpdate();
    },
    // 黑名单
    async checkName(rule, value, callback) {
      console.log('接电话')
      const listArr = this.getChecked("批量发送短信");
      const params = {};
      listArr.map((item, index) => {
        for (const key in item) {
          item["tel"] = item[key];
          delete item[key];
        }
        item.order_no = this.member_id;
      });
      params.phoneArray = listArr;
      checkBlacklist(params).then((res) => {
        if (res.code === "1") {
          const arr = res.data.map((item) => item.checkFlag);
           console.log(arr,'这使得')
          if (arr.some((x) => !x)) {
            callback(new Error("暗红色背景系统黑名单,不能被发送"));
            this.checkFlag = false;
            this.checkedArr.map((item,index)=>{
              item.errStatus = arr[index]
            })
          } else {
            callback();
          }
          this.$forceUpdate();
        }
      });
      const res = await navBrands();
      console.log(res, "res");
      this.brandList = res.body || [];
    },
    handleBrandChange() {
      console.log(this.brand_name, "handleBrandChange");
    },
    // 支付金额
    actuallyChange(e, type, name) {
      if (name == "实付金额") {
        if (type == "start" && !this.form.actuallyPaid_end) {
          this.form.actuallyPaid_end = e;
        } else {
          if (!this.form.actuallyPaid_start) {
            this.form.actuallyPaid_start = e;
          }
        }
      }
    },
    // 请求数据--商品id修改
    evaluation() {
      const that = this;
      const params = {
        pageNum: this.params.current,
        pageSize: this.params.page_size,
      };
      const {
        order_no,
        platform_name,
        buyer_nick,
        order_status,
        product_name,
        product_name1,
        product_nickName,
        product_nickName1,
        actuallyPaid_start,
        actuallyPaid_end,
        order_time,
        level_name,
        pay_time,
        receiver_mobile,
        address_province,
        address_city,
        county_code,
        source,
      } = this.form;
      if (actuallyPaid_start) {
        const reg = /^[0-9]*$/;
        if (!reg.test(actuallyPaid_start)) {
          this.$message.error("评价字数必须为数字且大于1");
          return;
        } else {
          if (actuallyPaid_start < 1) {
            this.$message.error("实付金额起始值必须大于1");
            return;
          }
        }
      }
      if (actuallyPaid_end) {
        const reg = /^[0-9]*$/;
        if (!reg.test(Number(actuallyPaid_end))) {
          this.$message.error("评价字数必须为数字且大于1");
          return;
        } else {
          if (Number(actuallyPaid_end) < 1) {
            this.$message.error("实付金额起始值必须大于1");
            return;
          }
        }
      }
      if (Number(actuallyPaid_start) && Number(actuallyPaid_end)) {
        if (Number(actuallyPaid_start) > Number(actuallyPaid_end)) {
          this.$message.error("实付金额初始值不能大于终值");
          return;
        }
      }
      params.fuzzy_type = {
        order_status,
        level_name,
        source,
      };
      params.general_type = {
        order_no,
        receiver_mobile,
        county_code,
      };
      const bane = {};
      if (this.form.product_name1 && this.form.product_nickName1) {
        params[this.form.product_name1] = this.form.product_nickName1;
      }
      if (this.form.platform_name && this.form.buyer_nick) {
        params.platform_name = this.form.platform_name;
        params.buyer_nick = this.form.buyer_nick;
      }
      const arr = Object.keys(params.general_type);
      const fuzzyType = Object.keys(params.fuzzy_type);
      arr.map((item) => {
        if (
          !params.general_type[item] ||
          (Array.isArray(params.general_type[item]) &&
            params.general_type[item].length === 0)
        ) {
          delete params.general_type[item];
        }
      });
      fuzzyType.map((item) => {
        if (
          !params.fuzzy_type[item] ||
          (Array.isArray(params.fuzzy_type[item]) &&
            params.fuzzy_type[item].length === 0)
        ) {
          delete params.fuzzy_type[item];
        }
      });
      let section_num_type = {},
        section_date_type = {};

      if (actuallyPaid_start || actuallyPaid_end) {
        section_num_type.amt_payment = [
          actuallyPaid_start
            ? Number(actuallyPaid_start)
            : Number(actuallyPaid_end),
          actuallyPaid_end
            ? Number(actuallyPaid_end)
            : Number(actuallyPaid_start),
        ];
      }
      if (Object.keys(section_num_type).length > 0) {
        params.section_num_type = section_num_type;
      }

      if (order_time) {
        section_date_type.order_time = order_time;
      }

      if (pay_time) {
        section_date_type.pay_time = pay_time;
      }
      params.section_date_type = section_date_type;
      if (
        params.section_date_type &&
        Object.keys(params.section_date_type).length === 0
      ) {
        delete params.section_date_type;
      }
      if (
        params.section_num_type &&
        Object.keys(params.section_num_type).length === 0
      ) {
        delete params.section_num_type;
      }
      if (
        params.general_type &&
        Object.keys(params.general_type).length === 0
      ) {
        delete params.general_type;
      }
      if (params.fuzzy_type && Object.keys(params.fuzzy_type).length === 0) {
        delete params.fuzzy_type;
      }
      queryOrderArchives(params)
        .then((res) => {
          if (res.code == "1") {
            this.list = res.data.list.map((x) => {
              return { ...x, status: false };
            });
            this.params.current = res.data.pageNum || 1;
            this.params.page_size = res.data.pageSize;
            this.total = res.data.total || 0;
            if (that.checkAll) {
              this.handleCheckAllChange(true);
            }
            // 解决返回上一页的时候选中项未项
            this.list.forEach((item) => {
              const position = this.checkedArr.findIndex(
                (items) => items.order_no === item.order_no
              );
              if (position !== -1) {
                item.status = true;
                this.checkedArr.push(item);
              }
            });
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },

    // 会员等级
    level() {
      const params = {
        boxQueryFlag: "levelNameFlag",
      };
      levelList(params).then((res) => {
        if (res.code == "1") {
          this.leve = res.data.list;
        }
      });
    },
    // 省市区
    city(data) {
      const param = {};
      if (data) {
        param.parent_region_code = data.region_code;
        param.region_type = data.region_type;
      }
      const params = data ? param : "";
      queryProvinceAndCity(params).then((res) => {
        if (res.code == "1") {
          if (!data) {
            this.provinceName = res.data.list; // 省
          } else {
            if (data.region_type === 3) {
              this.cityName = res.data.list; // 市
            } else {
              this.areaName = res.data.list;
            }
          }
        }
      });
    },
    // 省市区--下拉
    cityChange(event, data, type) {
      if (type) {
        if (type === "2") {
          (this.form.address_city = ""), (this.form.county_code = "");
          this.cityName = [];
          this.areaName = [];
        } else {
          this.form.county_code = "";
          this.areaName = [];
        }
      }
      let obj = {};
      data &&
        data.forEach((item) => {
          if (item.region_name === event) {
            if (item.region_type == "4") {
              this.city_name = item.region_code;
            }
            obj = {
              region_code: item.region_code,
              region_type: item.region_type - 0 + 1,
            };
          }
        });
      if (data && obj.region_type <= "4") {
        this.city(obj);
      }
    },
    // 导出结果集
    comfig() {
      const params = {
        fileId: this.resultId,
        fileName: this.file_name,
      };
      editFileName(params).then((res) => {
        if (res.code === "1") {
          this.resultSetDialog = false;
        }
      });
    },
    // 查询
    searchSubmit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.evaluation();
        }
      });
    },
    // 重置
    reset() {
      Object.keys(this.form).forEach((key) => {
        this.form[key] = "";
      });
      this.cityName = [];
      this.areaName = [];
    },
    // 批量发送短信
    batchShort() {
      this.listAll("批量发送短信");
      const params = {};
      smsTemplate(params).then((res) => {
        this.options = res.data;
      });
    },
    messageChange(id) {
      let list;
      list = this.options.filter((item) => {
        return id === item.id;
      });
      list.map((item) => {
        this.ruleForm.brand_content = item.template_content;
        this.templateType = true;
      });
    },
    // 发送批量发送短信
    configDialog() {
      const that = this;
      const params = {
        phone_numbers: JSON.stringify(that.getChecked("批量发送短信")), //手机号码
        template_code: this.ruleForm.message, //短信模板
        brand_code: this.ruleForm.brand_code, //品牌
      };
      batchSendMsg(params).then((res) => {
        if (res.code == "1") {
          this.messageDialog = false;
        }
      });
    },
    // 导出
    exporTresult(type) {
      this.file_name = "";
      this.dialogType = type;
      if (type === "导出结果集") {
        this.listAll("导出结果集");
      } else {
        this.listAll("导出选中");
      }
    },
    listAll(type) {
      const listArr = this.getChecked(type);
      let name = "";
      if (listArr.length > 0) {
        if (type === "批量发送短信") {
          this.messageDialog = true;
          listArr.map((item, index) => {
            const key = Object.keys(item)[0];
            name += key + ":" + "(" + item[key] + ")" + "\xa0\xa0";
          });
          this.ruleForm.name = name;
        } else if (type === "导出结果集" || type === "导出选中") {
          // 暂时显示
          const params = {
            orderNoList: Array.from(this.getChecked(type)),
          };
          importResultSet(params).then((res) => {
            if (res.code === "1") {
              this.resultSetDialog = true;
              this.resultId = res.data.id;
            }
          });
        }
      } else {
        this.popupFail = true;
      }
      // 弹框数据内容为初始状态
      Object.keys(this.ruleForm).forEach((key) => {
        if (key !== "name") {
          this.ruleForm[key] = "";
        }
      });
    },
    getChecked(type) {
      console.log(type,'type')
      const listArr = [];
      this.checkedArr.map((item) => {
        if (type === "批量发送短信") {
          const params = {
            // name:item.receiver_name,
            // mobile: item.receiver_mobile
          };
          params[item.receiver_name] = item.receiver_mobile;
          this.member_id = item.order_no;
          listArr.push(params);
        } else if (type === "导出选中" || type === "导出结果集") {
          listArr.push(item.order_no);
        }
      });
      return listArr;
    },
    //物流信息
    logisticsInformationButton(item) {
      console.log(item, "物流信息");
      this.logisticsInformation = true;
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
<style lang="scss" scoped>
@import "./scss/evaluate.scss";
@import "./scss/componets.scss";
</style>

