<template>
  <div class="page-container-gap">
    <header class="searchWrap">
      <el-form label-position="right" label-width="100px">
        <el-col :span="8">
          <el-form-item label="昵称">
            <el-input
              v-model="searchForm.ser1"
              clearable
              placeholder="请输入"
              @keyup.enter.native="filterData"
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="UID">
            <el-input
              v-model="searchForm.ser3"
              clearable
              placeholder="请输入"
              @keyup.enter.native="filterData"
            />
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-button type="primary" @click="filterData">查询</el-button>
        </el-col>
      </el-form>
    </header>
    <main class="tableMainContent">
      <el-table
        v-loading="loading"
        stripe
        :data="tableData"
        :header-cell-style="{ background: '#F5F7FA', color: '#333333' }"
        border
      >
        <el-table-column prop="avatar_large" label="头像" width="110">
          <template slot-scope="scope">
            <img :src="scope.row.avatar_large" alt="" />
          </template>
        </el-table-column>
        <el-table-column prop="id" label="UID" width="110" />
        <el-table-column prop="screen_name" label="昵称" width="110" />
        <el-table-column prop="name" label="友好显示名称" width="110" />
        <el-table-column prop="location" label="所在地" width="110" />
        <el-table-column prop="description" label="个人描述" width="210" />
        <el-table-column prop="url" label="博客地址" width="210" />
        <el-table-column prop="profile_url" label="微博URL" width="210" />
        <el-table-column prop="weihao" label="微号" width="110" />
        <el-table-column prop="gender" label="性别" width="110" />
        <el-table-column prop="followers_count" label="粉丝数" width="110" />
        <el-table-column prop="friends_count" label="关注数" width="110" />
        <el-table-column prop="statuses_count" label="微博数" width="110" />
        <el-table-column prop="favourites_count" label="收藏数" width="110" />
        <el-table-column prop="created_at" label="注册时间" width="210" />
        <el-table-column
          prop="allow_all_act_msg"
          label="允许私信"
          width="110"
        />
        <el-table-column prop="geo_enabled" label="允许位置" width="110" />
        <el-table-column prop="verified" label="微博认证" width="110" />
        <el-table-column prop="remark" label="备注" width="110" />
        <el-table-column prop="online_status" label="在线状态" width="110" />
        <el-table-column
          prop="bi_followers_count"
          label="用户的互粉数"
          width="110"
        />
        <el-table-column prop="lang" label="语言" width="110" />
        <el-table-column label="操作" fixed="right" border width="100px">
          <template slot-scope="scope">
           <el-button
              type="text"
              size="small"
              class="scope-style"
              @click="showEditDialog(scope.row)"
            >
              修改备注
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <base-pagination
        class="bottomPagination"
        v-model="params.page"
        :current-page.sync="params.page"
        :page-size.sync="params.pageSize"
        :page-sizes="pageSizes"
        :total="total"
        @loadData="getMemberListFun"
      />
    </main>
  </div>
</template>
<script>
export default {
  components: {},
  props: [],
  data() {
    return {
      searchForm: {
        ser1: "",
        ser2: "",
        ser3: "",
        ser4: "",
      },
      create_time: [],
      params: {
        page: 1,
        pageSize: 10,
      },
      total: 1,
      pageSizes: [10, 20, 30, 40],
      loading: false,
      group_purpose_list: [],
      isMoreinquiries: false,
      tableData: [
        {
          id: 1404376560,
          screen_name: "zaku",
          name: "zaku",
          province: "11",
          city: "5",
          location: "北京 朝阳区",
          description: "人生五十年，乃如梦如幻；有生斯有死，壮士复何憾。",
          url: "http://blog.sina.com.cn/zaku",
          profile_image_url: "http://tp1.sinaimg.cn/1404376560/50/0/1",
          domain: "zaku",
          gender: "m",
          followers_count: 1204,
          friends_count: 447,
          statuses_count: 2908,
          favourites_count: 0,
          created_at: "Fri Aug 28 00:00:00 +0800 2009",
          following: false,
          allow_all_act_msg: false,
          geo_enabled: true,
          verified: false,
          status: {
            created_at: "Tue May 24 18:04:53 +0800 2011",
            id: 11142488790,
            text: "我的相机到了。",
            favorited: false,
            truncated: false,
            in_reply_to_status_id: "",
            in_reply_to_user_id: "",
            in_reply_to_screen_name: "",
            geo: null,
            mid: "5610221544300749636",
            annotations: [],
            reposts_count: 5,
            comments_count: 8,
          },
          allow_all_comment: true,
          avatar_large: "http://tp1.sinaimg.cn/1404376560/180/0/1",
          verified_reason: "",
          follow_me: false,
          online_status: 0,
          bi_followers_count: 215,
        },
      ],
    };
  },
  watch: {
    create_time(val) {
      if (val) {
        this.searchForm.start_time = val[0];
        this.searchForm.end_time = val[1];
      } else {
        this.searchForm.start_time = "";
        this.searchForm.end_time = "";
      }
    },
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    initData() {
      this.getMemberListFun();
    },
    fun() {
      this.$router.push({ name: "crmArchivesPortrait" });
    },
    filterData() {
      this.params.page = 1;
      this.initData();
    },
    getListFun() {
      this.loading = true;
      getList({
        page: this.params.page,
        pageSize: this.params.pageSize,
      }).then((res) => {
        this.loading = false;
        this.tableData = res.data.list || [];
        this.params.page = (res.data && res.data.pagination.current) || 1;
        this.params.pageSize = res.data && res.data.pagination.page_size;
        this.total = res.data && res.data.pagination.total;
      });
    },
    edit(row) {
      this.$router.push({
        name: "crmArchivesPortrait",
        query: {
          memberId: row.memberid,
        },
      });
    },
  },
};
</script>
<style lang="less">
.crmArchivesList {
  padding: 0 5px;
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
    margin: 5px 0;
    overflow: hidden;
  }
  main {
    padding: 5px 5px;
  }

  /deep/ .el-form-item__label {
    color: #666666;
    font-size: 14px;
    font-weight: normal;
    white-space: nowrap;
  }
  /deep/ .el-input {
    width: 80%;
  }
  /deep/ .el-date-editor--daterange {
    width: 80%;
  }
  /deep/ .el-textarea {
    width: 91.5%;
  }
  .search-more {
    border: 1px solid rgba(67, 90, 130, 1);
    background: none;
    color: #435a82;
    &:hover {
      color: #ffffff;
      background-color: #435a82;
      border-color: #435a82;
    }
  }
  .search-collapse {
    border: none;
    background: none;
    color: #435a82;
    .el-icon-d-arrow-right {
      font-size: 14px;
      position: relative;
      left: 4px;
      transform: rotate(-90deg);
    }
  }
  .el-table__row,
  .has-gutter {
    td {
      &:not(:nth-of-type(2)):not(:nth-of-type(3)):not(:nth-last-of-type(1)) {
        > div {
          text-align: center;
        }
      }
    }
    th {
      &:not(:nth-last-of-type(2)) {
        > div {
          text-align: center;
        }
      }
    }
  }
}
.linkArea {
  width: 100%;
  display: flex;
  justify-content: center;
  border: 1px solid rgba(236, 238, 242, 1);
  margin-top: 15px;
  cursor: pointer;
  box-sizing: border-box;
  &:nth-of-type(1) {
    margin-top: 0px;
  }
  > a {
    width: 60%;
  }
  &:hover {
    border: 1px solid rgba(123, 139, 167, 1);
  }
}
.grid-content {
  display: flex;
  align-items: center;
  .icon {
    width: 140px;
    box-sizing: border-box;
    text-align: center;
    img {
      width: 100px;
    }
  }
  .info {
    flex: 1;
    position: relative;
    &::before {
      position: absolute;
      content: "";
      left: -20px;
      top: 25%;
      height: 50%;
      width: 1px;
      transform: scaleY(0.5);
      background: rgba(123, 139, 167, 1);
    }
    > p {
      font-size: 18px;
      color: #000000;
      line-height: 1.8;
    }
    > span {
      font-size: 14px;
      line-height: 1.8;
      color: #666666;
    }
  }
}
.error-info {
  .error-tip {
    display: flex;
    i {
      margin-right: 15px;
      font-size: 25px;
      color: #cf614f;
    }
    .tip {
      p {
        color: #435a82;
        font-weight: 500;
        line-height: 1.6;
      }
      span {
        color: #888888;
        line-height: 1.6;
      }
    }
  }
  .error-content {
    margin: 10px 0;
    .scroll {
      max-height: 40px;
      font-size: 14px;
      line-height: 1.6;
      overflow: auto;
      padding: 10px;
      background: #f9fafb;
    }
    /deep/ .el-checkbox {
      margin-top: 15px;
      display: block;
    }
    /deep/ .el-checkbox__label {
      vertical-align: top;
      display: inline-block;
      white-space: normal;
      word-break: break-all;
    }
  }
}
</style>
