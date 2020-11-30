<template>
  <div class="dashboard-editor-container">

    <panel-group @handleSetLineChartData="handleSetLineChartData" />

    <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
      <line-chart :chart-data="lineChartData" />
    </el-row>

    <el-row :gutter="32">
      <el-col :xs="24" :sm="24" :lg="8">
        <div class="chart-wrapper">
          <raddar-chart />
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="8">
        <div class="chart-wrapper">
          <pie-chart />
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="8">
        <div class="chart-wrapper">
          <bar-chart />
        </div>
      </el-col>
    </el-row>

    
  </div>
</template>

<script>
import PanelGroup from './charts/PanelGroup'
import LineChart from './charts/LineChart'
import RaddarChart from './charts/RaddarChart'
import PieChart from './charts/PieChart'
import BarChart from './charts/BarChart'

const lineChartData = {
  newVisitis: {
    tbData: [100, 220, 161, 134, 105, 160, 165],
    jdData: [130, 82, 91, 154, 162, 140, 145],
    pddData: [200, 20, 161, 14, 105, 160, 165],
    wpData: [120, 122, 21, 134, 62, 142, 135]
  },
  messages: {
    tbData: [202, 192, 120, 144, 160, 130, 140],
    jdData: [180, 160, 151, 16, 145, 150, 130],
    pddData: [100, 20, 23, 134, 105, 160, 165],
    wpData: [100, 82, 91, 154, 162, 42, 145]
  },
  purchases: {
    tbData: [80, 100, 221, 104, 105, 90, 100],
    jdData: [120, 190, 100, 138, 142, 130, 130],
    pddData: [100, 34, 161, 32, 105, 160, 165],
    wpData: [110, 82, 91, 234, 162, 140, 145]
  },
  shoppings: {
    tbData: [130, 140, 141, 132, 145, 150, 160],
    jdData: [120, 82, 191, 154, 122, 140, 130],
    pddData: [10, 43, 161, 134, 105, 160, 165],
    wpData: [10, 82, 121, 32, 162, 140, 145]
  }
}

export default {
  name: 'Index',
  components: {
    PanelGroup,
    LineChart,
    RaddarChart,
    PieChart,
    BarChart
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
    margin-bottom: 32px;
  }
}

@media (max-width:1024px) {
  .chart-wrapper {
    padding: 8px;
  }
}
</style>
