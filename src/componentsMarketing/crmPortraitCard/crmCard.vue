<template>
  <div>
    <div v-for="(o,index) in CrmCardList" :key="index" class="crm-box-card">
      <span v-if="index!== (CrmCardList.length-1)" class="verticalBar" />
      <span class="time"> {{ o.date }} </span>
      <div class="box-card-item">
        <span v-if="o.title" class="dataTitleStyle">{{ o.title }}</span>
        <div class="text item">
          <!-- <div class="textItemTitle"><span>{{ o.name+':' }}</span> </div>
          <div class="textItem"><span> 订单号：</span><span>24325436546435</span></div>
          <div class="textItem"><span> 消费：</span><span>24455</span></div> -->

          <div v-for="(item ,index) in o.value" :key="index" class="textItem">
            {{ item }}
          </div>

        </div>
      </div>
    </div>

  </div>
</template>
<script>
export default {
  props: {
    CrmCardList: {
      type: Array,
      default: function() {
        return []
      }
    }
  }
}
</script>
<style lang="less" scoped>
 .crm-box-card{
   position: relative;
   padding-left: 15px;
   .box-card-item{
      padding: 8px 0;
      width: 300px;
      min-height: 120px;
      cursor: pointer;
      border: 1px dashed #96a6c1;
      background-color:#f9f9f9;
      overflow: hidden;
      .dataTitleStyle{
         padding-left: 10px;
         line-height: 25px;
         overflow: hidden;
         font-weight: 700;
         color: #435A82;
      }
      .item{
        overflow: hidden;
        width: 100%;
        height: 100%;
        .textItem, .textItemTitle{
            // height: 20px;
            line-height: 20px;
            padding-left: 10px;
          }
          .textItemTitle{

            font-size: 13px;
            color: #333333;
          }
          .textItem {
            overflow: hidden;
            font-size: 12px;
            color: #8D8D8D;
          }
      }
   }
   .time{
      margin: 10px 0;
      color:  #435A82;
      display: inline-block;
   }
   .verticalBar{
      position: absolute;
      top: 15px;
      left: 4px;
      width: 2px;
      height: 100%;
      background-color: #435A82;
   }
 }
  .crm-box-card:before{
    position: absolute;
    top: 11px;
    left: 0;
    content: '';
     width: 10px;
     height: 10px;
     background-color: #435A82;
     border-radius: 50%
   }
</style>
