<template>
  <div class="wechat-template-message-log-container page-container-gap">
    <div v-if="single" class="text-right">
      <el-button type="back-button" @click="handleBack">返回到模板消息</el-button>
    </div>
    <header class="searchWrap">
      <el-form ref="searchForm" :model="searchForm" :rules="rules" label-position="right" label-width="80px">
        <el-col :span="6">
          <el-form-item label="OpenID:" prop="openid">
            <el-input
              v-model="searchForm.openid"
              clearable
              placeholder="请输入OpenID"
              @keyup.enter.native="filterData"
            />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="发送来源:" prop="trigger_type">
            <el-input
              v-model="searchForm.trigger_type"
              clearable
              placeholder="请输入发送渠道"
              @keyup.enter.native="filterData"
            />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="发送状态">
            <el-select v-model="searchForm.msg_send_status">
              <el-option
                v-for="item in statusList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-button type="primary" @click="filterData">查询</el-button>
          <!--            <el-button type="primary">更多查询</el-button>-->
        </el-col>
      </el-form>
    </header>
    <main class="tableMainContent">
      <el-table
        v-loading="loading"
        ref="table"
        :data="tableData"
        :header-cell-style="{ background: '#F5F7FA', color: '#333333' }"
        stripe
        border
      >
        <el-table-column prop="openid" label="OpenID" width="250"/>
        <el-table-column prop="trigger_type" label="发送来源"/>
        <el-table-column prop="ads_name" label="任务名称"/>
        <el-table-column prop="msg_send_status" label="发送状态"/>
        <el-table-column prop="send_num" label="发送条数" width="100"/>
        <el-table-column prop="send_content" label="发送内容">
          <template slot-scope="scope">
            <el-popover
              ref="popover"
              placement="bottom-start"
              width="350"
              trigger="click"
            >
              <el-button slot="reference" type="text" size="small" class="scopeStyle">查看</el-button>
              <!--              <template-detail :template="{content: scope.row.content}" :send_content="scope.row.send_content" :param-list="paramList"/>-->
              <div>{{ scope.row.send_content }}</div>
            </el-popover>

          </template>
        </el-table-column>
        <!--        <el-table-column prop="fail_reason" label="失败原因"/>-->
        <el-table-column prop="send_time" label="发送时间" width="140"/>
        <el-table-column prop="create_user" label="创建人"/>
      </el-table>
      <base-pagination
        v-model="params.page"
        :current-page.sync="params.page"
        :page-size.sync="params.pageSize"
        :page-sizes="pageSizes"
        :total="total"
        @loadData="getWechatTemplateMsgLogFun"
      />
    </main>
  </div>
</template>

<script>
import { queryWxTplmsgLogPaging } from '@/api/markting/wechat'
import cacheCondition from '@/utils/cacheCondition'
import { mapGetters } from 'vuex'
import { queryParam } from '@/api/markting/SMSFunction'
import templateDetail from '@/componentsMarketing/WechatTemplateInfo/src/detail'

export default {
  name: 'WechatTemplateMessageLog',
  components: { templateDetail },
  mixins: [cacheCondition],
  data() {
    return {
      searchForm: {
        openid: '',
        trigger_type: '',
        msg_send_status: ''
      },
      params: {
        page: 1,
        pageSize: 10
      },
      total: 0,
      pageSizes: [10, 20, 30, 40],
      loading: false,
      statusList: [
        { id: 1, label: '不限', value: '' },
        { id: 2, label: '发送成功', value: '发送成功' },
        { id: 3, label: '发送失败', value: '发送失败' }
      ],
      tableData: [],
      single: false
    }
  },
  computed: {
    rules() {
      return {}
    },
    ...mapGetters(['brandCode'])
  },
  mounted() {
    if (this.$route.query.id) this.single = true
    this.initData()
  },
  methods: {
    clearDeep(obj) {
      if (!obj || !typeof obj === 'object') return
      const keys = Object.keys(obj)
      for (var key of keys) {
        const val = obj[key]
        if (
          typeof val === 'undefined' ||
          ((typeof val === 'object' || typeof val === 'string') && !val)
        ) {
          // 如属性值为null或undefined或''，则将该属性删除
          delete obj[key]
        } else if (typeof val === 'object') {
          // 属性值为对象，递归调用
          this.clearDeep(obj[key])

          if (Object.keys(obj[key]).length === 0) {
            // 如某属性的值为不包含任何属性的独享，则将该属性删除
            delete obj[key]
          }
        }
      }
    },
    initData() {
      this.getWechatTemplateMsgLogFun()
    },
    filterData() {
      this.params.page = 1
      this.initData()
    },
    // 重置
    handleReset() {
      this.searchForm = {
        openid: '',
        trigger_type: '',
        msg_send_status: ''
      }
      this.$refs.searchForm.resetFields()
      this.filterData()
    },
    getWechatTemplateMsgLogFun() {
      this.loading = true
      const postData = {
        openid: this.searchForm.openid,
        trigger_type: this.searchForm.trigger_type,
        msg_send_status: this.searchForm.msg_send_status,
        pageNum: this.params.page,
        pageSize: this.params.pageSize
      }
      if (this.single) postData.id = this.$route.query.id
      this.clearDeep(postData)
      queryWxTplmsgLogPaging(postData).then(async(res) => {
        if (res && res.data) {
          const result = await queryParam()
          if (result.data && result.data.list) {
            const buyerList = []
            const _paramList = []
            result.data.list = result.data.list.filter(x => x.code !== 'tao_short_chain')
            result.data.list.forEach(item => {
              if (buyerList.indexOf(item.buyer_type) === -1) {
                buyerList.push(item.buyer_type)
                _paramList.push({
                  paramKey: `{${item.buyer_type}}`,
                  code: `\{{${item.code}}}`
                })
              }
            })
            this.paramList = _paramList
          }
          this.loading = false

          this.tableData = res.data.list || []
          // .map(x => {
          //   return {
          //     ...x,
          //     content: '{{result.DATA}}\n\n彩种期次:{{issueInfo.DATA}}\n投注时间:{{betTime.DATA}}\n投注金额:{{fee.DATA}}\n开奖时间:{{drawTime.DATA}}\n{{remark.DATA}}',
          //     send_content: '{"result":{"color":"#606266","value":"{{buyer_nick}}"},"issueInfo":{"color":"#606266","value":"{{buyer_nick}}"},"betTime":{"color":"#606266","value":"{{buyer_nick}}"},"fee":{"color":"#606266","value":"{{buyer_nick}}"},"drawTime":{"color":"#606266","value":"{{buyer_nick}}"},"remark":{"color":"#606266","value":"{{buyer_nick}}"}}'
          //   }
          // })
          this.params.page = (res.data && res.data.pagination.current) || 1
          this.params.pageSize = res.data && res.data.pagination.page_size
          this.total = res.data && res.data.pagination.total
        }
      }).finally(() => {
        this.loading = false
      })
    },
    handleBack() {
      this.$router.push({ name: 'wechatMange', query: { activeName: 'wechatTempMessage' }})
    }
  }
}
</script>

<style lang="less" scoped>
.wechat-template-message-log-container {
  padding: 0 15px;

  .back-button {
    background: #fff;
    padding: 5px 10px;
  }

  header,
  main {
    width: 100%;
    height: auto;
    box-sizing: border-box;
    display: block;
    background: #ffffff;

    .scopeStyle {
      cursor: pointer;
    }
  }

  header {
    margin: 15px 0;

    /deep/ .monetary-form-container.el-form-item {
      margin-bottom: 0;
    }

    .monetary-container {
      /deep/ .el-form-item {
        width: 100px;
        display: inline-block;
      }
    }

    /deep/ .el-range-editor--small.el-input__inner {
      width: 100%;
    }

    /deep/ .el-input, /deep/ .el-select {
      width: 90%;
    }
  }

  main {
    padding: 10px 25px;

    /deep/ .el-table__row,
    /deep/ .has-gutter {
      td {
        > div {
          text-align: center;
        }
      }

      th {
        > div {
          text-align: center;
        }
      }
    }
  }

  /deep/ .el-form-item__label {
    color: #666666;
    font-size: 14px;
    font-weight: normal;
    white-space: nowrap;
  }

  /deep/ .el-form-item .el-input {
    width: 100%;
  }

  /deep/ .el-table__fixed-right::before {
    background: transparent !important;
  }

  /deep/ .validity-form-item .el-form-item {
    display: inline-block;
    width: 200px;
  }

  /deep/ .validity-form-item.el-form-item {
    margin-bottom: 0;
  }

  /deep/ .validity-form-item .el-input-group--append .el-input__inner {
    padding-right: 0 !important;
  }
}
</style>
