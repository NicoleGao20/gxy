<template>
  <div class="contain-order">
    <div>
      <el-form
        ref="form"
        :model="form"
        :rules="filterRules"
        size="mini"
        label-position="left"
        label-width="90px"
      >
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="评价关键字">
              <el-input v-model="form.content" @keyup.enter.native="searchSubmit"/>
            </el-form-item>
          </el-col>
          <el-col v-show="isMoreinquiries" :span="6">
            <el-form-item label="会员昵称:">
              <el-input v-model="form.member_nick" @keyup.enter.native="searchSubmit"/>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="SKU ID:">
              <el-input v-model="form.sku" @keyup.enter.native="searchSubmit"/>
            </el-form-item>
          </el-col>
          <el-col v-show="isMoreinquiries" :span="6">
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
          <el-col v-show="isMoreinquiries" :span="6">
            <el-form-item label="订单来源:">
              <el-select
                v-model="form.platform_name"
                multiple
                placeholder="请选择"
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
          <el-col :span="6">
            <el-form-item label="评价类型">
              <el-select
                v-model="form.evaluation_type"
                multiple
                placeholder="请选择"
              >
                <el-option
                  v-for="item in evaluateContain"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <!-- prop="order_no" -->
            <el-form-item label="订单编号:">
              <el-input v-model="form.order_no" @keyup.enter.native="searchSubmit"/>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="商品编号:" prop="product_code">
              <el-input v-model="form.product_code" @keyup.enter.native="searchSubmit"/>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="客户昵称:">
              <el-input v-model="form.buyer_nick" @keyup.enter.native="searchSubmit"/>
            </el-form-item>
          </el-col>
          <el-col v-show="isMoreinquiries" :span="6">
            <el-form-item label="解释人:">
              <el-input v-model="form.seller_nick" @keyup.enter.native="searchSubmit"/>
            </el-form-item>
          </el-col>


          <el-col v-show="isMoreinquiries" :span="6">
            <el-form-item label="解释关键字:">
              <el-input v-model="form.seller_reply" @keyup.enter.native="searchSubmit"/>
            </el-form-item>
          </el-col>
           <el-col v-show="isMoreinquiries" :span="6">
            <el-form-item label="评价字数:" class="contain_number">
              <div class="contain_clearance">
                <span class="monetary-container">
                  <el-form-item label-width="0">
                    <el-input
                      v-model="form.evaluation_numberStart"
                      @change="evaluationNum($event, 'start')"
                      @keyup.enter.native="searchSubmit"
                    />
                  </el-form-item>
                </span>
                <span>-</span>
                <span class="monetary-container">
                  <el-form-item label-width="0">
                    <el-input
                      v-model="form.evaluation_numberEnd"
                      @change="evaluationNum($event, 'end')"
                      @keyup.enter.native="searchSubmit"
                    />
                  </el-form-item>
                </span>
              </div>
            </el-form-item>
          </el-col>
           <el-col v-show="isMoreinquiries" :span="6" class="contain-brand">
            <el-col :span="12">
              <el-select
                v-model="form.product_id"
                placeholder="请选择:"
                prop="product_id"
              >
                <el-option
                  v-for="item in nickName"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-col><el-form-item><el-input v-model="form.product_name" clearable @keyup.enter.native="searchSubmit"/>
            </el-form-item>
          </el-col>
           <el-col v-show="isMoreinquiries" :span="12">
            <el-form-item label="评价时间:">
              <el-date-picker
                v-model="form.evaluate_time"
                type="datetimerange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                value-format="yyyy-MM-dd HH:mm:ss"
              />
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

    <div class="contain_detail">
      <ul class="contain_header">
        <li>
          <el-button type="primary" :disabled="disableButton" @click="batchInterpretation"
            >批量解释</el-button
          >
        </li>
        <li>
          <el-button type="primary" :disabled="disableButton" @click="batchShort('批量发送短信')"
            >批量发送短信</el-button
          >
        </li>
      </ul>
      <ol class="contain_nav">
        <li>
          <el-checkbox
            v-model="checkAll"
            class="check_nav"
            @change="handleCheckAllChange"
          />
          评论内容
        </li>
        <li>评论人</li>
        <li>商品信息</li>
        <li>状态&操作</li>
      </ol>
      <div class="contain_detailedInformation">
        <div class="contain_information">
          <div
            v-for="(item, index) in list"
            :key="index"
            class="contain_informationHeader"
          >
            <ul>
              <li>
                <div style="margin: 15px 0" />
                <el-checkbox
                  v-model="item.status"
                  @change="
                    handleListChange($event, index, item.status, item.order_no,item)
                  "
                />
              </li>
              <li>订单编号:{{ item.order_no }}</li>
              <li>来源:{{ item.platform_name }}</li>
              <li>付款时间:{{ item.pay_time }}</li>
            </ul>
            <div class="contain_introduce">
              <div class="contain_introduceLeft">
                <div class="contain_evaluate">
                  <div>
                    <span>商品评价:</span>
                 </div>
                  <div>
                    <span>好评!!!</span>
                    <div style="margin: 10px 0">{{ item.evaluate_time }}</div>
                    <div>
                      <img
                        src="https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1600975496129&di=b1dcf8433db1ea124997c5a947f969db&imgtype=0&src=http%3A%2F%2Fa0.att.hudong.com%2F70%2F91%2F01300000261284122542917592865.jpg"
                        alt=""
                      />
                      <img
                        src="https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1600975496129&di=b1dcf8433db1ea124997c5a947f969db&imgtype=0&src=http%3A%2F%2Fa0.att.hudong.com%2F70%2F91%2F01300000261284122542917592865.jpg"
                        alt=""
                      />
                      <span>查看全部</span>
                    </div>
                  </div>
                </div>

                <div class="contain_name">
                  <span>姓名:&nbsp;&nbsp;{{ item.receiver_name }}</span>
                  <el-tooltip class="item" effect="dark" placement="bottom">
                    <div slot="content">
                      查看{{ item.buyer_nick }}的所有订单
                    </div>
                    <div>
                      昵称:&nbsp;&nbsp;<span>{{ item.buyer_nick }}</span>
                    </div>
                  </el-tooltip>
                  <span>电话:&nbsp;&nbsp;{{ item.receiver_mobile }}</span>
                </div>
                <div class="contain_explain">
                  <div>
                    <img :src="item.product_url" alt="" />
                  </div>
                  <ul>
                    <li>
                      {{ item.product_name }}
                    </li>
                    <li>{{ item.product_name }}</li>
                    <li>商家编码:{{ item.product_code }}</li>
                    <li>实付:{{ item.amt_payment }}</li>
                  </ul>
                </div>
                <div class="contain_message">
                  <span @click="explain(item.order_no, index, item, '解释')"
                    >解释</span
                  >
                  <span @click="explain(item.order_no, index, item, '发短信')"
                    >发短信</span
                  >
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
      @loadData="polling"
    />
    <!-- //批量解释 -->
    <el-dialog
      :visible.sync="explainLogDialog"
      title="批量解释(备注信息将同步更新到店铺后台)"
      width="60%"
      class="wrap_brand"
    >
      <ol class="brand_explainLog">
        <template v-if="brand_type">
          <li>
            <span>商品描述:{{ evaluation_type }}</span>
          </li>
          <li class="information_downLog">
            <span>评价时间:{{ evaluation_time }}</span>
          </li>
        </template>
        <li class="explain_information">
          <el-form label-width="80px">
            <el-form-item label="解释信息:">
              <el-input
                :rows="5"
                v-model="explain_contain.brand_information"
                type="textarea"
              />
            </el-form-item>
          </el-form>
        </li>
      </ol>
      <span slot="footer" class="dialog-footer">
        <el-button @click="explainLogDialog = false">取 消</el-button>
        <el-button type="primary" @click="explainConfig">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :title="MessageBole ? '发送短信' : '批量发送短信'"
      :visible.sync="messageDialog"
      width="50%"
      class="wrap_brand"
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
          <el-select v-model="ruleForm.brand_code">
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
  </div>
</template>
<script>
import {
  queryEvaluationArchives,
  queryProductInfoList,
  editBatchExplainInfo,
  levelList,
  batchSendMsg,
  checkBlacklist,
  smsTemplate,
} from "@/api/markting/security/visit";
import { navBrands } from "@/api/login";
export default {
  components: {},
  data() {
    return {
      params: {
        current: 1,
        page_size: 10,
      },
      pageSizes: [10, 20, 30, 40],
      total: 0,
      options: [],
      disableButton: true,
      brandList:[],
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
      ruleForm: {
        name: "", // 接收人
        message: "", // 短信模板
        brand_content: "", // 短信内容
      },
      evaluateContain: [
        {
          value: "差评",
          label: "差评",
          id: "001",
        },
        {
          value: "中评",
          label: "中评",
          id: "002",
        },
        {
          value: "好评",
          label: "好评",
          id: "003",
        },
        {
          value: "正面",
          label: "正面",
          id: "004",
        },
        {
          value: "负面",
          label: "负面",
          id: "005",
        },
      ],
      dialogVisible: false,
      explainLogDialog: false, // 批量删除弹窗
      messageDialog: false, // 批量发送短信
      explain_contain: {
        brand_information: "", // 批量删除弹窗--解释信息
      },
      commoditGownLog: false, // 商品信息
      leve:'',
      form: {
        content: "", // 评价关键字
        evaluate_time: "", // 评价时间
        evaluation_type: "", // 评级类型
        sku: "", // SKUID
        level_name: "", // 会员等级
        leve: [],
        platform_name: "", // 订单来源
        member_nick: "", // 会员昵称
        order_no: "", // 订单编号
        product_code: "", // 商品编号
        product_info: "", // 商品信息
        buyer_nick: "", // 客户昵称
        product_name: "", // 商品名称
        evaluation_numberStart: "", // 评价字数
        evaluation_numberEnd: "", // 评价字数
        seller_nick: "", // 解释人
        seller_reply: "", // 解释关键字
        product_id: "商品名称", // 商品id
      },
      filterRules: {
        // 商品编号
        product_code: [
          {
            pattern: /^\d+$|^\d+[.]?\d+$/,
            message: "请输入数字",
          },
        ],
      },
       rules: {},
      nickName: [
        {
          value: "product_name",
          label: "商品名称",
        },
        {
          value: "product_id",
          label: "商品ID",
        },
      ],
      activeNames: ["1"], // 折叠面板
      checkAll: false, // 全选
      isIndeterminate: true, // 全选
      checkedCities: "", // 全选
      list: [], // 请求数据
      Explanation_information: "", // 解释信息
      order_no: "",
      arr: [],
      // textJudge: ['a','b','c','d','e']
      choice: false, // 批量解释是否选中
      popupFail: false, // 批量解释无选择内容弹窗
      evaluation_type: "", // 评价信息
      evaluation_time: "", // 评价时间
      isMoreinquiries: false,
      MessageBole: false,
      brand_type: false,
      checkedArr: [], //选中项
    };
  },
  mounted() {
    this.polling();
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
      this.order_no = order_no; // 订单编号
      this.list[index].status = e;
      if (!e) {
        this.checkAll = false;
        let position = this.checkedArr.findIndex(
          (item) => item.order_no === order_no
        );
        if (position !== -1) {
          this.checkedArr.splice(position, 1);
        }
      }
      if (e) {
        let position = this.checkedArr.findIndex(
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
    // 批量解释
    batchInterpretation() {
      this.listAll("批量解释", this.explain_contain);
      // 初始化
    },
    // 批量发送短信
    batchShort() {
      this.listAll("批量发送短信");
      const params = {};
      smsTemplate(params).then((res) => {
        this.options = res.data;
      });
    },
    listAll(type, typeNmae) {
      const listArr = this.getChecked(type);
      let name = "";
      if (listArr.length > 0) {
        if (type === "批量解释") {
          this.explainLogDialog = true;
        } else {
          this.messageDialog = true;
          listArr.map((item, index) => {
            const key = Object.keys(item)[0];
            name += key + ":" + "(" + item[key] + ")" + "\xa0\xa0";
          });
          this.ruleForm.name = name;
        }
      } else {
        this.popupFail = true;
      }
      // 弹框数据内容为初始状态
      if(typeNmae){
          Object.keys(typeNmae).forEach((key) => {
        if (key !== "name") {
          typeNmae[key] = "";
        }
      });
      }
     
    },
      // 黑名单
    async checkName(rule, value, callback) {
      console.log('这是啥')
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
          console.log(res,'red')
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
    // 请求数据
    polling() {
      const params = {
        pageNum: this.params.current,
        pageSize: this.params.page_size,
      };
      const {
        content,
        evaluate_time,
        evaluation_type,
        sku,
        level_name,
        platform_name,
        member_nick,
        order_no,
        product_code,
        product_info,
        buyer_nick,
        product_name,
        product_id,
        evaluation_numberStart,
        evaluation_numberEnd,
        seller_nick,
        seller_reply,
      } = this.form;
      if (evaluation_numberStart) {
        const reg = /^[0-9]*$/;
        if (!reg.test(evaluation_numberStart)) {
          this.$message.error("评价字数必须为数字且大于1");
          return;
        } else {
          if (evaluation_numberStart < 1) {
            this.$message.error("评价字数起始值必须大于1");
            return;
          }
        }
      }
      if (evaluation_numberEnd) {
        const reg = /^[0-9]*$/;
        if (!reg.test(Number(evaluation_numberEnd))) {
          this.$message.error("评价字数必须为数字且大于1");
          return;
        } else {
          if (Number(evaluation_numberEnd) < 1) {
            this.$message.error("评价字数起始值必须大于1");
            return;
          }
        }
      }
      if (Number(evaluation_numberStart) && Number(evaluation_numberEnd)) {
        if (Number(evaluation_numberStart) > Number(evaluation_numberEnd)) {
          this.$message.error("评价字数初始值不能大于终值");
          return;
        }
      }
      // 时间
      if (evaluate_time) {
        params.section_date_type = { evaluate_time };
      }
      params.fuzzy_type = {
        evaluation_type,
        member_nick,
        buyer_nick,
        seller_reply,
        level_name,
        platform_name,
      };
      const arr1 = Object.keys(params.fuzzy_type);
      arr1.map((item) => {
        if (
          !params.fuzzy_type[item] ||
          (Array.isArray(params.fuzzy_type[item]) &&
            params.fuzzy_type[item].length === 0)
        ) {
          delete params.fuzzy_type[item];
        }
      });
      params.general_type = {
        sku,
        order_no,
        product_code,
        product_info,
        seller_nick,
        [this.form.product_id]: this.form.product_name,
      };
      // 关键字
      let arr = [];
      if (this.form.content) {
        if (this.form.content.includes(" ")) {
          arr = this.form.content.trim().split(/\s+/);
        } else if (this.form.content.includes(",")) {
          arr = this.form.content.split(",");
        } else {
          arr.push(this.form.content);
        }
        params.content = arr;
      }

      const generaArr = Object.keys(params.general_type);
      generaArr.map((item) => {
        if (
          !params.general_type[item] ||
          (Array.isArray(params.general_type[item]) &&
            params.general_type[item].length === 0)
        ) {
          delete params.general_type[item];
        }
      });
      if (evaluation_numberStart || evaluation_numberEnd) {
        params.content_type = {
          content: [
            evaluation_numberStart || evaluation_numberEnd,
            evaluation_numberEnd || evaluation_numberStart,
          ],
        };
      }
      if (Object.keys(params.fuzzy_type).length === 0) {
        delete params.fuzzy_type;
      }
      if (Object.keys(params.general_type).length === 0) {
        delete params.general_type;
      }
      queryEvaluationArchives(params)
        .then((res) => {
          if (res.code == "1") {
            this.list = res.data.list.map(x => {
              return { ...x, status: false }
            })
            console.log( this.list,' this.list')
            this.params.current = res.data.pageNum || 1;
            this.params.page_size = res.data.pageSize;
            this.total = res.data.total || 0;
            if (this.checkAll) {
              this.handleCheckAllChange(true);
            }
            //解决返回上一页的时候选中项未项
            this.list.forEach((item) => {
              let position = this.checkedArr.findIndex(
                (items) => items.order_no === item.order_no
              );
              if (position !== -1) {
                item.status = true;
                // this.checkedArr.push(item);
              }
            });
          }
        })
        .catch((error) => {
          console.log(error)
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
    // 评价字数
    evaluationNum(e, type) {
      const reg = /^\+?[1-9]\d*$/;
      if (type == "start" && !this.form.evaluation_numberEnd) {
        this.form.evaluation_numberEnd = e;
      } else {
        if (!this.form.evaluation_numberStart) {
          this.form.evaluation_numberStart = e;
        }
      }
    },
    // 查询
    searchSubmit() {
      this.polling();
      this.$forceUpdate();
    },
    // 重置
    reset() {
      Object.keys(this.form).forEach((key) => {
        this.form[key] = "";
      });
    },
    // 批量解释弹框--确认按钮
    explainConfig() {
      const that = this;
      const params = {
        list: that.getChecked("批量解释"),
        explain: this.explain_contain.brand_information,
      };
      this.explainLogDialog = false;
      editBatchExplainInfo(params).then((res) => {
        if (res.code == "1") {
          this.explainLogDialog = false;
          this.success();
        }
      });
    },
    // 批量发送短信
    configDialog() {
      const that = this;
      const params = {
        list: JSON.stringify(that.getChecked("批量发送短信")),
        content: this.ruleForm.brand_content,
        noteTemplate: this.ruleForm.message,
      };
      batchSendMsg(params).then((res) => {
        if (res.code == "1") {
          this.messageDialog = false;
        }
      });
    },
    // 批量解释方法
    getChecked(type) {
      const listArr = [];
      this.checkedArr.map((item) => {
        if (item.status) {
          if (type === "批量解释") {
            listArr.push(item.order_no);
          } else {
            const params = {};
            params[item.receiver_name] = item.receiver_mobile;
            listArr.push(params);
          }
        }
      });
      return listArr;
    },
    success() {
      this.$message("操作成功");
    },
    // 解释,发短信
    explain(order_no, index, item, type) {
      if (type === "解释") {
        this.brand_type = true;
        this.evaluation_type = item.evaluation_type;
        this.evaluation_time = item.evaluate_time;
        this.explain_contain.brand_information = "";
        console.log("item", item);
      } else {
        this.ruleForm.name = "";
      }
      this.list.map((item) => {
        item.status = false;
        if (item.order_no === order_no) {
          if (type === "解释") {
            this.explainLogDialog = true;
          } else if (type === "发短信") {
            this.messageDialog = true;
            name =
              item.receiver_name +
              ":" +
              "(" +
              item.receiver_mobile +
              ")" +
              "\xa0\xa0";
            this.ruleForm.name = name;
          }
          this.list[index].status = true;
        }
      });
    },
  },
};
</script>
<style lang="scss" scoped>
@import "./scss/order.scss";
@import "./scss/componets.scss";
</style>
