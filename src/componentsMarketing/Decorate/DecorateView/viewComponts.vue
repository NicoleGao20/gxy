<template>
  <div>
    <showList v-if="item.type == 'list'" :item ="item" />
    <blankPlate v-if="item.type == 'blank'" :list ="item"/>
    <imageList v-if="item.type == 'imageList'" :list ="item"/>
    <swiperPlate v-if="item.type == 'swiper'" :list ="item"/>
    <Columns v-if="item.type == 'columns'" :list ="item"/>
  </div>
</template>
<script type="text/javascript">
import showList from './list'
import blankPlate from './blankPlate'
import swiperPlate from './swiperPlate'
import Columns from './columns'
import imageList from './imageList'
export default {
  name: 'Show',
  components: {
    showList,
    blankPlate,
    Columns,
    swiperPlate,
    imageList
  },
  props: {
    item: {
      type: Object,
      default() {
        return {}
      }
    },
    save: {
      type: Function,
      default: () => {}
    }
  }
}
</script>
