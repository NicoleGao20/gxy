<template>
  <div class="dashboard-editor-container">

    <panel-group @handleSetLineChartData="handleSetLineChartData" />
  <el-row :gutter="10">
      <el-col :xs="24" :sm="24" :lg="12">
        <div class="chart-wrapper">
          <LPieChart/>
        </div>
      </el-col>

      <el-col :xs="24" :sm="24" :lg="12">
        <div class="chart-wrapper">
          <RLineChart/>
        </div>
      </el-col>
    </el-row>

    <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:10px;">
      <line-chart :chart-data="lineChartData" />
    </el-row>
    
  </div>
</template>

<script>
import PanelGroup from './charts/PanelGroup'
import LPieChart from './charts/LPieChart'
import RLineChart from './charts/RLineChart'
import LineChart from './charts/LineChart'

const lineChartData = {
  newVisitis: {
    OnlineData: [3, 0, 0, 2, 0, 0, 0, 10, 10, 20, 2, 1, 3, 20, 10, 0, 10, 0, 2, 1, 3, 0, 3, 3],
  }
}

export default {
  name: 'Index',
  components: {
    PanelGroup,
    LPieChart,
    RLineChart,
    LineChart
  },
  data() {
    return {
      lineChartData: lineChartData.newVisitis
    }
  },
  methods: {
    handleSetLineChartData(type) {
      this.lineChartData = lineChartData[type]
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard-editor-container {
  padding: 20px;
  background-color: rgb(240, 242, 245);
  position: relative;

  .chart-wrapper {
    background: #fff;
    padding: 16px 16px 0;
    margin-bottom: 10px;
  }
}

@media (max-width:1024px) {
  .chart-wrapper {
    padding: 8px;
  }
}
</style>
