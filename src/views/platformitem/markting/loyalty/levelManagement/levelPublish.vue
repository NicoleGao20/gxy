<template>
  <el-container class="level-publish-container">
    <el-main class="level-publish">
      <el-table
        v-loading="loading"
        stripe
        :data="tableData"
        :header-cell-style="{ background: '#F5F7FA', color: '#333333' }"
        border
      >
        <el-table-column prop="level_code" label="会员等级" width="150"/>
        <el-table-column prop="level_name" label="等级名称" width="150"/>
        <el-table-column prop="release_version" label="等级版本" width="180">
          <template slot-scope="scope">
            {{ scope.row.release_version }}
          </template>
        </el-table-column>
        <el-table-column prop="release_status" label="版本状态" width="180">
          <template slot-scope="scope">
            {{ scope.row.release_status | statusFilter }}
          </template>
        </el-table-column>
        <el-table-column prop="update_time" label="修改时间" width="180"/>
        <el-table-column prop="release_time" label="发布时间" width="180"/>
        <el-table-column prop="update_user" label="发布人" min-width="120"/>
        <el-table-column label="操作" fixed="right" border width="200">
          <template slot-scope="scope">
            <el-button
              type="text"
              size="small"
              class="scopeStyle"
              @click="showPublishDialog(scope.row)"
            >
              发布
            </el-button>
            <el-divider direction="vertical"/>
            <span v-if="scope.row.release_status&&scope.row.release_status === 'not_release'">
              <el-button
                type="text"
                size="small"
                class="scopeStyle"
                @click="showDeleteDialog(scope.row)"
              >
                删除
              </el-button>
              <el-divider direction="vertical"/>
            </span>
            <el-button
              type="text"
              size="small"
              class="scopeStyle"
              @click="showViewDialog(scope.row)"
            >
              查看
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
        @loadData="getLevelPublishFun"
      />
      <el-dialog
        v-loading="dialogLoading"
        :visible.sync="dialogVisible"
        title="等级发布"
        width="600px">
        <el-form ref="form" :model="form" label-width="100px">
          <el-form-item label="会员等级" prop="level_code">
            <div class="input-type">{{ form.level_code }}</div>
            <!--            <el-input v-model="form.level_code" placeholder="请输入会员等级" clearable class="w245"/>-->
          </el-form-item>
          <el-form-item label="等级名称" prop="level_name">
            <div class="input-type">{{ form.level_name }}</div>
            <!--            <el-input v-model="form.level_name" placeholder="请输入等级名称" clearable class="w245"/>-->
          </el-form-item>
          <el-form-item label="等级版本" prop="release_version">
            <div class="input-type">{{ form.release_version }}</div>
            <!--            <el-input v-model="form.release_version" placeholder="请输入等级版本" clearable class="w245"/>-->
            <el-checkbox v-model="updateHistoryMemberFlag" :true-label="1" :false-label="0">更新历史数据</el-checkbox>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="handlePublish">发布</el-button>
          <el-button @click="dialogVisible = false">关闭</el-button>
        </span>
      </el-dialog>
      <el-dialog
        v-loading="viewDialogLoading"
        :visible.sync="viewDialogVisible"
        title="版本修改详细内容"
        width="600px">
        <el-form ref="viewForm" :model="form" label-width="110px">
          <el-form-item label="会员等级:" prop="level_code">
            <div>{{ form.level_code }}</div>
          </el-form-item>
          <el-form-item label="等级名称:" prop="level_name">
            <div>{{ form.level_name }}</div>
          </el-form-item>
          <el-form-item label="等级背景:" prop="bg_color" class="level-background-content">
            <span class="background-type">{{ backgroundType }}</span><span :style="imgOrBgc(form)" class="level-background"/>
          </el-form-item>
          <el-form-item label="获得条件:" prop="bg_color">
            <div>在 {{ form.cond_period }} {{ form.cond_period_type | periodTypeFilter }}内, 累计消费满 {{ form.cond_amt }} 元</div>
          </el-form-item>
          <el-form-item label="发布时间:" prop="release_time">
            <div>{{ form.release_time }}</div>
          </el-form-item>
          <el-form-item label="修改时间:" prop="update_time">
            <div>{{ form.update_time }}</div>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="viewDialogVisible = false">关闭</el-button>
        </span>
      </el-dialog>
      <el-dialog
        v-loading="deleteDialogLoading"
        :visible.sync="deleteDialogVisible"
        title="删除等级发布"
        width="560px">
        <p class="dialog-text">该等级还未发布，删除后该版本将不会发布，修改版本记录将无法找回，是否确定删除? </p>
        <span slot="footer" class="dialog-footer">
          <el-button type="text" class="deleteFontColor" @click="handleDelete">删除</el-button>
          <el-button @click="deleteDialogVisible = false">取消</el-button>
        </span>
      </el-dialog>
    </el-main>
  </el-container>
</template>

<script>
import cacheCondition from '@/utils/cacheCondition'
import { getLevelVersionListPage, releaseMemberLevel, deleteMemberLevel, getMemberLevel } from '@/api/markting/level'
import { mapGetters } from 'vuex'
const STATUS_MAP = { 'done_release': '已发布', 'not_release': '未发布' }
const PERIOD_TYPE = { 'year': '年', 'month': '月', 'day': '日' }
export default {
  name: 'LevelPublish',
  filters: {
    statusFilter(level_status) {
      return STATUS_MAP[level_status]
    },
    periodTypeFilter(type) {
      return PERIOD_TYPE[type]
    }
  },
  mixins: [cacheCondition],
  data() {
    return {
      dialogVisible: false,
      dialogLoading: false,
      viewDialogVisible: false,
      viewDialogLoading: false,
      deleteDialogVisible: false,
      deleteDialogLoading: false,
      backgroundType: '背景图',
      params: {
        page: 1,
        pageSize: 10
      },
      total: 0,
      pageSizes: [10, 20, 30, 40],
      loading: false,
      tableData: [],
      row: {},
      form: {},
      updateHistoryMemberFlag: 0
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
        this.backgroundType = '背景图'
        return { background: `url(${row.bg_picture_url}) no-repeat` }
      } else if (row && row.bg_color) {
        this.backgroundType = '背景色'
        return { backgroundColor: row.bg_color }
      } else {
        this.backgroundType = '背景色'
        return { backgroundColor: '#fff' }
      }
    },
    initData() {
      this.row = {}
      this.form = {}
      this.getLevelPublishFun()
    },
    filterData() {
      this.params.page = 1
      this.initData()
    },
    getLevelPublishFun() {
      this.loading = true
      getLevelVersionListPage({
        page: this.params.page,
        size: this.params.pageSize,
        brand_code: this.brandCode || 'durex'
      }).then((res) => {
        if (res && res.data && res.data.list) {
          this.tableData = res.data.list || []
          this.params.page = this.params.page || 1
          this.params.pageSize = this.params.pageSize || 10
          this.total = res.data.total
        }
      }).finally(() => {
        this.loading = false
      })
    },
    showPublishDialog(row) {
      this.form = JSON.parse(JSON.stringify(row))
      this.updateHistoryMemberFlag = 0
      this.dialogVisible = true
    },
    handlePublish() {
      const postData = {
        id: this.form.id,
        brand_code: this.brandCode || 'durex',
        updateHistoryMemberFlag: this.updateHistoryMemberFlag
      }
      this.dialogLoading = true
      releaseMemberLevel(postData).then(res => {
        if (res && res.data) {
          this.dialogVisible = false
          this.initData()
        }
      }).finally(() => {
        this.dialogLoading = false
      })
    },
    showDeleteDialog(row) {
      this.row = row
      this.deleteDialogVisible = true
    },
    showViewDialog(row) {
      if (row.id) {
        getMemberLevel({ id: row.id }).then(res => {
          if (res && res.data) {
            const form = { ...res.data, ...row }
            this.form = JSON.parse(JSON.stringify(form))
            this.viewDialogVisible = true
            this.row = row
          }
        })
      }
    },
    handleDelete() {
      this.deleteDialogLoading = true
      deleteMemberLevel({ id: this.row.id }).then(res => {
        if (res && res.data) {
          this.deleteDialogVisible = false
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
.level-publish-container {
  padding: 20px;
  width: 100%;
  min-height: 100%;

  .level-publish {
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
  .level-background-content {
    margin-bottom: 10px;
  }
  .level-background {
    display: inline-block;
    margin: 0 20px;
    height: 30px;
    width: 80px;
    text-align: center;
    border-radius: 5px;
    border: 1px solid #e6e6e6;
    background-size: 100px 30px !important;
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
}
</style>
