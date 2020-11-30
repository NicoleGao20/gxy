<template>
  <div class="memberList">
    <point-type-input
      class="item"
      title="入会会员每笔交易额外赠送"
      @selectValue="setMode1"
      @inputValue="setValue1"
      :type="mode1"
      :val="value1"
    />
    <point-type-input
      class="item"
      title="白银会员每笔交易额外赠送"
      @selectValue="setMode2"
      @inputValue="setValue2"
      :type="mode2"
      :val="value2"
    />
    <point-type-input
      class="item"
      title="黄金会员每笔交易额外赠送"
      @selectValue="setMode3"
      @inputValue="setValue3"
      :type="mode3"
      :val="value3"
    />
  </div>
</template>

<script>
import pointTypeInput from "@/componentsMarketing/pointTypeInput/pointTypeInput";
export default {
  components: {
    pointTypeInput,
  },
  props: {
    formData: {
      type: Object,
      default() {
        return {
          bronzeMode: 1,
          silverMode: 1,
          goldMode: 1,
          bronze: "0",
          silver: "0",
          gold: "0",
        };
      },
    },
  },
  data() {
    return {
      mode1: 1,
      mode2: 1,
      mode3: 1,
      value1: "0",
      value2: "0",
      value3: "0",
    };
  },
  methods: {
    setMode1(val) {
      this.mode1 = val;
      this.sendData();
    },
    setMode2(val) {
      this.mode2 = val;
      this.sendData();
    },
    setMode3(val) {
      this.mode3 = val;
      this.sendData();
    },
    setValue1(val) {
      this.value1 = val;
      this.sendData();
    },
    setValue2(val) {
      this.value2 = val;
      this.sendData();
    },
    setValue3(val) {
      this.value3 = val;
      this.sendData();
    },
    sendData() {
      this.$emit("boxChange", {
        bronzeMode: this.mode1,
        silverMode: this.mode2,
        goldMode: this.mode3,
        bronze: this.value1,
        silver: this.value2,
        gold: this.value3,
      });
    },
  },
  watch:{
    formData:{
      handler(val){
        this.mode1 = val.bronzeMode
        this.mode2 = val.silverMode
        this.mode3 = val.goldMode
        this.value1 = val.bronze
        this.value2 = val.silver
        this.value3 = val.gold
      },
      deep:true
    }
  }
};
</script>

<style scoped>
.item {
  margin-bottom: 10px;
}
</style>