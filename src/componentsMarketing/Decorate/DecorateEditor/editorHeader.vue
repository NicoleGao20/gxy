<template>
  <div class="editor-page-content">
    <header>
      <div>
        <i :class="'icon-svg iconfont ' + setInfo.icon " />
        {{ setInfo.name }}
      </div>
      <p>{{ setInfo.desc }}</p>
    </header>
    <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect">
      <el-menu-item v-for="item in setInfo.tab" :key="item.id" :index="item.id">{{ item.name }}</el-menu-item>
    </el-menu>
    <ul class="content">
      <li v-for="item in setInfo.tab" v-show="item.id === activeIndex" :key="item.id" :id="item.slot">
        <slot :name="item.slot" />
      </li>
    </ul>
  </div>
</template>
<script type="text/javascript">
// import iconSvg from '@/components/SvgIcon'
export default {
  name: 'EditorHeader',
  components: {
    // iconSvg
  },
  props: {
    setInfo: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      activeIndex: '1'
    }
  },
  methods: {
    handleSelect(key, keyPath) {
      this.activeIndex = key
    }
  }
}
</script>
<style lang="less" scoped>
.editor-page-content {
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  width: 100%;
  height: 100%;
  border-left: 1px solid #e6e6e6;

  & > header{
    position: relative;
    width: 100%;
    height: 83px;
    margin-bottom: 15px;
    &> div {
      position: relative;
      margin: 7px 0;
      &> .icon-svg {
        display: flex;
        align-items: center;
        position: absolute;
        left: 13px;
        top: 50%;
        transform: translateY(-50%);
        width: 20px;
        height: 20px;
        font-size: 20px;
      }
      box-sizing: border-box;
      width: 100%;
      height: 35px;
      padding: 0 15px  0 45px;
      background: #fff;
      font-weight: bold;
      font-size: 20px;
      line-height: 35px;
      color: #58666e;
    }
    &>p {
      padding:  0 15px;
      font-size: 0.8rem;
      color: #58666e;
      margin-bottom: 5px;
    }
  }
  .el-menu-demo {
    display: flex;
    justify-content: space-around;
    .el-menu-item {
      flex: auto;
      text-align: center;
    }
  }
  .content {
    flex: 1;
    padding: 10px 15px 10px 5px;
    overflow: auto;
    li {
      width: 100%;
      min-height:300px;
      overflow: hidden;
    }
  }

}
</style>
