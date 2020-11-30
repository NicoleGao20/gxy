<template>
  <div class="page-container">
    <div >
      <el-form ref="form" :model="form" :rules="rules" label-position="right" label-width="100px">
        <div class="label-title">
          <i class="linev-tip"/><span class="label-desc">基本信息</span>
        </div>
        <div style="width: 600px;">
          <el-form-item label="事件类型" prop="eventType">
            <el-select v-model="form.business_type" disabled style="width: 100%;" clearable >
              <el-option v-for="(labelAttribute, index) in labelAttributes" :key="index" :label="labelAttribute.label" :value="labelAttribute.value"/>
            </el-select>
          </el-form-item>
          <el-form-item label="事件名称" prop="eventName">
            <el-input v-model="form.table_name_show" clearable disabled/>
          </el-form-item>
          <!-- <el-form-item label="事件对象" prop="partition_level_1">
            <el-checkbox-group v-model="form.eventType">
              <el-checkbox label="会员" name="type"/>
              <el-checkbox label="仅关注但未注册的用户" name="type"/>
            </el-checkbox-group>
          </el-form-item> -->
          <el-form-item label="备注" prop="remark">
            <el-input v-model="form.table_name_desc" :rows="3" disabled maxlength="300" show-word-limit type="textarea" clearable placeholder="用户关注后满足触发条件时，系统符合要求的触发动作"/>
          </el-form-item>
        </div>
        <el-form-item label="事件条件字段" prop="remark">
          <div>
            <!-- <el-button type="primary" class="listAddBtnStyle">新增</el-button> -->
            <el-table
              :data="tableList"
              style="width: 100%"
              max-height="250">
              <el-table-column
                fixed
                prop="column_name_show"
                label="字段名称"/>
              <el-table-column
                prop="column_name_desc"
                label="字段描述"/>
              <el-table-column
                prop="column_type"
                label="字段类型"/>
              <el-table-column
                prop="default_value"
                label="默认值"/>
              <!-- <el-table-column label="操作" v-if="showType == 'edit'" width="160" fixed="right">
                <template slot-scope="scope">
                  <el-button type="text" @click="handler(scope.row)">编辑</el-button>
                </template>
              </el-table-column> -->
            </el-table>
            <!-- <base-pagination
              v-model="params.current"
              :page-size.sync="params.page_size"
              :total="total"
              @loadData="loadData"
            /> -->
          </div>
        </el-form-item>
      </el-form>
    </div>
    <div class="action-wrap">
      <el-button size="small" @click="$router.back()">返回列表</el-button>
      <!-- <el-button :loading="actionLoading" size="small" type="primary" @click="confirmHandler">确认</el-button> -->
    </div>
    <el-dialog
      title="修改事件条件"
      :visible.sync="dialogVisible"
      width="30%"
       >
      <el-form   ref="formField" :model="formField" :rules="rulesField"  label-position="right" label-width="100px">
        <el-form-item label="字段名称" prop="column_name_show">
          <el-input v-model="formField.column_name_show" clearable />
        </el-form-item>
        <!-- <el-form-item label="备注" prop="remark">
          <el-input v-model="formField.column_name_desc" :rows="3"  maxlength="300" show-word-limit type="textarea" clearable placeholder="用户关注后满足触发条件时，系统符合要求的触发动作"/>
        </el-form-item> -->
       </el-form>  
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveMarketEventField">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { getEventList, queryEventDefDetails, queryEventParamList } from '@/api/marketEvent'
export default {
  name: 'MarketEventAdd',
  data() {
    return {
      showType:'',
      form: {
        eventType: '',
        eventName: '',
        remark: '',
        list: []
      },
      labelAttributes: [],
      tableList: [],
      params: {
        current: 1,
        page_size: 10
      },
      total: 0,
      rules: { },
      dialogVisible:false,
      formField:{
        column_name_show:'',
        // column_name_desc:''
      },
      rulesField:{
        column_name_show: [
            { required: true, message: '请填写字段名称', trigger: 'blur' }
        ]

      },
      column_id:''

    }
  },
  mounted() {
    this.showType=this.$route.query.type
    if (this.$route.query.id) {
      this.getList()
    }
  },
  methods: {
    handler(row, type) {
      this.column_id=row.id
      this.dialogVisible=true
      this.formField= JSON.parse(JSON.stringify(row))
    },
    saveMarketEventField(){
      this.$refs['formField'].validate((valid) => {
      if (!valid) return
        let param ={
        "meta_table_id": this.$route.query.id,
        "meta_columns":[
       
          ]
        }
        param.meta_columns.push({
          "id":this.column_id,
          "column_name_show": this.formField.column_name_show,
          // "column_name_desc":this.formField.column_name_desc
        }) 
      let params =JSON.stringify(param)
      updateMarketEventField(params).then(res => {
        this.dialogVisible = false
        this.formField.column_name_show=''
        // this.formField.column_name_desc=''
      })
    })
     
    },
    getList() {
      getEventList().then(res => {
        this.getDetails()
        this.queryEvent()
        this.labelAttributes = res.data.list
        if (this.labelAttributes.length) {
          this.labelAttributes.forEach(ele => {
            this.$set(ele, 'label', ele.eventTypeName)
            this.$set(ele, 'value', ele.eventTypeCode)
          })
        }
      })
    },
    getDetails() {
      queryEventDefDetails({ id: this.$route.query.id }).then(res => {
        this.form = res.data
      })
    },
    queryEvent() {
      const params = {
        id: this.$route.query.id,
        ...this.params
      }
      for (var attr in params) {
        if (!params[attr]) delete params[attr]
      }
      queryEventParamList(params).then(res => {
        this.tableList = res.data.list
        this.params.current = res.data.pagination.current || 1
        this.params.page_size = res.data.pagination.page_size
        this.total = res.data.pagination.total || 0
      })
    },
    loadData() {}
  }
}
</script>
<style lang="less">
  .page-container{
    min-height: 100%;
    padding: 20px;
    background: white;
  }
  .label-title {
    height: 16px;
    position: relative;
    line-height: 16px;
    padding-left: 10px;
    margin-left: 30px;
    margin-bottom: 20px;
  }
  .linev-tip {
    display: inline-block;
    width: 4px;
    height: 16px;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    position: absolute;
    background: #435a82;
  }
</style>
