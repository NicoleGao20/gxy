<template>
  <div class="decorate-header">
    <DecoratePreviewDialog :on-save="onSave" />
    <el-divider direction="vertical" />
  </div>
</template>
<script>
import { mapState } from 'vuex'
import DecoratePreviewDialog from './DecoratePreviewDialog'
import { getDecorateDetail, updateDecorate, getLayoutTemplateDetail, changeSamplePlate } from '@/api/decorate'

export default {
  name: 'DecorateHeader',
  components: {
    DecoratePreviewDialog
  },
  data() {
    return {
    }
  },
  computed: mapState({
    decorateDetail: state => state.decorate.decorateDetail,
    list: state => state.decorate.list
  }),
  mounted() {
    // this.interval = setInterval(() => {
    //   this.onSave()
    // }, 5 * 60 * 1000)

    this.$keyboardEvents({ num: 83, isctrl: true, fun: this.onSave })
  },
  beforeDestroy() {
    clearInterval(this.interval)
  },
  methods: {
    getCompileContent() {
      // console.log(this.list)
      const copylist = JSON.parse(JSON.stringify(this.list))
      const newList = Array.from(new Set(copylist))
      newList.forEach(item => {
        item.content.forEach(contentItem => {
          delete contentItem.editor
          contentItem.children.forEach(child => {
            delete child.editor
          })
        })
      })
      // console.log('new list', newList)
      return newList
    },
    handleResult(res, operation = '保存') {
      if (res && res.code === 1) {
        this.$message({
          message: `${operation}成功`,
          type: 'success'
        })
      } else {
        this.$message({
          message: `${operation}失败`,
          type: 'error'
        })
      }
    },
    onSave(payload) {
      if (this.$route.meta.title === 'layoutTemplateEdit') {
        this.saveLayoutTemplateDetail(payload)
      } else {
        this.saveDecorateDetail(payload)
      }
    },
    saveDecorateDetail(payload) {
      const { id, name, type } = this.decorateDetail
      let { ver } = this.decorateDetail
      getDecorateDetail(id).then(response => {
        if (response && response.data && response.data.ver) {
          ver = response.data.ver
        }
        const params = payload ? payload.params : {}
        const data = {
          id,
          name,
          type,
          ver,
          content: JSON.stringify(this.list),
          compileContent: JSON.stringify(this.getCompileContent()),
          ...params
        }
        localStorage.setItem('pageData' + ver, JSON.stringify(this.list))
        updateDecorate(data).then(res => {
          const operation = payload && payload.params ? '发布' : '保存'
          this.handleResult(res, operation)
          if (payload && payload.callback) {
            payload.callback()
          }
        })
      })
    },
    saveLayoutTemplateDetail(payload) {
      // console.log('decorateDetail', this.decorateDetail)
      const { templateId, name, type } = this.decorateDetail
      let { ver } = this.decorateDetail
      getLayoutTemplateDetail(templateId).then(response => {
        if (response && response.data && response.data.ver) {
          ver = response.data.ver
        }
        const data = {
          templateId,
          name,
          type,
          ver,
          content: JSON.stringify(this.list)
        }
        // console.log('data', data)
        changeSamplePlate(data).then(res => {
          this.handleResult(res)
        })
      })
    }
  }
}
</script>
<style lang="less" scoped>
.decorate-header {
  display: flex;
  align-items: center;
  margin-right: 10px;
  // position: fixed;
  // top: 0;
  // right: 160px;
  // z-index: 11;
  // height: 50px;
}

</style>
