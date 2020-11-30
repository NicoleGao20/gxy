<template>
  <div class="belle-container-choose-material">
    <el-row :gutter="10">
      <el-col :span="4">
        <el-select v-model="searchType" :disabled="readOnly">
          <el-option key="title" :label="lang.search.eventName" value="title"/>
          <!--            <el-option key="code" value="code" :label="lang.search.eventCode"></el-option>-->
        </el-select>
      </el-col>
      <el-col :span="17">
        <el-input v-model="searchKeyword" :disabled="readOnly" :placeholder="searchType === 'title' ? lang.search.placeholder + lang.search.eventName : lang.search.placeholder + lang.search.eventCode " clearable @keyup.enter.native="handleSearch"/>
      </el-col>
      <el-col :span="3">
        <el-button :disabled="readOnly" type="primary" class="btn-search" @click="handleSearch">{{ lang.search.search }}</el-button>
      </el-col>
    </el-row>
    <section v-loading="loading" class="material-list-container">
      <div v-if="!list || list.length === 0" class="no-data">{{ lang.noRelatedMaterial }}</div>
      <el-row :gutter="20" class="card-list material-list">
        <el-col v-for="(cardItem, cardIndex) in list" :span="8" :key="cardIndex">
          <material-item :item="cardItem" :read-only="readOnly" :choosed-id="choosedId" :language="language" :show-choose="showChoose" @handleChoose="handleChoose"/>
        </el-col>
      </el-row>
      <div v-if="total > 0" style="text-align: right;padding: 10px 0;">
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
    </section>
  </div>
</template>
<script type="text/javascript">
import zhLocale from '../lang/zh.json'
import enLocale from '../lang/en.json'
import materialItem from './materialItem'

export default {
  name: 'Index',
  components: { materialItem },
  props: {
    language: {
      type: String,
      default: 'zh'
    },
    readOnly: {
      type: Boolean,
      default: false
    },
    material: {
      type: Object,
      default() { return {} }
    },
    showChoose: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      loading: false,
      dialogVisible: false,
      searchType: 'title',
      searchKeyword: '',
      choosedId: null,
      locale: {
        zh: zhLocale,
        en: enLocale
      },
      lang: zhLocale,
      list: [],
      params: {
        pageSize: 10,
        currentPage: 1
      },
      total: 0,
      pageSizes: [
        10, 20, 30, 40
      ]
    }
  },
  watch: {
    language() {
      this.lang = this.locale[this.language]
    }
  },
  mounted() {
    this.url = this.material.url ? this.material.url : '/component/system/materialSearch'
    this.choosedId = this.material.data ? this.material.data.id : ''
    this.params = this.material.params ? this.material.params : { pageSize: 10, currentPage: 1 }
    this.searchType = this.material.searchType ? this.material.searchType : 'title'
    this.searchKeyword = this.material.searchKeyword ? this.material.searchKeyword : ''
    this.fetchList()
  },
  methods: {
    async fetchList() {
      this.loading = true
      const obj = {}
      if (this.searchKeyword) {
        if (this.searchType === 'title') {
          obj.title = this.searchKeyword
        }
      }
      this.$request2({
        url: this.url,
        method: 'get',
        params: {
          brandCode: this.material.brandCode,
          pageNum: this.params.currentPage,
          pageSize: this.params.pageSize,
          ...obj
        }
      }).then(res => {
        this.list = res.data.list
        this.total = res.data.pagination.total
      }).finally(() => {
        this.loading = false
      })
    },
    handleChoose(id) {
      this.choosedId = id
      const index = this.list.findIndex(item => item.id === id)
      this.$emit('onChoose', {
        data: this.list[index],
        params: this.params,
        total: this.total,
        searchType: this.searchType,
        searchKeyword: this.searchKeyword
      })
    },
    handleSearch() {
      this.fetchList()
      this.choosedId = null
    },
    handleSizeChange(val, bv) { // 分页
      this.fetchList()
    },
    handleCurrentChange(val) { // 分页
      this.fetchList()
    }
  }
}
</script>
<style  lang="less" scoped>
.belle-container-choose-material {
}

.btn-search {
  display: block;
  width: 100%;
}

.material-list-container {
  // height: 52vh;
  margin: 20px 0 0;
  padding: 10px 0;
  overflow-x: hidden;
  overflow-y: auto;
}

.no-data {
  display: flex;
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;
}
/deep/ .el-dialog__title {
  display: block;
  text-align: left;
}

</style>
