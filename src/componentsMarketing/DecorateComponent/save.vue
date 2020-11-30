<template>
  <div class="decorate-component-save" @click="onsave()">
    <el-button
      plain
    > 保存
    </el-button>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import { getDecorateComponentEdit, getDecorateComponentList } from '@/api/decorate'
export default {
  name: 'DecorateComponentSaveBtn',
  computed: {
    ...mapState({
      list: state => state.decorateComponents.viewList,
      editList: state => state.decorateComponents.editList
    })
  },
  methods: {
    onsave() {
      // 给数据添加是否可选中的字段 ismove  值为 true 的时候是不可选中，为false 是可选中
      for (let index = 0; index < this.list.content[0].children.length; index++) {
        const element = this.list.content[0].children[index]
        element.ismove = true
      }
      this.list.content[0].noChangeHeight = true // 控制装修的时候，容器高度是否需要变化
      // 获取
      getDecorateComponentList().then(res => {
        const OriginalData = res.data.list.find(res => res.id === this.$route.params.id)
        console.log(OriginalData, 1)
        this.ongetDecorateComponentEdit(OriginalData)
      })
    },
    ongetDecorateComponentEdit(OriginalData) {
      console.log(999)
      OriginalData.content = JSON.stringify(this.list)
      OriginalData.id = this.$route.params.id
      OriginalData.isContainer = 0
      OriginalData.assemblyStatus = 0
      getDecorateComponentEdit(OriginalData).then(res => {
        this.$message({
          message: '保存成功',
          type: 'success'
        })
      })
    }
  }
}
</script>
<style lang="less" scoped>
  .decorate-component-save{
    margin-right: 30px;
  }
</style>

