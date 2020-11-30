<template>
  <div class="page-container">
    <div style="padding-bottom: 50px;">
      <el-form ref="form" :model="form" :rules="rules" label-position="right" label-width="100px">
        <el-form-item
          label="筛选类型"
          prop="table_name_show">
          <el-input v-model="form.table_name_show" :disabled="disabled" clearable />
        </el-form-item>
        <el-form-item
          label="类型"
          prop="type">
          <el-select v-model="form.table_type" :disabled="disabled" style="width: 100%;" clearable >
            <el-option v-for="(labelType, index) in labelTypes" :key="index" :label="labelType.label" :value="labelType.value" :disabled="disabled" />
          </el-select>
        </el-form-item>
        <el-form-item
          v-if="form.table_type==='aggregation'"
          label="升级为标签"
          prop="is_uptolabel" >
          <el-input v-model="is_uptolabelName" :disabled="disabled" />
        </el-form-item>
        <el-form-item
          v-if="form.table_type==='aggregation'"
          label="可见/不可见"
          prop="is_visible">
          <el-input v-model="is_visiableName" :disabled="disabled" />
        </el-form-item>
        <el-form-item
          label="描述"
          prop="table_name_desc">
          <el-input v-model="form.table_name_desc" :rows="2" :disabled="disabled" type="textarea" clearable/>
        </el-form-item>
        <el-form-item
          label="条件明细">
          <el-table
            :data="form.list"
            border
            height="450">
            <el-table-column
              label="字段名称"
              prop="column_name_show"/>
            <el-table-column
              label="字段类型"
              prop="column_type"/>
            <el-table-column
              v-if="form.table_type==='analysis'"
              label="升级为标签"
              prop="is_uptolabel">
              <template slot-scope="scope">
                <span v-if="scope.row.is_uptolabel==='Y'">是</span>
                <span v-if="scope.row.is_uptolabel==='N'">否</span>
              </template>
            </el-table-column>
            <el-table-column
              v-if="form.table_type==='analysis'"
              label="可见/不可见"
              prop="is_visible" >
              <template slot-scope="scope">
                <span v-if="scope.row.is_visible==='Y'">可见</span>
                <span v-if="scope.row.is_visible==='N'">不可见</span>
              </template>
            </el-table-column>
            <!-- <el-table-column
              v-if="form.table_type==='analysis' && isEdit"
              label="是否升级属性"
              width="120">
              <template slot-scope="scope">

              </template>
            </el-table-column> -->
            <el-table-column
              v-if="form.table_type==='analysis' && isEdit"
              label="操作"
              width="260"
              header-align="center"
              align="left">
              <template slot-scope="scope">
                <el-button v-if="scope.row.is_uptolabel ==='N'" type="primary" plain @click="setLabel(scope.row)"> 设置为维度 </el-button>
                <el-button v-if="scope.row.is_uptolabel ==='Y'" type="primary" plain @click="setLabel(scope.row)"> 设置为指标 </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
      </el-form>
      <div class="tips">
        <p>维度一般选取非数值字段，举例如“性别”，“国家”，“产品类别”等，用来表示 有类别区分</p>
        <p>指标一般选取数值字段，举例如“金额”，“数量”，用来表示每一个类别的大小</p>
      </div>
    </div>
    <div :style="{left: sidebar.opened?'230px': '50px'}" class="action-wrap">
      <el-button  @click="$router.back()">返回</el-button>
    </div>
    <el-dialog
      :visible.sync="dialogVisible"
      title="提示"
      width="30%"
    >
      <el-form ref="formName" :model="formName" :rules="formNameRules" label-width="80px">
        <el-form-item label="标签名称" prop="name">
          <el-input v-model="formName.name" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addAttributeLabelFun">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
// eslint-disable-next-line
import { mapState } from 'vuex'
import { detailCondtion, setLabel, setVisible, listTableNameShow } from '@/api/conditionLibrary'
export default {
  name: 'ConditionLibraryMod',
  data() {
    return {
      disabled: true,
      is_visiableName: '',
      is_uptolabelName: '',
      dialogVisible: false,
      columnOrTableShow: '',
      formName: {
        name: ''
      },
      formNameRules: {
        name: [
          { required: true, message: '请输入名称', trigger: 'blur' }
        ]
      },
      form: {
        table_name_show: '',
        table_type: '',
        table_name: '',
        table_name_desc: '',
        is_visiable: '',
        is_uptolabel: '',
        list: []
      },
      param: {},
      labelTypes: [
        { label: '分析数据', value: 'analysis' }
      ],
      rules: {
        table_name_show: [
          { required: true, trigger: 'blur' }
        ],
        type: [
          { required: true, trigger: 'blur' }
        ]
      },
      id: '',
      isEdit: false,
      table_type: ''
    }
  },
  computed: {
    ...mapState({
      sidebar: state => state.app.sidebar
    })
  },
  mounted() {
    this.id = this.$route.query.id
    this.table_type = this.$route.query.table_type
    if (this.$route.query.isEdit && this.$route.query.isEdit === 'view') {
      this.isEdit = false
    } else if (this.$route.query.isEdit && this.$route.query.isEdit === 'edit') {
      this.isEdit = true
    }
    this.init()
  },
  methods: {
    init() {
      detailCondtion({ id: this.id, table_type: this.table_type }).then((res) => {
        this.form = res.data
        if (this.form.is_visible && this.form.is_visible === 'Y') {
          this.is_visiableName = '可见'
        } else {
          this.is_visiableName = '不可见'
        }
        if (this.form.is_uptolabel && this.form.is_uptolabel === 'Y') {
          this.is_uptolabelName = '是'
        } else {
          this.is_uptolabelName = '否'
        }
      })
    },
    setLabel(item) {
      let param = { }
      let up_or_down = ''
      if (item.meta_column_id) {
        if (item.is_uptolabel === 'N') {
          up_or_down = 'up'
        } else {
          up_or_down = 'down'
        }
        this.formName.name = item.column_name_show
        param = {
          id: item.meta_column_id,
          table_type: this.form.table_type,
          up_or_down: up_or_down,
          column_name_show: item.column_name_show
        }
      } else {
        if (this.form.is_uptolabel === 'N') {
          up_or_down = 'up'
        } else {
          up_or_down = 'down'
        }
        this.formName.name = this.form.table_name_show
        param = {
          id: this.id,
          table_type: this.form.table_type,
          table_name_show: this.form.table_name_show,
          up_or_down: up_or_down
        }
      }
      setLabel(param).then((res) => {
        this.init()
      }).catch((error) => {
        if (item.meta_column_id) {
          this.columnOrTableShow = 'column_name_show'
        } else {
          this.columnOrTableShow = 'table_name_show'
        }
        if (error.response.data.bizCode === 50140) {
          this.param = param
          this.dialogVisible = true
        }
      })
    },
    addAttributeLabelFun() {
      const param = this.param
      if (this.columnOrTableShow === 'column_name_show') {
        param.column_name_show = this.formName.name
      } else if (this.columnOrTableShow === 'table_name_show') {
        param.table_name_show = this.formName.name
      }
      setLabel(param).then((res) => {
        this.dialogVisible = false
        this.init()
      })
    },
    setVisible(item) {
      let param = {}
      let is_or_not = ''
      if (item.meta_column_id) {
        if (item.is_visible === 'N') {
          is_or_not = 'is'
        } else {
          is_or_not = 'not'
        }
        param = {
          id: item.meta_column_id,
          table_type: this.form.table_type,
          is_or_not: is_or_not
        }
      } else {
        if (this.form.is_visible === 'N') {
          is_or_not = 'is'
        } else {
          is_or_not = 'not'
        }
        param = {
          id: this.id,
          table_type: this.form.table_type,
          is_or_not: is_or_not
        }
      }
      setVisible(param).then((res) => {
        this.init()
      })
    }
  }
}
</script>
<style lang="less" scoped>
 .zZindex{
   z-index: 500;
 }
 .tips {
  //  color: #435A82;
  color: #C0C4CC;
   margin-left: 100px;
   line-height: 1.4;
 }
 .page-container{
   background: #fff;
 }
</style>

