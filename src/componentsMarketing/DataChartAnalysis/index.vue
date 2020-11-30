<template>
  <div class="chartModleBox">
    <el-row :gutter="20">
      <draggable v-model="chartArr" :disabled="draggableDiable" class="chartModleBoxFlex" @change="changePosition">
        <el-col v-for="element in chartArr" :key="element.id" :xs="24" :sm="sm" :md="md" :lg="lg" :xl="xl" class="allChartModuleBox">
          <component
            :is="currentChartComponent[element.chart_type]"
            :chart-object="element"
            :request-data="requestData"
            :link_resource="link_resource"
            :label-id="labelId"
            :version="version"
            :market-action="marketAction"
            :action-id="actionId"
            :marketing-no="marketingNo"
            :create-type="createType"
            :group-data-table="groupDataTable"
            :filter-json="FilterJson"
            :crowd-filter="crowdFilter"
            :is_no_border="is_no_border"
            :is_show="is_show"
            :template-id="templateId"
            :brand-boolean="brandBoolean"
            :update-request-data="updateRequestData"
            :brand_detail_no="brand_detail_no"
            :end-time="endTime"
            :start-time="startTime"
            :is-print="isPrint"
            @chartNum="chartNumFun"
            @initData="initData" />
        </el-col>
      </draggable>
    </el-row>
  </div>
</template>
<script>
import draggable from 'vuedraggable'
// 成组 的  柱形图
import crmGroupBar from '@/components/CrmChart/crmGroupBar.vue'
// 堆叠在一起的柱形图
import crmStackBar from '@/components/CrmChart/crmStackBar.vue'
// 散点图
import crmScatter from '@/components/CrmChart/crmScatter.vue'
// 只有折线的折线图
import crmLine from '@/components/CrmChart/crmLine.vue'
// 普通的柱形图
import crmBar from '@/components/CrmChart/crmBar.vue'
//  长方形的指标卡
import crmCommon from '@/componentsMarketing/CrmChart/crmCommon.vue'
// 环形饼状图
import crmRingPie from '@/components/CrmChart/crmRingPie.vue'
// 折线+柱状图
import crmLineAndBar from '@/components/CrmChart/crmLineAndBar.vue'
// 金字塔
import crmPyramid from '@/components/CrmChart/crmPyramid.vue'
// elemet 表格
import crmGradeTable from '@/components/CrmChart/crmGradeTable.vue'
export default {
  components: {
    draggable,
    crmStackBar,
    crmGroupBar,
    crmBar,
    crmLine,
    crmCommon,
    crmRingPie,
    crmLineAndBar,
    crmPyramid,
    crmGradeTable,
    crmScatter
  },
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
    chartArr: {
      type: Array,
      default: function() {
        return []
      }
    },
    requestData: {
      type: Function,
      default: function() {}
    },
    updateRequestData: {
      type: Function,
      default: function() {}
    },
    hiddenString: {
      type: String,
      default: ''
    },
    templateId: {
      type: [String, Number],
      default: 5000
    },
    getChartUrl: {
      type: String,
      default: ''
    },
    is_no_border: {
      type: Boolean,
      default: true
    },
    is_show: {
      type: Boolean,
      default: true
    },
    draggableDiable: {
      type: Boolean,
      default: false
    },
    sm: {
      type: Number,
      default: 24
    },
    md: {
      type: Number,
      default: 24
    },
    lg: {
      type: Number,
      default: 24
    },
    xl: {
      type: Number,
      default: 12
    },
    brand_detail_no: {
      type: String,
      default: ''
    },
    brandBoolean: {
      type: Boolean,
      default: false
    },
    startTime: {
      type: String,
      default: ''
    },
    endTime: {
      type: String,
      default: ''
    },
    isPrint: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      chartData: [],
      currentChartComponent: {
        'crmStackBar': 'crmStackBar',
        'crmGroupBar': 'crmGroupBar',
        'crmPie': 'crmPie',
        'crmLine': 'crmLine',
        'crmCommon': 'crmCommon',
        'crmRingPie': 'crmRingPie',
        'crmLineAndBar': 'crmLineAndBar',
        'crmPyramid': 'crmPyramid',
        'crmGradeTable': 'crmGradeTable',
        'crmBar': 'crmBar'
        // 'crmScatter': 'crmScatter'
      }
    }
  },
  methods: {
    chartNumFun(obj) {
      // 计算隐藏的图表的请求全部成功
      this.$emit('chartNum', obj)
    },
    changePosition(item) {
      this.$emit('changePosition', item.moved)
    },
    initData() {
      this.$emit('initData')
    }
  }
}
</script>
<style lang="less" scoped>
.chartModleBox{
  .chartModleBoxFlex{
    display: flex;
    flex-wrap: wrap;
    .allChartModuleBox{
      margin-bottom: 25px;
    }
  }
}
</style>
