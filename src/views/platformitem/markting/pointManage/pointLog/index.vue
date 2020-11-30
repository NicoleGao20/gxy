<template>
  <div class="pointLog">
    <screen
      :screen-list="screenList"
      :screen-value="searchForm"
      :show-select-btn="true"
      class="screen"
      @selected="selected"
    />
    <point-log :tableData="tableData" v-loading="tableLoading"/>
  <el-pagination
    :current-page="pageNum"
    :page-sizes="[10, 20, 30, 40, 50]"
    :page-size="pageSize"
    background
    layout="total, sizes, prev, pager, next, jumper"
    :total="total"
    @size-change="handleSizeChange"
    @current-change="handleCurrentChange">
  </el-pagination>
  </div>
</template>


<script>
import screen from "@/componentsMarketing/screen/screen";
import pointLog from "@/componentsMarketing/tableLog/pointLog"
import { queryAllLog, queryPlatformName } from "@/api/markting/pointLog"
import cacheCondition from '@/utils/cacheCondition'
export default {
  components: {
    screen,
    pointLog
  },
  mixins: [cacheCondition],
  mounted(){
    this.getTableData(1,10)
    queryPlatformName().then(({data})=>{
      this.$set(this.screenList,5,{
        label: "渠道",
        type: "select",
        key: "origin",
        option: data.list.map(item=>{
          return {
            label:item.platform_name,
            val:item.platform_code
          }
        }),
      })
    })
  },
  data() {
      return {
          tableLoading:false,
          screenList:[
              {
                  label:'手机号',
                  placeholder:'',
                  key:'phoneNumber',
                  type:'text'
              },
              {
                label: "来源方式",
                type: "select",
                key: "originType",
                option: [
                    { label: "裂变", val: "裂变" },
                    { label: "交易", val: "交易" },
                    { label: "签到", val: "签到" },
                    { label: "绑卡", val: "绑卡" },
                    { label: "收藏", val: "收藏" },
                    { label: "完善信息", val: "完善信息" },
                    { label: "生日登记", val: "生日登记" },
                    { label: "问卷调查", val: "问卷调查" },
                    { label: "投票", val: "投票" },
                    { label: "活动", val: "活动" }
                ],
              },
              {
                label: "积分增减",
                type: "select",
                key: "pointIncrease",
                option: [
                    { label: "增加", val: 1 },
                    { label: "减少", val: 2 }
                ],
              },
              {
                  label:'积分值',
                  placeholder:'',
                  key:'point',
                  type:'text'
              },
              {
                  label:'获取时间',
                  key:'dateRange',
                  type:'dateRange'
              },
              {
                label: "渠道",
                type: "select",
                key: "origin",
                option: [],
              },
              {
                label: "积分类型",
                type: "select",
                key: "pointType",
                option: [
                    { label: "交易积分", val: 1 },
                    { label: "互动积分", val: 2 },
                ],
              }
          ],
          searchForm:{
              phoneNumber:'',
              originType:'',
              pointIncrease:'',
              point:'',
              dateRange:[],
              origin:'',
              pointType:''
          },
          tableData:[],
          pageNum:1,
          pageSize:10,
          total:0
      }
  },
  methods:{
    getTableData(pageNum,pageSize){
      this.tableLoading = true
      let searchForm = this.searchForm
      let like = {}
      let equals = {}
      let section_date_type = {}
      if(searchForm.phoneNumber) like.mobile_bind = searchForm.phoneNumber
      if(searchForm.originType) equals.point_source_type = searchForm.originType
      if(searchForm.pointIncrease) equals.adjust_type = searchForm.pointIncrease
      if(searchForm.point) equals.cnt_point = searchForm.point
      if(searchForm.dateRange.length === 2) {
        section_date_type.transition_time = searchForm.dateRange
      }
      if(searchForm.origin) equals.platform_code = searchForm.origin
      if(searchForm.pointType) equals.point_type = searchForm.pointType
      let filter = {
        pageNum,
        pageSize
      }
      if(Object.keys(like).length) filter.like = like
      if(Object.keys(equals).length) filter.equals = equals
      if(Object.keys(section_date_type).length) filter.section_date_type = section_date_type
      queryAllLog(filter).then(({data})=>{
        this.tableLoading = false
        this.tableData = data.list
        this.pageNum = data.pageNum
        this.pageSize = data.pageSize
        this.total = data.total
      }).catch(()=>{
        this.tableLoading = false
      })
    },
    handleSizeChange(val){
      this.getTableData(1,val)
    },
    handleCurrentChange(val){
      this.getTableData(val,this.pageSize)
    },
    selected(val) {
      if (val === "resetForm") {
        this.searchForm = {
          phoneNumber:'',
          originType:'',
          pointIncrease:'',
          point:'',
          dateRange:[],
          origin:'',
          pointType:''
        };
        let list = JSON.parse(JSON.stringify(this.searchForm))
        this.nowsearchForm = list
      }
      this.getTableData(1,10)
    }
  }
};
</script>


<style lang="less" scoped>
.pointLog {
  margin: 20px;
  padding: 20px;
  background: #fff;
}
</style>