<template>
  <div class="parentContain">
    <div class="betwen">
      <div class="list">
        <span>营销动作：{{ progress.branchActionDesc }}</span>
        <span>考核指标：{{ progress.indexName }}</span>
        <span>权重：{{ progress.weight }}%</span>
      </div>
      <span v-if="parent.isBest && index === 0" class="best">最佳方案</span>
    </div>
    <div class="progress-line">
      <span style="width:70px;">{{ progress.indexName }}</span>
      <div ref="progress" class="progress"/>
      <span v-if="index === parent.branchDetail.length - 1" style="margin-left:10px;width:100px;">测试得分：{{ parent.score }}</span>
      <span v-else style="margin-left:10px;width:100px;"/>
    </div>
  </div>
</template>
<script>
import echarts from 'echarts'
export default {
  name: 'Progress',
  props: {
    progress: {
      type: Object,
      default: () => {
        return {}
      }
    },
    parent: {
      type: Object,
      default: () => {
        return {}
      }
    },
    index: {
      type: Number,
      default: () => {
        return 0
      }
    }
  },
  mounted() {
    const chart = echarts.init(this.$refs.progress)
    const option = {
      tooltip: {
        trigger: 'axis',
        axisPointer: { // 坐标轴指示器，坐标轴触发有效
          type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
        }
      },
      grid: {
        left: 0,
        right: 0,
        top: 0,
        bottom: 0
      },
      xAxis: {
        type: 'value',
        show: false
      },
      yAxis: {
        type: 'category',
        show: false,
        data: ['比率']
      },
      series: [{
        type: 'bar',
        name: this.progress.useName,
        data: [this.progress.useNum],
        // barWidth: 30,
        z: 10,
        itemStyle: {
          color: '#60acfc'
        }
      }, {
        type: 'bar',
        name: this.progress.sendName,
        data: [this.progress.sendNum],
        barGap: '-100%',
        itemStyle: {
          color: '#e5f0fe'
        }
      }]
    }
    chart.setOption(option)
    const fn = () => {
      chart.resize()
    }
    window.addEventListener('resize', fn)
    this.$on('hook:beforeDestroy', () => {
      window.removeEventListener('resize', fn)
    })
  }
}
</script>
<style lang="less">
.parentContain {
  color: rgb(96, 98, 102);
}
.betwen{
  padding-left: 15px;
  line-height: 3;
  display: flex;
  align-items: center;
  justify-content: space-between;
  .list {
    flex: 1;
    display: flex;
    justify-content: space-between;
  }
  .list span {
    flex: 1;
    display: inline-block;
    white-space: nowrap;
  }
  .best {
    color: red;
  }
}
.progress-line{
  padding-left: 15px;
  line-height: 3;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .progress{
    flex: 1;
    width: 830px;
    height: 40px;
  }
}
</style>
