<template>
  <div>
    <ComTitle :name="setdata.name" :data="data" :setdata="setdata"/>
    <div class="dc-editor-select">
      <el-select v-model="data[setdata.pop]" :placeholder="'请选择'" @change="handleFetchImageList">
        <el-option
          v-for="item in setdata.options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
    </div>
  </div>
</template>
<script type="text/javascript">
import ComTitle from './comTitle'
import { getDecorateProductList } from '@/api/decorate'

export default {
  name: 'DecorateImageListSelect',
  components: {
    ComTitle
  },
  props: {
    setdata: {
      type: Object,
      default() {
        return {}
      }
    },
    data: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  methods: {
    async handleFetchImageList() {
      // console.log('this.setdata', this)
      const { dataType, pageSize, sortField, sortOrder } = this.data
      const params = {
        type: dataType,
        current: 1,
        pageSize,
        sortField,
        sortOrder,
        brandCode: 'TS'
      }
      if (this.data.dataType === 'custom') {
        params.pageSize = 9999
      }
      const res = await getDecorateProductList(params)
      const data = res && res.data && res.data.list ? res.data.list : []
      this.data.data = data
      // console.log('data', data)
    }
  }
}
</script>
<style lang="less">
  .dc-editor-select {
    .el-select {
      display: block;
    }
    .el-input__inner {
      border-radius: 0;
    }
  }
</style>
