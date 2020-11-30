<template>
  <div class="app-container marketing-modlue-page">
    <el-form
      label-position="right"
      label-width="80px"
      style="background: #fff; padding: 10px; margin-bottom: 10px"
    >
      <el-row :gutter="20">
        <el-col :span="5">
          <el-form-item label="模版编号" style="margin-bottom: 0">
            <el-input
              v-model="searchForm.code"
              style="width: 200px"
              placeholder="请输入内容"
            />
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="营销目的" style="margin-bottom: 0">
            <el-select
              v-model="searchForm.marketingPurposeValue"
              multiple
              collapse-tags
              placeholder="请选择"
            >
              <el-option
                v-for="item in quryParamsData.marketingPurpose"
                :key="item.value"
                :label="item.name"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="营销类型" style="margin-bottom: 0">
            <el-select
              v-model="searchForm.marketingTypeValue"
              multiple
              collapse-tags
              placeholder="请选择"
            >
              <el-option
                v-for="item in quryParamsData.marketingType"
                :key="item.value"
                :label="item.name"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="模板状态" style="margin-bottom: 0">
            <el-select
              v-model="searchForm.templateIsValid"
              placeholder="请选择"
            >
              <el-option
                v-for="item in isValidList"
                :key="item.value"
                :label="item.name"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="onsearch()">查询</el-button>
        </el-col>
      </el-row>
    </el-form>
    <section>
      <ul>
        <li
          v-if="params.currentPage === 1"
          class="nothing"
          @click="handleShow()"
        >
          <div>
            {{ activity === 1 ? "新增活动" : "新增模版" }}
          </div>
        </li>
        <li v-for="(item, index) in moduleList" :key="index">
          <p v-if="item.templateIsValid === 'Y'" class="tip tip-success">
            有 效
          </p>
          <p v-else class="tip tip-fail">无 效</p>
          <header>
            <div>模版编号：{{ item.templateNo }}</div>
            <div>营销类型：{{ item.marketingTypeName }}</div>
            <div v-if="(item.templateName || '').length >= 17">
              模版名称：
              <el-tooltip effect="light" placement="bottom">
                <div slot="content" style="width: 250px">
                  {{ item.templateName }}
                </div>
                <div style="display: inline-block">
                  {{ item.templateName.slice(0, 17) }}...
                </div>
              </el-tooltip>
            </div>
            <div v-else class="template-name">
              模版名称： {{ item.templateName }}
            </div>
            <div>更新时间：{{ item.updateTime }}</div>
          </header>
          <section>
            <p>模版说明：{{ item.remark }}</p>
            <footer>
              <el-button
                style="padding: 9px 12px"
                type="primary"
                plain
                @click="viewActivityTemplate(item)"
              >查看模版</el-button
              >
              <el-button
                :disabled="item.templateIsValid === 'N'"
                style="padding: 9px 12px"
                type="primary"
                plain
                @click="createActivityByTemplate(item)"
              >使用模版</el-button
              >
              <el-button
                v-if="
                  jobNum === item.createUserCode &&
                    activity !== 1
                "
                style="padding: 9px 12px"
                type="primary"
                plain
                @click="editActivityTemplate(item)"
              >编辑模板</el-button
              >
              <el-button
                v-if="
                  jobNum === item.createUserCode &&
                    activity !== 1
                "
                style="padding: 9px 12px"
                type="primary"
                plain
                @click="ondelete(item.id)"
              >删除模版</el-button
              >
            </footer>
          </section>
        </li>
      </ul>
      <div class="foot">
        <el-pagination
          :current-page.sync="params.currentPage"
          :page-size.sync="params.pageSize"
          :page-sizes="pageSizes"
          :total="total"
          background
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </section>
    <el-dialog :visible.sync="dialogVisible" title="营销类型" width="800px">
      <act-pre-condition
        v-if="dialogVisible"
        ref="actPreForm"
        :act-pre-form="actPreForm"
      />
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="gotoCreateActivityTemplate"
        >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { checkPermission } from '@/utils/permission'
import {
  getmarketingListParameter,
  getmarketingModule,
  deletemarketingModule,
  createActivityByTemplate
} from '@/api/markting/marketing'
import actPreCondition from '../actPreCondition'
import processMarketingContent from '../processMarketingContent'
import { mixinMsgBox } from '@/utils/index'
import cacheCondition from '@/utils/cacheCondition'
import { getToken } from '@/utils/auth'

export default {
  name: 'MarketingModule',
  components: {
    actPreCondition
  },
  mixins: [mixinMsgBox, processMarketingContent, cacheCondition],
  data() {
    return {
      jobNum: '',
      activity: 0, // 是否是活动列表新增按钮进来的，值为1就是新增按钮进来的 其他值不是
      quryParamsData: {
        marketingType: [],
        marketingPurpose: []
      },
      searchForm: {
        marketingTypeValue: [],
        marketingPurposeValue: [],
        code: '',
        templateIsValid: ''
      },
      isValidList: [
        { name: '全部', value: '' },
        { name: '有效', value: 'Y' },
        { name: '无效', value: 'N' }
      ],
      moduleList: [],
      actPreForm: {
        marketingType: '',
        marketingTarget: 'member_id'
      },
      radio: '1',
      params: {
        pageSize: 10,
        currentPage: 1
      },
      total: 0,
      pageSizes: [10, 20, 30, 40],
      tableData: [],
      dialogVisible: false
    }
  },
  mounted() {
    this.jobNum = getToken('jobNumber')
    this.ongetQuryParams()
    this.ongetmarketingModule()
    this.activity = this.$route.params.activity
    document.onkeydown = (e) => {
      let currKey = 0
      e = event || window.event
      currKey = e.keyCode || e.which || e.charCode
      if (currKey === 13) {
        this.ongetmarketingModule()
      }
    }
  },
  methods: {
    checkPermission,
    onsearch() {
      this.params.currentPage = 1
      this.ongetmarketingModule()
    },
    ongetmarketingModule() {
      const obj = {
        current: this.params.currentPage,
        pageSize: this.params.pageSize
      }
      obj.templateIsValid = this.searchForm.templateIsValid
      if (this.searchForm.marketingTypeValue.length !== 0) {
        obj.marketingTypes = this.searchForm.marketingTypeValue.join(',')
      }
      if (this.searchForm.marketingPurposeValue.length !== 0) {
        obj.marketingPurposes = this.searchForm.marketingPurposeValue.join(',')
      }
      if (this.searchForm.code) {
        obj.templateNo = this.searchForm.code
      }
      getmarketingModule(obj).then((res) => {
        if (res.code === 1 && res.bizCode === 20000) {
          this.moduleList = res.data.list
          this.total = res.data.pagination.total || 0
          if (res.data.list.length === 0 && this.params.currentPage > 1) {
            this.params.currentPage = this.params.currentPage - 1
            this.ongetmarketingModule()
          }
        }
      })
    },
    ongetQuryParams() {
      // 获取选择参数数据
      getmarketingListParameter().then((res) => {
        this.quryParamsData = res.data
      })
    },
    ondelete(id) {
      // 删除按钮功能
      this.$confirm(
        `<div style="padding-bottom: 15px; border-bottom: 1px solid #E4E7ED;">
        <p style="color: #000;font-size: 16px;"><i style="font-size: 28px;margin-right: 16px;color:#ffb547" class="iconfont icon-jinggao"></i>是否确认删除？</p>
        <p style="padding-left: 42px;color: #888888;font-size: 14px;">删除后，营销模板即从模板列表中移除</p>
      </div>`,
        '确认提示',
        {
          dangerouslyUseHTMLString: true,
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        }
      )
        .then(() => {
          deletemarketingModule({ id: id }).then((res) => {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.ongetmarketingModule()
          })
        })
        .catch(() => {
          // this.$message({
          //   type: 'info',
          //   message: '已取消删除'
          // })
        })
    },
    onmarketType(marketingType) {
      this.marketingType = marketingType
    },
    handleShow(done) {
      this.dialogVisible = true
    },
    handleSizeChange(val, bv) {
      this.ongetmarketingModule()
    },
    handleCurrentChange(val) {
      this.ongetmarketingModule()
    },
    addMarketSetting() {
      this.$router.push({
        path: '/marketing/marketSetting',
        query: {
          id: null,
          marketing_type: '1',
          marketing_target: 'member'
        }
      })
    },
    createActivityByTemplate(row) {
      var marketingContentStr = this.processMarketingContent(
        JSON.parse(row.marketingContent)
      )
      // 创建活动，不可用状态，只有在营销画布点击了保存marketingIsValid才合法
      createActivityByTemplate({
        id: row.id,
        marketingIsValid: 'N',
        marketingContent: marketingContentStr
      })
        .then((res) => {
          if (res.code === 1 && res.bizCode === 20000) {
            this.$router.push({
              name: 'marketingTemplateSettingEdit',
              query: {
                id: res.data.id,
                marketing_type: row.marketingType,
                marketing_target: row.marketingTarget,
                create_type: 'activity',
                action_type: 'edit'
              }
            })
          } else {
            this.$message({
              type: 'error',
              message: '创建失败'
            })
          }
        })
        .catch(() => {})
    },
    gotoCreateActivityTemplate() {
      this.$refs['actPreForm'].validateActPre().then(() => {
        this.$router.push({
          name: 'marketingTemplateSettingAdd',
          query: {
            id: null,
            marketing_type: this.actPreForm.marketingType,
            marketing_target: this.actPreForm.marketingTarget,
            create_type: 'template',
            action_type: 'add'
          }
        })
      })
    },
    editActivityTemplate(item) {
      this.$router.push({
        name: 'marketingTemplateSettingEdit',
        query: {
          id: item.id,
          marketing_type: item.marketingType,
          marketing_target: item.marketingTarget,
          create_type: 'template',
          action_type: 'edit'
        }
      })
    },
    viewActivityTemplate(item) {
      this.$router.push({
        name: 'marketingTemplateSettingView',
        query: {
          id: item.id,
          marketing_type: item.marketingType,
          marketing_target: item.marketingTarget,
          create_type: 'template',
          action_type: 'view'
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
.marketing-modlue-page {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background: #f6f6f6;
  min-height: 100%;
  /deep/ .el-dialog__header {
    font-size: 16px;
    color: #262626;
    border-bottom: 1px solid #e4e7ed;
  }
  .template-name {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    // height: 20px;
  }

  & > section {
    position: relative;
    flex: 1;
    padding: 10px 0;
    background: #fff;
    overflow: auto;
    ul {
      display: flex;
      // justify-content: space-between;
      flex-wrap: wrap;
      overflow: auto;

      li {
        display: inline-block;
        width: 360px;
        border: 1px solid #e2e8f0;
        margin: 0 10px 20px;
        background: #e2e8f0;
        position: relative;
        overflow: hidden;
        .tip {
          // #67c23a
          //
          position: absolute;
          top: 15px;
          padding: 2px 0;
          left: calc(50% - 20px);
          width: 100%;
          text-align: center;
          transform: rotate(45deg);
          font-size: 13px;
          background: white;
          color: white;
        }
        .tip-success {
          background: #67c23a;
        }
        .tip-fail {
          background: #f56c6c;
        }
        & > header {
          padding: 15px 16px;
          height: 110px;
          box-sizing: border-box;
          color: #333;
          font-size: 14px;
          & > div {
            margin-bottom: 5px;
          }
        }
        & > section {
          box-sizing: border-box;
          background: #fff;
          padding: 15px;
          span {
            display: block;
            color: #333;
            font-size: 14px;
            margin-bottom: 17px;
          }
          p {
            height: 84px;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box; //必须结合的属性 ，将对象作为弹性伸缩盒子模型显示
            -webkit-line-clamp: 6; /*数字是几就显示几行*/
            -webkit-box-orient: vertical;
            color: #888;
            font-size: 13px;
            // border-bottom: 1px solid #E9ECF3;
          }
          footer {
            display: flex;
            padding-top: 15px;
            justify-content: center;
            border-top: 1px solid #e9ecf3;
          }
        }
      }
      .nothing {
        display: flex;
        justify-content: center;
        align-items: center;
        background: #e9edf4;

        & > div {
          display: flex;
          justify-content: center;
          align-items: center;
          flex-direction: column;
          width: 260px;
          height: 150px;
          background: #fff;
          color: #4f648a;
          font-size: 14px;
          border: 1px dashed #435a82;
          &::before {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            width: 24px;
            height: 24px;
            font-size: 16px;
            content: "+";
            margin-bottom: 10px;
            border: 1px solid #435a82;
            color: #435a82;
            border-radius: 50%;
          }
        }
      }
    }
    .foot {
      text-align: right;
      padding: 10px 0;
    }
  }
}
</style>
