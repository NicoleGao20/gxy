<template>
  <el-dialog
    :fullscreen="true"
    :visible="visible"
    class="dialog"
    @close="$emit('close')"
  >
    <div slot="title" class="title">
      会员属性筛选
    </div>
    <main class="mainWrapper">
      <div class="attrCategory">
        <p>选择下面会员属性组成需要营销人群</p>
        <div class="choseArea">
          <el-row class="title">基础属性</el-row>
          <el-row style="margin-bottom: 32px;" type="flex">
            <el-col :class="{active: registerChannel}" style="margin-right:12px;" class="item" @click.native="selectAttrCategory('registerChannel')">注册渠道</el-col>
            <el-col :class="{active: membershipType}" style="margin-left:12px;" class="item" @click.native="selectAttrCategory('membershipType')">会员类型</el-col>
          </el-row>
          <el-row type="flex">
            <el-col :class="{active: publicStatus}" :span="12" style="margin-right:12px;" class="item" @click.native="selectAttrCategory('publicStatus')">公众号关注状态</el-col>
            <el-col :class="{active: membershipLevel}" :span="12" style="margin-left:12px;" class="item" @click.native="selectAttrCategory('membershipLevel')">会员等级</el-col>
          </el-row>
          <el-row class="title" style="margin-top:46px;">高级属性</el-row>
          <el-row style="margin-bottom: 32px;" type="flex">
            <el-col :class="{active: lifeCycle}" style="margin-right:12px;" class="item" @click.native="selectAttrCategory('lifeCycle')">生命周期</el-col>
            <el-col :class="{active: rfm}" style="margin-left:12px;" class="item" @click.native="selectAttrCategory('rfm')">RFM</el-col>
          </el-row>
          <el-row type="flex">
            <el-col :class="{active: clv}" :span="12" style="margin-right:24px;" class="item" @click.native="selectAttrCategory('clv')">CLV</el-col>
            <el-col :span="12"/>
          </el-row>
        </div>
      </div>
      <div class="attrSatisfy">
        <p>表示营销人群必须同时满足以下会员属性</p>
        <div class="choseArea">
          <div v-if="registerChannel" class="section">
            <el-row class="title">注册渠道<span class="delete" @click="registerChannel = false">删除</span></el-row>
          </div>
          <div v-if="membershipType" class="section">
            <el-row class="title">会员类型<span class="delete" @click="membershipType = false">删除</span></el-row>
          </div>
          <div v-if="publicStatus" class="section">
            <el-row class="title">公众号关注状态<span class="delete" @click="publicStatus = false">删除</span></el-row>
          </div>
          <div v-if="membershipLevel" class="section">
            <el-row class="title">会员等级<span class="delete" @click="membershipLevel = false">删除</span></el-row>
            <el-checkbox-group v-model="membershipLevelData">
              <el-row style="margin-top:24px;">
                <el-col :span="6"><el-checkbox label="normalMember">普卡会员</el-checkbox></el-col>
                <el-col :span="6"><el-checkbox label="goldMember">金卡会员</el-checkbox></el-col>
                <el-col :span="6"><el-checkbox label="blackMember">黑卡会员</el-checkbox></el-col>
                <el-col :span="6"><el-checkbox label="diamondMember">钻石会员</el-checkbox></el-col>
              </el-row>
              <el-row style="margin-top:24px;">
                <el-col :span="6"><el-checkbox label="paidMember">付费会员</el-checkbox></el-col>
              </el-row>
            </el-checkbox-group>
          </div>
          <div v-if="lifeCycle" class="section">
            <el-row class="title">生命周期<span class="delete" @click="lifeCycle = false">删除</span></el-row>
            <el-checkbox-group v-model="lifeCycleData">
              <el-row style="margin-top:24px;">
                <el-col :span="6"><el-checkbox label="newMember">新会员</el-checkbox></el-col>
                <el-col :span="6"><el-checkbox label="activeMember">活跃会员</el-checkbox></el-col>
                <el-col :span="6"><el-checkbox label="slientMember">沉默会员</el-checkbox></el-col>
                <el-col :span="6"><el-checkbox label="sleepMember">睡眠会员</el-checkbox></el-col>
              </el-row>
              <el-row style="margin-top:24px;">
                <el-col :span="6"><el-checkbox label="preLossMember">预流失会员</el-checkbox></el-col>
                <el-col :span="6"><el-checkbox label="lostMember">流失会员</el-checkbox></el-col>
              </el-row>
            </el-checkbox-group>
          </div>
          <div v-if="rfm" class="section">
            <el-row class="title">RFM<span class="delete" @click="rfm = false">删除</span></el-row>
          </div>
          <div v-if="clv" class="section">
            <el-row class="title">CLV<span class="delete" @click="clv = false">删除</span></el-row>
          </div>
        </div>
      </div>
    </main>
    <div slot="footer" class="footer">
      <el-button @click="handleCancel">取消</el-button>
      <el-button type="primary" @click="handleConfirm">确定</el-button>
    </div>
  </el-dialog>
</template>
<script>
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      registerChannel: false,
      membershipType: false,
      publicStatus: false,
      membershipLevel: false,
      lifeCycle: false,
      rfm: false,
      clv: false,
      membershipLevelData: [],
      lifeCycleData: [],
      registerChannelData: '',
      membershipTypeData: '',
      publicStatusData: '',
      rfmData: '',
      clvData: ''
    }
  },
  methods: {
    selectAttrCategory(key) {
      this[key] = true
    },
    handleConfirm() {
      const data = {}
      for (const key in this.$data) {
        if (!key.match(/Data/)) {
          if (this.$data[key]) {
            this.$data[key] = false
            data[key] = this.$data[key + 'Data']
            this.$data[key + 'Data'] = [] // 待定修改的逻辑 等待产品完成原型逻辑
          }
        }
      }
      this.$emit('close')
      this.$emit('handleConfirm', data)
    },
    handleCancel() {
      this.$emit('close')
    }
  }
}
</script>
<style lang="less" scoped>
  .dialog {
    .title {
      font-size: 16px;
    }
    .mainWrapper {
      display: flex;
      font-size: 12px;
      padding-top: 20px;
      .attrCategory {
        flex: 1;
        p {
          font-size: 14px;
        }
        .choseArea {
          background-color: rgb(238, 241, 247);
          padding: 26px;
          margin-top: 20px;
          .title {
            font-size: 14px;
            margin-bottom: 24px;
          }
          .item {
            text-align: center;
            padding-top: 18px;
            padding-bottom: 18px;
            background-color: #fff;
            background-origin: padding-box;
            border: 1px solid rgb(204, 204, 204);
            cursor: pointer;
          }
          .active {
            border: 1px solid rgb(54, 108, 179);
          }
        }
      }
      .attrSatisfy {
        flex: 1;
        padding-left: 24px;
        p {
          font-size: 14px;
        }
        .choseArea {
          background-color: rgb(238, 241, 247);
          padding: 26px;
          margin-top: 20px;
          .section {
            background-color: #fff;
            border: 1px solid rgb(204, 204, 204);
            padding: 20px 22px;
            margin-bottom: 30px;
            .title {
              font-size: 14px;
              .delete {
                color: #366cb3;
                float: right;
                cursor: pointer;
              }
            }
          }
        }
      }
    }
    .footer {
      text-align: center;
    }
    /deep/ .el-dialog__header{
      border-top: 1px solid rgb(204, 204, 204);
      border-left: rgb(204, 204, 204);
      border-right: rgb(204, 204, 204);
      border-top-left-radius: 8px;
      border-top-right-radius: 8px;
    }
    /deep/ .el-dialog__body {
        border: 1px solid rgb(204, 204, 204);
    }
    /deep/ .el-dialog__footer {
      border-bottom: 1px solid rgb(204, 204, 204);
      border-left: rgb(204, 204, 204);
      border-right: rgb(204, 204, 204);
      border-bottom-left-radius: 8px;
      border-bottom-right-radius: 8px;
    }
  }
</style>
