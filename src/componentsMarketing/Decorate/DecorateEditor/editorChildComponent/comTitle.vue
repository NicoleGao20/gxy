<template>
  <div class="decorate-editor-title-content">
    <p class="decorate-editor-title">{{ name }}</p>
    <div >
      <button v-if="showEdit" title="编辑组件配置数据" @click="onClick"><i style="fontSize:18px;" class="iconfont icon-bianji " /></button>
      <button v-if="showEdit" title="删除组件配置数据" @click="ondelete"><i style="fontSize:21px" class="iconfont icon-delete" /></button>
    </div>
  </div>
</template>
<script type="text/javascript">
export default {
  name: 'DecorateTitle',
  props: {
    name: {
      type: String,
      default: ''
    },
    data: {
      type: Object,
      default() {
        return {}
      }
    },
    setdata: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      showEdit: false
    }
  },
  mounted() {
    this.showEdit = /.*decorateComponentEdi*./.test(this.$route.path) && this.setdata.hasOwnProperty('index')
  },
  methods: {
    onClick() {
      this.$store.dispatch('setEditList', this.setdata.pop)
    },
    ondelete() {
      this.$confirm('确认删除？')
        .then(_ => {
          this.$store.dispatch('deleteEdit', this.setdata.pop)
        })
        .catch(_ => {})
    }
  }
}
</script>
<style lang="less" scoped>
.decorate-editor-title-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 5px;
  font-size: 12px;
  &>div {
    display:none;
    align-items: center;
    button {
      border: none;
      background: #fff;
      margin-right: 10px;
    }
  }
  &:hover {
    &>div {
      display: flex;
    }
  }
  .decorate-editor-title {
    border-left: 3px solid #3899ec;
    padding-left: 5px;
    line-height: 1;
    margin-bottom: 10px;
    text-align: left;
    font-size: 14px;
    font-weight: normal;
  }
}
</style>
