<template>
  <div class="rePoint">
    <el-radio v-model="globalMode" :label="1">手动修改</el-radio>
    <el-radio v-model="globalMode" :label="2">文件导入</el-radio>
    <div class="hand" v-show="globalMode === 1">
      <screen
        :screen-list="screenList"
        :screen-value="screenValue"
        :show-select-btn="true"
        class="screen"
        @selected="selected"
      />
      <div class="setBox">
        <el-button type="text" @click="openForm('many')">批量修改</el-button>
        <el-button type="text" @click="openForm('all')">批量修改结果集</el-button>
      </div>
      <el-table
        ref="multipleTable"
        :data="tableData"
        tooltip-effect="dark"
        style="width: 100%"
        v-loading="tableLoading"
        @selection-change="handleSelectionChange"
        border
      >
        <el-table-column
          :resizable="false"
          type="selection"
          width="55"
        ></el-table-column>
        <el-table-column
          :resizable="false"
          prop="mobile_bind"
          label="手机号"
          align="center"
        ></el-table-column>
        <el-table-column
          :resizable="false"
          prop="member_id"
          label="会员卡号"
          align="center"
        ></el-table-column>
        <el-table-column
          :resizable="false"
          prop="qty_point"
          label="总积分"
          align="center"
        ></el-table-column>
        <el-table-column
          :resizable="false"
          prop="qty_point_intc"
          label="互动积分"
          align="center"
        ></el-table-column>
        <el-table-column
          :resizable="false"
          prop="qty_point_order"
          label="交易积分"
          align="center"
        ></el-table-column>
        <el-table-column
          :resizable="false"
          label="操作"
          show-overflow-tooltip
          align="center"
        >
          <template slot-scope="scope">
            <el-button type="text" @click="openForm('one',scope.row.member_id,scope.row.mobile_bind)">修改积分</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-row type="flex" justify="end">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="pageNum"
          :page-sizes="[10, 20, 30, 40, 50]"
          :page-size="pageSize"
          background
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        >
        </el-pagination>
      </el-row>
      <el-dialog
        :title="this.nowForm === 'one' ? '修改单条积分' : '批量修改积分'"
        :visible.sync="showSetForm"
        width="60%"
      >
        <el-form 
        ref="setPointForm" 
        :model="setPointForm" 
        label-width="150px" 
        >
          <el-form-item label="会员手机号:" prop="phoneNumber" v-show="nowForm === 'one'">
            <el-input v-model="setPointForm.phoneNumber" style="width: 300px" disabled></el-input>
          </el-form-item>
          <el-form-item label="修改类型:" prop="type">
            <el-radio v-model="setPointForm.type" :label="1">清零</el-radio>
            <el-radio v-model="setPointForm.type" :label="2">调整</el-radio>
          </el-form-item>
            <el-form-item label="积分类型:" prop="pointTypeArr" v-if="setPointForm.type === 1" :rules="{ type: 'array', required: true, message: '请至少选择一个积分类型', trigger: 'change' }">
                <el-select v-model="setPointForm.pointTypeArr" placeholder="请选择" multiple>
                  <el-option
                    v-for="item in pointTypeSelect"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
            </el-form-item>
          <div v-if="setPointForm.type === 2">
            <el-form-item label="积分类型:" prop="pointType" :rules="{ required: true, message: '请选择积分类型', trigger: 'change' }">
                <el-select v-model="setPointForm.pointType" placeholder="请选择">
                  <el-option
                    v-for="item in pointTypeSelect"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="调整积分值:" prop="rePointType" :rules="{ required: true, message: '请选择调整积分类型', trigger: 'change' }">
              <el-select v-model="setPointForm.rePointType" placeholder="请选择">
                <el-option
                  v-for="item in rePointTypeSelect"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
              <number-input style="display:inline-block;vertical-align:top" :val="setPointForm.point" name="积分" @inputValue="setPoint"></number-input>
            </el-form-item>
            <el-form-item label="积分有效期:" prop="date" :rules="{ required: true, message: '请选择日期', trigger: 'change' }">
              从调整开始至
              <el-date-picker
                v-model="setPointForm.date"
                type="datetime"
                placeholder="选择日期时间"
                :picker-options="pickerOptions"
                value-format="yyyy-MM-dd HH:mm:ss"
              >
              </el-date-picker>
              过期
            </el-form-item>
          </div>
          <el-form-item label="备注:" prop="remark">
            <el-input
              type="textarea"
              placeholder="请输入备注信息"
              v-model="setPointForm.remark"
              maxlength="140"
              show-word-limit
            >
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm">确定</el-button>
            <el-button @click="showSetForm = false">关闭</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
    </div>
    <div class="fileMode" v-show="globalMode === 2">
      <file-import />
    </div>
  </div>
</template>

<script>
import fileImport from "./rePointFileImport";
import screen from "@/componentsMarketing/screen/screen";
import numberInput from "@/componentsMarketing/doubleNumberInput/doubleNumberInput"
import { queryAdjustList, editAdjust, editManyAdjust, editAllAdjust } from "@/api/markting/rePoint"
import { getLevelList } from '@/api/markting/level'
import { queryPlatformName } from "@/api/markting/pointLog"
import { mapGetters } from 'vuex'
let MAP = {
  one:editAdjust,
  many:editManyAdjust,
  all:editAllAdjust
}
export default {
  components: {
    fileImport,
    screen,
    numberInput
  },
  mounted(){
    this.getTableData(1,10)
    getLevelList({ brand_code: this.brandCode || 'durex' }).then(({data})=>{
      let _list = data.list.map(item=>{
        return {
          label:item.level_name,
          val:item.level_code
        }
      })
      _list.unshift({
        label:'不限',
        val:''
      })
      this.$set(this.screenList,4,{
        label: "会员等级",
        type: "select",
        key: "level",
        option: _list
      })
    })
    queryPlatformName().then(({data})=>{
      let _list = data.list.map(item=>{
        return {
          label:item.platform_name,
          val:item.platform_code
        }
      })
      _list.unshift({
        label:'不限',
        val:''
      })
      this.$set(this.screenList,5,{
        label: "来源渠道",
        type: "select",
        key: "origin",
        option: _list
      })
    })
  },
  data() {
    return {
      tableLoading:false,//表单加载动画
      globalMode: 1,
      //表格数据
      tableData: [],
      //搜索过滤
      screenList: [
        {
          label: "会员卡号",
          placeholder: "",
          key: "cardId",
          type: "text",
        },
        {
          label: "手机号",
          placeholder: "",
          key: "phoneNumber",
          type: "text",
        },
        {
          label: "会员昵称",
          placeholder: "",
          key: "nickName",
          type: "text",
        },
        {
          type: "diyInputRange",
          key: "pointRange",
          option: [
            { label: "总积分", val: 'qty_point' },
            { label: "交易积分", val: 'qty_point_order' },
            { label: "互动积分", val: 'qty_point_intc' },
          ],
        },
        {
          label: "会员等级",
          type: "select",
          key: "level",
          option: [
            { label: "不限", val: '' }
          ],
        },
        {
          label: "来源渠道",
          type: "select",
          key: "origin",
          option: [
            { label: "不限", val: '' }
          ],
        }
      ],
      //搜索过滤内容
      screenValue: {
        cardId: "",
        phoneNumber: "",
        nickName: "",
        pointRange: [],
        diyInputRangeType: 'qty_point',
        level: '',
        origin: '',
      },
      nowScreenValue:{
        cardId: "",
        phoneNumber: "",
        nickName: "",
        pointRange: [],
        diyInputRangeType: 'qty_point',
        level: '',
        origin: '',
      },
      pointTypeSelect: [
        {
          label: "交易积分",
          value: 1,
        },
        {
          label: "互动积分",
          value: 2,
        },
      ],
      rePointTypeSelect: [
        {
          label: "增加",
          value: 1,
        },
        {
          label: "减少",
          value: 2,
        },
      ],
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now();
        },
      },
      nowForm:'',//打开的form表是哪个
      nowId:'',//正在修改单条id
      //form数据
      showSetForm: false,
      setPointForm:{
        phoneNumber: "",
        type: 1,
        pointTypeArr:[],
        pointType: "",
        rePointType: "",
        point: 0,
        date: "",
        remark: "",
      },
      //分页数据
      pageNum:1,
      pageSize:10,
      total:0,
      selectedList:[]
    };
  },
  methods: {
    getFilter(list){
      let screenValue = list
      let like = {}
      let sectionNumType = {}
      let equals = {}
      let filter = {}
      let likeMem = {}
      if(screenValue.cardId) like.member_id = screenValue.cardId
      if(screenValue.phoneNumber) like.mobile_bind = screenValue.phoneNumber
      if(screenValue.nickName) likeMem.nick = screenValue.nickName
      if(screenValue.pointRange[0] || screenValue.pointRange[1] || screenValue.pointRange[0] === 0 ||screenValue.pointRange[1] === 0) sectionNumType.point_type = screenValue.diyInputRangeType
      if(screenValue.pointRange[0] || screenValue.pointRange[0] === 0) sectionNumType.start = screenValue.pointRange[0]
      if(screenValue.pointRange[1] || screenValue.pointRange[1] === 0) sectionNumType.end = screenValue.pointRange[1]
      if(screenValue.level) equals.level_code = screenValue.level
      if(screenValue.origin) equals.platform_code = screenValue.origin
      if(Object.keys(like).length) filter.like = like
      if(Object.keys(sectionNumType).length) filter.sectionNumType = sectionNumType
      if(Object.keys(equals).length) filter.equals = equals
      if(Object.keys(likeMem).length) filter.likeMem = likeMem
      return filter
    },
    getTableData(pageNum,pageSize){
      this.tableLoading = true
      queryAdjustList({pageNum,pageSize,...this.getFilter(this.screenValue)}).then(({data})=>{
        this.tableLoading = false
        this.tableData = data.list
        this.pageNum = data.pageNum
        this.pageSize = data.pageSize
        this.total = data.total
      }).catch(()=>{
        this.tableLoading = false
      })
    },
    selected(val) {
      if (val === "resetForm") {
        this.screenValue = {
          cardId: "",
          phoneNumber: "",
          nickName: "",
          pointRange: [],
          diyInputRangeType: 'qty_point',
          level: '',
          origin: '',
        };
        this.nowScreenValue = {
          cardId: "",
          phoneNumber: "",
          nickName: "",
          pointRange: [],
          diyInputRangeType: 'qty_point',
          level: '',
          origin: '',
        };
      }else{
        let list = JSON.parse(JSON.stringify(this.screenValue))
        this.nowScreenValue = list
      }
      this.getTableData(1,10)
    },
    openForm(type,id='',phoneNumber='') {
      this.nowForm = type
      this.showSetForm = true
      this.$refs.setPointForm && this.$refs.setPointForm.resetFields()
      this.nowId = id
      this.setPointForm.phoneNumber = phoneNumber
    },
    submitForm() {
        this.$refs.setPointForm.validate((valid) => {
        if (valid) {
          let info = this.setPointForm
          let obj = {
            modify_type:info.type,
          }
          if(this.nowForm === 'one') obj.member_id = this.nowId
          if(this.nowForm === 'many') {
            let member_ids = []
            this.selectedList.forEach(item=>{
              member_ids.push(item.member_id)
            })
            obj.member_ids = member_ids
          }
          if(this.nowForm === 'all') {
            obj = Object.assign(obj,{...this.getFilter(this.nowScreenValue)})
          }
          if(info.remark) obj.remark = info.remark
          let pointType = ''
          if(info.type === 1){
            if(info.pointTypeArr.length === 2) pointType = 3
            else pointType = info.pointTypeArr[0]
          }
          if(info.type === 2){
            pointType = info.pointType
            obj.adjust_type = info.rePointType
            if(info.rePointType === 1) obj.cnt_point = info.point
            else obj.cnt_point = info.point * -1
            obj.point_will_outdate = info.date
          }
          obj.point_type = pointType
          if(this.nowForm === 'many' && obj.member_ids.length === 0){
            this.$message.error('请至少选择一条数据')
          }else{
            MAP[this.nowForm](obj).then(()=>{
              this.showSetForm = false
              this.getTableData(this.pageNum,this.pageSize)
            })
          }
        } else {
          return false;
        }
      })
    },
    handleSelectionChange(val){
      this.selectedList = val
    },
    setPoint(val){
      this.$set(this.setPointForm,'point',val)
    },
    handleSizeChange(val){
      this.getTableData(1,val)
    },
    handleCurrentChange(val){
      this.getTableData(val,this.pageSize)
    }
  },
  computed:{
    ...mapGetters(['brandCode'])
  }
};
</script>


<style lang="scss" scoped>
.rePoint {
  margin: 20px;
  padding: 20px;
  background: #fff;
}
.fileMode {
  padding: 30px;
}
/deep/ .el-table,
/deep/ .el-table__header-wrapper,
/deep/ .el-table thead .el-table-column--selection,
/deep/ .el-table thead .el-table-column--selection .cell {
  overflow: visible !important;
}
/deep/ .el-table thead .cell .el-checkbox__inner {
  position: absolute;
  top: -54px;
}
.setBox {
  padding: 10px 0 10px 55px;
}
/deep/ .el-input__count{
  background-color: transparent;
}
</style>