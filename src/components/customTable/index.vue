<template>
  <div class="dashboard-container">
    <header>
      <el-form
        label-width="80px"
        style="display: flex;
      flex-wrap:wrap;background: #fff;padding: 16px 16px 0 16px; margin-bottom: 16px;">
        <div
          v-for="(item,index) in jsonData.head"
          :key="index"
          :style="{width:item.type ==='time' ? '500px':'auto'}"
          class="serach-item"
        >
          <el-form-item v-if="item.type ==='input'" :label="item.name" >
            <el-input :placeholder="'请输入' + item.name" v-model="searchForm[index]" />
          </el-form-item>
          <el-form-item v-if="item.type ==='time'" :label="item.name" >
            <el-date-picker
              v-model="time"
              :default-value="defaultDay(item.defaultDay)"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              @change="onchange(item.timeRange)"/>
          </el-form-item>
          <el-form-item v-if="item.type ==='select'" :label="item.name" >
            <component
              :is="item.componentName"
              v-model="searchForm[index]"
              :config="{
                multiple: false,
                disabled: false,
                collapseTags: false,
                moduleCode:item.param
              }"
            />
          </el-form-item>
        </div>
        <el-button style="height:32px;margin-left:10px;" @click="search()">查询</el-button>
      </el-form>
    </header>
    <section>
      <el-table
        v-loading="loading"
        stripe
        :data="tableData"
        header-cell-class-name="tableHight"
        style="width: 100%"
      >
        <el-table-column
          v-for="(item,index) in jsonData.tableDataHeader"
          :key="index"
          :prop="item.prop"
          :label="item.label"
          :width="item.width ? item.width: 'auto'"
          :formatter="item.formatter ? item.formatter : (row, column, cellValue, index)=>cellValue"
        />
      </el-table>
    </section>
    <div style="text-align: right;padding: 10px 0;">
      <el-pagination
       class="bottomPagination"
        :current-page.sync="params.currentPage"
        :page-size.sync="params.pageSize"
        :page-sizes="pageSizes"
        :total="total"
        background
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"/>
    </div>
  </div>
</template>

<script>
// import belleChooseBrandMemberLevel from '@/privatemodules/belle-choose-brand-member-level'
import LogAction from '@/components/LogAction'
import brand from  '@/privatemodules/belle-choose-brand'
export default {
  name: 'CustomTable',
  components: {
    // belleChooseBrandMemberLevel,
    LogAction,
    brand
  },
  props: {
    jsonData: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      time: '',
      loading: false,
      tableData: [],
      searchForm: [],
      params: {
        pageSize: 10,
        currentPage: 1
      },
      total: 10,
      pageSizes: [
        10, 20, 30, 40
      ]
    }
  },
  computed: {
  },
  mounted() {
    this.$nextTick(() => {
      this.addAction()
      this.getDataTable()
    })
  },
  methods: {

    defaultDay(day) {
      if (this.time || !day) {
        return
      }
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * day)
      this.time = [this.dateFormat('YYYY-mm-dd', start), this.dateFormat('YYYY-mm-dd', end)]
    },
    dateFormat(fmt, date) {
      let ret
      const opt = {
        'Y+': date.getFullYear().toString(), // 年
        'm+': (date.getMonth() + 1).toString(), // 月
        'd+': date.getDate().toString(), // 日
        'H+': date.getHours().toString(), // 时
        'M+': date.getMinutes().toString(), // 分
        'S+': date.getSeconds().toString() // 秒
        // 有其他格式化字符需求可以继续添加，必须转化成字符串
      }
      for (const k in opt) {
        ret = new RegExp(`(${k})`).exec(fmt)
        if (ret) {
          fmt = fmt.replace(ret[1], (ret[1].length == 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, '0')))
        }
      }
      return fmt
    },
    onchange(timeRange) {
      if (!timeRange) {
        return
      }
      const day1 = new Date(this.time[0])
      const day2 = new Date(this.time[1])
      if ((day2 - day1) / (1000 * 60 * 60 * 24) > timeRange) {
        this.time = []
        this.$Message.error(`查询时间范围不能超过${timeRange}天，请重新选择`)
      }
    },
    addAction() {
      this.jsonData.tableDataHeader.forEach((element) => {
        if (element.fieldAction === 1) {
          element.formatter = (row, column) => <el-popover trigger='hover' placement='top'>
            <p style='textAlign:center;max-width:200px;'>{ row[element.prop] }</p>
            <div slot='reference' class='marketing-list-page-name-wrapper'>
              { row[element.prop] }
            </div>
          </el-popover>
        }
        if (element.fieldAction === 2) {
          element.formatter = (row, column) => <a href={`/vipmanage/memberportrait/vip_detail_page?memberId=${row.operatedEntityId}`} style='color:#3f88bf'>{ row[element.prop] }</a>
        }
      })
    },
    handleChange($event) {
      console.log($event.target.value)
    },
    search() {
      this.params.currentPage = 1
      this.getDataTable()
    },
    getDataTable() {
      this.loading = true
      const obj = {
        current: this.params.currentPage,
        pageSize: this.params.pageSize
      }
      for (let index = 0; index < this.jsonData.head.length; index++) {
        const element = this.jsonData.head[index]
        if (element.type === 'time' && this.time && this.time.length > 0) {
          obj[element.uploadField] = []
          obj[element.uploadField][0] = this.time[0] + ' 00:00:00'
          obj[element.uploadField][1] = this.time[1] + ' 23:59:59'
          obj[element.uploadField] = obj[element.uploadField].join('_')
        } else if (this.searchForm[index]) {
          obj[element.uploadField] = this.searchForm[index]
        }
      }
      this.$request({
        url: this.jsonData.dataUrl,
        method: 'post',
        data: obj
      }).then(res => {
        this.loading = false
        this.tableData = res.data.list
        this.total = res.data.pagination.total
      })
    },
    handleSizeChange(val, bv) { // 选择每页显示条数
      this.getDataTable()
    },
    handleCurrentChange(val) { // 选择当前页数
      this.getDataTable()
    }
  }
}
</script>

<style lang="less" scoped>
.dashboard {
  &-container {
    margin: 30px;
    .serach-item {
      width: 328px;
    }
  }
  &-text {
    font-size: 20px;
    line-height: 36px;
  }
}
</style>
