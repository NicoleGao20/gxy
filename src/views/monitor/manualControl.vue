<template>
  <div class="container task-scheduler-list">
    <el-data-table
      :url="url"
      :columns="columns"
      :extra-buttons="extraButtons"
      :operation-attrs="{ align: 'center', fixed: 'right' }"
      :has-new="false"
      :has-edit="false"
      :has-delete="false"
      :pagination-size="pageSize"
      data-path="data.list"
      total-path="data.pagination.total"
    />
    <el-dialog
      :append-to-body="true"
      :visible.sync="operationFormVisible"
      :top="'20vh'"
      :title="operationFormTitle"
      width="600px"
    >
      <el-form ref="operationForm" :model="operationForm" :rules="rules" label-width="120px">
        <el-form-item v-for="(formItem, formItemIndex) in operationFormItems" :key="formItemIndex" :label="formItem.paramDesc" prop="customParams">
          <el-select v-if="formItem.selectValue" v-model="operationForm[formItem.paramName]">
            <el-option v-for="(optionItem, optionIndex) in formItem.selectValue.split(',')" :key="optionIndex" :label="optionItem.split(':')[1]" :value="optionItem.split(':')[0]" />
          </el-select>
          <el-input v-if="!formItem.selectValue" v-model="operationForm[formItem.paramName]" style="width: 400px"/>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="operationForm.remark" style="width: 400px"/>
        </el-form-item>
        <el-form-item style="display:flex;justify-content: flex-end;">
          <el-button plain @click="operationFormVisible=false">{{ $t('form.cancel') }}</el-button>
          <el-button type="primary" @click="handleExecute">{{ $t('manualControl.execute') }}</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
import { checkPermission } from '@/utils/permission' // 权限判断函数
import { getManualControlById, executeManualControl } from '@/api/businessMonitor'
export default {
  name: 'ManualControl',
  components: {
  },
  data() {
    const extraButtons = [
      { type: 'button', key: 'operation', text: '操作', atClick: this.handleOperation }
    ]
    return {
      url: '/system/log/manualControlQueues/page',
      columns: [
        { prop: 'controlQueueName', label: this.$t('manualControl.controlQueueName'), align: 'center' },
        { prop: 'controlQueueDesc', label: this.$t('manualControl.controlQueueDesc'), align: 'center' },
        { prop: 'controlQueueType', label: this.$t('manualControl.controlQueueType'), align: 'center',
          formatter: (row, column, cellValue) => cellValue === 1 ? this.$t('manualControl.redis') : this.$t('manualControl.rabbitmq')
        }
      ],
      pageSize: 10,
      rules: {},
      extraButtons: checkPermission('manualcontrol', extraButtons),
      operationFormVisible: false,
      operationFormTitle: '',
      operationFormItems: [],
      operationForm: {}
    }
  },
  created() {
    // this.$store.dispatch('InserMenuList', {
    //   path: 'manualcontrol',
    //   buttonList: [
    //     { name: '操作', url: 'operation' }
    //   ]
    // })
  },
  methods: {
    handleResult(response, operation, callback) {
      if (response.code === 1) {
        this.$message({
          message: `${response.data.message}`,
          type: 'success'
        })
      } else {
        this.$message({
          message: response && response.errorCode || `${operation}错误`,
          type: 'error'
        })
      }
      this.url = this.url
      if (callback) callback()
    },
    async handleOperation(row) {
      const response = await getManualControlById({
        controlQueueId: row.controlQueueId,
        controlQueueType: row.controlQueueType
      })
      this.rules = {}
      this.operationForm = {
        remark: ''
      }
      this.operationFormItems = response && response.data && response.data.queueParamList
      this.operationFormItems.map(item => {
        if (item.isRequired === 1) {
          this.rules[item.paramName] = [
            { required: true, message: item.paramDesc + this.$t('form.isRequired'), trigger: 'blur' }
          ]
        }
        if (item.paramName === 'couponRuleCode') {
          // this.operationForm[item.paramName] = 'CTD17000351'
        }
        if (item.paramName === 'brandCode') {
          // this.operationForm[item.paramName] = 'BL'
        }
      })
      this.operationForm.controlQueueId = row.controlQueueId
      this.operationForm.controlQueueName = row.controlQueueName
      this.operationFormTitle = row.controlQueueDesc
      this.operationFormVisible = true
    },
    async handleExecute() {
      // console.log('operationForm', this.operationForm)
      const { controlQueueId, controlQueueName, remark, couponRuleCode, brandCode, ...restParams } = this.operationForm
      const params = {
        controlQueueId,
        controlQueueName,
        remark
      }
      console.log('operationForm', this.operationForm)
      if (Object.keys(restParams).length > 0) {
        params.content = JSON.stringify(restParams)
      }
      if (brandCode || couponRuleCode) {
        params.couponRuleCode = couponRuleCode
        params.brandCode = brandCode
      }
      this.$refs.operationForm.validate(valid => {
        if (!valid) {
          console.log('error submit!!')
          return false
        }
      })
      console.log('params', params)
      const response = await executeManualControl(params)
      this.handleResult(response, this.$t('manualControl.execute'), () => { this.operationFormVisible = false })
    }
  }
}
</script>
<style lang="less" scoped>
.container {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  padding: 20px 15px;
}

</style>
