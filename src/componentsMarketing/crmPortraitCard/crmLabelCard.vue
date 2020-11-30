<template>
  <div class="memberLabel">
    <el-row >
      <el-form label-width="120px" class="demo-ruleForm">
        <el-col :span="24">
          <el-form-item :label="memeberLabelObj.name" >
            <div class="labelBoxs">
              <div v-for="(item,index) in labelList" :key="index" :title="item" class="labelBox" >
                {{ item ? item : '---' }}
              </div>
            </div>
          </el-form-item>
        </el-col>
      </el-form>
    </el-row>
  </div>
</template>
<script>
export default {
  props: {
    memeberLabelObj: {
      type: Object,
      default: function() {
        return {}
      }
    },
    id: {
      type: String,
      default: ''
    },
    titleName: {
      type: String,
      default: ''
    },
    is_show: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {

    }
  },
  computed: {
    labelList() {
      return this.memeberLabelObj.labelList.length ? this.memeberLabelObj.labelList : [null]
    }
  },
  methods: {
    del() {
      this.$confirm(' 确认删除图表吗 ?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        const is_del = 'Y'
        await this.updateRequestData({ id: this.chartObject.id, template: this.templateId, is_del: is_del })
        this.$message({
          type: 'info',
          message: '删除成功！'
        })
        this.$emit('initData')
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    }
  }
}
</script>
<style lang="less" scoped>
.memberLabel{
  .labelBoxs{
    position: relative;
    display:flex;
    flex-wrap:   wrap;
    //  padding-top: 10px;
    .labelBox{
      width: 105px;
      height: 35px;
      line-height: 35px;
      text-align: center;
      box-sizing: border-box;
      color: #61acee;
      font-size: 12px;
      border: 1px dashed #61acee;
      background-color: #eef6fd;
      margin: 0 0 10px 10px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }

}
</style>
