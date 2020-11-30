<template>
  <div class="material-wechat-template-container">
    <el-table
      v-loading="loading"
      :data="tableData"
      :header-cell-style="{ background: '#F5F7FA', color: '#333333' }"
      border
    >
      <el-table-column prop="template_id" label="模板ID" min-width="200"/>
      <el-table-column prop="title" label="标题" width="180"/>
      <el-table-column prop="primary_industry" label="一级行业" width="150"/>
      <el-table-column prop="deputy_industry" label="二级行业" width="180"/>
      <el-table-column label="操作" fixed="right" border width="200">
        <template slot-scope="scope">
          <el-button
            type="text"
            size="small"
            class="scopeStyle"
            @click="showDetailDialog(scope.row)"
          >
            详情
          </el-button>
          <el-divider direction="vertical"/>
          <el-button
            type="text"
            size="small"
            class="scopeStyle deleteFontColor"
            @click="showDeleteDialog(scope.row)"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <base-pagination
      v-model="params.page"
      :current-page.sync="params.page"
      :page-size.sync="params.pageSize"
      :page-sizes="pageSizes"
      :total="total"
      @loadData="showMaterialWechatFun"
    />
    <el-dialog
      v-loading="dialogLoading"
      :visible.sync="dialogVisible"
      title="模板详情"
      width="600px">
      <el-form ref="form" :model="form" label-width="100px">
        <el-form-item label="模板ID" prop="template_id">
          <div class="input-type">{{ form.template_id }}</div>
        </el-form-item>
        <el-form-item label="标题" prop="title">
          <div class="input-type">{{ form.title }}</div>
        </el-form-item>
        <el-form-item label="一级行业" prop="primary_industry">
          <div class="input-type">{{ form.primary_industry }}</div>
        </el-form-item>
        <el-form-item label="二级行业" prop="deputy_industry">
          <div class="input-type">{{ form.deputy_industry }}</div>
        </el-form-item>
        <el-form-item label="模板内容" prop="content">
          <template-detail v-if="dialogVisible" :template="form" :param-list="paramList"/>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">关闭</el-button>
      </span>
    </el-dialog>
    <el-dialog
      v-loading="deleteDialogLoading"
      :visible.sync="deleteDialogVisible"
      title="删除模板信息"
      width="400px">
      <p class="dialog-text">确定要删除这条模板信息吗？ </p>
      <span slot="footer" class="dialog-footer">
        <el-button type="test" class="deleteFontColor" @click="handleDelete">删除</el-button>
        <el-button @click="deleteDialogVisible = false">取消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { queryWeChatMaterialTemplatePaging, deleteWeChatMaterialTemplate } from '@/api/markting/wechat'
import cacheCondition from '@/utils/cacheCondition'
import { mapGetters } from 'vuex'
import templateDetail from '@/componentsMarketing/WechatTemplateInfo/src/detail'
export default {
  name: 'MaterialWechatTemplate',
  components: { templateDetail },
  mixins: [cacheCondition],
  data() {
    return {
      dialogVisible: false,
      dialogLoading: false,
      deleteDialogVisible: false,
      deleteDialogLoading: false,
      params: {
        page: 1,
        pageSize: 10
      },
      total: 0,
      pageSizes: [10, 20, 30, 40],
      loading: false,
      tableData: [],
      row: {},
      form: {
        template_id: '',
        title: '',
        primary_industry: '',
        deputy_industry: '',
        content: ''
      },
      paramList: []
    }
  },
  computed: {
    rules() {
      return {
        level_code: { required: true, trigger: ['blur', 'change'], message: '会员等级不能为空' },
        level_name: { required: true, trigger: ['blur', 'change'], message: '会员名称不能为空' },
        release_version: { required: true, trigger: ['blur', 'change'], message: '等级版本不能为空' }
      }
    },
    ...mapGetters(['brandCode'])
  },
  mounted() {
    this.initData()
  },
  methods: {
    initData() {
      this.row = {}
      this.form = {}
      this.showMaterialWechatFun()
    },
    filterData() {
      this.params.page = 1
      this.initData()
    },
    showMaterialWechatFun() {
      this.loading = true
      const queryObject = {
        pageNum: this.params.page,
        pageSize: this.params.pageSize
      }
      queryWeChatMaterialTemplatePaging(queryObject).then((res) => {
        console.log('res', res)
        if (res && res.data) {
          this.tableData = res.data.list || []
          this.params.page = (res.data && res.data.pagination.current) || 1
          this.params.pageSize = res.data && res.data.pagination.page_size
          this.total = res.data && res.data.pagination.total
        }
      }).finally(() => {
        this.loading = false
      })
    },
    showDetailDialog(row) {
      this.form = JSON.parse(JSON.stringify(row))
      this.dialogVisible = true
    },
    showDeleteDialog(row) {
      this.row = row
      this.deleteDialogVisible = true
    },
    handleDelete() {
      this.deleteDialogLoading = true
      deleteWeChatMaterialTemplate(this.row).then(res => {
        if (res && res.data) {
          this.deleteDialogVisible = false
          this.$message({
            message: '删除成功！',
            type: 'success',
            center: true,
            duration: 1000
          })
          this.initData()
        }
      }).finally(() => {
        this.deleteDialogLoading = false
      })
    }
  }
}
</script>

<style lang="less" scoped>
.material-wechat-template-container {
  width: 100%;
  min-height: 100%;
  background-color: #fff;
  /deep/ .el-table td .cell, /deep/ .el-table th .cell {
      text-align: center;

      div {
        text-align: center;
      }
    }
  .background-type {
    vertical-align: top;
  }

  .input-type {
    border: 1px solid rgb(220, 223, 230);
    padding: 0 30px 0 15px;
    font-size: 14px !important;
    border-radius: 2px;
    min-height: 32px;
    line-height: 32px;
    opacity: 0.8;
    box-sizing: border-box
  }
  .phone-template-container {
    opacity: 0.8;
  }
}
</style>
