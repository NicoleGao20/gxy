<template>
  <div class="crm-portrait-container">
    <div class="crm-portrait">
      <p class="titleStyle">基础信息</p>
      <el-row class="info">
        <el-form ref="form" :model="form" label-width="100px" class="crm-portrait-form">
          <!-- <el-col :span="11" class="infoLeft"> -->
          <el-row >
            <el-col :span="2"><img src="@/assets/404_images/404.png" alt="" class="avatar"></el-col>
            <el-col :span="4">
              <el-form-item label-width="65px" label="姓名">
                <span v-if="!nameBoolean" >{{ form.name }}</span>
                <el-input v-if="nameBoolean" v-model="form.name"/>
                <!-- <i class="el-icon-edit" @click="editCrmInfo('name')"/> -->
              </el-form-item>
              <el-form-item label-width="65px" label="性别">
                <span v-if="!nameBoolean" >男</span>
                <el-input v-if="nameBoolean" v-model="form.name"/>
                <!-- <i class="el-icon-edit" @click="editCrmInfo('name')"/> -->
              </el-form-item>
              <el-form-item label-width="65px" label="英文名">
                <span>横冲zz</span>
              </el-form-item>
              <el-form-item label-width="65px" label="微信昵称">
                <span>横冲zz</span>
              </el-form-item>
              <el-form-item label-width="65px" label="生日">
                <span> 19940924</span>
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <el-form-item label="年龄" >
                <span v-if="!nameBoolean" >411628199409240649</span>
                <el-input v-if="nameBoolean" v-model="form.name"/>
                <!-- <i class="el-icon-edit" @click="editCrmInfo('name')"/> -->
              </el-form-item>
              <el-form-item label="会员账号">
                <span>1566666666</span>
              </el-form-item>
              <el-form-item label="婚姻状态">
                jason
              </el-form-item>
              <el-form-item label="星座">
                <span>横冲zz</span>
              </el-form-item>
              <el-form-item label="身份证">
                <span v-if="!nameBoolean"> 411628190909240609</span>
                <el-input v-if="nameBoolean" v-model="form.name"/>
                <!-- <i class="el-icon-edit" @click="editCrmInfo('name')"/> -->
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <el-form-item label="手机">
                <span>1566666666</span>
              </el-form-item>
              <el-form-item label="会员等级">
                jason
              </el-form-item>
              <el-form-item label="会员类型">
                <span>横冲zz</span>
              </el-form-item>
              <el-form-item label="当前关注状态">
                <span v-if="!nameBoolean"> 上海莘庄龙之梦</span>
                <el-input v-if="nameBoolean" v-model="form.name"/>
                <!-- <i class="el-icon-edit" @click="editCrmInfo('name')"/> -->
              </el-form-item>
              <el-form-item label="等级到期日期" >
                <span>21312388</span>
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <el-form-item label="注册时间" >
                <span v-if="!nameBoolean" >411628199409240649</span>
                <el-input v-if="nameBoolean" v-model="form.name"/>
                <!-- <i class="el-icon-edit" @click="editCrmInfo('name')"/> -->
              </el-form-item>
              <el-form-item label="注册门店">
                <span>1566666666</span>
              </el-form-item>
              <el-form-item label="注册来源">
                jason
              </el-form-item>
              <el-form-item label="付费会员">
                <span>横冲zz</span>
              </el-form-item>
              <el-form-item label="会员身份">
                <span v-if="!nameBoolean"> 上海莘庄龙之梦</span>
                <el-input v-if="nameBoolean" v-model="form.name"/>
                <!-- <i class="el-icon-edit" @click="editCrmInfo('name')"/> -->
              </el-form-item>
            </el-col>
          </el-row >
          <!-- </el-col> -->
          <!-- <el-col :span="13"> -->
          <!-- <div class="infoRight" >
              <div class="ad-status filter-btns" style="font-size: 12px;">
                <ul>
                  <li v-for="(adStatusItem, index) in adStatusItems" :key="index" :class="{'on': adStatusItem.value == ISSUE_STATUS }" @click="filterFun(adStatusItem.value)">{{ adStatusItem.label }}</li>
                </ul>
              </div>
            </div> -->
          <!-- </el-col> -->
        </el-form>
      </el-row>
    </div>
    <div class="crm-portrait">
      <div class="ad-status filter-btns" style="font-size: 12px;padding: 20px 10px 0 10px;">
        <ul>
          <li
            v-for="(adStatusItem, index) in adStatusItems"
            :key="index"
            :class="{'on': adStatusItem.value == ISSUE_STATUS }"
            @click="filterFun(adStatusItem.value)">
            {{ adStatusItem.label }}
          </li>
        </ul>
      </div>
      <div class="overview">
        <el-row :gutter="20">
          <el-col v-for="element in chartArr" :key="element.id" :xs="6" :sm="3" :md="3" :lg="3" :xl="3" class="allChartModuleBox">
            <component :is="currentTabComponent[ISSUE_STATUS]" :chart-object="element"/>
          </el-col>
        </el-row >
      </div>
    </div>
    <div class="crm-portrait">
      <p class="titleStyle">行为轨迹</p>
      <el-row :gutter="10" class="condition">
        <el-col :span="4">
          <el-select v-model="valuee" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"/>
          </el-select>
        </el-col>
        <el-col :span="5">
          <el-input v-model="input" placeholder="请输入订单号/优惠券/券号"/>
        </el-col>
      </el-row>
      <el-row :gutter="40" class="behavior">
        <el-col :span="9">
          <div class="grid-content bg-purple">
            <CrmCard :crm-card-list="CrmCardList"/>
          </div>
        </el-col>
        <el-col :span="14">
          <div class="grid-content bg-purple">
            揉揉揉揉揉揉
          </div>
        </el-col>
      </el-row>
    </div>
    <div class="crm-portrait">
      <p class="titleStyle">收货地址</p>
      <el-table
        :data="tableData"
        :header-cell-style="{background:'#F5F7FA',color:'#333333'}"
        class="crm-portrait-table"
        border
        style="width: 100%;margin:15px 0;">
        <el-table-column
          prop="date"
          label="日期"
          width="180"/>
        <el-table-column
          prop="name"
          label="姓名"
          width="180"/>
        <el-table-column
          prop="address"
          label="地址"/>
      </el-table>
    </div>
  </div>
</template>
<script>
import CrmCard from '@/componentsMarketing/crmPortraitCard/crmCard.vue'
import CrmCommon from '@/componentsMarketing/crmPortraitCard/crmCommon.vue'
import CrmLabelCard from '@/componentsMarketing/crmPortraitCard/crmLabelCard.vue'
export default {
  name: 'MarketingList',
  components: {
    CrmCard,
    CrmCommon,
    CrmLabelCard
  },
  data() {
    return {
      chartArr: [{
        id: 1,
        label: '偏好发售商品系列',
        value: '5000'
      }, {
        id: 2,
        label: '报名活动类型偏好',
        value: '5000'
      }],
      currentTabComponent: {
        'YESTERDAY': 'CrmCommon'
      },
      adStatusItems: [{
        label: '消费总揽',
        value: 'YESTERDAY'
      }, {
        label: '积分总览',
        value: 'THIS_WEEK'
      }, {
        label: '购买偏好',
        value: 'THIS_MONTH'
      }, {
        label: '会员互动',
        value: 'LAST_MONTH'
      }, {
        label: '限量发售',
        value: 'LAST_THREE_MONTH'
      }, {
        label: '会员标签',
        value: 'ee'
      }],
      ISSUE_STATUS: 'YESTERDAY',
      actValue: '',
      valuee: '',
      value4: '',
      input: '',
      tableData: [],
      nameBoolean: false,
      form: {
        name: 'xxs'
      },
      CrmCardList: [{
        name: '默认模版',
        des: 1,
        time: '2019-02-09'
      },
      {
        name: '模版',
        des: 2,
        time: '2019-02-09'
      }],
      options: [
        {
          label: '默认模版',
          value: 1
        },
        {
          label: '模版',
          value: 2
        },
        {
          label: '模版2',
          value: 3
        }
      ]
    }
  },
  mounted() {
  },
  methods: {
    editCrmInfo(name) {
      if (name === 'name') {
        this.nameBoolean = true
      }
    },
    filterFun(adStatus) {
      this.ISSUE_STATUS = adStatus
    }
  }
}
</script>
<style lang="less"   >
.crm-portrait-form{
  .el-form-item--small .el-form-item__label{
    font-size: 12px;
    color: #666666;
    line-height: 22px;
  }
  .el-form-item--small .el-form-item__content , .el-input--small .el-input__inner{
    line-height: 22px;
    height:22px;
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
.crm-portrait-container {
  background-color: #F1F1F1;
  padding: 15px;
  .crm-portrait{
    background-color: #fff;
    margin-bottom: 15px;
    .info{
      padding: 0 15px 10px 15px;
      .crm-portrait-form{
        color: #666666;
        label{
          color: red;
        }
        .avatar{
          width:76px;
          display: block;
          height: 76px;
          width: 76px;
          border: 1px solid #bfbf47;
         float: left;
        }
        .el-form-item{
          .el-icon-edit{
            position: absolute ;
            top: 1px;
            right: 2px;
            color: #435A82
          }
        }
        .infoRight ,.infoLeft{
            border: 1px dashed #D8DCE6;
            padding-top: 10px;
          }
          .infoRight{
            height: 371px;
            overflow-y: scroll;
            margin-left: 10px;
            padding-left: 10px;
            .filter-btns ul li {
              padding: 0 5px;
            }
          }
          .infoLeft{
            padding-right: 10px;
          }
      }
    }
    .titleStyle{
        position: relative;
        padding-left: 23px;
        padding-top: 15px;
        padding-bottom: 15px;
      &:before{
        content: "";
        position: absolute;
        top: 17px;
        left: 14px;
        width: 2px;
        height: 12px;
        background-color: #3c5175;
      }
    }
    .crm-portrait-table{
      padding: 0 15px;
      margin: 0;
    }
    .overview{
      padding: 0 20px;
      min-height: 200px;
      margin-top: 20px;
    }
  }
  .condition{
    padding: 5px 0 15px 15px;
  }
  .behavior{
    padding:  0  0  15px 15px;
  }
}
</style>
