<template>
  <div>
    <el-form ref="form" :model="nodeConf" label-position="right" label-width="80px" @submit.native.prevent>
      <el-form-item
        :rules="{
          message: '请填写流程简要说明', trigger: 'change', required: true
        }"
        label="流程说明"
        prop="node_desc">
        <el-input v-model="nodeConf.node_desc" :disabled="onlyRead" placeholder="流程说明"/>
      </el-form-item>
    </el-form>
    <div class="hor-line"/>
    <belle-choose-material :read-only="onlyRead" :language="nodeConf.language" :material="nodeConf.node_data" @onChoose="handleChoose" />
  </div>
</template>
<script>
import belleChooseMaterial from '@/publicComponents/chooseMaterial/src/index.vue'
import { getToken } from '@/utils/auth'
export default {
  name: 'WxNews',
  components: {
    belleChooseMaterial
  },
  props: {
    curComConfig: {
      type: Object,
      default() {
        return {}
      }
    },
    actionType: {
      type: String,
      default() {
        return 'edit'
      }
    }
  },
  data() {
    var node_data

    if (this.curComConfig.nodeConf.node_data && this.curComConfig.nodeConf.node_data.data && this.curComConfig.nodeConf.node_data.data.brandCode) {
      node_data = this.curComConfig.nodeConf.node_data
      node_data.brandCode = node_data.data.brandCode
    } else {
      node_data = {
        brandCode: getToken('brandCode')
      }
    }

    return {
      nodeConf: {
        node_desc: this.curComConfig.nodeConf.node_desc || '',
        language: 'zh',
        node_data: node_data
      }
    }
  },
  computed: {
    onlyRead() {
      if (this.actionType === 'edit' || this.actionType === 'add') {
        return false
      } else {
        return true
      }
    }
  },
  methods: {
    handleChoose(node_data) {
      this.nodeConf.node_data = node_data
    },
    confirmHandler(cb) {
      this.$refs['form'].validate((valid) => {
        if (!valid) {
          cb(false)
          return
        }

        if (this.$route.query.create_type === 'template') {
          this.curComConfig.nodeConf = {
            node_desc: this.nodeConf.node_desc,
            node_data: this.nodeConf.node_data
          }
          cb(true)
        } else {
          if (this.nodeConf.node_data.data && this.nodeConf.node_data.data.materialId) {
            this.curComConfig.nodeConf = {
              node_desc: this.nodeConf.node_desc,
              node_data: this.nodeConf.node_data
            }
            cb(true)
          } else {
            this.$message({
              type: 'error',
              message: '请选择图文素材'
            })
            cb(false)
          }
        }
      })
    }
  }
}
</script>
