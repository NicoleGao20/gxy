<template>
  <ul class="page-tool">
    <li v-for="item in addedList" @click="signal(item,'新增')" :key="item.id">
      <div class="page-img">
        <img :src="item.icon_url" alt />
      </div>
      <div class="page-signal">
        <span>{{item.integ_channel_name}}</span>
        <span>{{item.chl_desc}}</span>
      </div>
    </li>
  </ul>
</template>
<script>
export default {
  props: ["addedList"],
  data() {
    return {
    };
  },
  mounted() {
    console.log(this.$props,'jjj');
  },
  methods: {
    signal(item,type) {
         let substance='消息通知';
         console.log(item,'item.crm_mp_integ_chl_id')
         this.$router.push({
            name: "integratEdedit",
            query: {
              channel_table_name:item.channel_table_name,
              type:type,
              substance:substance,
              integ_channel_name:item.integ_channel_name,
              crm_mp_integ_chl_id:item.id,
              type_id:item.crm_mp_integ_type_id,
              id:item.id
            },
          });
     
     
    },
  },
};
</script>
<style lang="less" scoped>
.page-tool {
  li {
    display: flex;
    align-items: center;
    margin-bottom: 15px;
    .page-img {
      width: 60px;
      height: 60px;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .page-signal {
      display: flex;
      flex-direction: column;
      margin-left: 10px;
      span:first-of-type {
        color: #000000;
        display: inline-block;
        margin-bottom: 10px;
      }
    }
  }
}
</style>