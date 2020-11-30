<template>
  <div class="page-container-gap">
    <el-form label-width="80px" style="background: #fff;padding: 16px 16px 0 16px; margin-bottom: 16px;">
      <el-row :gutter="16">
        <el-col :span="8">
          <el-form-item label="营销编号">
            <el-input v-model="searchForm.code" placeholder="请输入内容"/>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="营销名称">
            <el-input v-model="searchForm.marketingName" placeholder="请输入营销名称"/>
          </el-form-item>
        </el-col>
        <el-col  :span="8">
          <el-form-item label="营销类型">
            <el-select v-model="searchForm.marketingTypeValue" style="width: 100%;" multiple collapse-tags placeholder="请选择">
              <el-option
                v-for="item in quryParamsData.marketingType"
                :key="item.value"
                :label="item.name"
                :value="item.value"/>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col v-show="isMoreinquiries" :span="8">
          <el-form-item label="营销状态">
            <el-select v-model="searchForm.marketingStatusValue" style="width: 100%;" multiple collapse-tags placeholder="请选择">
              <el-option
                v-for="item in quryParamsData.marketingStatus"
                :key="item.value"
                :label="item.name"
                :value="item.value"/>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col v-show="isMoreinquiries" :span="8">
          <el-form-item label="营销目的">
            <el-select v-model="searchForm.marketingPurposeValue" style="width: 100%;" multiple collapse-tags placeholder="请选择">
              <el-option
                v-for="item in quryParamsData.marketingPurpose"
                :key="item.value"
                :label="item.name"
                :value="item.value"/>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col v-show="isMoreinquiries" :span="8">
          <el-form-item label="创建人">
            <el-input v-model="searchForm.creater" placeholder="请输入创建人"/>
          </el-form-item>
        </el-col>
        <el-col v-show="isMoreinquiries" :span="16">
          <el-form-item label="时间类型">
            <div style="display: flex;">
              <el-select v-model="searchForm.queryTimeLabelValue" placeholder="请选择">
                <el-option
                  v-for="item in quryParamsData.queryTimeLabel"
                  :key="item.value"
                  :label="item.name"
                  :value="item.value"/>
              </el-select>
              <el-date-picker
                v-model="searchForm.date"
                style="width: 500px;"
                format="yyyy-MM-dd HH:mm:ss"
                value-format="yyyy-MM-dd HH:mm:ss"
                type="datetimerange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"/>
            </div>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item style="white-space: nowrap">
          <el-button type="primary" @click="reloadData">查询</el-button>
          <el-button
              v-show="!isMoreinquiries"
              @click="isMoreinquiries = !isMoreinquiries"
              >更多筛选</el-button>
              <el-button
              v-show="isMoreinquiries"
              type="primary"
              class="search-collapse"
              @click="isMoreinquiries = !isMoreinquiries"
              >收起<i class="el-icon-d-arrow-right" />
            </el-button>
            </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <section>
      <div class="table">
        <el-button
         type="primary" @click="openActivityModal()">新增活动</el-button>
        <section style="margin-top: 15px;">
          <el-table
            v-loading="loading"
            :data="tableData"
            header-cell-class-name="tableHight"
            style="width: 100%"
          >
            <el-table-column
              v-for="(item,index) in dataTableHeader"
              :key="index"
              :prop="item.prop"
              :label="item.label"
              :width="item.width ? item.width: 'auto'"
              :formatter="item.formatter ? item.formatter : (row, column, cellValue, index)=>cellValue"
            />

            <el-table-column
              label="操作"
              fixed="right"
              border
              width="250px">
              <template slot-scope="scope">
                <el-button
                  type="text"
                  size="small"
                  @click="viewActivity(scope.row)">
                  查看
                </el-button>
                <el-button
                  v-if="[2,3,4,5,6].find(res=>res + '' == scope.row.status)"
                  type="text"
                  size="small"
                  @click.native.prevent="()=>{oncellClick(scope.row)}">
                  审核日志
                </el-button>

                <el-button
                  v-if="[2].find(res=>res + '' == scope.row.status) && jobNum !== scope.row.createUserCode"
                  type="text"
                  size="small"
                  @click="reviewActivity(scope.row)">
                  审核
                </el-button>

                <el-button
                  v-if="[1,3].find(res=>res + '' == scope.row.status)"
                  type="text"
                  size="small"
                  @click="editMarketingActivity(scope.row)">
                  编辑
                </el-button>
                <el-button
                  v-if="[4,5,6].find(res=>res + '' == scope.row.status)"
                  type="text"
                  size="small"
                  @click.native.prevent="()=>{oncoye(scope.row)}">
                  复制
                </el-button>
                <el-button
                  class="deleteFontColor"
                  v-if="[4,5].find(res=>res + '' == scope.row.status)"
                  type="text"
                  size="small"
                  @click.native.prevent="()=>{onEnd(scope.row)}">
                  结束
                </el-button>
                <el-button
                  class="deleteFontColor"
                  v-if="[1,3].find(res=>res + '' == scope.row.status)"
                  type="text"
                  size="small"
                  @click.native.prevent="()=>{ondelete(scope.row.id)}">
                  删除
                </el-button>
                <el-button
                  v-if="[5,6].find(res=>res + '' == scope.row.status)"
                  type="text"
                  size="small"
                  @click="marketingReport()">
                  查看报告
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </section>
        <div style="text-align: right;padding: 10px 0;">
          <el-pagination
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
    </section>
    <el-dialog
      :visible.sync="logPupShow"
      :before-close="()=>{logPupShow = false}"
      title="审核日志"
      width="900px">
      <section class="pup-table-wrap">
        <el-table
          :data="logData"
          header-cell-class-name="tableHight"
          style="width: 100%">
          <el-table-column
            prop="marketingName"
            label="活动名称"
            width="180"/>
          <el-table-column
            prop="auditTime"
            label="审核时间"
            width="180"/>
          <el-table-column
            prop="auditUser"
            label="审核人"/>
          <el-table-column
            prop="auditContent"
            label="审核意见"/>
          <el-table-column
            prop="auditStatus"
            label="审核结果"/>
        </el-table>
      </section>
    </el-dialog>
    <el-dialog
      :visible.sync="conypup"
      :before-close="()=>{conypup = false}"
      title="确认提示"
      width="450px">
      <div class="copy-pup">
        <p><i style="font-size: 24px;margin-right: 10px;color:#ffb547" class="iconfont icon-jinggao"/>如确认复制活动，请填写复制后营销活动的名称</p>
        <div>
          <span>营销名称:</span>
          <div>
            <el-input v-model="copyValue" placeholder="请输入营销名称"/>
          </div>
        </div>
        <el-popover
          placement="left"
          title="名称规范"
          width="200"
          trigger="hover">
          <span slot="reference">名称规范</span>
          <p solt="content" style="fontSize: 12px;">内容说明：直观体现活动内容，如“发送20元优惠券”<br><br>字数说明：不超过200个字符，一个汉字占两个字符，一个数字、字母、空格占一个字符；</p>
        </el-popover>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="conypup = false; coping=false">取 消</el-button>
        <el-button :loading="coping" type="primary" @click="oncopyOk()">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :visible.sync="activityModalVisible"
      title="营销类型"
      width="800px">
      <act-pre-condition v-if="activityModalVisible" ref="actPreForm" :act-pre-form="actPreForm"/>
      <span slot="footer" class="dialog-footer">
        <el-button @click="activityModalVisible = false">取 消</el-button>
        <el-button type="primary" @click="gotoCreateActivity">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>

import { checkPermission } from '@/utils/permission'
import { getmarketingBtnIsok, getmarketingListParameter, marketingCopyActivity, endmarketingList, getmarketingTableParameter, getmarketinglog, deletemarketingList } from '@/api/markting/marketing'
import actPreCondition from '../actPreCondition'
import processMarketingContent from '../processMarketingContent'
// import belleChooseOrganLevel from '@/privatemodules/belle-choose-organ-level'
import { getToken } from '@/utils/auth'
import cacheCondition from '@/utils/cacheCondition'
import { auditMarketingActivity } from '@/api/markting/marketing'
export default {
  name: 'MarketingList',
  components: {
    actPreCondition,
    // belleChooseOrganLevel
  },
  mixins: [processMarketingContent, cacheCondition],
  data() {
    return {
      loading: false,
      jobNum: '',
      chooseOrganLevelconfig: {
        multiple: true,
        collapseTags: true
      },
      chooseOrganDataConfig: {
        targetLevel: 4,
        bigAreas: this.$store.state.user.roles.some((item) => {
          return (item.organLevel === 1 || item.organLevel === '1')
        }) ? [
            {
              orgName: '全国',
              orgCodeLong: 'all'
            }
          ] : []
      },
      levelMap: {
        1: 'bigAreas',
        2: 'smallAreas',
        3: 'managerAreas',
        4: 'managerCityAreas',
        5: 'operateCities',
        6: 'storeItems'
      },
      opt: { 'bigAreas': '', 'smallAreas': '', 'managerAreas': '', 'managerCityAreas': '', 'operateCities': '', 'storeItems': '' },

      activityModalVisible: false,
      coping: false,
      actPreForm: {
        marketingType: '',
        marketingTarget: 'member_id'
      },
      getters: {},

      // 复制弹窗
      conypup: false, // 复制弹窗
      copyValue: '',
      copyItem: null,

      status: {
        1: '待提交',
        2: '审核中',
        3: '审核不通过',
        4: '审核通过',
        5: '活动中',
        6: '已结束'
      },
      logData: [],
      logPupShow: false,
      quryParamsData: {
        marketingRegion: [],
        marketingType: [],
        marketingStatus: [],
        marketingPurpose: [],
        queryTimeLabel: []

      },
      searchForm: {
        queryTimeLabelValue: '',
        marketingRegionValue: '',
        marketingTypeValue: [],
        marketingStatusValue: [],
        marketingPurposeValue: [],
        marketingName: '',
        creater: '',
        code: '',
        date: ''
      },

      dataTableHeader: [
        {
          fixed: 'true',
          prop: 'marketingNo',
          label: '营销编号',
          width: '100px',
        },
        {
          prop: 'marketingTypeName',
          label: '营销类型'
        },
        // {
        //   prop: 'marketingRegion',
        //   label: '营销区域',
        //   width: '130px',
        //   formatter: (row, column) => {
        //     return <el-popover trigger='hover' placement='bottom'>
        //       <p style='textAlign:center;max-width:200px;'>{ row.marketingRegion }</p>
        //       <div slot='reference' class='marketing-list-page-name-wrapper'>
        //         { row.marketingRegion }
        //       </div>
        //     </el-popover>
        //   }
        // },
        {
          prop: 'marketingPurposeName',
          label: '营销目的'
        },
        // {
        //   prop: 'marketingTarget',
        //   label: '营销对象',
        //   formatter: (row, column) => {
        //     return row.marketingTarget === 'member_id' ? '会员' : '关注者'
        //   }
        // },
        {
          prop: 'marketingAction',
          label: '营销动作',
          width: '130px',
          formatter: (row, column) => {
            return <el-popover trigger='hover' placement='bottom'>
              <p style='textAlign:center;max-width:130px;'>{ row.marketingAction } </p>
              <div slot='reference' class='marketing-list-page-name-wrapper'>
                { row.marketingAction }
              </div>
            </el-popover>
          }
        },
        {
          prop: 'marketingName',
          label: '营销名称',
          width: '150px',
          formatter: (row, column) => {
            return <el-popover trigger='hover' placement='bottom'>
              <p style='textAlign:center;max-width:150px;'>{ row.marketingName } </p>
              <div slot='reference' class='marketing-list-page-name-wrapper'>
                { row.marketingName }
              </div>
            </el-popover>
          }
        },
        {
          prop: 'marketingDesc',
          label: '营销说明',
          width: '160px',
          formatter: (row, column) => {
            return <el-popover trigger='hover' placement='bottom'>
              <p style='textAlign:center;max-width:200px;'>{ row.marketingDesc } </p>
              <div slot='reference' class='marketing-list-page-name-wrapper'>
                { row.marketingDesc }
              </div>
            </el-popover>
          }
        },
        {
          label: '营销时间',
          width: '160px',
          formatter: (row, column) => {
            return <div>
              <div>{row.marketingTimeBegin}</div>
              <div>{row.marketingTimeEnd}</div>
            </div>
          }
        },
        {
          prop: 'status',
          label: '营销状态',
          formatter: (row, column, cellValue, index) => {
            const status = this.status
            return cellValue !== 3 ? status[cellValue] : <span style='color:#FF0000' >{status[cellValue]}</span>
          }
        },
        {
          prop: 'createUser',
          label: '创建人',
          formatter: (row, column, cellValue, index) => {
            return <human-info num={row.createUserCode}>{cellValue}</human-info>
          }
        },
        {
          prop: 'createTime',
          width: '160px',
          label: '创建时间'
        },
        {
          prop: 'auditUser',
          label: '审核人',
          formatter: (row, column, cellValue, index) => {
            return <human-info num={row.auditUserCode}>{cellValue}</human-info>
          }
        },
        {
          prop: 'auditTime',
          width: '160px',
          label: '审核时间'
        },
        {
          prop: 'updateUser',
          label: '修改人',
          formatter: (row, column, cellValue, index) => {
            return <human-info num={row.updateUserCode}>{cellValue}</human-info>
          }
        },
        {
          prop: 'updateTime',
          label: '修改时间'
        }
      ],
      dialogDelete: false, // 控制删除弹窗参数
      params: {
        pageSize: 10,
        currentPage: 1
      },
      total: 10,
      pageSizes: [
        10, 20, 30, 40
      ],
      tableData: [],
      isMoreinquiries: false,
    }
  },
  mounted() {
    this.jobNum = getToken('jobNumber')
    this.ongetQuryParams()
    this.getDataTable()
    this.getters = this.$store.getters
    document.onkeydown = (e) => {
      let currKey = 0
      e = event || window.event
      currKey = e.keyCode || e.which || e.charCode
      if (currKey === 13) {
        this.reloadData()
      }
    }
  },
  methods: {
    checkPermission,
    marketingReport() {
      const newHref = this.$router.push({ name: 'marketingReport' })
    },
    // onlookReport(row) {
    //   getmarketingBtnIsok({ id: row.id }).then(res => {
    //     if (res.data.editStatus === 'N') {
    //       this.$message({
    //         message: `您的数据权限已变更，不可编辑活动`,
    //         type: 'warning'
    //       })
    //     } else {
    //       this.$router.push(
    //         {
    //           name: 'marketingReport',
    //           query: {
    //             marketingNo: row.marketingNo,
    //             marketingId: row.id,
    //             marketingType: row.marketingType
    //           }
    //         }
    //       )
    //     }
    //   })

    // },
    // this.$router.push('/marketingReport/' + id)
    oncoye(row) {
      this.copyItem = row
      this.conypup = true
      this.copyValue = ''
    },
    oncopyOk() {
      if (!this.copyValue) {
        this.$message({
          type: 'info',
          message: '请输入营销名称'
        })
        return
      }
      if (this.coping) return
      this.coping = true

      var marketingContent
      if (this.copyItem.marketingContent) {
        try {
          marketingContent = JSON.parse(this.copyItem.marketingContent)
        } catch (e) {
          console.log(e)
        }
      }
      var marketingContentStr = this.processMarketingContent(marketingContent)

      marketingCopyActivity({
        id: this.copyItem.id,
        marketingName: this.copyValue,
        marketingContent: marketingContentStr
      }).then(res => {
        this.coping = false
        this.conypup = false
        this.copyItem = null
        this.copyValue = ''

        this.getDataTable()
        this.$message({
          type: 'success',
          message: '复制成功!'
        })
      })
    },
    oncellClick(row) { // 审核不通过时获取日志
      getmarketinglog({
        marketingDefId: row.id
      }).then(res => {
        this.logData = res.data.list
        this.logPupShow = true
      })
    },
    reloadData() {
      this.params.currentPage = 1
      this.getDataTable()
    },
    getDataTable() { // 获取表格数据
      this.loading = true
      this.setMarketingRegionValue()
      getmarketingTableParameter({
        marketingNo: this.searchForm.code,
        marketingRegion: this.searchForm.marketingRegionValue,
        marketingTypes: this.searchForm.marketingTypeValue.join(','),
        statusList: this.searchForm.marketingStatusValue.join(','),
        marketingPurposes: this.searchForm.marketingPurposeValue.join(','),
        queryTimeLabel: this.searchForm.queryTimeLabelValue,
        createUser: this.searchForm.creater,
        marketingName: this.searchForm.marketingName,
        beginTime: this.searchForm.date ? this.searchForm.date[0] : '',
        endTime: this.searchForm.date ? this.searchForm.date[1] : '',
        current: this.params.currentPage,
        pageSize: this.params.pageSize
      }).then(
        res => {
          this.loading = false
          this.total =Number(res.data.pagination.total || 0)
          this.tableData = res.data.list
          if (res.data.list.length === 0 && this.params.currentPage > 1) {
            this.params.currentPage = this.params.currentPage - 1
            this.getDataTable()
          }
        }
      )
    },
    onEnd(row) { // 结束按钮功能
      getmarketingBtnIsok({ id: row.id }).then(res => {
        if (res.data.editStatus === 'N') {
          this.$message({
            message: `您的数据权限已变更，不可编辑活动`,
            type: 'warning'
          })
        } else {
          this.$confirm(`<div style="padding-bottom: 15px; border-bottom: 1px solid #E4E7ED;">
                <p style="color: #000;font-size: 16px;"><i style="font-size: 28px;margin-right: 16px;color:#ffb547" class="iconfont icon-jinggao"></i>是否确认结束此营销活动?</p>
                <p style="padding-left: 42px;color: #888888;font-size: 14px;">结束后，此营销活动仅支持查看、复制活动流程</p>
              </div>`, '确认提示', {
            dangerouslyUseHTMLString: true,
            confirmButtonText: '确定',
            cancelButtonText: '取消'
          }).then(() => {
            endmarketingList({ id: row.id, marketing_no: row.marketingNo }).then(res => {
              this.$message({
                type: 'success',
                message: '已结束'
              })
              this.getDataTable()
            })
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消结束'
            })
          })
        }
      })
    },
    ondelete(id) { // 删除按钮功能
      this.$confirm(`<div style="padding-bottom: 15px; border-bottom: 1px solid #E4E7ED;">
        <p style="color: #000;font-size: 16px;"><i style="font-size: 28px;margin-right: 16px;color:#ffb547" class="iconfont icon-jinggao"></i>是否确认删除？</p>
        <p style="padding-left: 42px;color: #888888;font-size: 14px;">删除后，营销活动即从营销活动列表中移除</p>
      </div>`, '确认提示', {
        dangerouslyUseHTMLString: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(() => {
        deletemarketingList({ id: id }).then(res => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.getDataTable()
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    openActivityModal() { // 新增按钮
      this.activityModalVisible = true
    },
    ongetQuryParams() { // 获取选择参数数据
      getmarketingListParameter().then(res => {
        this.quryParamsData = res.data
        this.searchForm.queryTimeLabelValue = res.data.queryTimeLabel[0].value
      })
    },
    handleSizeChange(val, bv) { // 选择每页显示条数
      this.getDataTable()
    },
    handleCurrentChange(val) { // 选择当前页数
      this.getDataTable()
    },
    editMarketingActivity(row) {
      getmarketingBtnIsok({ id: row.id }).then(res => {
        if (res.data.editStatus === 'N') {
          this.$message({
            message: `您的数据权限已变更，不可编辑活动`,
            type: 'warning'
          })
        } else {
          this.$router.push(
            {
              name: 'marketingSettingEdit',
              query: {
                id: row.id,
                create_type: 'activity',
                marketing_target: row.marketingTarget,
                marketing_type: row.marketingType,
                action_type: 'edit'
              }
            }
          )
        }
      })
    },
    gotoCreateActivity() {
      this.$refs['actPreForm'].validateActPre().then(() => {
        this.$router.push(
          {
            name: 'marketingSettingAdd',
            query: {
              id: null,
              create_type: 'activity',
              marketing_target: this.actPreForm.marketingTarget,
              marketing_type: this.actPreForm.marketingType,
              action_type: 'add'
            }
          }
        )
      })
    },
    getFormatDate() {
      var date = new Date()
      var month = date.getMonth() + 1
      var strDate = date.getDate()
      var getHours = date.getHours()
      var getMinutes = date.getMinutes()
      var getSeconds = date.getSeconds()
      if (month >= 1 && month <= 9) {
        month = '0' + month
      }
      if (strDate >= 0 && strDate <= 9) {
        strDate = '0' + strDate
      }
      if (getHours < 10) {
        getHours = '0' + getHours
      }
      if (getMinutes < 10) {
        getMinutes = '0' + getMinutes
      }
      if (getSeconds < 10) {
        getSeconds = '0' + getSeconds
      }

      var currentDate = date.getFullYear() + '-' + month + '-' + strDate +
                  ' ' + getHours + ':' + getMinutes + ':' + getSeconds
      return currentDate
    },
    reviewActivity(row) {
      const time = this.getFormatDate()

      const marketingTime = row.marketingTime.split(' ')
      const start = marketingTime[0] + ' ' + marketingTime[1]
      if (time < start) {
        this.$router.push(
          {
            name: 'marketingSettingAudit',
            query: {
              id: row.id,
              create_type: 'activity',
              marketing_target: row.marketingTarget,
              marketing_type: row.marketingType,
              action_type: 'audit'
            }
          }
        )
      } else {
        this.$message({
          message: `营销活动已过期`,
          type: 'warning'
        })
        auditMarketingActivity({
          'id': row.id,
          'auditContent': '审核意见测试',
          'auditStatus': 'agree',
          'marketingTimeBegin': start
        }).then(res => {
          this.getDataTable()
        })
      }
    },
    setMarketingRegionValue() {
      var baseOrgLevel = 0
      var curSelectOrgCodes = ''
      if (this.opt[this.levelMap[1]]) {
        baseOrgLevel = 1
        curSelectOrgCodes = this.opt[this.levelMap[1]].split(',')
      }
      if (this.opt[this.levelMap[2]]) {
        baseOrgLevel = 2
        curSelectOrgCodes = this.opt[this.levelMap[2]].split(',')
      }
      if (this.opt[this.levelMap[3]]) {
        baseOrgLevel = 3
        curSelectOrgCodes = this.opt[this.levelMap[3]].split(',')
      }
      if (this.opt[this.levelMap[4]]) {
        baseOrgLevel = 4
        curSelectOrgCodes = this.opt[this.levelMap[4]].split(',')
      }
      var orgCodeLongArr = []
      if (baseOrgLevel > 0) {
        var miniAuth = this.$refs['marketingRegion'].getMinAuthParam(baseOrgLevel, curSelectOrgCodes)
        for (var attr in miniAuth) {
          orgCodeLongArr = orgCodeLongArr.concat(miniAuth[attr])
        }

        if (curSelectOrgCodes.indexOf('all') > -1) {
          orgCodeLongArr.push('all')
        }
      }

      this.searchForm.marketingRegionValue = orgCodeLongArr.join(',')
    },
    viewActivity(row) {
      this.$router.push(
        {
          name: 'marketingSettingView',
          query: {
            id: row.id,
            create_type: 'activity',
            marketing_target: row.marketingTarget,
            marketing_type: row.marketingType,
            action_type: 'view'
          }
        }
      )
    }
  }
}
</script>
<style lang="less"  scoped>
.marketing-list-page {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 100%;
  height: 100%;
  background: #f6f6f6;
  .copy-pup {
    box-sizing: border-box;
    display: flex;
    justify-content: center;
    flex-direction: column;
    padding-left: 30px;
    width: 100%;
    height: 100%;
    p {
      font-size: 14px;
      color:#999;
      margin-bottom: 10px;
    }
    &>span {
      margin-top: 10px;
      font-size: 12px;
      padding-left:244px;
      color: #435A82;
    }
    &>div {
      display: flex;
      align-items: center;
      padding-left: 37px;
      span {
        color:#000;
        margin-right: 5px;
        &::before {
          content: '*';
          color:#ff0000;
          font-size: 14px;
        }
      }
    }
  }
  .pup-table-wrap {
    max-height: 440px;
    overflow:auto;
    border: 1px solid #F5F7FA;
    border-bottom:none;
  }
   /deep/ .tableHight{
          background: #f5f7fa !important ;
        }
  &>header {
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    min-height: 279px;
    padding: 45px 120px 34px 54px;
    background: #fff;
    margin-bottom: 20px;
    ul{
      display: flex;
      justify-content: space-between;
      &:last-child{
        justify-content: flex-start;
      }
      &>li {
       display: flex;
       align-items: center;
       flex:1;
       span {
         width: 88px;
         color: #666666;
         font-size: 14px;
       }
      }
    }
  }
  &>section {
    flex:1;
    width: 100%;
    background: #fff;
    &>.header {
      box-sizing: border-box;
      height: 78px;
      width: 100%;
      padding: 28px 0 20px 75px;
      border-bottom:1px solid #ECEDF0;
    }
    &>.table {
      padding: 15px 15px 0 15px;
      section {
          border: 1px solid #EBEEF5;
          border-bottom: 0;
      }
    }
  }
}
</style>
<style lang="less">
  .marketing-list-page-name-wrapper {
      overflow:hidden;
      text-overflow:ellipsis;
      white-space:nowrap;
      max-height: 50px;
    }
</style>

