<template>
  <div class="container-choose-material">
      <el-row :gutter="10">
        <el-col :span="4">
          <el-select v-model="searchType" :disabled="readOnly">
            <el-option  key="title" value="title" :label="lang.search.eventName"></el-option>
            <el-option key="code" value="code" :label="lang.search.eventCode"></el-option>
          </el-select>
        </el-col>
        <el-col :span="17">
          <el-input v-model="searchKeyword" :disabled="readOnly" :placeholder="searchType === 'title' ? lang.search.placeholder + lang.search.eventName :  lang.search.placeholder  + lang.search.eventCode " />
        </el-col>
        <el-col :span="3">
          <el-button :disabled="readOnly" type="primary" @click="handleSearch" class="btn-search">{{lang.search.search}}</el-button>
        </el-col>
      </el-row>
      <section class="material-list-container">
        <div v-if="!list || list.length === 0" class="no-data">{{lang.noRelatedMaterial}}</div>
        <div class="card-list material-list">
          <div
            v-for="(cardItem, cardIndex) in list"
            :key="cardIndex"
            class="card-item"
            :class="{active: choosedId === cardItem.materialId}"
          >
            <div :style="{'pointer-events': readOnly ? 'none' : ''}" @click="handleChoose(cardItem.materialId)" class="card-head">
              <div>{{ lang.list.id }}：{{cardItem.materialCode}}</div>
              <div class="select">
                <i :key="cardIndex" :class="`${choosedId === cardItem.materialId ? 'el-icon-success' : 'el-icon-circle-check'}`" />
                {{ choosedId === cardItem.materialId ? lang.list.choosed : lang.list.choose }}
              </div>
            </div>
            <a v-if="cardItem.materialDetailList[0]" :href="cardItem.materialDetailList[0].materialUrl" target="preview" class="cover">
              <img class="image" :src="cardItem.materialDetailList[0].materialPicUrl" />
              <h4 class="cover-title"><span class="text-overflow">{{cardItem.materialDetailList[0].materialTitle}}</span></h4>
            </a>
            <ul class="article-list">
              <li :key="articleIndex" v-for="(articleItem, articleIndex) in cardItem.materialDetailList" class="article-item">
                <a :href="articleItem.materialUrl" target="preview" class="text-overflow">{{articleItem.materialTitle}}</a>
              </li>
            </ul>
            <div class="text-mutted">{{lang.list.updateTime}}：{{cardItem.updateTime}}</div>
          </div>

        </div>
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
      </section>
  </div>
</template>
<script type="text/javascript">
// import { queryChooseMaterialList } from '../api/index'
import zhLocale from '../lang/zh.json'
import enLocale from '../lang/en.json'

export default {
  name: 'Belle-choose-material',
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
      default () { return {} }
    }
  },
  data () {
    return {
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
    language () {
      this.lang = this.locale[this.language]
    }
  },
  mounted () {
    this.url = this.material.url ? this.material.url : '/component/system/materialSearch'
    this.choosedId = this.material.data ? this.material.data.materialId : ''
    this.params = this.material.params ? this.material.params : { pageSize: 10, currentPage: 1 }
    this.searchType = this.material.searchType ? this.material.searchType : 'title'
    this.searchKeyword = this.material.searchKeyword ? this.material.searchKeyword : ''
    this.fetchList()
  },
  methods: {
    async fetchList () {
      const obj = {}
      if (this.searchKeyword) {
        if (this.searchType === 'title') {
          obj.materialTitle = this.searchKeyword
        } else {
          obj.materialCode = this.searchKeyword
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
      })
    },
    handleChoose (id) {
      this.choosedId = id
      const index = this.list.findIndex(item => item.materialId === id)
      this.$emit('onChoose', {
        data: this.list[index],
        params: this.params,
        total: this.total,
        searchType: this.searchType,
        searchKeyword: this.searchKeyword
      })
    },
    handleSearch () {
      this.fetchList()
      this.choosedId = null
    },
    handleSizeChange (val, bv) { // 分页
      this.fetchList()
    },
    handleCurrentChange (val) { // 分页
      this.fetchList()
    }
  }
}
</script>
<style  lang="less" scoped>

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

.material-list {
  column-count: 3;
  column-gap: 20px;

  .card-item {
    break-inside: avoid;
    margin: 0 0 20px;
    padding: 10px 15px;
    border: 1px solid #ddd;
    box-sizing: border-box;

    .select {
      i {
        font-size: 16px;
      }
    }

    &:hover {
      border-color: #999;
    }
    &.active {
      border-color: #67C23A;
      .select {
        color: #67C23A;
      }
    }

    a {
      color: #666;
      text-decoration: none;
      &:hover {
        color: #333;
      }
    }

    .text-overflow {
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .card-head {
      display: flex;
      justify-content: space-between;
      padding: 0 0 10px;
      cursor: pointer;
    }
    .cover {
      display: block;
      position: relative;
      height: 150px;
      overflow: hidden;
      &:hover {
        &::after {
          position: absolute;
          top: 0;
          left:0;
          bottom: 0;
          right: 0;
          display: flex;
          justify-content: center;
          align-items: center;
          content:'预览文章';
          color: #fff;
          background-color: rgba(0,0,0, .5);
        }
        // .cover-title {
        //   background-color: transparent;
        // }
      }
      .image {
        max-width: 100%;
      }
      .cover-title {
        position: absolute;
        left: 0;
        bottom: 0;
        right: 0;
        z-index: 2;
        margin: 0;
        padding: 5px;
        background-color: rgba(0,0,0, .5);
        color: #fff;
        font-weight: 300;
      }
    }
    .article-list {
      list-style: none;
      padding: 0;

      .article-item {
        padding: 10px 0;
        border-bottom: 1px solid #ddd;
        &:last-child {
          border-bottom: none;
        }
      }
    }
  }
}

.text-mutted {
  color: #999;
}

/deep/ .el-dialog__title {
  display: block;
  text-align: left;
}

</style>
