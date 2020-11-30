<template>
  <div class="add-params-modal">
    <el-button type="primary" plain @click="dialogVisible = true">插入参数</el-button>
    <el-dialog
      :visible.sync="dialogVisible"
      :modal="false"
      :before-close="handleClose"
      title="插入参数设置"
      width="40%"
    >
      <div>
        <el-row :gutter="24">
          <el-col :span="16">
            <el-row :gutter="8">
              <div>选择参数</div>
              <el-col :span="12">
                <el-select v-model="paramType" placeholder="请选择">
                  <el-option
                    v-for="item in paramTypes"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-col>
              <el-col :span="12">
                <el-select v-model="paramName" placeholder="请选择" @change="handleChange">
                  <el-option
                    v-for="item in paramNames"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"/>
                </el-select>
              </el-col>
            </el-row>
          </el-col>
          <el-col :span="8">
            <div>默认值</div>
            <el-input v-model="paramValue" placeholder="当属性值为空时使用" />
          </el-col>
        </el-row>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: 'ControlAndData',
  props: {
    id: {
      type: String,
      default: ''
    },
    onaddData: {
      type: Function,
      default: () => {}
    }
  },
  data() {
    return {
      dialogVisible: false,
      paramTypes: [{
        value: 'member',
        label: '会员属性参数'
      }, {
        value: 'follower',
        label: '关注者参数'
      }, {
        value: 'coupon',
        label: '卡券参数'
      }, {
        value: 'point',
        label: '积分参数'
      }],
      paramNames: [{
        value: 'name',
        label: '姓名'
      }, {
        value: 'account',
        label: '账号'
      }, {
        value: 'gender',
        label: '性别'
      }],
      paramType: '',
      paramName: '',
      paramValue: ''
    }
  },
  mounted() {
    // const path = this.$router.options.routes[0].path
  },
  methods: {
    handleChange(value) {
      console.log('value', value)
      this.onaddData(value)
    },
    handleClose(done) {
      done()
      // window._hmt.push(['_trackEvent', 'music', 'play', 'Hey Jude'])
    }
  }
}
</script>
<style>

</style>
