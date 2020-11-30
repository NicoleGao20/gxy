<template>
  <div class="rangers">
    <div
      :class="{'mt-input__ranger-mini': size=='mini', 'mt-input__ranger-middle': size=='middle', 'mt-input__ranger-large': size=='large', 'is-focus': isFocus}"
      :style="{width: width}"
      class="mt-input__ranger"
    >
      <div class="pre-wrapper">
        <el-input-number
          :controls="false"
          :placeholder="prePlaceholder"
          v-model="numberChange[0]"
          @change="numberInput()"
          @focus="isFocus = true"
          @blur="isFocus = false"
        />
      </div>
      <span class="connect">{{ connectText }}</span>
      <div class="append-wrapper">
        <el-input-number
          :controls="false"
          :placeholder="appendPlaceholder"
          v-model="numberChange[1]"
          @change="numberInput()"
          @focus="isFocus = true"
          @blur="isFocus = false"
        />
      </div>
      <div style="margin-left:10px;float:left;height:32px;">
        <el-radio-group v-model="tabPosition" style="margin-bottom: 30px;" @change="copy">
          <el-radio-button
            v-for="(item,index) in promptValues"
            :label="item.type"
            :key="index"
          >{{ item.start==""?'全部':item.start+"~"+item.end+"("+unit+")" }}</el-radio-button>
        </el-radio-group>
      </div>
      <div v-if="numberChange.length>0" class="clear-wrapper" />
    </div>
  </div>
</template>
<script>
export default {
  name: "InputRanges",
  props: {
    width: { type: String, default: "auto" },
    size: { type: String, default: "mini" },
    prePlaceholder: { type: String, default: "开始" },
    connectText: { type: String, default: "-" },
    appendPlaceholder: { type: String, default: "结束" },
    promptValues: {
      type: Array,
      default: () => {
        return [];
      }
    },
    unit: { type: String, default: "" },
    value: {
      type: Number,
      default: null
    }
  },
  data() {
    return {
      numberRange: [],
      isFocus: false,
      tabPosition: "all"
    };
  },
  computed: {
    numberChange() {
      const self = this;
      self.numberRange = self.value || [];
      if (self.numberRange[0] == 0) {
        self.numberRange[0] = undefined;
      }
      if (self.numberRange[1] == 0) {
        self.numberRange[1] = undefined;
      }
      if (self.numberRange[1] != undefined) {
        if (self.numberRange[0] == undefined || self.numberRange[0] == 0) {
          self.numberRange[0] = 0;
        }
      }
      return self.numberRange;
    }
  },
  mounted() {
    const self = this;
    self.numberRange = self.value;
  },
  methods: {
    copy(val) {
      const self = this;
      self.promptValues.map((item, index) => {
        if (item.type == val) {
          var end = item.end == "以上" ? "" : item.end;
          self.numberRange = [item.start, end];
          self.$emit("input", self.numberRange);
        }
      });
    },
    numberInput() {
      const self = this;
      self.$emit("input", self.numberRange);
    },
    clear() {
      const self = this;
      self.numberRange = [];
      self.$emit("input", self.numberRange);
    }
  }
};
</script>
<style  lang="scss">
.rangers {
  :-moz-placeholder {
    color: #c0c4cc;
  }
  ::-moz-placeholder {
    color: #c0c4cc;
  }
  input:-ms-input-placeholder {
    color: #c0c4cc;
  }
  input::-webkit-input-placeholder {
    color: #c0c4cc;
  }
  .mt-input__ranger {
    // border: 1px solid #DCDFE6;border-radius: 4px;position: relative;transition: border-color .3s ease 0s;
    input {
      // border: none;outline: none;width: 100%;height: 100%;display: block;text-align: center;
      // background: none;
      // color: #606266;
    }
  }
  .mt-input__ranger-mini {
    height: 28px;
    line-height: 28px;
    box-sizing: border-box;
  }
  .mt-input__ranger-middle {
    height: 30px;
    line-height: 30px;
    box-sizing: border-box;
  }
  .mt-input__ranger-large {
    height: 32px;
    line-height: 32px;
    box-sizing: border-box;
  }
  .append-wrapper,
  .pre-wrapper {
    float: left;
    height: 100%;
    width: calc((50% - 26px) / 2);
    .el-input-number {
      width: 100%;
      input {
        // border: none;
        // background: none;
      }
    }
  }
  .pre-label {
    width: 20px;
    height: 100%;
    float: left;
  }
  .pre-label img {
    width: 100%;
    height: 100%;
    display: block;
  }
  .connect {
    float: left;
    width: 25px;
    height: 100%;
    text-align: center;
  }
  .clear-wrapper {
    width: 30px;
    height: 100%;
    position: absolute;
    right: 10px;
    top: 0;
    text-align: center;
  }
  .clear {
    width: 14px;
    height: 14px;
    background: #c0c4cc;
    border-radius: 8px;
    float: left;
    text-align: center;
    line-height: 14px;
    font-size: 14px;
    color: #fff;
    cursor: pointer;
    position: absolute;
    left: 50%;
    margin-left: -7px;
    top: 50%;
    margin-top: -7px;
    display: none;
  }
  .clear-wrapper:hover .clear {
    display: block;
  }
  .is-focus {
    border-color: #aaa;
    transition: border-color 0.3s ease 0s;
  }
}
</style>
