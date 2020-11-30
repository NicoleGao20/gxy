<template>
  <ul >
    <li>
      <input v-model="item.one" type="" name="" placeholder="可编辑" @input="inputList()">
    </li>
    <li>
      <input v-model="item.two" type="" name="" placeholder="可编辑" @input="inputList()">
    </li>
    <li>
      <input v-model="item.three" type="" name="" placeholder="可编辑" @input="inputList()">
    </li>
  </ul>
</template>
<script type="text/javascript">
export default {
  name: 'DecorateShowList',
  props: {
    item: {
      type: Object,
      default() {
        return {}
      }
    },
    save: {
      type: Function,
      default() {
        return ''
      }
    }
  },
  data() {
    return {}
  },
  methods: {
    inputList() {
      this.$store.dispatch('changeValue', this.item)
    }
  }
}
</script>
<style lang="less" scoped>
ul {
  background: #fff;
  li {
    height: 30px;
    border-top: 1px solid #eee;
    background: #fff;
    input {
      box-sizing: border-box;
      width: 100%;
      height: 100%;
      border: none;
      padding: 0 10px;
      background: #fff;
      font-size: 12px;
    }
  }
}
</style>
