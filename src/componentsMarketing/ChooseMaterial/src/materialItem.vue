<template>
  <div :key="item.id" :class="{active: choosedId === item.id}" class="card-item">
    <div :style="{'pointer-events': readOnly ? 'none' : ''}" class="card-head" @click="handleChoose(item.id)">
      <div class="ellipsis">{{ lang.list.id }}：{{ item.media_id }}</div>
      <div v-if="showChoose" class="select">
        <i :key="item.id" :class="`${choosedId === item.id ? 'el-icon-success' : 'el-icon-circle-check'}`" />
        {{ choosedId === item.id ? lang.list.choosed : lang.list.choose }}
      </div>
    </div>
    <a :href="item.url" target="preview" class="cover">
      <img :src="item.thumb_url" class="image" >
      <h4 class="cover-title"><span class="text-overflow">{{ item.title }}</span></h4>
    </a>
    <ul class="article-list">
      <li class="article-item">
        <a :href="item.url" target="preview" class="text-overflow">{{ item.digest }}</a>
      </li>
    </ul>
    <div class="text-mutted">{{ lang.list.updateTime }}：{{ item.last_modify_time }}</div>
  </div>
</template>

<script>
import zhLocale from '../lang/zh.json'
import enLocale from '../lang/en.json'
export default {
  name: 'MaterialItem',
  props: {
    language: {
      type: String,
      default: 'zh'
    },
    readOnly: {
      type: Boolean,
      default: false
    },
    choosedId: {
      type: [Number, String],
      default: null
    },
    item: {
      type: Object,
      default: function() {
        return {}
      }
    },
    showChoose: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      locale: {
        zh: zhLocale,
        en: enLocale
      },
      lang: zhLocale
    }
  },
  watch: {
    language() {
      this.lang = this.locale[this.language]
    }
  },
  methods: {
    handleChoose(id) {
      this.$emit('handleChoose', id)
    }
  }
}
</script>

<style lang="less" scoped>
.card-item {
  flex-basis: 32%;
  margin-top: 2.5%;
  break-inside: avoid;
  margin: 0 0 20px;
  padding: 10px 15px;
  border: 1px solid #ddd;
  box-sizing: border-box;

  .select {
    width: 90px;
    text-align: right;
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
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .card-head {
    display: flex;
    justify-content: space-between;
    padding: 0 0 10px;
    cursor: pointer;
    .ellipsis{
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
      word-wrap: normal;
      word-break: normal;
    }
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
.text-mutted {
  color: #999;
}
</style>
