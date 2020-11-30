<template>
  <div class="chartBoxs" >
    <div :class="is_no_border? 'is_border' :'no_border'" class="dataChartBox" >
      <div v-if="tAxis && tAxis.length">
        <span>
          {{ title }}
          <el-tooltip placement="right" effect="light" popper-class="primary-poper">
            <i class="showMore el-icon-question"/>
            <div slot="content">
              <div v-for="(rowText, index) in tAxis.split(/\r\n/)" :key="index">
                {{ rowText }}
              </div>
            </div>
          </el-tooltip>
        </span>
      </div>
      <i v-if="is_show" class="el-icon-close" @click="del(id)"/>
      <div class="chartStyle" style="margin-top: 15px;">
        <el-table
          v-loading="loading"
          :data="tableData"
          border
          max-height="250"
          style="width: 100%">
          <el-table-column align="center" prop="firstCol" label="当前数据 \ 比较数据" min-width="25"/>
          <el-table-column v-for="(title,index) in tableTitle" :key="index" :label="title" align="center" min-width="25">
            <template slot-scope="scope">
              <span v-if="scope.row['grandNum' + index] === '--'">
                --
              </span>
              <span v-else>
                <span v-if="scope.row['upOrDown' + index] < 0 ">
                  ↓
                </span>
                <span v-if="scope.row['upOrDown' + index] > 0 ">
                  ↑
                </span>
                {{ scope.row['grandNum' + index] }}
              </span>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>
<script>
import cacheChart from './cacheChart'
export default {
  mixins: [cacheChart],
  props: {
    version: {
      type: String,
      default: ''
    },
    marketAction: {
      type: String,
      default: ''
    },
    link_resource: {
      type: String,
      default: 'all'
    },
    labelId: {
      type: [String, Number],
      default: '938'
    },
    actionId: {
      type: String,
      default: ''
    },
    marketingNo: {
      type: String,
      default: ''
    },
    createType: {
      type: String,
      default: 'filter'
    },
    groupDataTable: {
      type: String,
      default: ''
    },
    crowdFilter: {
      type: String,
      default: ''
    },
    FilterJson: {
      type: String,
      default: ''
    },
    chartObject: {
      type: Object,
      default: function() {
        return {}
      }
    },
    requestData: {
      type: Function,
      default: function() {
      }
    },
    updateRequestData: {
      type: Function,
      default: function() {}
    },
    templateId: {
      type: Number,
      default: 50000
    },
    is_show: {
      type: Boolean,
      default: true
    },
    is_no_border: {
      type: Boolean,
      default: true
    },
    brand_detail_no: {
      type: String,
      default: ''
    },
    brandBoolean: {
      type: Boolean,
      default: false
    },
    isPrint: {
      type: Boolean,
      default: false
    }

  },
  data() {
    return {
      loading: false,
      chartObj: { data: {}},
      title: '',
      tableTitle: [],
      tableData: []
    }
  },
  computed: {
    tAxis() {
      return this.chartObj.data.tAxis
    }
  },
  mounted() {
    this.requestDataFun()
  },
  methods: {
    async requestDataFun() {
      this.loading = true
      let param = {}
      if (this.brandBoolean !== true) {
        // 添加侧拉弹出需求字段
        param = { templateId: this.templateId,
          id: this.chartObject.id,
          link_resource: this.link_resource,
          createType: this.createType,
          labelId: this.labelId,
          actionId: this.actionId,
          marketingNo: this.marketingNo,
          groupDataTable: this.groupDataTable,
          crowdFilter: this.crowdFilter,
          version: this.version,
          marketAction: this.marketAction,
          filterJson: this.FilterJson }
      } else {
        param = { brand_detail_no: this.brand_detail_no, id: this.chartObject.id }
      }
      for (var i in param) {
        if (!param[i] && i === 'version') delete param[i]
        if (!param[i] && i === 'marketAction') delete param[i]
      }
      this.chartObj = await this.requestDataWrap(param)
      this.loading = false
      this.tableTitle = this.chartObj.data.legend
      this.title = this.chartObj.data.title
      this.tableData = this.chartObj.data.dataList
      this.tableData.map((item, index) => {
        item.firstCol = this.tableTitle[index]
      })
      this.$emit('chartNum', 1)
    },
    async del() {
      this.$confirm(' 确认删除图表吗 ?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        const is_del = 'Y'
        await this.updateRequestData({ id: this.chartObject.id, template: this.templateId, is_del: is_del })
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
.is_border{
 border: 1px solid #d3d5de;
}
.no_border{
   border: none
}
.dataChartBox{
  position: relative;
  width: 100%;
  height: 400px;
  padding: 20px 20px;
  border-radius: 1px;
  text-align: left;
  color: #435A82;
  span{
    font-weight: 600;
  }
  .chartStyle{
    width: 100%;
    height: 100%;
  }
  .el-icon-close{
    position: absolute;
    font-size: 14px;
    font-weight: 800;
    right: 8px;
    top: 8px;
    cursor: pointer;
  }
}
.showDiv {
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
}
.containTip {
  flex: 1;
  position: relative;
  left: 10px;
  display: block;
}
.cssarrow {
  display: none;
  position: absolute;
  top: -5px;
  z-index: 9999;
	background: #435A82;
  border: 3px solid #435A82;
  color: white;
  font-weight: normal;
  font-size: 13px;
  > p {
    line-height: 1.6;
  }
}
.cssarrow:after,
.cssarrow:before {
	right: 100%;
	top: 50%;
	border: solid transparent;
	content: " ";
	height: 0;
	width: 0;
	position: absolute;
	pointer-events: none;
}
.cssarrow:after {
	border-color: rgba(136, 183, 213, 0);
	border-right-color: #435A82;
	border-width: 6px;
	margin-top: -6px;
}
.cssarrow:before {
	border-color: rgba(194, 225, 245, 0);
	border-right-color: #435A82;
	border-width: 9px;
	margin-top: -9px;
}
.showMore{
  cursor: pointer;
}
.showMore:hover + .containTip .cssarrow {
  display: block;
}
</style>
