<template>
  <Journal name='查看记录'/>

</template>
<script>
import Journal from './commponent/index.vue'
export default {
components: { // 挂载组件
    Journal
  },
  data(){
      return{
          id:''
      }
  },
 mounted(){
    //  this.id=this.$route.query.id
     console.log(this.id,'第一级别')
  }
}
</script>