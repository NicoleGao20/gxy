<template>
    <div class="importTip">
       <i :class="icon" v-if="icon === 'el-icon-success'" style="color:green;font-size:50px;margin-left:25px"></i>
       <i :class="icon" v-if="icon === 'el-icon-error'"  style="color:red;font-size:50px;margin-left:25px"></i>
       <p class="title">批量导入完成！</p>
       <p>成功导入数量：{{successCount}}条，失败导入数量：{{failCount}}条</p>
       <div class="detailList">
           <p v-for="item in list" :key="item.id">{{item.message}}</p>
           <p v-if="failList.length > 10">...</p>
       </div>
       <el-button type="primary" v-if="url" @click="downLoad(url)">导出明细</el-button>
    </div>
</template>

<script>
export default {
    props:{
        icon:{
            type:String,
            default:"el-icon-success"
        },
        successCount:{
            type:Number,
            default:0
        },
        failCount:{
            type:Number,
            default:0
        },
        failList:{
            type:Array,
            default(){
                return []
            }
        },
        url:{
            type:String,
            default:""
        }
    },
    methods:{
        downLoad(url){
            window.open(url)
        }
    },
    computed:{
        list(){
            return this.failList.slice(0,10)
        }
    }
}
</script>


<style lang="scss" scoped>
.importTip{
    margin-top: 30px;
}
.title{
    font-size: 25px;
    line-height: 40px;
}
.detailList{
    padding: 20px 0;
}
</style>