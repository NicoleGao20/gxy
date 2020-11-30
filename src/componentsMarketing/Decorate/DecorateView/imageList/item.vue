<template>
  <div :class="className">
    <img :src="item.resourceFileUrl" alt="" class="card-img">
    <div class="card-content">
      <div class="item-name">{{ item.resourceName }}</div>
      <div v-if="item.entryCondition" class="item-price">{{ item.entryCondition }}</div>
      <div v-if="item.resourceStatus" :class="`item-status ${getStatusClass(item.resourceStatus)}`">{{ getStatusName(item.resourceStatus) }}</div>
    </div>
  </div>
</template>

<script type="text/javascript">
export default {
  name: 'DCImageListItemComponent',
  props: {
    content: {
      type: Object,
      default() {
        return {}
      }
    },
    item: {
      type: Object,
      default() {
        return {}
      }
    },
    className: {
      type: String,
      default() {
        return ''
      }
    }
  },
  methods: {
    getStatusName(status) {
      const statusList = ['', '报名未开始', '报名进行中', '活动未开始', '活动进行中', '活动已结束']
      return status ? statusList[status] : statusList[0]
    },
    getStatusClass(status) {
      return [2, 4].includes(status) ? 'active' : ''
    }
  }
}
</script>
<style lang="less" scoped>
.text-ellipsis {
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}

.card-content {
  padding: 5px 8px;
  line-height: 1.5;
}

.item-name {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow : hidden;
  text-overflow: ellipsis;
}

.item-price {
  margin-top: 6px;
  color: #e6a23c;
}

.item-status {
  display: inline-block;
  margin-top: 10px;
  padding: 2px 10px;
  background-color: #aeaeae;
  border-radius: 20px;
  color: #fff;
  font-size: 14px;

  &.active {
    background-color: #000;
  }
}

.grid-item {
  margin-bottom: 10px;
  box-shadow: 0 0 2px rgba(0,0,0, .08);

  &.activity {
    text-align: center;
    box-shadow: none;
  }
}

.list-item {
  display: flex;
  width: 100%;
  padding: 10px;
  .card-img {
    width: 120px;
  }
  .item-name {
    -webkit-line-clamp: 2;
  }
  .card-content {
    padding: 10px;
  }
}

.h-scroll-item {
  width: 170px;
  box-shadow: 0 0 2px rgba(0,0,0, .08);

  &.activity {
    text-align: center;
    box-shadow: none;
  }
}

</style>
