<template>
  <div>
    <ComTitle :name="setdata.name" :data="data" :setdata="setdata"/>
    <div class="dc-editor-select">
      <el-button-group class="button-group">
        <el-select v-model="data[setdata.pop]" :placeholder="'请选择'" @change="handleChange">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.name"
            :value="item.value"
          />
        </el-select>
        <el-button v-if="data[setdata.pop] === 'custom'" @click="dialogVisible=true">选择</el-button>
      </el-button-group>
    </div>
    <el-dialog
      :append-to-body="true"
      :center="true"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="false"
      :visible.sync="dialogVisible"
      :top="'5vh'"
      width="80vw"
      title="选择数据类型"
    >
      <section class="data-type-list-container">
        <el-row>
          <el-col :span="17">
            <div>
              选择数据源：
              <el-select v-model="customDataType" :placeholder="'请选择'" style="width: 200px" @change="getCustomTableData">
                <el-option
                  v-for="item in dataTypeOptions"
                  :key="item.name"
                  :label="item.name"
                  :value="item.value"
                />
              </el-select>
            </div>
            <div class="data-type-list">
              <el-table
                v-loading="loading"
                ref="customTable"
                :data="customTableData"
                height="60vh"
                class="data-table"
                stripe
                @row-click="handleRowClick"
              >
                <el-table-column
                  type="selection"
                  width="80"
                />
                <el-table-column
                  :label="$t('table.image')"
                  prop="resourceFileUrl"
                  width="100"
                >
                  <template slot-scope="scope">
                    <img :src="scope.row.resourceFileUrl" class="table-img" >
                  </template>
                </el-table-column>
                <el-table-column
                  :label="$t('table.name')"
                  prop="resourceName"
                  class-name="text-ellipsis"
                />
                <el-table-column
                  :label="$t('product.exchangePoint')"
                  prop="entryCondition"
                  width="200"
                />
              </el-table>
              <div class="pagination">
                <el-pagination
                  :total="customTablePagination.total"
                  :page-sizes="[20, 30, 40, 50, 100, 200]"
                  :page-size="data.pageSize"
                  :hide-on-single-page="true"
                  background
                  layout="prev, pager, next, sizes, total"
                  @current-change="handlePaginationChange"
                />
              </div>
            </div>
          </el-col>
          <el-col :span="7">
            <h4 class="selected-title">
              <div>已选中({{ data.data.length }})：<br><small>拖拽可排序</small></div>
              <el-popover
                v-model="confirmVisible"
                placement="top"
                width="160"
              >
                <p>确定要清空全部已选数据吗？</p>
                <div style="text-align: right; margin: 0">
                  <el-button type="text" size="mini" @click="confirmVisible = false">取消</el-button>
                  <el-button type="primary" size="mini" @click="handleClearSelected">确定</el-button>
                </div>
                <el-button slot="reference" size="mini">清空</el-button>
              </el-popover>
            </h4>
            <ul class="selected-list">
              <draggable
                :list="data.data"
                :options="{sort: true}"
              >
                <li v-for="(item, index) in data.data" :key="index" class="selected-item">
                  <div class="item-title text-ellipsis">{{ item.resourceName }}</div>
                  <el-tooltip class="item" effect="dark" content="删除" placement="left">
                    <i class="el-icon-delete" @click="handleDeleteRow(item)" />
                  </el-tooltip>
                </li>
              </draggable>
            </ul>
          </el-col>
        </el-row>
      </section>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">{{ this.$t('form.cancel') }}</el-button>
        <el-button type="primary" @click="dialogVisible = false">{{ this.$t('form.confirm') }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script type="text/javascript">
import draggable from 'vuedraggable'
import ComTitle from './comTitle'
import { getDataDictionaries, getDecorateProductList } from '@/api/decorate'

export default {
  name: 'DecorateSelect',
  components: {
    ComTitle,
    draggable
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
      loading: false,
      options: [],
      dataTypeOptions: [],
      customDataType: null,
      customTableData: [],
      customTablePagination: {
        total: 0
      },
      customImageListData: [],
      selectedData: [],
      currentPage: 1,
      confirmVisible: false
    }
  },
  created() {
    this.getDataSource()
  },
  methods: {
    async getDataSource() {
      const res = await getDataDictionaries('DECORATE_DATA_TYPE')
      const datasource = res && res.data && res.data.list ? res.data.list : []
      this.options = [
        ...datasource,
        { name: '自定义', value: 'custom' }
      ]
      this.dataTypeOptions = JSON.parse(JSON.stringify(this.options))
      this.dataTypeOptions.pop()
    },
    async getImageListData(id) {
      // console.log('this.setdata', this)
      const { pageSize, sortField, sortOrder } = this.data
      const params = {
        type: id,
        current: this.currentPage,
        pageSize,
        sortField,
        sortOrder,
        brandCode: 'TS'
      }
      const res = await getDecorateProductList(params)
      const data = res && res.data && res.data.list ? res.data.list : []
      this.data.data = data
      // console.log('data', data)
    },
    async getCustomTableData() {
      this.customTableData = []
      this.loading = true
      const { pageSize, sortField, sortOrder } = this.data
      // console.log('this.customDataType', this.customDataType)
      const res = await getDecorateProductList({
        type: this.customDataType,
        current: this.currentPage,
        pageSize,
        sortField,
        sortOrder,
        brandCode: 'TS'
      })
      this.customTableData = res.data && res.data.list || []
      this.customTablePagination = res.data && res.data.pagination || { total: 0 }
      this.loading = false
      setTimeout(() => {
        this.toggleRowSelection()
      }, 100)
      // console.log('data', this.customTableData)
    },
    handleChange(value) {
      if (value === 'custom') {
        this.customTableData = this.data.data
        this.dialogVisible = true
      } else {
        this.getImageListData(value)
      }
    },
    handleClearSelected() {
      this.data.data = []
      this.confirmVisible = false
    },
    // handleConfirm() {
    //   this.dialogVisible = false
    //   this.data.data = this.selectedData
    // },
    handleOpen() {
      // this.selectedData = this.data.data
    },
    toggleRowSelection() {
      console.log('toggle selection')
      this.customTableData.forEach(row => {
        const hasRow = this.data.data.find(dataItem => dataItem.resourceId === row.resourceId)
        if (hasRow) {
          this.$refs.customTable.toggleRowSelection(row)
        }
      })
      // this.$refs.customTable.toggleAllSelection()
    },
    handlePaginationChange(currentPage) {
      this.currentPage = currentPage
      this.getCustomTableData(currentPage)
    },
    handleRowClick(row) {
      this.$refs.customTable.toggleRowSelection(row)
      const index = this.data.data.findIndex(dataItem => dataItem.resourceId === row.resourceId)
      if (index > -1) {
        this.data.data.splice(index, 1)
      } else {
        this.data.data.push(row)
      }
    },
    handleDeleteRow(row) {
      const index = this.data.data.findIndex(dataItem => dataItem.resourceId === row.resourceId)
      if (index > -1) {
        this.data.data.splice(index, 1)
      }
      this.$refs.customTable.toggleRowSelection(row, false)
    }
  }
}
</script>
<style lang="less">
.dc-editor-select {
  .el-select {
    display: block;
  }
  .button-group {
    display: flex;
    .el-select {
      flex: 1;
    }
    .el-button {
      margin-left: -1px;
    }
  }
  .el-input__inner {
    border-radius: 0;
  }
}

.datasource-tag {
  background-color: #fff;
  margin-right: 12px;
  cursor: pointer;

  &.active {
    background-color: #409eff;
    border-color: #409eff;
    color: #fff;
  }
}

.m-l {
  margin-left: 15px;
}
.text-ellipsis, .text-ellipsis .cell {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.data-table {
  .cell {
    line-height: inherit;
  }
}
.table-img {
  max-width: 200px;
  max-height: 40px;
}
.pagination {
  display: flex;
  justify-content: center;
  padding-top: 10px;
}

.selected-title {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin: 0 0 15px 10px;
  small {
    color: #999;
  }
}
.selected-list {
  height: 60vh;
  padding: 0 0 0 10px;
  overflow: hidden auto;
}
.selected-item {
  display: flex;
  justify-content: space-between;
  padding: 6px 3px;

  .item-title {
    flex: 1;
    margin-right: 10px;
    cursor: move;
  }
  i {
    cursor: pointer;
  }

  &:nth-child(odd) {
    background-color: #f2f2f2;
  }
}
</style>
