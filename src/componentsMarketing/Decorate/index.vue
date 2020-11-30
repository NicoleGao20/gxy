<template>
  <div class="container">
    <DecorateIcon :list="storeList" type="decorate"/>
    <DecorateView :list="showList" type="decorate"/>
    <DecorateEditor />
    <TemplateList />
  </div>
</template>
<script>
import DecorateIcon from './DecorateIcon'
import DecorateView from './DecorateView/index'
import DecorateEditor from './DecorateEditor/index'
import { getDecorateComponents, getLayoutTemplateDetail, getDecorateDetail } from '@/api/decorate'
import TemplateList from './template'
import { getSession } from '@/utils/auth'
import { mapState } from 'vuex'
export default {
  name: 'Decorate',
  components: {
    DecorateIcon,
    DecorateView,
    DecorateEditor,
    TemplateList
  },
  props: {
    brands: {
      type: String,
      default: ''
    },
    iconId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      storeList: [],
      showList: [],
      iconList: [ // 左侧模版数据
        {
          name: '定制组件',
          type: 'decorateCustom',
          list: []
        },
        {
          name: '系统组件',
          type: 'decorateSystem',
          list: []
        },
        {
          name: '基础组件',
          type: 'decorateBase',
          list: []
        },

        {
          name: '容器组件',
          type: 'decorate',
          list: []
        },
        {
          name: '容器内元素',
          type: 'decorateChildren',
          list: []
        }
      ]
    }
  },
  computed: mapState({
    seletedId: state => {
      return state.decorate.seletedId
    },
    conId: state => {
      return state.decorate.conId
    },
    manyId: state => {
      return state.decorate.manyId
    },
    allList: state => {
      return state.decorate.list
    },
    dataIndexObj: state => {
      return state.decorate.dataIndexObj
    }
  }),
  created() {
    this.getDecorateComponents()
    if (this.$route.meta.title === 'layoutTemplateEdit') {
      this.getLayoutTemplateDetail()
      console.log(2)
    } else {
      this.getDecorateDetail()
      console.log(1)
    }
    document.body.ondrop = function(event) {
      event.preventDefault()
      event.stopPropagation()
    }
  },
  mounted() {
    const keyArry = [
      { num: 89, isctrl: true, fun: this.onCtrlY },
      { num: 90, isctrl: true, fun: this.onCtrlZ },
      { num: 37, isctrl: false, fun: this.onkeyDown },
      { num: 38, isctrl: false, fun: this.onkeyDown },
      { num: 39, isctrl: false, fun: this.onkeyDown },
      { num: 40, isctrl: false, fun: this.onkeyDown },
      { num: 37, isctrl: false, isShift: true, fun: this.onkeyDown },
      { num: 38, isctrl: false, isShift: true, fun: this.onkeyDown },
      { num: 39, isctrl: false, isShift: true, fun: this.onkeyDown },
      { num: 40, isctrl: false, isShift: true, fun: this.onkeyDown }
    ]
    for (let index = 0; index < keyArry.length; index++) {
      const element = keyArry[index]
      this.$keyboardEvents(element)
    }
  },
  methods: {
    onkeyDown(data) {
      const value = data.isShift ? 10 : 1
      this.ondelAddress(data.num, value)
    },
    ondelAddress(num, value) {
      console.log(8)
      const dataIndexObj = this.dataIndexObj
      const allData = this.allList
      if (dataIndexObj.dataIndex !== -1 && dataIndexObj.contentIndex !== -1 && dataIndexObj.childIndex !== -1) {
        if (num === 37) {
          allData[dataIndexObj.dataIndex].content[dataIndexObj.contentIndex].children[dataIndexObj.childIndex].left -= value
          this.$store.dispatch('merge', allData)
        }
        if (num === 39) {
          allData[dataIndexObj.dataIndex].content[dataIndexObj.contentIndex].children[dataIndexObj.childIndex].left += value
          this.$store.dispatch('merge', allData)
        }
        if (num === 38) {
          allData[dataIndexObj.dataIndex].content[dataIndexObj.contentIndex].children[dataIndexObj.childIndex].top -= value
          this.$store.dispatch('merge', allData)
        }
        if (num === 40) {
          allData[dataIndexObj.dataIndex].content[dataIndexObj.contentIndex].children[dataIndexObj.childIndex].top += value
          this.$store.dispatch('merge', allData)
        }
      }
    },
    onCtrlZ(config) {
      const data = getSession('decorateZData')
      if (data.length !== 0) {
        console.log(data)
        this.$store.commit('SET_LIST', { value: data, iskey: true })
      }
    },
    onCtrlY(config) {
      const data = getSession('decorateYData')
      this.$store.commit('SET_LIST', { value: data, iskey: true })
    },
    getDecorateComponents() {
      getDecorateComponents().then(res => {
        console.log(res, 9999)
        const iconList = res.data.list
        iconList.forEach(element => {
          // console.log(element.assemblyContent, 1111)
          const content = element.assemblyContent ? element.assemblyContent : element.content
          element.list = JSON.parse(content)
        })
        if (this.$route.meta.title === 'layoutTemplateEdit') {
          this.iconList = this.iconList.filter(item => item.type === 'decorateChildren')
        }
        this.onList(iconList)
      })
    },
    onList(value) {
      const forList = (index, type) => {
        const ary = []
        value.forEach(element => {
          if (element.type === type && element.list) {
            ary.push(element.list)
          }
        })
        this.iconList[index].list = ary
      }
      this.iconList.forEach((item, index) => {
        forList(index, item.type)
      })
      this.storeList = this.iconList
      this.$store.dispatch('setIconList', this.storeList)
      // console.log(this.storeList, 999)
    },
    getDecorateDetail() {
      const id = this.$route.params.id
      getDecorateDetail(id).then(response => {
        const { data } = response
        const { content, ...restDetail } = data
        const list = content ? JSON.parse(content) : []
        // console.log('decorate list', list)
        this.showList = []
        console.log(list, restDetail, 99998)
        this.$store.dispatch('setList', list)
        this.$store.dispatch('setDecorateDetail', restDetail)
      })
    },
    getLayoutTemplateDetail() {
      const id = this.$route.params.id
      getLayoutTemplateDetail(id).then(response => {
        const { data } = response
        const { id, content, ...restDetail } = data
        let list = content ? JSON.parse(content) : []
        if (!Array.isArray(list)) {
          list = [list]
        }
        list[0].id = id
        this.showList = []
        this.$store.dispatch('setList', list)
        this.$store.dispatch('setDecorateDetail', { id, ...restDetail })
      })
    }
  }
}
</script>
<style lang="less" scoped>
.container {
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 100%;
  background: #f5f5f5;
}
</style>
