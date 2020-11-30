<template>
  <div class="security-center">
    <div class="security-information">
      <ol class="security-longin">
        <li>账号登录锁定</li>
        <li>
          <div class="security-input">
            在
            <el-input
              type="number"
              min="0"
              v-model="sign"
              @blur="signInput(sign, 'sign')"
              onkeyup="this.value=this.value.replace(/\D/g,'')"
            /><span>分钟内</span>,
          </div>
          <div class="security-input">
            连续登录失败
            <el-input
              type="number"
              min="0"
              v-model="frequency"
              @blur="signInput(frequency, 'frequency')"
              onkeyup="this.value=this.value.replace(/\D/g,'')"
            />次,
          </div>
          <div class="security-input">
            锁定账号
            <el-input
              type="number"
              min="0"
              v-model="locking"
              @blur="signInput(locking, 'locking')"
              onkeyup="this.value=this.value.replace(/\D/g,'')"
            />
            分钟
          </div>
        </li>
      </ol>
      <ol class="security-longin">
        <li>账号登录失效</li>
        <li>
          <div class="security-input">
            登录后在
            <el-input
              type="number"
              min="0"
              v-model="hour_invalid"
              @blur="signInput(hour_invalid, 'hour_invalid')"
              onkeyup="this.value=this.value.replace(/\D/g,'')"
            /><span 
              ><el-select
                v-model="hour_time"
                :label="value"
                placeholder="请选择"
                class="time_arrowm"
              >
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option> </el-select
              >内未操作,需要登录</span
            >,
          </div>
        </li>
      </ol>
      <ul class="security-towLongin">
        <li>登录二次手机验证</li>
        <li>
          <div class="security-phone">
            <span>*</span>
            <span>登录手机验证短信:</span>
          </div>
          <div class="security-enable">
            <el-radio v-model="start" label="1" @change="startChange"
              >启用</el-radio
            >
            <el-radio v-model="start" label="2" @change="startChange"
              >停用</el-radio
            >
          </div>
        </li>
      </ul>
      <ul class="security-service">
        <li>账号停用策略</li>
        <li>
          <div class="security-out">
            <span>如果账号在有效期内未使用过,则将被停用</span>
            <el-switch
              v-model="value"
              active-color="#13ce66"
              inactive-color="#DCDFE6"
            ></el-switch>
          </div>
          <span v-if="value" class="security-input">
            账号有效期
            <el-input
              type="number"
              min="1"
              v-model="use"
              @blur="day(use, 'use')"
              onkeyup="this.value=this.value.replace(/\D/g,'')"
            />
          </span>
          <template v-if="value">天</template>
        </li>
      </ul>
      <ul class="security-service">
        <li>密码更换策略</li>
        <li>
          <div class="security-out">
            <span>密码过期后,系统强制要求修改密码</span>
            <el-switch
              v-model="password"
              active-color="#13ce66"
              inactive-color="#DCDFE6"
            ></el-switch>
          </div>
          <span v-if="password" class="security-input">
            密码有效期是
            <el-input
              type="number"
              min="1"
              size="6"
              v-model="overdue"
              @blur="day(overdue, 'overdue')"
              onkeyup="this.value=this.value.replace(/\D/g,'')"
            />
          </span>
          <template v-if="password">天,</template>
        </li>
      </ul>
    </div>
    <el-dialog
      title="提示"
      :visible.sync="Errodialog"
      width="30%"
      :show-close="false"
    >
      <span>修改内容不能为空,请补全修改内容</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="Errodialog = false">确 定</el-button>
      </span>
    </el-dialog>
    <div class="form_footer">
      <el-row>
        <el-button type="primary" @click.native="preservation">保存</el-button>
        <el-button @click.native="revert">取消</el-button>
      </el-row>
    </div>
  </div>
</template>
<script>
import { editLoginPlanSet, queryLoginPlanSet } from "@/api/security/visit";
export default {
  name: "information",
  data() {
    return {
      start: "1", //启用单选按钮
      value: true, //账号停用开关
      password: true, //密码开关
      sign: "",
      frequency: "",
      locking: "",
      use: "",
      overdue: "",
      is_msg_verify: "",
      loading: false,
      name: "登录策略",
      obj: {},
      valueBoole: "Y",
      passwordBool: "Y",
      Errodialog: false,
      signBoole: "",
      hour_invalidBoole: "",
      signNumber: "",
      frequencyBoole: false,
      lockingBoole: false,
      hour_invalid: "",
      options: [
        {
          value: "DAYS",
          label: "天",
        },
        {
          value: "HOURS",
          label: "小时",
        },
        {
          value: "MINUTES",
          label: "分钟",
        },
      ],
      hour_time: "DAYS",
    };
  },
  props: ["defaultPage"],
  mounted() {
    if (this.use <= 0) {
      this.use = 1;
    }
    if (this.overdue <= 0) {
      this.overdue = 1;
    }
    if (this.hour_invalid <= 0) {
      this.hour_invalid = 1;
    }
  },
  methods: {
    //登录账户锁定
    day(type, name) {
      console.log(type, name, "dd");
      if (type <= 0 && name == "use") {
        this.use = 1;
        this.openTime();
      }
      if (type <= 0 && name == "overdue") {
        this.overdue = 1;
        this.openTime();
      }
    },

    //停用天数
    signInput(type, name) {
      console.log(type, name, "type");
      if (type < 0) {
        if (name == "sign") {
          this.sign = 0;
        }
        if (name == "frequency") {
          this.frequency = 0;
        }
        if (name == "locking") {
          this.locking = 0;
        }
        if (name == "hour_invalid") {
          this.hour_invalid = 0;
        }
        this.openTime();
      }
    },
    openTime() {
      this.$message({
        message: "输入的值不能小于1",
        type: "warning",
      });
    },
    //保存
    preservation() {
      if (this.sign >= 0 && this.sign !== "") {
        this.signBoole = true;
      }
      if (this.hour_invalid >= 0 && this.hour_invalid !== "") {
        this.hour_invalidBoole = true;
      }
      if (this.frequency >= 0 && this.frequency !== "") {
        this.frequencyBoole = true;
      }
      if (this.locking >= 0 && this.locking !== "") {
        this.lockingBoole = true;
      }
      if (
        this.sign === "" ||
        this.frequency === "" ||
        this.locking === "" ||
        (this.password == true && this.use === "") ||
        (this.value == true && this.overdue == "") ||
        this.hour_invalid == ""
      ) {
        this.Errodialog = true;
      } else if (
        (this.password == false && this.use == "") ||
        (this.value == false && this.overdue == "") ||
        this.signBoole ||
        this.frequencyBoole ||
        this.lockingBoole
      ) {
        this.is_msg_verify = this.start == "1" ? "Y" : "N";
        this.valueBoole = this.value ? "Y" : "N";
        this.passwordBoole = this.password ? "Y" : "N";
        console.log(this.hour_time, "this.hour_time");
        let params = {
          time_interval: this.sign,
          fail_times: this.frequency,
          time_lock: this.locking,
          is_use_valid_time: this.valueBoole,
          is_msg_verify: this.is_msg_verify,
          account_valid_time: this.use,
          is_use_pwd_change: this.passwordBoole,
          password_valid_time: this.overdue,
          logout_without_operation_time: this.hour_invalid,
          logout_time_unit: this.hour_time,
        };
        editLoginPlanSet(params)
          .then((res) => {
            this.loading = false;
            console.log(res, "res111");
            if (res.code == "1") {
              this.open1();
            }
          })
          .catch((fail) => {
            this.loading = false;
          });
      }
    },
    revert() {
      this.$router.go(-1);
    },
    async open1() {
      this.$message({
        message: "保存成功",
        type: "success",
      });
    },
    async open() {
      this.$alert("修改内容不能为空,请补全修改内容", "错误弹窗", {
        confirmButtonText: "确定",
        callback: (action) => {
          this.$message({
            type: "info",
            message: `action: ${action}`,
          });
        },
      });
    },
    startChange(e) {
      this.start = e;
    },
    //查询的方法
    polling() {
      let params = {};
      queryLoginPlanSet(params)
        .then((res) => {
          this.loading = false;
          this.obj = res.data;
          this.sign = this.obj.time_interval;
          this.frequency = this.obj.fail_times;
          this.locking = this.obj.time_lock;
          this.start = this.obj.is_msg_verify == "Y" ? "1" : "2";
          this.value = this.obj.is_use_valid_time == "Y" ? true : false;
          this.use = this.obj.account_valid_time;
          this.password = this.obj.is_use_pwd_change == "Y" ? true : false;
          this.overdue = this.obj.password_valid_time;
          this.hour_time = this.obj.logout_time_unit;
          this.hour_invalid = this.obj.logout_without_operation_time;
        })
        .catch((fail) => {
          this.loading = false;
        });
    },
  },
  mounted() {
    console.log("8882");
    this.polling();
  },
};
</script>
<style lang="less" scoped>
/deep/ .el-tabs__content {
  flex: 1 !important;
}
/deep/ .el-input {
  width: 82px !important;
}
/deep/ .el-button--primary {
  background-color: #435a82;
  border-color: #435a82;
}
.security-center {
  max-height: calc(100vh - 100px);
  padding-top: 40px;
  background: #fff;
  padding-left: 30px;
  .security-information {
    display: flex;
    flex-direction: column;
    .security-longin {
      display: flex;
      flex-direction: column;
      margin-bottom: 40px;
      li:first-of-type {
        font-size: 14px;
        color: #606266;
        font-weight: Bold;
        margin-bottom: 25px;
      }
      li:last-of-type {
        display: flex;
        align-items: center;
        span {
          font-size: 13px;
          display: inline-block;
          color: #606266;
          font-weight: Regular;
          input {
            border: 0;
            background: 0;
            display: inline-block;
            width: 60px;
            height: 22px;
            line-height: 22px;
            font-size: 13px;
            text-align: center;
            border: 1px solid #dcdfe6;
            border-radius: 5px;
            margin: 0 6px;
            color: #606266;
            font-weight: Regular;
          }
        }
      }
    }
    .security-towLongin {
      display: flex;
      flex-direction: column;
      margin-bottom: 40px;
      li:first-of-type {
        font-size: 14px;
        color: #606266;
        font-weight: Bold;
        margin-bottom: 25px;
      }
      li:last-of-type {
        display: flex;
        align-items: center;
        .security-phone {
          margin-right: 30px;
          span {
            font-size: 13px;
            color: #606266;
            font-weight: Regular;
            display: inline-block;
          }
          span:first-of-type {
            color: #f78e8e;
          }
          span:last-of-type {
            color: #606266;
          }
        }
        .security-enable {
          /deep/ .el-radio {
            margin-right: 21px;
          }
          /deep/ .el-radio__label {
            font-size: 13px;
            color: #606266;
            font-weight: SourceHanSansCN-Regular;
          }
        }
      }
    }
    .security-service {
      display: flex;
      flex-direction: column;
      margin-bottom: 25px;
      li:first-of-type {
        font-size: 14px;
        color: #606266;
        font-weight: Bold;
        margin-bottom: 25px;
      }
      //input框架
      li:nth-of-type(2) {
        span {
          font-size: 15px;
          margin-right: 10px;
          color: #606266;
        }
        span:last-of-type {
          display: inline-block;
          margin-bottom: 10px;
        }
        .security-out {
          margin-bottom: 8px;
          span {
            color: #606266;
            font-size: 13px;
            font-weight: Regular;
          }
          /deep/.el-switch__core {
            height: 16px;
            top: -2px;
          }
          /deep/ .el-switch__core:after {
            top: -1px;
          }
        }
      }
    }
    .security-input {
      display: flex;
      align-items: center;
      /deep/ .el-input {
        .el-input__inner {
          height: 22px;
          width: 59px;
          padding-right: 1px;
          border-radius: 4px;
          margin-left: 6px;
        }
      }
      .time_arrowm {
        /deep/ .el-input__suffix {
          padding-top: 28px !important;
        }
      }
    }
    .security-input:first-of-type,
    .security-input:nth-of-type(2),
    .security-input:nth-of-type(3) {
      /deep/ .el-input {
        /deep/ .el-input__inner {
          width: 67px;
        }
      }
    }
  }
  .security-footer {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>