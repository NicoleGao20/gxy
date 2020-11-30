<template>
  <el-container v-loading="pageLoading" class="level-rules-container">
    <el-main v-show="mode === 'view'" class="level-rules-list">
      <el-row class="notice-container">
        <p>1. 根据等级规则设置在客户交易成功时进行等级计算，显示相应的等级，但如果客户未绑卡，等级无法回传给线上渠道，其在线上渠道东对应的等级仍为0</p>
        <p>2. 每个等级的条件必须开启且设置一个才能升级到该等级</p>
      </el-row>
      <el-row class="level-system">会员等级体系</el-row>
      <el-row class="level-system-desc"> 成为会员后，根据用户的消费、互动等行为来划分等级，如普通京东会员根据京享值划分等级。</el-row>
      <el-row class="notice-container">
        <i class="el-icon-warning-outline icon-red"/> 手动修改等级规则后，新会员已生效，老会员未实时生效，如需对所有会员一起生效，请 <span
          class="update-level"
          @click="handleShowUpdateLevel">更新会员等级</span>
      </el-row>
      <el-dialog
        v-loading="dialogLoading"
        :visible.sync="dialogVisible"
        title="更新会员等级"
        width="560px">
        <p class="dialog-text">更新会员等级会对所有会员的等级进行更新，需要一定的时间，并且更新过程中无法编辑等级，建议完成所有规则调整后，再进行更新。</p>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleUpdateLevel">更新等级</el-button>
        </span>
      </el-dialog>
      <el-dialog
        v-loading="turnOnLoading"
        :visible.sync="turnOnVisible"
        title="启用等级提示"
        width="560px">
        <p class="dialog-text">{{ `启用等级${row.level_code}后，会员等级将重新计算${ prevRow&&prevRow.level_code? `，原${prevRow.level_code}的会员可能会发生等级变动`:''}` }}</p>
        <span slot="footer" class="dialog-footer">
          <el-button @click="turnOnVisible = false">取消</el-button>
          <el-button type="primary" @click="handleTurnOn">启用</el-button>
        </span>
      </el-dialog>
      <el-dialog
        v-loading="turnOffLoading"
        :visible.sync="turnOffVisible"
        title="禁用等级提示"
        width="560px">
        <p class="dialog-text">停用等级将对已有会员造成影响，如需停用请提前公告，以免造成不必要客诉，请谨慎操作。</p>
        <span slot="footer" class="dialog-footer">
          <el-button @click="turnOffVisible = false">取消</el-button>
          <el-button type="primary" @click="handleTurnOff">停用</el-button>
        </span>
      </el-dialog>
      <section class="table-container">
        <el-table
          v-loading="tableLoading"
          ref="table"
          :data="tableData"
          :header-cell-style="{background:'#eef1f6',color:'#606266'}"
          border
          stripe
          size="mini">
          <el-table-column
            :resizable="false"
            prop="level_code"
            width="150"
            label="会员等级">
            <template slot-scope="scope">
              <div class="vip-level">{{ scope.row.level_code }}</div>
            </template>
          </el-table-column>
          <el-table-column
            :resizable="false"
            prop="level_name"
            label="会员名称"/>
          <el-table-column
            :resizable="false"
            prop="cond_period"
            label="获得条件">
            <template slot-scope="scope">
              <div v-html="$options.filters.conditionFilter(scope.row)"/>
            </template>
          </el-table-column>
          <el-table-column
            :resizable="false"
            prop="level_status"
            label="等级状态"
            width="100">
            <template slot-scope="scope">
              {{ scope.row.level_status | statusFilter }}
            </template>
          </el-table-column>
          <el-table-column
            :resizable="false"
            width="120"
            prop="bg_color"
            label="等级背景">
            <template slot-scope="scope">
              <div :style="imgOrBgc(scope.row)" class="level-background"/>
            </template>
          </el-table-column>
          <el-table-column
            :resizable="false"
            width="120"
            prop="member_count"
            label="会员数"/>
          <el-table-column
            :resizable="false"
            label="操作"
            fixed="right"
            width="100">
            <template slot-scope="scope">
              <div v-if="scope.row.release_version > 1">
                <el-button
                  type="text"
                  size="small"
                  @click.native.prevent="handleEdit(scope.row)">
                  编辑
                </el-button>
                <el-button
                  v-if="scope.row.level_status"
                  type="text"
                  size="small"
                  @click.native.prevent="updateStatus(scope.row)">
                  {{ scope.row.level_status === 'on' ? '停用' : '开启' }}
                </el-button>
              </div>
              <div v-else>
                <el-button
                  type="text"
                  size="small"
                  @click.native.prevent="handleEdit(scope.row)">
                  待配置
                </el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
        <div v-if="isShowMore" class="show-more-level" @click="showMoreLevel">展开全部等级</div>
        <div v-if="isPackUp" class="show-more-level" @click="hideMoreLevel">收起部分等级</div>
      </section>
    </el-main>
    <level-info-form v-if="mode === 'edit'"/>
  </el-container>
</template>

<script>
import { getLevelList, updateLevelStatus, updateMemberAllByBrand } from '@/api/markting/level'
import { mapGetters } from 'vuex'

const STATUS_MAP = { 'on': '已开启', 'off': '已停用' }
const PERIOD_MAP = { 'year': '年', 'month': '月', 'day': '日' }
export default {
  name: 'LevelRules',
  components: {
    LevelInfoForm: () => import('./levelInfoForm')
  },
  filters: {
    statusFilter(level_status) {
      return STATUS_MAP[level_status]
    },
    conditionFilter(row) {
      const SNIPPET_MAP = {
        period: `${row.cond_period}${PERIOD_MAP[row.cond_period_type]}内，`,
        cond_amt: `累计消费满${row.cond_amt}元`,
        or: ` 或 `,
        cond_cnt: `累计消费满${row.cond_cnt}次`
      }
      let snippet = ``
      if (['cond_period', 'cond_period_type'].every(x => row.hasOwnProperty(x))) snippet += SNIPPET_MAP['period']
      if (row.hasOwnProperty('cond_amt') && !!row.cond_amt) snippet += SNIPPET_MAP['cond_amt']
      if (['cond_amt', 'cond_cnt'].every(x => row.hasOwnProperty(x) && !!row[x])) snippet += SNIPPET_MAP['or']
      if (row.hasOwnProperty('cond_cnt') && !!row.cond_cnt) snippet += SNIPPET_MAP['cond_cnt']
      return snippet
    }
  },
  data() {
    return {
      row: {},
      prevRow: {},
      tableData: [],
      fullTableData: [],
      dialogVisible: false,
      dialogLoading: false,
      tableLoading: false,
      turnOnVisible: false,
      turnOnLoading: false,
      turnOffVisible: false,
      turnOffLoading: false,
      isShowMore: false,
      packUp: false,
      mode: 'view',
      pageLoading: false
    }
  },
  computed: {
    isPackUp() {
      return this.packUp && !this.isShowMore
    },
    ...mapGetters(['brandCode'])
  },
  watch: {
    '$route': {
      handler(newVal, oldVal) {
        if (newVal && newVal.query && newVal.query.id) {
          this.mode = 'edit'
          return
        }
        this.mode = 'view'
      },
      deep: true,
      immediate: true
    },
    brandCode() {
      this.getLevelList('created')
    }
  },
  created() {
    if (this.$route.query && this.$route.query.id) return
    this.getLevelList('created')
  },
  methods: {
    /**
     *  点击展示更多
     */
    showMoreLevel() {
      this.tableData = this.fullTableData
      this.isShowMore = false
      this.packUp = true
    },

    hideMoreLevel() {
      this.tableData = this.fullTableData.slice(0, 3)
      this.isShowMore = !this.isShowMore
      this.packUp = false
    },

    /**
     *  获取等级列表
     */
    getLevelList(action) {
      this.pageLoading = true
      getLevelList({ brand_code: this.brandCode || 'durex' }).then(res => {
        if (res && res.data && res.data.list) {
          if (res.data.list.length > 3) {
            if (action === 'created') {
              this.tableData = res.data.list.slice(0, 3)
              this.fullTableData = res.data.list
              this.isShowMore = true
              return
            } else {
              if (this.isPackUp) {
                this.fullTableData = res.data.list
                this.tableData = res.data.list
              } else {
                this.tableData = res.data.list.slice(0, 3)
                this.fullTableData = res.data.list
              }
            }
          } else {
            this.isShowMore = false
            this.packUp = false
          }
          this.tableData = res.data.list
        }
      }).finally(() => {
        this.pageLoading = false
      })
    },

    /**
     *  显示更新等级弹框
     */
    handleShowUpdateLevel() {
      this.dialogVisible = true
    },

    /**
     *  更新等级按钮事件
     */
    handleUpdateLevel() {
      this.dialogLoading = true
      updateMemberAllByBrand().then(res => {
        this.dialogVisible = false
        this.$message({
          message: '请求已提交',
          type: 'success',
          duration: 1000
        })
      }).finally(() => {
        this.dialogLoading = false
      })
    },

    /**
     *  编辑按钮事件
     */
    handleEdit(row) {
      if (!row.id) {
        this.$message.error('这行数据没有id')
        return
      }
      this.$router.push({
        path: this.$route.path,
        query: { id: row.id }
      })
    },

    /**
     *  更新状态弹框
     */
    updateStatus(row) {
      if (!this.hasOffPermission(row)) {
        this.$message.error('不支持跨等级关闭！')
        return
      }
      this.row = row
      this.prevRow = {}
      const prevIndex = this.fullTableData.findIndex(x => x.id === row.id) - 1
      console.log('prev index', prevIndex)
      if (prevIndex >= 0) {
        this.prevRow = this.fullTableData[prevIndex]
        console.log('prev row', this.prevRow)
      }
      if (row.level_status === 'on') {
        this.turnOffVisible = true
        return
      }
      this.turnOnVisible = true
    },

    /**
     *  启用等级
     */
    handleTurnOn() {
      this.handleUpdateStatus({ id: this.row.id, level_status: 'on' }, 'turnOn')
    },

    /**
     *  停用等级
     */
    handleTurnOff() {
      this.handleUpdateStatus({ id: this.row.id, level_status: 'off' }, 'turnOff')
    },

    /**
     *  调用更新状态接口
     */
    handleUpdateStatus(data, action) {
      this[`${action}Loading`] = true
      updateLevelStatus(data).then(res => {
        if (res && res.data) {
          this.getLevelList()
        }
      }).finally(() => {
        this[`${action}Loading`] = false
        this[`${action}Visible`] = false
      })
    },

    // 验证是否为图片
    isImg(url) {
      const strFilter = '.jpeg|.jpg|.png|'
      if (url.indexOf('.') > -1) {
        const p = url.lastIndexOf('.')
        let strPostfix = url.substring(p, url.length) + '|'
        strPostfix = strPostfix.toLowerCase()
        if (strFilter.indexOf(strPostfix) > -1) {
          return true
        }
      }
      return false
    },

    // 判断显示图片还是显示照片
    imgOrBgc(row) {
      if (row && row.bg_picture_url && this.isImg(row.bg_picture_url)) {
        return { background: `url(${row.bg_picture_url}) no-repeat` }
      } else if (row && row.bg_color) {
        return { backgroundColor: row.bg_color }
      } else {
        return { backgroundColor: '#fff' }
      }
    },

    // 根据下一等级的状态判断当前等级是否可以停用
    hasOffPermission(row) {
      if (row.level_status === 'on') {
        const nextIndex = this.fullTableData.findIndex(x => x.id === row.id) + 1
        if (nextIndex <= this.fullTableData.length) {
          const nextLevel = this.fullTableData[nextIndex]
          return !(nextLevel && nextLevel.level_status === 'on')
        }
      }
      return true
    }
  }
}
</script>

<style lang="less" scoped>
.level-rules-container {
  width: 100%;
  min-height: 100%;
  background-color: #f3f3f3;
  padding: 20px;

  .level-rules-list {
    width: 100%;
    min-height: 100%;
    background-color: #fff;
  }

  .notice-container {
    border: 1px solid #ff8c44;
    line-height: 28px;
    background-color: #fff5ed;
    padding: 10px;
    color: #666;
    font-size: 12px;

    .update-level {
      color: #0035fe;
      cursor: pointer;
    }
  }

  .level-system, .level-system-desc {
    margin-top: 20px;
  }

  .level-system-desc {
    color: #aeaeae;
    margin-bottom: 20px;
  }

  .icon-red {
    color: red;
  }

  .dialog-text {
    line-height: 28px;
  }

  .tableHight {
    background: #f5f7fa !important;
  }

  .table-container {
    /deep/ .el-table td .cell, /deep/ .el-table th .cell {
      text-align: center;

      div {
        text-align: center;
      }
    }

    margin-top: 20px;

    .vip-level {
      color: red;
      font-size: 20px;
    }

    .level-background {
      margin: 0 20px;
      height: 30px;
      text-align: center;
      border-radius: 5px;
      border: 1px solid #e6e6e6;
      background-size: 100% 30px !important;
    }

    .show-more-level {
      font-size: 12px;
      margin-top: 20px;
      color: #0035fe;
      text-align: center;
      cursor: pointer;
    }

    .text-overflow {
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
}
</style>
