<template>
  <el-container class="Level-adjustment-container">
    <el-main class="Level-adjustment">
      <el-radio-group v-model="mode" class="mb20">
        <el-radio label="table">手动修改</el-radio>
        <el-radio label="import">文件导入</el-radio>
      </el-radio-group>
      <level-adjustment-table v-show="mode === 'table'" class="mt20"/>
      <level-adjustment-file-import v-show="mode === 'import'"/>
    </el-main>
  </el-container>
</template>

<script>
import LevelAdjustmentTable from '@/views/platformitem/markting/loyalty/levelManagement/levelAdjustmentTable'
import LevelAdjustmentFileImport from '@/views/platformitem/markting/loyalty/levelManagement/levelAdjustmentFileImport'
export default {
  name: 'LevelAdjustment',
  components: { LevelAdjustmentTable, LevelAdjustmentFileImport },
  data() {
    return {
      mode: 'table'
    }
  },
  mounted() {

  },
  methods: {

  }
}
</script>

<style lang="less" scoped>
.Level-adjustment-container {
  padding: 20px;
  width: 100%;
  min-height: 100%;

  .Level-adjustment {
    max-width: 100%;
    min-height: 100%;
    background-color: #fff;

    /deep/ .el-table td .cell, /deep/ .el-table th .cell {
      text-align: center;

      div {
        text-align: center;
      }
    }
  }
  .mt20 {
    margin-top: 20px;
  }
}
</style>
