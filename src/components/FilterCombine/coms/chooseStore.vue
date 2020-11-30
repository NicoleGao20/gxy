<template>
  <div class="clearfix">
    <el-form-item label-width="0" style="display: inline-block;margin-right: 10px;width: 150px;float: left;">
      <el-tooltip class="item" effect="light" :content="conf.column_name_show" placement="bottom">
        <el-input v-model="conf.column_name_show" type="primary" disabled/>
      </el-tooltip>
    </el-form-item>
    <el-form-item label-width="20px" :prop="prefixProp+'.column_value'" style="display: inline-block;float:left;width: 400px;">
      <el-input v-model="specItem.column_value">
        <el-button slot="append" icon="el-icon-search" @click="openStorePickerModal"></el-button>
      </el-input>
    </el-form-item>
    <el-dialog 
      title="门店选择"
      :visible.sync="storeModalVisible"
      append-to-body
      width="800px">
      <belle-choose-store :storeData="storeData"  @onResulte="onResulte"/>
      <div slot="footer" class="dialog-footer">
        <el-button @click="storeModalVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmPickStoreHandler">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import 	BelleChooseStore from '@/privatemodules/belle-choose-store'
export default {
  name: 'chooseCity',
  components: {
    BelleChooseStore
  },
  props: {
    specItem: {
      type: Object,
      default() {
        return {}
      }
    },
    conf: {
      type: Object,
      default() {
        return {}
      }
    },
    prefixProp: {
      type: String,
      default() {
        return ''
      }
    }
  },
  data() {
    var storeData
    if(this.specItem.value) {
      try {
        storeData = JSON.parse(this.specItem.web_value)
      } catch(err) {
        console.log(err)
      }
    } else {
      storeData = {
        onlyRead: false, // 用户所具有的权限,如用户只有只读权限时为true
        batchNo: '', // 前次操作存到后端的返回值,没有就不填写
        type: '1', // 选择的类型默认为1
        address: {
          sleData: '', // 地区的中文字段
          sleValue: '' // 地区的英文字段
        }
      }
    }

    return {
      storeData: storeData,
      storeModalVisible: false
    }
  },
  methods: {
    openStorePickerModal() {
      this.storeModalVisible = true
    },
    onResulte (data) { // 组件回调函数data为回调数据里面
      this.data = data
    },
    confirmPickStoreHandler() {
      this.specItem.column_value = this.data.table.map((item)=> {
        return item.orgCode
      }).join(",")
      
      const list = []
      this.data.table.forEach(element => {
        list.push({ org_code_long: element.orgCode, type: 'include' })
      })
      this.$request({
        url: `/component/choosingStore/saveShopList`,
        method: 'POST',
        data: { list: list, batchNo: '' }
      }).then(res => {
        this.specItem.web_value = JSON.stringify(this.data)
        this.storeModalVisible = false
      })
    }
  }
}
</script>