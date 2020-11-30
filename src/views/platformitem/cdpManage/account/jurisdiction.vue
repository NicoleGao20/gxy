<template>
  <div class="neo-activity-setting-details-container">
    <el-form ref="form" :model="form" :rules="rules" label-width="130px" class="demo-ruleForm">
      <el-row class="mt-10">
        <div class="titleIcon">基础信息</div>
        <el-col :span="8">
          <el-form-item label="角色编号" prop="activityName">
            <el-input :disabled="true"    maxlength="100" v-model="id" size="small"/>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="角色名称" prop="activityName">
            <el-input :disabled="true"    maxlength="100" v-model="name" size="small"/>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="角色备注" prop="activityName">
            <el-input :disabled="true"    maxlength="200" show-word-limit  v-model="description" size="small"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row class="mt-10">
        <div class="menu-header">
          <div class="titleIcon">菜单权限</div>
          <el-button class="top-Selected ml-20" type="primary" @click="viewSelected">查看已选权限</el-button>
        </div>
        <div class="menuJurisdiction">
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
        </div>
        <el-container class="container">
          <el-aside width="300px" class="aside-left">
            <!-- 菜单权限 -->
            <el-tree
              ref="tree"
              :data="menuTree"
              :props="defaultProps"
              :default-checked-keys="checked_keys"
              :default-expanded-keys="expanded_keys"
              show-checkbox
              node-key="id"
              @node-click="Treeclick"
              @check-change="treeChange"
            />
          </el-aside>
          <el-main v-if="treeDetails">
            <el-col :span="24">
              <div class="main-header">查询条件</div>
            </el-col>

            <el-col :span="24">
              <div v-if="cities.length !== 0" class="main-check">
                <el-checkbox
                  :indeterminate="actioncitiesChange"
                  v-model="actioncitiescheckAll"
                  style="margin-right:20px;"
                  @change="handleCheckAllChange"
                >全选
                </el-checkbox>
                <el-checkbox-group v-model="checkedCities" @change="handleCheckedCitiesChange">
                  <el-checkbox
                    v-for="city in cities"
                    :label="city.id"
                    :key="city.id"
                  >{{ city.name }}
                  </el-checkbox>
                </el-checkbox-group>
              </div>
              <div v-else class="main-check">无</div>
            </el-col>
            <el-col :span="24">
              <div class="main-header">动作权限</div>
            </el-col>
            <el-col :span="24">
              <div v-if="actioncities.length !== 0" class="main-check">
                <el-checkbox
                  :indeterminate="citiesChange"
                  v-model="citiescheckAll"
                  style="margin-right:20px;"
                  @change="actionCheckAllChange"
                >全选
                </el-checkbox>
                <el-checkbox-group v-model="actionCities" @change="actionPermission">
                  <el-checkbox
                    v-for="city in actioncities"
                    :label="city.id"
                    :key="city.id"
                  >{{ city.name }}
                  </el-checkbox>
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
              :header-cell-style="{ background: '#F5F7FA' }"
              tooltip-effect="dark"
              style="width: 100%;text-align: center;"
              @selection-change="handleSelectionChange"
            >
              <el-table-column prop="name" label="字段名称" width="120"/>
              <el-table-column prop="radio2" type="selection" width="35"/>
              <el-table-column label="可见" show-overflow-tooltip/>
            </el-table>
          </el-main>
          <el-main v-else class="contcent-Tips">
            <div class="Tips">
              *当前选中一级／二级菜单，勾选当前菜单，默认选中下级菜单所有权限，
              <br>若需要单独设置，请点击具体菜单进行设置
            </div>
          </el-main>
        </el-container>
      </el-row>
      <!-- <el-row class="mt-10">
        <div class="titleIcon">数据权限</div>
        <el-col :span="24" class="rule">
          <el-col :span="7">规则名称</el-col>
          <el-col :span="7">规则类型</el-col>
          <el-col :span="10">规则条件</el-col>
        </el-col>
        <el-col :span="24" class="rule">
          <el-col :span="7">
            <el-select v-model="ruleName" placeholder="请选择" @change="selectChanged">
              <el-option
                v-for="item in ruleArr"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-col>

          <el-col v-if="ruleName == 2 || ruleName == '' " :span="7">
            <el-select v-model="ascription" placeholder="请选择">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-col>

          <el-col v-else :span="7">
            <el-select v-model="regionValue" placeholder="请选择" @change="selectGet">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-col>
          <el-col v-if="ruleName == 2 || ruleName == '' " :span="10">
            <el-row>
              <el-form-item prop="menu">
                <div class="el-form-search">
                  <el-input
                    v-if="ascription == 2 || ascription == ''"
                    :readonly="true"
                    :disabled="type === 'detail'"
                    :value="formMenu"
                    placeholder="请选择适用门店"
                    suffix-icon="el-icon-search"
                    style="width: 280px"
                    size="small"
                    class="cursor-pointer"
                    @focus="showDialog('menu')"
                  />
                  <el-input
                    v-else
                    :disabled="true"
                    placeholder=" = 所属门店"
                    suffix-icon="el-icon-search"
                    style="width: 280px"
                    size="small"
                  />
                  <span
                    v-if="ascription == 2 || ascription == ''"
                    class="ml-20 fs-13 color-primary cursor-pointer"
                    @click="showDialog('reviewStore')"
                  >查看已选</span>
                </div>
              </el-form-item>
            </el-row>
          </el-col>
          
          <el-col v-else :span="10">
            <el-form-item prop="store">
              <div class="el-form-search" style="top:0;">
                <el-input
                  v-if=" regionValue == 2 || regionValue == ''"
                  :value="formStore"
                  placeholder="请选择区域门店"
                  suffix-icon="el-icon-search"
                  style="width:300px;"
                  size="small"
                  @focus="showDialog('store')"
                />
                <el-input
                  v-else
                  :disabled="true"
                  placeholder=" = 区域门店"
                  suffix-icon="el-icon-search"
                  style="width: 280px"
                  size="small"
                />
              </div>
            </el-form-item>
          </el-col>
        </el-col>
      </el-row> -->
    </el-form>
    <div class="btns">
      <el-button class="top-operate-btn" @click="$router.back()">
        返回
      </el-button>
      <template v-if="type !== 'detail'">
        <el-button class="top-operate-btn ml-20" type="primary" @click="save">保存</el-button>
      </template>
    </div>
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
        <el-container class="container">
          <el-aside width="300px" class="aside-left">
            <el-tree :data="menuTree" :props="defaultProps" @node-click="handleNodeClick"/>
          </el-aside>
          <el-main
            v-if="dialogTreeDetails"
          >
            <el-col :span="24">
              <div class="main-header">查询条件</div>
            </el-col>
            <el-col :span="24">
              <div v-if="queryArr.length !== 0" class="main-check">
                <el-checkbox-group v-model="querySelected">
                  <el-checkbox
                    v-for="city in queryArr"
                    :label="city.id"
                    :key="city.id"
                    disabled
                  >{{ city.name }}
                  </el-checkbox>
                </el-checkbox-group>
              </div>
              <div v-else class="main-check">无</div>
            </el-col>
            <el-col :span="24">
              <div class="main-header">动作权限</div>
            </el-col>
            <el-col :span="24">
              <div v-if="actionArr.length !== 0" class="main-check">
                <el-checkbox-group v-model="actionSelected">
                  <el-checkbox
                    v-for="city in actionArr"
                    :label="city.id"
                    :key="city.id"
                    disabled
                  >{{ city.name }}
                  </el-checkbox>
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
              :data="fieldTable"
              :header-cell-style="{ background: '#F5F7FA' }"
              tooltip-effect="dark"
              style="width: 100%;text-align: center;"
            >
              <el-table-column prop="name" label="字段名称" width="120"/>
              <el-table-column
                :selectable="checkboxSelect"
                prop="radio2"
                type="selection"
                width="30"
                disabled="true"
              />
              <el-table-column label="可见" show-overflow-tooltip/>
            </el-table>
          </el-main>
          <el-main v-else class="irrelevant">
            <div>
              *当前选中一级／二级菜单，勾选当前菜单，默认选中下级菜单所有权限，
              <br>若需要单独设置，请点击具体菜单进行设置
            </div>
          </el-main>
        </el-container>
      </el-row>
      <!-- <el-row class="mt-10">
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
      </el-row> -->
    </el-dialog>
    <neo-check-select
      :source="isSelectArr"
      :showType="2"
      :readonly="type == 'detail'"
      :dialogShow.sync="reviewDialogShow"
      @save="saveIsSelect($event, 'store')"
    ></neo-check-select>
  </div>
</template>
<script>
import Cookies from 'js-cookie'
import axios from 'axios'
import config from '@/config/config'
import { V2 } from '@/api/login'
import { getPlatformList } from '@/api/homePage'
import {
  filterParamQueryList,
  permission,
  getFunction,
  getActionsAndOperationsByBatch,
  auditRejected,
  auditPass,
  functionFieldCheck,
  getSingleMenuJurisdictionData
} from '@/api/permissions'

export default {
  name: 'ActivitySettingDetails',
  // components: {
  //   "neo-check-select": CheckSelect,
  // },
  data() {
    return {
      dialogTreeDetails: false, // 控制弹框里面的菜单右侧显示
      platformList: [],
      PLATFORM_TYPE: '',
      nodeSelection: '', // 节点选择
      queryArr: [], // 搜索
      querySelected: [], // 搜索选中
      actionArr: [], // 动作
      actionSelected: [], // 动作选中
      fieldTable: [], // 字段
      placeholder: '',
      deplaceholder: '', // 已选
      permission: false, // 查看数据权限是否显示
      jurisdiction: false, // 查看权限开关
      treeDetails: false, // 控制右侧显示
      formStore: '',
      formMenu: '',
      source: [],
      dialogShowSwitch: false,
      ParentfunctionList: [], // 父级批量入参数组
      checked_keys: [], // tree默认选中
      expanded_keys: [], // tree默认展开
      NewfieldList: [], // 反选 数据权限
      NewfieldQueryList: [], // 反选 菜单权限
      Enable: true, // 所属门店是否启用
      menuTree: [], // 菜单权限Tree
      id: '', // 角色编号
      name: '', // 角色名称
      description: '', // 备注
      type: '',
      province: false, // 省市区
      ascription: '',
      ruleName: '', // 规则名称下拉框
      regionValue: '', // 区域门店下拉框
      differenceType: '',
      ruleArr: [],
      options: [{
        value: 1,
        label: '规则匹配'
      }, {
        value: 2,
        label: '指定值'
      }],
      isSelectArr: [],
      reviewDialogShow: false,
      menuVisible: false,
      value2: true, // 开关
      radio: '2', // 所属门店单选框
      actionType: false,
      actioncities: [],
      actionCities: [], // 选中
      citiesChange: true,
      citiescheckAll: false,
      checkAll: false,
      checkedCities: [], // 选中
      cities: [],
      actioncitiesChange: true,
      actioncitiescheckAll: false,
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      count: 1,
      tableData3: [],
      tableDataSelect: [],
      multipleSelection: [],
      type: '', // 操作类型
      form: {},
      rules: {},
      fileList: [],
      dialogReject: false,
      formReject: {
        reject: ''
      },
      functionList: [], // 角色功能集合(菜单权限)
      filterList: [], // 过滤条件集合
      functionId: '', // 字段id
      fieldList: [], // 功能字段集合
      fieldQueryList: [], // 功能查询字段集合
      operationList: [], // 功能操作集合
      treeNodeArr: [], // tree选中数组
      parentArr: [] // 入参需要的1级2级父级id数组
    }
  },
  created() {
    // 查询平台
    this.getPlatform()
    // this.PLATFORM_TYPE=Cookies.get('platformCode')
    this.id = this.$route.query.id
    this.name = this.$route.query.name
    this.description = this.$route.query.description
  },
  mouned() {
  },
  methods: {
    getPlatform() {
      getPlatformList().then(res => {
        if (res.code == 0) {
          if (res.body && res.body.length) {
            res.body.forEach((item) => {
              this.platformList.push({ label: item.platformName, value: item.platformCode })
            })
          }
          if (this.platformList && this.platformList.length > 0) {
            this.PLATFORM_TYPE = this.platformList[0].value
            this.getData() // 获取反选数据
            this.getRuleName() // 获取规则名称字段
            this.getTree() // 获取树结构
          }
        }
      })
    },
    filterFun(adStatus) {
      this.ruleArr = []
      this.PLATFORM_TYPE = adStatus
      this.getData() // 获取反选数据
      this.getRuleName() // 获取规则名称字段
      this.getTree()
    },
    getRuleName() {
      const data = {
        params: {}
      }
      filterParamQueryList({
        data
      }).then((res) => {
        res.body.forEach(val => {
          const data = {
            label: val.description,
            value: val.id
          }
          this.ruleArr.push(data)
        })
      })
    },
    // 获取tree数据结构
    getTree() {
      // 管理平台的platformCode
      // console.log(this.$route.params.platformCode,999)
      V2({}, this.PLATFORM_TYPE).then((res) => {
        const object = res.body
        const TreeArr = []
        object.forEach(element => {
          const father = {
            id: element.id,
            name: element.showName,
            functionType: element.functionType,
            children: []
          }
          if (element.functionList) {
            element.functionList.forEach(val => {
              const list = {
                id: val.id,
                name: val.showName,
                functionType: val.functionType,
                fatherId: element.id
              }
              if (val.hasOwnProperty('subFunctionList')) {
                list.children = []
                val.subFunctionList.forEach(value => {
                  const level = {
                    id: value.id,
                    name: value.showName,
                    functionType: value.functionType,
                    fatherId: element.id,
                    childrenid: val.id
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
      })
    },
    // 字段反选立即执行
    toggleSelection(i, type) {
      this.$nextTick(() => {
        this.$refs.multipleTable.toggleRowSelection(type[i], true)
      })
    },
    // 保存
    save() {
      this.saveData()
      let object = [], menuArr = []
      const data = {
        dataFilterParamId: this.ruleName,
        parentId: 994,
        parentType: 1,
        filterParams: {}
      }
      if (this.ruleName == '2') {
        data.type = this.ascription
        if (this.ascription == 2 && this.isSelectArr.length != 0) {
          this.isSelectArr.forEach(element => {
            object.push(element.storeCode)
          })
          data.filterParams.storeCode = object
        } else if (this.ascription == 1) {
          data.filterParams.storeCode = '[STORECODE]'
        }
      } else if (this.ruleName == '3') {
        data.type = this.regionValue
        if (this.regionValue == 2 && this.source.length != 0) {
          this.source.forEach(element => {
            object.push(element.code)
          })
          data.filterParams.regionCode = object
        } else if (this.regionValue == 1) {
          data.filterParams.regionCode = '[REGIONCODE]'
        }
      }
      if (this.ParentfunctionList.length != 0) {
        this.ParentfunctionList.forEach(item => {
          if (this.functionList.length != 0) {
            for (let index = 0; index < this.functionList.length; index++) {
              if (item.functionId != this.functionList[index].functionId) {
                if (index + 1 == this.functionList.length) {
                  this.functionList.push(item)
                }
              }
            }
          } else {
            this.functionList.push(item)
          }
        })
      }
      const hash = {}
      this.functionList = this.functionList.reduce((preVal, curVal) => {
        hash[curVal.functionId] ? '' : hash[curVal.functionId] = true && preVal.push(curVal)
        return preVal
      }, [])
      // 筛选出勾选了的入参数据
      this.functionList.forEach(value => {
        this.treeNodeArr.forEach(item => {
          if (value.functionId == item) {
            menuArr.push(value)
          }
        })
      })
      for (let index = 0; index < menuArr.length; index++) {
        if (menuArr[index].fieldList.length == 0 && menuArr[index].fieldQueryList.length == 0 && menuArr[index].operationList.length == 0) {
          menuArr.splice(index, 1)
        }
      }
      // 二级 三级 入参id
      const ParentArr = []
      this.parentArr.forEach(element => {
        if (ParentArr.indexOf(element.fatherId) == -1 && element.fatherId != undefined) {
          ParentArr.push(element.fatherId)
        }
        if (element.hasOwnProperty('id')) {
          // if (ParentArr.indexOf(element.childrenid) == -1) {
          ParentArr.push(element.id)
          // }
        }
      })
      if (ParentArr.length != 0) {
        ParentArr.forEach(element => {
          const father = {
            functionId: element
          }
          menuArr.push(father)
        })
      }
      // if (data.dataFilterParamId == '') {
      //   this.$alert('请维护角色数据权限！', '提示', {
      //     confirmButtonText: '确定'
      //   })
      //   return false
      // }
      // console.log(data, 'filterParams数据')
      // if (data.filterParams == {} && data.type == 2) {
      //   this.$alert('区域门店不能为空！', '提示', {
      //     confirmButtonText: '确定'
      //   })
      //   return false
      // }

      if (menuArr.length == 0) {
        this.$alert('请维护角色菜单权限！', '提示', {
          confirmButtonText: '确定'
        })
        return false
      }

      this.submit(data, menuArr)
    },
    sortNumber(arr) {
      arr.sort(function(a, b) {
        return a - b
      })
    },
    // 调用保存接口
    submit(data, menuArr) {
      permission({
        id: this.id,
        functionList: menuArr, // 角色功能集合
        filterList: data// 过滤条件集合
      }).then((res) => {
        if (res.code == '0') {
          this.$message({
            message: '保存成功',
            type: 'success'
          })
          this.$router.go(-1)
        }
      }).catch((error) => {
        console.log('erro', error)
      })
    },
    // 查看已选权限
    viewSelected() {
      this.dialogTreeDetails = false
      this.jurisdiction = true
      this.getSee()
      this.getTree()
    },
    getSee() {
      getFunction({
        id: this.id
      }, this.PLATFORM_TYPE).then(res => {
        if (res.code == 0) {
          const object = res.body
          if (res.body.filterList.length != 0) {
            object.filterList.forEach(element => {
              if (element.type != 0 && element.hasOwnProperty('paramDescription')) {
                this.permission = true
                this.dataFilterParamIdName = element.paramDescription
                if (element.type == 1) {
                  this.placeholder = '规则匹配'
                  this.deplaceholder = element.filterParams.storeCode.length > 0 ? '已选' + element.filterParams.storeCode.length : ''
                } else {
                  this.placeholder = '指定值'
                  this.deplaceholder = `= ${element.paramDescription}`
                }
              } else {
                this.permission = false
              }
            })
          }
        }
      })
    },
    // 查看点击tree
    handleNodeClick(value) {
      this.actionArr = [] // 动作
      this.actionSelected = [] // 动作（选中）
      this.querySelected = [] // 名称字段（选中）
      this.queryArr = [] // 名称字段
      this.fieldTable = [] // 字段权限
      console.log(value.functionType, 9999, value.hasOwnProperty('children'))
      if (value.functionType == 2 || (value.functionType == 3 && value.hasOwnProperty('children'))) {
        this.dialogTreeDetails = false
      } else {
        this.dialogTreeDetails = true
      }
      if ((value.functionType == 3 || value.functionType == 4) && value.hasOwnProperty('children') == false) {
        // axios.get(`${config.url}/permissions/role/${this.id}/functionFile/${value.id}`).then(res => {
        //   if (res.data.code == 0) {
        //     this.getSeeListData(res.data.body)
        //   }
        // })
        console.log('909090+')
        getSingleMenuJurisdictionData(this.id, value.id).then((res) => {
          if (res.code == 0) {
            this.getSeeListData(res.body)
          }
        })
      } else if (value.functionType == 4) {
        // axios.get(`${config.url}/permissions/role/${this.id}/functionFile/${value.id}`).then(res => {
        //   if (res.data.code == 0) {
        //     this.functionId = value.id
        //     this.getSeeListData(res.data.body)
        //   }
        // })
        console.log('909090')
        getSingleMenuJurisdictionData(this.id, value.id).then((res) => {
          if (res.code == 0) {
            this.getSeeListData(res.body)
          }
        })
      }
    },
    checkboxSelect(row, index) {
    },
    // 归类（查看已选权限）
    getSeeListData(data) {
      for (let index = 0; index < data.functionFields.length; index++) { // (3)
        const query = {
          name: data.functionFields[index].showName,
          id: data.functionFields[index].id
        }
        this.fieldTable.push(query)
        if (data.functionFields[index].checked == 'Y') {
          this.toggleSelection(index, this.fieldTable)
        }
      }
      data.functionOperations.forEach(element => { // (2)
        const query = {
          name: element.showName,
          id: element.id
        }
        this.actionArr.push(query)
        if (element.checked == 'Y') {
          this.actionSelected.push(element.id)
        }
      })
      // (1)
      data.functionQueryFields.forEach(element => {
        const query = {
          name: element.showName,
          id: element.id,
          variation: false
        }
        this.queryArr.push(query)
        if (element.checked == 'Y') {
          this.querySelected.push(element.id)
        }
      })
    },
    // 准备 保存入参
    saveData() {
      if (this.checkedCities.length != 0) { // 条件查询（1）
        this.checkedCities.forEach(value => {
          const data = {
            fieldId: value,
            rules: '0000010111'
          }
          this.fieldQueryList.push(data)
        })
      }

      if (this.actionCities.length != 0) { // 动作权限（2）
        this.actionCities.forEach(val => {
          const data = {
            operationId: val
          }
          this.operationList.push(data)
        })
      }

      if (this.tableDataSelect.length != 0) { // (3) 字段权限
        this.tableDataSelect.forEach(val => {
          const data = {
            fieldId: val.id,
            rules: '0000001111'
          }
          this.fieldList.push(data)
        })
      }
      // const SelectArr = {
      //   functionId: this.functionId,
      //   fieldList: this.fieldList,
      //   fieldQueryList: this.fieldQueryList,
      //   operationList: this.operationList
      // }
      const SelectArr = {
        functionId: this.functionId,
        fieldList: [],
        fieldQueryList: [],
        operationList: []
      }
      if (this.fieldList.length != 0 || this.fieldQueryList.length != 0 || this.operationList.length != 0) {
        if (this.functionList.length == 0) {
          this.functionList.push(SelectArr)
        } else {
          for (let index = 0; index < this.functionList.length; index++) {
            if (this.functionList[index].functionId == this.functionId) {
              this.functionList[index] = SelectArr
            } else {
              if (index + 1 == this.functionList.length) {
                this.functionList.push(SelectArr)
              }
            }
          }
        }
      }
      this.fieldList = []
      this.fieldQueryList = []
      this.operationList = []
    },
    getData() {
      const that = this
      getFunction({
        id: this.id
      }, this.PLATFORM_TYPE).then((res) => {
        if (res.code == 0) {
          let object = res.body, Effective = []
          object.functionGroupList.forEach(item => {
            if (item.checked == 'Y') {
              // Effective.push(item.id)
            }
            if (item.functionList) {
              item.functionList.forEach(val => {
                if (val.hasOwnProperty('subFunctionList') && val.subFunctionList.length != 0) {
                  val.subFunctionList.forEach(value => {
                    if (value.checked == 'Y') {
                      Effective.push(value.id)
                      const objectList = {
                        id: value.id,
                        fatherId: item.id,
                        childrenid: value.parentId
                      }
                      this.parentArr.push(objectList)
                    }
                  })
                } else {
                  if (val.checked == 'Y') {
                    Effective.push(val.id)
                    const objectList = {
                      id: val.id,
                      fatherId: val.parentId
                    }
                    this.parentArr.push(objectList)
                  }
                }
              })
            }
          })
          this.NewfieldQueryList = Effective // 获取左侧树形选中数组点亮
          this.getDetailedData(this.NewfieldQueryList) // 根据点亮数组 获取详细数据并存入保存入参
          this.NewfieldQueryList.forEach(val => {
            this.$nextTick(() => {
              this.treeNodeArr.push(val)
              this.checked_keys.push(val)
              this.expanded_keys.push(val)
            })
          })
          this.checked_keys = []
          if (object.filterList.length != 0) {
            object.filterList.forEach(element => {
              if (element.type == 2) {
                if (element.dataFilterParamId == '2') {
                  this.ruleName = element.dataFilterParamId
                  this.ascription = 2
                  this.isSelectArr = object.stores
                  this.formMenu = element.filterParams.storeCode.length > 0 ? '已选' + element.filterParams.storeCode.length : ''
                } else if (element.dataFilterParamId == '3') {
                  this.ruleName = element.dataFilterParamId
                  this.regionValue = 2
                  this.formStore = element.filterParams.regionCode.length > 0 ? '已选' + element.filterParams.regionCode.length : ''
                  this.source = object.regions
                }
              } else if (element.type == 1) {
                this.ruleName = element.dataFilterParamId
                this.ascription = 1
                this.regionValue = 1
              }
            })
          }
        }
      })
    },
    getDetailedData(object) {
      const data = {
        body: object
      }
      functionFieldCheck(data, this.id).then(res => {
        if (res.code == 0) {
          const valData = res.body
          valData.forEach(val => {
            if (val.hasOwnProperty('functionQueryFields')) {
              val.functionQueryFields.forEach(item => {
                if (item.checked == 'Y') {
                  const data = {
                    fieldId: item.id,
                    rules: '0000010111'
                  }
                  this.fieldQueryList.push(data)
                }
              })
            }
            if (val.hasOwnProperty('functionOperations')) {
              val.functionOperations.forEach(item => {
                if (item.checked == 'Y') {
                  const data = {
                    operationId: item.id
                  }
                  this.operationList.push(data)
                }
              })
            }
            if (val.hasOwnProperty('functionFields')) {
              val.functionFields.forEach(item => {
                if (item.checked == 'Y') {
                  const data = {
                    fieldId: item.id,
                    rules: '0000001111'
                  }
                  this.fieldList.push(data)
                }
              })
            }
            const SelectArr = {
              functionId: val.id,
              fieldList: this.fieldList,
              fieldQueryList: this.fieldQueryList,
              operationList: this.operationList
            }
            this.functionList.push(SelectArr)
            this.fieldList = []
            this.fieldQueryList = []
            this.operationList = []
          })
        }
      })
    },
    selectGet(vId) {
      let obj = {}
      obj = this.options.find((item) => { // 这里的userList就是上面遍历的数据源
        return item.value === vId // 筛选出匹配数据
      })
    },
    // 树节点点击
    Treeclick(value) {
      console.log(value)
      this.saveData()
      this.actioncitiescheckAll = false
      this.citiescheckAll = false
      this.actioncitiesChange = false
      this.citiesChange = false
      this.actioncities = [] // 动作
      this.actionCities = [] // 动作（选中）
      this.checkedCities = [] // 名称字段
      this.cities = [] // 名称字段（选中）
      this.tableData3 = [] // 字段权限
      if ((value.functionType == 3 && !value.hasOwnProperty('children')) || (value.functionType == 4 && !value.hasOwnProperty('children'))) {
        this.nodeSelection = value.id
      }
      if (value.functionType == 2 || (value.functionType == 3 && value.hasOwnProperty('children'))) {
        this.treeDetails = false
      } else {
        this.treeDetails = true
      }
      if ((value.functionType == 3 || value.functionType == 4) && value.hasOwnProperty('children') == false) {
        //  axios.get(`${config.url}/permissions/role/${this.id}/functionFile/${value.id}`).
        getSingleMenuJurisdictionData(this.id, value.id).then(res => {
          this.functionId = value.id
          let data = res.body, checkedCitiesData = [], actionCitiesData = []
          this.getListData(data)
          // 父级批量选中
          const hash = {}
          this.ParentfunctionList = this.ParentfunctionList.reduce((preVal, curVal) => {
            hash[curVal.functionId] ? '' : hash[curVal.functionId] = true && preVal.push(curVal)
            return preVal
          }, [])
          // 判断接口反选是否存在已选
          if (this.checkedCities.length == 0 && this.actionCities.length == 0) {
            // 正选 批量显示
            if (this.ParentfunctionList.length != 0) {
              this.ParentfunctionList.forEach(val => {
                if (this.functionId == val.functionId) {
                  data.functionQueryFields.forEach(element => { // (1) 查询权限
                    val.fieldQueryList.forEach(fie => {
                      if (element.id == fie.fieldId) {
                        this.checkedCities.push(element.id)
                      }
                    })
                  })
                  data.functionOperations.forEach(value => { // (2) 动作权限
                    val.operationList.forEach(oper => {
                      if (value.id == oper.operationId) {
                        this.actionCities.push(value.id)
                      }
                    })
                  })
                  // (3) 字段权限
                  for (let i = 0; i < data.functionFields.length; i++) {
                    val.fieldList.forEach(field => {
                      if (data.functionFields[i].id == field.fieldId) {
                        this.toggleSelection(i, this.tableData3)
                      }
                    })
                  }
                  // 全选点亮
                  this.actioncitiescheckAll = this.checkedCities.length == this.cities.length
                  this.actioncitiesChange = this.checkedCities.length > 0 && this.checkedCities.length < this.cities.length
                  this.citiescheckAll = this.actionCities.length === this.actioncities.length
                  this.citiesChange = this.actionCities.length > 0 && this.actionCities.length < this.actioncities.length
                }
              })
            }
          }
        })
      } else if (value.functionType == 4) {
        axios.get(`${config.url}/permissions/role/${this.id}/functionFile/${value.id}`).then(res => {
          this.functionId = value.id
          const data = res.data.body
          this.getListData(data)
        })
        // 查询单个菜单的数据权限
        getSingleMenuJurisdictionData(this.id, value.id).then(res => {
          this.functionId = value.id
          const data = res.data.body
          this.getListData(data)
        })
      }
    },
    // 获取详细权限数据
    getListData(data) {
      let checkedCitiesData = [], actionCitiesData = []
      for (let index = 0; index < data.functionFields.length; index++) { // (3)
        const query = {
          name: data.functionFields[index].showName,
          id: data.functionFields[index].id
        }
        this.tableData3.push(query)
        if (data.functionFields[index].checked == 'Y') {
          this.toggleSelection(index, this.tableData3)
        }
      }
      data.functionOperations.forEach(element => { // (2)
        const query = {
          name: element.showName,
          id: element.id
        }
        this.actioncities.push(query)
        if (element.checked == 'Y' && this.actionCities.indexOf(element.id) == -1) {
          // actionCitiesData.push(element.id)
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
        if (element.checked == 'Y' && this.checkedCities.indexOf(element.id) == -1) {
          this.checkedCities.push(element.id)
        }
      })
      this.actioncitiescheckAll = this.checkedCities.length == this.cities.length
      this.actioncitiesChange = this.checkedCities.length > 0 && this.checkedCities.length < this.cities.length
      this.citiescheckAll = this.actionCities.length === this.actioncities.length
      this.citiesChange = this.actionCities.length > 0 && this.actionCities.length < this.actioncities.length
    },
    // tree 勾选 组 [选中勾选框 存在勾中但是没有出现在treeNodeArr数组中]
    treeChange(data, checked, indeterminate) {
      console.log(data, checked, indeterminate)
      if (((data.functionType == 3 && !data.hasOwnProperty('children')) || (data.functionType == 4 && !data.hasOwnProperty('children'))) && checked) {
        if (this.nodeSelection == data.id) {
          this.checkedCities = []
          this.actionCities = []
          if (this.cities.length != 0) {
            this.cities.forEach(val => {
              this.checkedCities.push(val.id)
            })
          }
          if (this.actioncities.length != 0) {
            this.actioncities.forEach(value => {
              this.actionCities.push(value.id)
            })
          }
          if (this.tableData3.length != 0) {
            for (let index = 0; index < this.tableData3.length; index++) {
              this.toggleSelection(index, this.tableData3)
            }
          }
          this.actioncitiescheckAll = this.checkedCities.length == this.cities.length
          this.actioncitiesChange = this.checkedCities.length > 0 && this.checkedCities.length < this.cities.length
          this.citiescheckAll = this.actionCities.length === this.actioncities.length
          this.citiesChange = this.actionCities.length > 0 && this.actionCities.length < this.actioncities.length
        }
      }
      if (data.functionType == 2 || (data.functionType == 3 && data.hasOwnProperty('children'))) {
        this.getBatch(data, checked, indeterminate)
      }
      // else {
      if (checked == true) {
        if (data.hasOwnProperty('children') && data.children.length != 0) {
          data.children.forEach(chi => {
            if (chi.hasOwnProperty('children')) {
              chi.children.forEach(element => {
                if (this.treeNodeArr.indexOf(element.id) == -1) {
                  this.treeNodeArr.push(element.id)
                  const data = {
                    id: element.id,
                    fatherId: element.fatherId,
                    childrenid: element.childrenid
                  }
                  this.parentArr.push(data) // 一级父级id
                }
              })
            } else {
              if (this.treeNodeArr.indexOf(chi.id) == -1) {
                this.treeNodeArr.push(chi.id)
                const datalist = {
                  id: chi.id
                }
                if (chi.hasOwnProperty('childrenid')) {
                  datalist.childrenid = chi.childrenid
                }
                if (chi.fatherId != undefined) {
                  datalist.fatherId = chi.fatherId
                  this.parentArr.push(datalist)
                }
              }
            }
          })
        }
        if (this.treeNodeArr.indexOf(data.id) == -1) {
          this.treeNodeArr.push(data.id)
        }
        if (this.parentArr.indexOf(data.id) == -1) {
          const object = {
            id: data.id
          }
          if (data.hasOwnProperty('childrenid')) {
            object.childrenid = data.childrenid
          }
          if (data.fatherId != undefined) {
            object.fatherId = data.fatherId
            this.parentArr.push(object)
          }
        }
        const hash = {}
        this.parentArr = this.parentArr.reduce((preVal, curVal) => {
          hash[curVal.id] ? '' : hash[curVal.id] = true && preVal.push(curVal)
          return preVal
        }, [])
        this.selectAll(data) // 批量 单选
      } else if (indeterminate == false) {
        if (data.hasOwnProperty('children') && data.children.length != 0) {
          for (let i = 0; i <= this.treeNodeArr.length; i++) {
            data.children.forEach(val => {
              if (val.hasOwnProperty('children')) {
                val.children.forEach(children => {
                  if (this.treeNodeArr[i] == children.id) {
                    this.treeNodeArr.splice(i, 1)
                  }
                  if (this.treeNodeArr[i] == data.id) {
                    this.treeNodeArr.splice(i, 1)
                  }
                })
              } else {
                if (this.treeNodeArr[i] == val.id) {
                  this.treeNodeArr.splice(i, 1)
                }
                if (this.treeNodeArr[i] == data.id) {
                  this.treeNodeArr.splice(i, 1)
                }
              }
            })
          }
          for (let i = 0; i <= this.parentArr.length; i++) {
            data.children.forEach((val, index) => {
              if (val.hasOwnProperty('children')) {
                val.children.forEach(children => {
                  if (children != undefined) {
                    if (this.parentArr[i].id == children.id) {
                      this.parentArr.splice(i, 1)
                    }
                    if (this.parentArr[i].id == val.id) {
                      this.parentArr.splice(i, 1)
                    }
                  }
                })
              } else {
                if (val != undefined) {
                  if (this.parentArr[i].id == data.id) {
                    this.parentArr.splice(i, 1)
                  }
                  if (this.parentArr[i].id == val.id) {
                    this.parentArr.splice(i, 1)
                  }
                }
              }
            })
          }
        } else {
          for (let i = 0; i <= this.treeNodeArr.length; i++) {
            if (this.treeNodeArr[i] == data.id) {
              this.treeNodeArr.splice(i, 1)
            }
          }
          for (let i = 0; i <= this.parentArr.length; i++) {
            if (this.parentArr[i].id == data.id) {
              this.parentArr.splice(i, 1)
            }
          }
        }
      } else if (indeterminate == true) {
        for (let i = 0; i <= this.parentArr.length; i++) {
          if (this.parentArr[i] != undefined) {
            if (this.parentArr[i].id == data.id) {
              this.parentArr.splice(i, 1)
            }
          }
        }
      }
      // }
    },
    selectAll(data) {
      let fieldList = [], fieldQueryList = [], operationList = []
      getActionsAndOperationsByBatch([data.id]).then((res) => {
        if (res.code == 0) {
          res.body.forEach(element => {
            if (element.hasOwnProperty('functionQueryFields')) {
              element.functionQueryFields.forEach(threeObject => { // (1)
                const hasData = {
                  fieldId: threeObject.id,
                  rules: '0000010111'
                }
                fieldQueryList.push(hasData)
              })
            }
            if (element.hasOwnProperty('functionOperations')) {
              element.functionOperations.forEach(twoObject => { // (2)
                const hasData = {
                  operationId: twoObject.id
                }
                operationList.push(hasData)
              })
            }
            if (element.hasOwnProperty('functionFields')) {
              element.functionFields.forEach(oneObject => { // (3)
                const hasData = {
                  fieldId: oneObject.id,
                  rules: '0000001111'
                }
                fieldList.push(hasData)
              })
            }
            let functionListArr = {
              fieldList: fieldList,
              operationList: operationList,
              fieldQueryList: fieldQueryList,
              functionId: element.id
            }
            this.ParentfunctionList.push(functionListArr)
            fieldList = null, fieldQueryList = null, operationList = null, functionListArr = null
          })
        }
      })
    },
    selectCancel(data) {
      const batchData = []
      data.children.forEach(item => {
        if (item.hasOwnProperty('children')) {
          item.children.forEach(value => {
            batchData.push(value.id)
          })
        } else {
          batchData.push(item.id)
        }
        if (this.ParentfunctionList.length != 0) {
          batchData.forEach(item => {
            for (let index = 0; index < this.ParentfunctionList.length; index++) {
              if (item == this.ParentfunctionList[index].functionId) {
                this.ParentfunctionList.splice(index, 1)
              }
            }
          })
        }
      })
    },
    // 批量获取
    getBatch(data, checked, indeterminate) {
      let batchData = [], fieldList = [], fieldQueryList = [], operationList = []
      if (data.hasOwnProperty('children') && data.children.length != 0 && checked && indeterminate == false) {
        if (data.functionType == 2) {
          data.children.forEach(item => {
            if (item.hasOwnProperty('children')) {
              item.children.forEach(children => {
                batchData.push(children.id)
              })
            } else {
              batchData.push(item.id)
            }
          })
        } else {
          data.children.forEach(item => {
            batchData.push(item.id)
          })
        }
        getActionsAndOperationsByBatch(batchData).then((res) => {
          if (res.code == 0) {
            const object = res.body
            object.forEach(element => {
              if (element.hasOwnProperty('functionFields') || element.hasOwnProperty('functionOperations') || element.hasOwnProperty('functionQueryFields')) {
                if (element.hasOwnProperty('functionQueryFields')) {
                  element.functionQueryFields.forEach(threeObject => { // (1)
                    const hasData = {
                      fieldId: threeObject.id,
                      rules: '0000010111'
                    }
                    fieldQueryList.push(hasData)
                  })
                }
                if (element.hasOwnProperty('functionOperations')) {
                  element.functionOperations.forEach(twoObject => { // (2)
                    const hasData = {
                      operationId: twoObject.id
                    }
                    operationList.push(hasData)
                  })
                }
                if (element.hasOwnProperty('functionFields')) {
                  element.functionFields.forEach(oneObject => { // (3)
                    const hasData = {
                      fieldId: oneObject.id,
                      rules: '0000001111'
                    }
                    fieldList.push(hasData)
                  })
                }
                let functionListArr = {
                  fieldList: fieldList,
                  operationList: operationList,
                  fieldQueryList: fieldQueryList,
                  functionId: element.id
                }
                console.log(functionListArr)
                this.ParentfunctionList.push(functionListArr)
                fieldList = null, fieldQueryList = null, operationList = null, functionListArr = null
              }
              let functionListArr = {
                fieldList: [],
                operationList: [],
                fieldQueryList: [],
                functionId: element.id
              }
              this.ParentfunctionList.push(functionListArr)
              fieldList = null, fieldQueryList = null, operationList = null, functionListArr = null
            })
          }
        })
      } else if (checked == false && data.hasOwnProperty('children') && data.children.length != 0 && indeterminate == false) {
        data.children.forEach(item => {
          if (item.hasOwnProperty('children')) {
            item.children.forEach(value => {
              batchData.push(value.id)
            })
          } else {
            batchData.push(item.id)
          }
          batchData.push(data.id)
          if (this.ParentfunctionList.length != 0) {
            batchData.forEach(item => {
              for (let index = 0; index < this.ParentfunctionList.length; index++) { // functionId
                if (item == this.ParentfunctionList[index].functionId) {
                  this.ParentfunctionList.splice(index, 1)
                }
              }
            })
          }
        })
      }
    },
    // 所属门店change事件
    selectChanged(value) {
      if (value == 2) {
        this.isSelectArr = []
        this.regionValue = ''
        this.form.store = ''
      } else if (value == 3) {
        this.source = []
        this.ascription = ''
        this.formMenu = ''
      }
    },
    // 查询全选
    handleCheckAllChange(val) {
      const checkedArr = []
      this.cities.forEach(element => {
        checkedArr.push(element.id)
      })
      this.checkedCities = val ? checkedArr : []
      this.actioncitiesChange = false
    },
    handleCheckedCitiesChange(value) {
      const checkedCount = value.length
      this.actioncitiescheckAll = checkedCount == this.cities.length
      this.actioncitiesChange = checkedCount > 0 && checkedCount < this.cities.length
    },
    // 动作全选
    actionCheckAllChange(val) {
      const citieskedArr = []
      this.actioncities.forEach(element => {
        citieskedArr.push(element.id)
      })
      this.actionCities = val ? citieskedArr : []
      this.citiesChange = false
    },
    actionPermission(value) {
      const checkedCount = value.length
      this.citiescheckAll = checkedCount === this.actioncities.length
      this.citiesChange = checkedCount > 0 && checkedCount < this.actioncities.length
    },
    selectItem(item, index) {
      const flag = this.tableData3.every(el => {
        return el.type === item.type
      })
      this.tableData3Form[item.type] = flag
    },
    showDialog(type) {
      if (type === 'menu') {
        this.menuVisible = true
      } else if (type === 'store') {
        this.dialogShowSwitch = true
      } else if (type === 'reviewStore') {
        this.reviewDialogShow = true
      }
    },
    saveIsSelect(info, type) {
      if (type === 'menu') {
        this.menuVisible = false
        this.selectMenu = info
        this.formMenu = info.name
      } else {
        this.isSelectArr = info
        this.formMenu = this.isSelectArr.length > 0 ? '已选' + this.isSelectArr.length : ''
      }
    },
    saveIsSelectSwitch(products) {
      this.source = products
      this.formStore = this.source.length > 0 ? '已选' + this.source.length : ''
    },
    checkDisabled() {
      return this.type === 'detail' || this.type === 'audit'
    },

    rejectSubmitFun() {
      this.$nextTick(() => {
        this.$refs['formReject'].validate((valid) => {
          if (valid) {
            auditRejected({
              id: this.id,
              rejectReason: this.formReject.reject
            }).then(res => {
              this.$message({
                message: '审核已驳回！',
                type: 'success'
              })
              this.$router.go(-1)
            })
          } else {
            return false
          }
        })
      })
    },
    handlePass() {
      // 通过
      this.$confirm('确定审核通过？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        confirmButtonClass: 'warning'
      }).then(() => {
        auditPass({
          id: this.id
        }).then(res => {
          this.$message({
            message: '审核已通过！',
            type: 'success'
          })
          this.$router.go(-1)
        })
      }).catch(() => {
      })
    },
    handleSelectionChange(val) {
      this.tableDataSelect = val
    }
  }
}
</script>
<style lang="less" scoped>
.neo-activity-setting-details-container {
  width: 100%;

  .top-operate-btn {
    width: 80px;
    height: 30px;
    line-height: 30px;
    padding: 0;
    font-size: 13px;

    &.danger {
      background-color: getColor(danger);
      border-color: getColor(danger);
    }
  }

  .top-Selected {
    width: 100px;
    height: 30px;
    line-height: 30px;
    padding: 0;
    font-size: 13px;

    &.danger {
      background-color: getColor(danger);
      border-color: getColor(danger);
    }
  }

  .contentTree {
    padding: 40px;
    margin-bottom: 20px;
    min-height: 400px;
    max-height: calc(100vh - 175px);
    overflow-y: auto;
    background-color: #FAFAFA;
  }

  .content {
    margin-bottom: 20px;
    min-height: 400px;
    max-height: calc(100vh - 175px);
    overflow-y: auto;
    background-color: #FAFAFA;

    .titleIcon {
      margin-bottom: 20px;
      position: relative;
      padding-left: 10px;
    }

    .titleIcon:before {
      content: " ";
      position: absolute;
      top: 2px;
      left: 0;
      width: 2px;
      height: 13px;
      background-color: getColor(primary);
      border: 1px solid getColor(primary);
      border-radius: 5px;;
    }

    .line {
      width: 100%;
      border-top: 1px solid rgba(235, 235, 235, 1);
    }

    .dialog-content {
      padding: 20px;
    }

    .ico-location {
      width: 12px;
    }

    .width130 {
      width: 130px;
    }

    .tips {
      width: 200px;
      margin-left: 20px;
      line-height: 1.5;
    }

    .coupon-item {
      margin-bottom: 20px;

      .top-info {
        padding: 20px;
        background-color: #FFF6F3;
      }

      .coupon-content {
        padding: 20px 30px;
        background-color: #FCFBFF;
      }
    }
  }

  .menu-header {
    display: flex;
    justify-content: space-between;
  }

  .aside-left {
    background: #FAFAFC;
  }

  /deep/ .el-tree {
    background: #FAFAFC;
  }

  .mt-10 {
    padding: 20px;
    background: #fff;
  }

  .search-input {
    width: 280px;
  }

  .main-header {
    padding: 20px 12px;
    font-size: 12px;
    color: #FF7D00;
    background: #FFF8F2;

    span {
      color: #909399;
      margin-left: 5px;
      font-size: 13px;
    }
  }

  /deep/ .el-main {
    padding: 0 0 0 10px;
  }

  .main-check {
    display: flex;
    padding: 20px;
    background: #FCFCFD;
  }

  .rule {
    border-top: 1px solid #EBEBEB;
    border-bottom: 1px solid #EBEBEB;
    padding: 20px;
  }

  .span {
    color: #FF7D00;
    margin-left: 10px;
  }

  .shop {
    width: 400px;
  }

  /deep/ .el-form-search {
    position: relative;
    left: -137px;
    top: 0;
  }

  .justify-content-Key {
    display: flex;
    justify-content: space-between;
  }

  /deep/ .el-tree-node:focus > .el-tree-node__content {
    background-color: #3274e6;
    color: #fff;
  }

  .contcent-Tips {
    display: flex;
    justify-content: center;
    align-items: center;

    .Tips {
      text-align: center;
      color: #909399;
    }
  }

  .container {
    height: 480px;
  }

  .irrelevant {
    display: flex;
    justify-content: center;
    align-items: center;

    div {
      text-align: center;
    }
  }

  .btns {
    position: fixed;
    bottom: 0;
    left: 200px;
    right: 0;
    line-height: 50px;
    // height: 50px;
    background: white;
    text-align: center;
    z-index: 999;
  }

  .menuJurisdiction {
    // margin: 15px 0;
    // padding: 15px 20px;
    background-color: #fff;

    .chartTabCards {
      margin: 20px 0;
    }

    .filter-btns ul li {
      text-align: center;
      min-width: 100px;
    }

    .newCrmCharts {
      margin-bottom: 15px;
      background-color: #fff;

      .charts1 {
        margin-bottom: 15px;
        border: 1px solid #EDEDED;

        .crmTitle {
          position: relative;
          height: 38px;
          line-height: 38px;
          padding-left: 32px;
          color: #5e5959;

          &:before {
            content: "";
            position: absolute;
            top: 14px;
            left: 14px;
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: #bdb5b5;
          }
        }
      }

      #pieChart, #lineBarChart {
        height: 300px;
      }
    }
  }
}

.titleIcon {
  font-size: 15px;
  position: relative;
  // left: 6px;
  padding-left: 10px;
  margin-bottom: 15px;

  &::after {
    content: "";
    position: absolute;
    top: 5%;
    left: 1px;
    width: 3px;
    height: 90%;
    background: #435a82;

  }
}
</style>
