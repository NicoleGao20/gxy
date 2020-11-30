<template>
  <div class="wechat-graphic-material">
    <choose-material
      :read-only="onlyRead"
      :language="nodeConf.language"
      :material="nodeConf.node_data"
      :show-choose="showChoose"
      @onChoose="handleChoose"/>
  </div>
</template>
<script>
import chooseMaterial from '@/componentsMarketing/ChooseMaterial'
// import belleChooseMaterial from '@/privatemodules/belle-choose-material/lib/belle-choose-material.umd'
import { mapGetters } from 'vuex'
export default {
  name: 'WechatGraMaterials',
  components: { chooseMaterial },
  data() {
    return {
      nodeConf: {
        node_desc: '',
        language: 'zh',
        node_data: {
          url: '/wechatmanage/queryImageTextMaterialPaging'
        }
      },
      onlyRead: false,
      showChoose: false
    }
  },
  computed: {
    ...mapGetters(['brandCode'])
  },
  watch: {
    '$i18n.locale'(newValue) {
      this.nodeConf.language = newValue
    }
  },
  methods: {
    handleChoose(node_data) {
      this.nodeConf.node_data = node_data
    }
  }
}
</script>
<style lang="less">
.wechat-graphic-material {

}
</style>
