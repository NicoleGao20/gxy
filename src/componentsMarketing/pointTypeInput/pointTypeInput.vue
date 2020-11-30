<template>
  <div class="box">
    {{ title }}
    <el-select
      v-model="mode"
      placeholder="请选择"
      size="mini"
      @change="sendMode"
    >
      <el-option
        v-for="item in quotaList"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      ></el-option>
    </el-select>
    <el-input v-model="value" size="mini" class="elInput" @input="sendValue">
      <template slot="append">{{ mode === 1 ? "积分" : "倍" }}</template>
    </el-input>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: "",
    },
    type: {
      type: Number,
      default: 1,
    },
    val: {
      default: 0,
    },
  },
  data() {
    return {
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
      mode: 1,
      value: 0,
    };
  },
  methods: {
    sendValue(val) {
      this.$emit("inputValue", val*1);
    },
    sendMode(val) {
      this.value = 0;
      this.$emit("inputValue", 0);
      this.$emit("selectValue", val*1);
    },
  },
  watch: {
    type(val) {
      this.mode = val;
    },
    val(val) {
      this.value = val;
    },
    value(val) {
      if (this.mode === 1) {
        var reg = /^[+]{0,1}(\d+)$/;
      }
      if (this.mode === 2) {
        var reg = /^(0|[1-9]\d*)(\.\d*)?$/;
      }
      if (!reg.test(val)) {
        this.value = 0;
        this.$emit("inputValue", 0);
      }
    },
  },
};
</script>

<style scoped>
.elInput {
  width: 150px;
}
</style>