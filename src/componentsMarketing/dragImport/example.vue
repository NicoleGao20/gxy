<template>
    <div>
        <image-drag
            :list="file_list" 
            :multiple="true"
            :on-change="bannerPicChange"
            @update="updateFile"
            accept=".png,.gif,.jpg,.txt,.mp3,.mp4">
        </image-drag>
        <el-button @click="submit">asdasda</el-button>
    </div>
</template>
<script>
import ImageDrag from "./index";
import { importExcel } from '@/api/markting/rePoint'
export default {
  components: {
    ImageDrag
  },
  data() {
    return {
      file_list: [], //自己用的
      number: ""
    };
  },
  methods: {
    // Banner图-改变
    bannerPicChange(file,fileList) {
      this.file_list = fileList
      console.log(fileList)
    },
    updateFile(val) {
      this.file_list = val;
      console.log(this.file_list);
    },
    submit(){
      let data = new FormData()
      this.file_list.forEach(item=>{
          data.append('file',item.raw)
      })
      importExcel(data)
    }
  }
};
</script>