<template>
    <div class="nine">
        <div v-if="Object.keys(data).length === 0" class="none">
            暂无数据
        </div>
        <el-form v-else>
            <el-form-item label="九分状态：">
                <el-steps :active="2" align-center>
                    <el-step :title="data.part_name_before" :description="data.part_time_before ? data.part_time_before.substr(0,10) : ''"></el-step>
                    <el-step :title="data.part_name" :description="data.part_time ? data.part_time.substr(0,10) : ''"></el-step>
                </el-steps>
            </el-form-item>
            <el-form-item label="三类状态：">
                <el-steps :active="2" align-center>
                    <el-step :title="data.cate_name_before" :description="data.cate_time_before?  data.cate_time_before.substr(0,10) : ''"></el-step>
                    <el-step :title="data.cate_name" :description="data.cate_time ? data.cate_time.substr(0,10) : ''"></el-step>
                </el-steps>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
export default {
    props:{
        data:{
            type:Object,
            default:{}
        }
    }
}
</script>

<style lang="scss" scoped>
.none{
    width: 100%;
    text-align: center;
}
</style>