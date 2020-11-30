<template>
  <div class="point-type" v-loading.fullscreen="fullscreenLoading">
    <div class="point-type-main">
      <div class="ruler-title">
        <p>交易积分规则</p>
      </div>
      <el-table :data="transPoint" border style="width: 100%" v-loading="indexTableLoading">
        <el-table-column
          :resizable="false"
          prop="name"
          label="规则名称"
          width="180"
        ></el-table-column>
        <el-table-column
          :resizable="false"
          prop="detail"
          label="规则详情"
          width="450"
          :show-overflow-tooltip="true"
        ></el-table-column>
        <el-table-column
          :resizable="false"
          prop="updateTime"
          label="更新时间"
        ></el-table-column>
        <el-table-column
          :resizable="false"
          prop
          label="操作"
          width="100"
          align="center"
        >
          <template slot-scope="scope">
            <el-button type="text" @click="showForm(scope.$index, scope.row)"
              >设置</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <div class="ruler-title">
        <p>互动积分规则</p>
      </div>
      <el-table :data="interPoint" border style="width: 100%" v-loading="indexTableLoading">
        <el-table-column
          :resizable="false"
          prop="name"
          label="规则名称"
          width="180"
        ></el-table-column>
        <el-table-column
          :resizable="false"
          prop="detail"
          label="规则详情"
          width="450"
        ></el-table-column>
        <el-table-column
          :resizable="false"
          prop="updateTime"
          label="更新时间"
        ></el-table-column>
        <el-table-column
          :resizable="false"
          prop="operation"
          label="操作"
          width="100"
          align="center"
        >
          <template slot-scope="scope">
            <el-button type="text" @click="showForm(scope.$index, scope.row)"
              >设置</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <div class="ruler-title">
        <p>自定义积分规则</p>
      </div>
      <el-button type="primary" @click="jump('newPointRule')"
        >新建积分规则</el-button
      >
      <el-table :data="diyPoint" border style="width: 100%" v-loading="paginationLoading">
        <el-table-column
          :resizable="false"
          prop="rule_name"
          label="规则名称"
          width="180"
          align="center"
        ></el-table-column>
        <el-table-column
          :resizable="false"
          prop="trand_point"
          label="奖励积分"
          width="180"
          align="center"
        ></el-table-column>
        <el-table-column
          :resizable="false"
          prop="update_time"
          label="规则更新时间"
          align="center"
        ></el-table-column>
        <el-table-column
          :resizable="false"
          prop="on_status"
          label="状态"
          align="center"
          width="200"
        ></el-table-column>
        <el-table-column
          :resizable="false"
          prop="UDR_validity_start"
          label="规则有效期"
          align="center"
          width="300"
        >
        <template slot-scope="scope">
          {{scope.row.UDR_validity_start.split(' ')[0]}} 至 {{scope.row.UDR_validity_end.split(' ')[0]}}
        </template>
        </el-table-column>
        <el-table-column
          :resizable="false"
          prop="operation"
          label="操作"
          width="100"
          align="center"
        >
          <template slot-scope="scope">
            <el-button
              type="text"
              @click="jump('newPointRule', { id: scope.row.id })"
              >设置</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <pagination
        :page-num="page_num"
        :page-size="page_size"
        :pager-count="5"
        :count="counts"
        @handleSizeChange="changePageSize"
        @handleCurrentChange="changePageNum"
      />
    </div>
    <el-dialog
      title="积分通用有效期"
      :visible.sync="pointSettingForm"
    >
      <el-radio v-model="radio" :label="0">永久有效</el-radio>
      <div class="space"></div>
      <el-radio v-model="radio" :label="1">
        从获得开始至
        <el-select
          v-model="startYear"
          placeholder="请选择"
          @change="startDate = ''"
        >
          <el-option
            v-for="item in startYearList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
        <div class="date-select">
          <el-cascader
            v-model="startDate"
            :options="dateSelectOptions"
            :props="{ expandTrigger: 'hover' }"
            separator=" "
          ></el-cascader>
        </div>
        <span class="warning">{{ startDateWarning }}</span>
      </el-radio>
      <p class="tip">
        示例∶若设置为“1年后的01月01日”，则用户在2018年05月01日获得的积分，将在2019年01月01日00:00:00失效
      </p>
      <div class="space"></div>
      <el-radio v-model="radio" :label="2">
        每笔积分有效期为
        <el-select v-model="validDate" placeholder="请选择">
          <el-option
            v-for="item in validDateList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
        <span class="warning">{{ validDateWarning }}</span>
      </el-radio>
      <div slot="footer">
        <el-button @click="pointSettingForm = false">取 消</el-button>
        <el-button type="primary" @click="sendPointSettingForm"
          >确 定</el-button
        >
      </div>
    </el-dialog>
    <el-dialog title="交易送积分" :visible.sync="givePointForm">
      <div class="formBox">
        基础规则： 每成功交易
        <double-number-input class="elInput" :val="money" type="double" name="元" @inputValue="setMoney"/>
        赠送
        <double-number-input class="elInput" :val="getPoint" name="积分" @inputValue="setGetPoint"/>
      </div>
      <div class="formBox" style="line-height: 28px">
        会员特权：
        <point-type-input-box
          class="memberList"
          @boxChange="setGivePointData"
          :formData="givePointData"
        />
      </div>
      <div class="formBox">
        取舍模式：
        <el-select v-model="roundMode" placeholder="请选择">
          <el-option
            v-for="item in roundModeList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </div>
      <div slot="footer">
        <el-button @click="givePointForm = false">取 消</el-button>
        <el-button type="primary" @click="sendGivePointForm"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getRuleList, getOneRule, getDiyRuleList, setEditIntegral, getTransaction, updateTransaction } from "@/api/markting/pointType";
import pagination from "@/componentsMarketing/pagination/pagination";
import pointTypeInputBox from "@/componentsMarketing/pointTypeInputBox/pointTypeInputBox";
import doubleNumberInput from "@/componentsMarketing/doubleNumberInput/doubleNumberInput"
export default {
  name: "pointType",
  components: {
    pagination,
    pointTypeInputBox,
    doubleNumberInput
  },
  mounted() {
    this.getIndexList()
    this.getDiyList(1,10)
  },
  data() {
    return {
      transPoint: [
        {
          name: "交易送积分",
          detail: "加载中...",
          updateTime: "加载中...",
          type: 2,
          id: "",
        },
        {
          name: "积分有效期",
          detail: "加载中...",
          updateTime: "加载中...",
          type: 1,
          id: "",
        },
      ],
      interPoint: [
        {
          name: "积分有效期",
          detail: "加载中...",
          updateTime: "加载中...",
          type: 3,
          id: "",
        },
      ],
      diyPoint: [],
      //积分通用有效期表单
      pointSettingForm: false,
      radio: "",
      startYear: "",
      startDate: "",
      validDate: "",
      //送积分表单
      givePointForm: false,
      money: 0,
      getPoint: 0,
      roundMode: 1,
      givePointData: {
        bronzeMode: 1,
        silverMode: 1,
        goldMode: 1,
        bronze: 0,
        silver: 0,
        gold: 0,
      },
      //日期提示信息
      startDateWarning: "",
      //持续时间提示信息
      validDateWarning: "",
      //弹窗loading显示隐藏
      fullscreenLoading: false,
      //分页
      page_num: 1,
      page_size: 10,
      counts: 0,


      indexTableLoading:false,
      paginationLoading:false,

      //现在是哪个表单
      nowId:'',


      startYearList: [
        {
          value: 1,
          label: "1年后",
        },
        {
          value: 2,
          label: "2年后",
        },
        {
          value: 3,
          label: "3年后",
        },
        {
          value: 4,
          label: "4年后",
        },
        {
          value: 5,
          label: "5年后",
        },
      ],
      validDateList: [
        {
          value: 1,
          label: "1年",
        },
        {
          value: 2,
          label: "2年",
        },
        {
          value: 3,
          label: "3年",
        },
        {
          value: 4,
          label: "4年",
        },
        {
          value: 5,
          label: "5年",
        },
      ],
      roundModeList: [
        {
          value: 1,
          label: "向下取整",
        },
        {
          value: 2,
          label: "向上取整",
        },
        {
          value: 3,
          label: "四舍五入",
        },
      ],
      quotaList: [
        {
          value: 1,
          label: "定额",
        },
        {
          value: 2,
          label: "倍数",
        },
      ],
    };
  },
  methods: {
    setMoney(val){
      this.money = val
    },
    setGetPoint(val){
      this.getPoint = val
    },
    getIndexList() {
      this.indexTableLoading = true
      getRuleList().then(({ data }) => {
        this.indexTableLoading = false
        this.transPoint = [
          {
            name: "交易送积分",
            detail: this.returnDetail(data.list[1].point_validity_type,data.list[1].years_later,data.list[1].years_later_date),
            updateTime: data.list[1].update_time,
            type: 2,
            id: data.list[1].id,
          },
          {
            name: "积分有效期",
            detail: this.returnDetail(data.list[0].point_validity_type,data.list[0].years_later,data.list[0].years_later_date),
            updateTime: data.list[0].update_time,
            type: 1,
            id: data.list[0].id,
          },
        ];
        this.interPoint = [
          {
            name: "积分有效期",
            detail: this.returnDetail(data.list[2].point_validity_type,data.list[2].years_later,data.list[2].years_later_date),
            updateTime: data.list[2].update_time,
            type: 3,
            id: data.list[2].id,
          },
        ];
      }).catch(()=>{
        this.indexTableLoading = false
      })
    },
    getDiyList(pageNum,pageSize) {
      this.paginationLoading = true
      getDiyRuleList({
        pageNum,
        pageSize,
      }).then(({ data }) => {
        this.page_num = data.pagination.current;
        this.page_size = data.pagination.page_size;
        this.counts = data.pagination.total;
        this.diyPoint = data.list;
        this.paginationLoading = false
      }).catch(()=>{
        this.paginationLoading = false
      })
    },
    showForm(i, data) {
      this.nowId = data.id
      this.startYear = "";
      this.startDate = "";
      this.validDate = "";
      this.startDateWarning = "";
      this.validDateWarning = "";
      this.fullscreenLoading = true;
      if (data.type === 1 || data.type === 3) {
        this.pointSettingForm = !this.pointSettingForm;
        getOneRule({ id: data.id }).then((r) => {
        this.fullscreenLoading = false;
        if (data.type === 1 || data.type === 3) {
          this.radio = r.data.point_validity_type;
          if (r.data.point_validity_type === 1) {
            this.startYear = r.data.years_later;
            this.startDate = r.data.years_later_date.split('-').map(val=>{
              return val*1
            })
          }
          if (r.data.point_validity_type === 2) {
            this.validDate = r.data.years_later;
          }
        }
      }).catch(()=>{
        this.fullscreenLoading = false;
      })
      }
      if (data.type === 2) {
        this.givePointForm = !this.givePointForm;
        getTransaction({id:data.id}).then((r)=>{
          this.fullscreenLoading = false;
          this.money = r.data.list[0].trand_payment*1
          this.getPoint = r.data.list[0].trand_point*1
          this.givePointData = {
            bronzeMode: r.data.list[0].level_fixed_points*1,
            silverMode: r.data.list[1].level_fixed_points*1,
            goldMode: r.data.list[2].level_fixed_points*1,
            bronze: r.data.list[0].level_multi_times*1,
            silver: r.data.list[1].level_multi_times*1,
            gold: r.data.list[2].level_multi_times*1
          }
          this.roundMode = r.data.list[0].trade_off*1
        }).catch(()=>{
          this.fullscreenLoading = false;
        })
      }
    },
    jump(url, query = {}) {
      this.$router.push({ name: url, query });
    },
    sendPointSettingForm() {
      if (this.radio == 1 && (!this.startYear || !this.startDate)) {
        this.startDateWarning = "请选择日期";
      } else if (this.radio == 2 && !this.validDate) {
        this.validDateWarning = "请选择有效期";
      } else {
        this.startDateWarning = "";
        this.validDateWarning = "";
        let formObj = {
          id:this.nowId*1,
          point_validity_type:this.radio
        }
        if(this.yearsLater) formObj.years_later = this.yearsLater
        if(this.yearsLaterDate) formObj.years_later_date = this.yearsLaterDate
        setEditIntegral(formObj).then(r=>{
          this.pointSettingForm = false;
          this.getIndexList()
        }).catch(()=>{
          this.pointSettingForm = false;
        })
      }
    },
    sendGivePointForm(){
      updateTransaction({
        trade_off:this.roundMode,
        trand_payment:this.money,
        trand_point:this.getPoint,
        level_fixed_points:this.givePointData.bronzeMode,
        level_multi_times:this.givePointData.bronze,
        level_fixed_points_silver:this.givePointData.silverMode,
        level_multi_times_silver:this.givePointData.silver,
        level_fixed_points_gold:this.givePointData.goldMode,
        level_multi_times_gold:this.givePointData.gold,
        rule_id:this.transPoint[0].id
      }).then(r=>{
        this.givePointForm = false
        this.getIndexList()
      })
    },
    setGivePointData(val) {
      this.givePointData = val;
    },
    changePageSize(val) {
      this.getDiyList(1,val)
    },
    changePageNum(val){
      this.getDiyList(val,this.page_size)
    },
    returnDetail(type,year,date){
      let ruleDate = ''
      if(date){
        let dateArr = date.slice(5,10).split('-').map(val=>{
              return val*1
        })
        ruleDate ='的' + dateArr[0] + '月' + dateArr[1] + '日'
      }
      if(type == 0) return '永久有效'
      if(type == 1) return `从获得开始至${year}年后${ruleDate}`
      if(type == 2) return `每笔积分有效期为${year}年`
    }
  },
  computed: {
    dateSelectOptions: {
      get() {
        let one = [1, 3, 5, 7, 8, 10, 12];
        let getArr = (a) => {
          let res = [];
          for (let i = 1; i <= a; i++) {
            res.push({
              value: i,
              label: i + "日",
            });
          }
          return res;
        };
        let arr = [];
        for (let i = 1; i <= 12; i++) {
          if (one.indexOf(i) !== -1) {
            arr.push({
              value: i,
              label: i + "月",
              children: getArr(31),
            });
          } else if (i !== 2) {
            arr.push({
              value: i,
              label: i + "月",
              children: getArr(30),
            });
          } else {
            arr.push({
              value: i,
              label: i + "月",
              children: getArr(28),
            });
          }
        }
        return arr;
      },
    },
    yearsLater(){
      if(this.radio === 1){
        return this.startYear
      }else if(this.radio === 2){
        return this.validDate
      }else{
        return ''
      }
    },
    yearsLaterDate(){
      if(this.radio === 1 && this.startDate.length){
        let arr = this.startDate.map(val=>{
          return val.toString().padStart(2,'0')
        })
        return arr.join('-')
      }
      return ''
    }
  },
};
</script>

<style lang="scss" scoped>
.point-type {
  font-size: 12px;
  line-height: 1;
  padding: 15px;
  line-height: 1;
}
.point-type-main {
  background: #fff;
  overflow: hidden;
}
.ruler-title {
  background: #f6f6f6;
  padding: 13px 7px;
  margin: 20px 0;
  font-size: 15px;
  font-weight: bold;
}
.ruler-title p {
  padding-left: 10px;
  border-left: 5px solid rgb(67, 90, 130);
}
.space {
  height: 20px;
}
.tip {
  padding: 1em 2em;
}
.formBox {
  padding: 20px 0;
  overflow: hidden;
}
.memberList {
  display: inline-block;
  vertical-align: top;
}
.elInput {
  display: inline-block;
}
.date-select {
  display: inline-block;
}
.warning {
  color: #f00;
}
</style>
