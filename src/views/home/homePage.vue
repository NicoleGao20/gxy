<template>
  <el-row>
    <el-col 
      :span="6"
      v-for="item in img_list"
      :key="item"
      :offset="index > 0 ? 2 : 0"
    >
      <el-card style="margin: 20px;">
        <img  style="height:200px" :src="item" alt />
        <div style="padding: 14px">
          <div class="bottom clearfix">
            <img  style="height:50px" :src="item" alt />
            <el-button type="text" class="button">durex</el-button>
          </div>
        </div>
      </el-card>
    </el-col>
  </el-row>
</template>
<script>
import Cookies from "js-cookie";
import { getPlatformList } from "@/api/homePage";
import { mapGetters } from "vuex";
export default {
  name: "Homepage",
  data() {
    return {
      user_info: "",
      platformList: [],
      img_list: [
        "/static/images/durex.png",
        "/static/images/Dettol.png",
        "/static/images/MoveFree.png",
        "/static/images/veet.png",
      ],
    };
  },
  computed: {
    ...mapGetters(["brandCode"]),
  },
  created() {
    // this.getPlatform();
  },
  methods: {
    
  },
};
</script>
<style>
  .time {
    font-size: 13px;
    color: #999;
  }
  
  .bottom {
    margin-top: 13px;
    line-height: 12px;
  }

  .button {
    padding: 0px;
    float: right;
  }

  .image {
    width: 100%;
    height: 100%;
    display: block;
  }

  .clearfix:before,
  .clearfix:after {
      display: table;
      content: "";
  }
  
  .clearfix:after {
      clear: both
  }
</style>
