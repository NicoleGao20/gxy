<template>
  <div class="account-content">
    <div class="searchWrap">
      <el-form label-position="right" label-width="80px">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="角色编号">
              <el-input
                v-model="searchForm.id"
                maxlength="100"
                clearable
                placeholder="请输入角色编号"
                @keyup.enter.native="getData"
              />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="角色名称">
              <el-input
                v-model="searchForm.name"
                maxlength="100"
                clearable
                placeholder="请输入角色名称"
                @keyup.enter.native="getData"
              />
            </el-form-item>
          </el-col>
          <el-col :span="6" style="text-align:center;">
            <el-button type="primary" @click="getData(searchForm)">查询</el-button>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <main class="tableMainContent">
      <el-button type="primary" @click="handleAdd">创建角色</el-button>
      <el-table
        v-loading="loading"
        stripe
        :data="list"
        :max-height="450"
        style="margin-top: 10px;"
      >
        <el-table-column label="序号">
          <template slot-scope="scope">
            <span>{{ (scope.$index+1) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="角色编号" prop="id">
          <template slot-scope="scope">{{ scope.row.id }}</template>
        </el-table-column>
        <el-table-column label="角色名称" prop="name">
          <template slot-scope="scope">{{ scope.row.name }}</template>
        </el-table-column>
        <el-table-column label="创建时间" prop="createdTime">
          <template slot-scope="scope">{{ scope.row.createdTime }}</template>
        </el-table-column>
        <el-table-column label="修改时间" prop="modifiedTime">
          <template slot-scope="scope">{{ scope.row.modifiedTime }}</template>
        </el-table-column>
        <el-table-column label="创建人" prop="creatorName">
        </el-table-column>
        <el-table-column label="操作" width="220" fixed="right">
          <template slot-scope="scope">
            <el-button type="text" @click="handleClick(scope.row, 'detail')">查看</el-button>
            <el-button v-if="scope.row.id !== '54'" 
             type="text" @click="handleClick(scope.row, 'modify')">编辑</el-button>
            <el-button v-if="scope.row.id !== '54'" 
            type="text" class="deleteFontColor" @click="handleClick(scope.row, 'del')">删除</el-button>
            <el-button v-if="scope.row.id !== '54'"
            type="text" @click="handleClick(scope.row, 'set')">设置权限</el-button>
          </template>
        </el-table-column>
      </el-table>
      <base-pagination
        class="bottomPagination"
        v-model="params.current"
        :page-size.sync="params.page_size"
        :total="total"
        @loadData="getData"
      />
    </main>
    <el-dialog
      :visible.sync="jurisdiction"
      :width="'1000px'"
      :height="'1000px'"
      :close-on-click-modal="false"
      title="查看权限"
      @close="jurisdiction = false"
    >
      <el-row class="mt-10">
        <div class="titleIcon">菜单权限</div>
         <div class="ad-status filter-btns" style="font-size: 13px;">
            <ul>
              <li
                v-for="(adStatusItem, index) in platformList"
                :key="index"
                :class="{'on': adStatusItem.value == PLATFORM_TYPE }"
                @click="filterFun(adStatusItem.value)">
                {{ adStatusItem.label }}
              </li>
            </ul>
          </div>
        <el-container class="container">
          <el-aside width="300px" class="aside-left">
            <el-tree :data="menuTree" :props="defaultProps" @node-click="handleNodeClick" />
          </el-aside>
          <el-main v-if="cities.length != 0 || actioncities.length != 0 || tableData3.length != 0">
            <el-col :span="24">
              <div class="main-header">查询条件</div>
            </el-col>
            <el-col :span="24">
              <div v-if="cities.length !== 0" class="main-check">
                <el-checkbox-group v-model="checkedCities">
                  <el-checkbox
                    v-for="city in cities"
                    :label="city.id"
                    :key="city.id"
                    disabled
                  >{{ city.name }}</el-checkbox>
                </el-checkbox-group>
              </div>
              <div v-else class="main-check">无</div>
            </el-col>
            <el-col :span="24">
              <div class="main-header">动作权限</div>
            </el-col>
            <el-col :span="24">
              <div v-if="actioncities.length !==0" class="main-check">
                <el-checkbox-group v-model="actionCities">
                  <el-checkbox
                    v-for="city in actioncities"
                    :label="city.id"
                    :key="city.id"
                    disabled
                  >{{ city.name }}</el-checkbox>
                </el-checkbox-group>
              </div>
              <div v-else class="main-check">无</div>
            </el-col>
            <el-col :span="24">
              <div class="main-header">
                字段权限
                <span>*如果当前角色设置了“新增/导入”操作，*必填字段默认“读写”</span>
              </div>
            </el-col>
            <el-table
              ref="multipleTable"
              :data="tableData3"
              :header-cell-style="{background:'#F5F7FA'}"
              :header-cell-class-name="cellclass"
              tooltip-effect="dark"
              style="width: 100%;text-align: center;"
            >
              <el-table-column prop="name" label="字段名称" width="120" />
              <el-table-column
                :selectable="checkboxSelect"
                prop="radio2"
                type="selection"
                width="60"
                disabled="true"
              />
              <el-table-column label show-overflow-tooltip />
            </el-table>
          </el-main>
          <el-main v-else class="irrelevant">
            <div>*当前选中一级／二级菜单，勾选当前菜单，默认选中下级菜单所有权限，</div>
            <div>若需要单独设置，请点击具体菜单进行设置</div>
          </el-main>
        </el-container>
      </el-row>
      <el-row class="mt-10">
        <div class="titleIcon">数据权限</div>
        <el-col :span="24" class="rule">
          <el-col :span="8">规则名称</el-col>
          <el-col :span="8">规则类型</el-col>
          <el-col :span="8">规则条件</el-col>
        </el-col>
        <el-col v-if="permission" :span="24" class="rule">
          <el-col :span="8">{{ dataFilterParamIdName }}</el-col>
          <el-col :span="8">
            <el-input
              :placeholder="placeholder"
              :disabled="true"
              style="width: 180px"
              size="small"
            />
          </el-col>
          <el-col :span="8">
            <el-row>
              <el-input
                :placeholder="deplaceholder"
                :disabled="true"
                style="width: 180px"
                size="small"
              />
            </el-row>
          </el-col>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>
<script>
import { getPlatformList } from '@/api/homePage'
import Cookies from 'js-cookie'
import axios from 'axios'
import { queryByPage, checkFunction, deleteRole, getSingleMenuJurisdictionData } from '@/api/permissions'
import config from '@/config/config'
export default {
  name: 'NeoActivitySetting',
  data() {
    return {
      PLATFORM_TYPE: '',
      platformList: [],
      searchForm: {
        id: '',
        name: ''
      },
      loading: false,
      tableHeight: 200,
      isMoreinquiries: false,
      dataFilterParamIdName: '',
      permission: false,
      deplaceholder: '',
      placeholder: '',
      subFuncsData: [],
      menuTree: [],
      expanded_keys: [],
      cities: [], // 查询数组
      checkedCities: [], // 查询选中
      actioncities: [], // 动作权限
      actionCities: [], // 动作选中
      tableData3: [], // 字段权限数组
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      jurisdiction: false,
      list: [],
      id: '',
      is_no_func: 1,
      params: {
        current: 1,
        page_size: 10
      },
      total: 0
    }
  },
  created() {
    this.getData({})
    
  },
  methods: {
    filterFun(adStatus) {
      this.menuTree = []
      this.PLATFORM_TYPE = adStatus
      this.getTreeData() // 点击平台按钮，调用接口返回数据
    },
    async  getPlatform() {
      this.platformList=[]
      let res= await getPlatformList()
    // .then(res => {
    //     if (res.code == 0) {
    //       if (res.body && res.body.length) {
    //         res.body.forEach((item) => {
    //           this.platformList.push({ label: item.platformName, value: item.platformCode })
    //         })
    //       }
    //       if (this.platformList && this.platformList.length > 0) {
    //         this.PLATFORM_TYPE = this.platformList[0].value
    //         this.getData() // 获取反选数据
    //         // this.getRuleName() // 获取规则名称字段
    //         this.getTree() // 获取树结构
    //       }
    //     }
    //   })
      if (res.code == 0) {
        if (res.body && res.body.length) {
          res.body.forEach((item) => {
            this.platformList.push({ label: item.platformName, value: item.platformCode })
          })
        }
        if (this.platformList && this.platformList.length > 0) {
          this.PLATFORM_TYPE = this.platformList[0].value
          return this.platformList[0].value || ''
          // this.getData() // 获取反选数据
          // // this.getRuleName() // 获取规则名称字段
          // this.getTree() // 获取树结构
            console.log('his.platformList[0].value ')
        }
      }
    },
    getData(params) {
      // console.log(params,888888888888)
      const sdata = JSON.parse(JSON.stringify(this.searchForm))
      queryByPage({
        pageNo: this.params.current,
        pageSize: this.params.page_size,
        params:  sdata
      }).then((res) => {
        this.total = parseInt(res.body.total)
        this.list = res.body.records
      })
    },
    handleClick(item, type) {
      switch (type) {
        case 'detail':
          this.jurisdiction = true
          this.getSee(item)
          break
        case 'modify':
          this.handleModify(item)
          break
        case 'set':
          this.changePower(item)
          break
        case 'del':
          this.$confirm('确定删除角色？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            confirmButtonClass: 'bg-color-danger'
          })
            .then(() => {
              this.handleDel(item)
            })
            .catch(() => {})
          break
        default:
          break
      }
    },
    handleDel(item) {
      deleteRole({ id: item.id }).then((res) => {
        this.getData({})
      })
    },
    // 编辑
    handleModify(item) {
      this.$router.push({
        name: 'newRole',
        query: {
          id: item.id
        }
      })
    },
    // 创建活动
    handleAdd() {
      this.$router.push({
        name: 'newRole'
      })
    },
    changePower(item) {
      this.$router.push({
        name: 'Jurisdiction',
        query: {
          id: item.id,
          name: item.name,
          description: item.description
        }
      })
    },
    getTree(val) {
      console.log(val)
      const TreeArr = []
      val.functionGroupList.forEach((element) => {
        const father = {
          id: element.id,
          name: element.showName,
          functionType: element.functionType,
          children: []
        }
        if (element.functionList) {
          element.functionList.forEach((val) => {
            const list = {
              id: val.id,
              name: val.showName,
              functionType: val.functionType
            }
            if (val.hasOwnProperty('subFunctionList')) {
              list.children = []
              val.subFunctionList.forEach((value) => {
                const level = {
                  id: value.id,
                  name: value.showName,
                  functionType: value.functionType
                }
                list.children.push(level)
              })
            }
            father.children.push(list)
          })
        }
        TreeArr.push(father)
      })
      this.menuTree = TreeArr
      // })
    },
    getSee(item) {
      this.id = item.id
        console.log(item,99999,'platformCode',88888888)
      this.getPlatform().then((platformCode)=>{
        if(platformCode){
          console.log(this.getPlatform,99999,platformCode,)
          this.getTreeData()
        }
      })
   
      // this.id = item.id
      // const platformCode = Cookies.get('platformCode')
      // checkFunction({ id: item.id }, platformCode).then((res) => {
      //   console.log(res)
      //   if (res.code === '0') {
      //     const object = res.body
      //     this.getTree(object)
      //     this.permission = false
      //     object.filterList.forEach((element) => {
      //       if (
      //         element.type !== 0 &&
      //         element.hasOwnProperty('paramDescription')
      //       ) {
      //         this.permission = true
      //         this.dataFilterParamIdName = element.paramDescription
      //         if (element.type === 2) {
      //           this.placeholder = '规则匹配'
      //           if (element.dataFilterParamId === '2') {
      //             this.deplaceholder =
      //               element.filterParams.storeCode.length > 0
      //                 ? '已选' + element.filterParams.storeCode.length
      //                 : ''
      //           } else if (element.dataFilterParamId === '3') {
      //             this.deplaceholder =
      //               element.filterParams.regionCode.length > 0
      //                 ? '已选' + element.filterParams.regionCode.length
      //                 : ''
      //           }
      //         } else {
      //           this.placeholder = '指定值'
      //           this.deplaceholder = `= ${element.paramDescription}`
      //         }
      //       } else {
      //         this.permission = false
      //       }
      //     })
      //   }
      // })
    },
    // 根据不同的平台获取树形数据
    getTreeData(){
      if(this.PLATFORM_TYPE){
        checkFunction({ id:  this.id }, this.PLATFORM_TYPE).then((res) => {
          if (res.code === '0') {
            const object = res.body
            this.getTree(object)
            this.permission = false
            object.filterList.forEach((element) => {
              if (
                element.type !== 0 &&
                element.hasOwnProperty('paramDescription')
              ) {
                this.permission = true
                this.dataFilterParamIdName = element.paramDescription
                if (element.type === 2) {
                  this.placeholder = '规则匹配'
                  if (element.dataFilterParamId === '2') {
                    this.deplaceholder =
                      element.filterParams.storeCode.length > 0
                        ? '已选' + element.filterParams.storeCode.length
                        : ''
                  } else if (element.dataFilterParamId === '3') {
                    this.deplaceholder =
                      element.filterParams.regionCode.length > 0
                        ? '已选' + element.filterParams.regionCode.length
                        : ''
                  }
                } else {
                  this.placeholder = '指定值'
                  this.deplaceholder = `= ${element.paramDescription}`
                }
              } else {
                this.permission = false
              }
            })
            // this.getTreeData(object)
          }
        })
      }
     
    },
    handleNodeClick(value) {
      this.actioncities = [] // 动作
      this.actionCities = [] // 动作（选中）
      this.checkedCities = [] // 名称字段
      this.cities = [] // 名称字段（选中）
      this.tableData3 = [] // 字段权限
      if ((value.functionType === 3 || value.functionType === 4) && value.hasOwnProperty('children') === false) {
        // axios.get(`${config.url}/permissions/role/${this.id}/functionFile/${value.id}`).then(res => {
        //   if (res.data.code === 0) {
        //     this.getListData(res.data.body)
        //   }
        // })
        getSingleMenuJurisdictionData(this.id, value.id).then((res) => {
          if (res.code == 0) {
            this.getListData(res.body)
          }
        })
      } else if (value.functionType === 4) {
        // axios.get(`${config.url}/permissions/role/${this.id}/functionFile/${value.id}`).then(res => {
        //   this.functionId = value.id
        //   const data = res.data.body
        //   this.getListData(data)
        // })

        getSingleMenuJurisdictionData(this.id, value.id).then((res) => {
          if (res.code == 0) {
            this.getListData(res.body)
          }
        })
      }
    },
    getListData(data) {
      for (let index = 0; index < data.functionFields.length; index++) { // (3)
        const query = {
          name: data.functionFields[index].showName,
          id: data.functionFields[index].id
        }
        this.tableData3.push(query)
        if (data.functionFields[index].checked == 'Y') {
          this.toggleSelection(index)
        }
      }
      data.functionOperations.forEach(element => { // (2)
        const query = {
          name: element.showName,
          id: element.id
        }
        this.actioncities.push(query)
        if (element.checked == 'Y') {
          this.actionCities.push(element.id)
        }
      })

      // (1)
      data.functionQueryFields.forEach(element => {
        const query = {
          name: element.showName,
          id: element.id,
          variation: false
        }
        this.cities.push(query)
        if (element.checked == 'Y') {
          this.checkedCities.push(element.id)
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
  .neo-dialog-no-pad .el-row {
    display: flex;
    flex-wrap: wrap;
  }
  main {
    margin-top: 10px;
    padding: 15px;
    background: white;
  }
  .account-content {
    .content{
        height: calc(100vh - 150px);
        overflow-y: auto;
    }
    .operate-text {
        display: inline-block;
        margin-right: 20px;
    }
    .table {
        border-top: 1px solid rgba(144, 147, 153, 0.15);
    }
    .filter-line-container {
        display: flex;
        margin-top: 20px;
        .line {
            flex: 1;
            border-top: 1px solid rgba(235, 235, 235, 1);
        }
        .filter-text {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 118px;
            height: 22px;
            font-size: 12px;
            border: 1px solid rgba(235, 235, 235, 1);
            border-top: none;
            color: #909399;
            border-radius: 4px;
            cursor: pointer;
        }
    }
}
.aside-left {
    background: #FAFAFC;
}
/deep/.el-tree {
    background: #FAFAFC;
}
.mt-10{
    background: #fff;
}
.container{
    height: 480px;
}
.main-header{
    padding:20px;
    font-size: 13px;
    color: #FF7D00;
    background: #FFF8F2;
    span{
        color: #909399;
        margin-left: 5px;
    }
}
/deep/.el-main{
    padding: 0 0 0 10px;
}
.main-check{
    padding: 20px;
    background: #FCFCFD;
}
.titleIcon{
    border-left: 3px solid #FF7D00;
    margin-bottom: 18px;
    position: relative;
    padding-left: 10px;
}
.rule{
    border-top: 1px solid #EBEBEB;
    border-bottom: 1px solid #EBEBEB;
    padding:20px;
}
/deep/.el-form-search{
    position: relative;
    left: -137px;
    top:10px;
}
.irrelevant{
    text-align: center;
    padding-top: 200px;
}
/deep/.el-table /deep/.DisabledSelection .cell .el-checkbox__inner{
    display:none;
    position:relative;
}
/deep/.el-table /deep/.DisabledSelection .cell:before{
    content:"可见";
    position:absolute;
    right: 11px;
}
</style>
