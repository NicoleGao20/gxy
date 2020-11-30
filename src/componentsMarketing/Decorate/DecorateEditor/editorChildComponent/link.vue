<template>
  <div class="config-link">
    <ComTitle :name="setdata.name" :data="data" :setdata="setdata"/>
    <div class="btn" @click="dialogVisible = true" >配置链接</div>
    <el-dialog
      :visible.sync="dialogVisible"
      :before-close="handleClose"
      title="提示"
      width="500px">
      <section>
        <p>链接类型</p>
        <el-select v-model="value" style="width: 100%;margin-bottom: 10px;" filterable placeholder="请选择">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"/>
        </el-select>
        <div v-if=" value === '1'" class="custom-value" >
          <p>链接地址</p>
          <el-input v-model="customValue" :placeholder="'请输入地址'"/>
        </div>
        <el-table
          v-if="value === '2'"
          :data="tableData"
          :fit="true"
          height="300"
          style="width: 100%"
          highlight-current-row
          @current-change="handleCurrentChange">
          <el-table-column
            prop="date"
            label="名称"
          />
          <el-table-column
            prop="name"
            label="描述"
          />
        </el-table>
      </section>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="resulte()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import ComTitle from './comTitle'
export default {
  name: 'ConfigLink',
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
  data() {
    return {
      dialogVisible: false,
      tableData: [{
        date: '2016-05-02',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄',
        link: 'https://element.eleme.cn/#/zh-CN/component/button'
      }, {
        date: '2016-05-04',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1517 弄',
        link: 'https://element.eleme.cn/#/zh-CN/component/button'
      }, {
        date: '2016-05-01',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1519 弄',
        link: 'https://element.eleme.cn/#/zh-CN/component/button'
      }, {
        date: '2016-05-03',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1516 弄',
        link: 'https://element.eleme.cn/#/zh-CN/component/button'
      }],
      options: [{
        value: '1',
        label: '自定义'
      }, {
        value: '2',
        label: '页面'
      }],
      value: '1',
      activeNum: '',
      customValue: '', // 自定义链接
      currentRow: null // 选中的列表页面
    }
  },
  watch: {
    dialogVisible(newVal, olaVal) {
      if (newVal) {
        this.customValue = this.data[this.setdata.pop]
      }
    }
  },
  mounted() {
  },
  methods: {
    handleClose(done) { // 点击右上角 ×号关闭弹窗
      done()
    },
    handleCurrentChange(val) {
      this.currentRow = val
    },
    resulte() {
      this.dialogVisible = false
      let link = ''
      if (this.value === '1') {
        link = this.customValue
      }
      if (this.value === '2') {
        link = this.currentRow.link
      }
      this.data[this.setdata.pop] = link
    }
  }
}
</script>
<style lang="less" scoped>
  .config-link {
    .btn {
      width: 80px;
      height: 30px;
      font-size: 12px;
      text-align: center;
      line-height: 30px;
      border:1px solid #ddd;
      cursor: pointer;
      &:hover {
        opacity: 0.6;
      }
    }
    section {
      p {
        margin-bottom: 5px;
      }
    }
    .custom-value {
      width: 100%;
      p {
        margin-top: 10px;
      }
    }
  }
</style>
