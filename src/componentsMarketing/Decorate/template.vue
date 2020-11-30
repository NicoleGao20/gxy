<template>
  <el-dialog
    :visible.sync="isTemplateShow"
    :before-close="handleClose"
    title="提示"
    width="600px">
    <el-select v-model="activeNum" style="width: 100%;margin-bottom: 10px;" filterable placeholder="请选择" @change="onchange">
      <el-option
        v-for="item in typelist"
        :key="item.value"
        :label="item.name"
        :value="item.value"/>
    </el-select>
    <ul class="list">
      <li v-for="(item, index) in listData" :key="index" :class="{active: index === selId}" @click="changeSelId(index)">
        <div :style="{backgroundImage: `url(${item.effectPic})`}" class="cover"/>
        <span>{{ item.name }}</span>
      </li>
    </ul>
    <span slot="footer" class="dialog-footer">
      <el-button @click="changeStyle">取 消</el-button>
      <el-button type="primary" @click="intoData">确 定</el-button>
    </span>
  </el-dialog>
</template>
<script>
import { mapState } from 'vuex'
import { getDecorateSample, getDataDictionaries } from '@/api/decorate'
import UUID from 'uuidjs'
export default {
  name: 'TemplateList',
  props: {
    isshow: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      listData: [],
      activeNum: '',
      selId: 1,
      typelist: []
    }
  },
  computed: mapState({
    isTemplateShow: state => {
      return state.decorate.isTemplateShow
    },
    list: state => {
      return state.decorate.list
    },
    seletedId: state => {
      return state.decorate.seletedId
    },
    roles: state => {
      return state.user.roles
    }
  }),
  mounted() {
    getDataDictionaries('DECORATE_TEMPLATE').then(res => {
      this.typelist = res.data.list
    })
  },
  methods: {
    onchange(type) {
      getDecorateSample(type).then(res => {
        this.listData = res.data.list
        this.listData.forEach(element => {
          element.content = JSON.parse(element.content)
        })
      })
    },
    handleClose(done) {
      this.$store.dispatch('templateShow', false)
      this.selId = ''
    },
    changeStyle() {
      this.$store.dispatch('templateShow', false)
      this.selId = ''
    },
    changeSelId(id) {
      this.selId = id
    },
    intoData() {
      var content = this.list.find(res => res.id === this.seletedId)
      content = JSON.parse(JSON.stringify(content))
      this.listData[this.selId].content[0].id = this.seletedId
      this.listData[this.selId].content[0].content[0].id = this.seletedId

      this.listData[this.selId].content[0].content[0].children.forEach(element => {
        element.id = UUID.generate()
      })
      content = this.listData[this.selId].content[0]
      console.log(content)
      if (this.roles.find(res => res.no === 'A0010')) {
        content.controlDelete = true
      }
      this.$store.dispatch('changeValue', content)
      this.changeStyle()
    }
  }
}
</script>

<style lang="less" scoped>
  .list {
    width: 100%;
    height: 100%;
    max-height: 480px;
    li {
      display: inline-block;
      width: 25%;
      padding: 20px;
      cursor: pointer;
      position: relative;
      &.active {
        border: 1px solid rgb(16, 140, 238);
      }
      .cover {
        background-repeat: no-repeat;
        background-position: center center;
        background-size: contain;
        height: 60px;
        margin-bottom: 10px;
      }
      span {
          display: block;
          text-align: center;
          white-space: nowrap;
          text-overflow: ellipsis;
          text-align: center;
      }
    }
  }
</style>

