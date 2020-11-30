<template>
  <div class="box">
    <el-input v-model="value" class="elInput" @input="sendValue">
      <template slot="append">{{name}}</template>
    </el-input>
  </div>
</template>

<script>
export default {
  props: {
    name: {
      type: String,
      default: '',
    },
    type:{
      type: String,
      default: 'int',
    },
    val: {
      default: 0,
    },
  },
  data() {
    return {
      value: this.val,
    };
  },
  methods: {
    sendValue(val) {
      this.$emit("inputValue", val*1);
    },
  },
  watch: {
    val(val) {
      this.value = val;
    },
    value(val) {
      if (this.type === 'int') {
        var reg = /^[+]{0,1}(\d+)$/;
      }
      if (this.type === 'double') {
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