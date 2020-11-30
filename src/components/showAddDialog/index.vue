<template>
  <div class="neo-dialog-add-container">
    <el-dialog
      :title="'选择' + showTypeMap[showType]"
      :visible.sync="show"
      :width="'800px'"
      :close-on-click-modal="false"
      @close="fedback"
    >
      <div class="content">
        <el-form label-position="right" label-width="80px">
          <el-row v-if="dialogType != 3">
            <!-- <template v-if="showType == 13"> -->
            <el-col :span="8" >
              <el-form-item label="角色编号">
                <el-input v-model="form.code" size="small" placeholder="请输入角色编号"/>
              </el-form-item>
            </el-col>
            <el-col :span="8" >
              <el-form-item label="角色名称">
                <el-input v-model="form.name" size="small" placeholder="请输入角色名称"/>
              </el-form-item>
            </el-col>
            <!-- </template> -->
            <el-col :span="8" class="mt-30" style="text-align:right;">
              <el-button type="primary" @click="search">查询</el-button>
              <el-button class="ml-20" @click="resetSearch">清空筛选</el-button>
            </el-col>
          </el-row>
        </el-form>
        <div class="dialog-table-container mt-10">
          <el-table
          max-height="300px"
            ref="multipleTable"
            :data="list"
            class="table"
            @selection-change="handleSelectionChange"
          >
            <el-table-column v-if="dialogType == 1" type="selection" width="55"/>
            <template v-if="showType == 13">
              <el-table-column
                label="角色编号"
                prop="id">
                <template slot-scope="scope">
                  {{ scope.row.id }}
                </template>
              </el-table-column>
              <el-table-column
                label="角色名称"
                prop="name">
                <template slot-scope="scope">
                  {{ scope.row.name }}
                </template>
              </el-table-column>
            </template>
          </el-table>
          <base-pagination
          class="bottomPagination"
            v-model="params.current"
            :page-size.sync="params.page_size"
            :total="total"
            style="margin-top:10px;"
            @loadData="getData"
          />
        </div>
        <div class="btns">
          <div>
            <el-button @click="cancel">取消</el-button>
            <el-button
              v-if="dialogType == 1"
              :disabled="isBtnDisabled"
              type="primary"
              @click="confirm"
            >保存</el-button>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { queryByPage } from '@/api/permissions'
export default {
  props: {
    extraParam: {
      type: Object,
      default: () => {
        return {}
      }
    },
    dialogType: {
      type: [String, Number],
      default: 1 // 1多选  2单选 3单选无过滤和分页
    },
    showType: {
      type: [String, Number],
      default: 1 // 1商品 2菜单 3自选组 4税率 5优惠券 6菜单商品 7栏目 11商品属性 12已发放优惠券列表
    },
    dialogShow: {
      type: Boolean,
      default: false
    },
    source: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data() {
    return {
      isDialog: true, // 此处是Dialog组件
      showTypeMap: {
        1: '商品',
        2: '菜单',
        3: '自选组',
        4: '税率',
        5: '优惠券',
        6: '菜单商品',
        7: '栏目',
        8: '员工',
        9: '区域',
        10: '所属区域',
        11: '商品属性',
        12: '优惠券',
        13: '角色'
      },
      show: false,
      form: {
        name: '',
        code: ''
      },
      list: [], // 数据列表
      multipleSelection: [], // 多选时回显到列表上
      isBtnDisabled: false,
      selectList: [],
      selectArr: [], // 用于校验是否可选择 //单选时有值会禁止点击
      params: {
        current: 1,
        page_size: 10
      },
      total: 0,
      isChange: 0
    }
  },
  watch: {
    async dialogShow(nval) {
      if (this.dialogType == 1) {
        this.show = nval
      }
      this.isChange = 0
      if (nval) {
        this.currentPage = 1
        this.isBtnDisabled = false
        this.setIsMul(this.source) // 获取回显的数据
        // this.multipleSelection = JSON.parse(JSON.stringify(this.source))
        await this.getData({})
      } else {
        this.form = {
          name: '',
          code: ''
        }
      }
      // 如果单选需要计算完已选再出现页面
      if (this.dialogType != 1) {
        this.show = nval
      }
    }
  },
  created() {
    // console.log()
    this.show = this.dialogShow
    this.$store.commit('add_is_refresh', true)
  },
  methods: {
    setIsMul(list) {
      this.selectList = JSON.parse(JSON.stringify(list))
      // this.setCurpageList(list);
    },
    setCurpageList(list) {
      console.log('==target==', list)
      // let list = this.multipleSelection

      let target = 'id'
      if (this.showType == 1) {
        target = 'productCode'
      } else if (this.showType == 3) {
        target = 'id'
      }

      for (let i = 0; i < list.length; i++) {
        const ids = this.list.findIndex((e) => e[target] == list[i][target])
        console.log(ids)
        if (ids > -1) {
          this.$refs.multipleTable.toggleRowSelection(this.list[ids])
        }
      }
      this.isChange = 0
      console.log('---切换数据后，页面选中--', this.multipleSelection)
    },
    choose(row) {
      this.isBtnDisabled = true
      this.$emit('save', row)
    },
    fedback() {
      this.$emit('update:dialogShow', false)
    },
    confirm() {
      this.isBtnDisabled = true
      this.$emit('update:dialogShow', false)
      this.$emit('save', this.selectList)
    },
    async getData(params) {
      let res = {}
      const submitObj = {
        params: {
          ...this.extraParam,
          ...params
        }
      }
      this.isChange = 1
      if (this.dialogType != 3) {
        submitObj.pageNo = this.params.current
        submitObj.pageSize = this.params.page_size
      }
      if (this.showType == 13) {
        res = await queryByPage(submitObj)
      }
      console.log(res,'980909')
      if (this.showType == 4) {
        this.list = res.body && res.body.list || []
      } else if (this.showType == 11) {
        this.list = res.body || []
      } else {
        this.total = res.body && parseInt(res.body.total) || 0
        this.list = res.body && res.body.records || []
      }
      if (this.dialogType == 1) {
        this.$nextTick(() => {
          this.setCurpageList(this.selectList)
        })
        return false
      }
      if (this.dialogType != 1) {
        const selectArr = []
        this.list.map(lItem => {
          let curValue = false
          this.selectList.map(item => {
            if (this.showType == 1) {
              if (lItem.productCode == item.productCode) {
                curValue = true
              }
            } else {
              if (lItem.id == item.id) {
                curValue = true
              }
            }
          })
          selectArr.push(curValue)
        })
        this.selectArr = selectArr
      }
    },
    search() {
      this.currentPage = 1
      const resObj = {}
      if (this.showType == 13) {
        if (this.form.code) {
          resObj.id = this.form.code
        }
        if (this.form.name) {
          resObj.name = this.form.name
        }
      }
      this.getData(resObj)
    },
    resetSearch() {
      this.currentPage = 1
      this.form = {
        name: '',
        code: ''
      }
      this.getData({})
    },
    cancel() {
      // this.show = false;
      this.$emit('update:dialogShow', false)
    },
    getProductNameArr(list) {
      const resArr = []
      if (list && list.length > 0) {
        list.map(item => {
          resArr.push(item.name)
        })
      }
      return resArr
    },
    handleSelectionChange(val) {
      console.log(222, val)
      console.log('isChange', this.isChange)
      if (this.isChange != 1) {
        this.multipleSelection = val
        this.creatIsSel(val)
      }
    },
    creatIsSel(list) {
      let olist = JSON.parse(JSON.stringify(this.selectList)),
        lst1 = [], // 已选在当前页
        lst2 = []// 已选不在当前页
      let target = 'id'
      if (this.showType == 1) {
        target = 'productCode'
      } else if (this.showType == 3) {
        target = 'id'
      }
      for (let i = 0; i < olist.length; i++) {
        const ids = this.list.findIndex((e) => e[target] == olist[i][target])
        if (ids > -1) {
          lst1.push(olist[i])
        } else {
          lst2.push(olist[i])
        }
      }
      console.log('---已选在当前页---', lst1)
      console.log('---已选不在当前页---', lst2)
      lst1 = JSON.parse(JSON.stringify(list))

      this.selectList = [...lst1, ...lst2]
      console.log('---已选择---', this.selectList)
    }
  }
}
</script>
<style lang="less" scoped>
  .neo-dialog-add-container {
    .el-dialog__wrapper{
      margin-top: -8vh;
    }
    // .dialog-table-container {
    //     min-height: 100px;
    //     max-height: 350px;
    //     overflow-y: auto;
    // }
  }
  .neo-dialog-add-container .select-btn {
    display: inline-block;
    width: 50px;
    height: 30px;
    line-height: 30px;
    text-align: center;
    border-radius: 4px;
    color: #fff;
    background-color: getColor(primary);
  }
  .btns {
    margin-top: 10px;
    display: flex;
    align-items: center;
    justify-content: flex-end;
  }
</style>
