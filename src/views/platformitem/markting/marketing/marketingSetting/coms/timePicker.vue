<template>
  <el-form ref="form" :rules="rules" :model="nodeConf" label-position="right" label-width="80px">
    <el-form-item label="流程说明" prop="node_desc">
      <el-input v-model="nodeConf.node_desc" :disabled="onlyRead" placeholder="流程说明"/>
    </el-form-item>
    <div class="hor-line"/>
    <el-form-item label="执行方式" prop="run_type">
      <el-radio-group v-model="nodeConf.run_type" :disabled="onlyRead" @change="nodeConf.run_day = ''">
        <el-radio label="day">按天执行</el-radio>
        <el-radio label="week">按周执行</el-radio>
        <el-radio label="month">按月执行</el-radio>
      </el-radio-group>
    </el-form-item>
    <div v-if="nodeConf.run_type === 'day'" style="padding-left: 80px;">
      每天执行，执行时间为
      <el-form-item label-width="0" prop="run_time" style="display: inline-block;">
        <el-time-picker
          v-model="nodeConf.run_time"
          :disabled="onlyRead"
          format="HH:mm:ss"
          value-format="HH:mm:ss"
          style="display: inline-block"
          placeholder="任意时间点"/>
      </el-form-item>
    </div>
    <div v-if="nodeConf.run_type === 'week'" style="padding-left: 80px;">
      每周的
      <el-form-item label-width="0" prop="run_day" style="display: inline-block;">
        <el-select v-model="nodeConf.run_day" :disabled="onlyRead" style="width: 100px;">
          <el-option v-for="(weekItem, index) in weekOptions" :label="weekItem.label" :value="weekItem.value" :key="index"/>
        </el-select>
      </el-form-item>
      执行，执行时间为
      <el-form-item label-width="0" prop="run_time" style="display: inline-block;">
        <el-time-picker
          v-model="nodeConf.run_time"
          :disabled="onlyRead"
          format="HH:mm:ss"
          value-format="HH:mm:ss"
          placeholder="任意时间点"/>
      </el-form-item>
    </div>
    <div v-if="nodeConf.run_type === 'month'" style="padding-left: 80px;">
      每月的
      <el-form-item label-width="0" prop="run_day" style="display: inline-block;">
        <el-select v-model="nodeConf.run_day" :disabled="onlyRead" style="width: 100px;">
          <el-option v-for="dayItem in days" :label="dayItem.label" :value="dayItem.value" :key="dayItem.label"/>
        </el-select>
      </el-form-item>
      日执行，执行时间为
      <el-form-item label-width="0" prop="run_time" style="display: inline-block;">
        <el-time-picker
          v-model="nodeConf.run_time"
          :disabled="onlyRead"
          format="HH:mm:ss"
          value-format="HH:mm:ss"
          placeholder="任意时间点"/>
      </el-form-item>
    </div>
  </el-form>
</template>
<script>
export default {
  name: 'TimePicker',
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
      run_type: 'day',
      run_day: '',
      run_time: ''
    }

    if (this.curComConfig.nodeConf && this.curComConfig.nodeConf.node_desc) {
      nodeConf = JSON.parse(JSON.stringify(this.curComConfig.nodeConf))
    }

    var rules = {
      node_desc: [
        {
          required: true, message: '请填写流程简要说明', trigger: 'change'
        }
      ],
      run_type: [
        {
          required: true, message: '请选择执行方式', trigger: 'change'
        }
      ],
      run_day: [
        {
          required: true, message: '请选择', trigger: 'change'
        }
      ],
      run_time: [
        {
          required: true, message: '请选择', trigger: 'change'
        }
      ]
    }
    var days = []
    for (var i = 1; i <= 30; i++) {
      days.push({
        label: i,
        value: i
      })
    }
    days.push({
      label: '月末最后一天',
      value: 0
    })

    return {
      nodeConf: nodeConf,
      rules: rules,
      weekOptions: [
        {
          label: '星期一',
          value: 1
        },
        {
          label: '星期二',
          value: 2
        },
        {
          label: '星期三',
          value: 3
        },
        {
          label: '星期四',
          value: 4
        },
        {
          label: '星期五',
          value: 5
        },
        {
          label: '星期六',
          value: 6
        },
        {
          label: '星期日',
          value: 7
        }
      ],
      days: days
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
    }
  }
}
</script>
