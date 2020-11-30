<template>
  <div class="dce-container">
    <IconComponent/>
    <ViewComponent/>
    <EditComponent/>
  </div>
</template>
<script>
import ViewComponent from './view'
import IconComponent from './icon'
import EditComponent from './edit'
import { mapState } from 'vuex'
export default {
  name: 'DecorateComponent',
  components: {
    ViewComponent,
    IconComponent,
    EditComponent
  },
  data() {
    return {
    }
  },
  computed: {
    ...mapState({
      list: state => state.decorateComponents.viewList,
      editList: state => state.decorateComponents.editList
    })
  },
  mounted() {
    console.log(this.list, 999)
  }

}
</script>
<style lang='less' scoped>
  .dce-container {
    box-sizing: border-box;
    display: flex;
    width: 100%;
    height: 100%;
    justify-content: space-between;
    align-items:center;
    padding: 15px;
  }
</style>

