<template>
  <el-form ref="form" :model="nodeConf" label-position="right" label-width="80px">
    <el-form-item
      :rules="{
        message: '请填写流程简要说明', trigger: 'change', required: true
      }"
      label="流程说明"
      prop="node_desc">
      <el-input v-model="nodeConf.node_desc" :disabled="onlyRead" placeholder="流程说明"/>
    </el-form-item>
    <div class="hor-line"/>
    <el-form-item
      :rules="[{
        trigger: 'change', required: true, validator: vaidateValueHandler
      }]"
      label="等待时间"
      prop="wait_hour_time">
      <el-input v-model="nodeConf.wait_hour" :disabled="onlyRead" style="width: 200px;">
        <template slot="append">小时</template>
      </el-input>
      <el-select v-model="nodeConf.wait_minute" :disabled="onlyRead" clearable style="display: inline-block; width: 200px;">
        <el-option v-for="(item, index) in minutesOptions" :label="item.label" :value="item.value" :key="index"/>
      </el-select>
      分钟
    </el-form-item>
  </el-form>
</template>
<script>
export default {
  name: 'DelayTime',
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
    var nodeConf = {
      node_desc: '',
      wait_hour: '',
      wait_minute: ''
    }

    if (this.curComConfig.nodeConf && this.curComConfig.nodeConf.node_desc) {
      nodeConf = JSON.parse(JSON.stringify(this.curComConfig.nodeConf))
    }

    return {
      nodeConf: nodeConf,
      minutesOptions: [
        { label: '10', value: 10 },
        { label: '20', value: 20 },
        { label: '30', value: 30 },
        { label: '40', value: 40 },
        { label: '50', value: 50 }
      ]
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
    confirmHandler(cb) {
      this.$refs['form'].validate((valid) => {
        if (!valid) {
          cb(false)
          return
        }
        this.curComConfig.nodeConf = this.nodeConf
        cb(valid)
      })
    },
    vaidateValueHandler(rule, value, cb) {
      if (!/^[1-9]\d*$/.test(this.nodeConf.wait_hour) && !/^[1-9]\d*$/.test(this.nodeConf.wait_minute)) {
        cb(new Error('请填写正整数'))
        return
      } else {
        if (this.nodeConf.wait_hour) {
          if (!/^[1-9]\d*$/.test(this.nodeConf.wait_hour)) {
            cb(new Error('请填写正整数'))
            return
          }
        }
        if (this.nodeConf.wait_minute) {
          if (!/^[1-9]\d*$/.test(this.nodeConf.wait_minute)) {
            cb(new Error('请填写正整数'))
            return
          }
        }
        cb()
      }
    }
  }
}
</script>
