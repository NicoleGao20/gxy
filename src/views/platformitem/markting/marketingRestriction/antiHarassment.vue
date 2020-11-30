<template>
  <div class="page-container-gap">
    <el-form>
      <el-form-item label="短信单客户日接收限定：" label-width="300px">
        <el-form-item label="验证类：">
        <el-input-number v-model="ver" :min="0" :max="999"></el-input-number>
        </el-form-item>
        <el-form-item label="通知类：">
        <el-input-number v-model="notice" :min="0" :max="999"></el-input-number>
        </el-form-item>
        <el-form-item label="营销类：">
        <el-input-number v-model="markting" :min="0" :max="999"></el-input-number>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submit">保存</el-button>
        </el-form-item>
      </el-form-item>
    </el-form>
  </div>
</template>


<script>
import { listAll, updateValue } from "@/api/markting/marketingRestriction"
  export default {
    created(){
      listAll().then(({data})=>{
        data.forEach(item => {
          if(item.id === 1) this.ver = item.value
          if(item.id === 2) this.notice = item.value
          if(item.id === 3) this.markting = item.value
        })
      })
    },
    data() {
      return {
        ver: 0,
        notice: 0,
        markting: 0
      };
    },
    methods: {
      submit(){
        updateValue({
          params:[
            {
              id:1,
              value:this.ver
            },
            {
              id:2,
              value:this.notice
            },
            {
              id:3,
              value:this.markting
            }
          ]
        }).then(()=>{
          this.$message.success('保存成功')
        })
      }
    }
  };
</script>


<style lang="scss" scoped>
.antiHarassment{
  padding: 20px;
}
</style>